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
	/** Validation message rendered when the React Aria field is invalid. */
	errorMessage?: ReactNode;
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

export function FieldMessages({ description, errorMessage }: Pick<DateTimeFieldChromeProps, "description" | "errorMessage">) {
	return (
		<>
			{description == null ? null : (
				<Text slot="description" className="lyds-date-description">
					{description}
				</Text>
			)}
			{errorMessage == null ? null : <FieldError className="lyds-date-error">{errorMessage}</FieldError>}
		</>
	);
}

export function CalendarGlyph() {
	return (
		<svg className="lyds-date-glyph" viewBox="0 0 20 20" aria-hidden="true">
			<path d="M4.5 2.5v3m11-3v3M3 7.5h14M4 4h12a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm2.5 6h2v2h-2v-2Zm5 0h2v2h-2v-2Z" />
		</svg>
	);
}

export function ClockGlyph() {
	return (
		<svg className="lyds-date-glyph" viewBox="0 0 20 20" aria-hidden="true">
			<circle cx="10" cy="10" r="7" />
			<path d="M10 5.5V10l3 2" />
		</svg>
	);
}
