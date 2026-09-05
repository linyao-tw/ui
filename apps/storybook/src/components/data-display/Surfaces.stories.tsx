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
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@linyao.tw/ui";
import { CaretRightIcon } from "@phosphor-icons/react/dist/csr/CaretRight";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "@/components/story-layout.css";

const meta = {
	title: "元件/資料顯示/卡片與清單",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cards: Story = {
	name: "卡片",
	render: () => (
		<div className="lyds-story-grid">
			<Card variant="material">
				<CardHeader>
					<Badge size="sm" variant="success">
						使用中
					</Badge>
					<CardTitle>團隊工作區</CardTitle>
					<CardDescription>團隊的計畫、檔案與專案更新。</CardDescription>
				</CardHeader>
				<CardBody className="lyds-story-readout">12 位成員 · 24 筆近期更新</CardBody>
				<CardFooter>
					<Button size="sm" variant="secondary">
						開啟工作區
					</Button>
				</CardFooter>
			</Card>
			<CloudBox>
				<CardHeader>
					<CardTitle>共用封存</CardTitle>
					<CardDescription>共用檔案的封存空間。</CardDescription>
				</CardHeader>
				<CardBody>本週新增 17 個檔案。</CardBody>
			</CloudBox>
		</div>
	)
};

export const ListCells: Story = {
	name: "清單項目",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<SectionHeading annotation="3 個可用" description="依更新時間排序。" action={<Badge variant="success">目前</Badge>}>
				最近的工作區
			</SectionHeading>
			<div className="lyds-story-list">
				<ListCell
					leading={<Avatar alt="設計團隊" fallback="設" status="online" statusLabel="上線" />}
					title="設計團隊"
					description="12 位成員"
					metadata="今天更新"
					trailing={<CaretRightIcon aria-hidden weight="bold" />}
				/>
				<ListCell
					action={{ href: "#research", "aria-label": "開啟研究工作區詳細資料" }}
					leading={<Avatar alt="研究工作區" fallback="研" />}
					title="名稱較長的使用者研究工作區"
					description="私人工作區 · 8 位成員"
					metadata="昨天"
					trailing={<CaretRightIcon aria-hidden weight="bold" />}
				/>
				<ListCell disabled leading={<Avatar alt="已封存工作區" fallback="封" status="offline" statusLabel="已封存" />} title="已封存工作區" description="唯讀" metadata="已封存" />
			</div>
		</div>
	)
};

export const CollectionPrimitives: Story = {
	name: "集合",
	render: () => (
		<Collection density="comfortable" className="lyds-story-stack--narrow">
			{[
				["design", "設計規劃", "共用工作區", "今天更新"],
				["research", "使用者研究", "私人工作區", "8 位成員"],
				["archive", "專案封存", "唯讀工作區", "17 個檔案"]
			].map(([key, label, description, status]) => (
				<CollectionItem key={key}>
					<CollectionContent>
						<CollectionHeading>{label}</CollectionHeading>
						<CollectionDescription>{description}</CollectionDescription>
					</CollectionContent>
					<CollectionMeta className="lyds-story-readout">{status}</CollectionMeta>
					<CollectionActions>
						<CaretRightIcon aria-hidden weight="bold" />
					</CollectionActions>
				</CollectionItem>
			))}
		</Collection>
	)
};

export const ScrollableCollection: Story = {
	name: "可捲動清單",
	render: () => (
		<ScrollArea className="lyds-story-scroll-area lyds-story-stack--narrow">
			<ScrollAreaViewport aria-label="文件" role="region">
				<ScrollAreaContent className="lyds-story-scroll-content">
					{Array.from({ length: 10 }, (_, index) => (
						<ListCell key={index} title={`文件 ${index + 1}`} description="共用文件" metadata={`${index + 1} 天前`} />
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
	name: "資料表格",
	render: () => (
		<DataTable>
			<DataTableHeader>
				<div>
					<DataTableTitle>工作區成員</DataTableTitle>
					<DataTableDescription>成員與存取權限。</DataTableDescription>
				</div>
				<DataTableStatus className="lyds-story-readout">14:32 更新</DataTableStatus>
			</DataTableHeader>
			<DataTableRegion label="工作區成員紀錄" className="lyds-story-table-wrap">
				<Table>
					<TableCaption>目前成員與存取權限</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>姓名</TableHead>
							<TableHead>電子郵件</TableHead>
							<TableHead>角色</TableHead>
							<TableHead textAlign="end">最近活動</TableHead>
							<TableHead>狀態</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>陳柏宇</TableCell>
							<TableCell>alex@example.com</TableCell>
							<TableCell>編輯者</TableCell>
							<TableCell textAlign="end">今天</TableCell>
							<TableCell>
								<Badge size="sm" variant="success">
									使用中
								</Badge>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>林怡君</TableCell>
							<TableCell>mina@example.com</TableCell>
							<TableCell>檢視者</TableCell>
							<TableCell textAlign="end">3 天前</TableCell>
							<TableCell>
								<Badge size="sm" variant="warning">
									已邀請
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
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => (
		<Card variant="material" className="lyds-story-stack lyds-story-stack--narrow">
			<SectionHeading annotation="深色主題">工作區摘要</SectionHeading>
			<ListCell title="設計團隊" description="12 位成員" metadata="今天更新" />
		</Card>
	)
};
