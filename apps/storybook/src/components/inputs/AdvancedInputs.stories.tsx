import { CodeField, DropZone, FileUpload, NumberField, OTPField, PhoneField } from "@lyds/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";

import "../story-layout.css";

const meta = {
	title: "元件/輸入/進階輸入",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const NumericAndContact: Story = {
	name: "數字與聯絡方式",
	render: () => (
		<div className="lyds-story-form">
			<NumberField label="每月預算" description="地區格式與數值限制由應用程式設定。" defaultValue={42.5} min={0} max={120} step={0.5} />
			<NumberField label="核准數量" defaultValue={17} readOnly showSteppers={false} />
			<CodeField label="驗證碼" description="六位數字驗證碼。" defaultValue="073142" />
			<PhoneField
				label="聯絡電話"
				defaultValue="2 0000 0000"
				countrySelector={({ disabled, readOnly }) => (
					<button type="button" aria-label="選擇國碼" disabled={disabled || readOnly}>
						<span aria-hidden="true">臺灣</span>
						<span aria-hidden="true">+886</span>
					</button>
				)}
			/>
		</div>
	)
};

export const VerificationCode: Story = {
	name: "驗證碼",
	render: () => (
		<div className="lyds-story-stack lyds-story-stack--narrow">
			<CodeField label="登入驗證碼" description="貼上或輸入六位數驗證碼。" getSlotLabel={index => `第 ${index + 1} 位數字`} />
			<CodeField label="備援碼" description="長備援碼預設每四位一組。" length={12} defaultValue="073142635987" />
			<CodeField label="自訂分組" description="八位驗證碼每四位一組。" length={8} groupSize={4} defaultValue="20260831" />
			<OTPField label="驗證碼" description="貼上或輸入六位字元驗證碼。" length={6} separatorAfter={[3]} getSlotLabel={index => `第 ${index + 1} 個字元`} />
			<OTPField label="過期驗證碼" length={4} invalid error="驗證碼已過期。" />
		</div>
	)
};

export const FileSelection: Story = {
	name: "選擇檔案",
	render: () => (
		<div className="lyds-story-grid">
			<FileUpload label="專案壓縮檔" description="接受應用程式指定的檔案類型。" accept=".zip" />
			<FileUpload label="已簽署合約" disabled triggerLabel="檔案無法使用" />
		</div>
	)
};

export const DropZoneSurface: Story = {
	name: "檔案拖放區",
	render: () => (
		<div className="lyds-story-stack">
			<DropZone label="附件" description="拖放一個或多個檔案，或開啟系統檔案選擇器。" primaryLabel="將檔案拖放至此" secondaryLabel="允許的檔案類型由應用程式設定" multiple />
		</div>
	)
};
