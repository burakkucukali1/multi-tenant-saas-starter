import { hasIntegrationDatabase } from "../helpers/env";
import { withIntegrationClient } from "./helpers/database";

describe("integration database (Supabase Cloud CI project)", () => {
  if (!hasIntegrationDatabase()) {
    it("skipped until SUPABASE_TEST_DATABASE_URL is configured (P0-T16/T17)", () => {
      expect(true).toBe(true);
    });
    return;
  }

  it("connects and executes SELECT 1", async () => {
    await withIntegrationClient(async (client) => {
      const result = await client.query<{ ok: number }>("SELECT 1 AS ok");
      expect(result.rows[0]?.ok).toBe(1);
    });
  });
});
