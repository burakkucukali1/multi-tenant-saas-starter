import { Client } from "pg";

import { getIntegrationDatabaseUrl } from "../../helpers/env";

export async function withIntegrationClient<T>(
  run: (client: Client) => Promise<T>,
): Promise<T> {
  const connectionString = getIntegrationDatabaseUrl();
  if (!connectionString) {
    throw new Error("Integration database URL is not configured");
  }

  const client = new Client({
    connectionString,
    ssl: connectionString.includes("localhost")
      ? undefined
      : { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    return await run(client);
  } finally {
    await client.end();
  }
}
