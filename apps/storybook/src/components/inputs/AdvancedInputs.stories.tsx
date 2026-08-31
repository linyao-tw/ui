import { CodeField, DropZone, FileUpload, NumberField, OTPField, PhoneField } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Inputs/Advanced Inputs",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const NumericAndTechnical: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<NumberField label="Target pressure" description="Consumer controls locale and numeric constraints." defaultValue={42.5} min={0} max={120} step={0.5} />
			<NumberField label="Locked channel" defaultValue={17} readOnly showSteppers={false} />
			<CodeField label="Unit identifier" defaultValue="AUX-073-C" />
			<PhoneField label="Escalation line" defaultValue="+886 2 0000 0000" />
		</div>
	)
};

export const VerificationCode: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<OTPField label="Verification sequence" description="Paste or enter the six-character console code." length={6} separatorAfter={[3]} getSlotLabel={index => `Character ${index + 1}`} />
			<OTPField label="Rejected sequence" length={4} invalid error="The sequence has expired." />
		</div>
	)
};

export const FileSelection: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<FileUpload label="Firmware image" description="Accepts the file types configured by the consumer." accept=".bin,.zip" />
			<FileUpload label="Archived manifest" disabled triggerLabel="Archive unavailable" />
		</div>
	)
};

export const DropZoneSurface: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<DropZone
				label="Diagnostic bundles"
				description="Drop one or more log archives, or open the system file chooser."
				primaryLabel="Drop diagnostic archives"
				secondaryLabel="ZIP or plain text, as permitted by the application"
				multiple
			/>
		</div>
	)
};
