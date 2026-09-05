import { CodeField, Input, PasswordField, PhoneField, SearchField, Textarea, TextField, TextView } from "@linyao.tw/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import "@/components/story-layout.css";

const meta = {
	title: "元件/輸入/文字欄位",
	component: TextField,
	args: {
		label: "專案名稱",
		description: "工作區中的所有成員都能看到此名稱。",
		placeholder: "例如：網站改版"
	},
	argTypes: {
		size: { control: "select", options: ["sm", "md", "lg"] }
	}
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { name: "預設" };

export const StandaloneInput: Story = {
	name: "單行輸入",
	render: () => <Input aria-label="快速篩選" placeholder="篩選紀錄" />
};

export const Sizes: Story = {
	name: "尺寸",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TextField size="sm" label="小型欄位" defaultValue="範例內容" />
			<TextField size="md" label="中型欄位" defaultValue="範例內容" />
			<TextField size="lg" label="大型欄位" defaultValue="範例內容" />
		</div>
	)
};

export const InvalidAndUnavailable: Story = {
	name: "無效與無法使用",
	render: () => (
		<div className="lyds-story-grid">
			<TextField label="帳號代碼" defaultValue="A?19" invalid error="只能使用大寫英文字母與數字。" />
			<TextField label="受管理的電子郵件" defaultValue="member@example.com" disabled description="此欄位由組織管理。" />
			<TextField label="最後更新時間" defaultValue="2026 年 8 月 31 日" readOnly description="唯讀稽核資訊。" />
		</div>
	)
};

function ControlledFieldDemo() {
	const [value, setValue] = useState("甲專案");

	return (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TextField label="受控名稱" value={value} onValueChange={nextValue => setValue(nextValue)} />
			<p className="lyds-story-readout" aria-live="polite">
				目前內容：{value || "空白"}
			</p>
		</div>
	);
}

export const ControlledValue: Story = {
	name: "受控值",
	render: () => <ControlledFieldDemo />
};

export const FieldFamily: Story = {
	name: "欄位類型",
	render: () => (
		<div className="lyds-story-form">
			<SearchField label="搜尋專案" placeholder="名稱、負責人或關鍵字…" />
			<PasswordField label="密碼" defaultValue="correct-horse" />
			<CodeField label="驗證碼" defaultValue="817204" description="貼上或輸入六位數驗證碼。" />
			<PhoneField label="聯絡電話" placeholder="+886" description="格式與驗證規則由應用程式設定。" />
			<TextView className="lyds-story-form__wide" label="備註" defaultValue="請在下次審查前提供修訂後的大綱。" />
			<Textarea className="lyds-story-form__wide" aria-label="無外框備註" defaultValue="獨立的多行輸入控制項" />
		</div>
	)
};

export const LongText: Story = {
	name: "長文字",
	render: () => (
		<TextField label="用於確認長文字換行與欄位關聯的文字欄位標籤" description="補充說明可分成多行，並維持與欄位的清楚關聯。" defaultValue="使用者輸入的長文字在控制項中保持可讀且可水平捲動" />
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<TextField label="顯示名稱" defaultValue="晚間支援團隊" />
			<TextField label="參考代碼" defaultValue="E-401" invalid error="無法辨識此參考代碼。" />
		</div>
	)
};
