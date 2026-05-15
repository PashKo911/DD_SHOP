import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
	js.configs.recommended,
	...vue.configs['flat/recommended'],
	prettier,

	{
		files: ['**/*.{js,ts,vue}'],

		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
			},
		},

		plugins: {
			import: importPlugin,
		},

		settings: {
			'import/resolver': {
				alias: {
					map: [['@', './frontend/src']],
					extensions: ['.js', '.ts', '.vue'],
				},
			},
		},

		rules: {
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],

			'import/order': [
				'warn',
				{
					groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],

					pathGroupsExcludedImportTypes: ['builtin'],

					'newlines-between': 'always',

					alphabetize: {
						order: 'asc',
						caseInsensitive: true,
					},
				},
			],
		},
	},
]
