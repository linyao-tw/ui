import {
	Button,
	CalendarDate,
	Card,
	CardBody,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	CheckboxItem,
	DatePicker,
	NumberField,
	RadioGroup,
	RadioItem,
	Select,
	Switch,
	TextField,
	TextView,
	Time,
	TimePicker
} from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Inputs/Mixed Form",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function MaintenanceForm() {
	return (
		<Card variant="inset" className="lyds-story-stack">
			<CardHeader>
				<span className="lyds-story-readout">WORK ORDER / NEW</span>
				<CardTitle>Schedule controller maintenance</CardTitle>
				<CardDescription>This composition demonstrates LYDS controls together without embedding submission, validation, or scheduling business logic.</CardDescription>
			</CardHeader>
			<CardBody>
				<form className="lyds-story-form" onSubmit={event => event.preventDefault()}>
					<TextField required requiredIndicator="REQ" label="Work-order title" defaultValue="Inspect thermal regulation loop" />
					<Select<string>
						aria-label="Assigned controller"
						defaultValue="xr-071"
						options={[
							{ value: "xr-071", label: "XR-071 / Thermal relay" },
							{ value: "op-122", label: "OP-122 / Optical scanner" }
						]}
					/>
					<DatePicker label="Service date" defaultValue={new CalendarDate(2026, 9, 8)} />
					<TimePicker label="Start time" defaultValue={new Time(14, 30)} hourCycle={24} />
					<NumberField label="Estimated duration" description="Minutes" defaultValue={45} min={15} step={15} />
					<RadioGroup aria-label="Service priority" defaultValue="normal">
						<RadioItem value="normal" label="Normal priority" />
						<RadioItem value="urgent" label="Urgent intervention" />
					</RadioGroup>
					<TextView className="lyds-story-form__wide" label="Operator notes" defaultValue="Inspect fan bearing and verify the post-service temperature curve." />
					<div className="lyds-story-form__wide lyds-story-stack">
						<CheckboxItem defaultChecked label="Notify active operators before maintenance begins" />
						<div className="lyds-story-row">
							<Switch defaultChecked aria-labelledby="recording-switch-label" />
							<span id="recording-switch-label">Keep telemetry recording active</span>
						</div>
					</div>
				</form>
			</CardBody>
			<CardFooter className="lyds-story-row">
				<Button>Schedule maintenance</Button>
				<Button variant="quiet">Save draft</Button>
			</CardFooter>
		</Card>
	);
}

export const Default: Story = {
	render: () => <MaintenanceForm />
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => <MaintenanceForm />
};
