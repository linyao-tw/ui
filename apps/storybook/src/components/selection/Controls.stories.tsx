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
		<CheckboxGroup aria-label="Notification channels" defaultValue={["email", "in-app"]}>
			<CheckboxItem value="email" label="Email notifications" description="Receive important updates by email." />
			<CheckboxItem value="in-app" label="In-app notifications" description="Show updates while the application is open." />
			<CheckboxItem value="sms" label="SMS notifications" description="Unavailable for this account." disabled />
		</CheckboxGroup>
	)
};

export const CheckboxStates: Story = {
	render: () => (
		<div className="lyds-story-row">
			<CheckboxItem label="Unchecked" />
			<CheckboxItem defaultChecked label="Checked" />
			<CheckboxItem indeterminate label="Indeterminate" />
			<CheckboxItem disabled label="Disabled unchecked" />
			<CheckboxItem disabled defaultChecked label="Disabled checked" />
		</div>
	)
};

export const Switch: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<div className="lyds-story-row">
				<LydsSwitch aria-labelledby="manual-save-label" />
				<span id="manual-save-label">Save changes manually</span>
			</div>
			<div className="lyds-story-row">
				<LydsSwitch defaultChecked aria-labelledby="automatic-regulation-label" />
				<span id="automatic-regulation-label">Save changes automatically</span>
			</div>
			<div className="lyds-story-row">
				<LydsSwitch aria-labelledby="emergency-uplink-label" disabled />
				<span id="emergency-uplink-label">Offline access unavailable</span>
			</div>
		</div>
	)
};

export const DarkControlStates: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<CheckboxItem label="Unchecked in dark theme" />
			<RadioGroup aria-label="Dark theme radio states" defaultValue="selected">
				<RadioItem value="unselected" label="Unselected option" />
				<RadioItem value="selected" label="Selected option" />
			</RadioGroup>
			<div className="lyds-story-row">
				<LydsSwitch aria-labelledby="dark-switch-label" />
				<span id="dark-switch-label">Off in dark theme</span>
			</div>
		</div>
	)
};

export const RadioChoices: Story = {
	render: () => (
		<RadioGroup aria-label="Update frequency" defaultValue="daily">
			<RadioItem value="weekly" label="Weekly" description="A summary every Monday." />
			<RadioItem value="daily" label="Daily" description="Recommended for most teams." />
			<RadioItem value="realtime" label="As changes happen" description="Immediate updates throughout the day." />
		</RadioGroup>
	)
};

export const SliderControl: Story = {
	name: "Slider",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<Slider aria-label="Volume" defaultValue={64} min={0} max={100} showValue />
			<Slider aria-label="Preferred price range" defaultValue={[18, 27]} min={0} max={50} showValue getAriaLabel={index => (index === 0 ? "Minimum price" : "Maximum price")} />
		</div>
	)
};

export const ToggleControls: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<div className="lyds-story-row">
				<Toggle defaultPressed>Preview pane</Toggle>
				<Toggle variant="quiet">Descriptions</Toggle>
				<Toggle disabled>Archived items</Toggle>
			</div>
			<ToggleGroup aria-label="View options" defaultValue={["diagram"]}>
				<Toggle value="diagram">Cards</Toggle>
				<Toggle value="list">List</Toggle>
				<Toggle value="history">Timeline</Toggle>
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
			<CheckboxItem defaultChecked label="Email notifications" />
			<div className="lyds-story-row">
				<LydsSwitch defaultChecked aria-labelledby="low-light-controls-label" />
				<span id="low-light-controls-label">Dark theme</span>
			</div>
			<Slider aria-label="Interface contrast" defaultValue={38} showValue />
		</div>
	)
};
