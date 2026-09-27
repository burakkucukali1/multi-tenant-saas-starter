# E-Commerce Domain Rules

## Domain Overview

E-commerce systems manage:

- Catalog
- Inventory
- Cart
- Orders
- Payments

---

# Inventory

Server is source of truth.

Never trust client inventory state.

---

# Cart

Optimistic updates are acceptable.

Examples:

- Add to cart
- Remove from cart
- Quantity updates

---

# Orders

Require server confirmation.

Orders should be transactional.

---

# Pricing

Pricing should always come from the server.

Never trust client-calculated totals.

---

# Search

Critical feature.

Support:

- Filters
- Sorting
- Pagination

---

# Analytics

Track:

- Views
- Conversions
- Revenue
- Cart abandonment

---

# Review Checklist

- Is inventory protected?
- Are orders transactional?
- Is pricing server-controlled?
- Are analytics captured?
