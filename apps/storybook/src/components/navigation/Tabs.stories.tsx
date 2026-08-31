import { Badge, Tabs } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Navigation/Tabs",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function TelemetryTabs({ defaultValue = "status", disabled = false }: { defaultValue?: string; disabled?: boolean }) {
	return (
		<Tabs.Root defaultValue={defaultValue}>
			<Tabs.Rail>
				<span className="lyds-story-readout">MODULE / XR-071</span>
				<Badge size="sm" variant="success">
					Online
				</Badge>
			</Tabs.Rail>
			<Tabs.List aria-label="Module views">
				<Tabs.Tab value="status">Status</Tabs.Tab>
				<Tabs.Tab value="telemetry">Telemetry</Tabs.Tab>
				<Tabs.Tab value="history">History</Tabs.Tab>
				<Tabs.Tab value="service" disabled={disabled}>
					Service record with a long label
				</Tabs.Tab>
				<Tabs.Indicator />
			</Tabs.List>
			<Tabs.Panel value="status">
				<div className="lyds-story-panel">All primary channels are operating inside nominal thresholds.</div>
			</Tabs.Panel>
			<Tabs.Panel value="telemetry">
				<div className="lyds-story-panel lyds-story-readout">24.8 V / 38.2 °C / 1840 RPM</div>
			</Tabs.Panel>
			<Tabs.Panel value="history">
				<div className="lyds-story-panel">Three calibration events recorded during this operating period.</div>
			</Tabs.Panel>
			<Tabs.Panel value="service">
				<div className="lyds-story-panel">Service record content belongs to the product.</div>
			</Tabs.Panel>
		</Tabs.Root>
	);
}

export const Default: Story = {
	render: () => <TelemetryTabs />
};

export const KeyboardNavigation: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<p className="lyds-story-note">Focus a tab, then use Left and Right Arrow to inspect roving focus and selection behavior.</p>
			<TelemetryTabs disabled />
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => <TelemetryTabs defaultValue="telemetry" />
};
