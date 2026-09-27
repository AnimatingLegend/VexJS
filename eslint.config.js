import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
  },
  {
    files: ["source/VexBasic.js"],
    rules: {
      "no-unused-vars": ["error", { args: "none" }],
    },
  },
];
