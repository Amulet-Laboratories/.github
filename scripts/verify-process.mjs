#!/usr/bin/env node
/* eslint-disable no-console -- a CLI reporter; printing is the job */
/**
 * Assert the claims the process documents make about the system.
 *
 * On 2026-08-02 three documented steps described something other than what the
 * system does — a `netlify.toml` block that was said to control whether branches
 * build (it only configures builds that were already off), a staging URL that has
 * never existed, and an operator task to cut branch-deploy waste that was never
 * being spent. None was careless. Writing a step down simply feels like verifying
 * it, and prose has nothing that fails.
 *
 * So the load-bearing claims run. Each one names the document it backs, so a
 * failure says which sentence is now a lie rather than just that something moved.
 *
 * Three outcomes, and the third is the point:
 *
 *   PASS      the claim holds
 *   FAIL      the claim is false — the document is wrong, or the system drifted
 *   UNKNOWN   it could not be checked (no credential). Reported loudly and never
 *             counted as a pass, because silence must not read as confirmation.
 *
 * Exits non-zero only on FAIL. UNKNOWN is a gap in coverage, not a defect, and
 * blocking a release on a missing token would teach everyone to skip the check.
 */

const ORG = 'Amulet-Laboratories'

/** Repos on the release train — the ones that deploy or publish. */
const TRAIN_REPOS = ['QuizSort.com', 'Rig']

const results = []
const record = (state, claim, detail, doc) => results.push({ state, claim, detail, doc })

async function gh(path) {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN
  if (!token) return { unknown: 'no GH_TOKEN' }
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { authorization: `Bearer ${token}`, accept: 'application/vnd.github+json' },
  })
  if (!res.ok) return { unknown: `GET ${path} -> ${res.status}` }
  return { data: await res.json() }
}

async function netlify(path) {
  const token = process.env.NETLIFY_AUTH_TOKEN
  if (!token) return { unknown: 'no NETLIFY_AUTH_TOKEN' }
  const res = await fetch(`https://api.netlify.com/api/v1${path}`, {
    headers: { authorization: `Bearer ${token}` },
  })
  if (!res.ok) return { unknown: `GET ${path} -> ${res.status}` }
  return { data: await res.json() }
}

// ── 1. Scheduled workflows only fire from the default branch ────────────────
//
// RELEASE-PROCESS.md, "Wiring a repo up": leave the default as `main` with the
// caller on `develop` and the cron never runs, and nothing reports it.
for (const repo of TRAIN_REPOS) {
  const { data, unknown } = await gh(`/repos/${ORG}/${repo}`)
  const doc = 'RELEASE-PROCESS.md § Wiring a repo up'
  if (unknown) record('UNKNOWN', `${repo}: default branch is develop`, unknown, doc)
  else if (data.default_branch === 'develop') record('PASS', `${repo}: default branch is develop`, '', doc)
  else
    record(
      'FAIL',
      `${repo}: default branch is develop`,
      `default_branch is "${data.default_branch}" — the release train's cron will never fire`,
      doc,
    )
}

// ── 2. The train exists and is active ───────────────────────────────────────
for (const repo of TRAIN_REPOS) {
  const { data, unknown } = await gh(`/repos/${ORG}/${repo}/actions/workflows`)
  const doc = 'RELEASE-PROCESS.md § Wiring a repo up'
  const claim = `${repo}: release train registered and active`
  if (unknown) record('UNKNOWN', claim, unknown, doc)
  else {
    const wf = (data.workflows ?? []).find((w) => w.name === 'Release train')
    if (!wf) record('FAIL', claim, 'no workflow named "Release train" — is the caller on the default branch?', doc)
    else if (wf.state !== 'active') record('FAIL', claim, `state is "${wf.state}"`, doc)
    else record('PASS', claim, '', doc)
  }
}

// ── 3. Actions may open pull requests ───────────────────────────────────────
//
// The org forbade this until 2026-08-02, and a repo cannot override it. Without
// it the train runs, finds the commits, and fails on the last step.
{
  const { data, unknown } = await gh(`/orgs/${ORG}/actions/permissions/workflow`)
  const doc = 'open-items.md § 7d'
  const claim = 'org permits Actions to create pull requests'
  if (unknown) record('UNKNOWN', claim, `${unknown} (needs admin:org)`, doc)
  else if (data.can_approve_pull_request_reviews) record('PASS', claim, '', doc)
  else record('FAIL', claim, 'can_approve_pull_request_reviews is false — the train cannot open its PR', doc)
}

// ── 4. Netlify builds main, and never develop ───────────────────────────────
//
// The claim that bit hardest. `develop` must stay OUT of allowed_branches:
// adding it creates a build on every merge to develop, which is the opposite of
// why the cadence exists. And there is no staging URL precisely because of this.
{
  const doc = 'RELEASE-PROCESS.md § The flow, § Operator steps 1'
  const { data, unknown } = await netlify('/sites')
  if (unknown) {
    record('UNKNOWN', 'Netlify: allowed_branches is ["main"] on every site', unknown, doc)
    record('UNKNOWN', 'Netlify: develop is not an allowed branch (no staging site)', unknown, doc)
  } else {
    const bad = []
    const withDevelop = []
    for (const site of data) {
      const allowed = site.build_settings?.allowed_branches
      if (!Array.isArray(allowed) || allowed.length !== 1 || allowed[0] !== 'main')
        bad.push(`${site.name}=${JSON.stringify(allowed)}`)
      if (Array.isArray(allowed) && allowed.includes('develop')) withDevelop.push(site.name)
    }
    record(
      bad.length ? 'FAIL' : 'PASS',
      'Netlify: allowed_branches is ["main"] on every site',
      bad.join(' · '),
      doc,
    )
    record(
      withDevelop.length ? 'FAIL' : 'PASS',
      'Netlify: develop is not an allowed branch (no staging site)',
      withDevelop.length ? `${withDevelop.join(', ')} would build on every merge to develop` : '',
      doc,
    )
  }
}

// ── Report ──────────────────────────────────────────────────────────────────
const icon = { PASS: '✓', FAIL: '✗', UNKNOWN: '?' }
const lines = results.map(
  (r) => `${icon[r.state]} ${r.claim}${r.detail ? `\n     ${r.detail}` : ''}\n     ↳ ${r.doc}`,
)
console.log(lines.join('\n'))

const failed = results.filter((r) => r.state === 'FAIL')
const unknown = results.filter((r) => r.state === 'UNKNOWN')
console.log(
  `\n${results.filter((r) => r.state === 'PASS').length} held · ${failed.length} false · ${unknown.length} unverifiable`,
)

if (unknown.length) {
  console.log(
    '\n!! Unverifiable claims are NOT passes. Each is a sentence in a process\n' +
      '!! document that nothing is currently checking.',
  )
}

// A machine-readable tally, so a caller can report the shape of the result rather
// than only its pass/fail. Printed on every run: a status that appears only when
// something is wrong is a status nobody learns to read.
console.log(
  `CLAIMS_TALLY held=${results.filter((r) => r.state === 'PASS').length} ` +
    `false=${failed.length} unknown=${unknown.length}`,
)

if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import('node:fs')
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `## Process claims\n\n${results
      .map((r) => `- ${icon[r.state]} **${r.claim}**${r.detail ? ` — ${r.detail}` : ''}  \n  \`${r.doc}\``)
      .join('\n')}\n`,
  )
}

if (failed.length) {
  console.error(
    `\nA process document is now wrong. Fix the document or the system — but do not\nleave a claim standing that has been shown false.`,
  )
  process.exit(1)
}
