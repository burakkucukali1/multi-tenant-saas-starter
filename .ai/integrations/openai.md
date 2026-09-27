# OpenAI Integration Pattern

## Primary Goal

Integrate AI capabilities safely and predictably.

Maintain:

- Cost Control
- Reliability
- Observability

AI is probabilistic.

Applications are deterministic.

---

# Core Principle

The model generates outputs.

The application owns:

- Permissions
- Billing
- State
- Business Logic

Never delegate critical decisions to AI.

---

# Context Strategy

Prefer:

Current Task

-

Relevant Knowledge

-

Recent History

Avoid full database injection.

---

# Retrieval

Recommended:

Query

↓

Retrieval

↓

Relevant Context

↓

Prompt

Avoid sending entire knowledge bases.

---

# Tool Calling

Recommended:

Model

↓

Tool Request

↓

Application

↓

Execution

↓

Result

↓

Model

Application executes tools.

---

# Structured Outputs

Prefer:

```json
{
  "action": "create_project"
}
```

Avoid parsing free-form text.

---

# Cost Tracking

Track:

- Input Tokens
- Output Tokens
- Cost
- Model Usage

Per tenant when applicable.

---

# Rate Limiting

Protect:

- Chat
- Generation
- Tool Calls

AI endpoints require limits.

---

# Prompt Management

Prompts are application code.

Version them.

Review them.

Test them.

---

# Observability

Track:

- Cost
- Latency
- Errors
- Tool Calls

---

# Common Mistakes

Avoid:

- Full history injection
- AI-managed permissions
- Missing cost tracking
- Missing rate limiting

---

# Mental Model

AI generates responses.

The application owns decisions.
