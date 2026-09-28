# ADR-0021: Ranked Module Dependency Map

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0003, ADR-0012, ADR-0022

## Context

Many workflows touch several features. A flat "features never call each other" rule would push business logic into routes. Unrestricted imports create cycles and hidden dependency graphs.

## Decision

- Every module has a **rank**. A module may import **only modules with a strictly lower rank**, and only through their public `index.ts`. This makes the graph acyclic by construction.
- The allowed edges below are the source of truth, and the dependency-cruiser config is generated from them.
- CI enforces:
  - no cycles
  - no imports that go up in rank or reach deep internal paths
  - no undeclared edges
  - the forbidden pairs listed below

| Rank | Module                                                                                                                | May depend on                                                                                                                                             |
| ---- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0    | `lib/config`, `lib/i18n`, `lib/logger`                                                                                | none                                                                                                                                                      |
| 1    | `lib/db`, `lib/db/platform`, `lib/auth`, `lib/stripe`                                                                 | `lib/config`                                                                                                                                              |
| 5    | `shared/` (design system, utilities)                                                                                  | `lib/config`, `lib/i18n`                                                                                                                                  |
| 10   | `features/audit`                                                                                                      | `lib/db`                                                                                                                                                  |
| 10   | `features/authz`                                                                                                      | `lib/db`                                                                                                                                                  |
| 15   | `platform/access`                                                                                                     | `lib/db/platform`, `lib/auth`, `features/audit`                                                                                                           |
| 20   | `features/identity`                                                                                                   | `lib/db`, `lib/auth`, `features/audit`                                                                                                                    |
| 30   | `features/workspaces`                                                                                                 | `lib/db`, `features/audit`, `features/identity`                                                                                                           |
| 30   | `features/plans`                                                                                                      | `lib/db`                                                                                                                                                  |
| 30   | `features/legal`                                                                                                      | `lib/db`, `features/audit`                                                                                                                                |
| 40   | `features/memberships`                                                                                                | `lib/db`, `features/audit`, `features/authz`, `features/identity`, `features/workspaces`                                                                  |
| 50   | `features/subscriptions`                                                                                              | `lib/db`, `lib/stripe`, `features/audit`, `features/plans`, `features/workspaces`                                                                         |
| 50   | `features/promotions`                                                                                                 | `lib/db`, `lib/stripe`, `features/audit`, `features/plans`                                                                                                |
| 60   | `features/entitlements`                                                                                               | `lib/db`, `features/audit`, `features/plans`, `features/subscriptions`, `features/memberships`                                                            |
| 70   | `features/deals`                                                                                                      | `lib/db/platform`, `lib/stripe`, `features/audit`, `features/entitlements`, `features/subscriptions`, `features/plans`                                    |
| 70   | `features/referrals`                                                                                                  | `lib/db`, `lib/stripe`, `features/audit`, `features/identity`, `features/entitlements`, `features/subscriptions`                                          |
| 75   | `features/tenant-context` (resolves `TenantContext` once per request and mints `WorkspaceScope` from a membership)    | `lib/db`, `lib/auth`, `features/identity`, `features/workspaces`, `features/memberships`, `features/authz`, `features/entitlements`, `features/legal`     |
| 80   | `workflows/*` (onboarding, invitations, ownership-transfer, checkout, plan-change, workspace-lifecycle, user-erasure) | any module ranked below 80. **Never other workflows**                                                                                                     |
| 85   | `platform/*` read models and commands                                                                                 | `lib/db/platform`, `platform/access`, `features/audit`, `shared/`, and features and workflows (commands only, through a platform-minted `WorkspaceScope`) |
| 100  | `app/` routes and layouts                                                                                             | any public API, `shared/`                                                                                                                                 |

Forbidden pairs, regardless of rank:

- `features/authz` and `platform/access` must never import each other.
- The `WorkspaceScope` minting function in `lib/db` may be imported only by `features/tenant-context` and `platform/access`.
- Workflows receive `TenantContext` or `WorkspaceScope` as arguments from their entry point. They never resolve context themselves.
- Nothing outside `platform/` and `features/deals` may import `lib/db/platform`.
- Nothing outside `lib/` may import the Supabase, Clerk, or Stripe SDKs.
- `shared/` never imports `features/`, `workflows/`, or `platform/`.

Ownership inversion is the pattern for breaking cycles. For example, `entitlements` owns grants, and `deals` and `referrals` write grants through the `entitlements` API. `entitlements` therefore never depends on them.

Changing the map is Level 1. Record every change in the changelog below.

## Consequences

- Every dependency is declared and reviewable, and cycles are impossible.
- The map needs upkeep whenever a module is added.
- The pure entitlement resolver and the tier-80 workflows remove the subscription ↔ entitlements cycle (for example, downgrade validation lives in `workflows/plan-change`).

## Alternatives Considered

- Flat features with orchestration in routes: business logic leaks into `app/`.
- Unrestricted feature imports: cycles and hidden coupling.

## Map Changelog

- 2026-09-27: initial map.
- 2026-09-28: add `lib/logger` (rank 0, ADR-0029 / P0-T14).
