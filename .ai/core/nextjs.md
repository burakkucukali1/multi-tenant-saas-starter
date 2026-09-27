# Next.js Engineering Playbook

## Primary Philosophy

Default to Server Components.

Default to Server Actions.

Move work to the server whenever possible.

Send as little JavaScript to the browser as possible.

---

# App Router Mental Model

Think in this order:

1. Server Component
2. Server Action
3. React Query
4. API Route

Do not start with Client Components.

Do not start with React Query.

---

# Server Components

Default choice.

Use for:

- Initial page rendering
- SEO pages
- Data fetching
- Authenticated layouts
- Dashboard shell
- Static content
- Product pages
- Detail pages

Benefits:

- Smaller bundles
- Better SEO
- Faster first render
- Reduced client work

---

# Client Components

Use only when needed.

Valid reasons:

- Event handlers
- Browser APIs
- Local state
- Animations
- Drag and drop
- Realtime interactions

Bad:

```tsx
"use client";

export default function Dashboard() {
  return (
    <>
      <Analytics />
      <Products />
      <Users />
    </>
  );
}
```

Good:

```tsx
export default function Dashboard() {
  return (
    <>
      <Analytics />
      <Products />
      <UserMenu />
    </>
  );
}
```

```tsx
"use client";

export function UserMenu() {}
```

Keep client boundaries small.

---

# Data Fetching

Default:

```tsx
export default async function Page() {
  const data = await getData();

  return <View data={data} />;
}
```

Prefer server-side fetching.

Avoid unnecessary client-side requests.

---

# Fetch Where Needed

Do not centralize all fetching in layouts.

Bad:

Layout loads everything.

Good:

Each component loads its own data.

Benefits:

- Better streaming
- Better Suspense usage
- Better ownership
- Better maintainability

---

# Layout Guidelines

Layouts may fetch:

- User
- Workspace
- Tenant
- Locale
- Shared context

Layouts should not fetch:

- Analytics
- Reports
- Invoices
- Feature-specific data

Avoid turning layouts into giant loaders.

---

# Request Memoization

Same fetch in the same request may be deduplicated.

Multiple fetch calls do not always mean multiple network requests.

Avoid premature optimization.

---

# Parallel Fetching

Bad:

```tsx
const user = await getUser();
const projects = await getProjects();
const billing = await getBilling();
```

Good:

```tsx
const [user, projects, billing] = await Promise.all([
  getUser(),
  getProjects(),
  getBilling(),
]);
```

Use for independent requests.

---

# Suspense

Use when parts of the UI can load independently.

Benefits:

- Progressive rendering
- Streaming
- Faster perceived performance

Ask:

Can part of the page render without waiting for another part?

If yes:

Consider Suspense.

---

# Streaming

Use for:

- Dashboards
- Reports
- Analytics
- Slow APIs

Avoid making users wait for the entire page.

---

# Hydration

Goal:

Server output must match initial client output.

Avoid during first render:

```tsx
Date.now();
Math.random();
window.innerWidth;
window.location;
```

Hydration mismatches are bugs.

---

# Server Actions

Default mutation solution.

Use for:

- Create
- Update
- Delete

Example:

```tsx
"use server";

export async function createProject() {
  await db.project.create(...);
}
```

Prefer Server Actions before API Routes.

---

# Cache Invalidation

After mutations:

Always consider cache invalidation.

Options:

```tsx
revalidatePath();
```

```tsx
revalidateTag();
```

Failure to invalidate cache may create stale UI.

---

# Cache Strategy

Question:

How stale can this data be?

Rarely changing:

- Countries
- Settings
- Feature Flags

Medium frequency:

- Projects
- Users

High frequency:

- Notifications
- Prices
- Presence

Choose cache strategy accordingly.

---

# React Query Philosophy

React Query is not a replacement for Server Components.

React Query is for:

- Interactive data
- Frequently changing data
- Realtime data

---

# Use React Query For

- Search
- Filters
- Pagination
- Infinite Scroll
- Polling
- Chat
- Notifications
- Realtime dashboards
- Background refetching

---

# Do Not Use React Query For

- Static pages
- SEO pages
- Initial page load
- Simple server-rendered content

---

# Recommended Pattern

Server:

```tsx
const projects = await getProjects();

return <ProjectsTable initialProjects={projects} />;
```

Client:

```tsx
const { data } = useQuery({
  queryKey: ["projects"],
  queryFn: getProjects,
  initialData: initialProjects,
});
```

Benefits:

- Instant first render
- No loading flash
- Hydrated cache

---

# React Query Cache

Available APIs:

```tsx
queryClient.getQueryData();
queryClient.setQueryData();
queryClient.invalidateQueries();
```

Remember:

React Query cache is user-local.

It is not shared between users.

---

# Optimistic UI

Use when user already knows the expected outcome.

Examples:

- Like
- Follow
- Add to cart
- Mark as read
- Favorite

Avoid for:

- Payments
- Banking
- Accounting
- Critical financial actions

Rule:

UI may be optimistic.

Server remains source of truth.

---

# API Routes

Use when:

- Mobile clients need access
- External systems need access
- Webhooks are required
- Public APIs are needed

Do not automatically create API routes for internal mutations.

Use Server Actions first.

---

# Middleware

Use for:

- Authentication
- Redirects
- Locale
- Tenant resolution
- Rate limiting
- A/B testing

Avoid:

- Database queries
- Business logic
- Large calculations
- Slow API calls

Middleware should be:

- Fast
- Cheap
- Stateless

---

# N+1 Queries

Warning signs:

- for + await
- map + fetch
- map + db query
- map + useQuery

Bad:

100 records
→ 101 queries

Solutions:

- Join
- Batch query
- Nested select

Promise.all is not a solution to N+1.

It only parallelizes N+1.

---

# Performance Checklist

Before shipping:

- Is Server Component possible?
- Is Client Component necessary?
- Is React Query necessary?
- Is N+1 present?
- Can requests run in parallel?
- Should Suspense be used?
- Is cache strategy appropriate?
- Is bundle size minimized?

---

# Golden Rule

Initial render:

Server Components

Mutations:

Server Actions

Interactive data:

React Query

External access:

API Routes
