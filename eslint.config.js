// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
    rules: {
      // Lesson copy intentionally includes natural contractions; this is not HTML output.
      "react/no-unescaped-entities": "off",
      // The Expo static-rendering hydration helper deliberately updates after mount.
      "react-hooks/set-state-in-effect": "off",
    },
  }
]);
