import { CalendarDotsIcon } from "@phosphor-icons/react/dist/csr/CalendarDots";
import { ClockIcon } from "@phosphor-icons/react/dist/csr/Clock";
import type { ReactNode } from "react";
import { FieldError } from "react-aria-components/FieldError";
import { I18nProvider } from "react-aria-components/I18nProvider";
import { Label } from "react-aria-components/Label";
import { Text } from "react-aria-components/Text";

export type DateTimeSize = "sm" | "md" | "lg";

export interface DateTimeFieldChromeProps {
	/** Visible field label. Supply an `aria-label` instead when a visible label is not appropriate. */
	label?: ReactNode;
	/** Supporting text connected to the control through React Aria. */
	description?: ReactNode;
	/** Validation feedback associated with the control. */
	error?: ReactNode;
	/** BCP 47 locale used for segment order, labels, and numbering. Inherits the nearest provider when omitted. */
	locale?: string | undefined;
	size?: DateTimeSize;
	className?: string;
}

export function cx(...values: Array<string | false | null | undefined>): string {
	return values.filter(Boolean).join(" ");
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
