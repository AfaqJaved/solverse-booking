import { config } from '@solverse/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['.prettierrc.mjs', 'eslint.config.mjs'],
  },
];
