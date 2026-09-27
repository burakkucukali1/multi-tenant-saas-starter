# Stripe Integration Pattern

## Primary Goal

Use Stripe as the billing engine.

Maintain:

- Reliability
- Consistency
- Auditability
- Scalability

Stripe owns payment processing.

The application owns business rules.

---

# Core Principle

Stripe is the source of truth for:

- Customers
- Payments
- Invoices
- Subscriptions

Avoid duplicating billing state.

---

# Ownership

Billing belongs to tenants.

Not users.

Recommended:

Tenant

↓

Stripe Customer

↓

Subscription

---

# Customer Mapping

Store:

```ts
{
  (tenantId, stripeCustomerId);
}
```

Never search customers by email.

Persist Stripe IDs.

---

# Subscription Mapping

Store:

```ts
{
  (tenantId, stripeSubscriptionId);
}
```

Treat Stripe IDs as stable references.

---

# Entitlements

Avoid:

```ts
plan === "pro";
```

Prefer:

```ts
hasEntitlement("ai-chat");
```

Plans grant entitlements.

Entitlements unlock features.

---

# Checkout

Prefer:

Stripe Checkout

Benefits:

- Lower maintenance
- Better security
- PCI reduction

---

# Customer Portal

Prefer Stripe Customer Portal.

Avoid building billing management UI unless required.

---

# Webhooks

Stripe webhooks are mandatory.

Examples:

- customer.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.paid
- invoice.payment_failed

---

# Idempotency

All webhook processing must be idempotent.

Store:

```ts
{
  eventId;
}
```

Never process the same event twice.

---

# State Synchronization

Recommended:

Stripe

↓

Webhook

↓

Database

Do not rely on redirect pages.

---

# Subscription States

Common:

- trialing
- active
- past_due
- canceled

Prefer Stripe states.

---

# Failed Payments

Handle:

- Grace periods
- Access restrictions
- Notifications

Business rules should be explicit.

---

# Audit Logging

Audit:

- Subscription changes
- Upgrades
- Downgrades
- Refunds
- Billing updates

---

# Testing

Verify:

- Checkout
- Upgrade
- Downgrade
- Cancellation
- Failed payments
- Webhook retries

---

# Common Mistakes

Avoid:

- Email-based lookup
- Missing webhooks
- Plan-based authorization
- Duplicate webhook processing

---

# Mental Model

Stripe owns payments.

The application owns access.
