import directusConfig from '@directus/eslint-config';
import prettierConfig from 'eslint-config-prettier';

export default [
  ...directusConfig,
  prettierConfig,
  {
    files: ['**/*.json?(c|5)'],
    rules: {
      'jsonc/indent': ['error', 2],
    },
  },
  {
    // Align with the default formatting of Even Better TOML (taplo)
    files: ['**/*.toml'],
    rules: {
      'toml/array-bracket-spacing': ['error', 'never'],
      'toml/array-element-newline': ['error', 'consistent'],
    },
  },
  {
    ignores: ['**/CHANGELOG.md', '**/shims.d.ts'],
  },
];
