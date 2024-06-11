module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'universe/node'
	],
	root: true,
	env: {
		node: true,
		jest: true,
	},
	ignorePatterns: ['.eslintrc.js', 'dist/'],
	rules: {
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'error',
		"@typescript-eslint/explicit-function-return-type": "error",
		"@typescript-eslint/prefer-readonly": "error",
		'no-else-return': ['error', { allowElseIf: false }],
		'no-console': 'error',
		'@typescript-eslint/typedef': [
			'error',
			{
				variableDeclaration: true,
				memberVariableDeclaration: true,
			},
		],
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'class',
				format: ['PascalCase'],
			},
		],
		"@typescript-eslint/consistent-type-imports": "error",
		"@typescript-eslint/consistent-type-exports": "error",
		'@typescript-eslint/explicit-member-accessibility': [
			'error',
			{
				accessibility: 'explicit',
				overrides: {
					accessors: 'explicit',
					constructors: 'no-public',
					methods: 'explicit',
					properties: 'explicit',
					parameterProperties: 'explicit',
				},
			},
		],
		"@typescript-eslint/no-unnecessary-condition": "error",
	},
};
