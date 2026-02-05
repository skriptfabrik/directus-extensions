import directusConfig from '@directus/eslint-config';

export default [
	...directusConfig,
	{
		ignores: ['**/CHANGELOG.md', '**/shims.d.ts'],
	},
];
