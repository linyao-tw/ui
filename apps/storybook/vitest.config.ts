import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Stories run once per theme. The accessibility addon is configured to fail the run, and contrast
 * is the check most likely to differ between the two palettes, so a light-only pass would leave
 * every dark-theme regression to manual review.
 */
const storybookProject = (theme: "light" | "dark") => ({
	extends: true as const,
	plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
	define: { __LYDS_STORY_THEME__: JSON.stringify(theme) },
	resolve: {
		alias: { "@": path.join(dirname, "src") }
	},
	test: {
		name: `storybook-${theme}`,
		browser: {
			enabled: true,
			headless: true,
			provider: playwright({}),
			instances: [{ browser: "chromium" }]
		}
	}
});

export default defineConfig({
	resolve: {
		alias: { "@": path.join(dirname, "src") }
	},
	test: {
		projects: [storybookProject("light"), storybookProject("dark")]
	}
});
