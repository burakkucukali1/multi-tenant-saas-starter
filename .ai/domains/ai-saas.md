# AI SaaS Domain Rules

## Domain Overview

AI SaaS applications combine:

- SaaS architecture
- Usage-based billing
- AI workloads
- Long-running operations

---

# AI Requests

Treat AI requests as expensive operations.

Track:

- Tokens
- Cost
- Latency
- Success rate

---

# Usage Tracking

Always track:

- Input tokens
- Output tokens
- User
- Tenant
- Model

---

# Billing

AI usage should be billable.

Possible models:

- Subscription
- Credits
- Usage Based
- Hybrid

---

# Async Processing

Consider background jobs for:

- Long prompts
- Document processing
- Agent execution
- Embeddings
- Batch tasks

Avoid blocking requests.

---

# AI Data Model

Separate:

User Input

↓

AI Request

↓

AI Response

↓

Usage Event

↓

Billing Event

---

# Prompt Storage

Store:

- Prompt
- Response
- Model
- Metadata

when business requirements allow.

---

# AI Safety

Never trust AI output.

Validate:

- Structure
- Permissions
- Ownership

before execution.

---

# Context Management

Prefer retrieval over huge prompts.

Use:

- Search
- RAG
- Context windows

efficiently.

---

# Review Checklist

- Is usage tracked?
- Is billing tracked?
- Are long tasks async?
- Is AI output validated?
- Is tenant ownership enforced?
