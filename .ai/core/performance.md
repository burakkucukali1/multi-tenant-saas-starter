# Performance Engineering Playbook

## Primary Goal

Performance is not about making code fast.

Performance is about:

- Reducing user wait time
- Reducing infrastructure cost
- Increasing system capacity
- Maintaining responsiveness

Never optimize blindly.

Measure first.

---

# Performance Priority Order

Optimize in this order:

1. Correctness
2. Architecture
3. Query Efficiency
4. Network Efficiency
5. Rendering Efficiency
6. Micro Optimizations

Avoid optimizing code that is not a bottleneck.

---

# Senior Performance Question

Before optimizing ask:

"What is actually slow?"

Never optimize based on assumptions.

---

# Common Performance Problems

Most applications are slowed by:

- Excessive network requests
- N+1 queries
- Waterfall requests
- Large bundles
- Over-fetching
- Missing caching

Not by:

- for vs map
- tiny loops
- micro benchmarks

---

# N+1 Queries

Definition:

1 query becomes:

1 + N queries

Example:

Projects:

```ts
const projects = await getProjects();

for (const project of projects) {
  await getOwner(project.id);
}
```

10 projects:

11 queries

100 projects:

101 queries

---

# N+1 Warning Signs

Look for:

- for + await
- map + fetch
- map + db query
- nested fetching

Always investigate.

---

# N+1 Solutions

Prefer:

- JOIN
- Nested Select
- Batch Query
- DataLoader Pattern

Example:

Bad:

Project
↓
Owner
↓
100 queries

Good:

Single query with relationship loading.

---

# Promise.all

Use for independent requests.

Bad:

```ts
const user = await getUser();

const projects = await getProjects();

const billing = await getBilling();
```

Good:

```ts
const [user, projects, billing] = await Promise.all([
  getUser(),
  getProjects(),
  getBilling(),
]);
```

---

# Important

Promise.all is NOT a solution to N+1.

It only parallelizes N+1.

100 queries remain 100 queries.

---

# Waterfall Requests

Definition:

Request B waits for Request A.

Request C waits for Request B.

Example:

```txt
User
↓
Projects
↓
Invoices
↓
Reports
```

Each dependency adds latency.

Avoid when requests are independent.

---

# Parallelization

Ask:

Can these requests run independently?

If yes:

Use Promise.all.

---

# Caching Philosophy

Cache exists to trade freshness for speed.

Question:

How stale can this data be?

---

# Cache Layers

Layer 1:

Browser Cache

---

Layer 2:

React Query Cache

---

Layer 3:

HTTP Cache

---

Layer 4:

CDN

---

Layer 5:

Application Cache

Redis

---

Layer 6:

Database

---

# Rule

Solve performance problems at the highest possible layer.

Higher layers are cheaper.

---

# React Query Cache

React Query cache is:

- Per user
- In memory
- Session scoped

Benefits:

- Faster navigation
- Reduced requests
- Better UX

---

# staleTime Strategy

Never use identical staleTime everywhere.

Determine freshness by business requirements.

---

# Long staleTime

Examples:

- Countries
- Settings
- Feature Flags
- Currency Lists

---

# Medium staleTime

Examples:

- Projects
- Users
- Teams

Typical:

30-60 seconds

---

# Short staleTime

Examples:

- Notifications
- Prices
- Presence

Consider:

- Polling
- SSE
- WebSockets

---

# Cache Invalidation

Mutation changes data.

Cache must eventually reflect truth.

Options:

```ts
invalidateQueries();
```

```ts
revalidatePath();
```

```ts
revalidateTag();
```

---

# Source of Truth

Always remember:

# Server

Source of Truth

# Cache

Optimization

Never reverse this relationship.

---

# Request Deduplication

Definition:

Multiple identical requests become one request.

Benefits:

- Less traffic
- Less backend load
- Faster rendering

Examples:

- React Query
- Next.js request memoization

---

# Race Conditions

Definition:

Responses arrive in unexpected order.

Example:

User types:

a

ab

abc

Response order:

abc
a
ab

Wrong data may appear.

---

# Race Condition Solutions

Use:

- AbortController
- Request IDs
- React Query

Always ask:

"What happens if the response arrives late?"

---

# Debouncing

Use for:

- Search
- Autocomplete
- Live filtering

Avoid firing requests for every keystroke.

---

# Bundle Size

JavaScript is expensive.

Minimize client-side code.

Prefer:

- Server Components
- Code Splitting
- Dynamic Imports

Avoid:

- Large client boundaries
- Unused libraries
- Excessive client state

---

# Rendering Performance

Before optimizing rendering ask:

Can this run on the server?

Server rendering is often the best optimization.

---

# Virtualization

Consider for:

- Large tables
- Large lists
- Infinite feeds

Examples:

- 1,000+ rows
- Large datasets

Avoid rendering everything.

---

# Suspense

Use when parts of the UI can load independently.

Benefits:

- Progressive rendering
- Better perceived performance

---

# Streaming

Useful for:

- Dashboards
- Analytics
- Reports
- Heavy pages

Do not block entire pages on slow data.

---

# Realtime Systems

Common mistake:

Polling everything.

Choose based on requirements.

---

# Polling

Good for:

- Occasionally changing data

---

# SSE

Good for:

- One-way updates

---

# WebSockets

Good for:

- Chat
- Presence
- Collaborative editing
- Live dashboards

---

# WebSocket Production Requirements

Consider:

- Reconnection
- Exponential backoff
- Event ordering
- Duplicate events
- Offline recovery

---

# Observability

Performance cannot be improved if it cannot be measured.

Monitor:

- Latency
- Error rate
- Throughput
- Cache hit rate

Use tools such as:

- Sentry
- Datadog
- OpenTelemetry

---

# Performance Review Checklist

Ask:

- Is N+1 present?
- Are requests parallelized?
- Is caching appropriate?
- Is staleTime correct?
- Are race conditions possible?
- Is bundle size minimized?
- Can work move to the server?
- Is virtualization needed?
- Is realtime strategy appropriate?

---

# Mental Model

Slow systems usually fail because of:

- Too many requests
- Too much JavaScript
- Too little caching
- Poor data access patterns

Not because of micro-optimizations.

Focus on architecture first.

Optimization second.
