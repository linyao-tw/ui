import {
	Badge,
	Banner,
	Button,
	CheckboxGroup,
	CheckboxItem,
	DatePicker,
	NumberField,
	SegmentedControl,
	SegmentedControlItem,
	Select,
	Switch,
	TextField,
	TextView,
	TimePicker,
	parseDate,
	parseTime
} from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FormEvent } from "react";
import { useState } from "react";

import "./patterns.css";

const environmentOptions = [
	{ value: "studio", label: "Studio sandbox", description: "Isolated review environment" },
	{ value: "staging", label: "Shared staging", description: "Team integration environment" },
	{ value: "production", label: "Production", description: "Customer-facing environment" }
] as const;

const steps = [
	{ index: "01", title: "Identity", description: "Name and classify the release." },
	{ index: "02", title: "Schedule", description: "Choose the operating window." },
	{ index: "03", title: "Safeguards", description: "Confirm the rollout controls." }
] as const;

const meta = {
	title: "Patterns/Mixed Form",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function DeploymentForm() {
	const [projectName, setProjectName] = useState("Inventory service refresh");
	const [environment, setEnvironment] = useState<(typeof environmentOptions)[number]["value"]>("staging");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
	};

	return (
		<main className="pattern-page">
			<section className="pattern-shell" aria-labelledby="release-title">
				<aside className="pattern-sidebar">
					<div className="pattern-brand">
						<span className="pattern-overline">LYDS example pattern</span>
						<h1>Configure deployment window</h1>
						<p>A realistic composition of controlled and uncontrolled LYDS fields. Products keep ownership of submission, validation policy, and backend behavior.</p>
					</div>

					<ol className="pattern-steps" aria-label="Release setup progress">
						{steps.map((step, index) => (
							<li className="pattern-step" data-active={index === 1} key={step.index}>
								<span className="pattern-step__index">{step.index}</span>
								<div>
									<strong>{step.title}</strong>
									<p>{step.description}</p>
								</div>
							</li>
						))}
					</ol>

					<div>
						<div
							className="pattern-meter"
							role="progressbar"
							aria-label="Release setup progress"
							aria-valuemin={0}
							aria-valuemax={3}
							aria-valuenow={2}
							aria-valuetext="Two of three sections configured"
						>
							<span className="pattern-meter__label">Step 2 of 3</span>
							<div className="pattern-meter__track" aria-hidden="true">
								<div className="pattern-meter__fill" />
							</div>
						</div>
						<p className="pattern-sidebar__footer">This demonstration does not make network requests.</p>
					</div>
				</aside>

				<form className="pattern-form" onSubmit={handleSubmit}>
					<header className="pattern-form__header">
						<div className="pattern-form__header-copy">
							<span className="pattern-overline">Schedule</span>
							<h2 id="release-title">Release parameters</h2>
							<p className="pattern-form__intro">Define a clear window and rollout shape. Fields keep their own accessible behavior while this form owns the scenario.</p>
						</div>
						<div className="pattern-form__stamp">
							<Badge variant="accent">Draft 04</Badge>
						</div>
					</header>

					{submitted ? (
						<Banner status="success" live="polite">
							Configuration captured for review. No deployment has been started.
						</Banner>
					) : null}

					<div className="pattern-form__grid">
						<TextField
							className="pattern-form__span"
							description="A descriptive label visible to collaborators."
							label="Release name"
							name="releaseName"
							onValueChange={setProjectName}
							required
							value={projectName}
						/>

						<div className="pattern-field">
							<span className="pattern-field-label" id="environment-label">
								Target environment
							</span>
							<Select
								aria-labelledby="environment-label"
								className="pattern-select"
								name="environment"
								onValueChange={value => {
									if (value !== null) setEnvironment(value);
								}}
								options={environmentOptions}
								value={environment}
							/>
						</div>

						<TextField description="Optional external reference. Formatting remains consumer-defined." label="Change reference" name="changeReference" placeholder="REL-2048" />

						<DatePicker
							defaultValue={parseDate("2026-09-04")}
							description="Calendar behavior follows the supplied locale."
							firstDayOfWeek="mon"
							label="Deployment date"
							locale="en-GB"
							name="deploymentDate"
						/>

						<TimePicker
							defaultValue={parseTime("21:30")}
							description="Segmented time input; no finite time list is imposed."
							granularity="minute"
							hourCycle={24}
							label="Start time"
							locale="en-GB"
							name="startTime"
						/>

						<NumberField
							defaultValue={25}
							description="Rollout pacing belongs to the consuming product."
							format={{ style: "unit", unit: "percent" }}
							label="Initial traffic"
							max={100}
							min={0}
							name="traffic"
							step={5}
						/>

						<div className="pattern-field">
							<span className="pattern-field-label">Rollout mode</span>
							<SegmentedControl defaultValue="progressive" name="rolloutMode" aria-label="Rollout mode">
								<SegmentedControlItem value="progressive">Progressive</SegmentedControlItem>
								<SegmentedControlItem value="direct">Direct</SegmentedControlItem>
							</SegmentedControl>
						</div>

						<TextView
							className="pattern-form__span"
							defaultValue="Monitor error rate and checkout latency for fifteen minutes before increasing traffic."
							description="Rollout guidance only; the component does not interpret this content."
							label="Review note"
							name="reviewNote"
							rows={4}
						/>

						<div className="pattern-choice-panel pattern-form__span">
							<div className="pattern-switch-row">
								<Switch defaultChecked aria-labelledby="approval-label" name="approvalGate" />
								<div className="pattern-switch-copy" id="approval-label">
									<strong>Require approval gate</strong>
									<span>Pause before increasing traffic beyond the initial percentage.</span>
								</div>
							</div>
							<CheckboxGroup aria-label="Release notifications" defaultValue={["incident", "complete"]}>
								<CheckboxItem name="notifications" value="incident" label="Notify on incident" description="Send a product-owned notification when a monitored threshold is crossed." />
								<CheckboxItem name="notifications" value="complete" label="Notify on completion" description="Send a final status after the rollout reaches its configured target." />
							</CheckboxGroup>
						</div>
					</div>

					<dl className="pattern-summary" aria-label="Release summary">
						<div>
							<dt>Environment</dt>
							<dd>{environmentOptions.find(option => option.value === environment)?.label}</dd>
						</div>
						<div>
							<dt>Window</dt>
							<dd>2026-09-04 / 21:30</dd>
						</div>
						<div>
							<dt>Initial load</dt>
							<dd>25%</dd>
						</div>
					</dl>

					<footer className="pattern-form__footer">
						<Button type="button" variant="quiet" onClick={() => setSubmitted(false)}>
							Reset review state
						</Button>
						<Button type="submit">Save configuration</Button>
					</footer>
				</form>
			</section>
		</main>
	);
}

export const ReleaseConfiguration: Story = {
	render: () => <DeploymentForm />
};
