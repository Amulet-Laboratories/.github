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
                 │                      │                    ▲
          deploy preview          release PR            1st & 15th,
          (verify here)          + its preview            on a click
```

**Three builds per change, and no more.** A PR into `develop` builds a preview; merging
it builds nothing; the release PR builds one preview; merging that deploys production.

1. Branch from `develop`, open a PR into `develop`.
2. CI runs, and Netlify builds a **deploy preview** for the PR. Verify there —
   some things only reproduce on Netlify's edge (trailing-slash handling, header
   rules, redirects); a local `dist/` build cannot show you those.
3. Merge to `develop`. **Nothing builds** — `develop` is not in any site's
   `allowed_branches`, so work simply accumulates. Verification already happened on
   the PR preview in step 2; a persistent staging site would only add a build per
   merge for a view the preview already gave you.
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

Then set `develop` as the repo's **default branch** on GitHub:

```bash
gh api -X PATCH repos/Amulet-Laboratories/<repo> -f default_branch=develop
```

**This is load-bearing, not a convenience.** GitHub only fires `schedule` events
for workflows that exist on the default branch — *"This event will only trigger a
workflow run if the workflow file exists on the default branch."* Leave the default
as `main` with the caller on `develop` and the cron never runs, with no error
anywhere: `gh workflow list` simply omits it. Verify after switching:

```bash
gh workflow list | grep 'Release train'     # must appear, and say active
```

Netlify's production branch is a separate setting and stays `main`, so this does
not change what deploys. It also makes new PRs target `develop` by default.

## Operator steps — these cannot be done from a repo

**1. Nothing to do in Netlify — verified 2026-08-02.**

Every site already has `build_settings.allowed_branches: ["main"]`, so branch deploys
have never run: the deploy history shows only `production` and `deploy-preview`
contexts. There was no per-branch build waste to cut, and **`develop` must stay out of
`allowed_branches`** — adding it would create a build on every merge to `develop`,
which is the opposite of why this process exists.

The `[context.branch-deploy]` and `[context.develop]` blocks in each `netlify.toml`
are therefore inert. **Leave them in.** They are the safety net if branch deploys are
ever switched on: without them a branch build would inherit production configuration
and fire the **live Fathom ID** into the estate's only measurement.

**2. Let Actions open pull requests. Without this the train cannot run at all.**

The org currently sets `default_workflow_permissions: read`, so a workflow's
`GITHUB_TOKEN` cannot write anything — and opening the release PR fails with:

> GitHub Actions is not permitted to create or approve pull requests

Both toggles are needed, and the org policy overrides the repo one, so the org is
where it has to change (a repo-level `PUT` returns *"Write permissions for
workflows are disabled by the organization"*):

> Organization → Settings → Actions → General → Workflow permissions
> → **Read and write permissions**
> → tick **Allow GitHub Actions to create and approve pull requests**

Needs org-admin; `gh` also needs `admin:org` before it can read or set this.
Verify by dispatching the train — it should open a PR rather than fail:

```bash
gh workflow run release-train.yml --ref develop
```

**3. `gh pr merge` will refuse the PR that adds these workflows.**

The CLI's OAuth token lacks the `workflow` scope, so any PR touching
`.github/workflows/` fails with *"refusing to allow an OAuth App to create or
update workflow…"*. Either:

```bash
gh auth refresh -h github.com -s workflow    # interactive
```

or merge locally and `git push` over SSH, which is not subject to the scope check.

## Why the claims in this file are checked

Three steps in an earlier version of this document described something other than
what the system does: a `netlify.toml` block said to control whether branches build
(it only configures builds that were already off), a staging URL that has never
existed, and an operator task to cut branch-deploy waste that was never being spent.

None of that was careless. **Writing a step down produces the same confidence as
verifying it, and prose has nothing that fails.** A documented claim is an
unexecuted assertion.

So the load-bearing ones execute. `scripts/verify-process.mjs` asserts them, and the
release train runs it at the one moment someone is about to act on this document —
reporting drift **in the PR body**, where it gets read.

```bash
GH_TOKEN=$(gh auth token) NETLIFY_AUTH_TOKEN=… node scripts/verify-process.mjs
```

It reports three outcomes, and the third is the point: `PASS`, `FAIL`, and
**`UNKNOWN`** for a claim it could not check. UNKNOWN is never counted as a pass —
an unverifiable claim is a sentence nothing is watching. It exits non-zero only on
`FAIL`; blocking a release on a missing token would just teach everyone to skip it.

**Two rules that go with it**, because not everything is checkable:

- **If a claim is checkable, check it. If it is not, do not state it as fact.**
- **Never write an operator step from inference** — only from having run something.
  All three failures above came from reading config and reasoning about what it
  must do.

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
