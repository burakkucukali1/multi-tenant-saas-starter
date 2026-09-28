# Branch protection for `main` (ADR-0026)

Owner configuration in GitHub — not enforced by the repository alone. Apply these settings after the **CI** workflow has run at least once on `main` so status check names exist.

**Path:** Repository → **Settings** → **Branches** → **Branch protection rules** → **Add rule** (or edit existing rule for `main`).

## Rule target

- **Branch name pattern:** `main`

## Protect matching branches

Enable:

| Setting                                                              | Value                       | Rationale                                                 |
| -------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------- |
| **Require a pull request before merging**                            | On                          | Trunk-based flow; no direct commits to `main`             |
| **Required approvals**                                               | `1` (adjust for team size)  | Human review before merge                                 |
| **Dismiss stale pull request approvals when new commits are pushed** | On                          | Re-review after changes                                   |
| **Require status checks to pass before merging**                     | On                          | CI is the enforcement layer                               |
| **Require branches to be up to date before merging**                 | On                          | Merge against latest `main`                               |
| **Do not allow bypassing the above settings**                        | On for admins (recommended) | Same rules for everyone                                   |
| **Restrict who can push to matching branches**                       | Optional                    | Leave empty to block all direct pushes via PR requirement |
| **Allow force pushes**                                               | **Off**                     | Protect linear history                                    |
| **Allow deletions**                                                  | **Off**                     | Prevent accidental branch deletion                        |

## Required status checks (P0 — current CI workflow)

Select **both** jobs from the **CI** workflow (`.github/workflows/ci.yml`). Names must match GitHub exactly:

| Status check name                 | Job           | Fails on                                                                                              |
| --------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------- |
| `Lint, types, tests, and build`   | `quality`     | Prettier, ESLint, TypeScript, dependency-cruiser, Jest unit, build, Playwright smoke                  |
| `Integration tests (CI Postgres)` | `integration` | Jest integration (real DB when `SUPABASE_TEST_DATABASE_URL` secret is set; otherwise skip smoke only) |

If a check does not appear in the list, merge or push a commit that runs the **CI** workflow on `main`, then reopen branch protection settings.

### Local parity

```bash
pnpm ci:check
pnpm test:e2e:install && CI=true pnpm test:e2e
```

## Renovate pull requests (ADR-0030)

Dependency update PRs use the same required status checks as feature work. Do not bypass reviews for grouped minor/patch PRs without green CI. Major framework bumps (`approval-L3` label) need explicit approval per ADR-0034. See [`.github/renovate.md`](renovate.md).

## Merge strategy

- **Squash merge** only (ADR-0026).
- **Pull request title** = Conventional Commit message (becomes squash commit subject).
- Delete branch after merge (recommended).

## Merge queue (optional)

Not required for P0. Enable later if PR volume makes “up to date” churn costly.

## Future required checks (ADR-0026 — add when implemented)

Wire these into CI and branch protection as they land (mostly P2+):

| Check (planned)                  | Phase / notes |
| -------------------------------- | ------------- |
| Tenant isolation suite           | P2            |
| Authorization matrix             | P2 / P4       |
| Migration + generated types diff | P2 (ADR-0041) |
| i18n key parity                  | P1 / P2       |
| Registry vs seed validation      | P2+           |

Document new check names in this file when jobs are added.

## Related

- [`.github/README.md`](README.md) — CI jobs and repository secrets (placeholders)
- [`.github/pull_request_template.md`](pull_request_template.md) — task ID, approval level, checklist
- [ADR-0026](../.ai/decisions/0026-branching-and-merge-strategy.md) — branching and required checks
- [ADR-0027](../.ai/decisions/0027-progress-tracking-and-ai-workflow.md) — task IDs and progress updates
