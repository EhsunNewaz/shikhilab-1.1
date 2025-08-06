/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "./eslint-config.js",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["react", "react-hooks"],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "react/react-in-jsx-scope": "off", // Not needed in Next.js
  },
  parserOptions: {
    project: true,
    ecmaFeatures: {
      jsx: true,
    },
  },
}