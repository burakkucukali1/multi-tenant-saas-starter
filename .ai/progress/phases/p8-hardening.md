# P8 — Hardening and Starter Templating

- Status: todo
- Depends on: P7
- ADRs: 0025, 0026, 0031, 0036

## Goal

Release v1.0.0 of the starter: verified, documented, and ready to be adopted by derived products.

## Context Manifest

- Core: `architecture.md`, `agent-governance.md`, `project-context.md`, `testing.md`, `performance.md`
- Skill: `.ai/skills/review.md`
- ADR-0031, 0036

## Open Questions

- ADR-0031 reuse mechanism (blocks T06)
- ADR-0036 production environment (blocks T07)

## Tasks

| ID     | Task                                                                                                    | Level | Status | Depends          |
| ------ | ------------------------------------------------------------------------------------------------------- | ----- | ------ | ---------------- |
| P8-T01 | Critical-flow E2E completeness review against `project-context.md`                                      | L1    | todo   | —                |
| P8-T02 | Isolation and authorization matrix completeness audit                                                   | L2    | todo   | —                |
| P8-T03 | Security review of the full codebase                                                                    | L2    | todo   | —                |
| P8-T04 | Platform query performance: indexes and `EXPLAIN` on cross-workspace read models                        | L1    | todo   | —                |
| P8-T05 | Documentation pass: ADR accuracy, `project-context.md` current state                                    | L0    | todo   | —                |
| P8-T06 | Derived-product guide: rebrand, product modules, upstream sync                                          | L0    | todo   | ADR-0031         |
| P8-T07 | Production environment setup and runbook, including the manual purge procedure                          | L2    | todo   | ADR-0036         |
| P8-T09 | Create staging and production Supabase projects on a paid tier, with parity to dev and CI (ADR-0041 §1) | L2    | todo   | ADR-0036         |
| P8-T10 | Production migration pipeline: manual approval, fingerprint pre-check, backup check, then app deploy    | L2    | todo   | T09              |
| P8-T11 | Restore drill into a scratch project: Stripe reconciliation and erasure ledger replay                   | L2    | todo   | T09              |
| P8-T08 | Changelog and `v1.0.0` tag                                                                              | L1    | todo   | T01–T07, T09–T11 |

## Exit Criteria

- All required checks are green.
- The security review has no open critical findings.
- A derived product can be created and rebranded by following the guide alone.
