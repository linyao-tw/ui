import type { StorybookConfig } from "@storybook/react-vite";
import { fileURLToPath } from "node:url";

const config: StorybookConfig = {
	stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
	addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-vitest"],
	framework: {
		name: "@storybook/react-vite",
		options: {}
	},
	docs: {
		defaultName: "文件"
	},
	viteFinal: config => ({
		...config,
		resolve: {
			...config.resolve,
			alias: { ...config.resolve?.alias, "@": fileURLToPath(new URL("../src", import.meta.url)) }
		}
	})
};

export default config;
