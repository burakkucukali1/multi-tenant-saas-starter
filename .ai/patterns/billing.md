# Billing Pattern

## Primary Goal

Monetize access to a product while maintaining a clear separation between:

- Billing
- Permissions
- Features
- Usage

Billing determines what a tenant has purchased.

Billing does not determine authorization.

---

# Mental Model

Tenant

↓

Subscription

↓

Plan

↓

Entitlements

↓

Usage Limits

Plans define access.

Entitlements define capabilities.

Usage limits define consumption.

---

# Core Principle

Separate:

Permissions

↓

What a user can do

Plans

↓

What a tenant has purchased

Do not mix them.

---

# Ownership

Billing belongs to the tenant.

Not the user.

Good:

```txt
Tenant
└─ Subscription
```

Bad:

```txt
User
└─ Subscription
```

for collaborative SaaS products.

---

# Plan Structure

Typical:

```txt
Free

Pro

Enterprise
```

Plans should describe commercial offerings.

Avoid embedding business logic inside plan names.

---

# Entitlements

Plans grant entitlements.

Example:

```txt
AI Chat

Priority Support

Custom Branding

API Access
```

Entitlements control feature availability.

---

# Feature Access

Feature access should be evaluated through entitlements.

Example:

```ts
hasEntitlement("ai-chat");
```

Avoid:

```ts
plan === "pro";
```

Business rules change.

Entitlements scale better.

---

# Permissions vs Entitlements

Permissions:

```txt
What a user can do
```

Entitlements:

```txt
What a tenant owns
```

Example:

```txt
Permission:
project.delete

Entitlement:
ai-chat
```

They solve different problems.

---

# Usage Limits

Common limits:

- Seats
- Projects
- Storage
- Messages
- API Requests
- Workspaces

Limits should be enforced on the server.

---

# Seat Limits

Example:

```txt
Free
5 seats

Pro
25 seats

Enterprise
Unlimited
```

Always validate limits before adding members.

---

# Consumption Tracking

Track usage separately.

Example:

```ts
{
  (tenantId, metric, value, timestamp);
}
```

Usage tracking should be auditable.

---

# Trial Model

Typical flow:

```txt
Trial

↓

Active

↓

Expired
```

Trials should have explicit expiration dates.

Avoid implicit trial logic.

---

# Subscription States

Recommended:

```txt
Trialing

Active

Past Due

Canceled

Expired
```

State transitions should be explicit.

---

# Upgrade Flow

Typical:

```txt
Current Plan

↓

Upgrade

↓

Entitlements Updated

↓

Limits Updated
```

Upgrades should take effect predictably.

---

# Downgrade Flow

Downgrades require special handling.

Validate:

- Existing usage
- Existing seats
- Existing storage
- Existing entitlements

Avoid creating invalid states.

---

# Grace Periods

Consider grace periods for:

- Failed payments
- Expired subscriptions

Example:

```txt
Past Due

↓

7 Days

↓

Restricted Access
```

Business rules should be explicit.

---

# Billing Source of Truth

Use a single source of truth.

Avoid:

```txt
Database says active

Provider says canceled
```

Subscription state should remain consistent.

---

# Invoices

Invoices are historical records.

Invoices should never be modified after creation.

Treat invoices as immutable.

---

# Refunds

Refunds should create events.

Example:

```txt
Invoice

↓

Refund Event
```

Avoid mutating historical billing records.

---

# Usage-Based Billing

Recommended model:

```txt
Entitlement

↓

Usage Tracking

↓

Billing Calculation
```

Track usage separately from billing logic.

---

# Feature Gating

Evaluate:

```txt
Subscription State

+

Entitlement

+

Usage Limit
```

All three may affect access.

---

# Audit Logging

Audit:

- Plan changes
- Upgrades
- Downgrades
- Refunds
- Subscription changes
- Limit changes

Billing actions should be traceable.

---

# Background Jobs

Use jobs for:

- Subscription sync
- Usage aggregation
- Invoice generation
- Billing reconciliation

Avoid expensive billing work inside requests.

---

# Testing Requirements

Always test:

- Trial expiration
- Upgrades
- Downgrades
- Limit enforcement
- Entitlement changes
- Subscription cancellation
- Failed payments

Billing bugs are revenue bugs.

---

# Common Mistakes

Avoid:

- plan === "pro"
- Permissions tied to plans
- User-owned subscriptions
- Missing usage tracking
- Missing limit enforcement
- Mutating invoice history

---

# Review Checklist

Ask:

- Is billing tenant-owned?
- Are permissions separate from plans?
- Are entitlements explicit?
- Are limits enforced on the server?
- Are subscription states explicit?
- Is usage tracked?
- Are billing events auditable?

---

# Mental Model

Billing determines what a tenant has purchased.

Permissions determine what a user can do.

Usage determines what has been consumed.

Keep all three separate.
