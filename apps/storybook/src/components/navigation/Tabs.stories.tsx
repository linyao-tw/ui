import { Tabs } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Navigation/Tabs",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function WorkspaceTabs({ defaultValue = "overview", disabled = false }: { defaultValue?: string; disabled?: boolean }) {
	return (
		<Tabs.Root defaultValue={defaultValue}>
			<Tabs.List aria-label="Workspace settings sections">
				<Tabs.Tab value="overview">Overview</Tabs.Tab>
				<Tabs.Tab value="members">Members</Tabs.Tab>
				<Tabs.Tab value="activity">Activity</Tabs.Tab>
				<Tabs.Tab value="billing" disabled={disabled}>
					Billing preferences with a long label
				</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="overview">
				<div className="lyds-story-panel">Review the workspace name, description, and default sharing settings.</div>
			</Tabs.Panel>
			<Tabs.Panel value="members">
				<div className="lyds-story-panel">Twelve members currently have access to this workspace.</div>
			</Tabs.Panel>
			<Tabs.Panel value="activity">
				<div className="lyds-story-panel">Recent changes and sign-in activity appear here.</div>
			</Tabs.Panel>
			<Tabs.Panel value="billing">
				<div className="lyds-story-panel">Billing content and account rules belong to the product.</div>
			</Tabs.Panel>
		</Tabs.Root>
	);
}

export const Default: Story = {
	render: () => <WorkspaceTabs />
};

export const KeyboardNavigation: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<p className="lyds-story-note">Focus a tab, then use Left and Right Arrow to inspect roving focus and selection behavior.</p>
			<WorkspaceTabs disabled />
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => <WorkspaceTabs defaultValue="members" />
};
