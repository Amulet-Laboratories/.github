#!/usr/bin/env node
/**
 * Browser-level smoke test for the affiliate network.
 *
 * WHY THIS EXISTS, AND WHY smoke.mjs IS NOT ENOUGH:
 *
 * smoke.mjs fetches pages over HTTP and reads the HTML. That catches a dead
 * deploy, a bad canonical, a missing header, a collapsed roundup. It cannot
 * catch anything that only goes wrong once a browser runs the page — and on
 * 2026-07-31 exactly that happened, twice, on all six clones at once:
 *
 *   1. /best-for rendered "500 Something went wrong" in every real browser.
 *      It SERVER-rendered perfectly, so curl, crawlers, the sitemap, uptime
 *      checks and smoke.mjs all saw 200 OK with real content. `contentPersonaSlugs`
 *      sat in PRIVATE runtime config while a client-rendered component read it,
 *      so `.split()` ran on undefined and Nuxt's error boundary ate the page.
 *
 *   2. Every site nested a second <main id="main-content"> inside the one Rig's
 *      SiteShell already renders. That produced five identical axe failures per
 *      site and — the part that actually mattered — broke "Skip to content",
 *      because a duplicate id means the link resolves to the wrong element.
 *
 * Both were found by a browser-driven audit run by hand. This is that audit's
 * two load-bearing assertions, on a schedule, so neither class can reach
 * production silently again. It deliberately does NOT re-run a full a11y suite:
 * the point is a fast, unambiguous gate, not a score.
 *
 * The design system is the reason this matters. Rig is one dependency behind
 * every property, so a single defect in it lands on six sites simultaneously.
 * Fix-once is also break-once, and this is the guard on the second half.
 *
 * Runs against LIVE production. Needs Playwright (chromium only).
 */

import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { chromium } from 'playwright'

const HERE = dirname(fileURLToPath(import.meta.url))
const NAV_TIMEOUT_MS = 30_000
const SETTLE_MS = 1_500 // let hydration finish and any late error surface

/**
 * Errors that are real but not ours, and would make the gate flap. Keep this
 * list SHORT and justified — every entry is a class of bug this test can no
 * longer see. Prefer fixing the cause to adding a line here.
 */
const IGNORED_ERRORS = [
  /favicon/i, // a 404 favicon is a console error in some builds, harmless
  /ERR_INTERNET_DISCONNECTED|ERR_NETWORK_CHANGED/i, // runner network blips
]

const isIgnored = (msg) => IGNORED_ERRORS.some((re) => re.test(msg))

/** Routes worth loading per site. Cheap, and each one has earned its place. */
function routesFor(site) {
  if (site.hub) return ['/'] // QuizSort has no /best-for
  return ['/', '/best-for', site.canaryPath].filter(Boolean)
}

/**
 * Load one URL and report what a browser — not curl — actually saw.
 * Returns a list of {name, ok, detail} in the same shape smoke.mjs uses.
 */
async function checkPage(context, host, route) {
  const url = `https://${host}${route}`
  const label = route === '/' ? '/' : route
  const page = await context.newPage()
  const errors = []

  page.on('pageerror', (err) => errors.push(`uncaught: ${err.message}`))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
  })

  const checks = []
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS })
    if (!res || !res.ok()) {
      checks.push({
        name: `${label} loads`,
        ok: false,
        detail: `HTTP ${res ? res.status() : 'no response'}`,
      })
      return checks
    }
    // Hydration errors land AFTER domcontentloaded. Waiting is the whole point.
    await page.waitForTimeout(SETTLE_MS)

    // 1 — nothing threw in the browser. This is the /best-for class.
    const real = errors.filter((e) => !isIgnored(e))
    checks.push({
      name: `${label} runs clean`,
      ok: real.length === 0,
      detail: real.slice(0, 3).join(' | '),
    })

    // 2 — the page did not render Nuxt's error boundary. Belt and braces:
    // a caught error can blank the page without throwing to `pageerror`.
    const crashed = await page.evaluate(() => {
      const t = document.body?.innerText ?? ''
      return /Something went wrong|500\b/.test(t) && t.length < 2000
    })
    checks.push({
      name: `${label} is not an error page`,
      ok: !crashed,
      detail: crashed ? 'rendered an error boundary in-browser' : '',
    })

    // 3 — exactly one <main>, and the skip link resolves to it.
    // This is the duplicate-landmark class, expressed as the user-visible
    // symptom rather than as an axe rule id.
    const landmarks = await page.evaluate(() => {
      const mains = document.querySelectorAll('main')
      const skip = document.querySelector('a[href^="#"][href*="main"]')
      const targetId = skip?.getAttribute('href')?.slice(1) ?? null
      return {
        mainCount: mains.length,
        duplicateIds: [...document.querySelectorAll('[id]')]
          .map((el) => el.id)
          .filter((id, i, all) => id && all.indexOf(id) !== i),
        skipResolves: targetId ? document.querySelectorAll(`#${CSS.escape(targetId)}`).length === 1 : null,
      }
    })
    checks.push({
      name: `${label} has exactly one <main>`,
      ok: landmarks.mainCount === 1,
      detail: `found ${landmarks.mainCount}`,
    })
    checks.push({
      name: `${label} has no duplicate ids`,
      ok: landmarks.duplicateIds.length === 0,
      detail: [...new Set(landmarks.duplicateIds)].slice(0, 5).join(', '),
    })
    if (landmarks.skipResolves !== null) {
      checks.push({
        name: `${label} skip-link resolves`,
        ok: landmarks.skipResolves,
        detail: 'skip-to-content points at a missing or duplicated id',
      })
    }
  } catch (err) {
    checks.push({ name: `${label} loads`, ok: false, detail: `crashed: ${err.message}` })
  } finally {
    await page.close()
  }
  return checks
}

async function main() {
  const { sites } = JSON.parse(await readFile(join(HERE, 'sites.json'), 'utf-8'))
  const browser = await chromium.launch()
  const context = await browser.newContext({
    // Most of this traffic is mobile, and the failures we care about are not
    // viewport-dependent — but a phone viewport is the honest default.
    viewport: { width: 390, height: 844 },
    userAgent:
      'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36 AmuletBrowserSmoke/1.0',
  })

  const results = []
  for (const site of sites) {
    for (const route of routesFor(site)) {
      const checks = await checkPage(context, site.host, route)
      for (const c of checks) results.push({ site: site.name, ...c })
    }
  }

  await context.close()
  await browser.close()

  const failures = results.filter((r) => !r.ok)
  const bySite = new Map()
  for (const r of results) {
    if (!bySite.has(r.site)) bySite.set(r.site, [])
    bySite.get(r.site).push(r)
  }

  const lines = []
  for (const [site, checks] of bySite) {
    const bad = checks.filter((c) => !c.ok)
    lines.push(`${bad.length ? '✗' : '·'} ${site}`)
    for (const c of checks) lines.push(`    ${c.ok ? '·' : '✗'} ${c.name}${c.ok ? '' : ` — ${c.detail}`}`)
  }
  console.log(lines.join('\n'))
  console.log(
    `\n${results.length - failures.length}/${results.length} checks passed across ${sites.length} sites.`
  )

  if (process.env.GITHUB_STEP_SUMMARY) {
    const md =
      `## Browser smoke — ${failures.length ? `❌ ${failures.length} failing` : '✅ all green'}\n\n` +
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
    const { appendFile } = await import('node:fs/promises')
    await appendFile(process.env.GITHUB_STEP_SUMMARY, md + '\n')
  }

  if (failures.length) process.exitCode = 1
}

main().catch((err) => {
  console.error('browser smoke runner crashed:', err)
  process.exitCode = 1
})
