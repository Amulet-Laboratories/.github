# Release process

Adopted 2026-08-02. Work accumulates on `develop`; production moves when `main`
moves, on the 1st and the 15th.

## Why this exists

Every merge to `main` triggers a production build on Netlify. Eight properties
plus Rig, several merges a day during a working session, and the build minutes
add up for an estate earning $0. Batching production deploys is the point.

**git-flow was tried here before and abandoned on 2026-07-29**, because `develop`
went stale in every repo — nothing ever promoted it, and in `noosphere` it drifted
two milestones ahead of `main` before anyone noticed. That is the failure mode this
process is built around: **the promotion is scheduled**, so drift shows up as a pull
request in your face rather than as silence.

If you find yourself pushing straight to `main`, the train has stopped working and
this document is the thing to change — not the habit.

## The flow

```
feature branch ──PR──▶ develop ──release train──▶ main ──▶ production
                          │                                    ▲
                          └──▶ staging URL                      │
                              (analytics + Sentry blanked)      │
                                                  1st & 15th, on a click
```

1. Branch from `develop`, open a PR into `develop`.
2. CI runs, and Netlify builds a **deploy preview** for the PR. Verify there —
   some things only reproduce on Netlify's edge (trailing-slash handling, header
   rules, redirects); a local `dist/` build cannot show you those.
3. Merge to `develop`. Netlify builds the **staging** context, which blanks
   `NUXT_PUBLIC_FATHOM_SITE_ID` and `NUXT_PUBLIC_SENTRY_DSN` so staging traffic
   never pollutes production analytics.
4. **The 1st and the 15th, 09:00 UTC**, the release train opens a `develop → main`
   PR listing every commit since the last release. Landing on a weekend does not
   matter — it opens a PR and never merges, so it waits for you.
5. You read it and merge. That merge — and only that merge — deploys production.

Sprints run on the same boundaries — 1st–14th and 15th–end of month. The plan they
draw from is the roadmap's numbered sequence, and each sprint's only artifact is one
entry in the vault's `work/business/log/`. See `work/business/sprints.md`.

Hotfixes do not wait: run the workflow manually and it promotes immediately.

```bash
gh workflow run release-train.yml            # opens the release PR now
```

## Wiring a repo up

Copy `release-train-caller.template.yml` to `<repo>/.github/workflows/release-train.yml`.
It is a thin caller, same shape as each site's `deploy.yml` calling `site-ci.yml`.

Cron fires on the 1st and the 15th. That is **semi-monthly, not fortnightly** —
24 releases a year rather than 26, and the second half of a 31-day month is a
17-day sprint. The trade buys calendar alignment; any date arithmetic in the
roadmap should use 24.

Then create the branch:

```bash
git checkout main && git pull
git checkout -b develop && git push -u origin develop
```

Set `develop` as the repo's default branch on GitHub so PRs target it by default.

## Operator steps — these cannot be done from a repo

**1. Restrict branch deploys, per site, in Netlify.**

This is the actual build-cost lever and it is **not** a `netlify.toml` change.
Deleting `[context.branch-deploy]` does *not* stop branches building — that block
only *configures* those builds. Whether a branch deploys at all is a site setting.

Worse, deleting it would make branch builds inherit production configuration,
which means **the live Fathom ID would fire on branch builds**. The block must stay.

> Site configuration → Build & deploy → Branches and deploy contexts
> → Branch deploys: **Let me add individual branches** → `develop` only

Do this for all seven Nuxt sites and AmuletLabs.org. Deploy previews stay on.

**2. `gh pr merge` will refuse the PR that adds these workflows.**

The CLI's OAuth token lacks the `workflow` scope, so any PR touching
`.github/workflows/` fails with *"refusing to allow an OAuth App to create or
update workflow…"*. Either:

```bash
gh auth refresh -h github.com -s workflow    # interactive
```

or merge locally and `git push` over SSH, which is not subject to the scope check.

## What did not change

- `main` is still what production builds from. Nothing deploys off `develop`.
- Deploy previews stay on. They caught a real defect on 2026-08-02 that no local
  build could reproduce, and they cost far less than a bad production deploy.
- Rig still publishes to npm from a `v*` tag, by trusted publishing. Tag from
  `main` after a release merge, not from `develop`.

## Repos on the train

The nine that deploy or publish: the seven Nuxt content sites, AmuletLabs.org,
and Rig. Everything else — tooling, private repos, the vault — has no production
surface and does not need a cadence.
