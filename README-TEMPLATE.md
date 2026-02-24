# Project Name

> One-line description of what this project does.

[![CI](https://github.com/Amulet-Laboratories/REPO_NAME/actions/workflows/ci.yml/badge.svg)](https://github.com/Amulet-Laboratories/REPO_NAME/actions/workflows/ci.yml)

## Overview

Brief paragraph explaining what this project is, why it exists, and who it's for. 2–3 sentences maximum.

## Status

| Item | Value |
|------|-------|
| **Version** | `0.0.0` |
| **Status** | Active / Placeholder / Completed / Planned |
| **Category** | vertical / product-library / product-cli / client / platform / internal |
| **Deploy** | Netlify / Vercel / CLI / None |
| **Live URL** | [example.amulet.ink](https://example.amulet.ink) |

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3 + Hex design tokens
- **Build:** Vite 5
- **Testing:** Vitest
- **Linting:** ESLint 9 (flat config) + Prettier 3
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9

### Setup

```bash
git clone https://github.com/Amulet-Laboratories/REPO_NAME.git
cd REPO_NAME
pnpm install
```

### Development

```bash
pnpm dev
```

### Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview production build |
| `pnpm test` | Run tests |
| `pnpm typecheck` | Type-check with tsc / vue-tsc |
| `pnpm lint` | Lint with ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm clean` | Remove build artifacts |

## Architecture

> Brief explanation of the project's architecture and key design decisions.

```
src/
├── components/       # Description
├── composables/      # Description
├── views/            # Description
├── assets/           # Description
├── router/           # Description
└── main.ts           # Entry point
```

## API Reference

> For libraries: document exported functions, components, or tokens.
> For apps: document API endpoints if applicable.
> Remove this section if not applicable.

## Usage

> Examples of how to use the project, import components, or consume the library.
> Remove this section for standalone apps.

## Deployment

> How the project is deployed, which service, build commands, and any required configuration.

| Environment | URL |
|-------------|-----|
| Production | [example.amulet.ink](https://example.amulet.ink) |
| Preview | Generated per PR |

## Environment Variables

> List all environment variables with descriptions. No real values.
> Remove this section if none are needed.

| Variable | Required | Description |
|----------|----------|-------------|
| `EXAMPLE_VAR` | Yes | Description of what this does |

See [`.env.example`](./.env.example) for the full template.

## Data & Privacy

> What user data does this project collect, store, or process?
> If none: "This project does not collect or store user data."

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability reporting.

## Accessibility

> WCAG compliance level, known issues, and accessibility features.
> Target: WCAG 2.1 AA minimum, AAA where possible.

## Testing

```bash
pnpm test            # Run all tests
pnpm test:watch      # Watch mode
pnpm test:coverage   # With coverage report
```

> Describe testing strategy and current coverage.

## Project Structure

```
REPO_NAME/
├── src/              # Source code
├── public/           # Static assets
├── dist/             # Build output (gitignored)
├── .github/          # CI workflows
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── tailwind.config.ts
└── README.md
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for project-specific guidelines and the [org-level contributing guide](https://github.com/Amulet-Laboratories/.github/blob/main/CONTRIBUTING.md) for general standards.

## Related Resources

- [Hex Design System](https://hex.amulet.ink) — Design tokens and themes
- [Rig Component Library](https://rig.amulet.ink) — Vue 3 UI components
- [Amulet Laboratories](https://github.com/Amulet-Laboratories) — GitHub organization

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

MIT — see [LICENSE](./LICENSE) for details.
