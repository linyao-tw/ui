import { CodeField, Input, PasswordField, PhoneField, SearchField, Textarea, TextField, TextView } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../story-layout.css";

const meta = {
	title: "Components/Inputs/TextField",
	component: TextField,
	args: {
		label: "Project name",
		description: "Visible to everyone in this workspace.",
		placeholder: "e.g. Website refresh"
	},
	argTypes: {
		size: { control: "select", options: ["sm", "md", "lg"] }
	}
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const StandaloneInput: Story = {
	render: () => <Input aria-label="Quick filter" placeholder="Filter records" />
};

export const Sizes: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TextField size="sm" label="Small field" defaultValue="Example value" />
			<TextField size="md" label="Medium field" defaultValue="Example value" />
			<TextField size="lg" label="Large field" defaultValue="Example value" />
		</div>
	)
};

export const InvalidAndUnavailable: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<TextField label="Account code" defaultValue="A?19" invalid error="Use uppercase letters and digits only." />
			<TextField label="Managed email" defaultValue="member@example.com" disabled description="Managed by your organization." />
			<TextField label="Last updated" defaultValue="31 August 2026" readOnly description="Read-only audit information." />
		</div>
	)
};

function ControlledFieldDemo() {
	const [value, setValue] = useState("Project Alpha");

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TextField label="Controlled name" value={value} onValueChange={nextValue => setValue(nextValue)} />
			<p className="lyds-story-readout" aria-live="polite">
				Current value: {value || "Empty"}
			</p>
		</div>
	);
}

export const ControlledValue: Story = {
	render: () => <ControlledFieldDemo />
};

export const FieldFamily: Story = {
	render: () => (
		<div className="lyds-story-form">
			<SearchField label="Search projects" placeholder="Name, owner, or keyword…" />
			<PasswordField label="Password" defaultValue="correct-horse" />
			<CodeField label="Verification code" defaultValue="817204" description="Paste or enter the six-digit code." />
			<PhoneField label="Contact phone" placeholder="+886" description="Formatting and validation belong to the product." />
			<TextView className="lyds-story-form__wide" label="Notes" defaultValue="Share the revised outline before the next review." />
			<Textarea className="lyds-story-form__wide" aria-label="Unframed notes" defaultValue="Standalone textarea control" />
		</div>
	)
};

export const LongText: Story = {
	render: () => (
		<TextField
			label="A field label that remains understandable when an application uses unusually long translated interface copy"
			description="Supporting copy may wrap across multiple lines without crowding the control or detaching from the field it explains."
			defaultValue="A very long user-entered value remains readable and scrollable inside the control"
		/>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TextField label="Display name" defaultValue="Evening support team" />
			<TextField label="Reference code" defaultValue="E-401" invalid error="This reference code is not recognized." />
		</div>
	)
};
