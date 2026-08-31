import { Button, Popover, PreviewCard, Tooltip } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Overlays/Tooltip",
	parameters: { layout: "centered" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function HelpTooltip({ defaultOpen = false }: { defaultOpen?: boolean }) {
	return (
		<Tooltip.Provider delay={250}>
			<Tooltip.Root defaultOpen={defaultOpen}>
				<Tooltip.Trigger aria-label="Formatting help">Formatting help</Tooltip.Trigger>
				<Tooltip.Portal>
					<Tooltip.Positioner side="top">
						<Tooltip.Popup>
							Markdown formatting is supported
							<Tooltip.Arrow />
						</Tooltip.Popup>
					</Tooltip.Positioner>
				</Tooltip.Portal>
			</Tooltip.Root>
		</Tooltip.Provider>
	);
}

export const Default: Story = {
	render: () => <HelpTooltip />
};

export const Open: Story = {
	render: () => <HelpTooltip defaultOpen />
};

export const PopoverPanel: Story = {
	render: () => (
		<Popover.Root>
			<Popover.Trigger>Member details</Popover.Trigger>
			<Popover.Portal>
				<Popover.Positioner>
					<Popover.Popup>
						<Popover.Title>Alex Chen</Popover.Title>
						<Popover.Description>Editor · Joined 14 August 2026.</Popover.Description>
						<div className="lyds-story-row">
							<Button size="sm">View profile</Button>
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
			<PreviewCard.Trigger href="#article">Designing accessible forms</PreviewCard.Trigger>
			<PreviewCard.Portal>
				<PreviewCard.Positioner>
					<PreviewCard.Popup>
						<strong>Designing accessible forms</strong>
						<p>A practical guide to labels, errors, focus, and keyboard interaction.</p>
						<PreviewCard.Arrow />
					</PreviewCard.Popup>
				</PreviewCard.Positioner>
			</PreviewCard.Portal>
		</PreviewCard.Root>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => <HelpTooltip defaultOpen />
};
