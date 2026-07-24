# The Content Network — internal overview

Single front door to the affiliate content network. Per-repo READMEs cover
mechanics; this covers **what the network is, how the pieces fit, and why**.
Private (the org `.github` repo is private; only `profile/README.md` is public).

_Last updated 2026-07-24._

---

## What it is

A network of interactive-content and affiliate-commerce sites, built corpus-first.

- **QuizSort** (`quizsort.com`) — the hub and the product. Personality quizzes
  and five side games over 60+ franchises. The only property search finds on its
  own, and the traffic engine for everything else.
- **Six authority sites** — Beanwoven (coffee/tea), FewerSerums (skincare),
  Meepleloft (board games), OneGoodLamp (home/lighting), TheScruffGuide (pets),
  TheShelfNook (books). **Frozen monetization endpoints**, not publications:
  QuizSort sends fandom traffic in, commercial intent flows out to these via each
  quiz's `relatedSite` block.
- **franchise-db** — the entertainment knowledge graph that grounds QuizSort
  generation. Characters → works → seasons → relationships, with field-level
  licensing. The durable asset; quizzes and games are surfaces on it.
- **products-db** — 897 affiliate products (SQLite/YAML), copied into each site.

## The strategy, and why

**Corpus-first, QuizSort as surface #1, the six sites frozen as the
monetization layer.** Settled 2026-07 after a research pass:

- The affiliate-content model took a structural hit in 2026 — 71% of affiliate
  sites declined in the March core update; AI Overviews answer commercial
  queries in place; ~60% of searches end with no click. Publishing evergreen
  guides and waiting for search is the specific thing that stopped working.
- Interactive content is structurally immune to that. An AI Overview fully
  answers "best coffee maker"; it **cannot** answer "which Hogwarts house am I"
  — that answer is a function of the user's inputs. Quizzes and the game formats
  are unsummarizable by construction, which is why the hub is the durable bet.
- So: fandom traffic in through QuizSort → commercial intent out to the six
  sites. The corpus is the moat because every surface (quizzes, games, whatever
  replaces them) is a consumer of the same structured data.

## How the pieces fit

```
                 franchise-db  ──(grounded specs)──►  QuizSort generation
              (characters, works,                         │
               seasons, relationships,                    ▼
               field-level licensing)              quizzes + 5 games
                                                          │
                                       quiz pages ──relatedSite──► 6 authority sites
                                                          │                 │
                                              /go redirect │                 │ product cards
                                                          ▼                 ▼
                                                    affiliate ◄──── products-db (897)
```

- **Generation:** `franchise-db build-manifest` → QuizSort `generate:batch
  --specs`. Prompts are grounded in canonical facts, not model recall.
- **The funnel:** a quiz's `relatedSite` block links to one authority site,
  routed from the quiz's tags (`scripts/lib/related-site.ts`). A Fathom event
  (`network_site_clicked`) measures the crossing.
- **Monetization:** authority-site product cards + QuizSort's `/go` affiliate
  redirect (the only site with one), both drawing from products-db.

## Repos

| Repo | What |
|---|---|
| `QuizSort.com` | The hub. Nuxt 3 SSR, gamification, 5 games, generation scripts. |
| `franchise-db` | The corpus. tsx + SQLite. `pnpm cli …` — see its README. |
| `Beanwoven.com` … `TheShelfNook.com` | Six frozen authority sites, `site-boilerplate` clones. |
| `products-db` | 897 affiliate products, validated, copied into each site. |
| `Rig` / `hex` | Headless Vue component library + theming; `rig-nuxt` is the shared Nuxt module. |
| `.github` (this repo) | Org-wide infra: reusable CI, smoke tests, IndexNow, this doc. |
| `AmuletLabs.org` | The studio site. |

## Shared infrastructure (the "fix once" channels)

- **Reusable Site CI** (`.github/workflows/site-ci.yml`) — lint, format:check,
  build, and the spin-tell lint, called by each site's thin caller. One edit
  covers all six.
- **rig-nuxt** — the shared Nuxt module. Sitemap source endpoint, Sentry
  per-site environment, the content build guard. Bump the version to propagate.
- **Smoke tests** (`smoke/`) — 30-min schedule hitting live prod: status,
  canonical host, CSP/HSTS, robots+sitemap, a canary product-card count (the
  revenue guard), and QuizSort `/go`.
- **IndexNow** (`indexnow/`) — daily push of every site's live sitemap to Bing/
  DuckDuckGo/Yandex. Shared public key hosted at each site's root. Not Google.
- **Spin-tell lint** — a wordlist in the reusable CI that fails a build if an
  article reintroduces thesaurus-substituted prose (guards the 5.1 cleanup).

## Key decisions (dated)

- **2026-07 · Corpus-first.** QuizSort is the product; the six sites are frozen
  monetization endpoints. See each site's `CLAUDE.md` for the freeze.
- **2026-07 · Source & licensing policy** (`franchise-db/DESIGN.md §7`).
  Wikidata (CC0) is the spine; Fandom (CC BY-SA) is facts-only, never
  republished; **TMDB is out** (its terms bar commercial + ML use); art is
  linked, never copied. Unlabelled sources fail closed.
- **2026-07 · Publish under the brand, not fake experts.** The 18 invented
  author personas were removed; the fabricated `/how-we-test` methodology pages
  rewritten to state what the sites actually do (research, not a test lab).
- **2026-07 · Real-people guardrail** for reality-TV franchises — persona/role
  only, nothing private or negative, no implied endorsement (pages carry
  affiliate links).

## Current state (2026-07-24)

- **Search:** all 8 domains verified in Google + Bing. Google seed URLs
  requested by hand; Bing/DuckDuckGo/Yandex fed by IndexNow (daily, automated).
  **The 2-week indexing read is the gate for the next content decisions (~Aug 7).**
- **Corpus:** 17 franchises · 14,609 characters · 92 works · 1,258 appearances ·
  653 relationships. Encumbered (CC BY-SA) text fields down 716 → 454 via
  fact-based generation. Browse it: `franchise-db` → `pnpm cli web-export &&
  node scripts/build-explorer.mjs`.
- **Funnel:** live — quiz pages link to the authority sites, routing scored,
  crossing instrumented, shared-result pages convert cold visitors to takers.
- **Revenue:** $0. Traffic is the binding constraint, which is the search gate's
  whole point.

## What's deliberately NOT being done

New articles on the six sites (the freeze); a seventh site; per-retailer
affiliate signups beyond Farmer's Dog + Libro.fm (ROI ceiling ~$57); newsletter
capture and AdSense (deferred until traffic). Rationale for each is in the
working roadmap.
