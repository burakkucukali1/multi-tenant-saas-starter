import {
  getIntegrationDatabaseUrl,
  getIntegrationDatabaseUrlSource,
  hasIntegrationDatabase,
  resolveIntegrationDatabaseUrl,
} from "../helpers/env";

const INTEGRATION_ENV_KEYS = [
  "SUPABASE_TEST_DATABASE_URL",
  "DATABASE_URL",
] as const;

describe("resolveIntegrationDatabaseUrl", () => {
  const saved: Partial<
    Record<(typeof INTEGRATION_ENV_KEYS)[number], string | undefined>
  > = {};

  beforeEach(() => {
    for (const key of INTEGRATION_ENV_KEYS) {
      saved[key] = process.env[key];
    }
  });

  afterEach(() => {
    for (const key of INTEGRATION_ENV_KEYS) {
      if (saved[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = saved[key];
      }
    }
  });

  it("prefers SUPABASE_TEST_DATABASE_URL over DATABASE_URL", () => {
    process.env.SUPABASE_TEST_DATABASE_URL = "postgres://primary";
    process.env.DATABASE_URL = "postgres://fallback";

    expect(resolveIntegrationDatabaseUrl()).toEqual({
      url: "postgres://primary",
      source: "SUPABASE_TEST_DATABASE_URL",
    });
    expect(getIntegrationDatabaseUrlSource()).toBe(
      "SUPABASE_TEST_DATABASE_URL",
    );
  });

  it("falls back to DATABASE_URL when SUPABASE_TEST_DATABASE_URL is unset", () => {
    delete process.env.SUPABASE_TEST_DATABASE_URL;
    process.env.DATABASE_URL = "postgres://fallback";

    expect(getIntegrationDatabaseUrl()).toBe("postgres://fallback");
    expect(getIntegrationDatabaseUrlSource()).toBe("DATABASE_URL");
    expect(hasIntegrationDatabase()).toBe(true);
  });

  it("falls back to DATABASE_URL when SUPABASE_TEST_DATABASE_URL is blank", () => {
    process.env.SUPABASE_TEST_DATABASE_URL = "   ";
    process.env.DATABASE_URL = "postgres://fallback";

    expect(getIntegrationDatabaseUrl()).toBe("postgres://fallback");
    expect(getIntegrationDatabaseUrlSource()).toBe("DATABASE_URL");
  });

  it("returns null when neither URL is set", () => {
    delete process.env.SUPABASE_TEST_DATABASE_URL;
    delete process.env.DATABASE_URL;

    expect(resolveIntegrationDatabaseUrl()).toBeNull();
    expect(hasIntegrationDatabase()).toBe(false);
  });
});
