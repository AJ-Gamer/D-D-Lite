import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default {
  ...tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ),
  ignorePatterns: [
    'node_modules/',
    'dist/',
    '*.config.js',
    '*.config.mjs',
  ],
  extends: [
    'airbnb-base',
    'plugin:react/recommended'
  ]
};
