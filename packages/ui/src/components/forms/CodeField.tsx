import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import * as React from "react";
import "./forms.css";
import { cx, FieldFrame, withStateClassName } from "./internal";
import type { OTPFieldProps } from "./OTPField";

export interface CodeFieldProps extends Omit<OTPFieldProps, "length" | "separator" | "separatorAfter"> {
	/**
	 * Number of code characters. Values are constrained to the Modulor-supported
	 * range of 2–12.
	 * @default 6
	 */
	length?: number;
	/**
	 * Number of characters rendered inside one visual group. Lengths from 9–12
	 * default to groups of four; shorter codes default to individual cells.
	 * Set to 1 to force individual cells.
	 */
	groupSize?: number;
	groupClassName?: string;
	groupStyle?: React.CSSProperties;
	/**
	 * Optional empty-cell hint. A string is distributed one character per slot;
	 * use a function to localize or customize each slot independently.
	 */
	placeholder?: string | ((index: number) => string | undefined);
}

function constrainInteger(value: number, minimum: number, maximum: number): number {
	if (!Number.isFinite(value)) return minimum;
	return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
}

/** A Base UI OTP-backed, multi-cell verification code control. */
export const CodeField = React.forwardRef<HTMLDivElement, CodeFieldProps>(function CodeField(
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
		getSlotLabel,
		length: lengthProp = 6,
		groupSize: groupSizeProp,
		groupClassName,
		groupStyle,
		placeholder,
		validationType = "numeric",
		...otpProps
	},
	ref
) {
	const length = constrainInteger(lengthProp, 2, 12);
	const defaultGroupSize = length >= 9 ? 4 : 1;
	const groupSize = constrainInteger(groupSizeProp ?? defaultGroupSize, 1, length);
	const grouped = groupSize > 1;
	const groups: number[][] = [];
	const placeholderCharacters = typeof placeholder === "string" ? Array.from(placeholder) : null;

	for (let start = 0; start < length; start += groupSize) {
		groups.push(Array.from({ length: Math.min(groupSize, length - start) }, (_, offset) => start + offset));
	}

	const renderSlot = (index: number, insideGroup: boolean) => (
		<BaseOTPField.Input
			key={index}
			className={withStateClassName<BaseOTPField.Input.State>(cx("lyds-otp-field__input", "lyds-code-field__input", insideGroup && "lyds-code-field__group-input"), inputClassName)}
			style={inputStyle}
			placeholder={typeof placeholder === "function" ? placeholder(index) : placeholderCharacters?.[index]}
			aria-label={index > 0 ? (getSlotLabel?.(index) ?? `Character ${index + 1} of ${length}`) : undefined}
		/>
	);

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
			<BaseOTPField.Root
				{...otpProps}
				ref={ref}
				className={cx("lyds-otp-field", "lyds-code-field")}
				name={name}
				disabled={disabled}
				readOnly={readOnly}
				required={required}
				length={length}
				validationType={validationType}
				data-size={size}
				data-grouped={grouped || undefined}
				data-group-size={groupSize}
			>
				{groups.map((indices, groupIndex) =>
					grouped ? (
						<span key={indices[0]} className={cx("lyds-code-field__group", groupClassName)} style={groupStyle} data-group-index={groupIndex}>
							{indices.map(index => renderSlot(index, true))}
						</span>
					) : (
						renderSlot(indices[0] as number, false)
					)
				)}
			</BaseOTPField.Root>
		</FieldFrame>
	);
});
