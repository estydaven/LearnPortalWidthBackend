module.exports = {
  extends: 'standard',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  rules: {
    'quote-props': ['error', 'consistent'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
    'no-empty-function': 'off',
    'object-curly-spacing': ['error', 'always'],
    'key-spacing': 'error',
    'no-console': 'warn',
    'eol-last': ['error', 'always'],
    'semi-style': ['error', 'last'],
    'no-trailing-spaces': 'error',
    'arrow-parens': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always',
    }],
  },
};
