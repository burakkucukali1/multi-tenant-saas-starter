import { getIntegrationDatabaseUrl } from "../helpers/env";

describe("unit project", () => {
  it("runs with TypeScript and the node test environment", () => {
    expect(1 + 1).toBe(2);
  });

  it("transforms TypeScript imports", () => {
    expect(getIntegrationDatabaseUrl()).toBeUndefined();
  });
});
