module.exports = {
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  env: {
    node: true,
    es6: true,
    mocha: true,
  },
  extends: ["eslint:recommended"],
  rules: {
    "prefer-const": "error", // Ensures variables that aren't reassigned are declared with const
    "no-var": "error", // Disallows the use of var
    "no-const-assign": "error", // Disallows reassigning const variables
  },
};
