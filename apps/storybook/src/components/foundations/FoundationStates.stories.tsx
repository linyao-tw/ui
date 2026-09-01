import { Avatar, Badge, Button, Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle, IconButton, Link, ListCell, SectionHeading, Separator } from "@lyds/ui";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";

import "../story-layout.css";

const buttonVariants = ["primary", "secondary", "quiet", "danger"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;
const linkVariants = ["default", "accent", "subtle"] as const;
const linkSizes = ["sm", "md", "lg"] as const;
const badgeVariants = ["neutral", "accent", "success", "warning", "danger"] as const;
const badgeSizes = ["sm", "md"] as const;
const avatarSizes = ["xs", "sm", "md", "lg", "xl"] as const;
const cardVariants = ["material", "elevated", "inset", "outline", "cloud"] as const;
const cardSizes = ["sm", "md", "lg"] as const;
const headingSizes = ["sm", "md", "lg"] as const;

const meta = {
	title: "Components/Foundations/State Matrix",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface StateSectionProps {
	id: string;
	title: string;
	children: ReactNode;
}

function StateSection({ id, title, children }: StateSectionProps) {
	return (
		<section aria-labelledby={id} className="lyds-story-panel">
			<h2 id={id} className="lyds-story-panel__heading">
				{title}
			</h2>
			{children}
		</section>
	);
}

function MatrixCard({ label, children }: { label: string; children: ReactNode }) {
	return (
		<Card size="sm" variant="outline">
			<CardHeader>
				<CardTitle>{label}</CardTitle>
			</CardHeader>
			<CardBody>{children}</CardBody>
		</Card>
	);
}

export const IconButtonStates: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection id="icon-button-variants" title="Variants">
				<div className="lyds-story-row">
					{buttonVariants.map(variant => (
						<IconButton key={variant} aria-label={`${variant} notification action`} variant={variant}>
							<BellIcon weight="bold" />
						</IconButton>
					))}
				</div>
			</StateSection>
			<StateSection id="icon-button-sizes" title="Sizes">
				<div className="lyds-story-row">
					{buttonSizes.map(size => (
						<IconButton key={size} aria-label={`Add item, ${size} size`} size={size} variant="secondary">
							<PlusIcon weight="bold" />
						</IconButton>
					))}
				</div>
			</StateSection>
			<StateSection id="icon-button-availability" title="Loading and disabled">
				<div className="lyds-story-row">
					<IconButton aria-label="Save item" loading>
						<FloppyDiskIcon weight="bold" />
					</IconButton>
					<IconButton aria-label="Delete item" disabled variant="danger">
						<TrashIcon weight="bold" />
					</IconButton>
				</div>
			</StateSection>
		</div>
	)
};

export const LinkStates: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection id="link-variants" title="Variants">
				<div className="lyds-story-row">
					{linkVariants.map(variant => (
						<Link key={variant} href={`#${variant}`} variant={variant}>
							{variant} link
						</Link>
					))}
				</div>
			</StateSection>
			<StateSection id="link-sizes" title="Sizes">
				<div className="lyds-story-row">
					{linkSizes.map(size => (
						<Link key={size} href={`#${size}`} size={size}>
							{size} documentation link
						</Link>
					))}
				</div>
			</StateSection>
			<StateSection id="link-behavior" title="Disabled, external, and long text">
				<div className="lyds-story-stack lyds-story-stack--narrow">
					<Link disabled href="#disabled">
						Unavailable documentation
					</Link>
					<Link external href="https://example.com" rel="noreferrer" target="_blank" variant="accent">
						External reference (opens in a new tab)
					</Link>
					<Link href="#long-link">Review the complete workspace access, retention, collaboration, and notification configuration</Link>
				</div>
			</StateSection>
		</div>
	)
};

export const BadgeStates: Story = {
	render: () => (
		<div className="lyds-story-stack">
			{badgeSizes.map(size => (
				<StateSection key={size} id={`badge-${size}`} title={`${size} variants`}>
					<div className="lyds-story-row">
						{badgeVariants.map(variant => (
							<Badge key={variant} size={size} variant={variant}>
								{variant}
							</Badge>
						))}
					</div>
				</StateSection>
			))}
			<StateSection id="badge-long" title="Long status">
				<Badge variant="warning">Awaiting workspace administrator approval</Badge>
			</StateSection>
		</div>
	)
};

export const AvatarStates: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection id="avatar-sizes" title="Sizes">
				<div className="lyds-story-row">
					{avatarSizes.map(size => (
						<Avatar key={size} alt={`${size} team avatar`} fallback={size.toUpperCase()} size={size} />
					))}
				</div>
			</StateSection>
			<StateSection id="avatar-variants" title="Neutral and accent">
				<div className="lyds-story-row">
					<Avatar alt="Neutral account" fallback="NA" />
					<Avatar alt="Accent account" fallback="AA" variant="accent" />
				</div>
			</StateSection>
			<StateSection id="avatar-statuses" title="Statuses">
				<div className="lyds-story-row">
					<Avatar alt="Online account" fallback="ON" status="online" statusLabel="Online" />
					<Avatar alt="Away account" fallback="AW" status="away" statusLabel="Away" />
					<Avatar alt="Busy account" fallback="BY" status="busy" statusLabel="Busy" />
					<Avatar alt="Offline account" fallback="OF" status="offline" statusLabel="Offline" />
				</div>
			</StateSection>
		</div>
	)
};

export const SeparatorStates: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection id="separator-horizontal" title="Horizontal variants and spacing">
				<div className="lyds-story-stack lyds-story-stack--narrow">
					<span className="lyds-story-readout">Solid · none</span>
					<Separator spacing="none" />
					<span className="lyds-story-readout">Technical · small</span>
					<Separator spacing="sm" variant="technical" />
					<span className="lyds-story-readout">Solid · medium</span>
					<Separator spacing="md" />
					<span className="lyds-story-readout">Technical · large</span>
					<Separator spacing="lg" variant="technical" />
				</div>
			</StateSection>
			<StateSection id="separator-vertical" title="Vertical variants">
				<div className="lyds-story-row">
					<span className="lyds-story-readout">Primary information</span>
					<Separator orientation="vertical" spacing="sm" />
					<span className="lyds-story-readout">Secondary information</span>
					<Separator orientation="vertical" spacing="sm" variant="technical" />
					<span className="lyds-story-readout">Supporting information</span>
				</div>
			</StateSection>
		</div>
	)
};

export const CardStates: Story = {
	render: () => (
		<div className="lyds-story-stack">
			<StateSection id="card-variants" title="Variants">
				<div className="lyds-story-grid">
					{cardVariants.map(variant => (
						<Card key={variant} variant={variant}>
							<CardHeader>
								<Badge size="sm" variant={variant === "inset" ? "warning" : "neutral"}>
									{variant}
								</Badge>
								<CardTitle>Workspace summary</CardTitle>
								<CardDescription>Shared application content presented on a {variant} surface.</CardDescription>
							</CardHeader>
							<CardBody className="lyds-story-readout">12 members · Updated at 14:32</CardBody>
						</Card>
					))}
				</div>
			</StateSection>
			<StateSection id="card-sizes" title="Sizes">
				<div className="lyds-story-grid">
					{cardSizes.map(size => (
						<Card key={size} size={size} variant="outline">
							<CardHeader>
								<CardTitle>{size} card</CardTitle>
								<CardDescription>Spacing and content hierarchy remain stable at this size.</CardDescription>
							</CardHeader>
						</Card>
					))}
				</div>
			</StateSection>
		</div>
	)
};

export const SectionHeadingStates: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			{headingSizes.map((size, index) => (
				<section key={size} aria-label={`${size} section heading example`}>
					<SectionHeading
						action={<Badge variant={index === 2 ? "warning" : "success"}>{index === 2 ? "Review" : "Current"}</Badge>}
						annotation={`${index + 1} group${index === 0 ? "" : "s"}`}
						description="A supporting description explains the section without replacing its heading."
						level={(index + 2) as 2 | 3 | 4}
						size={size}
					>
						{size} section heading
					</SectionHeading>
				</section>
			))}
			<section aria-label="Long section heading example">
				<SectionHeading
					annotation="Long content"
					description="Long headings wrap predictably while the action remains visible at narrow application widths."
					action={<Badge variant="accent">5 updates</Badge>}
				>
					Workspace permissions, notification delivery, document retention, and collaboration settings
				</SectionHeading>
			</section>
		</div>
	)
};

export const ListCellStates: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<ListCell
				leading={<Avatar alt="Design team" fallback="DT" status="online" statusLabel="Online" />}
				title="Default list cell"
				description="Static supporting information"
				metadata="Today"
				trailing={<CaretRightIcon aria-hidden weight="bold" />}
			/>
			<ListCell
				action={{ href: "#workspace", "aria-label": "Open selected workspace" }}
				leading={<Avatar alt="Selected workspace" fallback="SW" variant="accent" />}
				metadata="Current"
				selected
				selectionSemantics="page"
				title="Selected link action"
				trailing={<CaretRightIcon aria-hidden weight="bold" />}
			/>
			<ListCell action={{ "aria-label": "Review application settings" }} description="Keyboard-accessible button action" metadata="2 updates" size="sm" title="Compact button action" />
			<ListCell description="A larger inset presentation for prominent rows" metadata="Yesterday" size="lg" title="Large inset row" variant="inset" />
			<ListCell disabled description="Unavailable to the current account" metadata="Disabled" title="Disabled row" />
			<ListCell
				description="Long supporting information truncates without colliding with metadata or the trailing action at narrow widths."
				metadata="Updated 12 minutes ago"
				title="Workspace with an intentionally long name for responsive verification"
				trailing={<CaretRightIcon aria-hidden weight="bold" />}
			/>
		</div>
	)
};

export const NarrowLongContent: Story = {
	parameters: { viewport: { defaultViewport: "mobile1" } },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<SectionHeading
				annotation="Narrow layout"
				description="This heading and its adjacent status remain readable without requiring a fixed application width."
				action={<Badge variant="warning">Needs review</Badge>}
			>
				Workspace access and document retention configuration
			</SectionHeading>
			<Card variant="material">
				<CardHeader>
					<CardTitle>Confirm a long-running workspace operation</CardTitle>
					<CardDescription>The operation may continue in the background, but editing will remain unavailable until every document has been processed.</CardDescription>
				</CardHeader>
				<CardBody className="lyds-story-readout">Estimated duration: 18 minutes</CardBody>
				<CardFooter className="lyds-story-row">
					<Button endIcon={<ArrowRightIcon weight="bold" />}>Start operation</Button>
					<Link href="#settings" variant="subtle">
						Review settings before continuing
					</Link>
				</CardFooter>
			</Card>
			<ListCell
				leading={<Avatar alt="Research and strategy workspace" fallback="RS" />}
				metadata="Updated today"
				title="Research and strategy workspace with an unusually long descriptive name"
				trailing={<CaretRightIcon aria-hidden weight="bold" />}
			/>
		</div>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<SectionHeading annotation="Dark theme" action={<Badge variant="success">Operational</Badge>}>
				Foundation components
			</SectionHeading>
			<MatrixCard label="Actions and status">
				<div className="lyds-story-row">
					<IconButton aria-label="Add notification" variant="secondary">
						<PlusIcon weight="bold" />
					</IconButton>
					<Link href="#dark-link" variant="accent">
						Open details
					</Link>
					<Badge variant="warning">Attention</Badge>
					<Avatar alt="Busy account" fallback="BA" status="busy" statusLabel="Busy" variant="accent" />
				</div>
			</MatrixCard>
			<Separator variant="technical" />
			<Card variant="inset">
				<CardHeader>
					<CardTitle>Dark material surface</CardTitle>
					<CardDescription>Warm low-light tokens retain the same hierarchy and interaction vocabulary.</CardDescription>
				</CardHeader>
			</Card>
			<ListCell
				description="Selected content remains legible in low-light conditions"
				metadata="Current"
				selected
				selectionSemantics="page"
				title="Selected dark-theme row"
				trailing={<CaretRightIcon aria-hidden weight="bold" />}
			/>
		</div>
	)
};
