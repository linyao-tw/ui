import type { CalendarDate } from "@internationalized/date";
import { forwardRef, type ReactElement, type RefAttributes } from "react";
import { DateField as AriaDateField, DateInput, DateSegment, type DateFieldProps as AriaDateFieldProps, type DateValue } from "react-aria-components/DateField";
import { FieldLabel, FieldMessages, LocaleBoundary, cx, type DateTimeFieldChromeProps } from "./shared";

export interface DateFieldProps<T extends DateValue = CalendarDate>
	extends Omit<AriaDateFieldProps<T>, "children" | "className" | "isDisabled" | "isInvalid" | "isReadOnly" | "isRequired" | "onChange">, DateTimeFieldChromeProps {
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	onValueChange?: AriaDateFieldProps<T>["onChange"];
}

export function DateInputSegments({ className, slot }: { className?: string; slot?: string }) {
	return (
		<DateInput className={cx("lyds-date-input", className)} {...(slot ? { slot } : {})}>
			{segment => <DateSegment segment={segment} className="lyds-date-segment" />}
		</DateInput>
	);
}

function DateFieldImpl<T extends DateValue>(
	{ label, description, errorMessage, locale, size = "md", className, disabled, readOnly, required, invalid, onValueChange, ...fieldProps }: DateFieldProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>
) {
	return (
		<LocaleBoundary locale={locale}>
			<AriaDateField
				{...fieldProps}
				ref={ref}
				className={cx("lyds-date-field", className)}
				data-size={size}
				{...(disabled === undefined ? {} : { isDisabled: disabled })}
				{...(readOnly === undefined ? {} : { isReadOnly: readOnly })}
				{...(required === undefined ? {} : { isRequired: required })}
				{...(invalid === undefined ? {} : { isInvalid: invalid })}
				{...(onValueChange === undefined ? {} : { onChange: onValueChange })}
			>
				<FieldLabel>{label}</FieldLabel>
				<DateInputSegments />
				<FieldMessages description={description} errorMessage={errorMessage} />
			</AriaDateField>
		</LocaleBoundary>
	);
}

export const DateField = forwardRef(DateFieldImpl) as <T extends DateValue = CalendarDate>(props: DateFieldProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;
