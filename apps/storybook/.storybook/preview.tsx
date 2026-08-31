import "@lyds/ui/styles.css";
import "./preview.css";

import type { Preview } from "@storybook/react-vite";

const preview: Preview = {
	globalTypes: {
		theme: {
			description: "LYDS color theme",
			defaultValue: "light",
			toolbar: {
				icon: "mirror",
				items: [
					{ value: "light", title: "Light" },
					{ value: "dark", title: "Dark" }
				],
				dynamicTitle: true
			}
		}
	},
	decorators: [
		(Story, context) => {
			const theme = context.globals.theme === "dark" ? "dark" : "light";
			document.documentElement.dataset.lydsTheme = theme;

			return (
				<div className="lyds-story-canvas" data-lyds-theme={theme}>
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
				order: ["Foundations", "Components", "Date & Time", "Patterns"]
			}
		}
	}
};

export default preview;
