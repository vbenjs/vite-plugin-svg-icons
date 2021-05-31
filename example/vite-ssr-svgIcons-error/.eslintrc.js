const orderComponents = require('./config/eslint/orderComponents')
const orderAttributes = require('./config/eslint/orderAttributes')

module.exports = {
  root: true,
  env: {
    'browser': true,
    'es2021': true,
    'node': true,
  },
  extends: [
    'plugin:vue/vue3-strongly-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    'ecmaVersion': 2021,
  },
  rules: {
    'padded-blocks': 'off',
    semi: ['error', 'never'],
    'no-return-assign': 'off',
    quotes: ['error', 'single'],
    'no-underscore-dangle': 'off',
    'max-len': ['error', { code: 250 }],
    'prefer-promise-reject-errors': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-param-reassign': ['error', { props: false }],
    'no-restricted-syntax': ['error', 'ForInStatement'],
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    'vue/order-in-components': ['error', { order: orderComponents }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/attributes-order': ['error', { order: orderAttributes, alphabetical: false }],
    'object-curly-newline': ['error', { ExportDeclaration: { multiline: true, minProperties: 3 } }],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/src/**/*.test.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
}
