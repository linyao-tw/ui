import eslint from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: ["**/dist/**", "**/storybook-static/**", "**/coverage/**"]
	},
	eslint.configs.recommended,
	{
		files: ["**/*.{ts,tsx}"],
		extends: [...tseslint.configs.recommendedTypeChecked],
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: {
				project: ["./tsconfig.eslint.json"],
				tsconfigRootDir: import.meta.dirname
			}
		},
		plugins: {
			"jsx-a11y": jsxA11y,
			"react-hooks": reactHooks
		},
		rules: {
			...jsxA11y.flatConfigs.recommended.rules,
			...reactHooks.configs.flat.recommended.rules,
			"@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
			"@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: { attributes: false } }]
		}
	},
	{
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: {
			globals: globals.node
		}
	},
	{
		files: ["packages/ui/src/**/*.tsx", "apps/storybook/src/**/*.tsx"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							regex: "^\\.\\./",
							message: "Import across directories with the @/ alias; keep ./ for siblings in the same folder."
						}
					],
					paths: [
						{
							name: "phosphor-react",
							message: "Use @phosphor-icons/react; the legacy package no longer receives upstream icons."
						},
						{
							name: "@phosphor-icons/react",
							message: "Import the individual CSR icon subpath to avoid eagerly processing the full icon barrel."
						}
					]
				}
			],
			"no-restricted-syntax": [
				"error",
				{
					selector: "JSXOpeningElement[name.name='svg']",
					message: "Use an @phosphor-icons/react icon instead of hand-authored SVG markup."
				}
			]
		}
	}
);
