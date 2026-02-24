# Amulet Laboratories — TODO

> **Source:** [AUDIT-PLAN.md](AUDIT-PLAN.md) infrastructure audit + post-audit codebase review (2026-02-23)
> **Legend:** ⚙️ = automatable · 🔧 = manual/external · 🎨 = design decision needed

---

## Priority 1 — Security & Infrastructure

- [ ] **Enable branch protection on all repos** (Step 15)
  - Require PR reviews, status checks, force-push protection
  - GitHub → Settings → Branches → Add rule for `main`
  - Do all 15 repos

- [ ] **Configure Dependabot or Renovate** (Step 36)
  - Choose one: Dependabot (native) or Renovate (more configurable)
  - Add config to `.github` repo (org-wide) or per-repo
  - Set automerge policy for patch updates

- [ ] **Account registry security hardening** (Step 3)
  - Set up Proton Pass as credential vault
  - Enable TOTP on all critical accounts (GitHub, Netlify, Vercel, domain registrar, Proton Mail)
  - Store recovery codes in sealed physical envelope
  - Cross-reference: `AmuletLabsVault/04-Security/access-control.md`

- [ ] **Rename `library.amulet.ink` default branch** `master` → `main`
  - GitHub → Settings → Default branch → Rename
  - Update Netlify deploy settings (production branch)
  - CI already references `main` (updated in Wave 2)

## Priority 2 — Financial & Legal

- [ ] **Activate financial infrastructure** (Step 38)
  - Register IRS EIN at irs.gov
  - File DBA: Amulet + Greyline Research
  - Open Mercury business checking + Tax/Creative Fund savings
  - Set up Wave for invoicing
  - File with California FTB

- [ ] **Attorney review of contracts** (~$400–600)
  - `AmuletLabsVault/02-Contracts/labs-msa-template.md`
  - `AmuletLabsVault/02-Contracts/greyline-engagement-terms.md`

## Priority 3 — Content & Design

- [ ] **Build amuletlabs.org** (Step 20)
  - Professional business front (boardroom tone, distinct from creative amulet.ink)
  - Content: services, about, contact, legal links

- [ ] **Build portfolio.amulet.ink** (Step 21)
  - Curated case studies: Andrew Passanisi, Greyline, Hex, Rig, Flashforge, Vault

- [ ] **Rig component adoption in ARMS sites** (Step 27)
  - Design decisions needed: which components, which sites first
  - Cross-reference: `AmuletLabsVault/09-Reference/design-system.md`

## Priority 4 — Quality & Compliance

- [ ] **WCAG accessibility audit on live sites** (Step 31)
  - Run axe-core / Lighthouse on all 10 deployed sites
  - Target: WCAG 2.1 AA minimum
  - Document findings in `AmuletLabsVault/10-Testing/`

- [ ] **Publish privacy policy** (finalize draft → live)
  - Source: `AmuletLabsVault/08-Legal/privacy-policy.md`
  - Add footer link on all 10 deployed sites
  - Cross-reference: `AmuletLabsVault/05-Privacy/compliance-checklist.md`

## Priority 5 — Commit & Push

- [ ] **Commit and push all audit changes across 15 repos**
  - Review diffs per repo before committing
  - Suggested commit message format: `chore: infrastructure audit — wave N`
  - Push to `main` on all repos

---

## Post-Audit Improvements

Items discovered during a full codebase review after the audit. Organized by category.

### Developer Environment

- [ ] ⚙️ **Add `.nvmrc` with `22` to all repos** — only AndrewPassanisi.com has one (pinned to Node 16, which is EOL and won't run any project)
- [ ] ⚙️ **Add `packageManager` field to all `package.json`** — e.g. `"packageManager": "pnpm@10.30.0"` enables Corepack auto-activation, prevents accidental npm/yarn usage
- [ ] ⚙️ **Add `.editorconfig` to Flashforge, AmuletLabs.org, portfolio.amulet.ink** — all other repos have one
- [ ] ⚙️ **Add `.gitignore` to .github, AmuletLabs.org, portfolio.amulet.ink** — needed before any code is added
- [ ] ⚙️ **Fix library.amulet.ink `.gitignore`** — missing `coverage/`, editor globs, `Thumbs.db`; uses bare `node_modules` without trailing slash
- [ ] ⚙️ **Remove `.nvmrc` from Flashforge `.gitignore`** — `.nvmrc` should be committed

### TypeScript Consistency

- [ ] ⚙️ **Fix rig.amulet.ink tsconfig contradictions** — sets `outDir`, `declaration`, `declarationMap` alongside `noEmit: true` (dead options since vite-plugin-dts handles emit)
- [ ] ⚙️ **Fix hex.amulet.ink tsconfig contradictions** — same emit-setting confusion as rig
- [ ] ⚙️ **Update AndrewPassanisi.com tsconfig** — uses `moduleResolution: "node"` (should be `"bundler"`), missing `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- [ ] ⚙️ **Update Flashforge tsconfig** — `moduleResolution` should be `"node16"` or `"nodenext"` (not `"node"`) for a Node CLI project; remove redundant strict sub-options already implied by `strict: true`
- [ ] ⚙️ **Fix GreylineResearch.com/packages/shared tsconfig** — missing `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `resolveJsonModule`

### Package Scripts Standardization

- [ ] ⚙️ **Normalize `typecheck` → `type-check`** — hex, rig, and Flashforge use `typecheck` (no hyphen) while all ARMS sites use `type-check`; pick one and alias the other
- [ ] ⚙️ **Add `format:check` script to all repos** — only hex and rig have it; CI should run `format:check` (read-only) not `format` (writes files)
- [ ] ⚙️ **Add `test:watch` and `test:coverage` scripts** — only hex/rig have `test:watch`, only Flashforge has `test:coverage`; standardize developer convenience scripts
- [ ] ⚙️ **Add `dev` alias to hex and rig** — `"dev": "storybook dev -p 6006"` for conventional `pnpm dev` entry point
- [ ] ⚙️ **Add `type-check` to AndrewPassanisi.com** — every other Vue repo has it; needs `vue-tsc` as a dev dependency

### Vite Config

- [ ] ⚙️ **Set explicit `build.target: "es2020"` on ARMS sites** — currently defaults to `"modules"`, explicit target aligns with tsconfig and ensures consistent transpilation
- [ ] ⚙️ **Standardize `fileURLToPath` pattern** — library.amulet.ink, AndrewPassanisi.com, hex, rig use CJS-era `path.resolve(__dirname)` instead of ESM-correct `fileURLToPath(new URL('./src', import.meta.url))`
- [ ] 🎨 **Decide on `build.sourcemap` policy** — library sets `false`, hex/rig set `true`, ARMS sites unset (defaults to `false`); make a conscious org-wide decision

### Dependency Freshness

- [ ] ⚙️ **Upgrade Vitest to `^3.0.0` everywhere** — Flashforge on `^1.1.0`, hex/rig on `^2.0.0`, everything else on `^3.0.0`
- [ ] ⚙️ **Fix library.amulet.ink plugin-vue version mismatch** — has `@vitejs/plugin-vue: ^6.0.4` (expects Vite 6) but `vite: ^5.0.0`; either upgrade Vite or downgrade plugin
- [ ] ⚙️ **Align hex/rig `engines.pnpm` to `>=10.30`** — currently says `>=9` while all other repos say `>=10.30`
- [ ] 🔧 **Check if hex actually needs Vue `^3.5.28`** — all other repos use `^3.4.0`; if hex requires 3.5+ features, consuming ARMS sites need to bump too
- [ ] ⚙️ **Align Flashforge Prettier config to org standard** — uses `semi: true, singleQuote: false` vs org `semi: false, singleQuote: true`; also uses `.prettierrc.json` instead of `prettier.config.js` (requires reformatting all source files)

### Tailwind Config

- [ ] ⚙️ **Extract Greyline shared Tailwind preset** — three near-duplicate configs in root, apps/web, and apps/notebook; same pattern as Hex `amuletPreset`
- [ ] ⚙️ **Remove orphaned root-level `GreylineResearch.com/tailwind.config.ts`** — no root-level Vite build consumes it
- [ ] 🎨 **Document library.amulet.ink as intentional preset exception** — only Amulet-branded site not using Hex preset (uses its own CSS-variable theme for the auth UI)

### Security Headers (Netlify / Vercel)

- [ ] ⚙️ **Add `Strict-Transport-Security` (HSTS) to 7 Netlify sites** — only library.amulet.ink has it; add `Strict-Transport-Security: max-age=31536000; includeSubDomains` to all `_headers` files
- [ ] ⚙️ **Add HSTS to AndrewPassanisi.com `vercel.json`** — has other security headers but missing HSTS
- [ ] ⚙️ **Add `Content-Security-Policy` to ARMS sites and Greyline** — only labs and library have CSP; needs per-site tailoring (e.g., Google Fonts requires `font-src` whitelisting)
- [ ] ⚙️ **Add `_headers` file to hex.amulet.ink and interactive.amulet.ink** — both completely missing security headers
- [ ] ⚙️ **Fix library.amulet.ink `netlify.toml` build command** — missing `corepack enable` prefix that all other repos have (fragile if Netlify build image changes)

### ESLint

- [ ] ⚙️ **Add `eslint-plugin-vuejs-accessibility` to all Vue repos** — catches WCAG violations at lint time (supports Step 31 accessibility audit goal)
- [ ] ⚙️ **Standardize `_`-prefixed unused var pattern org-wide** — Flashforge has `{ argsIgnorePattern: "^_", varsIgnorePattern: "^_" }` for `@typescript-eslint/no-unused-vars`; spread this to all configs
- [ ] ⚙️ **Add `format:check` to CI workflows** — without it, formatting drift goes undetected until manual `pnpm format`

### GitHub Templates

- [ ] ⚙️ **Convert issue templates from `.md` to YAML forms** — current Markdown format has no required fields, no dropdowns, no validation; YAML forms provide structured inputs
- [ ] ⚙️ **Add `ISSUE_TEMPLATE/config.yml`** — enables template chooser screen, custom links ("Read docs first"), blank issue toggle
- [ ] ⚙️ **Fix PR template relative path** — links to `../../library.amulet.ink/AmuletLabsVault/09-reference/coding-style.md` (assumes sibling checkout); should be an absolute GitHub URL
- [ ] ⚙️ **Add "Maintenance / Tech Debt" issue template** — useful for tracking infrastructure work across 15 repos

### SEO & Meta Tags

- [ ] ⚙️ **Add meta tags to AndrewPassanisi.com** — missing `description`, `author`, `theme-color`, Open Graph, Twitter Card, canonical URL
- [ ] ⚙️ **Fix interactive.amulet.ink missing static assets** — `index.html` references `/favicon.svg` and `/manifest.json` but neither exists in `public/` (404 on deploy)
- [ ] 🎨 **Create OG images for all sites** — amulet.ink and all ARMS placeholders share no `og:image`; social media shares show no preview
- [ ] ⚙️ **Fix `screenshots` field in all `manifest.json` files** — currently uses favicon SVG as "screenshot" (semantically wrong); either add real screenshots or remove the field
- [ ] 🔧 **Decide Greyline notebook deployment intent** — no Netlify config; if internal-only, add `noindex, nofollow`; if public, needs full SEO treatment
- [ ] 🔧 **Add `noindex, nofollow` to rig.amulet.ink** — Storybook dev environment shouldn't be indexed (if deployed)

### Git Hooks

- [ ] ⚙️ **Fix or remove broken Husky in AndrewPassanisi.com** — `commit-msg` hook references `commitlint` which isn't installed; `.husky` uses old v8 format with missing helper script; hooks are non-functional
- [ ] 🎨 **Decide on org-wide pre-commit hook strategy** — 14/15 repos have zero git hooks; `husky` + `lint-staged` (Prettier + ESLint on staged files) would catch issues before push, reducing CI failures

---

## Completed (Waves 1–7)

For reference, the following were completed during the automated audit:

| Wave | Scope | Items |
|------|-------|-------|
| 1 | Security + Foundation | SECURITY.md, LICENSE, CODEOWNERS, .env.example, CODE_OF_CONDUCT, CONTRIBUTING across all repos |
| 2 | CI Standardization + Code Fixes | GitHub Actions for 11 repos, SHA-pinned actions, ESLint 9 migration, duplicate script fixes |
| 3 | Dependency Fixes + Documentation | pnpm lockfile regeneration, .github org README, README-TEMPLATE, profile README expansion |
| 4 | Version Upgrades + Shared Config | Vite 6 upgrade, hex shared Tailwind preset, vitest scaffolding across 11 packages |
| 5 | README Rewrites | All 15 repos standardized with status table, env vars, data/privacy, accessibility, testing |
| 6 | Solo Operator Docs | Runbook, absence plan, cognitive load map, data mapping, critical path protection |
| 7 | Vault Restructure | Fixed stale links, created 5 new Vault sections (04-Security, 05-Privacy, 08-Risk, 09-Growth, 10-Verticals) |
