import {
	Button,
	CalendarDate,
	Card,
	CardBody,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	CheckboxItem,
	DatePicker,
	NumberField,
	RadioGroup,
	RadioItem,
	Select,
	Switch,
	TextField,
	TextView,
	Time,
	TimePicker
} from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "元件/輸入/完整表單",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function WorkshopForm() {
	return (
		<Card variant="material" className="lyds-story-stack">
			<CardHeader>
				<span className="lyds-story-note">新增工作坊</span>
				<CardTitle>安排團隊工作坊</CardTitle>
				<CardDescription>使用 Linyao Design System 元件組成的工作坊表單。</CardDescription>
			</CardHeader>
			<CardBody>
				<form className="lyds-story-form" onSubmit={event => event.preventDefault()}>
					<TextField required requiredIndicator="必填" label="工作坊名稱" defaultValue="季度規劃會議" />
					<Select<string>
						aria-label="帶領人"
						defaultValue="design-team"
						options={[
							{ value: "design-team", label: "設計團隊" },
							{ value: "product-team", label: "產品團隊" }
						]}
					/>
					<DatePicker label="工作坊日期" defaultValue={new CalendarDate(2026, 9, 8)} locale="zh-TW" />
					<TimePicker label="開始時間" defaultValue={new Time(14, 30)} hourCycle={24} locale="zh-TW" />
					<NumberField label="可報名人數" description="參加人數上限" defaultValue={12} min={1} step={1} />
					<RadioGroup aria-label="參加方式" defaultValue="in-person">
						<RadioItem value="in-person" label="現場參加" />
						<RadioItem value="remote" label="遠端參加" />
					</RadioGroup>
					<TextView className="lyds-story-form__wide" label="議程" defaultValue="回顧上季度成果、確認工作優先順序並分配負責人。" />
					<div className="lyds-story-form__wide lyds-story-stack">
						<CheckboxItem defaultChecked label="時程異動時寄信通知參加者" />
						<div className="lyds-story-row">
							<Switch defaultChecked aria-labelledby="recording-switch-label" />
							<span id="recording-switch-label">錄製會議</span>
						</div>
					</div>
				</form>
			</CardBody>
			<CardFooter className="lyds-story-row">
				<Button>安排工作坊</Button>
				<Button variant="quiet">儲存草稿</Button>
			</CardFooter>
		</Card>
	);
}

export const Default: Story = {
	name: "預設",
	render: () => <WorkshopForm />
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => <WorkshopForm />
};
