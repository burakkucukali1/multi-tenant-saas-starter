# P0 — Foundations

- Status: in-progress
- Depends on: none
- ADRs: 0001–0041 (documentation), 0021, 0025, 0026, 0030, 0034, 0036, 0041

## Goal

Every decision is recorded, and an empty app passes CI with every architectural rule already enforced.

## Scope

Documentation, repository tooling, and CI. No product features.

## Context Manifest

- `.ai/core/architecture.md`, `.ai/core/agent-governance.md`, `.ai/project/project-context.md`
- T06: `.ai/core/nextjs.md`
- T08: ADR-0021
- T09–T10: `.ai/core/testing.md`, ADR-0025
- T11–T12: ADR-0026
- T09, T11, T15–T17: ADR-0041, `.ai/integrations/supabase.md`

## Open Questions

- ADR-0036 deployment host and production recovery targets (blocks production secrets in T11; dev and CI secrets unblocked per ADR-0041)

## Tasks

| ID     | Task                                                                                                                                                                                   | Level | Status | Depends      |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------ | ------------ |
| P0-T01 | Write `project-context.md`                                                                                                                                                             | L0    | done   | —            |
| P0-T02 | Write ADRs 0001–0041 and the index                                                                                                                                                     | L0    | done   | —            |
| P0-T03 | Write the roadmap index and phase files                                                                                                                                                | L0    | done   | —            |
| P0-T04 | Update `AGENTS.md` to reference `.ai/decisions/`, `.ai/progress/`, and approved architecture                                                                                           | L0    | done   | —            |
| P0-T05 | Resolve version pins                                                                                                                                                                   | L3    | done   | ADR-0034     |
| P0-T06 | Scaffold the Next.js app (TypeScript strict, directory layout per ADR-0003; pins ADR-0034)                                                                                             | L1    | done   | T05          |
| P0-T07 | ESLint, Prettier with sort-imports, EditorConfig, and the raw color ban                                                                                                                | L1    | done   | T06          |
| P0-T08 | Dependency governance: generated dependency-cruiser rules and boundary lint (ADR-0021)                                                                                                 | L1    | done   | T06          |
| P0-T09 | Jest projects: unit and integration (integration targets the CI cloud project)                                                                                                         | L1    | done   | T06          |
| P0-T10 | Playwright setup with a smoke test                                                                                                                                                     | L1    | done   | T06          |
| P0-T11 | CI workflow with all required checks (ADR-0026), and a single concurrency group for jobs that touch the CI project                                                                     | L2    | done   | T07–T10, T17 |
| P0-T12 | Pull request template (task ID, approval level, checklist) and branch protection guide                                                                                                 | L1    | done   | T11          |
| P0-T13 | Renovate config (ADR-0030)                                                                                                                                                             | L1    | done   | T06          |
| P0-T14 | Centralized server logger stub (ADR-0029)                                                                                                                                              | L1    | todo   | T06          |
| P0-T15 | Verify ADR-0041 implementation assumptions (CLI without Docker, Free tier limits, secret API keys, config push). Record results in runbook; amend ADR-0041 only if an assumption fails | L1    | todo   | —            |
| P0-T16 | Create the `<app>-dev` and `<app>-ci` Free projects (same region, same Postgres major version). Owner action, since it creates accounts and resources                                  | L2    | done   | T15          |
| P0-T17 | Per-environment secrets for dev and CI (CLI token, project ref, DB password, server key). No production secrets yet                                                                    | L2    | todo   | T16          |

## Exit Criteria

- CI is green on the empty app.
- A deliberate cycle, an upward-rank import, and a raw SDK import outside `lib/` each fail CI.
- The pull request template is in use.
