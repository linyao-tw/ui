import { cx } from "@/internal";
import { useMessages } from "@/intl";
import { Input as BaseInput } from "@base-ui/react/input";
import { FileIcon } from "@phosphor-icons/react/dist/csr/File";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import * as React from "react";
import "./forms.css";
import { FieldFrame, type FieldAnatomyProps } from "./internal";
type NativeFileInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"children" | "className" | "defaultValue" | "disabled" | "name" | "onChange" | "readOnly" | "required" | "size" | "style" | "type" | "value"
>;

function FileImagePreview({ file }: { file: File }) {
	const [preview, setPreview] = React.useState<{ file: File; url: string } | null>(null);

	React.useEffect(() => {
		if (typeof URL.createObjectURL !== "function" || typeof URL.revokeObjectURL !== "function") return;

		const previewUrl = URL.createObjectURL(file);
		let disposed = false;
		queueMicrotask(() => {
			if (!disposed) {
				setPreview({ file, url: previewUrl });
			}
		});

		return () => {
			disposed = true;
			URL.revokeObjectURL(previewUrl);
		};
	}, [file]);

	if (preview?.file !== file) return <FileIcon aria-hidden="true" weight="regular" />;
	return <img className="lyds-file-selection__thumbnail" src={preview.url} alt="" width={48} height={48} loading="lazy" decoding="async" />;
}

function isFileAccepted(file: File, accept: string | undefined): boolean {
	if (!accept?.trim()) return true;

	const fileName = file.name.toLocaleLowerCase();
	const mimeType = file.type.toLocaleLowerCase();
	return accept.split(",").some(rawRule => {
		const rule = rawRule.trim().toLocaleLowerCase();
		if (!rule) return false;
		if (rule.startsWith(".")) return fileName.endsWith(rule);
		if (rule.endsWith("/*")) return mimeType.startsWith(rule.slice(0, -1));
		return mimeType === rule;
	});
}

interface FileSelectionPreviewProps {
	accept: string | undefined;
	files: readonly File[];
	invalidFileLabel: React.ReactNode;
	summaryId: string;
}

function FileSelectionPreview({ accept, files, invalidFileLabel, summaryId }: FileSelectionPreviewProps) {
	const messages = useMessages();

	return (
		<div className={cx("lyds-file-selection", files.length === 0 && "lyds-sr-only")}>
			<p id={summaryId} className="lyds-file-selection__summary" role="status" aria-live="polite" aria-atomic="true">
				{files.length > 0 ? messages.fileSelectionSummary(files.length) : null}
			</p>
			{files.length > 0 ? (
				<ul className="lyds-file-selection__list" aria-label={messages.fileSelectionLabel}>
					{files.map((file, index) => {
						const accepted = isFileAccepted(file, accept);
						return (
							<li className="lyds-file-selection__item" data-invalid={accepted ? undefined : ""} key={`${file.name}-${file.size}-${file.lastModified}-${index}`}>
								<span className="lyds-file-selection__visual">{file.type.startsWith("image/") ? <FileImagePreview file={file} /> : <FileIcon aria-hidden="true" weight="regular" />}</span>
								<span className="lyds-file-selection__details">
									<span className="lyds-file-selection__name" title={file.name}>
										{file.name}
									</span>
									{accepted ? null : <span className="lyds-file-selection__status">{invalidFileLabel}</span>}
								</span>
							</li>
						);
					})}
				</ul>
			) : null}
		</div>
	);
}

function useClearFileSelectionOnFormReset(inputRef: React.RefObject<HTMLInputElement | null>, formId: string | undefined, setSelectedFiles: React.Dispatch<React.SetStateAction<readonly File[]>>) {
	React.useEffect(() => {
		const form = inputRef.current?.form;
		if (form == null) return;

		const handleReset = () => setSelectedFiles([]);
		form.addEventListener("reset", handleReset);
		return () => form.removeEventListener("reset", handleReset);
	}, [formId, inputRef, setSelectedFiles]);
}

/**
 * HTML has no read-only file input. Disabling one would drop whatever the user already picked from
 * the submission, so a read-only field stays enabled and simply refuses to open the picker.
 */
function useBlockedPicker(readOnly: boolean | undefined, onClick: React.MouseEventHandler<HTMLInputElement> | undefined) {
	return (event: React.MouseEvent<HTMLInputElement>) => {
		onClick?.(event);
		if (readOnly) event.preventDefault();
	};
}

interface FileTriggerProps {
	children: React.ReactNode;
	className: string;
	disabled: boolean;
	htmlFor: string;
	id: string;
	readOnly: boolean;
	size: FieldAnatomyProps["size"];
	startIcon?: React.ReactNode;
}

/**
 * The visible affordance is a label bound to the real file input, so the input keeps the single
 * tab stop, the accessible name and native picker activation. Rendering a button beside the input
 * instead would leave the description, error and validity on an element the keyboard cannot reach.
 */
function FileTrigger({ children, className, disabled, htmlFor, id, readOnly, size, startIcon }: FileTriggerProps) {
	return (
		<label className={cx("lyds-button", className)} data-disabled={disabled || undefined} data-readonly={readOnly || undefined} data-size={size} data-variant="secondary" htmlFor={htmlFor}>
			{startIcon != null ? (
				<span className="lyds-button__icon" aria-hidden="true">
					{startIcon}
				</span>
			) : null}
			<span className="lyds-button__label" id={id}>
				{children}
			</span>
		</label>
	);
}

export interface FileUploadProps extends NativeFileInputProps, FieldAnatomyProps {
	inputClassName?: string;
	inputStyle?: React.CSSProperties;
	triggerLabel?: React.ReactNode;
	invalidFileLabel?: React.ReactNode;
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
		triggerLabel,
		invalidFileLabel,
		onChange,
		onFilesChange,
		id: idProp,
		...inputProps
	},
	forwardedRef
) {
	const messages = useMessages();
	const blockPickerWhenReadOnly = useBlockedPicker(readOnly, inputProps.onClick);
	const generatedId = React.useId();
	const id = idProp ?? generatedId;
	const labelId = `${id}-label`;
	const descriptionId = `${id}-description`;
	const errorId = `${id}-error`;
	const triggerId = `${id}-trigger-label`;
	const selectionSummaryId = `${id}-selection-summary`;
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [selectedFiles, setSelectedFiles] = React.useState<readonly File[]>([]);
	useClearFileSelectionOnFormReset(inputRef, inputProps.form, setSelectedFiles);
	React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled || readOnly) return;
		onChange?.(event);
		if (!event.defaultPrevented) {
			const files = Array.from(event.currentTarget.files ?? []);
			setSelectedFiles(files);
			onFilesChange?.(files, event);
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
					disabled={disabled}
					readOnly={readOnly}
					aria-disabled={readOnly || undefined}
					onClick={blockPickerWhenReadOnly}
					required={required}
					aria-invalid={invalid || undefined}
					aria-labelledby={label != null ? `${labelId} ${triggerId}` : triggerId}
					aria-describedby={cx(description != null && descriptionId, selectedFiles.length > 0 && selectionSummaryId, error != null && errorId) || undefined}
					onChange={handleChange}
				/>
				<FileTrigger className="lyds-file-upload__trigger" disabled={Boolean(disabled)} htmlFor={id} id={triggerId} readOnly={Boolean(readOnly)} size={size}>
					{triggerLabel ?? messages.fileUploadTrigger}
				</FileTrigger>
				<FileSelectionPreview accept={inputProps.accept} files={selectedFiles} invalidFileLabel={invalidFileLabel ?? messages.fileUploadInvalidFile} summaryId={selectionSummaryId} />
			</div>
		</FieldFrame>
	);
});

export type DropZoneChangeDetails = { source: "input"; event: React.ChangeEvent<HTMLInputElement> } | { source: "drop"; event: React.DragEvent<HTMLDivElement> };

export interface DropZoneProps extends NativeFileInputProps, FieldAnatomyProps {
	inputClassName?: string;
	primaryLabel?: React.ReactNode;
	secondaryLabel?: React.ReactNode;
	browseLabel?: React.ReactNode;
	invalidFileLabel?: React.ReactNode;
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
		primaryLabel,
		secondaryLabel,
		browseLabel,
		invalidFileLabel,
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
	const messages = useMessages();
	const blockPickerWhenReadOnly = useBlockedPicker(readOnly, inputProps.onClick);
	const generatedId = React.useId();
	const id = idProp ?? generatedId;
	const labelId = `${id}-label`;
	const descriptionId = `${id}-description`;
	const errorId = `${id}-error`;
	const triggerId = `${id}-trigger-label`;
	const selectionSummaryId = `${id}-selection-summary`;
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [dragging, setDragging] = React.useState(false);
	const [selectedFiles, setSelectedFiles] = React.useState<readonly File[]>([]);
	const dragDepth = React.useRef(0);
	const pendingDrop = React.useRef<{ event: React.DragEvent<HTMLDivElement>; files: readonly File[]; handled: boolean } | null>(null);
	useClearFileSelectionOnFormReset(inputRef, inputProps.form, setSelectedFiles);

	React.useImperativeHandle(forwardedRef, () => inputRef.current as HTMLInputElement);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled || readOnly) return;
		onChange?.(event);
		if (event.defaultPrevented) return;

		const drop = pendingDrop.current;
		if (drop != null) {
			drop.handled = true;
			setSelectedFiles(drop.files);
			onFilesChange?.(drop.files, { source: "drop", event: drop.event });
			return;
		}

		const files = Array.from(event.currentTarget.files ?? []);
		setSelectedFiles(files);
		onFilesChange?.(files, { source: "input", event });
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
				// 部分瀏覽器會提供唯讀的 FileList。回呼仍是檔案狀態的主要來源，
				// 觸發 change 事件則可同步更新原生驗證狀態。
			}

			const drop = { event, files, handled: false };
			pendingDrop.current = drop;
			inputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
			pendingDrop.current = null;
			if (!drop.handled) {
				setSelectedFiles(files);
				onFilesChange?.(files, { source: "drop", event });
			}
			return;
		}
		setSelectedFiles(files);
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
				disabled={disabled}
				readOnly={readOnly}
				aria-disabled={readOnly || undefined}
				onClick={blockPickerWhenReadOnly}
				required={required}
				aria-invalid={invalid || undefined}
				aria-labelledby={label != null ? `${labelId} ${triggerId}` : triggerId}
				aria-describedby={cx(description != null && descriptionId, selectedFiles.length > 0 && selectionSummaryId, error != null && errorId) || undefined}
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
				<span className="lyds-drop-zone__copy">
					<span className="lyds-drop-zone__primary">{primaryLabel ?? messages.dropZonePrimary}</span>
					<span className="lyds-drop-zone__secondary">{secondaryLabel ?? messages.dropZoneSecondary}</span>
				</span>
				<FileTrigger
					className="lyds-drop-zone__button"
					disabled={Boolean(disabled)}
					htmlFor={id}
					id={triggerId}
					readOnly={Boolean(readOnly)}
					size={size}
					startIcon={<PlusIcon aria-hidden="true" weight="bold" />}
				>
					{browseLabel ?? messages.dropZoneBrowse}
				</FileTrigger>
				<FileSelectionPreview accept={inputProps.accept} files={selectedFiles} invalidFileLabel={invalidFileLabel ?? messages.fileUploadInvalidFile} summaryId={selectionSummaryId} />
			</div>
		</FieldFrame>
	);
});
