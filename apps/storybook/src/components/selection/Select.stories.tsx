import { Autocomplete, Combobox, Select } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../story-layout.css";

const sites = [
	{ value: "north", label: "North office", description: "Taipei · Open" },
	{ value: "harbor", label: "Harbor office", description: "Kaohsiung · Limited hours" },
	{ value: "archive", label: "Archived workspace", description: "Read only", disabled: true },
	{ value: "field", label: "Regional office with an intentionally long descriptive label", description: "Remote team" }
] as const;

const meta = {
	title: "Components/Selection/Select",
	component: Select<string>,
	args: {
		"aria-label": "Controller site",
		className: "lyds-story-control",
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
			<Select<string> aria-label="Active office" className="lyds-story-control" options={sites} value={value} onValueChange={next => setValue(next)} />
			<p className="lyds-story-readout" aria-live="polite">
				Current selection: {value ?? "None"}
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
				<p className="lyds-story-panel__heading">Combobox with a selected value</p>
				<Combobox<string> aria-label="Find office" className="lyds-story-control" options={sites} placeholder="Type an office name" />
			</div>
			<div className="lyds-story-panel">
				<p className="lyds-story-panel__heading">Autocomplete with text suggestions</p>
				<Autocomplete<string> aria-label="Office name" className="lyds-story-control" options={sites} placeholder="Complete an office name" />
			</div>
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	args: { defaultValue: "harbor" }
};
