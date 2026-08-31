import { Alert, AlertActions, AlertContent, AlertDescription, AlertTitle, Banner, Button, EmptyState, Loader, Meter, Progress, Skeleton, Spinner } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Feedback/Status & Progress",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Alerts: Story = {
	render: () => (
		<div className="lyds-story-stack">
			{(["neutral", "info", "success", "warning", "danger"] as const).map(status => (
				<Alert key={status} status={status}>
					<AlertContent>
						<AlertTitle>{status === "danger" ? "Payment method needs attention" : `${status[0]?.toUpperCase()}${status.slice(1)} notice`}</AlertTitle>
						<AlertDescription>Feedback surfaces use semantic status tokens and remain quiet to assistive technology unless dynamically introduced.</AlertDescription>
					</AlertContent>
					<AlertActions>
						<Button size="sm" variant="secondary">
							Inspect
						</Button>
					</AlertActions>
				</Alert>
			))}
		</div>
	)
};

export const BannerNotice: Story = {
	render: () => <Banner status="warning">Scheduled maintenance begins at 21:30. Existing sessions will continue, but new sessions may be delayed.</Banner>
};

export const ProgressAndMeter: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<Progress label="File upload" value={68} />
			<Progress label="Preparing report" value={null} status="info" />
			<Meter label="Storage used" value={7.4} min={0} max={10} format={{ style: "unit", unit: "gigabyte" }} status="warning" />
			<Meter label="Signal quality" value={92} min={0} max={100} status="success" />
		</div>
	)
};

export const Loading: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<div className="lyds-story-row">
				<Spinner size="sm" label="Loading small record" />
				<Spinner size="md" label="Loading record" />
				<Spinner size="lg" label="Loading large record" status="info" />
				<Loader label="Synchronizing settings" />
			</div>
			<div className="lyds-story-grid">
				<Skeleton shape="rectangular" />
				<div className="lyds-story-stack">
					<Skeleton />
					<Skeleton />
					<Skeleton />
				</div>
			</div>
		</div>
	)
};

export const EmptyCollection: Story = {
	render: () => <EmptyState title="No saved reports" description="Create a report or import an existing file to get started." actions={<Button>Create report</Button>} />
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack">
			<Banner status="info">Dark theme is active for this example.</Banner>
			<Progress label="Archive indexing" value={43} />
			<EmptyState title="No pending requests" description="New requests will appear here when they are submitted." />
		</div>
	)
};
