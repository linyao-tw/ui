import { Button, Popover, PreviewCard, Tooltip } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Overlays/Tooltip",
	parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function DiagnosticTooltip({ defaultOpen = false }: { defaultOpen?: boolean }) {
	return (
		<Tooltip.Provider delay={250}>
			<Tooltip.Root defaultOpen={defaultOpen}>
				<Tooltip.Trigger aria-label="SIG 92 — signal quality details">SIG 92</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Positioner side="top">
						<Tooltip.Popup>
							Signal quality / 92%
							<Tooltip.Arrow />
						</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}

export const Default: Story = {
	render: () => <DiagnosticTooltip />
};

export const Open: Story = {
	render: () => <DiagnosticTooltip defaultOpen />
};

export const PopoverPanel: Story = {
	render: () => (
		<Popover.Root>
			<Popover.Trigger>Channel details</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner>
					<Popover.Popup>
						<Popover.Title>Thermal channel 04</Popover.Title>
						<Popover.Description>Nominal range 18–32 °C. Last calibrated 2026-08-14.</Popover.Description>
						<div className="lyds-story-row">
							<Button size="sm">Inspect history</Button>
							<Popover.Close>Close</Popover.Close>
						</div>
						<Popover.Arrow />
					</Popover.Popup>
				</Popover.Positioner>
			</Popover.Portal>
		</Popover.Root>
	)
};

export const Preview: Story = {
	render: () => (
		<PreviewCard.Root>
			<PreviewCard.Trigger href="#relay">Relay XR-071</PreviewCard.Trigger>
			<PreviewCard.Portal>
				<PreviewCard.Positioner>
					<PreviewCard.Popup>
						<p className="lyds-story-panel__heading">Controller preview</p>
						<strong>Relay XR-071</strong>
						<p>Online · 24.8 V · 38.2 °C</p>
						<PreviewCard.Arrow />
					</PreviewCard.Popup>
				</PreviewCard.Positioner>
			</PreviewCard.Portal>
		</PreviewCard.Root>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => <DiagnosticTooltip defaultOpen />
};
