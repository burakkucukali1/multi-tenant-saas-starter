const tsTransform = {
  "^.+\\.tsx?$": [
    "ts-jest",
    {
      tsconfig: "tsconfig.jest.json",
    },
  ],
};

/** @type {import('jest').Config} */
const config = {
  projects: [
    {
      displayName: "unit",
      testEnvironment: "node",
      testMatch: ["<rootDir>/tests/unit/**/*.test.ts"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
      transform: tsTransform,
      clearMocks: true,
    },
    {
      displayName: "integration",
      testEnvironment: "node",
      setupFiles: ["<rootDir>/tests/integration/setup-env.cjs"],
      testMatch: ["<rootDir>/tests/integration/**/*.test.ts"],
      moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
      },
      transform: tsTransform,
      clearMocks: true,
      slowTestThreshold: 30,
    },
  ],
};

export default config;
