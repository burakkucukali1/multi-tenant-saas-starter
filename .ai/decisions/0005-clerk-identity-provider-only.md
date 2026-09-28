# ADR-0005: Clerk as Identity Provider Only

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0004, ADR-0011, ADR-0018

## Context

Clerk offers organizations, roles, and invitations. Using them would split tenancy and authorization between Clerk and our database.

## Decision

- Clerk handles authentication, sessions, and user profile only.
- Clerk Organizations are not used. Workspaces, memberships, roles, and invitations live in our database.
- Clerk is accessed only through `lib/auth`. No other module imports the Clerk SDK.
- Users are provisioned just-in-time. On the first authenticated request, a `public.users` row is created, keyed by `clerk_user_id` (unique).
- Clerk webhooks:
  - `user.updated` syncs profile fields.
  - `user.deleted` triggers the user erasure workflow.
  - Handlers verify signatures and are idempotent.

## Consequences

- One source of truth for tenancy and permissions.
- Replacing Clerk later is limited to `lib/auth` and the webhook handler.
- We own invitations and membership UX ourselves.
- Profile data can briefly drift between Clerk and our database. Just-in-time provisioning and webhooks keep it small.

## Alternatives Considered

- Clerk Organizations: less code, but authorization is split across two systems and we get locked in to Clerk.
- Webhook-only provisioning: the first request can race the `user.created` webhook.
