import { CodeField, DropZone, FileUpload, Input, NumberField, OTPField, PasswordField, PhoneField, SearchField, Textarea, TextView } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import "../story-layout.css";

const meta = {
	title: "Components/Inputs/State Matrix",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function StateSection({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="lyds-story-panel" aria-labelledby={`input-state-${title.toLowerCase().replaceAll(" ", "-")}`}>
			<h3 className="lyds-story-panel__heading" id={`input-state-${title.toLowerCase().replaceAll(" ", "-")}`}>
				{title}
			</h3>
			<div className="lyds-story-grid">{children}</div>
		</section>
	);
}

function CountrySelector({ disabled = false }: { disabled?: boolean }) {
	return (
		<button type="button" aria-label="Choose country code" disabled={disabled}>
			<span aria-hidden="true">TW +886</span>
		</button>
	);
}

export const NativeControls: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="Input sizes">
				<Input size="sm" aria-label="Small input" defaultValue="Small input" />
				<Input size="md" aria-label="Medium input" defaultValue="Medium input" />
				<Input size="lg" aria-label="Large input" defaultValue="Large input" />
			</StateSection>
			<StateSection title="Input availability">
				<Input aria-label="Required input" required placeholder="Required input" />
				<Input aria-label="Read-only input" readOnly defaultValue="Managed value" />
				<Input aria-label="Disabled input" disabled defaultValue="Unavailable value" />
				<div>
					<Input aria-label="Invalid input" aria-describedby="invalid-native-input-message" invalid defaultValue="A?19" />
					<p className="lyds-story-readout" id="invalid-native-input-message">
						Use uppercase letters and digits only.
					</p>
				</div>
			</StateSection>
			<StateSection title="Textarea states">
				<Textarea size="sm" aria-label="Small notes" defaultValue="Compact notes" />
				<Textarea size="md" aria-label="Medium notes" defaultValue="Standard notes" />
				<Textarea size="lg" aria-label="Large notes" defaultValue="Expanded notes" />
				<Textarea aria-label="Required notes" required placeholder="Required notes" />
				<Textarea aria-label="Read-only notes" readOnly defaultValue="This content is managed by the workspace." />
				<Textarea aria-label="Disabled notes" disabled defaultValue="Unavailable notes" />
				<div>
					<Textarea aria-label="Invalid notes" aria-describedby="invalid-native-textarea-message" invalid defaultValue="Incomplete handoff" />
					<p className="lyds-story-readout" id="invalid-native-textarea-message">
						Add an owner and next step.
					</p>
				</div>
			</StateSection>
		</div>
	)
};

export const TextViews: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="Text view sizes">
				<TextView size="sm" label="Small summary" defaultValue="A concise summary." />
				<TextView size="md" label="Medium summary" defaultValue="A standard summary for the project." />
				<TextView size="lg" label="Large summary" defaultValue="A larger writing surface for a longer project summary." />
			</StateSection>
			<StateSection title="Text view validation">
				<TextView required requiredIndicator="Required" label="Required handoff" description="Summarize the work for the next owner." />
				<TextView readOnly label="Read-only audit note" defaultValue="Approved by the operations team." />
				<TextView disabled label="Disabled archive note" defaultValue="The archive is locked." />
				<TextView invalid label="Rejected summary" defaultValue="Done" error="Explain what was completed and what remains." />
			</StateSection>
		</div>
	)
};

export const SearchAndPassword: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="Search states">
				<SearchField size="sm" label="Small search" placeholder="Search records" />
				<SearchField size="md" label="Medium search" defaultValue="Quarterly plan" />
				<SearchField size="lg" label="Large search" placeholder="Search projects, owners, or tags" />
				<SearchField required requiredIndicator="Required" label="Required lookup" />
				<SearchField readOnly label="Read-only query" defaultValue="Approved records" />
				<SearchField disabled label="Disabled search" defaultValue="Archived records" />
				<SearchField invalid label="Invalid search query" defaultValue="?" error="Enter at least two letters." />
			</StateSection>
			<StateSection title="Password states">
				<PasswordField size="sm" label="Small password" defaultValue="correct-horse" />
				<PasswordField size="md" label="Visible password" defaultValue="battery-staple" defaultVisible />
				<PasswordField size="lg" label="Large password" placeholder="Enter a password" />
				<PasswordField required requiredIndicator="Required" label="Required password" />
				<PasswordField readOnly label="Read-only password" defaultValue="managed-secret" />
				<PasswordField disabled label="Disabled password" defaultValue="unavailable" />
				<PasswordField invalid label="Invalid password" defaultValue="short" error="Use at least twelve characters." />
			</StateSection>
		</div>
	)
};

export const PhoneAndNumber: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="Phone states">
				<PhoneField size="sm" label="Small phone" placeholder="+886" />
				<PhoneField size="md" label="Phone with country" defaultValue="912 345 678" countrySelector={<CountrySelector />} />
				<PhoneField size="lg" label="Large phone" placeholder="International number" />
				<PhoneField required requiredIndicator="Required" label="Required phone" />
				<PhoneField readOnly label="Read-only phone" defaultValue="+886 2 0000 0000" countrySelector={<CountrySelector disabled />} />
				<PhoneField disabled label="Disabled phone" defaultValue="+886 912 345 678" countrySelector={<CountrySelector disabled />} />
				<PhoneField invalid label="Invalid phone" defaultValue="123" error="Enter a complete international phone number." />
			</StateSection>
			<StateSection title="Number states">
				<NumberField size="sm" label="Small quantity" defaultValue={4} min={0} max={10} />
				<NumberField size="md" label="Medium quantity" defaultValue={12.5} min={0} max={20} step={0.5} />
				<NumberField size="lg" label="Large quantity" defaultValue={80} min={0} max={100} />
				<NumberField required requiredIndicator="Required" label="Required quantity" min={1} />
				<NumberField readOnly label="Read-only quantity" defaultValue={17} showSteppers={false} />
				<NumberField disabled label="Disabled quantity" defaultValue={24} />
				<NumberField invalid label="Invalid quantity" defaultValue={120} min={0} max={100} error="Enter a value from 0 to 100." />
			</StateSection>
		</div>
	)
};

export const VerificationCodes: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="OTP states">
				<OTPField size="sm" label="Small verification code" length={4} defaultValue="1204" />
				<OTPField size="md" label="Medium verification code" length={6} separatorAfter={[3]} defaultValue="817204" />
				<OTPField size="lg" label="Large verification code" length={4} />
				<OTPField required requiredIndicator="Required" label="Required verification code" length={6} />
				<OTPField readOnly label="Read-only verification code" length={6} defaultValue="402681" />
				<OTPField disabled label="Disabled verification code" length={6} defaultValue="745103" />
				<OTPField invalid label="Expired verification code" length={4} error="The verification code has expired." />
			</StateSection>
			<StateSection title="Code states">
				<CodeField size="sm" label="Small device code" defaultValue="120496" />
				<CodeField size="md" label="Grouped recovery code" length={12} defaultValue="073142635987" />
				<CodeField size="lg" label="Large device code" placeholder="000000" />
				<CodeField required requiredIndicator="Required" label="Required device code" />
				<CodeField readOnly label="Read-only device code" defaultValue="827401" />
				<CodeField disabled label="Disabled device code" defaultValue="514209" />
				<CodeField invalid label="Invalid device code" defaultValue="000000" error="This device code is not recognized." />
			</StateSection>
		</div>
	)
};

export const FileControls: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="File upload states">
				<FileUpload size="sm" label="Small file upload" triggerLabel="Choose report" />
				<FileUpload size="md" label="Medium file upload" description="PDF or ZIP files are accepted." accept=".pdf,.zip" />
				<FileUpload size="lg" label="Large file upload" triggerLabel="Choose archive" />
				<FileUpload required requiredIndicator="Required" label="Required document" />
				<FileUpload readOnly label="Read-only attachment" triggerLabel="Attachment locked" />
				<FileUpload disabled label="Disabled attachment" triggerLabel="Upload unavailable" />
				<FileUpload invalid label="Rejected attachment" error="Choose a file smaller than 10 MB." />
			</StateSection>
			<StateSection title="Drop zone states">
				<DropZone size="sm" label="Small drop zone" primaryLabel="Drop report here" />
				<DropZone size="md" label="Medium drop zone" description="Drop multiple files or open the chooser." multiple />
				<DropZone size="lg" label="Large drop zone" primaryLabel="Drop project archive here" />
				<DropZone required requiredIndicator="Required" label="Required attachments" />
				<DropZone readOnly label="Read-only attachments" primaryLabel="Attachments locked" />
				<DropZone disabled label="Disabled attachments" primaryLabel="Drop zone unavailable" />
				<DropZone invalid label="Rejected attachments" error="Remove unsupported file types." />
			</StateSection>
		</div>
	)
};

export const LongAndNarrow: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-control">
			<Input aria-label="Long standalone value" defaultValue="A long standalone input value remains horizontally editable without expanding the surrounding layout" />
			<Textarea aria-label="Long standalone notes" defaultValue="Long multiline content wraps within a narrow writing surface while preserving a usable resize target and keyboard editing behavior." />
			<TextView
				label="A translated notes label that is intentionally longer than the available narrow layout"
				description="Supporting information wraps beneath the control."
				defaultValue="Long multiline content should remain readable without widening the page."
			/>
			<SearchField label="A long search label for translated product terminology" defaultValue="A long query remains horizontally editable" />
			<PasswordField label="A long password label for a narrow account settings form" defaultValue="correct-horse-battery-staple" />
			<PhoneField label="A long contact telephone label for an international support workflow" defaultValue="+886 912 345 678" />
			<NumberField label="A long numeric field label for translated allocation terminology" description="The numeric value and steppers stay operable." defaultValue={42.5} step={0.5} />
			<CodeField label="A narrow twelve-character recovery code" length={12} defaultValue="073142635987" />
			<FileUpload label="A long upload label for a required translated supporting document" description="The visible action remains available without horizontal overflow." />
			<DropZone
				label="A long attachments label for translated workflow instructions"
				primaryLabel="Drop supporting documents here"
				secondaryLabel="or choose one or more files from the device"
				multiple
			/>
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="Dark text controls">
				<Input aria-label="Dark standalone input" defaultValue="Standalone input" />
				<Textarea aria-label="Dark standalone notes" defaultValue="Standalone multiline notes" />
				<TextView label="Dark text view" defaultValue="Multiline field content" />
				<SearchField label="Dark search" defaultValue="Quarterly plan" />
				<PasswordField label="Dark password" defaultValue="battery-staple" />
				<PhoneField invalid label="Dark invalid phone" defaultValue="123" error="Enter a complete phone number." />
			</StateSection>
			<StateSection title="Dark structured controls">
				<NumberField label="Dark quantity" defaultValue={42.5} step={0.5} />
				<OTPField label="Dark verification code" length={6} defaultValue="817204" />
				<CodeField invalid label="Dark invalid device code" defaultValue="000000" error="This code is not recognized." />
				<FileUpload disabled label="Dark disabled file upload" triggerLabel="Upload unavailable" />
				<DropZone label="Dark drop zone" primaryLabel="Drop files here" multiple />
			</StateSection>
		</div>
	)
};
