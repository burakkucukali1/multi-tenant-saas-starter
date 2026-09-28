## Summary

<!-- What changed and why (1–3 sentences). Squash-merge title should follow Conventional Commits (ADR-0026). -->

## Task tracking (ADR-0027)

| Field                 | Value                                                                                      |
| --------------------- | ------------------------------------------------------------------------------------------ |
| **Task ID(s)**        | <!-- e.g. P0-T12 -->                                                                       |
| **Phase**             | <!-- e.g. P0 — Foundations; link `.ai/progress/phases/p0-foundations.md` -->               |
| **Approval level**    | <!-- L0 \| L1 \| L2 \| L3 — from the phase task row and `.ai/core/agent-governance.md` --> |
| **Approval obtained** | <!-- Yes / N/A (L0) — who approved, or link to review comment -->                          |

Branch name (ADR-0026): `feat|fix|docs|chore/pN-tNN-short-slug`

## Checklist

- [ ] Task ID and approval level match the active phase file
- [ ] Required approval was obtained before implementation (not L0)
- [ ] Accepted ADRs are not contradicted; superseding changes include a new ADR (ADR-0001)
- [ ] Phase progress updated when a task is completed (phase file + roadmap pointer if needed)
- [ ] No secrets, credentials, or `.env*` files committed
- [ ] Docs updated in the same PR as the behavior they describe (`project-context.md`, ADRs, runbooks)
- [ ] Local validation passed (see below)

## Validation

<!-- Check what applies to this PR -->

- [ ] `pnpm ci:check`
- [ ] `pnpm test:e2e:install` (once) and `CI=true pnpm test:e2e` (routes / UI)
- [ ] `pnpm depcruise:validate-rules` (if dependency map or boundaries changed)
- [ ] Other: <!-- migrations, types, i18n — when P2+ gates exist -->

## Test plan

<!-- Concrete steps for reviewers. For foundation/tooling PRs, list commands run and expected result. -->
