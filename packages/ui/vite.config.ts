import react from "@vitejs/plugin-react";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const sourceRoot = fileURLToPath(new URL("./src", import.meta.url));
const outputRoot = fileURLToPath(new URL("./dist", import.meta.url));

const isExternal = (id: string) =>
	id === "react" ||
	id === "react-dom" ||
	id.startsWith("react/") ||
	id.startsWith("react-dom/") ||
	id.startsWith("@base-ui/react") ||
	id.startsWith("@internationalized/date") ||
	id.startsWith("@phosphor-icons/react") ||
	id.startsWith("react-aria-components");

/**
 * Declarations are emitted without extensions, and a specifier that points at a directory needs
 * `/index.js` rather than `.js`. Resolving against the mirrored source tree keeps barrel modules
 * from emitting a path that resolves to nothing, which `pnpm pack:check` reports as an internal
 * resolution error rather than a build failure.
 */
const addJavaScriptExtension = (declarationPath: string, specifier: string) => {
	if (/\.(?:[cm]?js|json|css)$/i.test(specifier)) return specifier;

	const sourceDirectory = dirname(join(sourceRoot, relative(outputRoot, declarationPath)));
	const target = resolve(sourceDirectory, specifier);
	return existsSync(target) && statSync(target).isDirectory() ? `${specifier}/index.js` : `${specifier}.js`;
};

const normalizeDeclarationSpecifiers = (declarationPath: string, content: string) =>
	content
		.replace(/(\bfrom\s+["'])(\.\.?\/[^"']+)(["'])/g, (_match, prefix: string, specifier: string, suffix: string) => `${prefix}${addJavaScriptExtension(declarationPath, specifier)}${suffix}`)
		.replace(
			/(\bimport\s*\(\s*["'])(\.\.?\/[^"']+)(["']\s*\))/g,
			(_match, prefix: string, specifier: string, suffix: string) => `${prefix}${addJavaScriptExtension(declarationPath, specifier)}${suffix}`
		);

export default defineConfig({
	plugins: [
		react(),
		{
			// styles.css is the single bundled stylesheet, so the optional font entry is copied through
			// verbatim rather than being pulled into it.
			name: "lyds-emit-fonts-entry",
			generateBundle() {
				this.emitFile({ type: "asset", fileName: "fonts.css", source: readFileSync(new URL("./src/styles/fonts.css", import.meta.url), "utf8") });
			}
		},
		dts({
			entryRoot: "src",
			exclude: ["src/**/*.stories.*", "src/**/*.test.*", "src/test/**"],
			insertTypesEntry: true,
			beforeWriteFile: (filePath, content) => ({
				content: normalizeDeclarationSpecifiers(filePath, content),
				filePath
			}),
			tsconfigPath: "./tsconfig.build.json"
		})
	],
	resolve: {
		alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
	},
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
