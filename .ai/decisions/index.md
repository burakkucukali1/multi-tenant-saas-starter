# Architecture Decision Records

Process: ADR-0001. Load only the ADRs your task needs.

## Accepted

| ADR | Title |
|---|---|
| [0001](0001-record-architecture-decisions.md) | Record architecture decisions |
| [0002](0002-technology-stack.md) | Technology stack |
| [0003](0003-single-app-modular-monolith.md) | Single Next.js app, modular monolith |
| [0004](0004-multi-tenant-model.md) | Multi-tenant model: User, Membership, Workspace |
| [0005](0005-clerk-identity-provider-only.md) | Clerk as identity provider only |
| [0006](0006-path-based-tenant-resolution.md) | Path-based tenant resolution |
| [0007](0007-supabase-access-model.md) | Supabase access model and lockdown |
| [0008](0008-transactional-writes-via-tx-functions.md) | Transactional writes via `tx_*` functions |
| [0009](0009-separate-platform-schema.md) | Separate `platform` schema |
| [0010](0010-tenant-isolation-defense-in-depth.md) | Tenant isolation, defense in depth |
| [0011](0011-database-backed-rbac.md) | Database-backed RBAC, flat roles |
| [0012](0012-platform-administration-isolation.md) | Platform administration isolation |
| [0013](0013-entitlement-based-billing.md) | Entitlement-based billing with Stripe |
| [0014](0014-promo-codes.md) | Promo codes |
| [0015](0015-enterprise-deals.md) | Enterprise deals |
| [0016](0016-referrals.md) | Referrals (reward rules pending) |
| [0017](0017-legal-document-management.md) | Legal document management and acceptance |
| [0018](0018-soft-delete-by-entity-class.md) | Soft delete by entity class, erasure, manual purge |
| [0019](0019-audit-logging.md) | Audit logging |
| [0020](0020-read-time-evaluation-of-time-bound-state.md) | Read-time evaluation of time-bound state |
| [0021](0021-ranked-module-dependency-map.md) | Ranked module dependency map |
| [0022](0022-recursion-prevention.md) | Recursion prevention |
| [0023](0023-design-system-and-branding.md) | Design system and branding |
| [0024](0024-internationalization.md) | Internationalization |
| [0025](0025-testing-strategy.md) | Testing strategy |
| [0026](0026-branching-and-merge-strategy.md) | Branching and merge strategy |
| [0027](0027-progress-tracking-and-ai-workflow.md) | Progress tracking and AI workflow |
| [0028](0028-invitations-via-signed-link.md) | Invitations via signed link (accepted debt) |
| [0029](0029-no-error-tracking-in-v1.md) | No error tracking in v1 (accepted debt) |
| [0030](0030-package-dependency-policy.md) | Package dependency policy |
| [0034](0034-framework-version-pins.md) | Framework version pins |
| [0041](0041-cloud-first-supabase-workflow.md) | Cloud-first Supabase workflow |

## Proposed (Owner Decision Required)

| ADR | Title | Needed by |
|---|---|---|
| [0031](0031-starter-reuse-and-upstream-sync.md) | Starter reuse and upstream sync | P8 |
| [0032](0032-retention-windows.md) | Retention windows | P4 |
| [0035](0035-referral-reward-rules.md) | Referral reward rules | P6 |
| [0036](0036-deployment-and-environments.md) | Deployment target and environments | P0 |
| [0037](0037-ui-primitives-and-color-modes.md) | UI primitives and color modes | P1 |
| [0038](0038-workspace-ownership-rules.md) | Workspace ownership rules | P4 |
| [0039](0039-platform-admin-roles-and-bootstrap.md) | Platform admin roles and bootstrap | P7 |
| [0040](0040-impersonation-policy.md) | Impersonation policy | P7 |

## Superseded

| ADR | Title | Superseded by |
|---|---|---|
| [0033](0033-test-database-approach.md) | Test database approach | ADR-0041 |
