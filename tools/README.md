# Architecture tooling

## Dependency map (ADR-0021)

- Source: `tools/dependency-map.mjs`
- Regenerate dependency-cruiser configs: `pnpm depcruise:generate`
- Main check: `pnpm depcruise`
- Rule self-tests: `pnpm depcruise:validate-rules`

Update the map and ADR-0021 changelog together when adding modules.
