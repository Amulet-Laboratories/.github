# .github — Copilot Instructions

## Project

Organization-level GitHub configuration for Amulet Laboratories.
Community health files, reusable CI workflows, issue/PR templates,
and the org profile README.

**ID:** `i-git` | **Category:** internal | **Deploy:** none

## Status

Active — v1.0.0. Stable configuration repo.

## Contents

```
.github/
├── workflows/
│   └── ci.yml              # Reusable CI workflow (called by all 15 repos)
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   ├── feature_request.md
│   └── question.md
├── pull_request_template.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
└── SECURITY.md
profile/
└── README.md               # Org profile page on GitHub
README.md                   # Repo README
README-TEMPLATE.md          # Template for new repo READMEs
CHANGELOG.md
```

## Reusable CI Workflow

`.github/workflows/ci.yml` is the single CI definition consumed by all repos via:

```yaml
uses: Amulet-Laboratories/.github/.github/workflows/ci.yml@main
secrets: inherit
```

Supports `type` parameter: default (vue-app), `monorepo`, `config`.
Uses `--audit-level=critical` for security scans.

## Key Rules

- Changes here affect all 15 repos — test thoroughly
- The CI workflow must handle `PKG_READ_TOKEN` → `NODE_AUTH_TOKEN` mapping
  for GitHub Packages auth (org secrets don't pass through `workflow_call` on Free)
- PR template and issue templates define the contribution workflow
- `README-TEMPLATE.md` is the canonical starting point for new repo READMEs
