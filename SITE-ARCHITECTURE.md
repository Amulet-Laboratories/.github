# Content network — site architecture

**The canonical description of how the six affiliate sites work.** Each site keeps only a short
CLAUDE.md with its own identity, categories, and voice, and defers here for architecture and
conventions.

If you change the architecture, change it here first, then propagate to the six.

> Relocated here on 2026-07-31 from `site-boilerplate/CLAUDE.md`. The `site-boilerplate` repo was
> archived and then deleted that day; the sites are clones of one another now, with no template
> repo. The deletion took the repo's snapshot tag with it, so **this file and `SITE-GO-LIVE.md`
> are what survives of the template's documentation** — treat them as the originals, not copies.

## The network model

QuizSort is the **traffic engine**; the six content sites are the **checkout counter** it feeds.
Fandom traffic arrives through QuizSort quizzes; commercial intent flows out to the sites via
each quiz's `relatedSite` block. Articles exist to convert arriving traffic — not to win search
on their own.

Sites in the network: Beanwoven · FewerSerums · Meepleloft · OneGoodLamp · TheScruffGuide ·
TheShelfNook. Product data comes from **products-db**; the corpus behind QuizSort is
**franchise-db**.

## Stack

- Nuxt 3 (SSR) + TypeScript strict · Node 22 · pnpm
- `@amulet-laboratories/rig` — headless Vue 3 component library (structure, no styling)
- `@amulet-laboratories/hex` — theme/token framework (**all** visual styling)
- `@amulet-laboratories/rig-nuxt` — Nuxt module, auto-imports
- `@nuxt/content` v3 (Markdown articles) · `@nuxtjs/seo` umbrella (sitemap, robots,
  schema-org, og-image) · `@nuxt/image`
- Netlify deployment with SSR function · Sentry · Fathom analytics

**Tailwind v4 is a build input to Hex, not an authoring tool.** `scripts/build-theme.mjs`
compiles `public/theme.css` from `hex/<theme>` + `rig/styles` — a single pre-built stylesheet.
You never write Tailwind classes in a template.

## Styling — the rule that matters

**Hex owns 100% of visual styling. The site is a pure composition layer.**

- No `<style>` blocks.
- **No Tailwind utility classes in templates.**
- No inline styles.
- Rig components for all UI; custom elements hook styling via `data-rig-*` attributes.

> Historical note: earlier versions of the per-site CLAUDE.md files said "Tailwind utilities
> only." That was wrong and was corrected 2026-07-27. If you see that instruction anywhere,
> it is stale — Hex owns styling.

## Structure

```
assets/          css entry — imports hex/<theme>/source
components/
  content/       CategoryIcon, FaqBlock, QuickAnswer
  layout/        AppHeader
content/         Markdown: articles + static pages (about, privacy, affiliate-disclosure)
content-strategy/
data/            product data
layouts/         default, article
pages/           index.vue (hub) + [...slug].vue (catch-all)
public/          theme.css (generated — do not hand-edit)
scripts/         build-theme.mjs
server/          sitemap route
```

Treat this as a sketch, not a contract — read the tree rather than trusting this block. The
version that shipped in the old per-site files had drifted badly enough to describe ten
components that no longer existed.

## Conventions

- `<script setup lang="ts">` only — no Options API
- 2-space indent, no semicolons, single quotes, trailing commas
- All pages use `useSeoMeta()` and `useSchemaOrg()` — no raw `<head>` tags
- `BreadcrumbList` schema on every non-root page
- Mobile-first responsive

## Running

```bash
export PATH="/home/rose/.nvm/versions/node/v22.23.1/bin:$PATH"   # node 22 + pnpm
pnpm install
pnpm dev           # dev server
pnpm build         # SSR production build
pnpm build:theme   # regenerate public/theme.css from Hex
pnpm lint          # eslint
pnpm typecheck     # nuxi typecheck
```

## Analytics

Each site commits its own Fathom ID as `NUXT_PUBLIC_FATHOM_SITE_ID` in `netlify.toml` —
deliberately in the repo rather than the Netlify dashboard, so the ID travels with the site.
All seven network properties are live and tracking as of 2026-07-27.
