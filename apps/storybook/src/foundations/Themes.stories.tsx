import { Badge, Button, Card, CardBody, CardDescription, CardHeader, CardTitle, Switch } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

const themeSamples = [
	{ theme: "light", name: "淺色主題", code: "Limestone 基底" },
	{ theme: "dark", name: "深色主題", code: "Charcoal 基底" }
] as const;

const meta = {
	title: "基礎/主題",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightAndDark: Story = {
	name: "淺色與深色",
	render: () => (
		<main className="foundation-page">
			<FoundationHero title="主題" description="淺色與深色主題共用相同的語意設計變數與元件層級。" />

			<FoundationSection title="主題比較">
				<div className="foundation-theme-grid">
					{themeSamples.map(sample => (
						<section className="foundation-theme-sample" data-lyds-theme={sample.theme} key={sample.theme}>
							<header className="foundation-theme-sample__header">
								<div>
									<span className="foundation-theme-code">{sample.code}</span>
									<h3>{sample.name}</h3>
								</div>
								<Badge variant="accent">強調色</Badge>
							</header>
							<Card variant="material">
								<CardHeader>
									<CardTitle>帳號設定</CardTitle>
									<CardDescription>語意 token 在不同主題中維持相同層級。</CardDescription>
								</CardHeader>
								<CardBody>
									<div className="foundation-theme-sample__panel">
										<span className="foundation-label">偏好設定</span>
										<p>文字、背景與分隔線依主題切換色值，並維持相同的資訊層級。</p>
										<div className="foundation-theme-sample__controls">
											<Switch defaultChecked aria-label={`${sample.name}通知設定`} />
											<Button size="sm">儲存設定</Button>
										</div>
									</div>
								</CardBody>
							</Card>
						</section>
					))}
				</div>
			</FoundationSection>

			<FoundationSection title="主題設定規則">
				<div className="foundation-principle-grid">
					<article className="foundation-principle">
						<h3>主題屬性</h3>
						<p>在根元素設定 data-lyds-theme="light" 或 data-lyds-theme="dark"。巢狀區域使用最近的主題屬性。</p>
					</article>
					<article className="foundation-principle">
						<h3>語意變數</h3>
						<p>應用程式與元件 CSS 使用 Background/Main、Text/Title 等語意角色，不直接使用實際色值。</p>
					</article>
					<article className="foundation-principle">
						<h3>自訂主題</h3>
						<p>建立產品主題時，須一併設定前景、背景、邊框、focus 與狀態 token。</p>
					</article>
				</div>
			</FoundationSection>
		</main>
	)
};
