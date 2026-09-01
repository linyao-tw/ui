import type { Meta, StoryObj } from "@storybook/react-vite";

import "./foundations/foundations.css";
import { FoundationHero, FoundationSection } from "./foundations/story-primitives";

const areas = [
	{
		title: "元件",
		description: "提供操作、輸入、選取、導覽、浮層、回饋與資料呈現元件。"
	},
	{
		title: "設計變數與主題",
		description: "使用語意 CSS 變數設定色彩、字體、間距、圓角、陰影與動態效果。"
	},
	{
		title: "日期與時間",
		description: "提供行事曆、日期、日期範圍、時間與日期時間輸入元件。"
	},
	{
		title: "使用範例",
		description: "展示表單與完整頁面中的元件組合、響應式版面與互動狀態。"
	}
] as const;

const meta = {
	title: "首頁",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Introduction: Story = {
	name: "簡介",
	render: () => (
		<main className="foundation-page">
			<FoundationHero title="Linyao Design System" description="麟曜數位工作室的 React 設計系統，提供可組合元件、語意設計變數、淺色與深色主題，以及日期與時間控制項。" />

			<FoundationSection title="開始使用">
				<div className="foundation-start-grid">
					<article className="foundation-start-card">
						<h3>安裝</h3>
						<p>安裝元件套件與 Phosphor 圖示。</p>
						<pre className="foundation-code-block">
							<code>pnpm add @lyds/ui @phosphor-icons/react</code>
						</pre>
					</article>
					<article className="foundation-start-card">
						<h3>匯入</h3>
						<p>在應用程式入口匯入一次樣式，再從公開套件入口使用元件。</p>
						<pre className="foundation-code-block">
							<code>{`import "@lyds/ui/styles.css";\nimport { Button, DatePicker } from "@lyds/ui";`}</code>
						</pre>
					</article>
				</div>
			</FoundationSection>

			<FoundationSection title="內容">
				<div className="foundation-start-grid">
					{areas.map(area => (
						<article className="foundation-start-card" key={area.title}>
							<h3>{area.title}</h3>
							<p>{area.description}</p>
						</article>
					))}
				</div>
			</FoundationSection>

			<FoundationSection title="使用原則">
				<ul className="foundation-intro-list">
					<li>優先組合現有元件，避免複製或分支修改元件內部實作。</li>
					<li>使用語意設計變數，不在元件樣式中直接使用原始色值。</li>
					<li>資料、路由、權限、驗證與其他產品邏輯由應用程式負責。</li>
					<li>實作時保留可存取名稱、鍵盤操作、可見焦點與減少動態效果設定。</li>
				</ul>
			</FoundationSection>
		</main>
	)
};
