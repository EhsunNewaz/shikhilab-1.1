/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./eslint-config.js"],
  env: {
    node: true,
  },
  parserOptions: {
    project: true,
  },
}