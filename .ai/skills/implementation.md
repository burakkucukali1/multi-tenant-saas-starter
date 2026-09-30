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
6. Obtain approval if required by agent-governance.md.
7. Implement.
8. Self-review.
9. Validate.

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

# Task Scope Protection

Before implementation:

1. Identify the active phase.
2. Identify the active task ID.
3. Identify the files expected to change.

Only modify files required by the active task.

Do not modify unrelated:

- Phase files
- Roadmap files
- ADRs
- Runbooks
- CI workflows
- Documentation

unless explicitly required by the task.

If unrelated changes already exist in the working tree:

- leave them untouched
- report them
- do not include them in the implementation

---

# Branch Discipline

One task = one branch.

Keep implementation limited to the active task.

If changes belong to another task:

- stop
- report them
- ask whether they should be separated

Do not silently mix multiple tasks into the same implementation.

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

# Validation Requirements

Before marking a task complete, run the required validation commands.

Minimum validation:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
```

If runtime behavior changed:

```bash
pnpm test
```

If dependency rules or architecture boundaries changed:

```bash
pnpm depcruise:validate-rules
pnpm depcruise
```

If any of the following changed:

- routing
- layouts
- providers
- middleware/proxy
- i18n
- application startup
- Next.js configuration

run:

```bash
pnpm build
```

Use the repository scripts defined in package.json.

Do not mark a task complete if required validation fails.

---

# Testing Requirements

Before completion verify:

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

---

# Completion Report

When implementation is complete provide:

- Task ID
- Files changed
- Validation commands executed
- Validation results
- Assumptions made
- Remaining risks
- Recommended next task

Do not claim completion without validation results.