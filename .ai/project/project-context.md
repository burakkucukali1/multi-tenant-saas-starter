# Project Context

## Project Overview

Name:

Multi-Tenant SaaS Starter

Description:

A reusable, domain-neutral SaaS foundation providing tenant-facing workspaces and a platform administration application. Derived products start from this repository and add their own product features.

Primary Goal:

Minimize the cost of building and maintaining future SaaS products by providing correct, isolated, well-documented core SaaS capabilities from day one.

Target Users:

- Engineers building derived products (primary)
- End users of derived products (workspace members)
- Platform operators of derived products (platform admins)

---

# Domain

Primary Domain:

- Custom (domain-neutral starter)

Active domain file: `.ai/domains/custom.md`

Secondary Domains:

None. Derived products set their own domain.

---

# Product Stage

Current Stage:

- MVP / Foundation

Guideline override:

A reusable starter's cost is paid by every derived product. Maintainability outweighs speed even at this stage.

Architecture planning:

- Complete (2026-09-28). See `.ai/progress/readiness-assessment.md` and ADR index.

---

# Architecture

Architecture Style:

- Modular Monolith

Current Choice:

Single Next.js application with `(tenant)` and `(platform)` route groups. Feature modules are ranked, and dependencies are enforced in CI.

Reason:

One deploy and one dependency tree. The design system is shared without package plumbing, and the codebase stays easy for AI agents to work in. Because the boundaries are enforced from day one, a later split into a monorepo is a mechanical move. See ADR-0003 and ADR-0021.

---

# Technology Stack

Frontend: Next.js 16.3.6, React 19.3.0, TypeScript, Tailwind CSS, TanStack Query, next-intl (ADR-0034)

Runtime: Node.js 24.21.0 (Active LTS). Package manager: pnpm 12.6.0 (ADR-0034)

Backend: Next.js Server Components, Server Actions, Route Handlers

Database: Supabase PostgreSQL on Supabase Cloud. Cloud-first workflow, no Docker-based primary workflow (ADR-0041). Dev and CI run as separate Free tier projects. Staging and production go on a paid tier (ADR-0036)

ORM: None. Supabase client with generated types (ADR-0007)

Authentication: Clerk, as identity provider only. No Clerk Organizations (ADR-0005)

Payments: Stripe (ADR-0013)

Email Provider: None in v1 (ADR-0028)

Queue System: None. Background jobs are out of scope for v1 (ADR-0020)

File Storage: None in v1. Future Supabase Storage must follow ADR-0041 §11 and ADR-0007 lockdown (no ad hoc dashboard buckets).

Analytics: None in v1. Usage analytics come from the database

Monitoring: None in v1 (ADR-0029)

Deployment: Pending (ADR-0036)

Tooling: Jest, Playwright, ESLint, Prettier with `@trivago/prettier-plugin-sort-imports`, dependency-cruiser

---

# Multi-Tenant Strategy

Tenant Model:

- Multi Tenant: shared database, shared schema, `workspace_id` on every tenant-owned row (ADR-0004)

Tenant Identifier:

- Workspace

Tenant Resolution:

- Route: `/[locale]/t/[workspaceSlug]/...` (ADR-0006)

Identity model:

User → Membership → Workspace

Isolation: defense in depth (ADR-0010)

1. Composite foreign keys on `(workspace_id, id)`
2. `WorkspaceScope`-bound repositories
3. RLS enabled with no permissive policies, and privileges revoked from `anon` and `authenticated`
4. Generated tenant isolation tests

---

# Permission Model

Authorization Strategy:

- RBAC, database-backed, flat roles, no role inheritance (ADR-0011)

Roles (system-defined, v1):

- Owner
- Admin
- Member
- Viewer

Custom roles: out of scope for v1.

Platform administration uses a completely separate permission namespace (ADR-0012).

Permission Source:

Backend

Frontend Responsibility:

UX only

---

# Billing

Billing Provider:

Stripe. Source of truth for money, subscriptions, discounts, and invoices.

Billing Owner:

Workspace

Subscription Model:

Plans are data (versioned, archived, never deleted). Plan names and prices are owner-defined per derived product.

Entitlements:

Plan base entitlements plus workspace grants with validity windows (ADR-0013).

Grant sources: enterprise deals, referral rewards, manual platform grants.

Usage Limits (starter):

- Seats

Derived products add their own meters.

Commercial capabilities in architecture scope:

- Promo codes (ADR-0014)
- Enterprise deals (ADR-0015)
- Referrals (ADR-0016)

---

# AI Features

AI Enabled:

No. Not part of the starter. Derived products decide.

---

# Data Ownership

Workspace → Workspace

Membership → Workspace

Invitation → Workspace

Subscription → Workspace

Entitlement grant → Workspace

Enterprise deal → Workspace (managed by platform)

Promo redemption → Workspace

User → User

Legal acceptance (ToS, Privacy) → User

Legal acceptance (DPA) → Workspace, accepted by its Owner

Referral code / attribution → User

Audit log entry → Workspace or Platform (actor stored by ID only)

Plans, roles, permissions, legal document versions → Platform (reference data)

Platform admins, platform roles → Platform (`platform` schema)

---

# Security Requirements

Compliance:

- GDPR-ready: data export and erasure paths exist. No certification claimed.

Sensitive Data:

User profile data (name, email) synced from Clerk. Billing details stay in Stripe and are never stored locally.

Data Retention Policy:

Soft delete by entity class (ADR-0018). Grace period and retention window values are pending (ADR-0032).

Erasure:

Personal data is hard-purged or pseudonymized. Immutable records keep actor IDs only. Purges are a manual, audited platform action in v1.

Audit Logging Required:

Yes (ADR-0019)

---

# Performance Requirements

Expected Active Users: Not defined

Expected Concurrent Users: Not defined

Expected Database Size: Not defined

Expected API Volume: Not defined

Realtime Requirements:

No

Note: the design does not assume a specific scale. Known scaling limits (platform KPIs computed on demand, audit log growth) are documented in the ADRs.

---

# Testing Strategy

Primary Focus:

- Integration (primary)
- Unit (pure domain logic)
- E2E (critical flows only)

Mandatory suites:

- Generated tenant isolation tests
- Authorization matrix tests (tenant and platform)
- Architecture tests (dependency rules)

See ADR-0025. Integration tests use the `<app>-ci` Supabase Cloud project (ADR-0041). Committed DB types are canonical from CI after migrations apply.

Critical Flows:

- Authentication and provisioning
- Legal acceptance
- Workspace creation
- Invitation and acceptance
- Role change
- Ownership transfer
- Billing and entitlement enforcement
- Data deletion and erasure
- Platform admin access and cross-tenant refusal

---

# Operational Requirements

Backups Required:

- Production: yes, on a paid tier. Recovery targets are pending (ADR-0036).
- Dev and CI: no backups. Both must be reconstructible from migrations and seed alone (ADR-0041).

Disaster Recovery:

Not defined

Observability:

None in v1 (ADR-0029, accepted debt)

---

# Project-Specific Rules

- Every tenant-owned table has `workspace_id NOT NULL`, and child tables reference parents by `(workspace_id, id)`.
- Tenant data is only reachable through a `WorkspaceScope`. Repositories never accept a raw workspace ID from client input.
- A `WorkspaceScope` can only be created by tenant authorization (from a membership) or platform authorization (from a platform permission, audited).
- The raw Supabase client is importable only inside `lib/db`. The platform data module is importable only from `platform/`.
- Every table has RLS enabled, with no permissive policies. No function is executable by `anon` or `authenticated`.
- Any multi-statement write runs in a `tx_*` Postgres function. SQL functions enforce atomicity and invariants only. Decisions stay in TypeScript.
- Critical mutations write their audit entry inside the same transaction.
- No database triggers that write to other tables. No in-process event bus.
- Time-bound state is stored as validity windows and evaluated at read time. No scheduled mutations.
- Roles are flat. Permission checks are pure functions over a set resolved once per request.
- Tenant authorization and platform authorization never import each other.
- Features import only lower-ranked features through their public `index.ts` (ADR-0021).
- Stripe is the source of truth for money. The database mirrors it through idempotent webhooks.
- Plans, roles, permissions, and legal document versions are archived, never deleted.
- Documentation changes ship in the same pull request as the change they describe.
- Schema changes happen only through migrations. Project settings live only in `supabase/config.toml` or a documented, verified runbook item. The Supabase dashboard is read-only.
- Merged migrations are immutable. Migrations follow expand and contract. Production and staging are migrated only by CI.
- Reference data is seeded by migration. `seed.sql` never runs in production.
- `.ai/integrations/supabase.md` says Supabase Auth handles identity. For this project that is overridden by ADR-0005, and Clerk handles identity.

---

# Knowledge Locations

Decisions: `.ai/decisions/index.md`

Progress: `.ai/progress/roadmap.md` (index), `.ai/progress/phases/`, `.ai/progress/readiness-assessment.md`

Supabase workflow summary: separate **dev** and **ci** Free projects; migrations and config as code; CI generates canonical types; drift categories in ADR-0041 §7; PAT governance in ADR-0041 §10.

---

# AI Instructions

When making architectural decisions:

1. Follow core engineering rules.
2. Follow domain rules.
3. Follow project constraints.
4. Optimize for current product stage.
5. Avoid introducing unnecessary complexity.

Before any task: read `.ai/progress/roadmap.md`, then only the active phase file, then only the files in that phase's context manifest.

Never contradict an Accepted ADR. Propose a superseding ADR instead.

Always prefer solutions that reduce future maintenance cost.
