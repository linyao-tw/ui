import { Badge, Button, Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle, IconButton } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Actions/Button",
	component: Button,
	args: {
		children: "Execute sequence"
	},
	argTypes: {
		variant: { control: "select", options: ["primary", "secondary", "quiet", "danger"] },
		size: { control: "select", options: ["sm", "md", "lg"] }
	}
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className="lyds-story-row">
			<Button variant="primary">Initialize</Button>
			<Button variant="secondary">Inspect log</Button>
			<Button variant="quiet">Defer</Button>
			<Button variant="danger">Purge buffer</Button>
		</div>
	)
};

export const Sizes: Story = {
	render: () => (
		<div className="lyds-story-row">
			<Button size="sm">Small / 01</Button>
			<Button size="md">Medium / 02</Button>
			<Button size="lg">Large / 03</Button>
		</div>
	)
};

export const BusyAndDisabled: Story = {
	render: () => (
		<div className="lyds-story-row">
			<Button loading>Calibrating</Button>
			<Button disabled variant="secondary">
				Unavailable
			</Button>
			<IconButton aria-label="Add module" variant="secondary">
				<span aria-hidden="true">＋</span>
			</IconButton>
		</div>
	)
};

export const LongTextComposition: Story = {
	render: () => (
		<Card className="lyds-story-stack lyds-story-stack--narrow" variant="inset">
			<CardHeader>
				<Badge variant="warning">Awaiting operator</Badge>
				<CardTitle>Confirm long-running equipment calibration</CardTitle>
				<CardDescription>The operation can continue in the background, but the current measurement channel will be unavailable until the sequence is complete.</CardDescription>
			</CardHeader>
			<CardBody className="lyds-story-readout">EST. DURATION 08:40</CardBody>
			<CardFooter className="lyds-story-row">
				<Button>Start calibration sequence</Button>
				<Button variant="quiet">Review parameters</Button>
			</CardFooter>
		</Card>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-row">
			<Button startIcon={<span aria-hidden="true">●</span>}>Arm channel</Button>
			<Button variant="secondary">Stand by</Button>
			<Button variant="quiet">Diagnostics</Button>
		</div>
	)
};
