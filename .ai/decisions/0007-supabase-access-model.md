# ADR-0007: Supabase Access Model

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0008, ADR-0009, ADR-0010, ADR-0041

## Context

Clerk is the identity provider, so Supabase Auth's `auth.uid()` is not available for RLS. The options were to enforce isolation in the database using Clerk JWT claims, or to enforce it in a server-side data layer.

Tenant RLS policies that production code never exercises would drift and give false confidence.

## Decision

- All database access happens server-side, using the service role, only inside `lib/db` (and `lib/db/platform`). These modules import `server-only`.
- The service role key never reaches the client bundle, and the anon key is not used by application code.
- **RLS lockdown**:
  - Every table has RLS enabled with **no permissive policies**.
  - All table privileges are revoked from `anon` and `authenticated`.
  - Supabase Auth sign-ups are disabled.
- **Function lockdown**:
  - Default privileges revoke `EXECUTE` from `PUBLIC`, `anon`, and `authenticated`.
  - Every function sets an explicit `search_path`.
- No ORM. Types are generated with the Supabase CLI and committed. CI fails if the generated types differ from the migrations.
- Migrations are SQL-first, managed with the Supabase CLI, committed, and forward-only. Environment workflow: ADR-0041.
- CI checks every table and function for the lockdown rules above against the CI cloud project (ADR-0041).

## Consequences

- One uniform access path for Server Components, Server Actions, and Route Handlers.
- On the server path, isolation is enforced by the application (ADR-0010), not by Postgres. A careless import could bypass it, which is why import restrictions and isolation tests are mandatory.
- Exposure through the data API is fully closed at near-zero maintenance cost.
- Client-side Supabase features (Realtime, Storage) cannot be used without a new ADR. That ADR would add Clerk as a third-party auth provider and real policies.

## Alternatives Considered

- Clerk JWT with RLS as the primary boundary: enforcement in the database, but JWT claim plumbing, harder debugging, and coupling to Clerk's token shape.
- Service role plus full tenant RLS policies "for defense in depth": the policies would never run on the production path and would silently rot.
