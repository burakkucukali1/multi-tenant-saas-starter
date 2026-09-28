# ADR-0006: Path-Based Tenant Resolution

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0010, ADR-0024

## Context

The active workspace can be resolved from a subdomain, a path segment, the session, or a header.

## Decision

- Tenant routes use `/[locale]/t/[workspaceSlug]/...`.
- The workspace is resolved in one server-side place from the slug. Membership is then verified against the current user.
- Workspace slugs are unique among non-deleted workspaces (partial unique index).
- Whether slugs are editable after creation is a product decision, to be raised in Phase 4.

## Consequences

- No wildcard DNS or certificates. Local development and Clerk configuration stay simple.
- No hostname-based branding per workspace.
- Custom domains later would need a middleware rewrite that maps host to slug. That migration path is available.

## Alternatives Considered

- Subdomains: more polished and give natural cookie isolation, but have higher operational cost.
- Session-based: URLs can't be shared and bookmarks become ambiguous.
