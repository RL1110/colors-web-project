import js from "@eslint/js";
import globals from "globals";

export default [
  {
    ignores: ["node_modules/**", "LAMP Stack/js/md5.js"]
  },
  js.configs.recommended,
  {
    files: ["LAMP Stack/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        md5: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", {
        "varsIgnorePattern": "^(doLogin|saveCookie|readCookie|doLogout|addColor|searchColor)$"
      }]
    }
  }
];
