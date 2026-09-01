import { Input as BaseInput } from "@base-ui/react/input";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import * as React from "react";
import "./forms.css";
import { cx, FieldFrame, type FieldAnatomyProps } from "./internal";

type NativeFileInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"children" | "className" | "defaultValue" | "disabled" | "name" | "onChange" | "readOnly" | "required" | "size" | "style" | "type" | "value"
>;

export interface FileUploadProps extends NativeFileInputProps, FieldAnatomyProps {
	inputClassName?: string;
	inputStyle?: React.CSSProperties;
	triggerLabel?: React.ReactNode;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onFilesChange?: (files: readonly File[], event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
	{
		label,
		description,
		error,
		invalid,
		disabled,
		readOnly,
		required,
		name,
		size = "md",
		className,
		style,
		requiredIndicator,
		validate,
		validationMode,
		validationDebounceTime,
		dirty,
		touched,
		actionsRef,
		inputClassName,
		inputStyle,
		triggerLabel = "Choose file",
		onChange,
		onFilesChange,
		id: idProp,
		...inputProps
	},
	forwardedRef
) {
	const generatedId = React.useId();
	const id = idProp ?? generatedId;
	const labelId = `${id}-label`;
	const descriptionId = `${id}-description`;
	const errorId = `${id}-error`;
	const triggerId = `${id}-trigger-label`;
	const inputRef = React.useRef<HTMLInputElement>(null);
	React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled || readOnly) return;
		onChange?.(event);
		if (!event.defaultPrevented) {
			onFilesChange?.(Array.from(event.currentTarget.files ?? []), event);
		}
	};

	return (
		<FieldFrame
			label={label}
			description={description}
			error={error}
			invalid={invalid}
			disabled={disabled}
			readOnly={readOnly}
			required={required}
			name={name}
			size={size}
			className={className}
			style={style}
			requiredIndicator={requiredIndicator}
			labelId={labelId}
			descriptionId={descriptionId}
			errorId={errorId}
			validate={validate}
			validationMode={validationMode}
			validationDebounceTime={validationDebounceTime}
			dirty={dirty}
			touched={touched}
			actionsRef={actionsRef}
		>
			<div className="lyds-file-upload" data-size={size}>
				<BaseInput
					{...inputProps}
					ref={inputRef}
					id={id}
					type="file"
					className={cx("lyds-file-upload__input", inputClassName)}
					style={inputStyle}
					disabled={disabled || readOnly}
					readOnly={readOnly}
					required={required}
					aria-invalid={invalid || undefined}
					tabIndex={-1}
					onChange={handleChange}
				/>
				<button
					className="lyds-file-upload__trigger"
					type="button"
					disabled={disabled || readOnly}
					aria-controls={id}
					aria-labelledby={label != null ? `${labelId} ${triggerId}` : triggerId}
					aria-describedby={[description != null ? descriptionId : null, errorId].filter(Boolean).join(" ")}
					onClick={() => inputRef.current?.click()}
				>
					<span className="lyds-file-upload__signal" aria-hidden="true" />
					<span id={triggerId}>{triggerLabel}</span>
				</button>
			</div>
		</FieldFrame>
	);
});

export type DropZoneChangeDetails = { source: "input"; event: React.ChangeEvent<HTMLInputElement> } | { source: "drop"; event: React.DragEvent<HTMLDivElement> };

export interface DropZoneProps extends NativeFileInputProps, FieldAnatomyProps {
	inputClassName?: string;
	primaryLabel?: React.ReactNode;
	secondaryLabel?: React.ReactNode;
	browseLabel?: string;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	onFilesChange?: (files: readonly File[], details: DropZoneChangeDetails) => void;
	onDragEnter?: React.DragEventHandler<HTMLDivElement>;
	onDragOver?: React.DragEventHandler<HTMLDivElement>;
	onDragLeave?: React.DragEventHandler<HTMLDivElement>;
	onDrop?: React.DragEventHandler<HTMLDivElement>;
}

export const DropZone = React.forwardRef<HTMLInputElement, DropZoneProps>(function DropZone(
	{
		label,
		description,
		error,
		invalid,
		disabled,
		readOnly,
		required,
		name,
		size = "md",
		className,
		style,
		requiredIndicator,
		validate,
		validationMode,
		validationDebounceTime,
		dirty,
		touched,
		actionsRef,
		inputClassName,
		primaryLabel = "Drop files here",
		secondaryLabel = "or choose from your device",
		browseLabel = "Choose files",
		onChange,
		onFilesChange,
		onDragEnter,
		onDragOver,
		onDragLeave,
		onDrop,
		id: idProp,
		...inputProps
	},
	forwardedRef
) {
	const generatedId = React.useId();
	const id = idProp ?? generatedId;
	const labelId = `${id}-label`;
	const descriptionId = `${id}-description`;
	const errorId = `${id}-error`;
	const triggerId = `${id}-trigger-label`;
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = React.useState(false);
	const dragDepth = React.useRef(0);
	const pendingDrop = React.useRef<{ event: React.DragEvent<HTMLDivElement>; files: readonly File[]; handled: boolean } | null>(null);

	React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled || readOnly) return;
		onChange?.(event);
		if (event.defaultPrevented) return;

		const drop = pendingDrop.current;
		if (drop != null) {
			drop.handled = true;
			onFilesChange?.(drop.files, { source: "drop", event: drop.event });
			return;
		}

		onFilesChange?.(Array.from(event.currentTarget.files ?? []), { source: "input", event });
	};

	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		if (disabled || readOnly) {
			onDragEnter?.(event);
			return;
		}
		event.preventDefault();
		onDragEnter?.(event);
		dragDepth.current += 1;
		setDragging(true);
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		if (disabled || readOnly) {
			onDragOver?.(event);
			return;
		}
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
		onDragOver?.(event);
	};

	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		onDragLeave?.(event);
		if (disabled || readOnly) return;
		dragDepth.current = Math.max(0, dragDepth.current - 1);
		if (dragDepth.current === 0) setDragging(false);
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		if (disabled || readOnly) {
			onDrop?.(event);
			return;
		}
		event.preventDefault();
		onDrop?.(event);
		dragDepth.current = 0;
		setDragging(false);
		const files = Array.from(event.dataTransfer.files ?? []);
		if (inputRef.current != null) {
			try {
				inputRef.current.files = event.dataTransfer.files;
			} catch {
				// Some browsers expose a read-only FileList. The callback remains authoritative,
				// while the dispatched change still refreshes native validity.
			}

			const drop = { event, files, handled: false };
			pendingDrop.current = drop;
			inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
			pendingDrop.current = null;
			if (!drop.handled) {
				onFilesChange?.(files, { source: "drop", event });
			}
			return;
		}
		onFilesChange?.(files, { source: "drop", event });
	};

	return (
		<FieldFrame
			label={label}
			description={description}
			error={error}
			invalid={invalid}
			disabled={disabled}
			readOnly={readOnly}
			required={required}
			name={name}
			size={size}
			className={className}
			style={style}
			requiredIndicator={requiredIndicator}
			labelId={labelId}
			descriptionId={descriptionId}
			errorId={errorId}
			validate={validate}
			validationMode={validationMode}
			validationDebounceTime={validationDebounceTime}
			dirty={dirty}
			touched={touched}
			actionsRef={actionsRef}
		>
			<BaseInput
				{...inputProps}
				ref={inputRef}
				id={id}
				type="file"
				className={cx("lyds-drop-zone__input", inputClassName)}
				disabled={disabled || readOnly}
				readOnly={readOnly}
				required={required}
				aria-invalid={invalid || undefined}
				tabIndex={-1}
				onChange={handleInputChange}
			/>
			<div
				className="lyds-drop-zone"
				data-size={size}
				data-dragging={dragging || undefined}
				data-disabled={disabled || undefined}
				data-readonly={readOnly || undefined}
				onDragEnter={handleDragEnter}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
			>
				<span className="lyds-drop-zone__plate" aria-hidden="true">
					<span>FILE</span>
					<span>IN</span>
				</span>
				<span className="lyds-drop-zone__copy">
					<span className="lyds-drop-zone__primary">{primaryLabel}</span>
					<span className="lyds-drop-zone__secondary">{secondaryLabel}</span>
				</span>
				<button
					className="lyds-drop-zone__button"
					type="button"
					disabled={disabled || readOnly}
					aria-controls={id}
					aria-labelledby={label != null ? `${labelId} ${triggerId}` : triggerId}
					aria-describedby={[description != null ? descriptionId : null, errorId].filter(Boolean).join(" ")}
					onClick={() => inputRef.current?.click()}
				>
					<PlusIcon aria-hidden="true" weight="bold" />
					<span id={triggerId}>{browseLabel}</span>
				</button>
			</div>
		</FieldFrame>
	);
});
