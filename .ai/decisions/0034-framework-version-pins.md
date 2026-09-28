# ADR-0034: Framework Version Pins

- Status: Accepted
- Date: 2026-09-27
- Accepted: 2026-09-28
- Approval level: L3
- Related: ADR-0002, ADR-0030

## Context

Every derived product inherits exact runtime and tooling versions. Pins must match **latest stable** framework releases at acceptance time, React versions required by that Next.js release, **Active LTS** Node.js supported by Next.js, and **pnpm** as the package manager.

## Decision

Pinned on **2026-09-28** (resolved from npm registry and Node.js release status):

| Package | Pin | Notes |
|---|---|---|
| **Next.js** | `16.3.6` | Latest stable on npm at pin date |
| **React** | `19.3.0` | Latest stable; satisfies Next.js 16.3.6 peer `^19.0.0` |
| **react-dom** | `19.3.0` | Same as React |
| **Node.js** | `24.21.0` | Active LTS (“Krypton”); satisfies Next.js engine `>=20.9.0` |
| **pnpm** | `12.6.0` | Latest stable on npm at pin date |

**Policy (ADR-0030):**

- Commit the lockfile. Use **exact** versions in `package.json` for Next.js, React, and react-dom.
- Enable **Corepack** and set `packageManager` to `pnpm@12.6.0` when the app is scaffolded (P0-T06).
- Document Node `24.21.0` in `.nvmrc` or `.node-version` and in CI.
- Patch updates flow through Renovate; **major** Next.js or React upgrades require Level 3 review.

**Verification source at pin time:**

- `npm view next version` → `16.3.6`
- `npm view react version` / `react-dom` → `19.3.0`
- `npm view next@16.3.6 engines` → `node: '>=20.9.0'`
- Node.js 24.x Active LTS per [nodejs.org release schedule](https://nodejs.org/en/about/previous-releases)

## Consequences

- All contributors and CI use the same Node and pnpm versions.
- “Latest stable” is a point-in-time snapshot; Renovate keeps patches current within policy.

## Alternatives Considered

None at acceptance. Owner specified latest stable Next.js, matching React, Active LTS Node, and pnpm.
