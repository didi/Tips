module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
  env: {
    browser: true,
  },
  rules: {
    indent: ['error', 2],
    quotes: ['error', "single"],
    semi: ['error', 'always'],
    'arrow-parens': 0,
  }
}
