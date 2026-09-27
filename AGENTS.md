# Engineering Knowledge Base

This repository follows a layered AI knowledge system.

The goal is to load the minimum knowledge required to solve the current task.

Do not load files proactively.

Do not load files speculatively.

Load knowledge only when it directly affects implementation, architecture, review, security, performance, or business behavior.

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
