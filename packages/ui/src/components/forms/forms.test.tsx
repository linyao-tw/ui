import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { CodeField, DropZone, FileUpload, Input, NumberField, OTPField, PasswordField, PhoneField, TextField } from "./index";

describe("Input and TextField", () => {
	it("associates its label, description, and external error with the control", () => {
		render(<TextField label="Serial number" description="Printed on the rear plate." error="Serial number is not recognized." invalid required requiredIndicator="REQ" />);

		const input = screen.getByRole("textbox", { name: "Serial number" });
		expect(input).toBeRequired();
		expect(input).toBeInvalid();
		expect(input).toHaveAccessibleDescription(/Printed on the rear plate/);
		expect(input).toHaveAccessibleDescription(/Serial number is not recognized/);
	});

	it("supports uncontrolled and controlled values while preserving Base UI details", async () => {
		const user = userEvent.setup();
		const uncontrolledChange = vi.fn();
		const controlledChange = vi.fn();

		function ControlledInput() {
			const [value, setValue] = React.useState("A");
			return (
				<Input
					aria-label="Controlled code"
					value={value}
					onValueChange={(nextValue, details) => {
						controlledChange(nextValue, details);
						setValue(nextValue);
					}}
				/>
			);
		}

		render(
			<>
				<Input aria-label="Uncontrolled code" defaultValue="B" onValueChange={uncontrolledChange} />
				<ControlledInput />
			</>
		);

		const uncontrolled = screen.getByLabelText("Uncontrolled code");
		const controlled = screen.getByLabelText("Controlled code");
		await user.type(uncontrolled, "2");
		await user.type(controlled, "1");

		expect(uncontrolled).toHaveValue("B2");
		expect(controlled).toHaveValue("A1");
		expect(uncontrolledChange).toHaveBeenLastCalledWith("B2", expect.objectContaining({ reason: "none" }));
		expect(controlledChange).toHaveBeenLastCalledWith("A1", expect.objectContaining({ reason: "none" }));
	});

	it("announces validation messages returned by Base UI validation", async () => {
		const user = userEvent.setup();
		render(<TextField label="Calibration code" validationMode="onChange" validate={value => (value === "CAL-42" ? null : "Enter the calibrated code.")} />);

		const input = screen.getByRole("textbox", { name: "Calibration code" });
		await user.type(input, "x");
		const error = await screen.findByText("Enter the calibrated code.");

		expect(input).toBeInvalid();
		expect(error).toHaveAttribute("aria-live", "polite");
		expect(error).toHaveAttribute("aria-atomic", "true");
	});
});

describe("specialized fields", () => {
	it("gives the password visibility control a stateful accessible label", async () => {
		const user = userEvent.setup();
		render(<PasswordField label="Password" defaultValue="signal-42" />);

		const input = screen.getByLabelText("Password");
		const reveal = screen.getByRole("button", { name: "顯示密碼" });
		expect(input).toHaveAttribute("type", "password");

		await user.click(reveal);
		expect(input).toHaveAttribute("type", "text");
		expect(screen.getByRole("button", { name: "隱藏密碼" })).toHaveAttribute("aria-pressed", "true");
	});
});

describe("NumberField", () => {
	it("formats for the requested locale and reports keyboard changes with Base UI details", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<NumberField label="Output" defaultValue={1234} locale="de-DE" min={0} step={1} invalid error="Outside calibrated range." onValueChange={onValueChange} />);

		const input = screen.getByRole("textbox", { name: "Output" });
		expect(input).toHaveValue("1.234");
		expect(input).toBeInvalid();
		await user.click(input);
		await user.keyboard("{ArrowUp}");

		expect(input).toHaveValue("1.235");
		expect(onValueChange).toHaveBeenLastCalledWith(1235, expect.objectContaining({ reason: "keyboard", direction: 1 }));
	});
});

describe("OTPField", () => {
	it("distributes pasted text, completes the value, and preserves the paste reason", () => {
		const onValueChange = vi.fn();
		const onValueComplete = vi.fn();
		render(<OTPField label="Verification code" length={6} onValueChange={onValueChange} onValueComplete={onValueComplete} />);

		const group = screen.getByRole("group", { name: "Verification code" });
		const inputs = group.querySelectorAll("input");
		expect(inputs[1]).toHaveAccessibleName("第 2 個字元，共 6 個");
		fireEvent.paste(inputs[0] as HTMLInputElement, {
			clipboardData: { getData: () => "123456" }
		});

		expect(Array.from(inputs, input => input.value)).toEqual(["1", "2", "3", "4", "5", "6"]);
		expect(onValueChange).toHaveBeenLastCalledWith("123456", expect.objectContaining({ reason: "input-paste" }));
		expect(onValueComplete).toHaveBeenLastCalledWith("123456", expect.objectContaining({ reason: "input-paste" }));
	});
});

describe("CodeField", () => {
	it("defaults to six individual numeric cells and preserves Base UI paste details", () => {
		const onValueChange = vi.fn();
		const onValueComplete = vi.fn();
		render(<CodeField label="Device code" onValueChange={onValueChange} onValueComplete={onValueComplete} />);

		const group = screen.getByRole("group", { name: "Device code" });
		const inputs = group.querySelectorAll("input");
		expect(inputs).toHaveLength(6);
		expect(group.querySelector(".lyds-code-field__group")).toBeNull();
		expect(inputs[1]).toHaveAccessibleName("第 2 個字元，共 6 個");

		fireEvent.paste(inputs[0] as HTMLInputElement, {
			clipboardData: { getData: () => "123456" }
		});

		expect(Array.from(inputs, input => input.value)).toEqual(["1", "2", "3", "4", "5", "6"]);
		expect(onValueChange).toHaveBeenLastCalledWith("123456", expect.objectContaining({ reason: "input-paste" }));
		expect(onValueComplete).toHaveBeenLastCalledWith("123456", expect.objectContaining({ reason: "input-paste" }));
	});

	it("supports controlled keyboard entry without replacing the Base UI change contract", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();

		function ControlledCode() {
			const [value, setValue] = React.useState("");
			return (
				<CodeField
					label="Controlled code"
					value={value}
					onValueChange={(nextValue, details) => {
						onValueChange(nextValue, details);
						setValue(nextValue);
					}}
				/>
			);
		}

		render(<ControlledCode />);
		const inputs = screen.getByRole("group", { name: "Controlled code" }).querySelectorAll("input");
		await user.click(inputs[0] as HTMLInputElement);
		await user.keyboard("654321");

		expect(Array.from(inputs, input => input.value)).toEqual(["6", "5", "4", "3", "2", "1"]);
		expect(onValueChange).toHaveBeenLastCalledWith("654321", expect.objectContaining({ reason: "input-change" }));
	});

	it("groups long codes by four and lets consumers override grouping", () => {
		const { rerender } = render(<CodeField label="Recovery code" length={12} defaultValue="123456789012" />);
		let root = screen.getByRole("group", { name: "Recovery code" });
		let groups = root.querySelectorAll(".lyds-code-field__group");
		expect(groups).toHaveLength(3);
		expect(Array.from(groups, group => group.querySelectorAll("input").length)).toEqual([4, 4, 4]);

		rerender(<CodeField label="Recovery code" length={8} defaultValue="12345678" />);
		root = screen.getByRole("group", { name: "Recovery code" });
		expect(root.querySelectorAll(".lyds-code-field__group")).toHaveLength(0);
		expect(root.querySelectorAll("input")).toHaveLength(8);

		rerender(<CodeField label="Recovery code" length={8} groupSize={4} defaultValue="12345678" />);
		root = screen.getByRole("group", { name: "Recovery code" });
		groups = root.querySelectorAll(".lyds-code-field__group");
		expect(groups).toHaveLength(2);
		expect(Array.from(groups, group => group.querySelectorAll("input").length)).toEqual([4, 4]);
	});
});

describe("PhoneField", () => {
	it("composes a consumer-owned country selector with an associated phone input", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(
			<PhoneField
				label="Contact phone"
				defaultValue="20000000"
				countrySelector={({ disabled, readOnly, externallyInvalid }) => (
					<button type="button" aria-label="Choose country code" disabled={disabled || readOnly} data-invalid={externallyInvalid || undefined}>
						TW +886
					</button>
				)}
				onValueChange={onValueChange}
			/>
		);

		const selector = screen.getByRole("button", { name: "Choose country code" });
		const input = screen.getByRole("textbox", { name: "Contact phone" });
		expect(selector).toBeEnabled();
		expect(input).toHaveAttribute("type", "tel");
		expect(input).toHaveAttribute("autocomplete", "tel");

		await user.tab();
		expect(selector).toHaveFocus();
		await user.tab();
		expect(input).toHaveFocus();
		await user.keyboard("1");
		expect(input).toHaveValue("1");
		expect(onValueChange).toHaveBeenLastCalledWith("1", expect.objectContaining({ reason: "none" }));
	});

	it("passes field state to the country selector without owning country data", () => {
		render(
			<PhoneField
				label="Unavailable phone"
				disabled
				invalid
				countrySelector={state => (
					<button type="button" aria-label="Choose country code" disabled={state.disabled || state.readOnly} data-invalid={state.externallyInvalid || undefined}>
						Country
					</button>
				)}
			/>
		);

		expect(screen.getByRole("button", { name: "Choose country code" })).toBeDisabled();
		expect(screen.getByRole("textbox", { name: "Unavailable phone" })).toBeDisabled();
	});

	it("treats false, null, and undefined selector nodes as an absent slot", () => {
		const { rerender } = render(<PhoneField label="Contact phone" countrySelector={false} />);
		expect(document.querySelector(".lyds-phone-field")).toBeNull();

		rerender(<PhoneField label="Contact phone" countrySelector={null} />);
		expect(document.querySelector(".lyds-phone-field")).toBeNull();

		rerender(<PhoneField label="Contact phone" countrySelector={undefined} />);
		expect(document.querySelector(".lyds-phone-field")).toBeNull();
	});
});

describe("file controls", () => {
	it("reports files selected with the native file picker", async () => {
		const user = userEvent.setup();
		const onFilesChange = vi.fn();
		const file = new File(["diagnostic"], "diagnostic.txt", { type: "text/plain" });
		render(<FileUpload label="Diagnostic file" description="Attach the exported diagnostic report." onFilesChange={onFilesChange} />);

		const input = screen.getByLabelText<HTMLInputElement>("Diagnostic file 選擇檔案", { selector: "input" });
		expect(input).toHaveAccessibleDescription("Attach the exported diagnostic report.");
		expect(screen.queryAllByRole("button")).toHaveLength(0);
		await user.upload(input, file);

		expect(input.files).toHaveLength(1);
		expect(onFilesChange).toHaveBeenCalledWith([file], expect.any(Object));
		expect(screen.getByRole("status")).toHaveTextContent("已選擇 1 個檔案");
		expect(screen.getByRole("list", { name: "已選擇的檔案" })).toHaveTextContent("diagnostic.txt");
		expect(input).toHaveAccessibleDescription(/已選擇 1 個檔案/);
	});

	it("previews image files and revokes their object URLs", async () => {
		const user = userEvent.setup();
		const createObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:layout-preview");
		const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
		const image = new File(["image"], "layout.png", { type: "image/png" });
		const document = new File(["document"], "requirements.pdf", { type: "application/pdf" });
		const { container, unmount } = render(<FileUpload label="Project files" multiple />);

		await user.upload(screen.getByLabelText<HTMLInputElement>("Project files 選擇檔案", { selector: "input" }), [image, document]);

		expect(screen.getByRole("status")).toHaveTextContent("已選擇 2 個檔案");
		expect(screen.getByText("layout.png")).toBeVisible();
		expect(screen.getByText("requirements.pdf")).toBeVisible();
		await waitFor(() => expect(container.querySelector("img")).toHaveAttribute("src", "blob:layout-preview"));
		expect(container.querySelector("img")).toHaveAttribute("alt", "");
		expect(createObjectURL).toHaveBeenCalledOnce();
		expect(createObjectURL).toHaveBeenCalledWith(image);

		await user.upload(screen.getByLabelText<HTMLInputElement>("Project files 選擇檔案", { selector: "input" }), document);
		await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledWith("blob:layout-preview"));
		expect(container.querySelector("img")).not.toBeInTheDocument();

		unmount();
		expect(revokeObjectURL).toHaveBeenCalledOnce();
		createObjectURL.mockRestore();
		revokeObjectURL.mockRestore();
	});

	it("reports dropped files and exposes a keyboard-operable picker", async () => {
		const user = userEvent.setup();
		const onFilesChange = vi.fn();
		const onChange = vi.fn();
		const onDrop = vi.fn((event: React.DragEvent<HTMLDivElement>) => event.preventDefault());
		const file = new File(["telemetry"], "telemetry.csv", { type: "text/csv" });
		const { container } = render(<DropZone label="Attachments" onChange={onChange} onDrop={onDrop} onFilesChange={onFilesChange} />);
		const zone = container.querySelector<HTMLDivElement>(".lyds-drop-zone");
		const input = screen.getByLabelText<HTMLInputElement>("Attachments 選擇檔案", { selector: "input" });

		expect(zone).not.toBeNull();
		fireEvent.drop(zone as HTMLDivElement, { dataTransfer: { files: [file] } });
		expect(onDrop).toHaveBeenCalledOnce();
		expect(onChange).toHaveBeenCalledOnce();
		expect(onFilesChange).toHaveBeenCalledWith([file], expect.objectContaining({ source: "drop" }));
		expect(screen.getByRole("status")).toHaveTextContent("已選擇 1 個檔案");
		expect(screen.getByRole("list", { name: "已選擇的檔案" })).toHaveTextContent("telemetry.csv");

		await user.tab();
		expect(input).toHaveFocus();
		expect(screen.getByText("選擇檔案").closest("label")).toHaveAttribute("for", input.id);
	});

	it("clears picker and drop-zone previews when their form resets", async () => {
		const user = userEvent.setup();
		const createObjectURL = vi.spyOn(URL, "createObjectURL").mockImplementation(file => `blob:${(file as File).name}`);
		const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
		const uploadImage = new File(["upload"], "upload.png", { type: "image/png" });
		const dropZoneImage = new File(["drop-zone"], "drop-zone.png", { type: "image/png" });
		render(
			<form aria-label="Attachments form">
				<FileUpload label="Upload image" />
				<DropZone label="Drop-zone image" />
			</form>
		);

		await user.upload(screen.getByLabelText<HTMLInputElement>("Upload image 選擇檔案", { selector: "input" }), uploadImage);
		await user.upload(screen.getByLabelText<HTMLInputElement>("Drop-zone image 選擇檔案", { selector: "input" }), dropZoneImage);
		await waitFor(() => expect(document.querySelectorAll(".lyds-file-selection__thumbnail")).toHaveLength(2));
		expect(screen.getAllByText("已選擇 1 個檔案")).toHaveLength(2);

		const form = screen.getByRole<HTMLFormElement>("form", { name: "Attachments form" });
		act(() => {
			form.reset();
		});

		await waitFor(() => expect(screen.queryByRole("list", { name: "已選擇的檔案" })).not.toBeInTheDocument());
		expect(screen.getAllByRole("status").every(status => status.textContent === "")).toBe(true);
		expect(revokeObjectURL).toHaveBeenCalledWith("blob:upload.png");
		expect(revokeObjectURL).toHaveBeenCalledWith("blob:drop-zone.png");
		expect(revokeObjectURL).toHaveBeenCalledTimes(2);
		expect(createObjectURL).toHaveBeenCalledTimes(2);
		createObjectURL.mockRestore();
		revokeObjectURL.mockRestore();
	});

	it("locks picker and drop interactions when read-only", () => {
		const onUploadFiles = vi.fn();
		const onDropFiles = vi.fn();
		const file = new File(["locked"], "locked.txt", { type: "text/plain" });
		const { container } = render(
			<>
				<FileUpload label="Locked picker" readOnly onFilesChange={onUploadFiles} />
				<DropZone label="Locked drop zone" readOnly onFilesChange={onDropFiles} />
			</>
		);

		expect(screen.getByLabelText("Locked picker 選擇檔案", { selector: "input" })).toBeDisabled();
		expect(screen.getAllByText("選擇檔案")[0]?.closest("label")).toHaveAttribute("data-disabled");
		expect(screen.getByLabelText("Locked drop zone 選擇檔案", { selector: "input" })).toBeDisabled();
		expect(screen.getAllByText("選擇檔案")[1]?.closest("label")).toHaveAttribute("data-disabled");

		const zone = container.querySelector<HTMLDivElement>(".lyds-drop-zone");
		expect(zone).not.toBeNull();
		fireEvent.drop(zone as HTMLDivElement, { dataTransfer: { files: [file] } });
		expect(onUploadFiles).not.toHaveBeenCalled();
		expect(onDropFiles).not.toHaveBeenCalled();
		expect(screen.getAllByRole("status").every(status => status.textContent === "")).toBe(true);
	});
});

describe("accessibility", () => {
	it("has no detectable structural violations in a mixed form", async () => {
		const { container } = render(
			<form>
				<TextField label="Unit name" description="Shown on the control plate." required />
				<PasswordField label="Access key" />
				<NumberField label="Target output" defaultValue={12} />
				<OTPField label="Verification code" length={4} />
				<CodeField label="Device code" />
				<PhoneField
					label="Contact phone"
					countrySelector={
						<button type="button" aria-label="Choose country code">
							TW +886
						</button>
					}
				/>
				<FileUpload label="Diagnostic file" />
				<DropZone label="Attachments" />
			</form>
		);

		const results = await axe.run(container, {
			rules: { "color-contrast": { enabled: false } }
		});
		expect(results.violations).toEqual([]);
	});
});
