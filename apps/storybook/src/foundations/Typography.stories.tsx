import type { Meta, StoryObj } from "@storybook/react-vite";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

const specimens = [
	{
		family: "sans",
		scale: "display",
		label: "展示／黑體",
		meta: "GenKiGothicTW · 粗體",
		copy: "南去經三國，東來過五湖"
	},
	{
		family: "serif",
		scale: "display",
		label: "展示／明體",
		meta: "GenKiMinTW · 半粗體",
		copy: "南去經三國，東來過五湖"
	},
	{
		family: "sans",
		scale: "body",
		label: "內文／黑體",
		meta: "GenKiGothicTW · 一般",
		copy: "我個人認為義大利麵就應該拌 42 號混泥土，因為這個螺絲釘的長度很容易直接影響到挖掘機的扭矩。"
	},
	{
		family: "mono",
		scale: "structured",
		label: "數值／等寬",
		meta: "Geist Mono · 中等",
		copy: "2026-08-31 · 23:48:06 · 87.5%"
	}
] as const;

const numericExamples = [
	{ label: "日期", value: "2026.08.31" },
	{ label: "時間", value: "23:48:06" },
	{ label: "數量", value: "0042" },
	{ label: "進度", value: "87.5%" }
] as const;

const meta = {
	title: "基礎/字體",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TypeSystem: Story = {
	name: "字體系統",
	render: () => (
		<main className="foundation-page">
			<FoundationHero title="字體" description="定義繁體中文黑體、明體與等寬字體的用途、字級與數字格式。" />

			<FoundationSection title="字體範例">
				<div>
					{specimens.map(specimen => (
						<article className="type-specimen" key={specimen.label}>
							<div className="type-specimen__meta">
								<span className="foundation-label">{specimen.label}</span>
								<code className="foundation-code">{specimen.meta}</code>
							</div>
							<p className="type-specimen__sample" data-family={specimen.family} data-scale={specimen.scale}>
								{specimen.copy}
							</p>
						</article>
					))}
				</div>
			</FoundationSection>

			<FoundationSection title="等寬數字">
				<p className="foundation-section-copy">日期、時間、計數器與數字欄位使用等寬數字，讓數值變動時維持對齊。</p>
				<div className="type-numeric-rack">
					{numericExamples.map(readout => (
						<div className="type-numeric-cell" key={readout.label}>
							<span className="foundation-label">{readout.label}</span>
							<strong>{readout.value}</strong>
						</div>
					))}
				</div>
			</FoundationSection>

			<FoundationSection title="使用規則">
				<div className="foundation-principle-grid">
					<article className="foundation-principle">
						<h3>介面文字</h3>
						<p>用於控制項、導覽、內文與資料密集的介面。繁體中文與英文皆以正常大小寫呈現。</p>
					</article>
					<article className="foundation-principle">
						<h3>標題文字</h3>
						<p>用於內容標題與引文，不取代主要介面字體。</p>
					</article>
					<article className="foundation-principle">
						<h3>結構化數值</h3>
						<p>用於代碼、時間戳記、序號與變動數值，不用於段落內文。</p>
					</article>
				</div>
			</FoundationSection>
		</main>
	)
};
