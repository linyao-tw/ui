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

function WorkshopForm() {
	return (
		<Card variant="material" className="lyds-story-stack">
			<CardHeader>
				<span className="lyds-story-note">New workshop</span>
				<CardTitle>Schedule a team workshop</CardTitle>
				<CardDescription>This composition demonstrates LYDS controls together without embedding submission, validation, or scheduling business logic.</CardDescription>
			</CardHeader>
			<CardBody>
				<form className="lyds-story-form" onSubmit={event => event.preventDefault()}>
					<TextField required requiredIndicator="Required" label="Workshop title" defaultValue="Quarterly planning session" />
					<Select<string>
						aria-label="Facilitator"
						defaultValue="design-team"
						options={[
							{ value: "design-team", label: "Design team" },
							{ value: "product-team", label: "Product team" }
						]}
					/>
					<DatePicker label="Workshop date" defaultValue={new CalendarDate(2026, 9, 8)} />
					<TimePicker label="Start time" defaultValue={new Time(14, 30)} hourCycle={24} />
					<NumberField label="Available seats" description="Participants" defaultValue={12} min={1} step={1} />
					<RadioGroup aria-label="Attendance" defaultValue="in-person">
						<RadioItem value="in-person" label="In person" />
						<RadioItem value="remote" label="Remote" />
					</RadioGroup>
					<TextView className="lyds-story-form__wide" label="Agenda" defaultValue="Review the last quarter, agree on priorities, and assign owners." />
					<div className="lyds-story-form__wide lyds-story-stack">
						<CheckboxItem defaultChecked label="Email participants when the schedule changes" />
						<div className="lyds-story-row">
							<Switch defaultChecked aria-labelledby="recording-switch-label" />
							<span id="recording-switch-label">Record the session</span>
						</div>
					</div>
				</form>
			</CardBody>
			<CardFooter className="lyds-story-row">
				<Button>Schedule workshop</Button>
				<Button variant="quiet">Save draft</Button>
			</CardFooter>
		</Card>
	);
}

export const Default: Story = {
	render: () => <WorkshopForm />
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => <WorkshopForm />
};
