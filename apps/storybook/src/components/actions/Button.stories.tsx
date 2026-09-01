import { Badge, Button, Card, CardBody, CardDescription, CardFooter, CardHeader, CardTitle, IconButton } from "@lyds/ui";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { EyeIcon } from "@phosphor-icons/react/dist/csr/Eye";
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "元件/操作/按鈕",
	component: Button,
	args: {
		children: "儲存變更"
	},
	argTypes: {
		variant: { control: "select", options: ["primary", "secondary", "quiet", "danger"] },
		size: { control: "select", options: ["sm", "md", "lg"] }
	}
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "預設" };

export const Variants: Story = {
	name: "樣式",
	render: () => (
		<div className="lyds-story-row">
			<Button variant="primary">繼續</Button>
			<Button variant="secondary">查看詳細資料</Button>
			<Button variant="quiet">取消</Button>
			<Button variant="danger">刪除</Button>
		</div>
	)
};

export const Sizes: Story = {
	name: "尺寸",
	render: () => (
		<div className="lyds-story-row">
			<Button size="sm" startIcon={<FloppyDiskIcon weight="bold" />}>
				小型按鈕
			</Button>
			<Button size="md" startIcon={<FloppyDiskIcon weight="bold" />}>
				中型按鈕
			</Button>
			<Button size="lg" startIcon={<FloppyDiskIcon weight="bold" />}>
				大型按鈕
			</Button>
		</div>
	)
};

export const WithIcons: Story = {
	name: "搭配圖示",
	render: () => (
		<div className="lyds-story-row">
			<Button startIcon={<FloppyDiskIcon weight="bold" />}>儲存變更</Button>
			<Button endIcon={<ArrowRightIcon weight="bold" />}>繼續</Button>
			<Button variant="secondary" startIcon={<EyeIcon weight="bold" />} endIcon={<ArrowRightIcon weight="bold" />}>
				查看詳細資料
			</Button>
		</div>
	)
};

export const BusyAndDisabled: Story = {
	name: "載入與停用",
	render: () => (
		<div className="lyds-story-row">
			<Button loading>正在儲存</Button>
			<Button disabled variant="secondary">
				無法使用
			</Button>
			<IconButton aria-label="新增項目" variant="secondary">
				<PlusIcon weight="bold" />
			</IconButton>
		</div>
	)
};

export const LongTextComposition: Story = {
	name: "長文字內容",
	render: () => (
		<Card className="lyds-story-stack lyds-story-stack--narrow" variant="material">
			<CardHeader>
				<Badge variant="warning">需要確認</Badge>
				<CardTitle>確認執行背景作業</CardTitle>
				<CardDescription>作業完成前，此筆資料將暫時無法使用。</CardDescription>
			</CardHeader>
			<CardBody className="lyds-story-readout">預計時間：8 分鐘</CardBody>
			<CardFooter className="lyds-story-row">
				<Button>開始執行</Button>
				<Button variant="quiet">查看設定</Button>
			</CardFooter>
		</Card>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-row">
			<Button>儲存變更</Button>
			<Button variant="secondary">預覽</Button>
			<Button variant="quiet">取消</Button>
		</div>
	)
};
