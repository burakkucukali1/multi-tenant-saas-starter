import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

const rawColorMessage =
  "Raw color literals are not allowed here (ADR-0023). Use semantic Tailwind token classes, or define colors in app/globals.css / lib/config only.";

const sdkImportPaths = [
  {
    name: "@supabase/supabase-js",
    message: "Supabase SDK is only allowed under lib/ (ADR-0021).",
  },
  {
    name: "@supabase/ssr",
    message: "Supabase SDK is only allowed under lib/ (ADR-0021).",
  },
  {
    name: "@clerk/nextjs",
    message: "Clerk SDK is only allowed under lib/auth (ADR-0021).",
  },
  {
    name: "@clerk/backend",
    message: "Clerk SDK is only allowed under lib/auth (ADR-0021).",
  },
  {
    name: "stripe",
    message: "Stripe SDK is only allowed under lib/stripe (ADR-0021).",
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "next-env.d.ts",
    "scaffold-tmp/**",
    "tools/depcruise-fixtures/**",
    "lib/__depcruise-fixtures__/**",
    "features/__depcruise-fixtures__/**",
    "app/__depcruise-fixtures__/**",
  ]),
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["lib/**"],
    rules: {
      "no-restricted-imports": ["error", { paths: sdkImportPaths }],
    },
  },
  {
    files: ["lib/auth/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: sdkImportPaths.filter((p) => !p.name.startsWith("@clerk")),
        },
      ],
    },
  },
  {
    files: ["lib/db/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: sdkImportPaths.filter((p) => !p.name.startsWith("@supabase")),
        },
      ],
    },
  },
  {
    files: ["lib/stripe/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: sdkImportPaths.filter((p) => p.name !== "stripe"),
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["lib/config/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Literal[value=/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
          message: rawColorMessage,
        },
        {
          selector: "Literal[value=/\\brgb\\(/]",
          message: rawColorMessage,
        },
        {
          selector: "Literal[value=/\\brgba\\(/]",
          message: rawColorMessage,
        },
        {
          selector: "Literal[value=/\\bhsl\\(/]",
          message: rawColorMessage,
        },
        {
          selector: "Literal[value=/\\bhsla\\(/]",
          message: rawColorMessage,
        },
        {
          selector: "TemplateElement[value.raw=/#[0-9a-fA-F]{3,8}/]",
          message: rawColorMessage,
        },
        {
          selector: "TemplateElement[value.raw=/\\brgb\\(/]",
          message: rawColorMessage,
        },
        {
          selector: "TemplateElement[value.raw=/\\bhsl\\(/]",
          message: rawColorMessage,
        },
      ],
    },
  },
]);

export default eslintConfig;
