import { Field as BaseField } from "@base-ui/react/field";
import type * as React from "react";

export type FieldSize = "sm" | "md" | "lg";

export type FieldValidationProps = Pick<BaseField.Root.Props, "actionsRef" | "dirty" | "touched" | "validate" | "validationDebounceTime" | "validationMode">;

export interface FieldAnatomyProps extends FieldValidationProps {
	/** 欄位的可見標籤。省略時，請在控制項提供 `aria-label`。 */
	label?: React.ReactNode;
	/** 透過 Base UI Field 與控制項關聯的補充說明。 */
	description?: React.ReactNode;
	/** 透過 Base UI Field 與控制項關聯的驗證訊息。 */
	error?: React.ReactNode;
	/** 將經外部驗證的欄位標記為無效。 */
	invalid?: boolean | undefined;
	disabled?: boolean | undefined;
	readOnly?: boolean | undefined;
	required?: boolean | undefined;
	name?: string | undefined;
	size?: FieldSize | undefined;
	className?: string | undefined;
	style?: React.CSSProperties | undefined;
	/** 顯示於標籤後方的選用在地化註記。 */
	requiredIndicator?: React.ReactNode;
}

interface FieldFrameProps extends FieldAnatomyProps {
	children: React.ReactNode;
	labelId?: string | undefined;
	descriptionId?: string | undefined;
	errorId?: string | undefined;
}

export function cx(...classes: Array<string | false | null | undefined>): string {
	return classes.filter(Boolean).join(" ");
}

export function withStateClassName<State>(baseClassName: string, className: string | ((state: State) => string | undefined) | undefined): string | ((state: State) => string) {
	if (typeof className === "function") {
		return state => cx(baseClassName, className(state));
	}

	return cx(baseClassName, className);
}

export function FieldFrame({
	children,
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
	labelId,
	descriptionId,
	errorId,
	validate,
	validationMode,
	validationDebounceTime,
	dirty,
	touched,
	actionsRef
}: FieldFrameProps) {
	return (
		<BaseField.Root
			className={cx("lyds-field", className)}
			style={style}
			name={name}
			disabled={disabled}
			invalid={invalid}
			validate={validate}
			validationMode={validationMode}
			validationDebounceTime={validationDebounceTime}
			dirty={dirty}
			touched={touched}
			actionsRef={actionsRef}
			data-size={size}
			data-readonly={readOnly || undefined}
			data-required={required || undefined}
		>
			{label != null ? (
				<BaseField.Label id={labelId} className="lyds-field__label">
					<span>{label}</span>
					{required && requiredIndicator != null ? (
						<span className="lyds-field__required" aria-hidden="true">
							{requiredIndicator}
						</span>
					) : null}
				</BaseField.Label>
			) : null}
			{children}
			{description != null ? (
				<BaseField.Description id={descriptionId} className="lyds-field__description">
					{description}
				</BaseField.Description>
			) : null}
			{error != null ? (
				<BaseField.Error id={errorId} className="lyds-field__error" match={invalid ? true : undefined} aria-live="polite" aria-atomic="true">
					{error}
				</BaseField.Error>
			) : (
				<BaseField.Error id={errorId} className="lyds-field__error" aria-live="polite" aria-atomic="true" />
			)}
		</BaseField.Root>
	);
}
