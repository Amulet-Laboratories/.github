# IndexNow

Pushes network URLs to IndexNow (Bing, DuckDuckGo, Yandex — **not** Google).

- **Key:** `e36826f48212f448d8f2b9177cfe524e`, shared across all sites. IndexNow
  keys are public by design — ownership is proven by hosting `<key>.txt` at the
  domain root. Each site commits `public/<key>.txt` containing exactly the key.
- **Submitter:** `submit.mjs` fetches each site's **live** sitemap (so ISR
  article URLs are included) and POSTs the URL list per host. Run `--dry-run` to
  preview, `--host <h>` to target one.
- **Schedule:** `.github/workflows/indexnow.yml` runs it daily; new pages are
  pushed within a day with no manual step. Also `workflow_dispatch` for on-demand.

Google is not covered — it doesn't consume IndexNow. Use Search Console's
Request Indexing (or wait on the sitemap crawl) for Google.
