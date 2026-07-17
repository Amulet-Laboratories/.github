#!/usr/bin/env node
/**
 * Post-deploy smoke test for the affiliate network.
 *
 * WHY THIS EXISTS: "build green" is not "site works". Twice this network shipped
 * broken while CI was green — a publish-dir misconfig made Netlify keep serving a
 * months-old build, and a prettier drift slipped the release gate. Neither was
 * visible from inside the build. This test hits LIVE production from the outside
 * and asserts the site a visitor actually sees is healthy.
 *
 * It has no dependencies — Node 22's global fetch only — so it runs anywhere with
 * `node smoke.mjs` and needs no install step.
 *
 * Checks per site (see sites.json):
 *   - GET /                    -> 200
 *   - canonical <link>         -> points at the site's own https host
 *   - security headers         -> CSP + HSTS + X-Frame-Options present
 *   - GET /robots.txt          -> 200
 *   - GET /sitemap.xml         -> 200
 *   - canary roundup (content sites) -> 200 AND affiliate-card count == expected
 *     (this is the revenue guard: the multi-card MDC render bug collapsed roundups
 *      to a single card — a card-count drop here catches any regression of it)
 *   - /go/<slug> (QuizSort hub) -> 30x redirect to an EXTERNAL retailer host
 *
 * Exit code is non-zero if any check fails, which reds the GitHub job.
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const HERE = dirname(fileURLToPath(import.meta.url))
const TIMEOUT_MS = 15_000
const RETRIES = 2 // one real attempt + this many retries, for transient network/CDN blips

/** fetch with a timeout and a couple of retries on network error / 5xx. */
async function robustFetch(url, opts = {}) {
  let lastErr
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS)
    try {
      const res = await fetch(url, { ...opts, signal: ac.signal, redirect: opts.redirect ?? 'follow' })
      clearTimeout(timer)
      if (res.status >= 500 && attempt < RETRIES) {
        await sleep(1000 * (attempt + 1))
        continue
      }
      return res
    } catch (err) {
      clearTimeout(timer)
      lastErr = err
      if (attempt < RETRIES) await sleep(1000 * (attempt + 1))
    }
  }
  throw lastErr
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Count rendered product cards. Every card's ROOT element carries the bare
 * `data-rig-product-card` attribute; its children use hyphenated variants
 * (`data-rig-product-card-header`, `-info`, …), which the negative lookahead
 * excludes. This counts cards regardless of retailer — a card linking to a
 * non-Amazon store (Farmer's Dog, a publisher-direct link) still counts — so it
 * measures exactly what the multi-card render bug broke: cards on the page.
 */
function countRenderedCards(html) {
  const matches = html.match(/data-rig-product-card(?![-\w])/gi)
  return matches ? matches.length : 0
}

/**
 * Run one check. Pushes {site, name, ok, detail} onto results.
 * `fn` returns a string on failure (the reason) or null/undefined on pass.
 */
async function check(results, site, name, fn) {
  try {
    const reason = await fn()
    results.push({ site, name, ok: !reason, detail: reason || 'ok' })
  } catch (err) {
    results.push({ site, name, ok: false, detail: `threw: ${err.message}` })
  }
}

async function checkSite(site, results) {
  const base = `https://${site.host}`
  const S = site.name

  // Fetch the homepage once and reuse it for status / canonical / headers.
  let home
  await check(results, S, 'homepage 200', async () => {
    home = await robustFetch(`${base}/`)
    return home.ok ? null : `GET / -> ${home.status}`
  })

  if (home && home.ok) {
    const html = await home.text()

    await check(results, S, 'canonical host', () => {
      const m = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)
      if (!m) return 'no <link rel="canonical"> found'
      if (!m[1].startsWith(`${base}`)) return `canonical -> ${m[1]} (expected host ${site.host})`
      return null
    })

    await check(results, S, 'security headers', () => {
      const missing = ['content-security-policy', 'strict-transport-security', 'x-frame-options'].filter(
        (h) => !home.headers.get(h),
      )
      return missing.length ? `missing: ${missing.join(', ')}` : null
    })
  }

  await check(results, S, 'robots.txt', async () => {
    const r = await robustFetch(`${base}/robots.txt`)
    return r.ok ? null : `GET /robots.txt -> ${r.status}`
  })

  await check(results, S, 'sitemap.xml', async () => {
    const r = await robustFetch(`${base}/sitemap.xml`)
    return r.ok ? null : `GET /sitemap.xml -> ${r.status}`
  })

  // Revenue guard: the canary roundup must render its full set of affiliate cards.
  if (site.canaryPath) {
    await check(results, S, `cards render (${site.expectedCards})`, async () => {
      const r = await robustFetch(`${base}${site.canaryPath}`)
      if (!r.ok) return `GET ${site.canaryPath} -> ${r.status}`
      const n = countRenderedCards(await r.text())
      if (n < site.expectedCards) return `only ${n}/${site.expectedCards} product cards rendered on ${site.canaryPath}`
      return null
    })
  }

  // Hub: the /go/ affiliate redirect must 30x out to a real external retailer.
  if (site.goSlug) {
    await check(results, S, `/go/${site.goSlug} redirect`, async () => {
      const r = await robustFetch(`${base}/go/${site.goSlug}`, { redirect: 'manual' })
      if (r.status < 300 || r.status >= 400) return `/go/${site.goSlug} -> ${r.status} (expected 30x)`
      const loc = r.headers.get('location') || ''
      if (!/^https?:\/\//.test(loc) || loc.includes(site.host)) return `redirects to "${loc}" (expected external retailer)`
      return null
    })
  }
}

async function main() {
  const { sites } = JSON.parse(await readFile(join(HERE, 'sites.json'), 'utf8'))
  const results = []

  // Sites are independent — check them concurrently.
  await Promise.all(sites.map((s) => checkSite(s, results)))

  const failures = results.filter((r) => !r.ok)

  // Group for a readable report.
  const bySite = new Map()
  for (const r of results) {
    if (!bySite.has(r.site)) bySite.set(r.site, [])
    bySite.get(r.site).push(r)
  }

  const lines = []
  for (const [site, checks] of bySite) {
    const bad = checks.filter((c) => !c.ok)
    lines.push(`${bad.length ? '✗' : '✓'} ${site}`)
    for (const c of checks) lines.push(`    ${c.ok ? '·' : '✗'} ${c.name}${c.ok ? '' : ` — ${c.detail}`}`)
  }
  const report = lines.join('\n')
  console.log(report)
  console.log(`\n${results.length - failures.length}/${results.length} checks passed across ${sites.length} sites.`)

  // GitHub Actions step summary (rendered on the run page).
  if (process.env.GITHUB_STEP_SUMMARY) {
    const md =
      `## Smoke test — ${failures.length ? `❌ ${failures.length} failing` : '✅ all green'}\n\n` +
      [...bySite]
        .map(([site, checks]) => {
          const bad = checks.filter((c) => !c.ok)
          const head = `### ${bad.length ? '❌' : '✅'} ${site}`
          const body = bad.length
            ? bad.map((c) => `- **${c.name}** — ${c.detail}`).join('\n')
            : `- ${checks.length} checks passed`
          return `${head}\n${body}`
        })
        .join('\n\n')
    await writeSummary(md)
  }

  if (failures.length) process.exitCode = 1
}

async function writeSummary(md) {
  const { appendFile } = await import('node:fs/promises')
  await appendFile(process.env.GITHUB_STEP_SUMMARY, md + '\n')
}

main().catch((err) => {
  console.error('smoke runner crashed:', err)
  process.exitCode = 1
})
