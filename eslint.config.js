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
	}
);
