import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type CSSProperties } from "react";

import "./foundations.css";
import { FoundationHero, FoundationSection } from "./story-primitives";

type FoundationStyle = CSSProperties & Record<`--foundation-${string}`, string>;

const easingCurves = [
	{
		name: "Out",
		description: "進入與停止",
		value: "var(--motion-ease-out)"
	},
	{
		name: "InOut",
		description: "可逆的版面變化",
		value: "var(--motion-ease-in-out)"
	},
	{
		name: "In",
		description: "短距離離開",
		value: "var(--motion-ease-in)"
	},
	{
		name: "Snap",
		description: "小型切換與確認",
		value: "var(--motion-ease-snap)"
	},
	{
		name: "Mechanical",
		description: "非必要的裝飾指示",
		value: "var(--motion-ease-mechanical)"
	}
] as const;

const durations = [
	{ name: "Instant", token: "Motion/Duration/Instant", value: "0ms", duration: "var(--motion-duration-instant)", instant: true },
	{ name: "Fast", token: "Motion/Duration/Fast", value: "120ms", duration: "var(--motion-duration-fast)", instant: false },
	{ name: "Normal", token: "Motion/Duration/Normal", value: "220ms", duration: "var(--motion-duration-normal)", instant: false },
	{ name: "Slow", token: "Motion/Duration/Slow", value: "360ms", duration: "var(--motion-duration-slow)", instant: false }
] as const;

const meta = {
	title: "基礎/動態效果",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function MotionCurveDemo({ description, name, value }: (typeof easingCurves)[number]) {
	const [atEnd, setAtEnd] = useState(false);

	return (
		<button
			className="foundation-motion-row"
			data-position={atEnd ? "end" : "start"}
			onClick={() => setAtEnd(current => !current)}
			style={{ "--foundation-motion-ease": value } as FoundationStyle}
			type="button"
		>
			<span className="foundation-motion-row__meta">
				<strong className="foundation-motion-name">Motion/Ease/{name}</strong>
				<span className="foundation-code">{description}</span>
			</span>
			<span className="foundation-motion-track" aria-hidden="true">
				<span className="foundation-motion-marker" />
			</span>
		</button>
	);
}

export const MotionVocabulary: Story = {
	name: "動態效果",
	render: () => (
		<main className="foundation-page">
			<FoundationHero eyebrow="Linyao Design System" title="動態效果" description="定義元件共用的時間長度、緩動與減少動態效果規則。" />

			<FoundationSection title="緩動曲線">
				<p className="foundation-section-copy">使用滑鼠或鍵盤啟動軌道，比較各緩動變數在相同距離下的效果。</p>
				<div className="foundation-motion-list">
					{easingCurves.map(curve => (
						<MotionCurveDemo {...curve} key={curve.name} />
					))}
				</div>
			</FoundationSection>

			<FoundationSection title="時間長度">
				<div className="foundation-duration-grid">
					{durations.map(duration => (
						<article className="foundation-duration" data-instant={duration.instant} key={duration.name} style={{ "--foundation-motion-duration": duration.duration } as FoundationStyle}>
							<div className="foundation-duration__bar" aria-hidden="true" />
							<div>
								<strong className="foundation-token-name">{duration.token}</strong>
								<code className="foundation-code">{duration.value}</code>
							</div>
						</article>
					))}
				</div>
			</FoundationSection>

			<FoundationSection title="使用規則">
				<div className="foundation-principle-grid">
					<article className="foundation-principle">
						<span className="foundation-kicker">一般互動</span>
						<h3>使用短時間回饋</h3>
						<p>停留、按下、聚焦與小型選取狀態使用 CSS 轉場，並指定時間長度與緩動變數。</p>
					</article>
					<article className="foundation-principle">
						<span className="foundation-kicker">超出終點</span>
						<h3>僅用於小型元件</h3>
						<p>Snap 只用於旋鈕、切換與小型確認。對話框、抽屜與閱讀區域不得使用超出終點的動態效果。</p>
					</article>
					<article className="foundation-principle">
						<span className="foundation-kicker">減少動態效果</span>
						<h3>移除非必要移動</h3>
						<p>使用者偏好減少動態效果時，移除非必要的位移與重複動畫，但仍須清楚呈現狀態變化。</p>
					</article>
				</div>
			</FoundationSection>
		</main>
	)
};
