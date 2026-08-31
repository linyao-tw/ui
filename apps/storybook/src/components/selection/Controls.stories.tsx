import { CheckboxGroup, CheckboxItem, Switch as LydsSwitch, RadioGroup, RadioItem, SegmentedControl, SegmentedControlItem, Slider, Toggle, ToggleGroup } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Selection/Controls",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkbox: Story = {
	render: () => (
		<CheckboxGroup aria-label="Diagnostic channels" defaultValue={["thermal", "optical"]}>
			<CheckboxItem value="thermal" label="Thermal channel" description="Include temperature and fan telemetry." />
			<CheckboxItem value="optical" label="Optical channel" description="Include scanner and alignment data." />
			<CheckboxItem value="legacy" label="Legacy bus" description="Unavailable on this controller." disabled />
		</CheckboxGroup>
	)
};

export const CheckboxStates: Story = {
	render: () => (
		<div className="lyds-story-row">
			<CheckboxItem defaultChecked label="Checked" />
			<CheckboxItem indeterminate label="Indeterminate" />
			<CheckboxItem disabled label="Disabled" />
		</div>
	)
};

export const Switch: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<div className="lyds-story-row">
				<LydsSwitch defaultChecked aria-labelledby="automatic-regulation-label" />
				<span id="automatic-regulation-label">Automatic regulation</span>
			</div>
			<div className="lyds-story-row">
				<LydsSwitch aria-labelledby="emergency-uplink-label" disabled />
				<span id="emergency-uplink-label">Emergency uplink unavailable</span>
			</div>
		</div>
	)
};

export const RadioChoices: Story = {
	render: () => (
		<RadioGroup aria-label="Sampling mode" defaultValue="balanced">
			<RadioItem value="precision" label="Precision" description="Maximum fidelity, slower cycle." />
			<RadioItem value="balanced" label="Balanced" description="Recommended for normal operation." />
			<RadioItem value="rapid" label="Rapid" description="Reduced fidelity, minimum latency." />
		</RadioGroup>
	)
};

export const SliderControl: Story = {
	name: "Slider",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Slider aria-label="Output gain" defaultValue={64} min={0} max={100} showValue />
			<Slider aria-label="Accepted temperature range" defaultValue={[18, 27]} min={0} max={50} showValue getAriaLabel={index => (index === 0 ? "Minimum temperature" : "Maximum temperature")} />
		</div>
	)
};

export const ToggleControls: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<div className="lyds-story-row">
				<Toggle defaultPressed>Grid overlay</Toggle>
				<Toggle variant="quiet">Labels</Toggle>
				<Toggle disabled>Locked layer</Toggle>
			</div>
			<ToggleGroup aria-label="View options" defaultValue={["diagram"]}>
				<Toggle value="diagram">Diagram</Toggle>
				<Toggle value="telemetry">Telemetry</Toggle>
				<Toggle value="history">History</Toggle>
			</ToggleGroup>
		</div>
	)
};

export const Segmented: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<SegmentedControl aria-label="Medium time horizon" defaultValue="day" size="md">
				<SegmentedControlItem value="hour">1 H</SegmentedControlItem>
				<SegmentedControlItem value="day">24 H</SegmentedControlItem>
				<SegmentedControlItem value="week">7 D</SegmentedControlItem>
			</SegmentedControl>
			<SegmentedControl aria-label="Small time horizon" defaultValue="day" size="sm">
				<SegmentedControlItem value="hour">1 H</SegmentedControlItem>
				<SegmentedControlItem value="day">24 H</SegmentedControlItem>
				<SegmentedControlItem value="week">7 D</SegmentedControlItem>
			</SegmentedControl>
			<p className="lyds-story-note">Use arrow keys to move between options. LYDS keeps the single-selection behavior separate from product filtering logic.</p>
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<CheckboxItem defaultChecked label="Night telemetry" />
			<div className="lyds-story-row">
				<LydsSwitch defaultChecked aria-labelledby="low-light-controls-label" />
				<span id="low-light-controls-label">Low-light controls</span>
			</div>
			<Slider aria-label="Panel luminance" defaultValue={38} showValue />
		</div>
	)
};
