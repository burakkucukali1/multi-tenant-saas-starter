# ADR-0003: Single Next.js Application as a Modular Monolith

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0012, ADR-0021

## Context

The starter has two surfaces: the tenant-facing app and platform administration. They could live in one app or in separate apps inside a monorepo.

## Decision

One Next.js application in one repository.

- Tenant surface: `app/[locale]/(tenant)/t/[workspaceSlug]/...`
- Platform surface: `app/[locale]/(platform)/admin/...`
- Public surface: `app/[locale]/(public)/...` (sign-in, legal pages)

Top-level source layout:

- `app/`: routes and layouts only
- `workflows/`: cross-feature use cases
- `features/`: domain modules
- `platform/`: platform administration modules
- `shared/`: design system and utilities
- `lib/`: infrastructure adapters (`db`, `db/platform`, `auth`, `stripe`, `config`, `i18n`)
- `supabase/`: migrations and seeds
- `tests/`: cross-cutting suites (isolation, authorization matrix, E2E)

## Consequences

- One deploy, one dependency tree, and a shared design system without package plumbing.
- Platform isolation relies on route-level authorization, a separate middleware matcher, `server-only` modules, and import rules. It does not rely on network separation.
- The dependency rules (ADR-0021) keep a later move to a monorepo mechanical.

## Alternatives Considered

- Turborepo with two apps: stronger deploy isolation, but more tooling, harder cross-package refactors, and more friction for AI agents. Reconsider if platform administration ever needs its own domain or network boundary.
