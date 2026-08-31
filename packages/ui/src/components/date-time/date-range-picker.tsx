import type { CalendarDate } from "@internationalized/date";
import { forwardRef, type ReactElement, type RefAttributes } from "react";
import { Button } from "react-aria-components/Button";
import { DateRangePicker as AriaDateRangePicker, RangeCalendar, type DateRangePickerProps as AriaDateRangePickerProps } from "react-aria-components/DateRangePicker";
import { Dialog } from "react-aria-components/Dialog";
import { Group } from "react-aria-components/Group";
import { Popover } from "react-aria-components/Popover";
import { CalendarPanel, type WeekdayStyle } from "./calendar";
import { DateInputSegments } from "./date-field";
import type { DatePopoverPlacement, DateRangePickerBehaviorProps, DateValue as LydsDateValue } from "./date-types";
import { CalendarGlyph, FieldLabel, FieldMessages, LocaleBoundary, cx, type DateTimeFieldChromeProps } from "./shared";

export interface DateRangePickerProps<T extends LydsDateValue = CalendarDate> extends DateRangePickerBehaviorProps<T>, DateTimeFieldChromeProps {
	weekdayStyle?: WeekdayStyle | undefined;
	showMonthYearPickers?: boolean | undefined;
	popoverPlacement?: DatePopoverPlacement | undefined;
}

type DateRangePickerForwardedKeys = Exclude<keyof DateRangePickerBehaviorProps<LydsDateValue>, "disabled" | "invalid" | "onValueChange" | "open" | "readOnly" | "required">;
type DateRangePickerUnexpectedForwardedKeys = Exclude<DateRangePickerForwardedKeys, keyof AriaDateRangePickerProps<LydsDateValue>>;
type DateRangePickerPropContract = DateRangePickerUnexpectedForwardedKeys extends never ? true : never;
const dateRangePickerPropContract: DateRangePickerPropContract = true;
void dateRangePickerPropContract;

function DateRangePickerImpl<T extends LydsDateValue>(
	{
		label,
		description,
		error,
		locale,
		size = "md",
		className,
		open,
		disabled,
		readOnly,
		required,
		invalid,
		onValueChange,
		firstDayOfWeek,
		weekdayStyle,
		showMonthYearPickers,
		popoverPlacement = "bottom start",
		...pickerProps
	}: DateRangePickerProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>
) {
	const ariaPickerProps = pickerProps as unknown as Omit<AriaDateRangePickerProps<T>, "children" | "className" | "isDisabled" | "isInvalid" | "isOpen" | "isReadOnly" | "isRequired" | "onChange">;

	return (
		<LocaleBoundary locale={locale}>
			<AriaDateRangePicker
				{...ariaPickerProps}
				ref={ref}
				className={cx("lyds-date-field", "lyds-date-picker", "lyds-date-range-picker", className)}
				data-size={size}
				{...(open === undefined ? {} : { isOpen: open })}
				{...(disabled === undefined ? {} : { isDisabled: disabled })}
				{...(readOnly === undefined ? {} : { isReadOnly: readOnly })}
				{...(required === undefined ? {} : { isRequired: required })}
				{...(invalid === undefined ? {} : { isInvalid: invalid })}
				{...(onValueChange === undefined ? {} : { onChange: onValueChange as unknown as NonNullable<AriaDateRangePickerProps<T>["onChange"]> })}
				{...(firstDayOfWeek === undefined ? {} : { firstDayOfWeek })}
			>
				<FieldLabel>{label}</FieldLabel>
				<Group className="lyds-date-picker-group">
					<DateInputSegments className="lyds-date-picker-input" slot="start" />
					<span className="lyds-date-range-separator" aria-hidden="true">
						–
					</span>
					<DateInputSegments className="lyds-date-picker-input" slot="end" />
					<Button className="lyds-date-picker-button">
						<CalendarGlyph />
					</Button>
				</Group>
				<FieldMessages description={description} error={error} />
				<Popover className="lyds-date-popover" placement={popoverPlacement}>
					<Dialog className="lyds-date-popover-dialog">
						<RangeCalendar className="lyds-calendar lyds-range-calendar" {...(firstDayOfWeek === undefined ? {} : { firstDayOfWeek })}>
							<CalendarPanel weekdayStyle={weekdayStyle} showMonthYearPickers={showMonthYearPickers} disabled={disabled} />
						</RangeCalendar>
					</Dialog>
				</Popover>
			</AriaDateRangePicker>
		</LocaleBoundary>
	);
}

export const DateRangePicker = forwardRef(DateRangePickerImpl) as <T extends LydsDateValue = CalendarDate>(props: DateRangePickerProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;
