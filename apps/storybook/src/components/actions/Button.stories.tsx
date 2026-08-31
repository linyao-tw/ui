import { Badge, Button, Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle, IconButton } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Actions/Button",
	component: Button,
	args: {
		children: "Save changes"
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
			<Button variant="primary">Continue</Button>
			<Button variant="secondary">View details</Button>
			<Button variant="quiet">Cancel</Button>
			<Button variant="danger">Delete</Button>
		</div>
	)
};

export const Sizes: Story = {
	render: () => (
		<div className="lyds-story-row">
			<Button size="sm">Small button</Button>
			<Button size="md">Medium button</Button>
			<Button size="lg">Large button</Button>
		</div>
	)
};

export const BusyAndDisabled: Story = {
	render: () => (
		<div className="lyds-story-row">
			<Button loading>Saving</Button>
			<Button disabled variant="secondary">
				Unavailable
			</Button>
			<IconButton aria-label="Add item" variant="secondary">
				<span aria-hidden="true">＋</span>
			</IconButton>
		</div>
	)
};

export const LongTextComposition: Story = {
	render: () => (
		<Card className="lyds-story-stack lyds-story-stack--narrow" variant="material">
			<CardHeader>
				<Badge variant="warning">Confirmation required</Badge>
				<CardTitle>Confirm a long-running background operation</CardTitle>
				<CardDescription>The operation can continue in the background, but this record will be unavailable until the process is complete.</CardDescription>
			</CardHeader>
			<CardBody className="lyds-story-readout">Estimated duration: 8 minutes</CardBody>
			<CardFooter className="lyds-story-row">
				<Button>Start operation</Button>
				<Button variant="quiet">Review settings</Button>
			</CardFooter>
		</Card>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-row">
			<Button>Save changes</Button>
			<Button variant="secondary">Preview</Button>
			<Button variant="quiet">Cancel</Button>
		</div>
	)
};
