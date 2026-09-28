import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const depcruiseBin = fileURLToPath(
  new URL(
    "../node_modules/dependency-cruiser/bin/dependency-cruise.mjs",
    import.meta.url,
  ),
);

const cases = [
  {
    name: "cycle",
    paths: ["lib/__depcruise-fixtures__/cycle"],
    expectRule: "no-circular",
  },
  {
    name: "feature-internal",
    paths: [
      "lib/__depcruise-fixtures__/feature-internal",
      "features/__depcruise-fixtures__",
    ],
    expectRule: "feature-public-api-only",
  },
];

const eslintSdkFixture = "app/__depcruise-fixtures__/sdk-bad.ts";

let failed = 0;

for (const testCase of cases) {
  const result = spawnSync(
    process.execPath,
    [
      depcruiseBin,
      ...testCase.paths,
      "--config",
      ".dependency-cruiser.fixtures.cjs",
      "--output-type",
      "json",
    ],
    { encoding: "utf8", cwd: fileURLToPath(new URL("..", import.meta.url)) },
  );

  const output = `${result.stdout}${result.stderr}`;
  let violations = [];

  try {
    const parsed = JSON.parse(result.stdout || "{}");
    violations = parsed.summary?.violations ?? [];
  } catch {
    failed += 1;
    console.error(`[${testCase.name}] could not parse depcruise output`);
    continue;
  }

  const matched = violations.some(
    (v) =>
      v.rule.name === testCase.expectRule ||
      v.rule.name.startsWith(testCase.expectRule),
  );

  if (violations.length === 0 && result.status === 0) {
    failed += 1;
    console.error(
      `[${testCase.name}] expected violations but cruise reported none`,
    );
    continue;
  }

  if (!matched) {
    failed += 1;
    console.error(
      `[${testCase.name}] expected rule ${testCase.expectRule}, got:`,
    );
    console.error(output.slice(0, 500));
  } else {
    console.log(`[${testCase.name}] ok`);
  }
}

const eslintResult = spawnSync(
  process.execPath,
  [
    fileURLToPath(
      new URL("../node_modules/eslint/bin/eslint.js", import.meta.url),
    ),
    eslintSdkFixture,
    "--no-ignore",
    "--format",
    "json",
  ],
  { encoding: "utf8", cwd: fileURLToPath(new URL("..", import.meta.url)) },
);

let sdkErrors = 0;
try {
  const eslintJson = JSON.parse(eslintResult.stdout || "[]");
  sdkErrors = eslintJson
    .flatMap((f) => f.messages)
    .filter((m) => m.ruleId === "no-restricted-imports").length;
} catch {
  sdkErrors = 0;
}

if (sdkErrors === 0) {
  failed += 1;
  console.error(
    "[sdk-outside-lib] expected ESLint no-restricted-imports on app fixture",
  );
} else {
  console.log("[sdk-outside-lib] ok (ESLint boundary)");
}

if (failed > 0) {
  process.exit(1);
}

console.log("All architecture rule self-tests passed.");
