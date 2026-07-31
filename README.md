# .github

> Org-level CI, shared workflows, and search-engine plumbing for every Amulet Laboratories repository.

This repository holds nothing that ships. It holds the machinery that keeps the other
twenty-six honest: reusable GitHub Actions workflows, the IndexNow submitter, and the
smoke tests that run against the content network after a deploy.

## Status

**As of 2026-07-28.** Stable and in use. Changes here are rare and always land because
something downstream needed them — this is infrastructure, not a project with a roadmap.

## What's here

| Path | What |
|---|---|
| `.github/workflows/` | reusable workflows called by the other repos via `workflow_call` |
| `NETWORK.md` | the internal front door to the content network — start here for how the sites relate |

## Usage

Downstream repositories reference the shared workflows rather than copying them:

```yaml
jobs:
  ci:
    uses: Amulet-Laboratories/.github/.github/workflows/<name>.yml@main
```

The doubled `.github/.github/` is correct and required by GitHub — the first is the
repository, the second is the directory inside it.

## Conventions

- A fix that belongs to all seven content sites belongs **here**, not copied into each site.
- IndexNow submits to Bing and Yandex only; Google ignores it. Treat it as a nice-to-have.
- This repository is **public**, so everything in it is world-readable. Keep it free of
  anything not meant to be read from outside — no local paths, no private repo inventory.
  Fleet tooling that names every repo lives in the private `workspace` repo instead.
- This file is the *repository's* README, not the organisation's profile page. GitHub
  renders the profile from [`profile/README.md`](profile/README.md) — a different file
  in this same repo, and the only one visitors to the org page ever see.

## License

Copyright (c) 2026 Amulet Laboratories. All rights reserved.
