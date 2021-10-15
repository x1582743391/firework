module.exports = {
  'env': {
    'browser': true,
    'es6': true,
    'node': true
  },
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 2020
  },
  'extends': [
    'eslint:recommended',
  ],
  'rules': {

    'quotes': [
      'error',
      'single'
    ],
    'indent': [
      'warn',
      2,
      {
        'SwitchCase': 1
      }
    ],
    'no-unused-vars': 'warn',
    'no-debugger': 'warn',
    'no-console': 'off',
    'no-useless-escape': 'warn',
    'no-await-in-loop': 'error',
    'no-template-curly-in-string': 'error',
    'no-whitespace-before-property': 'error',
    'arrow-spacing': 'error',
    'space-before-blocks': 'warn',
    'space-before-function-paren': [
      'warn',
      'never'
    ],
    'space-in-parens': 'warn',
    'space-infix-ops': 'error',
    'space-unary-ops': 'error',
    'eqeqeq': 'error',
    'semi': [
      'error',
      'always'
    ],
    'semi-spacing': [
      'error',
      {
        'before': false,
        'after': true
      }
    ],
    'comma-spacing': [
      'error',
      {
        'before': false,
        'after': true
      }
    ],
    'object-curly-spacing': [
      'warn',
      'always',
      {
        'objectsInObjects': true
      }
    ],
    'key-spacing': 'error',
    'keyword-spacing': 'error',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-extraneous-require': 'off',
    'node/no-unpublished-require': 'off',
  }
};