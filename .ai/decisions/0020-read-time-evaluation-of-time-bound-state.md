# ADR-0020: Read-Time Evaluation of Time-Bound State

- Status: Accepted
- Date: 2026-09-27
- Approval level: L2
- Related: ADR-0013 to ADR-0018

## Context

Background jobs are out of scope for v1. Many capabilities have time limits: invitations, promos, deal windows, entitlement grants, legal effective dates, and grace periods.

## Decision

- Time-bound state is stored as validity windows (`valid_from`, `valid_until`, `expires_at`, `effective_at`).
- Every read evaluates the window against the current time. Nothing is changed on a schedule.
- State changes driven by external events come from webhooks (Stripe, Clerk).
- Actions that must happen are triggered manually and audited (for example, purge).

## Consequences

- No job infrastructure is needed, and there is no drift between a stored status and the actual time.
- Queries carry time predicates, and indexes must include the window columns where needed.
- Nothing happens automatically when something expires (no notifications, no cleanup).

## Alternatives Considered

- Scheduled jobs: out of scope for v1.
- `pg_cron`: counts as a background job, so it is excluded by owner decision.
