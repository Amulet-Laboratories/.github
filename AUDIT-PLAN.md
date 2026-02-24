# Amulet Labs — Complete Audit, Stabilization & Foundation Plan

> **Created:** 2026-02-23
> **Status:** Approved — ready for execution
> **Owner:** @sndhl
> **Source of truth:** This document. Implementation tracked in the AmuletLabsVault execution-tracker.

---

## Context

Amulet Labs is a solo-operated, multi-vertical software company run alongside a stable W2 job. Long runway — not a cash-on-fire startup. Priority: correct, secure, stable, accessible, well-documented. Every standard built for a solo operator today and a team of 15–20 in five years.

Documentation source of truth: **AmuletLabsVault** at `library.amulet.ink/AmuletLabsVault`.

---

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Greyline category | `vertical` | Has its own brand brief, Vault section, monorepo, and notebook app. Not a one-off client engagement. |
| Tailwind version | Stay on `^3.4.0` | Hex peer dep aligns down. TW4 migration is P3 next quarter. |
| Vault restructure | Incremental | Create new sections first, move docs second, update links third, archive old last. Never delete. |
| library.amulet.ink branch | Rename `master` → `main` | Consistency with all 14 other repos. Update CI + Netlify in the same PR. |
| amuletlabs.org | Professional business front | Distinct from creative `amulet.ink` — authoritative, clean, boardroom tone. The .org you put on contracts. |
| portfolio.amulet.ink | Curated work showcase | Case studies for: Andrew Passanisi, Greyline (engineering only), Hex, Rig, Flashforge, Vault. |
| Dormant placeholders | Keep as placeholders | press/studio/workshop/interactive stay as coming-soon. Invest time only per the activation rule in master-plan.md. |

---

## Master Inventory

| # | Repo | Category | Vertical | Stack | Deploy | Status | Doc Score | Risk |
|---|---|---|---|---|---|---|---|---|
| 1 | `.github` | `platform` | cross-cutting | Markdown | GitHub | Active | 90% | Low |
| 2 | `amulet.ink` | `vertical` | Hub | Vue 3 / TS / TW3 / Vite 5 | Netlify | Active | 35% | Medium |
| 3 | `AmuletLabs.org` | `vertical` | Hub | Scaffold → Build | Netlify | Planned | 10% | Medium |
| 4 | `interactive.amulet.ink` | `vertical` | Interactive | Vue 3 / TS / TW3 / Vite 5 | Netlify | Placeholder | 25% | Low |
| 5 | `labs.amulet.ink` | `vertical` | Labs | Vue 3 / TS / TW3 / Vite 5 | Netlify | Active | 35% | **High** |
| 6 | `portfolio.amulet.ink` | `vertical` | Labs | Scaffold → Build | Netlify | Planned | 10% | Medium |
| 7 | `press.amulet.ink` | `vertical` | Press | Vue 3 / TS / TW3 / Vite 5 | Netlify | Placeholder | 25% | Low |
| 8 | `studio.amulet.ink` | `vertical` | Studio | Vue 3 / TS / TW3 / Vite 5 | Netlify | Placeholder | 25% | Low |
| 9 | `workshop.amulet.ink` | `vertical` | Workshop | Vue 3 / TS / TW3 / Vite 5 | Netlify | Placeholder | 25% | Low |
| 10 | `AndrewPassanisi.com` | `client` | N/A | Vue 3 / TS / TW3 / Vite 4 / Pinia | Vercel | Completed | 40% | Medium |
| 11 | `GreylineResearch.com` | `vertical` | Greyline | Vue 3 / TS / TW3 / Vite 5 / pnpm mono | Netlify | Active | 35% | **High** |
| 12 | `library.amulet.ink` | `internal` | cross-cutting | Vue 3 / TS / TW3 / Vite 5 / Zod / Auth | Netlify | Active | 75% | **High** |
| 13 | `Flashforge` | `product/cli` | cross-cutting | TS / Commander / Vitest | CLI (none) | Active | 85% | Low |
| 14 | `hex.amulet.ink` | `product/library` | cross-cutting | TS / Vite 6 / Vitest / SB 10 | Netlify | Active | 60% | Medium |
| 15 | `rig.amulet.ink` | `product/library` | cross-cutting | Vue 3 / TS / Vite 6 / Vitest / SB 10 | Netlify | Active | 60% | Medium |

---

## Repo Taxonomy

| Category | Tag | What It Is |
|----------|-----|------------|
| `vertical` | `amulet-vertical` | Sites and apps for a specific business vertical under the Amulet Labs brand |
| `product/library` | `amulet-product-library` | Reusable packages, SDKs, modules |
| `product/api` | `amulet-product-api` | APIs, microservices, backends |
| `product/cli` | `amulet-product-cli` | Command-line tools and scripts |
| `client` | `amulet-client` | Client engagement deliverables |
| `platform` | `amulet-platform` | Shared infrastructure consumed by multiple verticals |
| `internal` | `amulet-internal` | Internal ops tools, not client- or customer-facing |
| `docs` | `amulet-docs` | Documentation-first repos |

---

## Priority Timeline

| Priority | Timeline | Focus | Steps |
|---|---|---|---|
| **P0** | This week | Secrets verification, branch rename, security checklist, org SECURITY.md | 1–6 |
| **P1** | This month | Foundation files, CI/CD, solo-operator stabilization, critical accounts | 7–15, 34–39 |
| **P2** | This quarter | New site builds, READMEs, Vault restructure, design system, testing, accessibility/privacy | 16–33 |
| **P3** | Next quarter | Tailwind 4 migration, attorney review of legal docs, SOC 2 readiness assessment | Legal finalization, TW4, platform extraction |
| **P4** | 6–12 months | Sentry/monitoring, full test coverage, advanced compliance, performance budgets | Observability, structured logging, uptime |
| **P5** | Year 2–5 | Multi-team ops, financial modeling, hiring plan activation, scale governance | Per `09-Growth/` triggers |

---

## PHASE 0: Immediate Security (P0 — This Week)

### Step 1: Verify `.env` not in git history

**Repo:** `library.amulet.ink`
**Action:** Run `git log --all --diff-filter=A -- .env` in the library repo. The `.env` file contains real OAuth secrets (client ID, client secret, session secret). If it was ever committed, rotate all three immediately: regenerate the GitHub OAuth App, generate a new session secret, and update Netlify env vars.
**Risk:** CRITICAL if committed; mitigated if `.gitignore` caught it from the start.

### Step 2: Add org-level SECURITY.md

**Repo:** `.github`
**Action:** Create `SECURITY.md` with vulnerability reporting policy for all repos. Contact: `hello@amulet.ink`. Reference `library.amulet.ink/SECURITY.md` for the detailed auth security model.
**Reason:** Only `library.amulet.ink` has a SECURITY.md. The org needs a default for all repos.

### Step 3: Complete account-registry security checklist

**Vault:** `00-Plan/account-registry.md`
**Action:** All 6 security items are currently unchecked:

- [ ] Proton Pass fully populated
- [ ] TOTP on every account
- [ ] Recovery codes saved offline
- [ ] Emergency access configured
- [ ] VPN for sensitive operations
- [ ] Greyline IP/identity separation

### Step 4: Rename library.amulet.ink branch to `main`

**Repo:** `library.amulet.ink`
**Action:**

1. `git branch -m master main && git push -u origin main`
2. Update default branch in GitHub repo settings
3. Update `ci.yml` — change `branches: [master]` to `branches: [main]`
4. Update Netlify build settings if production branch configured as `master`
5. Verify Netlify Functions deployment still works

### Step 5: Fix library.amulet.ink CI pipeline

**Repo:** `library.amulet.ink`
**File:** `.github/workflows/ci.yml`
**Action:** Add `pnpm test` step. Currently only does type-check → lint → build.

### Step 6: Normalize Flashforge remote to SSH

**Repo:** `Flashforge`
**Action:** `git remote set-url origin git@github.com:Amulet-Laboratories/Flashforge.git`
**Reason:** Only repo using HTTPS while all 14 others use SSH.

---

## PHASE 1: Foundation Files (P1 — This Month)

### Step 7: Add LICENSE to all 14 repos missing it

Only `Flashforge` has a LICENSE file (MIT). Apply MIT for all platform/product/vertical repos. For `AndrewPassanisi.com`, document IP terms (client deliverable — IP assigned to client). For Greyline, use MIT or proprietary depending on public release intent.

### Step 8: Add CODEOWNERS to every repo

None exist anywhere. Set `* @[github-username]` as default owner. Enables PR review enforcement with branch protection.

### Step 9: Add SECURITY.md to remaining 13 repos

Lightweight version linking to org-level one (step 2) with project-specific notes.

### Step 10: Add .env.example where needed

Only `library.amulet.ink` has one. Most ARMS sites have zero env vars — their `.env.example` would say `# No environment variables required`.

### Step 11: Add project-specific CONTRIBUTING.md

The org-level `.github/CONTRIBUTING.md` covers general standards. Project-specific ones needed for: `hex.amulet.ink` (library publishing), `rig.amulet.ink` (component dev), `GreylineResearch.com` (monorepo commands), `library.amulet.ink` (auth/serverless).

### Step 12: Create or backfill CHANGELOG.md

All repos. Hex and Rig changelogs exist but are stale — show `[0.0.0]` while READMEs claim `v1.1.0`. Backfill from git history. Keep a Changelog format.

---

## PHASE 2: CI/CD Rollout (P1 — This Month)

### Step 13: Create reusable GitHub Actions workflow template

**Repo:** `.github`
**Pipeline:** checkout → pnpm/action-setup@v4 → setup-node@v4 (Node 22) → `pnpm install --frozen-lockfile` → `pnpm type-check` → `pnpm lint` → `pnpm test` (if exists) → `pnpm build` → `pnpm audit --audit-level=moderate`.

### Step 14: Deploy CI to all active repos

Priority order:

1. `labs.amulet.ink` — revenue engine, highest business risk
2. `hex.amulet.ink` + `rig.amulet.ink` — shared libraries, breakage has blast radius
3. `amulet.ink` — public-facing hub
4. `GreylineResearch.com` — active vertical with monorepo
5. `AndrewPassanisi.com` — completed but live
6. Remaining ARMS placeholder sites
7. `Flashforge` — well-tested locally but no CI

### Step 15: Enable branch protection on `main`

All repos: require PR reviews, require CI status checks, require branch to be up-to-date.

---

## PHASE 3: Dependency & Version Alignment (P1 — This Month)

### Step 16: Align Hex Tailwind peer dep to `^3.4.0`

Currently declares `^4.0.0` but every consuming project uses TW3. Config fix, not code change.

### Step 17: Standardize ESLint to v9 flat config

Flashforge is the only holdout using ESLint 8 with `.eslintrc.json`. Migrate to `eslint.config.js`.

### Step 18: Upgrade AndrewPassanisi.com

- Vite 4.3.9 → Vite 5
- Tailwind `^3.3.2` → `^3.4.0`
- Fix Husky hooks — `pre-push` references `yarn build` but project uses pnpm
- Fix README — Netlify badge but deploys to Vercel

### Step 19: Fix Flashforge Makefile

All `npm` references → `pnpm`.

---

## PHASE 4: New Site Concepts (P2 — This Quarter)

### Step 20: amuletlabs.org — The Professional Front

**Purpose:** Public-facing organizational identity. Where `amulet.ink` is the creative umbrella (the alchemist's tower), `amuletlabs.org` is the boardroom — clean, authoritative, business-ready. The URL for contracts, proposals, LinkedIn.

**Sections:**

- **Hero** — "Amulet Laboratories" + positioning: "Software, design, and digital craft for people who notice the difference."
- **What We Do** — Four Labs services with scope and pricing, linking to intake form on `labs.amulet.ink`
- **The Enterprise** — Five-imprint structure explained as creative enterprise model
- **Work** — 2–3 case study highlights from `portfolio.amulet.ink`
- **About** — Founder, mission, values. Solo today, built to scale.
- **Contact** — Netlify Forms, `hello@amulet.ink`, GitHub org link
- **Footer** — Legal links, all imprint URLs, copyright

**Visual:** Same Amulet palette (dark/bronze/cream) dialed toward restraint. Crimson Text serif headings, generous whitespace, no playful animation.

**Stack:** Vue 3, TypeScript, Tailwind 3 (shared preset from Hex), Vite 5, Netlify.

**Differentiation:**

| Site | Role | Tone |
|---|---|---|
| `amulet.ink` | Creative umbrella, the tower | Mysterious, atmospheric, inviting |
| `amuletlabs.org` | Business identity, the boardroom | Authoritative, precise, professional |
| `labs.amulet.ink` | Service menu + intake form | Direct, craft-focused, transactional |
| `portfolio.amulet.ink` | Work showcase | Outcome-oriented, visual, evidence-based |

### Step 21: portfolio.amulet.ink — The Work Showcase

**Purpose:** Curated gallery of all delivered and shipped work.

**Sections:**

- **Hero** — "The Work" — filterable grid by category: Web Dev, Branding, Internal Product, Creative
- **Case Studies:**
  - **AndrewPassanisi.com** — Personal portfolio/resume. Vue 3 + TS + Tailwind, Vercel. Security headers, responsive, component architecture.
  - **Greyline Research** — Corporate intelligence platform. pnpm monorepo, shared TS packages, marketing + notebook. *Present engineering achievement, not operational nature.*
  - **Hex Design System** — 87 CSS custom properties, 5 themes, WCAG contrast utilities.
  - **Rig Component Library** — 17 Vue 3 components, WCAG AAA, 138 tests.
  - **Flashforge** — Linux workstation provisioner. 246 tests, audit pipeline, hardware-aware.
  - **Amulet Vault** — Operational knowledge management. GitHub OAuth, Netlify Functions, Markdown pipeline.
- **Process Overview** — Discovery → Architecture → Build → Test → Deploy → Support
- **Technologies** — Stack grid with brief justifications

**Visual:** Gallery-driven — larger images, horizontal case study cards, dark backgrounds. Each study: title, one-liner, tech badges, screenshots, outcome paragraph, "View Live" link.

**Stack:** Same as amuletlabs.org. Static content, case studies as Vue components or build-time Markdown.

---

## PHASE 5: README Standardization (P2 — This Quarter)

### Step 22: Create README template

Store in `.github/README-TEMPLATE.md` and as Vault template. Full structure per the spec: Overview, Status table, Architecture, Tech Stack, Getting Started, API Reference, Usage, Deployment, Data & Privacy, Security, Accessibility, Testing, Project Structure, Contributing, Related Resources, Changelog, License.

### Step 23: Rewrite all 15 READMEs

Priority: library → Flashforge → hex/rig → labs → amulet.ink → Greyline → Andrew → new builds → placeholders.

### Step 24: Fix workspace README

Directory names don't match filesystem (`imprints/` vs `1 - ARMS/`). Doesn't mention Flashforge. Update to match reality.

---

## PHASE 6: Vault Restructure (P2 — This Quarter)

### Gap Analysis

| Target Section | Current Equivalent | Status |
|---|---|---|
| `00-Company/` | `00-Plan/` + `04-Brand/` | Partial — consolidate |
| `01-Legal/` | `02-Contracts/` + `08-Legal/` | Partial — merge + expand |
| `02-Operations/` | `01-Operations/` | Partial — missing runbook, onboarding, vendors |
| `03-Technical/` | `09-Reference/` + `10-Testing/` | Partial — missing infra map, domain inventory, ADRs |
| `04-Security/` | **Missing entirely** | Create |
| `05-Privacy/` | Draft privacy-policy only | Create |
| `06-Clients/` | `05-ClientWork/` + `03-Greyline/` | Restructure |
| `07-Financial/` | YAML schemas only | Create |
| `08-Risk/` | **Missing entirely** | Create |
| `09-Growth/` | `06-Creative/` (partial) | Create |
| `10-Verticals/` | **Missing entirely** | Create |
| `11-Marketing/` | Email docs in `00-Plan/` | Create |

### Migration (incremental, never delete)

- **Week 1:** Create 7 missing sections with stub documents (status: stub, trigger field)
- **Week 2:** Consolidate `00-Plan/` + `04-Brand/` → `00-Company/`
- **Week 3:** Merge `02-Contracts/` + `08-Legal/` → `01-Legal/`
- **Week 4:** Build `03-Technical/` from `09-Reference/` + `10-Testing/`. Move Greyline to `10-Verticals/greyline/`
- **Week 5:** Populate highest-priority stubs
- **Ongoing:** Old folders kept as aliases until all cross-references updated, then archived

### Step 25: Priority Vault documents to write

- `04-Security/security-policy.md`
- `04-Security/secrets-management.md`
- `04-Security/access-control.md`
- `08-Risk/business-continuity.md` (30-day absence plan)
- `08-Risk/bus-factor-analysis.md`
- `02-Operations/daily-operations-runbook.md`
- `10-Verticals/_index.md` (all 6 verticals)
- `10-Verticals/greyline/overview.md`

---

## PHASE 7: Design System Integration (P2 — This Quarter)

### Step 26: Extract shared Tailwind 3 preset from Hex

Same brand tokens (7 colors, 3 font families, keyframes, transitions) copy-pasted across all 6 ARMS `tailwind.config.ts` files. Create exportable Tailwind preset in `@amulet-laboratories/hex`. Single source of truth.

### Step 27: Integrate Hex + Rig into ARMS sites

1. `amulet.ink` — pilot: install hex for tokens via preset
2. `amuletlabs.org` — new build, consume hex + rig from the start
3. `portfolio.amulet.ink` — new build, same approach
4. `labs.amulet.ink` — migrate to rig components
5. Placeholder sites — swap to rig components

---

## PHASE 8: Testing & Quality (P2 — This Quarter)

### Step 28: Add test suites to 12 untested repos

- ARMS placeholders: build succeeds, no TS errors
- `labs.amulet.ink`: form rendering, validation, submission mock
- `library.amulet.ink`: auth flow, document rendering, search, CSRF
- `GreylineResearch.com`: shared package exports, type correctness, utilities
- `AndrewPassanisi.com`: build, route resolution, component rendering
- New builds: write tests alongside development

### Step 29: Fix Flashforge test issues

~30/246 tests fail from singleton state bleed and logger init timing. Refactor singletons for test isolation.

### Step 30: Fix Flashforge code issues

- Add `apt-get install` regex alongside `apt install` in `manifest.ts`
- Remove or use `_stepName` parameter in `extractManualInstalls`
- Create missing `PHASES.md` that README links to

---

## PHASE 9: Accessibility, Privacy & Security Hardening (P2 — This Quarter)

### Step 31: WCAG 2.1 AA audit on all user-facing sites

Semantic HTML, keyboard nav, color contrast, alt text, form labels, ARIA, zoom, responsive. Rig adoption (step 27) lifts compliance automatically.

### Step 32: Data mapping

- `labs.amulet.ink` — Netlify Forms: name, company, project, timeline, budget
- `library.amulet.ink` — GitHub OAuth: user ID, username (JWT, 1-day, no server persistence)
- `AndrewPassanisi.com` — none
- Fathom Analytics — verify which sites include it
- Greyline notebook — needs data map when stores implemented

### Step 33: Security hardening per repo

- HTTPS enforcement verification
- Security headers on all deployed sites (CSP, HSTS, X-Frame-Options, etc.)
- GitHub Actions SHA pinning (currently tag references)
- `pnpm audit` in every repo with a lockfile

---

## PHASE 10: Solo Operator Stabilization (P1 — This Month)

### Step 34: Daily/weekly/monthly operations runbook

- **Daily:** Deploy status, email, Fathom analytics
- **Weekly:** Dependency alerts, open issues, client pipeline, Vault freshness
- **Monthly:** Domain/SSL expirations, vendor costs, backup verification
- **Quarterly:** Security review, rate card review, capacity assessment, State of the Tower review

### Step 35: 30-day absence plan

- **Autonomous:** All static sites (Netlify/Vercel), GitHub repos, Proton Mail
- **At-risk:** Domain renewals, active client deadlines, OAuth secret expiry
- **Emergency access:** Sealed envelope with: GitHub org, Netlify, Vercel, domain registrar, Proton Pass
- **Trusted contact:** Identified person with emergency plan + client templates
- **Templates:** "Delayed response," "temporary pause," "emergency handoff"

### Step 36: Automation priorities

1. CI/CD on all repos (steps 13–15)
2. Dependabot/Renovate for dependency PRs
3. Netlify deploy previews on PRs
4. Domain expiration monitoring
5. Vault freshness alerting (command center Dataview already detects 90+ day stale docs)

### Step 37: Cognitive load map

- How each Netlify site connects to GitHub repo and branch
- DNS config for all `*.amulet.ink` subdomains + `amuletlabs.org` + client domains
- OAuth secret rotation procedure (step-by-step)
- Client billing/invoicing procedures
- Per-site deployment procedures beyond "push to main"
- Greyline ethics/decline criteria completeness check

### Step 38: Activate critical accounts

- Mercury (banking)
- Wave (invoicing)
- IRS EIN
- FTB registration
- Sentry and Supabase deferred to P2

### Step 39: Critical path protection

Ranked by failure impact:

1. `labs.amulet.ink` — revenue engine. Down = leads stop.
2. `library.amulet.ink` — ops command center. Auth breaks = ops visibility lost.
3. `GreylineResearch.com` — active vertical with client-facing presence.
4. `amulet.ink` — brand hub, gateway to all imprints.
5. `hex.amulet.ink` / `rig.amulet.ink` — shared infra. Breakage blocks downstream.

These get priority for documentation, testing, monitoring, backup, and CI/CD.

---

## Verification

- **Security:** `git log --all --diff-filter=A -- .env` in library. `pnpm audit` in every repo. Verify branch protection via GitHub API.
- **CI/CD:** Test PR in each repo after deploying workflows — all checks green.
- **Foundation files:** Script checking each repo for: README.md, CHANGELOG.md, LICENSE, SECURITY.md, CODEOWNERS, .env.example, CONTRIBUTING.md.
- **Vault:** Command center Dataview queries verify all 12 sections exist with valid frontmatter.
- **Accessibility:** Lighthouse CI targeting >= 90 accessibility score on all public-facing sites.
- **Testing:** `pnpm test` pass/fail and coverage per repo. Target: zero failures, 60%+ coverage on active repos with logic.
- **Branch rename:** After renaming library to `main`, verify CI triggers, Netlify deploys, local clones updated.

---

## Standard Files Required Per Repo

| File | Purpose |
|------|---------|
| `README.md` | Per README template |
| `CHANGELOG.md` | Keep a Changelog format |
| `LICENSE` | MIT for platform/product/vertical; IP terms for client |
| `SECURITY.md` | Vulnerability reporting, link to org-level |
| `CODEOWNERS` | PR review routing |
| `.env.example` | Every env var documented, no real values |
| `CONTRIBUTING.md` | Branch strategy, PR process, code style |

---

## Working Rules

- **Never delete anything.** Archive, restructure, consolidate — never destroy.
- **Ask before assuming.** Unclear? Ask. Undocumented? Flag.
- **Be specific.** Not "improve security." Say "add rate limiting to `/api/auth` in repo X."
- **Think in systems.** Cross-cutting fixes beat per-repo fixes.
- **Document as you go.** The audit leaves the Vault better than it found it.
- **Write for the future team.** But make it useful today.
- **Stubs are victories.** A labeled gap with a trigger beats an invisible gap.
- **Honest over aspirational.** If it's not done, say "not yet implemented."
- **README is the front door.** Clone → read README → understand everything.
- **Quality takes time. You have time. Use it.**
