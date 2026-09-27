# Architecture Principles

## Primary Goal

The primary goal of software architecture is:

- Reduce future change cost
- Improve maintainability
- Keep complexity manageable

Architecture is not about perfection.

Architecture is about making future changes cheaper.

---

# Engineering Philosophy

Prioritize:

1. Correctness
2. Simplicity
3. Maintainability
4. Scalability
5. Performance

Avoid optimizing before measuring.

Avoid introducing abstractions before they are needed.

---

# Decision Framework

When evaluating a solution ask:

1. Is it simpler?
2. Is it easier to maintain?
3. Is it easier to change later?
4. Does it increase coupling?
5. Does it introduce unnecessary complexity?

Choose the solution with the lowest long-term maintenance cost.

---

# YAGNI

You Aren't Gonna Need It.

Do not build functionality for hypothetical future requirements.

Build for current requirements.

Extend when real requirements appear.

Bad:

- Premature microservices
- Premature abstraction layers
- Premature plugin systems

Good:

- Simple implementation
- Refactor when pressure appears

---

# Rule of Three

Do not create abstractions after the first implementation.

Do not create abstractions after the second implementation.

Consider abstraction after the third repetition.

---

# Separation of Concerns

Each layer should have a single responsibility.

UI should not contain business logic.

Business logic should not contain rendering concerns.

Infrastructure should not leak into the UI.

---

# Dependency Direction

Dependencies should flow inward.

High-level modules should not depend on low-level implementation details.

Prefer:

UI
→ Service
→ Repository
→ Database

Avoid:

UI
→ Database

---

# Dependency Inversion

Depend on contracts.

Not implementations.

Bad:

Component directly imports database logic.

Good:

Component uses service interfaces.

---

# Feature Based Architecture

Organize code around business domains.

Prefer:

auth/
billing/
projects/
workspace/

Avoid:

components/
hooks/
services/
utils/

as primary top-level organization for large applications.

---

# Public APIs

Features should expose public APIs.

Other features should not access internal files directly.

Good:

features/projects/index.ts

Bad:

features/projects/internal/some-file.ts

---

# Component Responsibilities

Components should:

- Render UI
- Handle user interaction

Components should not:

- Know API details
- Know database details
- Know infrastructure details

---

# Service Responsibilities

Services should:

- Fetch data
- Call APIs
- Integrate with external systems
- Encapsulate business workflows

Services create a stable boundary between UI and infrastructure.

---

# Business Logic

Business logic belongs in:

- Services
- Server Actions
- Domain modules

Business logic should not live inside components.

---

# Refactoring

Refactor when:

- Complexity increases
- Duplication appears
- Coupling increases
- Testing becomes difficult
- Understanding becomes difficult

Do not refactor because code is "ugly".

Refactor when future change becomes expensive.

---

# Senior Engineering Mental Model

Ask:

- What problem are we solving?
- What is the maintenance cost?
- What happens in 2 years?
- Who will own this code?
- What happens when requirements change?

Focus on tradeoffs.

Not preferences.

---

# Build vs Buy

Before building:

Ask:

- Is there a mature solution?
- What is the maintenance burden?
- Is customization actually needed?

Avoid rebuilding solved problems.

Examples:

- Authentication
- Billing
- Monitoring
- Feature Flags
- Analytics

should often leverage existing platforms.

---

# Technical Debt

Technical debt is not inherently bad.

Technical debt is acceptable when:

- Intentional
- Documented
- Understood
- Planned

Dangerous debt is:

- Hidden
- Untracked
- Ignored

---

# Architecture Review Checklist

When reviewing architecture:

- Is complexity justified?
- Is abstraction justified?
- Is dependency direction correct?
- Is ownership clear?
- Is business logic isolated?
- Is coupling minimized?
- Is future change easy?

Architecture exists to support change.
