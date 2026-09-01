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
		name: "邊緣閘道",
		owner: "流量平台",
		region: "asia",
		status: "healthy",
		availability: "99.99%",
		latency: "42 ms",
		window: "9 月 4 日 21:30"
	},
	{
		id: "checkout",
		name: "結帳 API",
		owner: "商務核心",
		region: "europe",
		status: "degraded",
		availability: "99.91%",
		latency: "186 ms",
		window: "9 月 5 日 01:00"
	},
	{
		id: "identity",
		name: "身分驗證服務",
		owner: "信任服務",
		region: "americas",
		status: "healthy",
		availability: "99.98%",
		latency: "64 ms",
		window: "9 月 6 日 23:00"
	},
	{
		id: "catalog",
		name: "商品目錄索引",
		owner: "搜尋服務",
		region: "asia",
		status: "maintenance",
		availability: "99.94%",
		latency: "71 ms",
		window: "進行中"
	},
	{
		id: "ledger",
		name: "付款帳務",
		owner: "財務系統",
		region: "europe",
		status: "healthy",
		availability: "100.00%",
		latency: "53 ms",
		window: "9 月 8 日 20:00"
	},
	{
		id: "notifications",
		name: "通知轉送服務",
		owner: "訊息服務",
		region: "americas",
		status: "degraded",
		availability: "99.87%",
		latency: "214 ms",
		window: "9 月 9 日 00:30"
	}
] as const;

const activities = [
	{
		id: "activity-1",
		title: "流量切換完成",
		description: "亞太地區的邊緣閘道已切換至 100% 流量。",
		meta: "12 分鐘前",
		status: "success" as const
	},
	{
		id: "activity-2",
		title: "延遲超過門檻",
		description: "結帳 API 的 P95 延遲超過審核門檻。",
		meta: "28 分鐘前",
		status: "warning" as const
	},
	{
		id: "activity-3",
		title: "維護已開始",
		description: "商品目錄索引已進入核准的維護時段。",
		meta: "41 分鐘前",
		status: "neutral" as const
	},
	{
		id: "activity-4",
		title: "處理流程已確認",
		description: "值班工作已移交給商務團隊。",
		meta: "1 小時前",
		status: "neutral" as const
	},
	{
		id: "activity-5",
		title: "變更時段已核准",
		description: "付款帳務升級可在預定時段執行。",
		meta: "2 小時前",
		status: "success" as const
	}
] as const;

const regionOptions = [
	{ value: "all", label: "所有地區" },
	{ value: "asia", label: "亞太地區" },
	{ value: "europe", label: "歐洲" },
	{ value: "americas", label: "美洲" }
] as const;

const priorityOptions = [
	{ value: "standard", label: "一般變更", description: "依一般流程審核與通知" },
	{ value: "urgent", label: "緊急變更", description: "需要填寫事件編號" }
] as const;

const statusPresentation: Record<ServiceStatus, { label: string; variant: "success" | "warning" | "neutral" }> = {
	healthy: { label: "正常", variant: "success" },
	degraded: { label: "異常", variant: "warning" },
	maintenance: { label: "維護中", variant: "neutral" }
};

const defaultRange = {
	start: new CalendarDate(2026, 9, 1),
	end: new CalendarDate(2026, 9, 7)
};

const meta = {
	title: "使用範例/服務管理頁面",
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
	const [title, setTitle] = useState("降低結帳服務延遲");
	const [priority, setPriority] = useState("standard");

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setOpen(false);
		onSaved();
		notify(manager, "success", "變更已儲存", `${title}已可進行審核。`);
	};

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger>新增變更</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Backdrop />
				<Dialog.Viewport>
					<Dialog.Popup closeLabel="關閉變更表單">
						<Dialog.Header>
							<Dialog.Title>新增服務變更</Dialog.Title>
							<Dialog.Description>填寫服務變更內容。</Dialog.Description>
						</Dialog.Header>
						<form onSubmit={handleSubmit}>
							<Dialog.Body>
								<div className="ops-form-stack">
									<TextField label="變更標題" name="changeTitle" required value={title} onValueChange={setTitle} />
									<div className="ops-field-group">
										<span className="ops-field-label" id="ops-priority-label">
											審核優先順序
										</span>
										<Select aria-labelledby="ops-priority-label" name="priority" onValueChange={value => value !== null && setPriority(value)} options={priorityOptions} value={priority} />
									</div>
									<TextView label="審核備註" name="reviewNote" rows={4} defaultValue="關閉變更前，確認結帳服務延遲已恢復正常。" />
								</div>
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.Close>取消</Dialog.Close>
								<Button type="submit" startIcon={<CheckCircleIcon weight="bold" />}>
									儲存變更
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
			<Drawer.Trigger aria-label={`查看${service.name}`}>查看</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup closeLabel={`關閉${service.name}詳細資料`}>
						<Drawer.Content>
							<Drawer.Header>
								<Drawer.Title>{service.name}</Drawer.Title>
								<Drawer.Description>目前的服務狀態與維護資訊。</Drawer.Description>
							</Drawer.Header>
							<Drawer.Body>
								<dl className="ops-detail-list">
									<div>
										<dt>狀態</dt>
										<dd>{statusPresentation[service.status].label}</dd>
									</div>
									<div>
										<dt>負責團隊</dt>
										<dd>{service.owner}</dd>
									</div>
									<div>
										<dt>可用率</dt>
										<dd>{service.availability}</dd>
									</div>
									<div>
										<dt>下次維護時段</dt>
										<dd>{service.window}</dd>
									</div>
								</dl>
							</Drawer.Body>
							<Drawer.Footer>
								<Drawer.Close>完成</Drawer.Close>
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
			<AlertDialog.Trigger>停用舊版監測</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Backdrop />
				<AlertDialog.Viewport>
					<AlertDialog.Popup closeLabel="取消停用監測">
						<AlertDialog.Header>
							<AlertDialog.Title>停用舊版監測？</AlertDialog.Title>
							<AlertDialog.Description>停用後不再顯示新資料，歷史紀錄仍會保留。</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Actions>
							<AlertDialog.Close>保留監測</AlertDialog.Close>
							<Button
								variant="danger"
								startIcon={<TrashIcon weight="bold" />}
								onClick={() => {
									setOpen(false);
									notify(manager, "warning", "已提出停用申請", "監測項目已標記為待審核。");
								}}
							>
								停用監測
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
		return <EmptyStateComponent className="ops-empty-state" headingLevel={3} icon={<WrenchIcon weight="regular" />} title="沒有符合條件的服務" description="請調整搜尋、地區或狀態條件。" />;
	}

	return (
		<>
			<DataTableRegion label="服務狀態資料" className="ops-table-region">
				<Table>
					<TableCaption>服務狀態、負責團隊、延遲與維護時段</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>服務</TableHead>
							<TableHead>狀態</TableHead>
							<TableHead>地區</TableHead>
							<TableHead textAlign="end">可用率</TableHead>
							<TableHead textAlign="end">P95 延遲</TableHead>
							<TableHead>下次維護時段</TableHead>
							<TableHead>操作</TableHead>
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
					第 {currentPage}／{pageCount} 頁
				</p>
				<Pagination label="服務列表分頁">
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
								<PaginationButton current={currentPage === pageNumber} onClick={() => setPage(pageNumber)} aria-label={`第 ${pageNumber} 頁`}>
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
					<h2 id="ops-activity-title">最近活動</h2>
					<p>目前期間內的服務操作紀錄。</p>
				</div>
				<Button size="sm" variant="secondary" startIcon={<DownloadSimpleIcon weight="bold" />} onClick={() => notify(manager, "info", "活動紀錄已可匯出", "活動紀錄已可下載。")}>
					匯出紀錄
				</Button>
			</div>
			<ScrollArea className="ops-scroll-area">
				<ScrollAreaViewport aria-label="最近的服務活動" role="region">
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
					<h2 id="ops-runbook-title">事件處理流程</h2>
					<p>變更服務狀態前，請先確認處理步驟。</p>
				</div>
			</div>
			<Accordion.Root defaultValue={["triage"]}>
				<Accordion.Item value="triage">
					<Accordion.Header>
						<Accordion.Trigger>處理異常服務</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Panel>確認受影響地區與目前 P95 延遲，並指定事件負責人。</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value="maintenance">
					<Accordion.Header>
						<Accordion.Trigger>開始維護</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Panel>確認核准狀態、公告內容與還原方式。</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value="handoff">
					<Accordion.Header>
						<Accordion.Trigger>移交值班工作</Accordion.Trigger>
					</Accordion.Header>
					<Accordion.Panel>記錄接手團隊、未處理風險與下次確認時間。</Accordion.Panel>
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
			notify(manager, "success", "資料已更新", "服務資料已更新。");
		}, 650);
	};

	return (
		<ToastProvider toastManager={manager} timeout={7000}>
			<div className="ops-workspace" data-layout={layout}>
				<a className="ops-skip-link" href="#ops-main">
					跳至主要內容
				</a>
				<Header className="ops-header">
					<HeaderRail>
						<HeaderBrand href="#ops-main">Linyao Design System</HeaderBrand>
						<HeaderNav label="頁面區段">
							<a href="#ops-summary">摘要</a>
							<a href="#ops-services">服務</a>
							<a href="#ops-runbook-title">處理流程</a>
						</HeaderNav>
						<HeaderActions>
							<HeaderStatus>
								<Badge size="sm" variant="success">
									所有地區連線正常
								</Badge>
							</HeaderStatus>
							<IconButton aria-label="顯示通知摘要" size="sm" variant="quiet" onClick={() => notify(manager, "info", "通知摘要", "有兩項服務變更需要審核。")}>
								<BellIcon weight="bold" />
							</IconButton>
							<ChangeDialog manager={manager} onSaved={() => setSaved(true)} />
						</HeaderActions>
					</HeaderRail>
				</Header>

				<main className="ops-main" id="ops-main" tabIndex={-1}>
					<Breadcrumb label="目前位置">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="#ops-main">服務管理</BreadcrumbLink>
								<BreadcrumbSeparator />
							</BreadcrumbItem>
							<BreadcrumbItem>
								<BreadcrumbPage>服務總覽</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>

					<section className="ops-hero" aria-labelledby="ops-title">
						<div>
							<p className="ops-eyebrow">9 月 1 日，星期二</p>
							<h1 id="ops-title">服務總覽</h1>
							<p>查看服務狀態、維護時段與最近活動。</p>
						</div>
						<div className="ops-hero-actions">
							<Button variant="secondary" startIcon={<DownloadSimpleIcon weight="bold" />} onClick={() => notify(manager, "info", "報告已可匯出", "服務狀態報告已可下載。")}>
								匯出報告
							</Button>
							<Button loading={refreshing} onClick={handleRefresh} startIcon={<ArrowClockwiseIcon weight="bold" />}>
								更新狀態
							</Button>
						</div>
					</section>

					{saved ? (
						<Banner status="success" live={initialSaved ? "off" : "polite"}>
							服務變更已儲存，尚未開始部署。
						</Banner>
					) : (
						<Banner status="warning">結帳 API 延遲超過審核門檻，服務仍可正常使用。</Banner>
					)}

					<section id="ops-summary" aria-labelledby="ops-summary-title">
						<div className="ops-section-header">
							<div>
								<h2 id="ops-summary-title">服務摘要</h2>
								<p>所選期間的服務指標。</p>
							</div>
							<Badge variant="neutral">14:32 更新</Badge>
						</div>
						<div className="ops-kpi-grid">
							<Card variant="material" size="sm">
								<CardHeader>
									<CardTitle>正常服務</CardTitle>
									<CardDescription>所有監測地區</CardDescription>
								</CardHeader>
								<CardBody>
									<strong className="ops-kpi-value">18</strong>
									<span className="ops-kpi-unit">共 20 項服務</span>
								</CardBody>
								<CardFooter>
									<Progress label="正常服務" value={90} status="success" />
								</CardFooter>
							</Card>
							<Card variant="material" size="sm">
								<CardHeader>
									<CardTitle>錯誤預算</CardTitle>
									<CardDescription>本月剩餘比例</CardDescription>
								</CardHeader>
								<CardBody>
									<strong className="ops-kpi-value">72%</strong>
									<span className="ops-kpi-unit">剩餘 11 天</span>
								</CardBody>
								<CardFooter>
									<Meter label="剩餘錯誤預算" value={72} min={0} max={100} status="success" />
								</CardFooter>
							</Card>
							<Card variant="material" size="sm">
								<CardHeader>
									<CardTitle>變更進度</CardTitle>
									<CardDescription>目前排定的維護作業</CardDescription>
								</CardHeader>
								<CardBody>
									<strong className="ops-kpi-value">68%</strong>
									<span className="ops-kpi-unit">重建商品目錄索引</span>
								</CardBody>
								<CardFooter>
									<Progress label="重建商品目錄索引進度" value={68} status="info" />
								</CardFooter>
							</Card>
							<Card variant="material" size="sm">
								<CardHeader>
									<CardTitle>未結事件</CardTitle>
									<CardDescription>需要處理的事件</CardDescription>
								</CardHeader>
								<CardBody>
									<strong className="ops-kpi-value">02</strong>
									<span className="ops-kpi-unit">沒有嚴重事件</span>
								</CardBody>
								<CardFooter>
									<Badge variant="warning">需要審核</Badge>
								</CardFooter>
							</Card>
						</div>
					</section>

					<section className="ops-filter-panel" aria-labelledby="ops-filter-title">
						<div className="ops-section-header">
							<div>
								<h2 id="ops-filter-title">篩選條件</h2>
								<p>依服務、地區、日期與狀態篩選。</p>
							</div>
							<GearIcon aria-hidden="true" className="ops-section-icon" weight="regular" />
						</div>
						<div className="ops-filter-grid">
							<SearchField label="搜尋服務" placeholder="服務或負責團隊" value={query} onValueChange={value => setQuery(value)} />
							<div className="ops-field-group">
								<span className="ops-field-label" id="ops-region-label">
									地區
								</span>
								<Select aria-labelledby="ops-region-label" onValueChange={value => value !== null && setRegion(value)} options={regionOptions} value={region} />
							</div>
							<DateRangePicker label="查詢期間" locale="en-GB" firstDayOfWeek="mon" value={range} onValueChange={value => value !== null && setRange(value)} />
							<div className="ops-field-group">
								<span className="ops-field-label" id="ops-health-label">
									服務狀態
								</span>
								<SegmentedControl aria-labelledby="ops-health-label" onValueChange={value => value !== null && setStatus(value)} value={status}>
									<SegmentedControlItem value="all">全部</SegmentedControlItem>
									<SegmentedControlItem value="attention">需要處理</SegmentedControlItem>
								</SegmentedControl>
							</div>
						</div>
						<p className="ops-filter-summary">
							查詢期間：{range.start.toString()} 至 {range.end.toString()} · 共 {filteredServices.length} 項服務
						</p>
					</section>

					<Tabs.Root defaultValue="services" className="ops-tabs">
						<Tabs.List aria-label="服務管理內容">
							<Tabs.Tab value="services">服務</Tabs.Tab>
							<Tabs.Tab value="activity">活動</Tabs.Tab>
							<Tabs.Tab value="runbook">處理流程</Tabs.Tab>
						</Tabs.List>
						<Tabs.Panel value="services">
							<DataTable id="ops-services">
								<DataTableHeader>
									<div>
										<DataTableTitle>服務狀態</DataTableTitle>
										<DataTableDescription>顯示服務狀態、地區、可用率與延遲。</DataTableDescription>
									</div>
									<DataTableStatus aria-live="polite" aria-atomic="true">
										顯示 {filteredServices.length} 項服務
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
									<h2 id="ops-attention-title">待處理項目</h2>
									<p>目前有兩項內容需要確認。</p>
								</div>
								<WarningIcon aria-hidden="true" className="ops-section-icon" weight="regular" />
							</div>
							<Collection density="compact">
								<CollectionItem>
									<CollectionContent>
										<CollectionHeading>結帳 API 延遲</CollectionHeading>
										<CollectionDescription>下次確認前，檢查各地區受影響範圍。</CollectionDescription>
									</CollectionContent>
									<CollectionMeta>15:00</CollectionMeta>
								</CollectionItem>
								<CollectionItem>
									<CollectionContent>
										<CollectionHeading>通知轉送服務積壓</CollectionHeading>
										<CollectionDescription>目前流量切換後，檢查訊息延遲時間。</CollectionDescription>
									</CollectionContent>
									<CollectionMeta>15:20</CollectionMeta>
								</CollectionItem>
							</Collection>
						</section>
						<section className="ops-panel" aria-labelledby="ops-quick-title">
							<div className="ops-section-header">
								<div>
									<h2 id="ops-quick-title">常用操作</h2>
									<p>建立草稿或確認待處理項目。</p>
								</div>
							</div>
							<div className="ops-quick-actions">
								<Button
									variant="secondary"
									startIcon={<PlusIcon weight="bold" />}
									onClick={() => {
										setSaved(false);
										notify(manager, "info", "草稿已建立", "草稿已可編輯。");
									}}
								>
									建立草稿
								</Button>
								<Button variant="quiet" startIcon={<CheckCircleIcon weight="bold" />} onClick={() => notify(manager, "success", "已確認待處理項目", "待處理項目已更新。")}>
									確認待處理項目
								</Button>
							</div>
						</section>
					</div>
				</main>

				<footer className="ops-footer">
					<span>以 Linyao Design System 元件建立</span>
				</footer>
			</div>
		</ToastProvider>
	);
}

export const InteractiveOverview: Story = {
	name: "完整頁面",
	render: () => <OperationsWorkspace />
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => <OperationsWorkspace />
};

export const NarrowContent: Story = {
	name: "窄版頁面",
	parameters: {
		viewport: { defaultViewport: "mobile2" }
	},
	render: () => <OperationsWorkspace layout="narrow" />
};

export const SavedState: Story = {
	name: "已儲存",
	render: () => <OperationsWorkspace initialSaved />
};

export const EmptyState: Story = {
	name: "空白狀態",
	render: () => <OperationsWorkspace empty />
};
