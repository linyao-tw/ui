import { Field as BaseField } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import * as React from "react";
import "./forms.css";
import { cx, FieldFrame, withStateClassName, type FieldAnatomyProps } from "./internal";

type TextFieldInputProps = Omit<BaseInput.Props, "className" | "disabled" | "name" | "readOnly" | "required" | "size" | "style">;

export interface TextFieldProps extends TextFieldInputProps, FieldAnatomyProps {
	inputClassName?: BaseInput.Props["className"];
	inputStyle?: React.CSSProperties;
	/** The native HTML size attribute, not the LYDS visual size. */
	inputSize?: number;
	startAdornment?: React.ReactNode;
	endAdornment?: React.ReactNode;
	/** Uses technical tabular/monospace typography without changing the input value. */
	technical?: boolean;
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
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
		inputSize,
		startAdornment,
		endAdornment,
		technical,
		"aria-invalid": ariaInvalid,
		...inputProps
	},
	ref
) {
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
			validate={validate}
			validationMode={validationMode}
			validationDebounceTime={validationDebounceTime}
			dirty={dirty}
			touched={touched}
			actionsRef={actionsRef}
		>
			<div className="lyds-field__control-frame" data-size={size} data-technical={technical || undefined}>
				{startAdornment != null ? <span className="lyds-field__adornment lyds-field__adornment--start">{startAdornment}</span> : null}
				<BaseInput
					{...inputProps}
					ref={ref}
					className={withStateClassName<BaseInput.State>("lyds-field__input", inputClassName)}
					style={inputStyle}
					disabled={disabled}
					readOnly={readOnly}
					required={required}
					size={inputSize}
					aria-invalid={invalid ? true : ariaInvalid}
				/>
				{endAdornment != null ? <span className="lyds-field__adornment lyds-field__adornment--end">{endAdornment}</span> : null}
			</div>
		</FieldFrame>
	);
});

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "className" | "size" | "style"> {
	size?: FieldAnatomyProps["size"] | undefined;
	invalid?: boolean | undefined;
	className?: string | undefined;
	style?: React.CSSProperties | undefined;
	onValueChange?: (value: string, eventDetails: BaseField.Control.ChangeEventDetails) => void;
}

const TextareaControl = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function TextareaControl(
	{ size = "md", invalid, disabled, readOnly, required, name, value, defaultValue, onValueChange, className, style, "aria-invalid": ariaInvalid, ...props },
	ref
) {
	return (
		<BaseField.Root className="lyds-input-root" name={name} disabled={disabled} invalid={invalid} data-size={size} data-readonly={readOnly || undefined} data-required={required || undefined}>
			<BaseField.Control
				ref={ref}
				render={<textarea {...props} />}
				className={cx("lyds-textarea", className)}
				style={style}
				disabled={disabled}
				readOnly={readOnly}
				required={required}
				value={value}
				defaultValue={defaultValue}
				onValueChange={onValueChange}
				aria-invalid={invalid ? true : ariaInvalid}
				data-size={size}
			/>
		</BaseField.Root>
	);
});

/** A standalone, Base UI-backed multiline control. */
export const Textarea = TextareaControl;

export interface TextViewProps extends Omit<TextareaProps, "className" | "disabled" | "invalid" | "name" | "readOnly" | "required" | "size" | "style">, FieldAnatomyProps {
	textareaClassName?: string;
	textareaStyle?: React.CSSProperties;
}

/** A complete multiline field using the same anatomy as TextField. */
export const TextView = React.forwardRef<HTMLTextAreaElement, TextViewProps>(function TextView(
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
		textareaClassName,
		textareaStyle,
		value,
		defaultValue,
		onValueChange,
		"aria-invalid": ariaInvalid,
		...textareaProps
	},
	ref
) {
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
			validate={validate}
			validationMode={validationMode}
			validationDebounceTime={validationDebounceTime}
			dirty={dirty}
			touched={touched}
			actionsRef={actionsRef}
		>
			<BaseField.Control
				ref={ref}
				render={<textarea {...textareaProps} />}
				className={cx("lyds-textarea", textareaClassName)}
				style={textareaStyle}
				disabled={disabled}
				readOnly={readOnly}
				required={required}
				value={value}
				defaultValue={defaultValue}
				onValueChange={onValueChange}
				aria-invalid={invalid ? true : ariaInvalid}
				data-size={size}
			/>
		</FieldFrame>
	);
});

function SearchIcon() {
	return (
		<svg className="lyds-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
			<circle cx="10.75" cy="10.75" r="6.25" />
			<path d="m15.5 15.5 4 4" />
		</svg>
	);
}

export interface SearchFieldProps extends Omit<TextFieldProps, "startAdornment" | "type"> {
	searchIcon?: React.ReactNode;
}

export const SearchField = React.forwardRef<HTMLInputElement, SearchFieldProps>(function SearchField({ searchIcon, autoComplete, ...props }, ref) {
	return <TextField {...props} ref={ref} type="search" autoComplete={autoComplete ?? "off"} startAdornment={searchIcon ?? <SearchIcon />} />;
});

function VisibilityIcon({ visible }: { visible: boolean }) {
	return visible ? (
		<svg className="lyds-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
			<path d="M3.5 12s3-5 8.5-5 8.5 5 8.5 5-3 5-8.5 5-8.5-5-8.5-5Z" />
			<circle cx="12" cy="12" r="2.25" />
		</svg>
	) : (
		<svg className="lyds-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
			<path d="m4 4 16 16M9.6 7.35A8.8 8.8 0 0 1 12 7c5.5 0 8.5 5 8.5 5a13.5 13.5 0 0 1-2.3 2.85M14.2 14.2A3.1 3.1 0 0 1 9.8 9.8M6.1 9.1A14.7 14.7 0 0 0 3.5 12s3 5 8.5 5c.85 0 1.63-.12 2.35-.32" />
		</svg>
	);
}

export interface PasswordFieldProps extends Omit<TextFieldProps, "endAdornment" | "type"> {
	visible?: boolean;
	defaultVisible?: boolean;
	onVisibilityChange?: (visible: boolean) => void;
	showPasswordLabel?: string;
	hidePasswordLabel?: string;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(
	{ visible: visibleProp, defaultVisible = false, onVisibilityChange, showPasswordLabel = "Show password", hidePasswordLabel = "Hide password", autoComplete, ...props },
	ref
) {
	const [uncontrolledVisible, setUncontrolledVisible] = React.useState(defaultVisible);
	const visible = visibleProp ?? uncontrolledVisible;

	const toggleVisibility = () => {
		const nextVisible = !visible;
		if (visibleProp === undefined) {
			setUncontrolledVisible(nextVisible);
		}
		onVisibilityChange?.(nextVisible);
	};

	return (
		<TextField
			{...props}
			ref={ref}
			type={visible ? "text" : "password"}
			autoComplete={autoComplete ?? "current-password"}
			endAdornment={
				<button
					className="lyds-field__utility-button"
					type="button"
					aria-label={visible ? hidePasswordLabel : showPasswordLabel}
					aria-pressed={visible}
					onClick={toggleVisibility}
					disabled={props.disabled}
				>
					<VisibilityIcon visible={visible} />
				</button>
			}
		/>
	);
});

export type CodeFieldProps = Omit<TextFieldProps, "technical" | "type">;

export const CodeField = React.forwardRef<HTMLInputElement, CodeFieldProps>(function CodeField({ spellCheck, autoCapitalize, autoCorrect, ...props }, ref) {
	return <TextField {...props} ref={ref} type="text" technical spellCheck={spellCheck ?? false} autoCapitalize={autoCapitalize ?? "none"} autoCorrect={autoCorrect ?? "off"} />;
});

export type PhoneFieldProps = Omit<TextFieldProps, "technical" | "type">;

/** A format-agnostic telephone field. Country selection and validation belong to the consumer. */
export const PhoneField = React.forwardRef<HTMLInputElement, PhoneFieldProps>(function PhoneField({ autoComplete, inputMode, ...props }, ref) {
	return <TextField {...props} ref={ref} type="tel" technical autoComplete={autoComplete ?? "tel"} inputMode={inputMode ?? "tel"} />;
});
