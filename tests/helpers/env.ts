/**
 * CI / dev Supabase Postgres connection (ADR-0041, ADR-0025).
 * Set SUPABASE_TEST_DATABASE_URL (preferred) or DATABASE_URL for integration tests.
 */
export function getIntegrationDatabaseUrl(): string | undefined {
  const url =
    process.env.SUPABASE_TEST_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!url || url.trim().length === 0) {
    return undefined;
  }
  return url;
}

export function hasIntegrationDatabase(): boolean {
  return getIntegrationDatabaseUrl() !== undefined;
}
