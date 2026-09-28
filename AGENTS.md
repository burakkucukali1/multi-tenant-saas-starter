# Engineering Knowledge Base

This repository follows a layered AI knowledge system.

The goal is to load the minimum knowledge required to solve the current task.

Do not load files proactively.

Do not load files speculatively.

Load knowledge only when it directly affects implementation, architecture, review, security, performance, or business behavior.

---

# Architectural Decisions and Progress

**Decisions:** `.ai/decisions/index.md` (Accepted ADRs are binding). Never contradict an Accepted ADR; propose a superseding ADR instead.

**Progress:** `.ai/progress/roadmap.md` (index) and `.ai/progress/phases/pN-*.md` (tasks, context manifests, exit criteria). Rules: ADR-0027.

Before any implementation task:

1. Read the roadmap index and the **active phase file**.
2. Load only files listed in that phase's **context manifest**, plus core files below.
3. Reference task IDs (`PN-TNN`) in plans and pull requests.

Architecture planning is complete. Readiness: `.ai/progress/readiness-assessment.md`.

---

# Approved Project Architecture

This starter's approved architecture (see ADRs for detail). Do not reinterpret or replace these without owner approval.

## Multi-tenant model (ADR-0004, ADR-0006, ADR-0010)

- **User → Membership → Workspace.** One user, many workspaces.
- Path-based resolution: `/[locale]/t/[workspaceSlug]/...`.
- Shared database, shared schema; every tenant-owned row has `workspace_id NOT NULL`.
- Isolation: composite FKs, `WorkspaceScope`-bound repositories, RLS lockdown (no permissive policies), generated isolation tests.

## Clerk + Supabase (ADR-0005, ADR-0007, ADR-0041)

- **Clerk:** authentication and profile only. No Clerk Organizations. Access only via `lib/auth`.
- **Supabase PostgreSQL:** all data. **No ORM** — Supabase client and committed generated types.
- Server-side **service role** (or secret API key) only inside `lib/db` and `lib/db/platform` (`server-only`).
- **Cloud-first:** separate Free tier projects for **dev** and **ci**; migrations and config as code; dashboard read-only for schema/settings.
- Multi-statement writes use **`tx_*` Postgres functions** via `.rpc()` (ADR-0008).

## Platform RBAC vs tenant RBAC (ADR-0011, ADR-0012)

- **Tenant RBAC:** database-backed, flat roles (Owner, Admin, Member, Viewer). Permissions resolved once per request; pure `can()` checks. No custom roles in v1.
- **Platform RBAC:** separate `platform` schema, separate permission namespace, separate `PlatformContext`. **Mutual exclusion:** platform admins have no tenant permissions; tenant roles grant no platform permissions.
- Platform **reads** use dedicated platform read models. Platform **writes** call the same domain commands with a `WorkspaceScope` minted by platform access (audited). No bypass flags.

## Migration-first database workflow (ADR-0007, ADR-0008, ADR-0041)

- Schema source of truth: `supabase/migrations/*.sql`. Merged migrations are immutable; expand-and-contract for deploy safety.
- Reference data in migrations; synthetic data in `seed.sql` (never production).
- **Canonical types** generated from the CI project after migrations apply; CI fails on drift.
- Production and staging migrated **only by CI**.

## Dependency governance (ADR-0021, ADR-0030)

- Modules have **ranks**; import only **lower** ranks through public `index.ts`. Dependency-cruiser rules are generated from the ADR map.
- SDKs (Supabase, Clerk, Stripe) only in `lib/*`. `shared/` never imports features or workflows.

## Recursion prevention (ADR-0022)

- No cycles (CI). Workflows do not call workflows. Flat roles, no auth in repositories. No in-process event bus; no triggers that write to other tables. `tx_*` functions do not call other `tx_*` functions. Time-bound state evaluated at read time (ADR-0020).

## Phase-based implementation (ADR-0027, `.ai/progress/`)

- Work proceeds **one phase at a time** (P0–P8). Complete phase exit criteria before treating the phase as done.
- One task (or tightly coupled group) per branch/pull request. Approval levels per ADR-0001 and agent-governance.

## Stack pins (ADR-0034)

- Next.js 16.3.6, React 19.3.0, Node.js 24.21.0 (Active LTS), pnpm 12.6.0.

Full project constraints: `.ai/project/project-context.md`.

---

# Knowledge Hierarchy

Knowledge is organized into five layers:

1. Core
2. Project
3. Domain
4. Pattern
5. Integration

Each layer narrows context.

Higher layers should be loaded before lower layers.

---

# Core Knowledge

Core knowledge defines universal engineering standards.

Always load:

- .ai/core/architecture.md
- .ai/core/agent-governance.md

Load only when relevant:

Authentication, Authorization, Security
→ .ai/core/auth.md

Next.js, React, Rendering, Server Components, Server Actions
→ .ai/core/nextjs.md

Performance, Caching, Realtime, Optimization
→ .ai/core/performance.md

Testing, Test Strategy, Test Generation
→ .ai/core/testing.md

Multi-Tenant SaaS Architecture
→ .ai/core/saas.md

Never load unrelated core files.

---

# Project Context

Project context contains repository-specific knowledge.

File:

- .ai/project/project-context.md

Load only when:

- Existing architecture matters
- Existing conventions matter
- Existing infrastructure matters
- Existing dependencies matter
- Existing implementation patterns must be preserved

Do not load project context for generic questions.

---

# Domain Knowledge

Domains define business behavior.

Available:

- .ai/domains/ai-saas.md
- .ai/domains/crm.md
- .ai/domains/ecommerce.md
- .ai/domains/fintech.md
- .ai/domains/marketplace.md
- .ai/domains/custom.md

Load only the active domain.

Never load multiple domains unless explicitly required.

Business rules always come from domains.

Technical decisions do not require domain loading.

---

# Pattern Knowledge

Patterns define reusable architectural solutions.

Available:

- .ai/patterns/multi-tenant.md
- .ai/patterns/rbac.md
- .ai/patterns/billing.md
- .ai/patterns/webhooks.md
- .ai/patterns/background-jobs.md
- .ai/patterns/ai-chat.md
- .ai/patterns/realtime.md
- .ai/patterns/audit-logging.md
- .ai/patterns/file-storage.md
- .ai/patterns/notifications.md

Load patterns only when implementing or reviewing the pattern itself.

Do not load patterns preemptively.

Load the smallest possible set.

---

# Integration Knowledge

Integrations contain vendor-specific guidance.

Available:

- .ai/integrations/stripe.md
- .ai/integrations/supabase.md
- .ai/integrations/redis.md
- .ai/integrations/openai.md
- .ai/integrations/resend.md
- .ai/integrations/clerk.md
- .ai/integrations/uploadthing.md
- .ai/integrations/analytics.md

Load integration files only when the tool is directly involved.

Vendor knowledge should remain isolated.

Do not load unrelated integrations.

---

# Skill System

Skills define workflows.

Available:

- .ai/skills/implementation.md
- .ai/skills/review.md
- .ai/skills/architecture.md

Load only one skill at a time.

Implementation
→ implementation.md

Code Review
→ review.md

Architecture Design
→ architecture.md

Do not combine skills unless explicitly required.

---

# Context Loading Order

Load knowledge in this order:

1. architecture.md
2. agent-governance.md

Then load only what is required.

Stop loading when sufficient context exists.

---

# Engineering Philosophy

Prioritize:

1. Correctness
2. Simplicity
3. Maintainability
4. Scalability
5. Performance

Avoid:

- Premature abstraction
- Premature optimization
- Unnecessary complexity

Follow:

- YAGNI
- Rule of Three
- Separation of Concerns
- Dependency Inversion
- Single Responsibility Principle

Architecture exists to reduce future change cost.

---

# Architectural Defaults

Prefer:

1. Existing project patterns
2. Server Components
3. Server Actions
4. Server-side data access
5. Feature-based architecture
6. Composition over inheritance
7. Explicitness over magic

Introduce new patterns only when justified by real requirements.

---

# AI Behavior Rules

Before implementation:

1. Understand the task.
2. Analyze existing code.
3. Load minimum required knowledge.
4. Produce a plan.
5. Obtain approval when required.
6. Implement.
7. Self-review.
8. Validate against project standards.

Never assume unclear requirements.

Prefer questions over assumptions.

Prefer incremental changes over large rewrites.

---

# Review Priorities

When reviewing:

1. Correctness
2. Security
3. Maintainability
4. Architecture
5. Performance
6. Testing
7. Framework Conventions
8. Style

Focus on:

- Bugs
- Security Risks
- Excessive Complexity
- Coupling
- Future Maintenance Cost

Ignore subjective preferences unless they create measurable cost.

---

# Golden Rule

Load the minimum knowledge required.

Prefer existing patterns.

Prefer consistency over novelty.

Prefer maintainability over cleverness.

Stop loading context when sufficient information exists.

The agent may propose.

The user approves.

The agent implements.
