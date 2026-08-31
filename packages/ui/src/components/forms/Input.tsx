import { Field as BaseField } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import * as React from "react";
import "./forms.css";
import { withStateClassName, type FieldSize } from "./internal";

export interface InputProps extends Omit<BaseInput.Props, "size"> {
	/** LYDS control size. Use `inputSize` for the native HTML size attribute. */
	size?: FieldSize;
	inputSize?: number;
	invalid?: boolean;
}

/**
 * A low-level text input with LYDS styling and Base UI value-change details.
 * Use TextField when a visible label, description, or error is needed.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
	{ size = "md", inputSize, invalid, className, disabled, readOnly, required, name, "aria-invalid": ariaInvalid, ...props },
	ref
) {
	return (
		<BaseField.Root className="lyds-input-root" name={name} disabled={disabled} invalid={invalid} data-size={size} data-readonly={readOnly || undefined} data-required={required || undefined}>
			<BaseInput
				{...props}
				ref={ref}
				className={withStateClassName<BaseInput.State>("lyds-input", className)}
				disabled={disabled}
				readOnly={readOnly}
				required={required}
				size={inputSize}
				aria-invalid={invalid ? true : ariaInvalid}
				data-size={size}
			/>
		</BaseField.Root>
	);
});
