# ADR-0009: Separate `platform` Schema

- Status: Accepted
- Date: 2026-09-27
- Approval level: L2
- Related: ADR-0007, ADR-0012

## Context

Platform-only data (platform admins, platform roles, internal deal records) must never be reachable through tenant code paths.

## Decision

- Application and tenant-owned tables live in `public`.
- Platform-only tables live in the `platform` schema.
- Only `lib/db/platform` may use `.schema('platform')`. This is enforced by lint.
- Types are generated for both schemas.
- The RLS and privilege lockdown from ADR-0007 applies to both schemas.

## Consequences

- A hard, greppable naming boundary between tenant and platform data.
- One more schema to expose and generate types for.

## Alternatives Considered

- A single schema with a `platform_` prefix: weaker enforcement, since it is only a convention.
