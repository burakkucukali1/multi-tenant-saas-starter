# Architecture Review Skill

## Objective

Review architecture quality.

Focus on:

- Maintainability
- Coupling
- Separation of Concerns
- Change Cost
- Ownership

Ignore:

- Formatting
- Naming preferences
- Minor style issues

---

# Review Process

For every change ask:

1. Is complexity justified?
2. Is abstraction justified?
3. Is ownership clear?
4. Is coupling minimized?
5. Is future change easier or harder?

---

# Architecture Checks

## Separation of Concerns

Check:

- UI responsibilities
- Business logic placement
- Infrastructure boundaries

Flag:

- Business logic inside components
- Database access inside UI
- Tight infrastructure coupling

---

## Dependency Direction

Preferred:

UI
↓
Service
↓
Repository
↓
Database

Flag:

Reverse dependencies.

---

## Feature Architecture

Check:

- Domain boundaries
- Public APIs
- Feature isolation

Flag:

Cross-feature internal imports.

---

## Service Layer

Verify:

- API access isolated
- Infrastructure isolated
- Business workflows encapsulated

---

## Refactoring Signals

Identify:

- Duplication
- Growing complexity
- Hidden coupling
- Difficult testing

---

# Output Format

For each issue provide:

Severity:

- Critical
- Major
- Minor

Problem:
...

Impact:
...

Recommendation:
...

# Architecture Skill

## Objective

Evaluate architectural decisions and large-scale changes.

Use for:

- New systems
- New modules
- Refactors
- Domain boundaries
- Major integrations

Do not use for routine feature work.

---

# Review Against

- architecture.md
- saas.md
- project-context.md

Load relevant domain rules when needed.

---

# Problem Definition

Before proposing architecture:

Identify:

- Current problem
- Constraints
- Expected growth
- Ownership boundaries

Never design solutions before understanding the problem.

---

# Evaluate Tradeoffs

For every proposal ask:

- What complexity is introduced?
- What coupling is introduced?
- What maintenance cost is introduced?
- What flexibility is gained?

Architecture is tradeoff management.

---

# Boundaries

Verify:

- Clear ownership
- Clear responsibilities
- Proper dependency direction
- Explicit public APIs

Avoid unclear boundaries.

---

# Abstractions

Apply:

- YAGNI
- Rule of Three

Ask:

Is this abstraction solving a current problem?

Avoid hypothetical abstractions.

---

# Scalability

Consider:

- Team scalability
- Codebase scalability
- Operational scalability

Not only technical scalability.

---

# Build vs Buy

Before building:

Ask:

- Is there a mature solution?
- Is customization necessary?
- What is the maintenance burden?

Prefer proven solutions for solved problems.

---

# Long-Term Cost

Ask:

What happens in:

- 6 months?
- 1 year?
- 2 years?

Architecture should reduce future change cost.

---

# Output Structure

Current State

Problems

Options

Tradeoffs

Recommendation

Risks
