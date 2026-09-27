# Testing Playbook

## Primary Goal

The goal of testing is not coverage.

The goal of testing is reducing risk.

Coverage is a metric.

Risk reduction is the objective.

---

# Testing Philosophy

Tests should increase confidence.

Tests should make refactoring safer.

Tests should prevent regressions.

Avoid writing tests that provide little confidence.

---

# Testing Pyramid

Prioritize:

1. Integration Tests
2. Critical E2E Tests
3. Unit Tests

Do not blindly maximize unit test count.

---

# What To Test

Focus on:

- Business rules
- User workflows
- Critical paths
- Permission logic
- Billing logic
- Data integrity
- State transitions

---

# What Not To Test

Avoid testing:

- Framework internals
- Library internals
- Simple getters/setters
- Trivial implementations
- Styling details

---

# User-Centric Testing

Prefer:

"What can the user do?"

Over:

"What function was called?"

Test behavior.

Not implementation details.

---

# Good Test

Example:

User creates project
↓
Project appears in dashboard
↓
Permission applied correctly

---

# Bad Test

Example:

Function X called function Y

Implementation details change frequently.

Behavior matters.

---

# Integration Tests First

Integration tests provide the highest value.

They verify:

- Multiple layers working together
- Business workflows
- Real interactions

Examples:

- User registration
- Project creation
- Billing flow
- Invitation flow

---

# Unit Tests

Use for:

- Business logic
- Validation rules
- Calculations
- State machines
- Domain services

Ideal unit test targets:

- Pure functions
- Deterministic logic

---

# Avoid Testing UI Internals

Bad:

```ts
expect(button.className);
```

Bad:

```ts
expect(state.value);
```

Prefer:

```ts
expect(screen.getByText(...))
```

Verify observable behavior.

---

# End-to-End Tests

Use sparingly.

Focus on:

- Login
- Signup
- Checkout
- Billing
- Critical workflows

Do not test every screen.

E2E tests are expensive.

---

# Critical Path Testing

Always identify:

"What would hurt most if broken?"

Test those paths first.

Examples:

- Authentication
- Payments
- Permission checks
- Data deletion

---

# Permission Testing

Always test:

Allowed user
↓
Success

Forbidden user
↓
Failure

Authorization bugs are security bugs.

---

# Multi-Tenant Testing

Verify:

- Tenant isolation
- Permission isolation
- Data ownership

Never assume tenant boundaries work.

Test them.

---

# API Testing

Test:

- Success paths
- Validation failures
- Permission failures
- Edge cases

Avoid testing implementation details.

---

# Database Testing

Verify:

- Data integrity
- Constraints
- Transactions
- Ownership

Focus on business outcomes.

---

# Mocking Philosophy

Mock external systems.

Avoid mocking your own code.

Good mocks:

- Stripe
- Email providers
- Third-party APIs

Bad mocks:

- Services
- Business logic
- Repositories

Over-mocking creates false confidence.

---

# Test Data

Use realistic data.

Avoid:

```ts
test1;
foo;
bar;
```

Prefer meaningful examples.

---

# Flaky Tests

Flaky tests are failures.

Common causes:

- Timing issues
- Shared state
- Race conditions
- Network dependency

Fix immediately.

Do not ignore.

---

# Performance Tests

Consider for:

- Expensive queries
- Search
- Realtime systems
- Bulk operations

Not every feature requires performance tests.

---

# Contract Tests

Useful when:

- Multiple services communicate
- APIs evolve independently

Verify interfaces remain compatible.

---

# Regression Tests

When a bug is fixed:

1. Add a test.
2. Fix the bug.
3. Verify the test fails before the fix.

Prevent reoccurrence.

---

# Test Review Checklist

Ask:

- Does this test reduce risk?
- Does it verify behavior?
- Is it easy to understand?
- Is it resilient to refactoring?
- Is it testing business value?

---

# AI Testing Rules

When generating tests:

Prefer:

- Integration tests
- User workflows
- Business logic validation

Avoid:

- Snapshot spam
- Trivial unit tests
- Framework implementation tests

Generate the minimum set of tests required to provide confidence.

---

# Mental Model

The goal is not:

100% coverage.

The goal is:

High confidence with low maintenance cost.
