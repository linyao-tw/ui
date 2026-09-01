import {
	Badge,
	Banner,
	Button,
	CheckboxGroup,
	CheckboxItem,
	DatePicker,
	NumberField,
	SegmentedControl,
	SegmentedControlItem,
	Select,
	Switch,
	TextField,
	TextView,
	TimePicker,
	parseDate,
	parseTime
} from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FormEvent } from "react";
import { useState } from "react";

import "./patterns.css";

const environmentOptions = [
	{ value: "studio", label: "工作室測試環境", description: "獨立測試用環境" },
	{ value: "staging", label: "共用測試環境", description: "團隊整合測試用環境" },
	{ value: "production", label: "正式環境", description: "對外提供服務的環境" }
] as const;

const steps = [
	{ index: "01", title: "基本資料", description: "填寫發布名稱與類型。" },
	{ index: "02", title: "時間", description: "設定發布日期與時間。" },
	{ index: "03", title: "確認", description: "確認發布設定。" }
] as const;

const meta = {
	title: "使用範例/混合表單",
	parameters: {
		layout: "fullscreen"
	}
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function DeploymentForm() {
	const [projectName, setProjectName] = useState("更新庫存服務");
	const [environment, setEnvironment] = useState<(typeof environmentOptions)[number]["value"]>("staging");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSubmitted(true);
	};

	return (
		<main className="pattern-page">
			<section className="pattern-shell" aria-labelledby="release-title">
				<aside className="pattern-sidebar">
					<div className="pattern-brand">
						<span className="pattern-overline">Linyao Design System</span>
						<h1>部署設定</h1>
						<p>設定部署環境、日期、時間與通知。</p>
					</div>

					<ol className="pattern-steps" aria-label="發布設定進度">
						{steps.map((step, index) => (
							<li className="pattern-step" data-active={index === 1} key={step.index}>
								<span className="pattern-step__index">{step.index}</span>
								<div>
									<strong>{step.title}</strong>
									<p>{step.description}</p>
								</div>
							</li>
						))}
					</ol>

					<div>
						<div className="pattern-meter" role="progressbar" aria-label="發布設定進度" aria-valuemin={0} aria-valuemax={3} aria-valuenow={2} aria-valuetext="已完成三個步驟中的兩個">
							<span className="pattern-meter__label">步驟 2／3</span>
							<div className="pattern-meter__track" aria-hidden="true">
								<div className="pattern-meter__fill" />
							</div>
						</div>
					</div>
				</aside>

				<form className="pattern-form" onSubmit={handleSubmit}>
					<header className="pattern-form__header">
						<div className="pattern-form__header-copy">
							<span className="pattern-overline">時間</span>
							<h2 id="release-title">發布內容</h2>
							<p className="pattern-form__intro">設定發布時間、流量與審核方式。</p>
						</div>
						<div className="pattern-form__stamp">
							<Badge variant="accent">草稿 04</Badge>
						</div>
					</header>

					{submitted ? (
						<Banner status="success" live="polite">
							設定已儲存，尚未開始部署。
						</Banner>
					) : null}

					<div className="pattern-form__grid">
						<TextField className="pattern-form__span" description="供團隊辨識此次發布。" label="發布名稱" name="releaseName" onValueChange={setProjectName} required value={projectName} />

						<div className="pattern-field">
							<span className="pattern-field-label" id="environment-label">
								部署環境
							</span>
							<Select
								aria-labelledby="environment-label"
								className="pattern-select"
								name="environment"
								onValueChange={value => {
									if (value !== null) setEnvironment(value);
								}}
								options={environmentOptions}
								value={environment}
							/>
						</div>

						<TextField description="選填的變更單編號。" label="變更單編號" name="changeReference" placeholder="REL-2048" />

						<DatePicker defaultValue={parseDate("2026-09-04")} description="選擇部署日期。" firstDayOfWeek="mon" label="部署日期" locale="en-GB" name="deploymentDate" />

						<TimePicker defaultValue={parseTime("21:30")} description="輸入部署開始時間。" granularity="minute" hourCycle={24} label="開始時間" locale="en-GB" name="startTime" />

						<NumberField defaultValue={25} description="設定初始導入流量。" format={{ style: "unit", unit: "percent" }} label="初始流量" max={100} min={0} name="traffic" step={5} />

						<div className="pattern-field">
							<span className="pattern-field-label">部署方式</span>
							<SegmentedControl defaultValue="progressive" name="rolloutMode" aria-label="部署方式">
								<SegmentedControlItem value="progressive">逐步</SegmentedControlItem>
								<SegmentedControlItem value="direct">直接</SegmentedControlItem>
							</SegmentedControl>
						</div>

						<TextView className="pattern-form__span" defaultValue="提高流量前，先觀察錯誤率與結帳延遲十五分鐘。" description="填寫審核注意事項。" label="審核備註" name="reviewNote" rows={4} />

						<div className="pattern-choice-panel pattern-form__span">
							<div className="pattern-switch-row">
								<Switch defaultChecked aria-labelledby="approval-label" name="approvalGate" />
								<div className="pattern-switch-copy" id="approval-label">
									<strong>需要人工核准</strong>
									<span>超過初始流量前暫停並等待核准。</span>
								</div>
							</div>
							<CheckboxGroup aria-label="發布通知" defaultValue={["incident", "complete"]}>
								<CheckboxItem name="notifications" value="incident" label="發生異常時通知" description="監測數值超過門檻時通知。" />
								<CheckboxItem name="notifications" value="complete" label="完成時通知" description="部署達到設定目標時通知。" />
							</CheckboxGroup>
						</div>
					</div>

					<dl className="pattern-summary" aria-label="發布摘要">
						<div>
							<dt>環境</dt>
							<dd>{environmentOptions.find(option => option.value === environment)?.label}</dd>
						</div>
						<div>
							<dt>時間</dt>
							<dd>2026-09-04 / 21:30</dd>
						</div>
						<div>
							<dt>初始流量</dt>
							<dd>25%</dd>
						</div>
					</dl>

					<footer className="pattern-form__footer">
						<Button type="button" variant="quiet" onClick={() => setSubmitted(false)}>
							清除儲存狀態
						</Button>
						<Button type="submit">儲存設定</Button>
					</footer>
				</form>
			</section>
		</main>
	);
}

export const ReleaseConfiguration: Story = {
	name: "部署設定",
	render: () => <DeploymentForm />
};
