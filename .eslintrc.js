/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["eslint:recommended"],
  env: {
    node: true,
    es6: true,
  },
  ignorePatterns: [
    "**/*.config.js",
    "**/*.config.cjs", 
    ".next",
    "dist",
    "node_modules",
  ],
}
