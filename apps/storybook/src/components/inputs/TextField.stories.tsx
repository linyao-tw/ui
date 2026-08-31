import { CodeField, Input, PasswordField, PhoneField, SearchField, Textarea, TextField, TextView } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "../story-layout.css";

const meta = {
	title: "Components/Inputs/TextField",
	component: TextField,
	args: {
		label: "Module name",
		description: "Visible to operators in the control index.",
		placeholder: "e.g. Thermal relay A"
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
			<TextField size="sm" label="Small field" defaultValue="SYS-01" technical />
			<TextField size="md" label="Medium field" defaultValue="SYS-02" technical />
			<TextField size="lg" label="Large field" defaultValue="SYS-03" technical />
		</div>
	)
};

export const InvalidAndUnavailable: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<TextField label="Serial number" defaultValue="A?19" invalid error="Use uppercase letters and digits only." technical />
			<TextField label="Provisioned endpoint" defaultValue="relay-02.internal" disabled description="Managed by the deployment service." />
			<TextField label="Calibration stamp" defaultValue="2026-08-31 / LAB 04" readOnly description="Read-only verification record." technical />
		</div>
	)
};

function ControlledFieldDemo() {
	const [value, setValue] = useState("Channel alpha");

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TextField label="Controlled channel label" value={value} onValueChange={nextValue => setValue(nextValue)} />
			<p className="lyds-story-readout" aria-live="polite">
				VALUE / {value || "EMPTY"}
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
			<SearchField label="Search telemetry" placeholder="Pressure, voltage, serial…" />
			<PasswordField label="Operator key" defaultValue="signal-room" />
			<CodeField label="Protocol code" defaultValue="XR-81/B" description="Whitespace and casing are preserved." />
			<PhoneField label="Response line" placeholder="+886" description="Formatting and validation belong to the product." />
			<TextView className="lyds-story-form__wide" label="Maintenance note" defaultValue="Replace thermal sleeve during the next service window." />
			<Textarea className="lyds-story-form__wide" aria-label="Unframed technical notes" defaultValue="Standalone textarea control" />
		</div>
	)
};

export const LongText: Story = {
	render: () => (
		<TextField
			label="A field label that remains understandable when an application uses unusually long translated interface copy"
			description="Supporting copy may wrap across multiple lines without crowding the control or detaching from the field it explains."
			defaultValue="A very long operator-entered value remains readable and scrollable inside the control"
		/>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TextField label="Low-light channel" defaultValue="NIGHT-OPS-17" technical />
			<TextField label="Fault code" defaultValue="E-401" invalid error="Authorization handshake rejected." technical />
		</div>
	)
};
