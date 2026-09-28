# P2 — Data Foundation

- Status: todo
- Depends on: P0 complete (ADR-0041 accepted; P0-T15 verification done before first migration)
- ADRs: 0007, 0008, 0009, 0010, 0018, 0019, 0022, 0025, 0041

## Goal

A locked-down database with a tenant-scoped access layer, transaction conventions, and audit, tested before any feature table exists.

## Scope

- Cloud-first Supabase workflow (ADR-0041): linked dev and CI projects, config-as-code, reset, seeding, drift detection
- The `public` and `platform` schemas, lockdown migrations, and CI checks
- `lib/db`, `lib/db/platform`, `WorkspaceScope`, and the repository conventions
- The `tx_*` convention and test harness
- Entity class conventions (ADR-0018)
- `audit_log` and `features/audit`
- Test factories and the generated isolation suite

Out of scope: feature tables other than `audit_log`.

## Context Manifest

- Core: `architecture.md`, `agent-governance.md`, `project-context.md`, `saas.md`, `testing.md`
- Integration: `.ai/integrations/supabase.md`
- Patterns: `.ai/patterns/multi-tenant.md`, `.ai/patterns/audit-logging.md`
- ADR-0007, 0008, 0009, 0010, 0018, 0019, 0041

## Open Questions

None blocking once P0 exit criteria are met and P0-T15 verification is recorded.

## Tasks

| ID | Task | Level | Status | Depends |
|---|---|---|---|---|
| P2-T01 | Pinned Supabase CLI, linked dev and CI projects, migration naming and the expand-and-contract convention | L2 | todo | — |
| P2-T02 | Migration one: schemas `public` and `platform`, lockdown (RLS on, grants revoked, default privileges revoked for the migration role) | L2 | todo | T01 |
| P2-T03 | CI lockdown checks against live catalog state: RLS enabled, no permissive policies, function `search_path` set, no `anon`/`authenticated` execute, entity class comment present | L2 | todo | T02 |
| P2-T04 | Type generation for both schemas from the migration-built CI project, plus the CI diff check | L1 | todo | T02 |
| P2-T12 | `config.toml` as code (exposed schemas, Supabase Auth off), config push, and the Management API settings verification | L2 | todo | T01 |
| P2-T13 | Schema fingerprint query and the drift check (dev and CI after reset, Postgres version included) | L1 | todo | T02 |
| P2-T14 | Seeding conventions: reference data as idempotent migration inserts, synthetic `seed.sql` limited to dev and CI, production never seeded | L2 | todo | T02 |
| P2-T15 | Reset-dev manual workflow, CI project reset step, and an explicit paused-project check | L2 | todo | T01 |
| P2-T05 | `lib/db` server-only client, and `lib/db/platform` with lint restrictions | L2 | todo | T04 |
| P2-T06 | `WorkspaceScope` type, the restricted minting function, and scoped repository conventions that inject `workspace_id` and `deleted_at` | L2 | todo | T05 |
| P2-T07 | Conventions document: composite FKs, partial unique indexes, entity class comments, and `tx_*` rules | L0 | todo | T02 |
| P2-T08 | `audit_log` table (append-only, `UPDATE`/`DELETE` revoked), action key registry, and the `features/audit` writer | L2 | todo | T05 |
| P2-T09 | Test harness: database reset, per-test workspace factories | L1 | todo | T05 |
| P2-T10 | Generated tenant isolation suite (repository path and anon key path) | L2 | todo | T06, T09 |
| P2-T11 | `tx_*` test harness with rollback assertions | L1 | todo | T09 |

## Exit Criteria

- The lockdown checks fail on a deliberately unlocked table.
- The isolation suite runs, and automatically picks up a sample tenant table added in a test migration.
- The audit table rejects `UPDATE` and `DELETE`.
- A dashboard-made schema change in dev is detected by the drift check.
- Dev and CI can each be rebuilt from migrations and seed alone.
