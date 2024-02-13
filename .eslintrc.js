module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  globals: {
    beforeAll: true,
    beforeEach: true,
    describe: true,
    expect: true,
    it: true,
    jest: true,
    localStorage: true,
    chrome: 'readonly',
  },
  env: {
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-unused-vars': 'off',
    camelcase: 0,
    'import/no-unresolved': 0,
    'import/no-duplicates': 'off',
    'import/namespace': 'off',
    'import/export': 'off',
    'import/no-extraneous-dependencies': ['off', { devDependencies: true }],
    'no-console': 2,
    'consistent-return': 0,
    quotes: [2, 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'only-multiline'],
    'import/extensions': [
      'off',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
        json: 'never',
        json5: 'never',
      },
    ],
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
      },
    ],
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-unused-vars': 2,
    'import/prefer-default-export': 'off',
    'no-nested-ternary': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'],
          ['@test', './test'],
        ],
        extensions: ['.ts', '.js', '.tsx', '.json', '.json5'],
      },
    },
  },
};
