# ADR-0027: Progress Tracking and AI-Assisted Workflow

- Status: Accepted
- Date: 2026-09-27
- Approval level: L2
- Related: ADR-0001, ADR-0026

## Context

An agent starting a fresh session must reconstruct its position with minimal context. Keeping separate roadmap and state files leads to drift. A single large file violates minimum-context loading.

## Decision

- `.ai/progress/roadmap.md` is a **small index**: the phase table with statuses, the current phase and task pointer, and links to Proposed ADRs. It replaces any separate state file.
- `.ai/progress/phases/pN-slug.md` contains, per phase:
  - goal and scope
  - dependencies
  - a **context manifest** listing the `.ai/` files that phase loads
  - open questions
  - tasks with status and approval level
  - exit criteria
- **Single source of truth.**
  - Task status lives only in the phase file.
  - The index changes only when a phase opens or closes, or when the pointer moves.
  - Open decisions live only in Proposed ADRs.
- Task IDs are `PN-TNN` and stable. Pull requests reference them.
- Task statuses: `todo`, `in-progress`, `blocked`, `done`.
- **Session loop:**
  1. Read the index and the active phase file.
  2. Load only the files in the manifest.
  3. Plan.
  4. Get approval at the required level.
  5. Implement.
  6. Self-review with `.ai/skills/review.md`.
  7. Open a pull request.
  8. Update the phase file, and the index pointer if it moved.
- One task per session.
- Phase-level open questions become Proposed ADRs when the phase starts.

## Consequences

- An agent needs about two small files to resume. Status drift is structurally impossible for tasks.
- More files. Upkeep is enforced by the pull request template.

## Alternatives Considered

- `roadmap.md` plus `state.md`: the two files drift apart.
- One large roadmap file: high token cost and frequent merge conflicts.
- GitHub Issues as the source of truth: many round trips for an agent, and the ordering rationale is lost.
