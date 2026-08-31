import {
	Avatar,
	Badge,
	Button,
	Card,
	CardBody,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	CloudBox,
	Collection,
	CollectionActions,
	CollectionContent,
	CollectionDescription,
	CollectionHeading,
	CollectionItem,
	CollectionMeta,
	DataTable,
	DataTableDescription,
	DataTableHeader,
	DataTableRegion,
	DataTableStatus,
	DataTableTitle,
	ListCell,
	ScrollArea,
	ScrollAreaContent,
	ScrollAreaScrollbar,
	ScrollAreaThumb,
	ScrollAreaViewport,
	SectionHeading,
	Separator,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "Components/Data Display/Surfaces & Collections",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {
	render: () => (
		<div className="lyds-story-grid">
			<Card variant="material">
				<CardHeader>
					<Badge size="sm" variant="success">
						Active
					</Badge>
					<CardTitle>Team workspace</CardTitle>
					<CardDescription>A shared space for planning, files, and project updates.</CardDescription>
				</CardHeader>
				<CardBody className="lyds-story-readout">12 members · 24 recent updates</CardBody>
				<CardFooter>
					<Button size="sm" variant="secondary">
						Open workspace
					</Button>
				</CardFooter>
			</Card>
			<CloudBox>
				<CardHeader>
					<CardTitle>Shared archive</CardTitle>
					<CardDescription>CloudBox provides an elevated surface for grouped content.</CardDescription>
				</CardHeader>
				<CardBody>17 files were added this week.</CardBody>
			</CloudBox>
		</div>
	)
};

export const ListCells: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<SectionHeading annotation="3 available" description="List cells preserve slots and semantic interactive rendering." action={<Badge variant="success">Current</Badge>}>
				Recent workspaces
			</SectionHeading>
			<ListCell leading={<Avatar alt="Design team" fallback="DT" status="online" statusLabel="Online" />} title="Design team" description="12 members" metadata="Updated today" trailing="›" />
			<Separator spacing="none" variant="solid" />
			<ListCell
				action={{ href: "#research", "aria-label": "Open research workspace details" }}
				leading={<Avatar alt="Research workspace" fallback="RW" />}
				title="Research workspace with an unusually long descriptive name"
				description="Private workspace · 8 members"
				metadata="Yesterday"
				trailing="›"
			/>
			<ListCell disabled leading={<Avatar alt="Archived workspace" fallback="AW" status="offline" statusLabel="Archived" />} title="Archived workspace" description="Read only" metadata="Archived" />
		</div>
	)
};

export const CollectionPrimitives: Story = {
	render: () => (
		<Collection density="comfortable" className="lyds-story-stack lyds-story-stack--narrow">
			{[
				["design", "Design planning", "Shared workspace", "Updated today"],
				["research", "User research", "Private workspace", "8 members"],
				["archive", "Project archive", "Read-only workspace", "17 files"]
			].map(([key, label, description, status]) => (
				<CollectionItem key={key}>
					<CollectionContent>
						<CollectionHeading>{label}</CollectionHeading>
						<CollectionDescription>{description}</CollectionDescription>
					</CollectionContent>
					<CollectionMeta className="lyds-story-readout">{status}</CollectionMeta>
					<CollectionActions>›</CollectionActions>
				</CollectionItem>
			))}
		</Collection>
	)
};

export const ScrollableCollection: Story = {
	render: () => (
		<ScrollArea className="lyds-story-stack--narrow">
			<ScrollAreaViewport>
				<ScrollAreaContent className="lyds-story-scroll-content">
					{Array.from({ length: 10 }, (_, index) => (
						<ListCell key={index} title={`Document ${index + 1}`} description="Shared document" metadata={`${index + 1} days ago`} />
					))}
				</ScrollAreaContent>
			</ScrollAreaViewport>
			<ScrollAreaScrollbar>
				<ScrollAreaThumb />
			</ScrollAreaScrollbar>
		</ScrollArea>
	)
};

export const DataTableComposition: Story = {
	render: () => (
		<DataTable>
			<DataTableHeader>
				<div>
					<DataTableTitle>Workspace members</DataTableTitle>
					<DataTableDescription>Presentation and semantic structure only; sorting, filtering, and data loading remain application-owned.</DataTableDescription>
				</div>
				<DataTableStatus className="lyds-story-readout">Updated at 14:32</DataTableStatus>
			</DataTableHeader>
			<DataTableRegion label="Workspace member records" className="lyds-story-table-wrap">
				<Table>
					<TableCaption>Current members and access levels</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead textAlign="end">Last active</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>Alex Chen</TableCell>
							<TableCell>alex@example.com</TableCell>
							<TableCell>Editor</TableCell>
							<TableCell textAlign="end">Today</TableCell>
							<TableCell>
								<Badge size="sm" variant="success">
									Active
								</Badge>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Mina Lin</TableCell>
							<TableCell>mina@example.com</TableCell>
							<TableCell>Viewer</TableCell>
							<TableCell textAlign="end">3 days ago</TableCell>
							<TableCell>
								<Badge size="sm" variant="warning">
									Invited
								</Badge>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</DataTableRegion>
		</DataTable>
	)
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => (
		<Card variant="material" className="lyds-story-stack lyds-story-stack--narrow">
			<SectionHeading annotation="Dark theme">Workspace summary</SectionHeading>
			<ListCell title="Design team" description="12 members" metadata="Updated today" />
		</Card>
	)
};
