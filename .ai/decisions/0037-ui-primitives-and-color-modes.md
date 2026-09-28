# ADR-0037: UI Primitive Foundation and Color Modes

- Status: Proposed
- Date: 2026-09-27
- Approval level: L3
- Needed by: Phase 1
- Related: ADR-0023

## Context

`shared/ui` needs a base for accessible primitives such as dialogs, menus, and popovers. Color mode support affects how tokens are structured.

## Options

1. **Radix primitives with copied, owned components (shadcn/ui approach).**
   - Accessible, token-friendly, and no runtime component library lock-in.
   - We own and maintain the component code.
2. **Headless UI or React Aria.**
   - Similar tradeoffs to option 1, with a different API style.
3. **Fully custom primitives.**
   - Maximum control.
   - Accessibility becomes a large, ongoing cost.

Color modes:

- (a) light only
- (b) light and dark, with semantic tokens per mode

## Recommendation

Option 1 with (b). Tokens are already semantic (ADR-0023), so adding dark mode later would cost more than supporting it now.

## Decision

Pending owner decision.
