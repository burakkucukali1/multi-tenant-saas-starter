# Fintech Domain Rules

## Domain Overview

Fintech systems prioritize:

1. Correctness
2. Security
3. Compliance
4. Performance

Never reverse this order.

---

# Source Of Truth

Financial records are authoritative.

Avoid optimistic updates.

Server confirmation required.

---

# Audit Logging

Mandatory.

Track:

- Actor
- Action
- Timestamp
- Previous Value
- New Value

---

# Compliance

Design with compliance in mind.

Examples:

- GDPR
- PCI
- SOC2

---

# Permissions

Require strong authorization.

Every sensitive action should be verified.

---

# Data Integrity

Prefer transactions.

Avoid partial updates.

---

# Idempotency

Critical financial operations should be idempotent.

Examples:

- Payments
- Transfers
- Withdrawals

---

# Review Checklist

- Is audit logging present?
- Are transactions safe?
- Is optimistic UI avoided?
- Is idempotency considered?
- Are permissions enforced?
