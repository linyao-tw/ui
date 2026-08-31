import { Autocomplete, Combobox, Select } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../story-layout.css";

const sites = [
	{ value: "north", label: "Northern relay", description: "Rack A · Online" },
	{ value: "harbor", label: "Harbor sensor array", description: "Rack C · Maintenance" },
	{ value: "archive", label: "Archive controller", description: "Legacy connection", disabled: true },
	{ value: "field", label: "Field station with an intentionally long descriptive label", description: "Remote uplink · 420 ms" }
] as const;

const meta = {
	title: "Components/Selection/Select",
	component: Select<string>,
	args: {
		"aria-label": "Controller site",
		options: sites,
		placeholder: "Choose a site"
	}
} satisfies Meta<typeof Select<string>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
	args: { disabled: true, defaultValue: "north" }
};

export const Invalid: Story = {
	args: { invalid: true, placeholder: "A site is required" }
};

function ControlledSelectDemo() {
	const [value, setValue] = useState<string | null>("north");

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Select<string> aria-label="Active relay" options={sites} value={value} onValueChange={next => setValue(next)} />
			<p className="lyds-story-readout" aria-live="polite">
				ACTIVE / {value ?? "NONE"}
			</p>
		</div>
	);
}

export const ControlledValue: Story = {
	render: () => <ControlledSelectDemo />
};

export const SearchableSelection: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">Combobox / selected value</p>
				<Combobox<string> aria-label="Find controller" options={sites} placeholder="Type a controller name" />
			</div>
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">Autocomplete / text suggestion</p>
				<Autocomplete<string> aria-label="Command argument" options={sites} placeholder="Complete a station name" />
			</div>
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	args: { defaultValue: "harbor" }
};
