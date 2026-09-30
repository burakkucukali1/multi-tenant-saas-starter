import {
  getIntegrationDatabaseUrl,
  getIntegrationDatabaseUrlSource,
  hasIntegrationDatabase,
} from "../helpers/env";

describe("integration env loading", () => {
  it("resolves the active URL source after setup-env (no URL values logged)", () => {
    const supabase = process.env.SUPABASE_TEST_DATABASE_URL?.trim();
    const database = process.env.DATABASE_URL?.trim();
    const configured = Boolean(supabase || database);

    expect(hasIntegrationDatabase()).toBe(configured);

    if (!configured) {
      return;
    }

    expect(getIntegrationDatabaseUrl()).toMatch(/^postgres/i);

    if (supabase) {
      expect(getIntegrationDatabaseUrlSource()).toBe(
        "SUPABASE_TEST_DATABASE_URL",
      );
    } else {
      expect(getIntegrationDatabaseUrlSource()).toBe("DATABASE_URL");
    }
  });
});
