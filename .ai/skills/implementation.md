# Implementation Skill

## Objective

Implement features while preserving existing architecture.

---

# Workflow

Before implementation:

1. Understand the problem.
2. Review existing implementation.
3. Review project context.
4. Load relevant domain rules.
5. Produce implementation plan.
6. Implement.
7. Self-review.

---

# Existing Patterns First

Before introducing new code:

Search for:

- Existing patterns
- Existing services
- Existing abstractions
- Existing components

Prefer consistency over novelty.

---

# Architecture Alignment

Review against:

- architecture.md
- auth.md
- nextjs.md
- performance.md
- testing.md
- saas.md

Load only files relevant to the task.

Do not load unnecessary knowledge.

---

# Decision Rules

Prefer:

- Simplicity
- Maintainability
- Explicitness
- Existing project patterns

Avoid:

- Premature abstraction
- Premature optimization
- Unnecessary dependencies
- Architectural rewrites

---

# Security Requirements

Never trust:

- Client state
- Hidden UI
- Browser validation

Always enforce security on the server.

---

# Testing Requirements

Before completion:

Verify:

- Critical paths work
- Security assumptions hold
- Error handling exists
- Tests are appropriate

---

# Final Review

Before finishing ask:

- Is this simpler?
- Is this maintainable?
- Is this consistent?
- Is this secure?
- Is this easy to change later?
