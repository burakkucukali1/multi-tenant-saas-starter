# Renovate (ADR-0030)

Configuration: [`renovate.json`](../renovate.json) at the repository root.

## Owner setup (one time)

1. Install the [Mend Renovate](https://github.com/apps/renovate) GitHub App on this repository (or org).
2. Enable the **Dependency dashboard** issue (Renovate creates it on first run).
3. Ensure Renovate pull requests are subject to the same **branch protection** and **CI** checks as other PRs (see [`branch-protection.md`](branch-protection.md)).

No repository secrets are required for npm lockfile updates.

## Update strategy

| Type               | Behavior                                                |
| ------------------ | ------------------------------------------------------- |
| **Schedule**       | Weekly (Monday before 06:00 UTC) + lockfile maintenance |
| **Minor / patch**  | Single grouped PR (`non-major dependencies`)            |
| **Major**          | One PR per major bump (`:separateMajorMinor`)           |
| **GitHub Actions** | Grouped digest pin updates                              |
| **Automerge**      | Off — human merge after green CI                        |

## Approval labels (informational)

Renovate adds labels for review routing; they do not bypass branch protection.

| Label          | When                                                        |
| -------------- | ----------------------------------------------------------- |
| `dependencies` | All Renovate PRs                                            |
| `security`     | OSV / vulnerability alerts                                  |
| `approval-L3`  | Major Next.js, React, eslint-config-next, vendor SDK majors |
| `framework`    | Next.js / React major bumps                                 |

## CI compatibility

Renovate opens normal pull requests → the **CI** workflow (`.github/workflows/ci.yml`) runs automatically:

- `pnpm install --frozen-lockfile` validates the updated lockfile.
- Quality and integration jobs must pass before merge.

If a grouped update fails CI, prefer splitting by reverting the group in the dashboard or closing and letting Renovate open narrower PRs (temporarily adjust `packageRules` only with L1 approval).

## Manual pins (not managed by Renovate)

- **Node.js** — `.node-version` / `engines.node` (ADR-0034, L3 to change)
- **`packageManager`** — `pnpm@12.6.0` in `package.json` (manual bump with CI alignment)

## Related ADRs

- [ADR-0030](../.ai/decisions/0030-package-dependency-policy.md) — policy
- [ADR-0034](../.ai/decisions/0034-framework-version-pins.md) — Next, React, Node, pnpm pins
- [ADR-0021](../.ai/decisions/0021-ranked-module-dependency-map.md) — SDK placement (unchanged by Renovate)
