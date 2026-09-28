# ADR-0001: Record Architecture Decisions

- Status: Accepted
- Date: 2026-09-27
- Approval level: L1

## Context

This starter is the foundation for several future products. Future engineers and AI agents need to know why each decision was made, not only what was decided. A single prose architecture document would drift from the code and eventually become wrong.

## Decision

- Every Level 2 or Level 3 decision gets an ADR in `.ai/decisions/NNNN-slug.md`.
- Each ADR has a status: `Proposed`, `Accepted`, `Superseded by ADR-XXXX`, or `Rejected`.
- Accepted ADRs are not rewritten. A change of direction is recorded in a new ADR that supersedes the old one.
- Open decisions are recorded as `Proposed` ADRs and linked from `.ai/progress/roadmap.md`. They are not copied there.
- `.ai/decisions/index.md` lists every ADR with its status.
- ADRs ship in the same pull request as the change they justify.

## Consequences

- Decision history survives personnel and context changes.
- Agents can load a single ADR instead of broad context.
- Writing ADRs adds overhead. Keep them short.

## Alternatives Considered

- One architecture document: drifts from the code and loses the reasoning behind decisions.
- Decisions recorded in pull request descriptions: hard for agents to find, and lost if the repository moves.
