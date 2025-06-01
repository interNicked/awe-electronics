/* eslint-disable n/no-extraneous-import */
import {defineConfig} from 'eslint/config';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    extends: compat.extends('./node_modules/gts/'),
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      'no-case-declarations': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'n/no-unsupported-features/es-builtins': 'off',
    },
  },
]);
