import { CodeField, DropZone, FileUpload, NumberField, OTPField, PhoneField } from "@linyao.tw/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import "../story-layout.css";

const meta = {
	title: "元件/輸入/進階輸入",
	parameters: { layout: "padded" }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

async function createPreviewImage() {
	const canvas = document.createElement("canvas");
	canvas.width = 120;
	canvas.height = 80;
	const context = canvas.getContext("2d");
	if (context == null) throw new Error("無法建立預覽圖片。");

	const styles = getComputedStyle(document.documentElement);
	context.fillStyle = styles.getPropertyValue("--background-secondary").trim();
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = styles.getPropertyValue("--control-primary").trim();
	context.fillRect(0, 0, 44, canvas.height);
	context.fillStyle = styles.getPropertyValue("--text-main").trim();
	context.fillRect(60, 24, 44, 8);
	context.fillRect(60, 44, 30, 8);

	const blob = await new Promise<Blob>((resolve, reject) => {
		canvas.toBlob(value => (value == null ? reject(new Error("無法輸出預覽圖片。")) : resolve(value)), "image/png");
	});
	return new File([blob], "版面預覽.png", { type: "image/png" });
}

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
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText("設計附件 選擇檔案");
		await userEvent.upload(input, [await createPreviewImage(), new File(["PDF"], "規格文件.pdf", { type: "application/pdf" })]);
		await expect(canvas.getByText("已選擇 2 個檔案")).toBeVisible();
		await expect(canvas.getByText("版面預覽.png")).toBeVisible();
		await expect(canvas.getByText("規格文件.pdf")).toBeVisible();
	},
	render: () => (
		<div className="lyds-story-grid">
			<FileUpload label="設計附件" description="選擇圖片或 PDF 檔案。" accept="image/*,.pdf" multiple />
			<FileUpload label="已簽署合約" disabled triggerLabel="檔案無法使用" />
		</div>
	)
};

export const DropZoneSurface: Story = {
	name: "檔案拖放區",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText("附件 選擇檔案");
		await userEvent.upload(input, [await createPreviewImage(), new File(["CSV"], "資料欄位.csv", { type: "text/csv" })]);
		await expect(canvas.getByRole("status")).toHaveTextContent("已選擇 2 個檔案");
		await expect(canvas.getByRole("list", { name: "已選擇的檔案" })).toBeVisible();
	},
	render: () => (
		<div className="lyds-story-stack">
			<DropZone label="附件" description="拖放一個或多個檔案，或開啟系統檔案選擇器。" primaryLabel="將檔案拖放至此" secondaryLabel="允許的檔案類型由應用程式設定" multiple />
		</div>
	)
};

export const RejectedFileType: Story = {
	name: "不接受的檔案類型",
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText("圖片附件 選擇檔案");
		await userEvent.upload(input, new File(["PDF"], "版面規格.pdf", { type: "application/pdf" }), { applyAccept: false });
		const fileName = canvas.getByText("版面規格.pdf");
		const status = canvas.getByText("不支援的檔案類型");
		await expect(fileName).toBeVisible();
		await expect(status).toBeVisible();
		await expect(canvas.getAllByText("不支援的檔案類型")).toHaveLength(1);
		await expect(getComputedStyle(fileName).color).toBe(getComputedStyle(status).color);
		await expect(
			Math.abs(fileName.getBoundingClientRect().top + fileName.getBoundingClientRect().height / 2 - (status.getBoundingClientRect().top + status.getBoundingClientRect().height / 2))
		).toBeLessThanOrEqual(1);
	},
	render: () => <FileUpload accept="image/*" label="圖片附件" description="只接受圖片檔案。" />
};
