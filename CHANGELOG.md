# Changelog

All notable changes to the Amulet Laboratories organization infrastructure will be documented in this file.

This project follows [Semantic Versioning](https://semver.org/).

## [1.2.0] — 2026-02-26

### Added

- `dependabot.yml` — Dependabot configuration for automated GitHub Actions dependency updates. Weekly schedule (Mondays), 5-PR limit, `ci:` commit prefix.

## [1.1.0] — 2026-02-25

### Changed

- `profile/README.md` — added Getting Started section with setup breadcrumbs and key repo links
- `README.md` — removed AUDIT-PLAN.md from contents table

### Removed

- `AUDIT-PLAN.md` — session artifact, no longer operational
- `TODO.md` — session artifact, tasks tracked elsewhere
- `.env.example` — empty placeholder, no env vars required

## [1.0.0] — 2026-02-24

### Added

Full infrastructure audit and stabilization across all 15 repositories.

#### Wave 1 — Security & Foundation

- `SECURITY.md` added to all 15 repos (vulnerability reporting via hello@amulet.ink).
- `LICENSE` added to all 15 repos (Proprietary for Amulet properties, MIT for GreylineResearch.com).
- `CODEOWNERS` added to all 15 repos (`@apassanisi` as default owner).
- `.env.example` added to all repos with environment variables.
- `CODE_OF_CONDUCT.md` — org-wide Contributor Covenant 2.1.
- `CONTRIBUTING.md` — org-wide contribution guide (also added to hex, rig, library, Greyline).

#### Wave 2 — CI Standardization & Code Fixes

- GitHub Actions CI workflows created for 11 repos (type-check → lint → test → build → audit).
- All CI actions SHA-pinned (checkout v4, pnpm/action-setup v4, setup-node v4).
- Flashforge ESLint migrated from v8 `.eslintrc.json` to v9 flat config `eslint.config.js`.
- Flashforge `Makefile` pointed to new ESLint config.
- AndrewPassanisi.com Husky pre-push hook fixed (`yarn build` → `pnpm build`).
- workshop.amulet.ink duplicate `pnpm format` script row removed from README.

#### Wave 3 — Dependency Fixes & Documentation

- pnpm lockfiles regenerated across all repos.
- `.github/profile/README.md` expanded with imprints table, shared libraries, client work, tools, contact.
- `.github/README.md` created (repo-level README for the .github repo itself).
- `README-TEMPLATE.md` created (org-wide README standard).

#### Wave 4 — Version Upgrades, Shared Config & Test Scaffolding

- Vite upgraded to v6 on 6 ARMS sites (amulet.ink, labs, interactive, press, studio, workshop).
- Shared Tailwind preset created in `hex.amulet.ink/src/tailwind/preset.ts` (7 brand colors, 3 fonts, transitions, fade-up animation).
- 6 ARMS sites configured to consume `@amulet-laboratories/hex/tailwind` preset.
- Vitest scaffolded across 11 previously untested packages with placeholder tests.
- `hex.amulet.ink` package.json exports updated with `"./tailwind"` entry.

#### Wave 5 — README Rewrites

- All 15 repository READMEs standardized with consistent structure:
  status table, tech stack, prerequisites, getting started, scripts reference,
  environment variables, project structure, architecture, data & privacy,
  accessibility, testing, deployment, contributing, license, changelog.

#### Wave 6 — Solo Operator Documentation

Five operational documents created in `AmuletLabsVault/01-Operations/`:

- `daily-operations-runbook.md` — daily/weekly/monthly/quarterly cadences, incident response.
- `30-day-absence-plan.md` — autonomous systems, sealed envelope, 4 communication templates.
- `cognitive-load-map.md` — deployment map, DNS, secrets, billing, per-site procedures.
- `data-mapping.md` — all 15 repos mapped for data handling, Netlify Forms, OAuth.
- `critical-path-protection.md` — 5 priority tiers, protection checklists, recovery procedures.

#### Wave 7 — Vault Restructure & Link Fixes

- Fixed 8 stale `blob/master` → `blob/main` links across repo READMEs.
- Fixed Vault README deploy reference (`master` → `main`).
- Added Flashforge to Vault sites table.
- Created 5 new Vault sections with 15 documents:
  - `04-Security/` — security-policy, secrets-management, access-control.
  - `05-Privacy/` — data-practices, compliance-checklist.
  - `08-Risk/` — business-continuity, bus-factor-analysis.
  - `09-Growth/` — growth-triggers.
  - `10-Verticals/` — master index, Greyline overview.
- Updated Vault `_index.md` with all new sections.
- Created `TODO.md` — remaining manual/external tasks + 53 post-audit improvements.

### Repositories Touched

| Repository | Changes |
|------------|---------|
| `.github` | README, profile/README, SECURITY, LICENSE, CODEOWNERS, .env.example, README-TEMPLATE, TODO, workflow-templates, CHANGELOG |
| `amulet.ink` | CI, README, package.json, tailwind.config, CHANGELOG, vitest, tests, foundation files |
| `AmuletLabs.org` | README, CHANGELOG, foundation files |
| `AndrewPassanisi.com` | CI, README, package.json, husky fix, CHANGELOG, vitest, tests, foundation files |
| `Flashforge` | ESLint 9 migration, Makefile, README, package.json, pnpm-lock, CI, CHANGELOG, PHASES, foundation files |
| `GreylineResearch.com` | CI, README, package.json (×4), CHANGELOG, vitest (×3), tests (×3), foundation files |
| `hex.amulet.ink` | CHANGELOG, README, package.json, Tailwind preset, CI, foundation files |
| `interactive.amulet.ink` | README, package.json, tailwind.config, CI, CHANGELOG, vitest, tests, foundation files |
| `labs.amulet.ink` | CI, README, package.json, tailwind.config, CHANGELOG, vitest, tests, foundation files |
| `library.amulet.ink` | CI, Vault (README, _index, lint.yml, 5 ops docs, 5 new sections), README, package.json, vitest, tests, foundation files |
| `portfolio.amulet.ink` | README, CHANGELOG, foundation files |
| `press.amulet.ink` | CI, README, package.json, tailwind.config, CHANGELOG, vitest, tests, foundation files |
| `rig.amulet.ink` | CHANGELOG, README, CI, foundation files |
| `studio.amulet.ink` | CI, README, package.json, tailwind.config, CHANGELOG, vitest, tests, foundation files |
| `workshop.amulet.ink` | CI, README, package.json, tailwind.config, CHANGELOG, vitest, tests, foundation files |
