import directusConfig from '@directus/eslint-config';
import prettierConfig from 'eslint-config-prettier';

export default [
	...directusConfig,
	prettierConfig,
	{
		ignores: ['**/CHANGELOG.md', '**/shims.d.ts'],
	},
];
