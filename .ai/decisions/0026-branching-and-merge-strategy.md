# ADR-0026: Branching and Merge Strategy

- Status: Accepted
- Date: 2026-09-27
- Approval level: L2
- Related: ADR-0027, ADR-0031

## Context

Development is small-team and AI-assisted, in small increments. Long-lived branches accumulate merge debt.

## Decision

- **Trunk-based.** `main` is protected and always deployable. Branches are short-lived: `feat|fix|docs|chore/pN-tNN-slug`. One task, or one tightly coupled group of tasks, per pull request.
- **Exception:** a phase that cannot ship incrementally may use `phase/pN-slug` with stacked pull requests, rebased on `main` daily.
- **Squash merge.** Linear history, and pull request titles follow Conventional Commits.
- Upstream starter syncs in derived products use a merge commit to preserve lineage (ADR-0031).
- **Required checks:**
  - TypeScript
  - ESLint
  - Prettier and import-sort check
  - dependency rules
  - unit and integration tests
  - tenant isolation suite
  - authorization matrix
  - Playwright smoke tests
  - migration check (generated types match, and lockdown rules hold)
  - i18n key parity
- Starter releases are tagged with semantic versions and have a changelog.

## Consequences

- Rules are enforced by CI, not by memory.
- CI must stay fast enough that small pull requests remain practical.

## Alternatives Considered

- GitFlow with a develop branch: overhead with no benefit at this team size.
