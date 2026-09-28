# ADR-0039: Platform Admin Roles, Bootstrap, and Access Controls

- Status: Proposed
- Date: 2026-09-27
- Approval level: L3
- Needed by: Phase 7a
- Related: ADR-0012

## Context

The platform permission namespace is defined (ADR-0012). Its role set, how the first platform admin is created, and the extra access controls are not.

## Questions

- Platform role set. Suggested: Super Admin, Operations, Billing, Support, Read-only.
- **Bootstrap.** How is the first Super Admin created? Recommendation: a one-off CLI script run by an operator against the target environment. Not a migration, and not an environment variable read at runtime.
- Should MFA be mandatory for platform admins (enforced through Clerk)?
- Should sensitive platform reads (PII detail views) be audited?
- Can a platform admin also be a tenant member using the same Clerk account?

## Recommendation

- The suggested role set.
- CLI bootstrap.
- Mandatory MFA.
- Audit PII detail reads.
- Allow the same account, because the permission namespaces are already isolated.

## Decision

Pending owner decision.
