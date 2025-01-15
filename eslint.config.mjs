import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
    rules: {
      quotes: ["error", "single"], // Memaksa penggunaan tanda kutip tunggal
    },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
