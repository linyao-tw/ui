import {
	Accordion,
	AlertDialog,
	Badge,
	Banner,
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Button,
	CalendarDate,
	Card,
	CardBody,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
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
	DateRangePicker,
	Dialog,
	Drawer,
	EmptyState as EmptyStateComponent,
	Header,
	HeaderActions,
	HeaderBrand,
	HeaderNav,
	HeaderRail,
	HeaderStatus,
	IconButton,
	Meter,
	Pagination,
	PaginationButton,
	PaginationItem,
	PaginationList,
	PaginationNext,
	PaginationPrevious,
	Progress,
	ScrollArea,
	ScrollAreaContent,
	ScrollAreaScrollbar,
	ScrollAreaThumb,
	ScrollAreaViewport,
	SearchField,
	SegmentedControl,
	SegmentedControlItem,
	Select,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tabs,
	TextField,
	TextView,
	ToastProvider,
	createToastManager,
	type ToastManager
} from "@lyds/ui";
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowClockwise";
import { BellIcon } from "@phosphor-icons/react/dist/csr/Bell";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import { CheckCircleIcon } from "@phosphor-icons/react/dist/csr/CheckCircle";
import { DownloadSimpleIcon } from "@phosphor-icons/react/dist/csr/DownloadSimple";
import { GearIcon } from "@phosphor-icons/react/dist/csr/Gear";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { WarningIcon } from "@phosphor-icons/react/dist/csr/Warning";
import { WrenchIcon } from "@phosphor-icons/react/dist/csr/Wrench";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState, type FormEvent } from "react";

import "./operations-workspace.css";

type ServiceStatus = "healthy" | "degraded" | "maintenance";
type Region = "all" | "asia" | "europe" | "americas";
type StatusFilter = "all" | "attention";

interface ServiceRecord {
	id: string;
	name: string;
	owner: string;
	region: Exclude<Region, "all">;
	status: ServiceStatus;
	availability: string;
	latency: string;
	window: string;
}

const services: readonly ServiceRecord[] = [
	{
		id: "gateway",
		name: "Edge gateway",
		owner: "Traffic platform",
		region: "asia",
		status: "healthy",
		availability: "99.99%",
		latency: "42 ms",
		window: "Sep 04, 21:30"
	},
	{
		id: "checkout",
		name: "Checkout API",
		owner: "Commerce core",
		region: "europe",
		status: "degraded",
		availability: "99.91%",
		latency: "186 ms",
		window: "Sep 05, 01:00"
	},
	{
		id: "identity",
		name: "Identity broker",
		owner: "Trust services",
		region: "americas",
		status: "healthy",
		availability: "99.98%",
		latency: "64 ms",
		window: "Sep 06, 23:00"
	},
	{
		id: "catalog",
		name: "Catalog index",
		owner: "Discovery",
		region: "asia",
		status: "maintenance",
		availability: "99.94%",
		latency: "71 ms",
		window: "In progress"
	},
	{
		id: "ledger",
		name: "Payment ledger",
		owner: "Financial systems",
		region: "europe",
		status: "healthy",
		availability: "100.00%",
		latency: "53 ms",
		window: "Sep 08, 20:00"
	},
	{
		id: "notifications",
		name: "Notification relay",
		owner: "Messaging",
		region: "americas",
		status: "degraded",
		availability: "99.87%",
		latency: "214 ms",
		window: "Sep 09, 00:30"
	}
] as const;

const activities = [
	{
		id: "activity-1",
		title: "Traffic shift completed",
		description: "Edge gateway reached 100% traffic in Asia Pacific.",
		meta: "12 min ago",
		status: "success" as const
	},
	{
		id: "activity-2",
		title: "Latency threshold crossed",
		description: "Checkout API p95 latency exceeded the review threshold.",
		meta: "28 min ago",
		status: "warning" as const
	},
	{
		id: "activity-3",
		title: "Maintenance started",
		description: "Catalog index entered its approved maintenance window.",
		meta: "41 min ago",
		status: "neutral" as const
	},
	{
		id: "activity-4",
		title: "Runbook acknowledged",
		description: "On-call ownership transferred to the commerce team.",
		meta: "1 hr ago",
		status: "neutral" as const
	},
	{
		id: "activity-5",
		title: "Change window approved",
		description: "Payment ledger upgrade is ready for its scheduled window.",
		meta: "2 hr ago",
		status: "success" as const
	}
] as const;

const regionOptions = [
	{ value: "all", label: "All regions" },
	{ value: "asia", label: "Asia Pacific" },
	{ value: "europe", label: "Europe" },
	{ value: "americas", label: "Americas" }
] as const;

const priorityOptions = [
	{ value: "standard", label: "Standard change", description: "Normal review and notification flow" },
	{ value: "urgent", label: "Urgent change", description: "Requires an incident reference" }
] as const;

const statusPresentation: Record<ServiceStatus, { label: string; variant: "success" | "warning" | "neutral" }> = {
	healthy: { label: "Healthy", variant: "success" },
	degraded: { label: "Degraded", variant: "warning" },
	maintenance: { label: "Maintenance", variant: "neutral" }
};

const defaultRange = {
	start: new CalendarDate(2026, 9, 1),
	end: new CalendarDate(2026, 9, 7)
};

const meta = {
	title: "Patterns/Operations Workspace",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function notify(manager: ToastManager, status: "info" | "success" | "warning" | "danger", title: string, description: string) {
	manager.add({
		data: { status },
		description,
		timeout: 7000,
		title
	});
}

function ChangeDialog({ manager, onSaved }: { manager: ToastManager; onSaved: () => void }) {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("Checkout latency mitigation");
	const [priority, setPriority] = useState("standard");

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setOpen(false);
		onSaved();
		notify(manager, "success", "Change saved", `${title} is ready for review.`);
	};

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger>Schedule change</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup closeLabel="Close change form">
						<Dialog.Header>
							<Dialog.Title>Schedule service change</Dialog.Title>
							<Dialog.Description>Record a reviewable maintenance request. This demo does not submit data to a service.</Dialog.Description>
						</Dialog.Header>
						<form onSubmit={handleSubmit}>
							<Dialog.Body>
								<div className="ops-form-stack">
									<TextField label="Change title" name="changeTitle" required value={title} onValueChange={setTitle} />
									<div className="ops-field-group">
										<span className="ops-field-label" id="ops-priority-label">
											Review priority
										</span>
										<Select aria-labelledby="ops-priority-label" name="priority" onValueChange={value => value !== null && setPriority(value)} options={priorityOptions} value={priority} />
									</div>
									<TextView label="Review note" name="reviewNote" rows={4} defaultValue="Confirm checkout latency has returned to baseline before closing the change." />
								</div>
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.Close>Cancel</Dialog.Close>
								<Button type="submit" startIcon={<CheckCircleIcon weight="bold" />}>
									Save change
								</Button>
							</Dialog.Footer>
						</form>
					</Dialog.Popup>
				</Dialog.Viewport>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function ServiceDrawer({ service }: { service: ServiceRecord }) {
	return (
		<Drawer.Root swipeDirection="right">
			<Drawer.Trigger aria-label={`Inspect ${service.name}`}>Inspect</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup closeLabel={`Close ${service.name} details`}>
						<Drawer.Content>
							<Drawer.Header>
								<Drawer.Title>{service.name}</Drawer.Title>
								<Drawer.Description>Current operational detail for this Storybook demonstration.</Drawer.Description>
							</Drawer.Header>
							<Drawer.Body>
								<dl className="ops-detail-list">
									<div>
										<dt>Status</dt>
										<dd>{statusPresentation[service.status].label}</dd>
									</div>
									<div>
										<dt>Owner</dt>
										<dd>{service.owner}</dd>
									</div>
									<div>
										<dt>Availability</dt>
										<dd>{service.availability}</dd>
									</div>
									<div>
										<dt>Next window</dt>
										<dd>{service.window}</dd>
									</div>
								</dl>
							</Drawer.Body>
							<Drawer.Footer>
								<Drawer.Close>Done</Drawer.Close>
							</Drawer.Footer>
						</Drawer.Content>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	);
}

function RetirementConfirmation({ manager }: { manager: ToastManager }) {
	const [open, setOpen] = useState(false);

	return (
		<AlertDialog.Root open={open} onOpenChange={setOpen}>
			<AlertDialog.Trigger>Retire legacy monitor</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Backdrop />
				<AlertDialog.Viewport>
					<AlertDialog.Popup closeLabel="Cancel monitor retirement">
						<AlertDialog.Header>
							<AlertDialog.Title>Retire the legacy monitor?</AlertDialog.Title>
							<AlertDialog.Description>The monitor will stop contributing to this dashboard. Historical activity remains visible.</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Actions>
							<AlertDialog.Close>Keep monitor</AlertDialog.Close>
							<Button
								variant="danger"
								startIcon={<TrashIcon weight="bold" />}
								onClick={() => {
									setOpen(false);
									notify(manager, "warning", "Retirement queued", "The demo monitor was marked for review; no external action was taken.");
								}}
							>
								Retire monitor
							</Button>
						</AlertDialog.Actions>
					</AlertDialog.Popup>
				</AlertDialog.Viewport>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}

function ServiceTable({ records }: { records: readonly ServiceRecord[] }) {
	const [page, setPage] = useState(1);
	const pageSize = 3;
	const pageCount = Math.max(1, Math.ceil(records.length / pageSize));
	const currentPage = Math.min(page, pageCount);
	const visibleRows = records.slice((currentPage - 1) * pageSize, currentPage * pageSize);

	if (records.length === 0) {
		return (
			<EmptyStateComponent
				className="ops-empty-state"
				eyebrow="Service inventory"
				headingLevel={3}
				icon={<WrenchIcon weight="regular" />}
				title="No services match this view"
				description="Adjust the search, region, or status filter to restore service records."
			/>
		);
	}

	return (
		<>
			<DataTableRegion label="Service health records" className="ops-table-region">
				<Table>
					<TableCaption>Service health, ownership, latency, and scheduled maintenance windows</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Service</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Region</TableHead>
							<TableHead textAlign="end">Availability</TableHead>
							<TableHead textAlign="end">P95 latency</TableHead>
							<TableHead>Next window</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{visibleRows.map(service => {
							const presentation = statusPresentation[service.status];

							return (
								<TableRow key={service.id}>
									<TableHead scope="row">
										<span className="ops-service-name">{service.name}</span>
										<span className="ops-service-owner">{service.owner}</span>
									</TableHead>
									<TableCell>
										<Badge size="sm" variant={presentation.variant}>
											{presentation.label}
										</Badge>
									</TableCell>
									<TableCell>{regionOptions.find(option => option.value === service.region)?.label}</TableCell>
									<TableCell numeric textAlign="end">
										{service.availability}
									</TableCell>
									<TableCell numeric textAlign="end">
										{service.latency}
									</TableCell>
									<TableCell>{service.window}</TableCell>
									<TableCell>
										<ServiceDrawer service={service} />
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</DataTableRegion>
			<div className="ops-table-footer">
				<p>
					Page {currentPage} of {pageCount}
				</p>
				<Pagination label="Service table pages">
					<PaginationList>
						<PaginationItem>
							<PaginationPrevious
								disabled={currentPage === 1}
								href="#ops-services"
								onClick={event => {
									event.preventDefault();
									setPage(current => Math.max(1, current - 1));
								}}
							/>
						</PaginationItem>
						{Array.from({ length: pageCount }, (_, index) => index + 1).map(pageNumber => (
							<PaginationItem key={pageNumber}>
								<PaginationButton current={currentPage === pageNumber} onClick={() => setPage(pageNumber)} aria-label={`Page ${pageNumber}`}>
									{pageNumber}
								</PaginationButton>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								disabled={currentPage === pageCount}
								href="#ops-services"
								onClick={event => {
									event.preventDefault();
									setPage(current => Math.min(pageCount, current + 1));
								}}
							/>
						</PaginationItem>
					</PaginationList>
				</Pagination>
			</div>
		</>
	);
}

function ActivityFeed({ manager }: { manager: ToastManager }) {
	return (
		<section className="ops-panel ops-activity" aria-labelledby="ops-activity-title">
			<div className="ops-section-header">
				<div>
					<h2 id="ops-activity-title">Recent activity</h2>
					<p>Auditable operational events from the current review period.</p>
				</div>
				<Button
					size="sm"
					variant="secondary"
					startIcon={<DownloadSimpleIcon weight="bold" />}
					onClick={() => notify(manager, "info", "Activity export prepared", "This demonstration created no external file or network request.")}
				>
					Export log
				</Button>
			</div>
			<ScrollArea className="ops-scroll-area">
				<ScrollAreaViewport aria-label="Recent operational activity" role="region">
					<ScrollAreaContent>
						<Collection density="comfortable">
							{activities.map(activity => (
								<CollectionItem key={activity.id}>
									<CollectionContent>
										<CollectionHeading>{activity.title}</CollectionHeading>
										<CollectionDescription>{activity.description}</CollectionDescription>
									</CollectionContent>
									<CollectionMeta>
										<Badge size="sm" variant={activity.status}>
											{activity.meta}
										</Badge>
									</CollectionMeta>
									<CollectionActions aria-hidden="true">
										<CaretRightIcon weight="bold" />
									</CollectionActions>
								</CollectionItem>
							))}
						</Collection>
					</ScrollAreaContent>
				</ScrollAreaViewport>
				<ScrollAreaScrollbar>
					<ScrollAreaThumb />
				</ScrollAreaScrollbar>
			</ScrollArea>
		</section>
	);
}

function RunbookPanel({ manager }: { manager: ToastManager }) {
	return (
		<section className="ops-panel" aria-labelledby="ops-runbook-title">
			<div className="ops-section-header">
				<div>
					<h2 id="ops-runbook-title">Response runbook</h2>
					<p>Review the established response sequence before changing service state.</p>
				</div>
			</div>
			<Accordion.Root defaultValue={["triage"]}>
				<Accordion.Item value="triage">
					<Accordion.Header>
						<Accordion.Trigger>Triage a degraded service</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Panel>Confirm the active region, compare current p95 latency with the previous interval, and assign an incident owner before mitigation.</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value="maintenance">
					<Accordion.Header>
						<Accordion.Trigger>Start a maintenance window</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Panel>Verify approval, post a customer-facing notice where required, and preserve a rollback path for the duration of the window.</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value="handoff">
					<Accordion.Header>
						<Accordion.Trigger>Transfer on-call ownership</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Panel>Record the receiving team, outstanding risks, and next checkpoint. The consuming product owns the actual handoff process.</Accordion.Panel>
				</Accordion.Item>
			</Accordion.Root>
			<div className="ops-runbook-actions">
				<RetirementConfirmation manager={manager} />
			</div>
		</section>
	);
}

interface OperationsWorkspaceProps {
	empty?: boolean;
	initialSaved?: boolean;
	layout?: "wide" | "narrow";
}

function OperationsWorkspace({ empty = false, initialSaved = false, layout = "wide" }: OperationsWorkspaceProps) {
	const manager = useMemo(() => createToastManager(), []);
	const [query, setQuery] = useState("");
	const [region, setRegion] = useState<Region>("all");
	const [status, setStatus] = useState<StatusFilter>("all");
	const [range, setRange] = useState(defaultRange);
	const [saved, setSaved] = useState(initialSaved);
	const [refreshing, setRefreshing] = useState(false);

	const filteredServices = useMemo(() => {
		if (empty) return [];
		const normalizedQuery = query.trim().toLocaleLowerCase();

		return services.filter(service => {
			const matchesQuery = normalizedQuery.length === 0 || `${service.name} ${service.owner}`.toLocaleLowerCase().includes(normalizedQuery);
			const matchesRegion = region === "all" || service.region === region;
			const matchesStatus = status === "all" || service.status !== "healthy";
			return matchesQuery && matchesRegion && matchesStatus;
		});
	}, [empty, query, region, status]);

	const handleRefresh = () => {
		setRefreshing(true);
		window.setTimeout(() => {
			setRefreshing(false);
			notify(manager, "success", "Workspace refreshed", "Local demonstration data is up to date.");
		}, 650);
	};

	return (
		<ToastProvider toastManager={manager} timeout={7000}>
			<div className="ops-workspace" data-layout={layout}>
				<a className="ops-skip-link" href="#ops-main">
					Skip to operations content
				</a>
				<Header className="ops-header">
					<HeaderRail>
						<HeaderBrand href="#ops-main">LYDS Control</HeaderBrand>
						<HeaderNav label="Workspace sections">
							<a href="#ops-summary">Summary</a>
							<a href="#ops-services">Services</a>
							<a href="#ops-runbook-title">Runbook</a>
						</HeaderNav>
						<HeaderActions>
							<HeaderStatus>
								<Badge size="sm" variant="success">
									All regions connected
								</Badge>
							</HeaderStatus>
							<IconButton
								aria-label="Show notification summary"
								size="sm"
								variant="quiet"
								onClick={() => notify(manager, "info", "Notification summary", "Two service changes require review before the next window.")}
							>
								<BellIcon weight="bold" />
							</IconButton>
							<ChangeDialog manager={manager} onSaved={() => setSaved(true)} />
						</HeaderActions>
					</HeaderRail>
				</Header>

				<main className="ops-main" id="ops-main" tabIndex={-1}>
					<Breadcrumb label="Operations location">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="#ops-main">Operations</BreadcrumbLink>
								<BreadcrumbSeparator />
							</BreadcrumbItem>
							<BreadcrumbItem>
								<BreadcrumbPage>Service overview</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<section className="ops-hero" aria-labelledby="ops-title">
						<div>
							<p className="ops-eyebrow">Tuesday, September 1</p>
							<h1 id="ops-title">Service operations overview</h1>
							<p>Monitor system health, coordinate change windows, and review operational activity from one accessible workspace.</p>
						</div>
						<div className="ops-hero-actions">
							<Button
								variant="secondary"
								startIcon={<DownloadSimpleIcon weight="bold" />}
								onClick={() => notify(manager, "info", "Report prepared", "This demonstration created no external file or network request.")}
							>
								Export report
							</Button>
							<Button loading={refreshing} onClick={handleRefresh} startIcon={<ArrowClockwiseIcon weight="bold" />}>
								Refresh status
							</Button>
						</div>
					</section>

					{saved ? (
						<Banner status="success" live={initialSaved ? "off" : "polite"}>
							The service change is saved locally and ready for review. No deployment has been started.
						</Banner>
					) : (
						<Banner status="warning">Checkout API latency is above the review threshold. Customer requests remain available while the team investigates.</Banner>
					)}

					<section id="ops-summary" aria-labelledby="ops-summary-title">
						<div className="ops-section-header">
							<div>
								<h2 id="ops-summary-title">Fleet summary</h2>
								<p>Current service indicators for the selected operating period.</p>
							</div>
							<Badge variant="neutral">Updated 14:32</Badge>
						</div>
						<div className="ops-kpi-grid">
							<Card variant="material" size="sm">
								<CardHeader>
									<CardTitle>Available services</CardTitle>
									<CardDescription>Healthy across every monitored region</CardDescription>
								</CardHeader>
								<CardBody>
									<strong className="ops-kpi-value">18</strong>
									<span className="ops-kpi-unit">of 20 services</span>
								</CardBody>
								<CardFooter>
									<Progress label="Healthy services" value={90} status="success" />
								</CardFooter>
							</Card>
							<Card variant="material" size="sm">
								<CardHeader>
									<CardTitle>Error budget</CardTitle>
									<CardDescription>Monthly budget remaining</CardDescription>
								</CardHeader>
								<CardBody>
									<strong className="ops-kpi-value">72%</strong>
									<span className="ops-kpi-unit">11 days remaining</span>
								</CardBody>
								<CardFooter>
									<Meter label="Budget remaining" value={72} min={0} max={100} status="success" />
								</CardFooter>
							</Card>
							<Card variant="material" size="sm">
								<CardHeader>
									<CardTitle>Change completion</CardTitle>
									<CardDescription>Current scheduled maintenance</CardDescription>
								</CardHeader>
								<CardBody>
									<strong className="ops-kpi-value">68%</strong>
									<span className="ops-kpi-unit">Catalog reindex</span>
								</CardBody>
								<CardFooter>
									<Progress label="Catalog reindex progress" value={68} status="info" />
								</CardFooter>
							</Card>
							<Card variant="material" size="sm">
								<CardHeader>
									<CardTitle>Open incidents</CardTitle>
									<CardDescription>Items requiring operator attention</CardDescription>
								</CardHeader>
								<CardBody>
									<strong className="ops-kpi-value">02</strong>
									<span className="ops-kpi-unit">No critical incidents</span>
								</CardBody>
								<CardFooter>
									<Badge variant="warning">Review needed</Badge>
								</CardFooter>
							</Card>
						</div>
					</section>

					<section className="ops-filter-panel" aria-labelledby="ops-filter-title">
						<div className="ops-section-header">
							<div>
								<h2 id="ops-filter-title">Review scope</h2>
								<p>Filters are local to this demonstration and do not change external data.</p>
							</div>
							<GearIcon aria-hidden="true" className="ops-section-icon" weight="regular" />
						</div>
						<div className="ops-filter-grid">
							<SearchField label="Search services" placeholder="Service or owner" value={query} onValueChange={value => setQuery(value)} />
							<div className="ops-field-group">
								<span className="ops-field-label" id="ops-region-label">
									Region
								</span>
								<Select aria-labelledby="ops-region-label" onValueChange={value => value !== null && setRegion(value)} options={regionOptions} value={region} />
							</div>
							<DateRangePicker label="Review period" locale="en-GB" firstDayOfWeek="mon" value={range} onValueChange={value => value !== null && setRange(value)} />
							<div className="ops-field-group">
								<span className="ops-field-label" id="ops-health-label">
									Health state
								</span>
								<SegmentedControl aria-labelledby="ops-health-label" onValueChange={value => value !== null && setStatus(value)} value={status}>
									<SegmentedControlItem value="all">All</SegmentedControlItem>
									<SegmentedControlItem value="attention">Needs attention</SegmentedControlItem>
								</SegmentedControl>
							</div>
						</div>
						<p className="ops-filter-summary">
							Reviewing {range.start.toString()} through {range.end.toString()} · {filteredServices.length} matching services
						</p>
					</section>

					<Tabs.Root defaultValue="services" className="ops-tabs">
						<Tabs.List aria-label="Operations views">
							<Tabs.Tab value="services">Services</Tabs.Tab>
							<Tabs.Tab value="activity">Activity</Tabs.Tab>
							<Tabs.Tab value="runbook">Runbook</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value="services">
							<DataTable id="ops-services">
								<DataTableHeader>
									<div>
										<DataTableTitle>Service health</DataTableTitle>
										<DataTableDescription>Presentation-only operational records. Products remain responsible for data loading, sorting, and policy.</DataTableDescription>
									</div>
									<DataTableStatus aria-live="polite" aria-atomic="true">
										{filteredServices.length} services in view
									</DataTableStatus>
								</DataTableHeader>
								<ServiceTable records={filteredServices} />
							</DataTable>
						</Tabs.Panel>
						<Tabs.Panel value="activity">
							<ActivityFeed manager={manager} />
						</Tabs.Panel>
						<Tabs.Panel value="runbook">
							<RunbookPanel manager={manager} />
						</Tabs.Panel>
					</Tabs.Root>

					<div className="ops-secondary-grid">
						<section className="ops-panel" aria-labelledby="ops-attention-title">
							<div className="ops-section-header">
								<div>
									<h2 id="ops-attention-title">Attention queue</h2>
									<p>Two conditions should be reviewed during this shift.</p>
								</div>
								<WarningIcon aria-hidden="true" className="ops-section-icon" weight="regular" />
							</div>
							<Collection density="compact">
								<CollectionItem>
									<CollectionContent>
										<CollectionHeading>Checkout API latency</CollectionHeading>
										<CollectionDescription>Confirm regional impact before the next checkpoint.</CollectionDescription>
									</CollectionContent>
									<CollectionMeta>15:00</CollectionMeta>
								</CollectionItem>
								<CollectionItem>
									<CollectionContent>
										<CollectionHeading>Notification relay backlog</CollectionHeading>
										<CollectionDescription>Review delivery age after the current traffic shift.</CollectionDescription>
									</CollectionContent>
									<CollectionMeta>15:20</CollectionMeta>
								</CollectionItem>
							</Collection>
						</section>
						<section className="ops-panel" aria-labelledby="ops-quick-title">
							<div className="ops-section-header">
								<div>
									<h2 id="ops-quick-title">Quick actions</h2>
									<p>Common actions remain explicit, named, and reversible in this demo.</p>
								</div>
							</div>
							<div className="ops-quick-actions">
								<Button
									variant="secondary"
									startIcon={<PlusIcon weight="bold" />}
									onClick={() => {
										setSaved(false);
										notify(manager, "info", "Draft created", "A local draft state is ready; no external record was created.");
									}}
								>
									Create draft
								</Button>
								<Button
									variant="quiet"
									startIcon={<CheckCircleIcon weight="bold" />}
									onClick={() => notify(manager, "success", "Queue acknowledged", "The local attention queue has been acknowledged for this review.")}
								>
									Acknowledge queue
								</Button>
							</div>
						</section>
					</div>
				</main>

				<footer className="ops-footer">
					<span>LYDS service operations demonstration</span>
					<span>No network, routing, persistence, or analytics behavior</span>
				</footer>
			</div>
		</ToastProvider>
	);
}

export const InteractiveOverview: Story = {
	render: () => <OperationsWorkspace />
};

export const DarkTheme: Story = {
	globals: { theme: "dark" },
	render: () => <OperationsWorkspace />
};

export const NarrowContent: Story = {
	parameters: {
		viewport: { defaultViewport: "mobile2" }
	},
	render: () => <OperationsWorkspace layout="narrow" />
};

export const SavedState: Story = {
	render: () => <OperationsWorkspace initialSaved />
};

export const EmptyState: Story = {
	render: () => <OperationsWorkspace empty />
};
