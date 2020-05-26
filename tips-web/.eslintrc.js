module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    indent: ['error', 2],
    quotes: ['error', "single"],
    semi: ['error', 'always'],
    'arrow-parens': 0,
    'no-console': 'off',
    'no-global-assign': 'off',
  },
};
