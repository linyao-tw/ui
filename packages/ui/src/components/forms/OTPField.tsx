import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import * as React from "react";
import "./forms.css";
import { FieldFrame, withStateClassName, type FieldAnatomyProps } from "./internal";

type OTPRootProps = Omit<BaseOTPField.Root.Props, "className" | "disabled" | "name" | "readOnly" | "required" | "style">;

export interface OTPFieldProps extends OTPRootProps, FieldAnatomyProps {
	inputClassName?: BaseOTPField.Input.Props["className"];
	inputStyle?: React.CSSProperties;
	/** 第一格之後各輸入格的選用在地化無障礙標籤。 */
	getSlotLabel?: (index: number) => string;
	separator?: React.ReactNode;
	separatorAfter?: readonly number[];
}

/** 以 Base UI OTP Field 實作的多格驗證碼輸入元件。 */
export const OTPField = React.forwardRef<HTMLDivElement, OTPFieldProps>(function OTPField(
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
		separator = <span aria-hidden="true">—</span>,
		separatorAfter = [],
		length,
		...otpProps
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
			<BaseOTPField.Root {...otpProps} ref={ref} className="lyds-otp-field" name={name} disabled={disabled} readOnly={readOnly} required={required} length={length} data-size={size}>
				{Array.from({ length }, (_, index) => (
					<React.Fragment key={index}>
						<BaseOTPField.Input
							className={withStateClassName<BaseOTPField.Input.State>("lyds-otp-field__input", inputClassName)}
							style={inputStyle}
							aria-label={index > 0 ? (getSlotLabel?.(index) ?? `第 ${index + 1} 個字元，共 ${length} 個`) : undefined}
						/>
						{separatorAfter.includes(index + 1) && index < length - 1 ? <span className="lyds-otp-field__separator">{separator}</span> : null}
					</React.Fragment>
				))}
			</BaseOTPField.Root>
		</FieldFrame>
	);
});
