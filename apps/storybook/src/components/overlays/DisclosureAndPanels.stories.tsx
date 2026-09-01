import { Accordion, BottomSheet, Button, Collapsible, Drawer } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "元件/浮層/展開與面板",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccordionSections: Story = {
	name: "手風琴",
	render: () => (
		<Accordion.Root defaultValue={["account"]} className="lyds-story-stack--narrow">
			<Accordion.Item value="account">
				<Accordion.Header>
					<Accordion.Trigger>帳號資料</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>更新個人資料、電子郵件地址與登入設定。</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="notifications">
				<Accordion.Header>
					<Accordion.Trigger>通知</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>選擇要透過電子郵件或應用程式接收的通知。</Accordion.Panel>
			</Accordion.Item>
			<Accordion.Item value="billing" disabled>
				<Accordion.Header>
					<Accordion.Trigger>帳務</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Panel>此帳號無法使用帳務設定。</Accordion.Panel>
			</Accordion.Item>
		</Accordion.Root>
	)
};

export const CollapsibleDetails: Story = {
	name: "可收合內容",
	render: () => (
		<Collapsible.Root className="lyds-story-stack--narrow">
			<Collapsible.Trigger>其他資訊</Collapsible.Trigger>
			<Collapsible.Panel>
				<p>上次檢查沒有發現其他問題。</p>
			</Collapsible.Panel>
		</Collapsible.Root>
	)
};

export const DrawerPanel: Story = {
	name: "抽屜",
	render: () => (
		<Drawer.Root>
			<Drawer.Trigger>開啟個人資料</Drawer.Trigger>
			<Drawer.Portal>
				<Drawer.Backdrop />
				<Drawer.Viewport>
					<Drawer.Popup>
						<Drawer.Header>
							<Drawer.Title>個人資料設定</Drawer.Title>
							<Drawer.Description>查看並更新與其他成員分享的資料。</Drawer.Description>
						</Drawer.Header>
						<Drawer.Body className="lyds-story-stack">
							<p>三個工作區的成員可以查看你的個人資料。</p>
							<Button>前往個人資料設定</Button>
						</Drawer.Body>
					</Drawer.Popup>
				</Drawer.Viewport>
			</Drawer.Portal>
		</Drawer.Root>
	)
};

export const BottomSheetPanel: Story = {
	name: "底部面板",
	render: () => (
		<BottomSheet.Root>
			<BottomSheet.Trigger>開啟分享選項</BottomSheet.Trigger>
			<BottomSheet.Portal>
				<BottomSheet.Backdrop />
				<BottomSheet.Viewport>
					<BottomSheet.Popup>
						<BottomSheet.Handle />
						<BottomSheet.Header>
							<BottomSheet.Title>分享文件</BottomSheet.Title>
							<BottomSheet.Description>選擇文件的分享方式。</BottomSheet.Description>
						</BottomSheet.Header>
						<BottomSheet.Body>季度規劃筆記</BottomSheet.Body>
						<BottomSheet.Footer className="lyds-story-row">
							<Button>複製分享連結</Button>
							<BottomSheet.Close>取消</BottomSheet.Close>
						</BottomSheet.Footer>
					</BottomSheet.Popup>
				</BottomSheet.Viewport>
			</BottomSheet.Portal>
		</BottomSheet.Root>
	)
};
