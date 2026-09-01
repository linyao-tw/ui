import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

type FoundationStyle = CSSProperties & Record<`--foundation-${string}`, string>;

interface TokenSpecimen {
	name: string;
	role: string;
	value: string;
	ink: string;
}

const brandTokens: readonly TokenSpecimen[] = [
	{
		name: "Palette/Limestone",
		role: "暖色基礎色",
		value: "var(--palette-limestone)",
		ink: "var(--text-always-dark)"
	},
	{
		name: "Palette/Charcoal",
		role: "結構基礎色",
		value: "var(--palette-charcoal)",
		ink: "var(--text-always-white)"
	},
	{
		name: "Palette/Vermilion",
		role: "操作與提示色",
		value: "var(--palette-vermilion)",
		ink: "var(--text-always-dark)"
	}
];

const surfaceTokens: readonly TokenSpecimen[] = [
	{
		name: "Background/Main",
		role: "頁面背景",
		value: "var(--background-main)",
		ink: "var(--text-main)"
	},
	{
		name: "Background/Secondary",
		role: "分組區域",
		value: "var(--background-secondary)",
		ink: "var(--text-main)"
	},
	{
		name: "Background/Elevated",
		role: "卡片與浮動介面",
		value: "var(--background-elevated)",
		ink: "var(--text-main)"
	},
	{
		name: "Background/Inset",
		role: "分組控制項背景",
		value: "var(--background-inset)",
		ink: "var(--text-main)"
	},
	{
		name: "Background/Selected",
		role: "已選取區域",
		value: "var(--background-selected)",
		ink: "var(--text-title)"
	},
	{
		name: "Control/Primary",
		role: "主要操作",
		value: "var(--control-primary)",
		ink: "var(--text-on-accent)"
	}
];

const stateTokens: readonly TokenSpecimen[] = [
	{
		name: "Status/Info/Background",
		role: "資訊提示",
		value: "var(--status-info-background)",
		ink: "var(--status-info-foreground)"
	},
	{
		name: "Status/Success/Background",
		role: "成功狀態",
		value: "var(--status-success-background)",
		ink: "var(--status-success-foreground)"
	},
	{
		name: "Status/Warning/Background",
		role: "警告狀態",
		value: "var(--status-warning-background)",
		ink: "var(--status-warning-foreground)"
	},
	{
		name: "Status/Danger/Background",
		role: "危險或無效狀態",
		value: "var(--status-danger-background)",
		ink: "var(--status-danger-foreground)"
	}
];

const contrastPairs = [
	{
		name: "主要介面",
		foreground: "var(--text-main)",
		background: "var(--background-main)",
		border: "var(--divider-strong)",
		copy: "Text/Main on Background/Main"
	},
	{
		name: "品牌強調",
		foreground: "var(--text-on-accent)",
		background: "var(--background-accent)",
		border: "var(--text-on-accent)",
		copy: "Text/On_Accent on Background/Accent"
	},
	{
		name: "主要控制項",
		foreground: "var(--control-on-primary)",
		background: "var(--control-primary)",
		border: "var(--control-primary-pressed)",
		copy: "Control/On_Primary on Control/Primary"
	},
	{
		name: "內嵌控制項",
		foreground: "var(--text-on-inset)",
		background: "var(--background-inset)",
		border: "var(--divider-strong)",
		copy: "Text/On_Inset on Background/Inset"
	}
] as const;

const meta = {
	title: "基礎/色彩",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function TokenGrid({ tokens }: { tokens: readonly TokenSpecimen[] }) {
	return (
		<div className="foundation-token-grid">
			{tokens.map(token => (
				<article className="foundation-token" key={token.name}>
					<div aria-hidden="true" className="foundation-token__swatch" style={{ "--foundation-swatch": token.value, "--foundation-ink": token.ink } as FoundationStyle} />
					<div className="foundation-token__body">
						<strong className="foundation-token__role">{token.role}</strong>
						<code>{token.name}</code>
					</div>
				</article>
			))}
		</div>
	);
}

export const SemanticColorSystem: Story = {
	name: "語意色彩",
	render: () => (
		<main className="foundation-page">
			<FoundationHero title="色彩" description="品牌色透過語意變數對應至背景、文字、控制項與狀態。" />

			<FoundationSection title="品牌基礎色">
				<p className="foundation-section-copy">Limestone、Charcoal 與 Vermilion 供主題設定使用。元件不得直接使用基礎色變數。</p>
				<TokenGrid tokens={brandTokens} />
			</FoundationSection>

			<FoundationSection title="語意背景">
				<p className="foundation-section-copy">背景變數定義頁面、分組、卡片、浮動介面與已選取狀態，並依主題切換實際色值。</p>
				<TokenGrid tokens={surfaceTokens} />
			</FoundationSection>

			<FoundationSection title="狀態色彩">
				<p className="foundation-section-copy">每個狀態包含背景、前景與邊框。狀態須同時使用文字或圖示說明，不得只依賴顏色。</p>
				<TokenGrid tokens={stateTokens} />
			</FoundationSection>

			<FoundationSection title="前景與背景配對">
				<div className="foundation-pair-grid">
					{contrastPairs.map(pair => (
						<article
							className="foundation-pair"
							key={pair.name}
							style={
								{
									"--foundation-pair-foreground": pair.foreground,
									"--foundation-pair-background": pair.background,
									"--foundation-pair-border": pair.border
								} as FoundationStyle
							}
						>
							<strong>{pair.name}</strong>
							<code>{pair.copy}</code>
						</article>
					))}
				</div>
			</FoundationSection>
		</main>
	)
};
