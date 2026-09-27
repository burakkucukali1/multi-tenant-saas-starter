# Review Skill

## Objective

Perform a senior-level engineering review.

Focus on identifying issues that increase:

- Risk
- Maintenance cost
- Complexity
- Security exposure
- Operational burden

---

# Review Priority Order

Review in this order:

1. Correctness
2. Security
3. Maintainability
4. Architecture
5. Performance
6. Testing
7. Framework Conventions
8. Style

Never prioritize style over correctness.

---

# Correctness

Verify:

- Business logic correctness
- Edge cases
- Failure handling
- State transitions
- Data consistency

Ask:

Can this produce incorrect results?

---

# Security

Review against:

- auth.md
- saas.md

Verify:

- Authentication
- Authorization
- Tenant isolation
- Ownership validation
- Input validation
- Sensitive data handling

Ask:

Can a malicious user abuse this?

---

# Maintainability

Verify:

- Readability
- Simplicity
- Duplication
- Coupling
- Cohesion

Ask:

Will future changes be expensive?

---

# Architecture

Review against:

- architecture.md

Verify:

- Separation of concerns
- Dependency direction
- Public API boundaries
- Feature ownership
- Appropriate abstractions

Ask:

Does this fit the existing architecture?

---

# Performance

Review against:

- performance.md
- nextjs.md

Look for:

- N+1 queries
- Waterfalls
- Over-fetching
- Missing caching
- Excessive JavaScript
- Large client boundaries
- Realtime inefficiencies

Ask:

Is there a meaningful bottleneck?

---

# Testing

Review against:

- testing.md

Verify:

- Critical path coverage
- Business rule coverage
- Integration testing strategy
- Regression protection

Ask:

Would this catch meaningful failures?

---

# Framework Conventions

Review against:

- nextjs.md

Verify:

- Appropriate Server Component usage
- Appropriate Server Action usage
- Correct data fetching patterns
- Correct cache invalidation strategy

Ask:

Does this follow project standards?

---

# Ignore

Do not focus on:

- Personal preferences
- Formatting debates
- Naming debates

unless they create real maintenance cost.

---

# Output Structure

Summary

Critical Issues

Major Issues

Minor Issues

Recommendations

Positive Findings
