# Go-Live & Monetization Runbook

How to take a site built from this boilerplate from built → earning. The code is
already wired for every revenue stream; going live is mostly **connecting
accounts and setting environment variables in Netlify** (Site → Settings →
Environment variables). Set these per site.

## Before you launch (branding)

1. Set `site.name` / `site.description`, `appConfig.homepage`, and
   `appConfig.categories` in `nuxt.config.ts` (see the README).
2. Replace the placeholder assets in `public/` (`logo-mark.svg`, `favicon.svg`,
   `og-default.svg`, `manifest.webmanifest`, `images/categories/*.svg`).
3. Pick a theme in `assets/css/main.css` and run `pnpm build:theme`; commit the
   regenerated `public/theme.css`.
4. Fill in `content/pages/` (about, privacy, affiliate-disclosure,
   terms-of-service) and add your first articles in `content/articles/`.

## ✅ Already wired (in code — no action needed)

- **Affiliate links are compliant.** Product links carry `rel="nofollow noopener
  sponsored"`. Reviews/buying guides emit `Product`/`Review`/`AggregateRating`
  schema for rich results.
- **All channels are plumbed** — affiliate, newsletter (ConvertKit), AdSense,
  Fathom analytics, and Sentry read from `runtimeConfig`; each activates when
  its env var is set.
- **SEO base is strong** — canonical URLs, sitemaps, robots (indexable),
  structured data, OG images.
- **Internal links are clean** and the build fails on broken links/500s
  (`nitro.prerender.failOnError`), so nothing broken ships.

## 🔌 Activate revenue (set env vars, highest impact first)

| Env var | Unlocks | Where to get it | Impact |
|---|---|---|---|
| `NUXT_AMAZON_AFFILIATE_TAG` | **Amazon affiliate** (`yourtag-20`) | Amazon Associates | 💰💰💰 core earner |
| `NUXT_PUBLIC_ADSENSE_CLIENT_ID` | **Display ads** (`ca-pub-…`) | Google AdSense → enable **Auto Ads** | 💰💰 scales w/ traffic |
| `NUXT_NEWSLETTER_API_KEY` + `NUXT_CONVERTKIT_FORM_ID` | **Newsletter capture** | ConvertKit → API + form | 💰 compounds |
| `NUXT_PUBLIC_FATHOM_SITE_ID` | **Analytics** (measure revenue/traffic) | usefathom.com | 📊 required to optimize |
| `NUXT_PUBLIC_SENTRY_DSN` | **Error tracking** | sentry.io | 🛡️ reliability |

Register a distinct Associates tag per property (e.g. `mysite-20`) and set
`NUXT_AMAZON_AFFILIATE_TAG` so each site's product links are attributed to it.

## 🌐 Launch checklist

1. Confirm the Netlify build is green and the site deploys.
2. Attach the **custom domain** + DNS.
3. Set the env vars above; redeploy.
4. Submit the sitemap to **Google Search Console** + **Bing Webmaster** (this,
   not IndexNow, is what drives the traffic ramp).
5. Turn on **AdSense Auto Ads** in the dashboard once traffic exists.

## 🔧 Deeper work (needs eng — not one-env-var)

- **AdSense script must load globally for Auto Ads.** The `<AdUnit>` component
  loads the script only when mounted. To serve ads either (a) use an **auto-ads
  network** (e.g. Ezoic — no traffic floor) whose script self-injects, or
  (b) add a global AdSense loader. Loading either script also requires
  **relaxing the CSP** in `netlify.toml` to allow the ad domains.

## Ad-network upgrade path

Ezoic (no floor) → **Mediavine** (50k sessions/mo) → **Raptive** (100k
pageviews/mo). RPMs roughly $8→$25→$50 per 1k views as you climb.
