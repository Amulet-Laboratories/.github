# Contributing to Amulet Laboratories

Thank you for your interest in contributing to the organization. This is a **private organization** — contributions are restricted to members of Amulet Laboratories.

## Key Principles

We build with:

- **Precision**: Say it once and mean it.
- **Craft**: Details matter. Respect the audience's intelligence.
- **Consistency**: Follow the established patterns and style guides.
- **Purpose**: Every line of code should earn its place.

## For Members

### Getting Started

1. **Workspace setup**: Clone the monorepo and open `amulet.code-workspace` in VS Code
   - Install **PixelFactory Studio** theme when prompted (custom VS Code theme with Amulet colors)
2. **Environment**: Follow the `project-organization.md` guide in the vault for setup details
3. **Dependencies**: We use `pnpm` — install from pnpm-lock.yaml files, never `yarn` or `npm`

### Code Standards

- **Language**: TypeScript with strict mode enabled (`tsconfig.json`)
- **Formatting**: Prettier (ESLint config: `eslint.config.js` — ESLint 9 with flat config)
- **Style**: Tailwind CSS with custom Amulet color system (`tailwind.config.ts`)
- **Framework**: Vue 3 composition API with `<script setup>`
- **Build**: Vite (configured per-project)

See [coding-style.md](../library.amulet.ink/AmuletLabsVault/09-reference/coding-style.md) in the vault for full details.

### Component Design

All UI components should follow:

- **Hex design tokens** (our color/typography system) and **Rig component library** for consistency
- **WCAG AAA accessibility** standards
- **Dark mode first** — all designs assume dark theme
- **Amulet color palette**: `#0f0d0a`, `#c9956d`, `#f5f1ed`, `#2a2620`, `#3d3935`

Design token reference: [hex.amulet.ink](https://hex.amulet.ink)
Component library: [rig.amulet.ink](https://rig.amulet.ink)

### Commit & PR Workflow

1. Create a feature branch: `git checkout -b feature/description`
2. Keep commits focused and descriptive
3. Submit PR with:
   - Clear title and description
   - Link to related issue (if applicable)
   - Screenshots for visual changes
   - Test coverage for new features

### Testing & Quality Gates

- Linting must pass: `pnpm lint`
- Type checking must pass: `pnpm tsc`
- Build must succeed: `pnpm build`
- Tests must pass: `pnpm test` (where applicable)

See [CI-CD-PIPELINE.md](../library.amulet.ink/AmuletLabsVault/10-testing/CI-CD-PIPELINE.md) for full pipeline details.

## Repository Visibility

All repositories in this org follow the **repo-visibility-policy**:

- **Organization repos**: Private (org infrastructure)
- **Client project repos**: Private (unless client approves public)
- **Open source/tools**: Public (when applicable)

Current public repos:

- `hex` — Design tokens and theming
- `rig` — Vue 3 component library

## Questions?

Refer to the Amulet Laboratories Vault (library.amulet.ink) for:

- [master-plan.md](../library.amulet.ink/AmuletLabsVault/00-plan/master-plan.md) — enterprise overview
- [coding-style.md](../library.amulet.ink/AmuletLabsVault/09-reference/coding-style.md) — tech standards
- [client-journey-sop.md](../library.amulet.ink/AmuletLabsVault/01-operations/client-journey-sop.md) — workflow guides

---

**Last updated**: 2026-02-22
Amulet Laboratories © 2026
