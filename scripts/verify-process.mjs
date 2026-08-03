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

/**
 * Steps the site gate is required to run.
 *
 * `pnpm build` was deleted from site-ci.yml on 2026-07-23, in the same diff that
 * added the spin-tell lint. Nothing said so: the workflow's own header went on
 * describing a "lint + build gate" for eleven days, and because the MDC content
 * guard is a `build:before` hook it stopped running too. A deleted step leaves no
 * trace — the gate just goes quiet and every run stays green.
 *
 * So the gate's inventory is now itself a claim. Add a step here when you add one
 * to the workflow; deleting one without deleting it here fails the check.
 */
const REQUIRED_SITE_STEPS = ['Lint', 'Format check', 'Spin-tell lint', 'Layer drift guard', 'Build']

/**
 * Does this workflow run on pull requests into `develop`?
 *
 * Indentation-aware rather than regex-over-the-whole-file: the first attempt at
 * this used a lookahead that matched end-of-line and so read every `branches:`
 * list as empty, reporting all nine repos broken when none were. A check that
 * reports the same answer whatever the input is worse than no check — see the
 * canary in `--self-test`, which exists so that cannot pass silently again.
 *
 * Handles both `branches: [main, develop]` and the block-list form.
 */
export function gatesDevelopPR(text) {
  const lines = text.split('\n')
  const onIdx = lines.findIndex((l) => /^on:\s*(#.*)?$/.test(l))
  if (onIdx === -1) return false

  let end = lines.length
  for (let i = onIdx + 1; i < lines.length; i++) {
    if (lines[i].trim() === '' || /^\s/.test(lines[i])) continue
    end = i
    break
  }
  const block = lines.slice(onIdx + 1, end)

  const prIdx = block.findIndex((l) => /^\s+pull_request:\s*(#.*)?$/.test(l))
  if (prIdx === -1) return false
  const prIndent = block[prIdx].match(/^(\s*)/)[1].length

  for (let i = prIdx + 1; i < block.length; i++) {
    const line = block[i]
    if (line.trim() === '') continue
    if (line.match(/^(\s*)/)[1].length <= prIndent) break
    if (/\bbranches:/.test(line) && /\bdevelop\b/.test(line)) return true
    if (/\bbranches:\s*(#.*)?$/.test(line)) {
      for (let j = i + 1; j < block.length; j++) {
        if (block[j].trim() === '') continue
        if (!/^\s*-\s/.test(block[j])) break
        if (/\bdevelop\b/.test(block[j])) return true
      }
    }
  }
  return false
}

/**
 * Is this a repo that *rides* the train, or the one that *defines* it?
 *
 * `.github` carries a release-train.yml too — the reusable `on: workflow_call`
 * definition every other repo calls. Counting the definition as a rider asks a
 * repo with no `develop` branch and nothing to deploy why it is not promoting,
 * and reports two failures that are not real.
 */
export function isTrainCaller(text) {
  const lines = text.split('\n')
  const onIdx = lines.findIndex((l) => /^on:\s*(#.*)?$/.test(l))
  if (onIdx === -1) return false
  for (let i = onIdx + 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue
    if (!/^\s/.test(lines[i])) break
    if (/^\s+workflow_call:/.test(lines[i])) return false
  }
  return true
}

// A positive control. Run with --self-test and the parser must get all four
// right; a parser that always answers the same thing fails here rather than in
// production, where it would read as nine green repos or nine broken ones.
if (process.argv.includes('--self-test')) {
  const cases = [
    ['inline list', 'on:\n  pull_request:\n    branches: [main, develop]\n\njobs:\n', true],
    ['block list', 'on:\n  pull_request:\n    branches:\n      - main\n      - develop\n\njobs:\n', true],
    ['main only', 'on:\n  pull_request:\n    branches: [main]\n\njobs:\n', false],
    ['develop on push, not PR', 'on:\n  push:\n    branches: [develop]\n  pull_request:\n    branches: [main]\n\njobs:\n', false],
  ]
  const callerCases = [
    ['caller (schedule)', 'on:\n  schedule:\n    - cron: "0 9 1,15 * *"\n  workflow_dispatch:\n\njobs:\n', true],
    ['the reusable definition', 'on:\n  workflow_call:\n    inputs:\n      base:\n        type: string\n\njobs:\n', false],
  ]
  let bad = 0
  for (const [name, yaml, want] of cases) {
    const got = gatesDevelopPR(yaml)
    console.log(`${got === want ? '✓' : '✗'} ${name}: expected ${want}, got ${got}`)
    if (got !== want) bad++
  }
  for (const [name, yaml, want] of callerCases) {
    const got = isTrainCaller(yaml)
    console.log(`${got === want ? '✓' : '✗'} ${name}: expected ${want}, got ${got}`)
    if (got !== want) bad++
  }
  console.log(bad ? `\n${bad} case(s) wrong — the parser is not trustworthy` : '\nparser sound')
  process.exit(bad ? 1 : 0)
}

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

// ── 0. Who is actually on the train ─────────────────────────────────────────
//
// This was the literal list ['QuizSort.com', 'Rig'] until 2026-08-03, by which
// point nine repos carried a release-train workflow. It covered two of them, and
// nothing anywhere reported the other seven as unchecked — the run stayed green
// and simply verified less than it appeared to.
//
// A list of what to check is itself a claim, and hardcoding one is how it goes
// quietly stale. Derive it: a repo is on the train if it carries the workflow.
const trainRepos = []
let discoveryFailed = null
{
  const { data, unknown } = await gh(`/orgs/${ORG}/repos?per_page=100`)
  if (unknown) discoveryFailed = unknown
  else {
    for (const repo of data.filter((r) => !r.archived)) {
      const { data: files } = await gh(`/repos/${ORG}/${repo.name}/contents/.github/workflows`)
      if (!Array.isArray(files) || !files.some((f) => f.name === 'release-train.yml')) continue
      const { data: blob } = await gh(
        `/repos/${ORG}/${repo.name}/contents/.github/workflows/release-train.yml`,
      )
      if (!blob?.content) continue
      if (isTrainCaller(Buffer.from(blob.content, 'base64').toString('utf8')))
        trainRepos.push(repo.name)
    }
    trainRepos.sort()
  }
}
if (discoveryFailed)
  record(
    'UNKNOWN',
    'train membership could be enumerated',
    `${discoveryFailed} — every per-repo claim below is therefore unchecked, not passing`,
    'RELEASE-PROCESS.md § Wiring a repo up',
  )
else
  record(
    'PASS',
    `train membership enumerated (${trainRepos.length} repos)`,
    trainRepos.join(', '),
    'RELEASE-PROCESS.md § Wiring a repo up',
  )

// ── 1. Scheduled workflows only fire from the default branch ────────────────
//
// RELEASE-PROCESS.md, "Wiring a repo up": leave the default as `main` with the
// caller on `develop` and the cron never runs, and nothing reports it.
for (const repo of trainRepos) {
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
for (const repo of trainRepos) {
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

// ── 5. The site gate runs the steps it is documented to run ─────────────────
//
// The direct catch for 2026-07-23. Reads the workflow in this repo rather than
// over the API: it is the one definition all the sites call, and a local read
// cannot come back UNKNOWN for want of a token.
{
  const doc = '.github/workflows/site-ci.yml § header'
  const claim = 'site gate runs every step it documents'
  try {
    const { readFileSync } = await import('node:fs')
    const wf = readFileSync(new URL('../.github/workflows/site-ci.yml', import.meta.url), 'utf8')
    const present = new Set([...wf.matchAll(/^\s*-\s*name:\s*(.+?)\s*$/gm)].map((m) => m[1]))
    const missing = REQUIRED_SITE_STEPS.filter((s) => !present.has(s))
    if (missing.length)
      record('FAIL', claim, `missing from site-ci.yml: ${missing.join(', ')}`, doc)
    else record('PASS', claim, REQUIRED_SITE_STEPS.join(' · '), doc)
  } catch (err) {
    record('UNKNOWN', claim, `could not read site-ci.yml — ${err.message}`, doc)
  }
}

// ── 6. Every train repo gates pull requests into develop ────────────────────
//
// AmuletLabs.org joined the train and kept triggering CI on `main` alone, so
// nothing on `develop` was checked until the promotion PR opened a fortnight
// later. Its PRs reported "no checks" — which reads as nothing to check, not as
// a gap. Branch protection would be the structural fix, but it is unavailable on
// a private repo without a paid plan, and all the train repos but Rig are private.
// So the trigger itself is the claim.
for (const repo of trainRepos) {
  const doc = 'RELEASE-PROCESS.md § The flow'
  const claim = `${repo}: CI gates pull requests into develop`
  const { data: files, unknown } = await gh(`/repos/${ORG}/${repo}/contents/.github/workflows`)
  if (unknown || !Array.isArray(files)) {
    record('UNKNOWN', claim, unknown ?? 'could not list workflows', doc)
    continue
  }
  let gated = false
  let readable = 0
  for (const f of files.filter((f) => /\.ya?ml$/.test(f.name))) {
    const { data: blob } = await gh(`/repos/${ORG}/${repo}/contents/${f.path}`)
    if (!blob?.content) continue
    readable++
    const text = Buffer.from(blob.content, 'base64').toString('utf8')
    if (gatesDevelopPR(text)) gated = true
  }
  if (!readable) record('UNKNOWN', claim, 'no workflow files could be read', doc)
  else if (gated) record('PASS', claim, '', doc)
  else
    record(
      'FAIL',
      claim,
      'no workflow triggers on pull_request into develop — PRs will report no checks and merge green',
      doc,
    )
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
