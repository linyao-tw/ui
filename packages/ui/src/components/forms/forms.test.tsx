import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { DropZone, FileUpload, Input, NumberField, OTPField, PasswordField, TextField } from "./index";

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
		const reveal = screen.getByRole("button", { name: "Show password" });
		expect(input).toHaveAttribute("type", "password");

		await user.click(reveal);
		expect(input).toHaveAttribute("type", "text");
		expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true");
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
		expect(inputs[1]).toHaveAccessibleName("Character 2 of 6");
		fireEvent.paste(inputs[0] as HTMLInputElement, {
			clipboardData: { getData: () => "123456" }
		});

		expect(Array.from(inputs, input => input.value)).toEqual(["1", "2", "3", "4", "5", "6"]);
		expect(onValueChange).toHaveBeenLastCalledWith("123456", expect.objectContaining({ reason: "input-paste" }));
		expect(onValueComplete).toHaveBeenLastCalledWith("123456", expect.objectContaining({ reason: "input-paste" }));
	});
});

describe("file controls", () => {
	it("reports files selected with the native file picker", async () => {
		const user = userEvent.setup();
		const onFilesChange = vi.fn();
		const file = new File(["diagnostic"], "diagnostic.txt", { type: "text/plain" });
		render(<FileUpload label="Diagnostic file" description="Attach the exported diagnostic report." onFilesChange={onFilesChange} />);

		const input = screen.getByLabelText<HTMLInputElement>("Diagnostic file", { selector: "input" });
		const trigger = screen.getByRole("button", { name: "Diagnostic file Choose file" });
		expect(trigger).toHaveAccessibleDescription("Attach the exported diagnostic report.");
		await user.upload(input, file);

		expect(input.files).toHaveLength(1);
		expect(onFilesChange).toHaveBeenCalledWith([file], expect.any(Object));
	});

	it("reports dropped files and exposes a keyboard-operable picker", async () => {
		const user = userEvent.setup();
		const onFilesChange = vi.fn();
		const onChange = vi.fn();
		const onDrop = vi.fn((event: React.DragEvent<HTMLDivElement>) => event.preventDefault());
		const file = new File(["telemetry"], "telemetry.csv", { type: "text/csv" });
		const { container } = render(<DropZone label="Attachments" onChange={onChange} onDrop={onDrop} onFilesChange={onFilesChange} />);
		const zone = container.querySelector<HTMLDivElement>(".lyds-drop-zone");
		const input = screen.getByLabelText<HTMLInputElement>("Attachments", { selector: "input" });
		const inputClick = vi.spyOn(input, "click");

		expect(zone).not.toBeNull();
		fireEvent.drop(zone as HTMLDivElement, { dataTransfer: { files: [file] } });
		expect(onDrop).toHaveBeenCalledOnce();
		expect(onChange).toHaveBeenCalledOnce();
		expect(onFilesChange).toHaveBeenCalledWith([file], expect.objectContaining({ source: "drop" }));

		const browseButton = screen.getByRole("button", { name: "Attachments Choose files" });
		browseButton.focus();
		await user.keyboard("{Enter}");
		expect(inputClick).toHaveBeenCalledOnce();
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

		expect(screen.getByLabelText("Locked picker", { selector: "input" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Locked picker Choose file" })).toBeDisabled();
		expect(screen.getByLabelText("Locked drop zone", { selector: "input" })).toBeDisabled();
		expect(screen.getByRole("button", { name: "Locked drop zone Choose files" })).toBeDisabled();

		const zone = container.querySelector<HTMLDivElement>(".lyds-drop-zone");
		expect(zone).not.toBeNull();
		fireEvent.drop(zone as HTMLDivElement, { dataTransfer: { files: [file] } });
		expect(onUploadFiles).not.toHaveBeenCalled();
		expect(onDropFiles).not.toHaveBeenCalled();
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
