import { Button as BaseButton, type ButtonProps as BaseButtonProps } from "@base-ui/react/button";
import * as React from "react";
import { cx } from "../../internal";
export type ButtonVariant = "primary" | "secondary" | "neutral" | "quiet" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<BaseButtonProps, "children" | "className" | "style"> {
	children: React.ReactNode;
	variant?: ButtonVariant;
	size?: ButtonSize;
	loading?: boolean;
	loadingIndicator?: React.ReactNode;
	/** 裝飾性的前置圖示。請使用 @phosphor-icons/react；按鈕文字仍是無障礙名稱。 */
	startIcon?: React.ReactNode;
	/** 裝飾性的後置圖示。請使用 @phosphor-icons/react；按鈕文字仍是無障礙名稱。 */
	endIcon?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
	{ children, variant = "primary", size = "md", loading = false, loadingIndicator, startIcon, endIcon, className, disabled = false, focusableWhenDisabled, type, nativeButton, style, ...props },
	ref
) {
	const isDisabled = disabled || loading;

	return (
		<BaseButton
			{...props}
			ref={ref}
			nativeButton={nativeButton}
			type={type ?? (nativeButton === false ? undefined : "button")}
			disabled={isDisabled}
			focusableWhenDisabled={focusableWhenDisabled ?? loading}
			aria-busy={loading || undefined}
			data-loading={loading ? "" : undefined}
			data-variant={variant}
			data-size={size}
			className={cx("lyds-button", className)}
			style={style}
		>
			{loading ? (
				<span className="lyds-button__spinner" aria-hidden="true">
					{loadingIndicator}
				</span>
			) : startIcon ? (
				<span className="lyds-button__icon" aria-hidden="true">
					{startIcon}
				</span>
			) : null}
			<span className="lyds-button__label">{children}</span>
			{!loading && endIcon ? (
				<span className="lyds-button__icon" aria-hidden="true">
					{endIcon}
				</span>
			) : null}
		</BaseButton>
	);
});

Button.displayName = "Button";
