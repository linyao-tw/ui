import "@linyao.tw/ui/fonts.css";
import "@linyao.tw/ui/styles.css";
import "./preview.css";

import type { Preview } from "@storybook/react-vite";

/** Injected by vitest.config.ts so the story test run can sweep both themes. Undefined in dev. */
declare const __LYDS_STORY_THEME__: "light" | "dark" | undefined;

const defaultTheme = typeof __LYDS_STORY_THEME__ === "string" ? __LYDS_STORY_THEME__ : "light";

const preview: Preview = {
	globalTypes: {
		theme: {
			description: "Linyao Design System 色彩主題",
			defaultValue: defaultTheme,
			toolbar: {
				icon: "mirror",
				items: [
					{ value: "light", title: "淺色" },
					{ value: "dark", title: "深色" }
				],
				dynamicTitle: true
			}
		}
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme === "dark" ? "dark" : "light";
			const fullscreen = context.parameters.layout === "fullscreen";
			document.documentElement.lang = "zh-TW";
			document.documentElement.dataset.lydsTheme = theme;

			return (
				<div className={`lyds-story-canvas${fullscreen ? " lyds-story-canvas--fullscreen" : ""}`} data-lyds-theme={theme}>
					<Story />
				</div>
			);
		}
	],
	parameters: {
		a11y: {
			test: "error"
		},
		actions: { argTypesRegex: "^on.*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		},
		layout: "padded",
		options: {
			storySort: {
				order: ["首頁", "基礎", "元件", "日期與時間", "使用範例"]
			}
		}
	}
};

export default preview;
