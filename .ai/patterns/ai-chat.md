# AI Chat Pattern

## Primary Goal

Build AI-powered conversational systems that are:

- Reliable
- Maintainable
- Observable
- Cost-efficient

AI systems should be treated as probabilistic systems.

Never assume deterministic behavior.

---

# Mental Model

User

↓

Conversation

↓

Messages

↓

Context Assembly

↓

Model

↓

Response

↓

Persistence

The model generates responses.

The application owns state.

---

# Core Principle

The AI model is not the source of truth.

The application is the source of truth.

Never delegate:

- Authorization
- Billing decisions
- Permission evaluation
- Critical business logic

to the model.

---

# Conversation Structure

Recommended:

```txt
Conversation

↓

Messages

↓

Attachments

↓

Metadata
```

Store conversations explicitly.

---

# Message Structure

Recommended:

```ts
{
  (id, conversationId, role, content, createdAt);
}
```

Roles:

```txt
system
user
assistant
tool
```

Keep message history immutable.

---

# Context Assembly

Models should not receive the entire database.

Build context deliberately.

Context may include:

- Conversation history
- User information
- Workspace information
- Retrieved documents
- Tool results

Only provide necessary context.

---

# Context Window

Context is limited.

Large histories increase:

- Cost
- Latency
- Token usage

Continuously evaluate:

What information is actually required?

---

# Context Strategy

Prefer:

```txt
Recent Messages

+

Relevant Knowledge

+

Current Task
```

Avoid sending entire histories.

---

# Retrieval

For large knowledge bases:

Prefer:

```txt
User Query

↓

Retrieval

↓

Relevant Documents

↓

Prompt
```

Do not inject entire datasets into prompts.

---

# Memory

Memory should be application-managed.

Avoid:

```txt
Conversation History
=
Memory
```

Conversation history grows indefinitely.

Memory should be curated.

---

# Memory Types

Short-Term Memory

```txt
Current Conversation
```

Long-Term Memory

```txt
Persisted User Context
```

Knowledge Memory

```txt
Retrieved Documents
```

Treat them separately.

---

# Tool Calling

Recommended flow:

```txt
User

↓

Model

↓

Tool Call

↓

Application

↓

Tool Result

↓

Model
```

Tools execute actions.

Models decide when tools are needed.

---

# Tool Design

Tools should be:

- Focused
- Deterministic
- Observable

Avoid large multi-purpose tools.

Prefer small capabilities.

---

# Tool Safety

Never allow unrestricted access to:

- Databases
- Billing systems
- User management
- Administrative actions

Tool execution should be controlled.

---

# Structured Outputs

Prefer structured outputs when possible.

Example:

```json
{
  "action": "create_project",
  "name": "Website Redesign"
}
```

Avoid parsing free-form text when structure is required.

---

# Streaming

Use streaming for:

- Chat
- Long responses
- AI generation

Benefits:

- Better UX
- Lower perceived latency

---

# Cost Control

Monitor:

- Input tokens
- Output tokens
- Tool usage
- Model usage

AI costs should be observable.

---

# Usage Tracking

Track:

```ts
{
  (userId, tenantId, model, inputTokens, outputTokens, cost, createdAt);
}
```

Usage should be auditable.

---

# Rate Limiting

Protect:

- Chat endpoints
- Generation endpoints
- Tool execution

AI systems require rate limits.

---

# Prompt Ownership

Prompts are application code.

Treat prompts as versioned assets.

Avoid hidden prompt logic.

---

# Prompt Design

Prefer:

- Clear instructions
- Explicit constraints
- Structured outputs
- Deterministic workflows

Avoid ambiguous prompts.

---

# Hallucinations

Assume hallucinations are possible.

Always validate:

- Financial data
- Authorization decisions
- Business rules
- Database actions

Never trust generated facts blindly.

---

# Human Approval

Consider approval flows for:

- Payments
- Destructive actions
- Sensitive changes
- Administrative actions

AI should assist.

Not autonomously control critical systems.

---

# Observability

Monitor:

- Cost
- Latency
- Failure rates
- Tool failures
- Hallucination reports

AI systems require visibility.

---

# Testing Requirements

Test:

- Prompt behavior
- Tool calling
- Context assembly
- Structured outputs
- Failure handling

AI systems should be tested as workflows.

---

# Common Mistakes

Avoid:

- Full history injection
- AI-managed permissions
- AI-managed billing
- Unbounded context
- Missing rate limits
- Missing observability

---

# Review Checklist

Ask:

- Is context minimized?
- Are tools safe?
- Is usage tracked?
- Is memory managed?
- Are hallucinations mitigated?
- Are costs observable?

---

# Mental Model

The model generates responses.

The application owns:

- State
- Permissions
- Billing
- Data
- Business logic

Keep this boundary clear.
