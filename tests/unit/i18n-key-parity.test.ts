import { spawnSync } from "node:child_process";
import path from "node:path";

const repoRoot = path.resolve(__dirname, "../..");

describe("i18n key parity (ADR-0024, P1-T02)", () => {
  it("verify-i18n-key-parity.mjs passes for en and tr", () => {
    const result = spawnSync(
      process.execPath,
      ["tools/verify-i18n-key-parity.mjs"],
      { cwd: repoRoot, encoding: "utf8" },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("i18n key parity ok");
  });
});
