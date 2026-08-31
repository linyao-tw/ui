import { CodeField, DropZone, FileUpload, NumberField, OTPField, PhoneField } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Inputs/Advanced Inputs",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const NumericAndContact: Story = {
	render: () => (
		<div className="lyds-story-form">
			<NumberField label="Monthly budget" description="The consumer controls locale and numeric constraints." defaultValue={42.5} min={0} max={120} step={0.5} />
			<NumberField label="Approved quantity" defaultValue={17} readOnly showSteppers={false} />
			<CodeField label="Verification code" description="Six numeric cells backed by Base UI OTP behavior." defaultValue="073142" />
			<PhoneField
				label="Contact phone"
				defaultValue="2 0000 0000"
				countrySelector={({ disabled, readOnly }) => (
					<button type="button" aria-label="Choose country code" disabled={disabled || readOnly}>
						<span aria-hidden="true">TW</span>
						<span aria-hidden="true">+886</span>
					</button>
				)}
			/>
		</div>
	)
};

export const VerificationCode: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<CodeField label="Sign-in verification code" description="Paste or enter the six-digit code." getSlotLabel={index => `Digit ${index + 1}`} />
			<CodeField label="Recovery code" description="Long codes default to visual groups of four." length={12} defaultValue="073142635987" />
			<CodeField label="Grouped override" description="Consumers can opt into grouping for a shorter code." length={8} groupSize={4} defaultValue="20260831" />
			<OTPField label="Verification code" description="Paste or enter the six-character code." length={6} separatorAfter={[3]} getSlotLabel={index => `Character ${index + 1}`} />
			<OTPField label="Expired code" length={4} invalid error="The code has expired." />
		</div>
	)
};

export const FileSelection: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<FileUpload label="Project archive" description="Accepts the file types configured by the consumer." accept=".zip" />
			<FileUpload label="Signed agreement" disabled triggerLabel="File unavailable" />
		</div>
	)
};

export const DropZoneSurface: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<DropZone
				label="Attachments"
				description="Drop one or more files, or open the system file chooser."
				primaryLabel="Drop files here"
				secondaryLabel="Allowed file types are configured by the application"
				multiple
			/>
		</div>
	)
};
