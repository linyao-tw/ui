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
						Nominal
					</Badge>
					<CardTitle>Thermal controller</CardTitle>
					<CardDescription>Primary temperature regulation module.</CardDescription>
				</CardHeader>
				<CardBody className="lyds-story-readout">38.2 °C / 1840 RPM</CardBody>
				<CardFooter>
					<Button size="sm" variant="secondary">
						Inspect
					</Button>
				</CardFooter>
			</Card>
			<CloudBox>
				<CardHeader>
					<CardTitle>Remote archive</CardTitle>
					<CardDescription>CloudBox is LYDS's elevated cloud-equivalent composition.</CardDescription>
				</CardHeader>
				<CardBody>17 diagnostic bundles synchronized.</CardBody>
			</CloudBox>
		</div>
	)
};

export const ListCells: Story = {
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<SectionHeading annotation="CONNECTED / 03" description="Controller list cells preserve slots and semantic interactive rendering." action={<Badge variant="success">Online</Badge>}>
				Active controllers
			</SectionHeading>
			<ListCell leading={<Avatar alt="Thermal relay" fallback="TR" status="online" statusLabel="Online" />} title="Thermal relay" description="Rack 04 · Channel A" metadata="38.2 °C" trailing="›" />
			<Separator spacing="none" variant="technical" />
			<ListCell
				action={{ href: "#optical", "aria-label": "Open optical scanner details" }}
				leading={<Avatar alt="Optical scanner" fallback="OS" />}
				title="Optical scanner with an unusually long equipment label"
				description="Remote field station · Delayed uplink"
				metadata="420 ms"
				trailing="›"
			/>
			<ListCell disabled leading={<Avatar alt="Archive bus" fallback="AB" status="offline" statusLabel="Offline" />} title="Archive bus" description="Unavailable" metadata="OFF" />
		</div>
	)
};

export const CollectionPrimitives: Story = {
	render: () => (
		<Collection density="comfortable" className="lyds-story-stack lyds-story-stack--narrow">
			{[
				["XR-071", "Thermal relay", "38.2 °C"],
				["OP-122", "Optical scanner", "92%"],
				["AR-004", "Archive controller", "17 files"]
			].map(([serial, label, status]) => (
				<CollectionItem key={serial}>
					<CollectionContent>
						<CollectionHeading>{label}</CollectionHeading>
						<CollectionDescription>{serial}</CollectionDescription>
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
						<ListCell key={index} title={`Capture ${String(index + 1).padStart(2, "0")}`} description="Diagnostic record" metadata={`T+${String(index * 7).padStart(3, "0")}`} />
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
					<DataTableTitle>Live hardware telemetry</DataTableTitle>
					<DataTableDescription>Presentation and semantic structure only; sorting, filtering, and data loading remain application-owned.</DataTableDescription>
				</div>
				<DataTableStatus className="lyds-story-readout">REFRESH / 14:32:08</DataTableStatus>
			</DataTableHeader>
			<DataTableRegion label="Hardware telemetry records" className="lyds-story-table-wrap">
				<Table>
					<TableCaption>Current measurements from connected controllers</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Module</TableHead>
							<TableHead>Serial</TableHead>
							<TableHead textAlign="end">Voltage</TableHead>
							<TableHead textAlign="end">Temperature</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>Thermal relay</TableCell>
							<TableCell numeric>XR-071</TableCell>
							<TableCell numeric textAlign="end">
								24.8 V
							</TableCell>
							<TableCell numeric textAlign="end">
								38.2 °C
							</TableCell>
							<TableCell>
								<Badge size="sm" variant="success">
									Nominal
								</Badge>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Optical scanner</TableCell>
							<TableCell numeric>OP-122</TableCell>
							<TableCell numeric textAlign="end">
								12.1 V
							</TableCell>
							<TableCell numeric textAlign="end">
								41.7 °C
							</TableCell>
							<TableCell>
								<Badge size="sm" variant="warning">
									Service
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
		<Card variant="inset" className="lyds-story-stack lyds-story-stack--narrow">
			<SectionHeading annotation="LOW LIGHT / ACTIVE">Controller summary</SectionHeading>
			<ListCell title="Thermal relay" description="Rack 04 · Channel A" metadata="38.2 °C" />
		</Card>
	)
};
