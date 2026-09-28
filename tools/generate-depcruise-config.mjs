import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { forbiddenPairs, modules, sdkPackages } from "./dependency-map.mjs";

const moduleIds = Object.keys(modules);

function modulePathPattern(id) {
  return modules[id].path;
}

function resolveAllowedPrefixes(mayDependOn, selfId) {
  if (mayDependOn.includes("*below80")) {
    return moduleIds
      .filter((id) => modules[id].rank < 80 && id !== "workflows")
      .flatMap((id) => [id, `${id}/`]);
  }

  const prefixes = [];
  for (const dep of mayDependOn) {
    if (dep === "shared") {
      prefixes.push("^shared/");
      continue;
    }
    if (dep === "features") {
      prefixes.push("^features/[^/]+/index\\.(ts|tsx)$");
      continue;
    }
    if (dep === "workflows") {
      prefixes.push("^workflows/[^/]+/index\\.(ts|tsx)$");
      continue;
    }
    if (dep === "platform") {
      prefixes.push("^platform/[^/]+/index\\.(ts|tsx)$");
      continue;
    }
    prefixes.push(`^${dep.replace(/\//g, "\\/")}`);
  }
  prefixes.push(`^${selfId.replace(/\//g, "\\/")}`);
  return prefixes;
}

/** @type {import('dependency-cruiser').IConfiguration['forbidden']} */
const forbidden = [
  {
    name: "no-circular",
    severity: "error",
    comment: "ADR-0022: dependency graph must be acyclic",
    from: {},
    to: { circular: true },
  },
  {
    name: "shared-no-upper-layers",
    severity: "error",
    comment: "ADR-0021: shared never imports features, workflows, or platform",
    from: { path: "^shared/" },
    to: { path: "^(features|workflows|platform)/" },
  },
  {
    name: "no-workflow-to-workflow",
    severity: "error",
    comment: "ADR-0021: workflows never import other workflows",
    from: { path: "^workflows/([^/]+)/" },
    to: { path: "^workflows/(?!\\1(?:/|$))" },
  },
  {
    name: "feature-public-api-only",
    severity: "error",
    comment: "ADR-0021: import features from outside via index.ts only",
    from: { path: "^(app|shared|workflows|platform|lib)/" },
    to: { path: "^features/[^/]+/(?!index\\.(ts|tsx)$).+" },
  },
  {
    name: "feature-no-cross-internal",
    severity: "error",
    comment: "ADR-0021: features import other features only via index.ts",
    from: { path: "^features/([^/]+)/" },
    to: {
      path: "^features/(?!\\1(?:/|$))[^/]+/(?!index\\.(ts|tsx)$).+",
    },
  },
  {
    name: "app-no-lib",
    severity: "error",
    comment: "ADR-0021: app uses public APIs and shared/, not lib adapters",
    from: { path: "^app/" },
    to: { path: "^lib/" },
  },
  {
    name: "middleware-isolated",
    severity: "error",
    comment: "ADR-0021: middleware stays free of domain modules",
    from: { path: "^middleware\\.ts$" },
    to: { path: "^(lib|shared|features|workflows|platform|app)/" },
  },
];

for (const [id, def] of Object.entries(modules)) {
  if (id === "workflows" || id === "app" || id === "middleware") {
    continue;
  }

  const allowed = resolveAllowedPrefixes(def.mayDependOn, id);
  const pathNot = allowed.length > 0 ? allowed : ["^$"];

  forbidden.push({
    name: `rank-${id.replace(/\//g, "-")}`,
    severity: "error",
    comment: `ADR-0021: ${id} (rank ${def.rank}) may depend only on: ${def.mayDependOn.join(", ") || "none"}`,
    from: { path: modulePathPattern(id) },
    to: {
      path: "^(app|lib|shared|features|workflows|platform)/",
      pathNot,
    },
  });
}

forbidden.push({
  name: "rank-app",
  severity: "error",
  comment:
    "ADR-0021: app (rank 100) uses shared/ and module index.ts entrypoints only",
  from: { path: "^app/" },
  to: {
    path: "^(lib|shared|features|workflows|platform)/",
    pathNot: [
      "^shared/",
      "^features/[^/]+/index\\.(ts|tsx)$",
      "^workflows/[^/]+/index\\.(ts|tsx)$",
      "^platform/[^/]+/index\\.(ts|tsx)$",
    ],
  },
});

forbidden.push({
  name: "rank-workflows",
  severity: "error",
  comment: "ADR-0021: workflows (rank 80) depend on modules below rank 80",
  from: { path: "^workflows/([^/]+)/" },
  to: {
    path: "^(app|lib|shared|features|workflows|platform)/",
    pathNot: [
      "^workflows/\\1/",
      ...moduleIds
        .filter(
          (mid) =>
            modules[mid].rank < 80 &&
            mid !== "workflows" &&
            mid !== "app" &&
            mid !== "middleware",
        )
        .flatMap((mid) => {
          const p = mid.replace(/\//g, "\\/");
          if (mid.startsWith("features/")) {
            return [`^${p}/`, `^${p}/index\\.(ts|tsx)$`];
          }
          return [`^${p}/`];
        }),
      "^features/[^/]+/index\\.(ts|tsx)$",
    ],
  },
});

for (const pair of forbiddenPairs) {
  forbidden.push({
    name: pair.name,
    severity: "error",
    comment: "ADR-0021 forbidden pair",
    from: { path: pair.from },
    to: { path: pair.to },
  });
}

for (const pkg of sdkPackages) {
  const slug = pkg.replace(/^@/, "").replace(/\//g, "-");
  forbidden.push({
    name: `sdk-${slug}-lib-only`,
    severity: "error",
    comment: "ADR-0021: vendor SDKs only in lib/",
    from: {
      path: "^(app|shared|features|workflows|platform|middleware\\.ts)",
    },
    to: {
      path: `^${pkg.replace("/", "\\/")}$`,
    },
  });
}

function buildConfig(excludeFixtures) {
  const exclude = excludeFixtures
    ? {
        path: [
          "(^|/)\\\\.next($|/)",
          "(^|/)lib/__depcruise-fixtures__($|/)",
          "(^|/)features/__depcruise-fixtures__($|/)",
          "(^|/)app/__depcruise-fixtures__($|/)",
        ],
      }
    : { path: "(^|/)\\\\.next($|/)" };

  return `/** Generated by tools/generate-depcruise-config.mjs — do not edit by hand. */
/** Regenerate: pnpm depcruise:generate */

/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: ${JSON.stringify(forbidden, null, 2)},
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    tsPreCompilationDeps: true,
    combinedDependencies: true,
    exclude: ${JSON.stringify(exclude, null, 2)},
  },
};
`;
}

const root = fileURLToPath(new URL("..", import.meta.url));
writeFileSync(`${root}/.dependency-cruiser.cjs`, buildConfig(true), "utf8");
writeFileSync(
  `${root}/.dependency-cruiser.fixtures.cjs`,
  buildConfig(false),
  "utf8",
);
console.log(
  `Wrote .dependency-cruiser.cjs and .dependency-cruiser.fixtures.cjs (${forbidden.length} rules)`,
);
