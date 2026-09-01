import { CodeField, DropZone, FileUpload, Input, NumberField, OTPField, PasswordField, PhoneField, SearchField, Textarea, TextView } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";

import "../story-layout.css";

const meta = {
	title: "元件/輸入/狀態總覽",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const getVerificationCharacterLabel = (index: number) => `第 ${index + 1} 個字元`;

function StateSection({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="lyds-story-panel" aria-labelledby={`input-state-${title.toLowerCase().replaceAll(" ", "-")}`}>
			<h3 className="lyds-story-panel__heading" id={`input-state-${title.toLowerCase().replaceAll(" ", "-")}`}>
				{title}
			</h3>
			<div className="lyds-story-grid">{children}</div>
		</section>
	);
}

function CountrySelector({ disabled = false }: { disabled?: boolean }) {
	return (
		<button type="button" aria-label="選擇國碼" disabled={disabled}>
			<span aria-hidden="true">臺灣 +886</span>
		</button>
	);
}

export const NativeControls: Story = {
	name: "原生輸入控制項",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="單行輸入尺寸">
				<Input size="sm" aria-label="小型單行輸入" defaultValue="小型輸入內容" />
				<Input size="md" aria-label="中型單行輸入" defaultValue="中型輸入內容" />
				<Input size="lg" aria-label="大型單行輸入" defaultValue="大型輸入內容" />
			</StateSection>
			<StateSection title="單行輸入狀態">
				<Input aria-label="必填輸入" required placeholder="必填內容" />
				<Input aria-label="唯讀輸入" readOnly defaultValue="唯讀內容" />
				<Input aria-label="停用輸入" disabled defaultValue="無法使用的內容" />
				<div>
					<Input aria-label="無效輸入" aria-describedby="invalid-native-input-message" invalid defaultValue="A?19" />
					<p className="lyds-story-readout" id="invalid-native-input-message">
						只能使用大寫英文字母與數字。
					</p>
				</div>
			</StateSection>
			<StateSection title="多行輸入狀態">
				<Textarea size="sm" aria-label="小型備註" defaultValue="簡短備註" />
				<Textarea size="md" aria-label="中型備註" defaultValue="一般備註" />
				<Textarea size="lg" aria-label="大型備註" defaultValue="較長的備註內容" />
				<Textarea aria-label="必填備註" required placeholder="請輸入備註" />
				<Textarea aria-label="唯讀備註" readOnly defaultValue="此內容由工作區管理。" />
				<Textarea aria-label="停用備註" disabled defaultValue="無法使用的備註" />
				<div>
					<Textarea aria-label="無效備註" aria-describedby="invalid-native-textarea-message" invalid defaultValue="交接內容不完整" />
					<p className="lyds-story-readout" id="invalid-native-textarea-message">
						請填寫負責人與下一步。
					</p>
				</div>
			</StateSection>
		</div>
	)
};

export const TextViews: Story = {
	name: "文字檢視欄位",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="文字檢視欄位尺寸">
				<TextView size="sm" label="小型摘要" defaultValue="簡短摘要。" />
				<TextView size="md" label="中型摘要" defaultValue="專案摘要內容。" />
				<TextView size="lg" label="大型摘要" defaultValue="適合較長專案摘要的輸入區域。" />
			</StateSection>
			<StateSection title="文字檢視欄位驗證">
				<TextView required requiredIndicator="必填" label="交接內容" description="請摘要工作內容供下一位負責人查閱。" />
				<TextView readOnly label="唯讀稽核備註" defaultValue="營運團隊已核准。" />
				<TextView disabled label="停用封存備註" defaultValue="封存資料已鎖定。" />
				<TextView invalid label="未通過的摘要" defaultValue="已完成" error="請說明已完成與尚待處理的內容。" />
			</StateSection>
		</div>
	)
};

export const SearchAndPassword: Story = {
	name: "搜尋與密碼",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="搜尋欄位狀態">
				<SearchField size="sm" label="小型搜尋" placeholder="搜尋紀錄" />
				<SearchField size="md" label="中型搜尋" defaultValue="季度計畫" />
				<SearchField size="lg" label="大型搜尋" placeholder="搜尋專案、負責人或標籤" />
				<SearchField required requiredIndicator="必填" label="必填搜尋" />
				<SearchField readOnly label="唯讀搜尋" defaultValue="已核准紀錄" />
				<SearchField disabled label="停用搜尋" defaultValue="已封存紀錄" />
				<SearchField invalid label="無效搜尋" defaultValue="?" error="請至少輸入兩個字元。" />
			</StateSection>
			<StateSection title="密碼欄位狀態">
				<PasswordField size="sm" label="小型密碼欄位" defaultValue="correct-horse" />
				<PasswordField size="md" label="顯示密碼" defaultValue="battery-staple" defaultVisible />
				<PasswordField size="lg" label="大型密碼欄位" placeholder="輸入密碼" />
				<PasswordField required requiredIndicator="必填" label="必填密碼" />
				<PasswordField readOnly label="唯讀密碼" defaultValue="managed-secret" />
				<PasswordField disabled label="停用密碼" defaultValue="unavailable" />
				<PasswordField invalid label="無效密碼" defaultValue="short" error="請至少使用十二個字元。" />
			</StateSection>
		</div>
	)
};

export const PhoneAndNumber: Story = {
	name: "電話與數字",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="電話欄位狀態">
				<PhoneField size="sm" label="小型電話欄位" placeholder="+886" />
				<PhoneField size="md" label="含國碼的電話" defaultValue="912 345 678" countrySelector={<CountrySelector />} />
				<PhoneField size="lg" label="大型電話欄位" placeholder="國際電話號碼" />
				<PhoneField required requiredIndicator="必填" label="必填電話" />
				<PhoneField readOnly label="唯讀電話" defaultValue="+886 2 0000 0000" countrySelector={<CountrySelector disabled />} />
				<PhoneField disabled label="停用電話" defaultValue="+886 912 345 678" countrySelector={<CountrySelector disabled />} />
				<PhoneField invalid label="無效電話" defaultValue="123" error="請輸入完整的國際電話號碼。" />
			</StateSection>
			<StateSection title="數字欄位狀態">
				<NumberField size="sm" label="小型數字欄位" defaultValue={4} min={0} max={10} />
				<NumberField size="md" label="中型數字欄位" defaultValue={12.5} min={0} max={20} step={0.5} />
				<NumberField size="lg" label="大型數字欄位" defaultValue={80} min={0} max={100} />
				<NumberField required requiredIndicator="必填" label="必填數量" min={1} />
				<NumberField readOnly label="唯讀數量" defaultValue={17} showSteppers={false} />
				<NumberField disabled label="停用數量" defaultValue={24} />
				<NumberField invalid label="無效數量" defaultValue={120} min={0} max={100} error="請輸入 0 至 100 之間的數值。" />
			</StateSection>
		</div>
	)
};

export const VerificationCodes: Story = {
	name: "驗證碼與裝置碼",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="一次性密碼狀態">
				<OTPField size="sm" label="小型驗證碼" length={4} defaultValue="1204" getSlotLabel={getVerificationCharacterLabel} />
				<OTPField size="md" label="中型驗證碼" length={6} separatorAfter={[3]} defaultValue="817204" getSlotLabel={getVerificationCharacterLabel} />
				<OTPField size="lg" label="大型驗證碼" length={4} getSlotLabel={getVerificationCharacterLabel} />
				<OTPField required requiredIndicator="必填" label="必填驗證碼" length={6} getSlotLabel={getVerificationCharacterLabel} />
				<OTPField readOnly label="唯讀驗證碼" length={6} defaultValue="402681" getSlotLabel={getVerificationCharacterLabel} />
				<OTPField disabled label="停用驗證碼" length={6} defaultValue="745103" getSlotLabel={getVerificationCharacterLabel} />
				<OTPField invalid label="過期驗證碼" length={4} error="驗證碼已過期。" getSlotLabel={getVerificationCharacterLabel} />
			</StateSection>
			<StateSection title="裝置碼狀態">
				<CodeField size="sm" label="小型裝置碼" defaultValue="120496" />
				<CodeField size="md" label="分組備援碼" length={12} defaultValue="073142635987" />
				<CodeField size="lg" label="大型裝置碼" placeholder="000000" />
				<CodeField required requiredIndicator="必填" label="必填裝置碼" />
				<CodeField readOnly label="唯讀裝置碼" defaultValue="827401" />
				<CodeField disabled label="停用裝置碼" defaultValue="514209" />
				<CodeField invalid label="無效裝置碼" defaultValue="000000" error="無法辨識此裝置碼。" />
			</StateSection>
		</div>
	)
};

export const FileControls: Story = {
	name: "檔案控制項",
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="檔案上傳狀態">
				<FileUpload size="sm" label="小型檔案上傳" triggerLabel="選擇報告" />
				<FileUpload size="md" label="中型檔案上傳" description="接受 PDF 或 ZIP 檔案。" accept=".pdf,.zip" />
				<FileUpload size="lg" label="大型檔案上傳" triggerLabel="選擇壓縮檔" />
				<FileUpload required requiredIndicator="必填" label="必填文件" />
				<FileUpload readOnly label="唯讀附件" triggerLabel="附件已鎖定" />
				<FileUpload disabled label="停用附件" triggerLabel="無法上傳" />
				<FileUpload invalid label="不接受的附件" error="請選擇小於 10 MB 的檔案。" />
			</StateSection>
			<StateSection title="檔案拖放區狀態">
				<DropZone size="sm" label="小型拖放區" primaryLabel="將報告拖放至此" />
				<DropZone size="md" label="中型拖放區" description="拖放多個檔案或開啟檔案選擇器。" multiple />
				<DropZone size="lg" label="大型拖放區" primaryLabel="將專案壓縮檔拖放至此" />
				<DropZone required requiredIndicator="必填" label="必填附件" />
				<DropZone readOnly label="唯讀附件" primaryLabel="附件已鎖定" />
				<DropZone disabled label="停用附件" primaryLabel="拖放區無法使用" />
				<DropZone invalid label="不接受的附件" error="請移除不支援的檔案類型。" />
			</StateSection>
		</div>
	)
};

export const LongAndNarrow: Story = {
	name: "窄版長文字",
	parameters: { viewport: { defaultViewport: "mobile1" } },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const label = canvas.getByText("長於窄版面可用寬度且必須完整顯示的補充說明與聯絡資訊欄位標籤");
		const codeField = canvasElement.querySelector<HTMLElement>(".lyds-code-field");
		const codeInputs = Array.from(canvasElement.querySelectorAll<HTMLElement>(".lyds-code-field__group-input"));
		const centerDistances = codeInputs.slice(1).map((input, index) => {
			const current = input.getBoundingClientRect();
			const previous = codeInputs[index]!.getBoundingClientRect();
			return current.left + current.width / 2 - (previous.left + previous.width / 2);
		});

		await expect(getComputedStyle(label).whiteSpace).toBe("normal");
		await expect(label.scrollWidth).toBeLessThanOrEqual(label.clientWidth);
		await expect(label.getBoundingClientRect().height).toBeGreaterThan(parseFloat(getComputedStyle(label).lineHeight));
		await expect(Math.min(...centerDistances)).toBeGreaterThanOrEqual(24);
		await expect(codeField).not.toBeNull();
		await expect(codeField!.scrollWidth).toBeGreaterThan(codeField!.clientWidth);
	},
	render: () => (
		<div className="lyds-story-stack lyds-story-control">
			<Input aria-label="長文字單行輸入" defaultValue="單行輸入中的長文字可水平編輯，不會撐開外層版面" />
			<Textarea aria-label="長文字多行輸入" defaultValue="多行長文字會在窄版面中換行，並保留調整尺寸與鍵盤編輯功能。" />
			<TextView label="長於窄版面可用寬度且必須完整顯示的補充說明與聯絡資訊欄位標籤" description="補充說明會在控制項下方換行。" defaultValue="多行長文字應保持可讀，且不會加寬頁面。" />
			<SearchField label="用於確認長文字換行的搜尋欄位標籤" defaultValue="長搜尋內容仍可水平編輯" />
			<PasswordField label="窄版帳號設定表單中的長密碼欄位標籤" defaultValue="correct-horse-battery-staple" />
			<PhoneField label="國際聯絡流程中的長電話欄位標籤" defaultValue="+886 912 345 678" />
			<NumberField label="用於確認長文字換行的數字欄位標籤" description="數值與增減按鈕保持可操作。" defaultValue={42.5} step={0.5} />
			<CodeField label="窄版十二位備援碼" length={12} defaultValue="073142635987" />
			<FileUpload label="必填補充文件的長檔案上傳標籤" description="操作按鈕保持可見，且不會產生水平溢位。" />
			<DropZone label="用於確認長文字換行的附件拖放區標籤" primaryLabel="將補充文件拖放至此" secondaryLabel="或從裝置選擇一個或多個檔案" multiple />
		</div>
	)
};

export const DarkTheme: Story = {
	name: "深色主題",
	globals: { theme: "dark" },
	render: () => (
		<div className="lyds-story-stack">
			<StateSection title="深色文字輸入控制項">
				<Input aria-label="深色單行輸入" defaultValue="單行輸入內容" />
				<Textarea aria-label="深色多行輸入" defaultValue="多行輸入內容" />
				<TextView label="深色文字檢視欄位" defaultValue="多行欄位內容" />
				<SearchField label="深色搜尋欄位" defaultValue="季度計畫" />
				<PasswordField label="深色密碼欄位" defaultValue="battery-staple" />
				<PhoneField invalid label="深色無效電話" defaultValue="123" error="請輸入完整的電話號碼。" />
			</StateSection>
			<StateSection title="深色結構化輸入控制項">
				<NumberField label="深色數字欄位" defaultValue={42.5} step={0.5} />
				<OTPField label="深色驗證碼" length={6} defaultValue="817204" getSlotLabel={getVerificationCharacterLabel} />
				<CodeField invalid label="深色無效裝置碼" defaultValue="000000" error="無法辨識此裝置碼。" />
				<FileUpload disabled label="深色停用檔案上傳" triggerLabel="無法上傳" />
				<DropZone label="深色檔案拖放區" primaryLabel="將檔案拖放至此" multiple />
			</StateSection>
		</div>
	)
};
