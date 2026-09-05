import { cx, withStateClassName } from "@/internal";
import { useMessages } from "@/intl";
import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import * as React from "react";
import "./forms.css";
import { FieldFrame } from "./internal";
import type { OTPFieldProps } from "./OTPField";

export interface CodeFieldProps extends Omit<OTPFieldProps, "length" | "separator" | "separatorAfter"> {
	/**
	 * 驗證碼字元數。數值限制為 2 至 12。
	 * @default 6
	 */
	length?: number;
	/**
	 * 每個視覺群組顯示的字元數。長度為 9 至 12 時預設每四個字元一組；
	 * 較短的驗證碼預設各自獨立。設為 1 可強制使用獨立輸入格。
	 */
	groupSize?: number;
	groupClassName?: string;
	groupStyle?: React.CSSProperties;
	/**
	 * 空白輸入格的選用提示。字串會依序將每個字元分配至各輸入格；
	 * 需要個別在地化或自訂時可使用函式。
	 */
	placeholder?: string | ((index: number) => string | undefined);
}

function constrainInteger(value: number, minimum: number, maximum: number): number {
	if (!Number.isFinite(value)) return minimum;
	return Math.min(maximum, Math.max(minimum, Math.trunc(value)));
}

/** 以 Base UI OTP Field 實作的多格驗證碼控制項。 */
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
	const messages = useMessages();
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
			aria-label={index > 0 ? (getSlotLabel?.(index) ?? messages.codeSlotLabel(index + 1, length)) : undefined}
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
