import type { Meta, StoryObj } from "@storybook/react-vite";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

const principles = [
	{
		label: "語意變數",
		title: "依用途命名",
		copy: "元件使用類別、角色與狀態變數，不直接使用實際色名。切換主題時，元件用途維持不變。"
	},
	{
		label: "元件組合",
		title: "優先組合既有元件",
		copy: "透過插槽與 render API 組合欄位、清單、浮動介面與頁面結構，避免複製元件內部實作。"
	},
	{
		label: "互動狀態",
		title: "明確呈現狀態",
		copy: "停留、按下、選取、開啟、停用、無效、載入與鍵盤聚焦狀態必須清楚可辨識。"
	},
	{
		label: "設計參考",
		title: "遵循元件結構",
		copy: "依照 Modulor 的元件結構、尺寸、背景層級、文字層級與狀態組織，並套用 Linyao Design System 色盤。"
	},
	{
		label: "無障礙",
		title: "保留語意與操作方式",
		copy: "使用 Base UI 與 React Aria 提供的語意、焦點管理、鍵盤操作、狀態通知與減少動態效果支援。"
	},
	{
		label: "產品邏輯",
		title: "由產品端負責",
		copy: "Linyao Design System 提供受控與非受控元件。資料請求、路由、分析、儲存、驗證規則與日期格式由產品端處理。"
	}
] as const;

const inventory = [
	{
		category: "基礎元件",
		items: ["Button、IconButton", "Link、Badge", "Avatar、Separator", "Card、CloudBox", "SectionHeading、ListCell"]
	},
	{
		category: "表單與選擇",
		items: [
			"TextField、SearchField、PasswordField、CodeField、PhoneField、NumberField",
			"OTPField、FileUpload、DropZone",
			"Checkbox、Radio、Switch、Slider、Toggle",
			"Select、Combobox、Autocomplete、Menu、ContextMenu"
		]
	},
	{
		category: "結構與浮動介面",
		items: ["Accordion、Collapsible、Tabs", "Tooltip、Popover、PreviewCard", "Dialog、AlertDialog、Drawer、BottomSheet"]
	},
	{
		category: "回饋與導覽",
		items: ["Toast、Alert、Banner、Progress、Meter、Loader", "Breadcrumb、Pagination、NavigationMenu、Menubar、Toolbar", "Header、TabBar、Table、Collection、ScrollArea、CommandPalette"]
	},
	{
		category: "日期與時間",
		items: ["Calendar、DateField", "DatePicker、DateRangePicker", "TimeField、TimePicker", "DateTimePicker 與依 locale 分段的輸入欄位"]
	}
] as const;

const meta = {
	title: "基礎/設計原則",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SystemPrinciplesAndInventory: Story = {
	name: "設計原則與元件清單",
	render: () => (
		<main className="foundation-page">
			<FoundationHero eyebrow="Linyao Design System" title="設計原則" description="說明元件結構、語意變數、互動狀態、無障礙與產品邏輯的分工。" />

			<FoundationSection title="設計原則">
				<div className="foundation-principle-grid">
					{principles.map(principle => (
						<article className="foundation-principle" key={principle.label}>
							<span className="foundation-kicker">{principle.label}</span>
							<h3>{principle.title}</h3>
							<p>{principle.copy}</p>
						</article>
					))}
				</div>
			</FoundationSection>

			<FoundationSection title="元件清單">
				<div className="foundation-inventory-grid">
					{inventory.map(group => (
						<article className="foundation-inventory" key={group.category}>
							<h3>{group.category}</h3>
							<ul>
								{group.items.map(item => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</article>
					))}
				</div>
			</FoundationSection>
		</main>
	)
};
