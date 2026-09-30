/**
 * CI / dev Supabase Postgres connection (ADR-0041, ADR-0025).
 * Set SUPABASE_TEST_DATABASE_URL (preferred) or DATABASE_URL for integration tests.
 */
export type IntegrationDatabaseUrlSource =
  "SUPABASE_TEST_DATABASE_URL" | "DATABASE_URL";

export function resolveIntegrationDatabaseUrl(): {
  url: string;
  source: IntegrationDatabaseUrlSource;
} | null {
  const fromSupabase = process.env.SUPABASE_TEST_DATABASE_URL?.trim();
  if (fromSupabase) {
    return { url: fromSupabase, source: "SUPABASE_TEST_DATABASE_URL" };
  }

  const fromDatabase = process.env.DATABASE_URL?.trim();
  if (fromDatabase) {
    return { url: fromDatabase, source: "DATABASE_URL" };
  }

  return null;
}

export function getIntegrationDatabaseUrl(): string | undefined {
  return resolveIntegrationDatabaseUrl()?.url;
}

export function getIntegrationDatabaseUrlSource():
  IntegrationDatabaseUrlSource | undefined {
  return resolveIntegrationDatabaseUrl()?.source;
}

export function hasIntegrationDatabase(): boolean {
  return getIntegrationDatabaseUrl() !== undefined;
}
