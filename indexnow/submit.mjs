// Submit each network site's live sitemap URLs to IndexNow (Bing, DuckDuckGo,
// Yandex, et al. — NOT Google, which doesn't consume IndexNow).
//
// Why fetch the LIVE sitemap rather than a build artifact: the authority sites'
// article URLs are ISR, so they never appear in a build-time sitemap (that was
// the bug rig-nuxt 0.6.6 fixed by serving them from a source endpoint). The
// live sitemap has them; a built one wouldn't.
//
// The IndexNow key is public by design — it proves domain ownership by being
// hosted at https://<host>/<key>.txt. So it lives in the repo, not a secret.
//
// Usage: node indexnow/submit.mjs [--host one.com] [--dry-run]
//   default: every host in ../smoke/sites.json

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const KEY = 'e36826f48212f448d8f2b9177cfe524e'
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const here = dirname(fileURLToPath(import.meta.url))
const sites = JSON.parse(readFileSync(join(here, '..', 'smoke', 'sites.json'), 'utf8')).sites
const args = process.argv.slice(2)
const dry = args.includes('--dry-run')
const only = args.includes('--host') ? args[args.indexOf('--host') + 1] : null

async function sitemapUrls(host) {
  const res = await fetch(`https://${host}/sitemap.xml`, { redirect: 'follow' })
  if (!res.ok) throw new Error(`sitemap ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
}

async function submit(host, urls) {
  // IndexNow caps a batch at 10,000 URLs and requires one host per request.
  const body = {
    host,
    key: KEY,
    keyLocation: `https://${host}/${KEY}.txt`,
    urlList: urls.slice(0, 10000),
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(body),
  })
  return res.status
}

let ok = 0
let failed = 0
for (const s of sites) {
  if (only && s.host !== only) continue
  try {
    const urls = await sitemapUrls(s.host)
    if (dry) {
      console.log(`  ${s.host}: ${urls.length} urls (dry run)`)
      continue
    }
    // 200 and 202 both mean accepted; 429 is rate-limited (retry later).
    const status = await submit(s.host, urls)
    const good = status === 200 || status === 202
    console.log(`  ${good ? '✓' : '✗'} ${s.host}: ${urls.length} urls · HTTP ${status}`)
    good ? ok++ : failed++
  } catch (err) {
    console.error(`  ✗ ${s.host}: ${err instanceof Error ? err.message : err}`)
    failed++
  }
}
console.log(`\n${ok} submitted${failed ? ` · ${failed} failed` : ''}`)
if (failed) process.exit(1)
