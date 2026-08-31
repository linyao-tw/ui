import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const isExternal = (id: string) =>
	id === "react" ||
	id === "react-dom" ||
	id.startsWith("react/") ||
	id.startsWith("react-dom/") ||
	id.startsWith("@base-ui/react") ||
	id.startsWith("@internationalized/date") ||
	id.startsWith("react-aria-components");

const addJavaScriptExtension = (specifier: string) => (/\.(?:[cm]?js|json|css)$/i.test(specifier) ? specifier : `${specifier}.js`);

const normalizeDeclarationSpecifiers = (content: string) =>
	content
		.replace(/(\bfrom\s+["'])(\.\.?\/[^"']+)(["'])/g, (_match, prefix: string, specifier: string, suffix: string) => `${prefix}${addJavaScriptExtension(specifier)}${suffix}`)
		.replace(/(\bimport\s*\(\s*["'])(\.\.?\/[^"']+)(["']\s*\))/g, (_match, prefix: string, specifier: string, suffix: string) => `${prefix}${addJavaScriptExtension(specifier)}${suffix}`);

export default defineConfig({
	plugins: [
		react(),
		dts({
			entryRoot: "src",
			exclude: ["src/**/*.stories.*", "src/**/*.test.*", "src/test/**"],
			insertTypesEntry: true,
			beforeWriteFile: (filePath, content) => ({
				content: normalizeDeclarationSpecifiers(content),
				filePath
			}),
			tsconfigPath: "./tsconfig.build.json"
		})
	],
	build: {
		cssCodeSplit: false,
		lib: {
			entry: "src/index.ts",
			formats: ["es"],
			fileName: "index",
			cssFileName: "styles"
		},
		rolldownOptions: {
			external: isExternal,
			output: {
				assetFileNames: assetInfo => (assetInfo.name?.endsWith(".css") ? "styles.css" : "assets/[name][extname]"),
				entryFileNames: "[name].js",
				preserveModules: true,
				preserveModulesRoot: "src"
			}
		},
		sourcemap: true
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test/setup.ts"],
		css: true,
		coverage: {
			reporter: ["text", "html"]
		}
	}
});
