import type { CalendarDate } from "@internationalized/date";
import { forwardRef, type ReactElement, type RefAttributes } from "react";
import { DateField as AriaDateField, DateInput, DateSegment, type DateFieldProps as AriaDateFieldProps } from "react-aria-components/DateField";
import type { DateFieldBehaviorProps, DateValue as LydsDateValue } from "./date-types";
import { FieldLabel, FieldMessages, LocaleBoundary, cx, type DateTimeFieldChromeProps } from "./shared";

export interface DateFieldProps<T extends LydsDateValue = CalendarDate> extends DateFieldBehaviorProps<T>, DateTimeFieldChromeProps {}

type DateFieldForwardedKeys = Exclude<keyof DateFieldBehaviorProps<LydsDateValue>, "disabled" | "invalid" | "onValueChange" | "readOnly" | "required">;
type DateFieldUnexpectedForwardedKeys = Exclude<DateFieldForwardedKeys, keyof AriaDateFieldProps<LydsDateValue>>;
type DateFieldPropContract = DateFieldUnexpectedForwardedKeys extends never ? true : never;
const dateFieldPropContract: DateFieldPropContract = true;
void dateFieldPropContract;

export function DateInputSegments({ className, slot }: { className?: string; slot?: string }) {
	return (
		<DateInput className={cx("lyds-date-input", className)} {...(slot ? { slot } : {})}>
			{segment => <DateSegment segment={segment} className="lyds-date-segment" />}
		</DateInput>
	);
}

function DateFieldImpl<T extends LydsDateValue>(
	{ label, description, error, locale, size = "md", className, disabled, readOnly, required, invalid, onValueChange, ...fieldProps }: DateFieldProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>
) {
	const ariaFieldProps = fieldProps as unknown as Omit<AriaDateFieldProps<T>, "children" | "className" | "isDisabled" | "isInvalid" | "isReadOnly" | "isRequired" | "onChange">;

	return (
		<LocaleBoundary locale={locale}>
			<AriaDateField
				{...ariaFieldProps}
				ref={ref}
				className={cx("lyds-date-field", className)}
				data-size={size}
				{...(disabled === undefined ? {} : { isDisabled: disabled })}
				{...(readOnly === undefined ? {} : { isReadOnly: readOnly })}
				{...(required === undefined ? {} : { isRequired: required })}
				{...(invalid === undefined ? {} : { isInvalid: invalid })}
				{...(onValueChange === undefined ? {} : { onChange: onValueChange as unknown as NonNullable<AriaDateFieldProps<T>["onChange"]> })}
			>
				<FieldLabel>{label}</FieldLabel>
				<DateInputSegments />
				<FieldMessages description={description} error={error} />
			</AriaDateField>
		</LocaleBoundary>
	);
}

export const DateField = forwardRef(DateFieldImpl) as <T extends LydsDateValue = CalendarDate>(props: DateFieldProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;
