# Amulet Laboratories — `.github`

> Organization-wide GitHub configuration: issue templates, PR templates, contributing guidelines, code of conduct, and community health files for all Amulet Laboratories repositories.

![Category](https://img.shields.io/badge/category-platform-c9956d?style=flat-square) ![License](https://img.shields.io/badge/license-MIT-c9956d?style=flat-square)

## Overview

This is the `.github` repository for the [Amulet Laboratories](https://github.com/Amulet-Laboratories) organization. Files placed here apply as defaults across all repositories in the organization. It is a `platform` repo — shared infrastructure consumed by every vertical under Amulet Labs.

## Status

| Attribute | Value |
|-----------|-------|
| Category | `platform` |
| Stage | `active` |
| Vertical | `cross-cutting` |
| Owner | @amulet-labs |
| Vault Docs | [library.amulet.ink/AmuletLabsVault](https://library.amulet.ink/AmuletLabsVault) |
| Deploy Target | GitHub (org-level defaults) |

## Architecture

This repository follows GitHub's [community health files](https://docs.github.com/en/communities/setting-policies-for-your-organization-with-repository-rules/about-required-status-checks) convention. Files stored here serve as organization-wide defaults for repositories that do not define their own.

```
.github/
├── assets/                   # Brand assets (logo, mark, icon)
├── ISSUE_TEMPLATE/           # Issue templates applied org-wide
│   ├── bug_report.md
│   ├── feature_request.md
│   ├── question.md
│   └── security_report.md
├── profile/
│   └── README.md             # GitHub org profile page (amulet.ink)
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CODEOWNERS
├── CONTRIBUTING.md
├── LICENSE
├── pull_request_template.md
├── README.md                 # This file
└── SECURITY.md
```

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
| Config | GitHub Community Health Files | N/A | Org-wide defaults |
| Assets | SVG / PNG | N/A | Brand marks |
| Docs | Markdown | N/A | All documentation |

## Getting Started

### Prerequisites

- Access to the Amulet Laboratories GitHub organization

### Installation

N/A — This repository contains configuration files, not deployable code.

### Environment Variables

N/A — This repository does not require environment variables. See `.env.example` for details.

### Running Locally

N/A — No local runtime.

### Running Tests

N/A — No automated tests. Changes are validated by reviewing GitHub's rendering of templates and markdown files.

## API Reference

N/A — This project exposes no APIs.

## Usage

The files in this repository are automatically applied by GitHub as organization-wide defaults. No action is required by repository maintainers unless they wish to override a default by placing the same file in their own `.github/` directory.

## Deployment

Files are "deployed" by committing to the `main` branch. GitHub automatically picks up changes.

**Rollback**: Revert the relevant commit and push to `main`.

**Post-deploy health check**: Verify templates appear correctly on any org repository's issue/PR creation page.

## Data & Privacy

This project does not collect, store, or process user data.

## Security

This repository contains no secrets, credentials, or sensitive configuration. All files are public community health documents.

To report a security vulnerability in any Amulet Laboratories product, see [SECURITY.md](./SECURITY.md).

## Accessibility

This project has no user interface. All documents are plain Markdown.

## Testing

N/A — No automated test suite. Manually verify that templates render correctly on GitHub after changes.

## Project Structure

See the [Architecture](#architecture) section above for the directory layout.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Related Resources

- [AmuletLabsVault](https://library.amulet.ink/AmuletLabsVault) — Source of truth for all Amulet Labs processes and standards
- [amulet.ink](https://amulet.ink) — Organization home
- [hex.amulet.ink](https://hex.amulet.ink) — Design tokens
- [rig.amulet.ink](https://rig.amulet.ink) — Vue 3 component library

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## License

[MIT](./LICENSE) — Amulet Laboratories © 2026
