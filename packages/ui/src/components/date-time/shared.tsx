import { CalendarDotsIcon } from "@phosphor-icons/react/dist/csr/CalendarDots";
import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import type { ReactNode } from "react";
import { FieldError } from "react-aria-components/FieldError";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";

export type DateTimeSize = "sm" | "md" | "lg";

export interface DateTimeFieldChromeProps {
	/** 欄位的可見標籤。不適合顯示可見標籤時，請改用 `aria-label`。 */
	label?: ReactNode;
	/** 透過 React Aria 與控制項關聯的補充說明。 */
	description?: ReactNode;
	/** 與控制項關聯的驗證訊息。 */
	error?: ReactNode;
	/** 用於區段順序、標籤與數字格式的 BCP 47 地區設定。省略時沿用最近的 `I18nProvider`。 */
	locale?: string | undefined;
	size?: DateTimeSize;
	className?: string;
}

export function LocaleBoundary({ locale, children }: { locale?: string | undefined; children: ReactNode }) {
	if (!locale) {
		return <>{children}</>;
	}

	return <I18nProvider locale={locale}>{children}</I18nProvider>;
}

export function FieldLabel({ children }: { children?: ReactNode }) {
	return children == null ? null : <Label className="lyds-date-label">{children}</Label>;
}

export function FieldMessages({ description, error }: Pick<DateTimeFieldChromeProps, "description" | "error">) {
	return (
		<>
			{description == null ? null : (
				<Text slot="description" className="lyds-date-description">
					{description}
				</Text>
			)}
			{error == null ? null : (
				<FieldError aria-atomic="true" aria-live="polite" className="lyds-date-error">
					{error}
				</FieldError>
			)}
		</>
	);
}

export function CalendarGlyph() {
	return <CalendarDotsIcon aria-hidden="true" className="lyds-date-glyph" weight="regular" />;
}

export function ClockGlyph() {
	return <ClockIcon aria-hidden="true" className="lyds-date-glyph" weight="regular" />;
}
