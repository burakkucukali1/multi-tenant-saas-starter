# ADR-0023: Centralized Design System and Branding

- Status: Accepted
- Date: 2026-09-27
- Approval level: L3
- Related: ADR-0003, ADR-0031, ADR-0037

## Context

Derived products must be able to rebrand without touching feature modules.

## Decision

- All brand configuration lives in `lib/config/brand.ts`: app name, logo assets, primary, secondary, and semantic colors, gradients, typography, and radius tokens.
- Tokens are exposed as CSS custom properties and mapped in the Tailwind theme. Components use semantic token classes only. Raw palette values and hex colors are forbidden outside the token layer, and lint enforces this.
- Shared UI components live in `shared/ui`. Feature modules never define their own primitives.
- App name and logo are read only through the brand config.
- The choice of UI primitive base and color modes (light and dark) is open in ADR-0037.

## Consequences

- Rebranding a product means editing one file and its assets, which keeps conflicts during upstream merges small.
- A token contract test guards against missing or renamed tokens.
- The token layer is an up-front abstraction. It is justified because retrofitting it would mean a sweep across the whole codebase.

## Alternatives Considered

- Per-feature styling: every rebrand becomes a sweep across the codebase.
