import { Alert, AlertActions, AlertContent, AlertDescription, AlertTitle, Banner, Button, EmptyState, Loader, Meter, Progress, Skeleton, Spinner } from "@linyao.tw/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "元件/回饋/狀態與進度",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const statusLabels = {
	neutral: "一般通知",
	info: "資訊通知",
	success: "成功通知",
	warning: "警告通知",
	danger: "錯誤通知"
} as const;

export const Alerts: Story = {
	name: "警示",
	render: () => (
		<div className="lyds-story-stack">
			{(["neutral", "info", "success", "warning", "danger"] as const).map(status => (
				<Alert key={status} status={status}>
					<AlertContent>
						<AlertTitle>{statusLabels[status]}</AlertTitle>
						<AlertDescription>顯示目前狀態與可執行的操作。</AlertDescription>
					</AlertContent>
					<AlertActions>
						<Button size="sm" variant="secondary">
							查看
						</Button>
					</AlertActions>
				</Alert>
			))}
		</div>
	)
};

export const BannerNotice: Story = {
	name: "橫幅",
	render: () => <Banner status="warning">系統維護將於 21:30 開始。既有工作階段不受影響，新工作階段可能延遲。</Banner>
};

export const ProgressAndMeter: Story = {
	name: "進度與計量",
	render: () => (
		<div className="lyds-story-grid">
			<Progress label="檔案上傳" value={68} />
			<Progress label="正在產生報表" value={null} status="info" />
			<Meter label="儲存空間用量" value={7.4} min={0} max={10} format={{ style: "unit", unit: "gigabyte" }} status="warning" />
			<Meter label="訊號品質" value={92} min={0} max={100} status="success" />
		</div>
	)
};

export const Loading: Story = {
	name: "載入",
	render: () => (
		<div className="lyds-story-stack">
			<div className="lyds-story-row">
				<Spinner size="sm" label="正在載入少量資料" />
				<Spinner size="md" label="正在載入資料" />
				<Spinner size="lg" label="正在載入大量資料" status="info" />
				<Loader label="正在同步設定" />
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
	name: "空狀態",
	render: () => <EmptyState title="尚無報表" description="建立報表或匯入現有檔案。" actions={<Button>建立報表</Button>} />
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack">
			<Banner status="info">此範例使用深色主題。</Banner>
			<Progress label="封存資料索引" value={43} />
			<EmptyState title="尚無待處理要求" description="收到新要求後會顯示在這裡。" />
		</div>
	)
};
