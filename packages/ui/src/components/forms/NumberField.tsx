import { cx, withStateClassName } from "@/internal";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import * as React from "react";
import "./forms.css";
import { FieldFrame, type FieldAnatomyProps } from "./internal";
type NumberRootProps = Omit<BaseNumberField.Root.Props, "className" | "disabled" | "name" | "readOnly" | "required" | "style">;

export interface NumberFieldProps extends NumberRootProps, FieldAnatomyProps {
	inputClassName?: BaseNumberField.Input.Props["className"];
	inputStyle?: React.CSSProperties;
	groupClassName?: BaseNumberField.Group.Props["className"];
	showSteppers?: boolean;
	incrementLabel?: string;
	decrementLabel?: string;
}

/** 以 Base UI Number Field 實作、支援地區格式的數字輸入元件。 */
export const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(function NumberField(
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
		groupClassName,
		showSteppers = true,
		incrementLabel = "增加數值",
		decrementLabel = "減少數值",
		...numberProps
	},
	ref
) {
	const ariaLabel = numberProps["aria-label"];
	const ariaLabelledBy = numberProps["aria-labelledby"];

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
			<BaseNumberField.Root {...numberProps} ref={ref} className="lyds-number-field" name={name} disabled={disabled} readOnly={readOnly} required={required} data-size={size}>
				<BaseNumberField.Group className={withStateClassName<BaseNumberField.Group.State>("lyds-number-field__group", groupClassName)}>
					<BaseNumberField.Input
						aria-label={ariaLabel}
						aria-labelledby={ariaLabelledBy}
						className={withStateClassName<BaseNumberField.Input.State>("lyds-number-field__input", inputClassName)}
						style={inputStyle}
					/>
					{showSteppers ? (
						<span className="lyds-number-field__steppers">
							<BaseNumberField.Decrement className={cx("lyds-number-field__stepper", "lyds-number-field__stepper--decrement")} aria-label={decrementLabel}>
								<MinusIcon aria-hidden="true" weight="bold" />
							</BaseNumberField.Decrement>
							<BaseNumberField.Increment className={cx("lyds-number-field__stepper", "lyds-number-field__stepper--increment")} aria-label={incrementLabel}>
								<PlusIcon aria-hidden="true" weight="bold" />
							</BaseNumberField.Increment>
						</span>
					) : null}
				</BaseNumberField.Group>
			</BaseNumberField.Root>
		</FieldFrame>
	);
});
