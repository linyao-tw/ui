import { Field as BaseField } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import * as React from "react";
import { withStateClassName } from "../../internal";
import "./forms.css";
import { type FieldSize } from "./internal";
export interface InputProps extends Omit<BaseInput.Props, "size"> {
	/** Linyao Design System 的控制項尺寸。原生 HTML `size` 屬性請使用 `inputSize`。 */
	size?: FieldSize;
	inputSize?: number;
	invalid?: boolean;
}

/**
 * 使用 Linyao Design System 樣式與 Base UI 值變更資訊的基礎文字輸入元件。
 * 需要可見標籤、說明或錯誤訊息時，請使用 TextField。
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
