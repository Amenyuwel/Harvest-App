// eslint.config.js
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  // ✅ Start with Expo’s recommended ESLint rules
  expoConfig,

  {
    // ✅ Tell ESLint to ignore the build folder (dist/)
    ignores: ["dist/*"],
  },

  {
    // ✅ Apply these rules only to TypeScript files
    files: ["**/*.ts", "**/*.tsx"],

    // ✅ Use TypeScript parser (so ESLint understands TS syntax)
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        project: "./tsconfig.json", // link with your TypeScript settings
      },
    },

    // ✅ Add TypeScript-specific ESLint plugin
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },

    // ✅ Rules section (this is where the magic happens)
    rules: {
      // Warn if you define a variable but never use it
      "@typescript-eslint/no-unused-vars": "warn",

      // Warn if you use `any` type (forces you to be more specific)
      "@typescript-eslint/no-explicit-any": "warn",

      // Don’t force functions to always declare return types
      // (kept off for flexibility, but you can turn on later for stricter code)
      "@typescript-eslint/explicit-function-return-type": "off",

      // Enforce consistent `import type` for type-only imports
      // (helps avoid mixing value imports and type imports)
      "@typescript-eslint/consistent-type-imports": "error",

      // Warn if you try to use the "non-null assertion" (!) operator
      // (can hide potential runtime crashes)
      "@typescript-eslint/no-non-null-assertion": "warn",

      // Require strict === and !== instead of == or !=
      "eqeqeq": "error",
    },
  },
]);
