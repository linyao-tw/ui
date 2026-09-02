import { Tabs } from "@linyao.tw/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "元件/導覽/頁籤",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function WorkspaceTabs({ defaultValue = "overview", disabled = false }: { defaultValue?: string; disabled?: boolean }) {
	return (
		<Tabs.Root defaultValue={defaultValue}>
			<Tabs.List aria-label="工作區設定">
				<Tabs.Tab value="overview">總覽</Tabs.Tab>
				<Tabs.Tab value="members">成員</Tabs.Tab>
				<Tabs.Tab value="activity">活動</Tabs.Tab>
				<Tabs.Tab value="billing" disabled={disabled}>
					名稱較長的帳務設定頁籤
				</Tabs.Tab>
			</Tabs.List>
			<Tabs.Panel value="overview">
				<div className="lyds-story-panel">工作區名稱、說明與預設分享設定。</div>
			</Tabs.Panel>
			<Tabs.Panel value="members">
				<div className="lyds-story-panel">目前有 12 位成員可存取此工作區。</div>
			</Tabs.Panel>
			<Tabs.Panel value="activity">
				<div className="lyds-story-panel">最近的變更與登入活動。</div>
			</Tabs.Panel>
			<Tabs.Panel value="billing">
				<div className="lyds-story-panel">帳務內容與帳號規則。</div>
			</Tabs.Panel>
		</Tabs.Root>
	);
}

export const Default: Story = {
	name: "預設",
	render: () => <WorkspaceTabs />
};

export const KeyboardNavigation: Story = {
	name: "鍵盤操作",
	render: () => (
		<div className="lyds-story-stack">
			<p className="lyds-story-note">將焦點移至頁籤，再使用左、右方向鍵切換。</p>
			<WorkspaceTabs disabled />
		</div>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => <WorkspaceTabs defaultValue="members" />
};
