module.exports = {
  env: { browser: true },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '*.config.js',
    '.eslintrc.js',
    '*.prisma'
  ],
  rules: {
    'react/function-component-definition': 'off',
    'react/no-unstable-nested-components': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    'consistent-return': 'off',
    'react/prop-types': 'off',
    'react/jsx-one-expression-per-line': 'off',
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
  ],
  parserOptions: { project: './tsconfig.json' },
};
