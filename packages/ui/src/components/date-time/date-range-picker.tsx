import type { CalendarDate } from "@internationalized/date";
import { forwardRef, type ReactElement, type RefAttributes } from "react";
import { Button } from "react-aria-components/Button";
import { DateRangePicker as AriaDateRangePicker, RangeCalendar, type DateRangePickerProps as AriaDateRangePickerProps, type DateValue } from "react-aria-components/DateRangePicker";
import { Dialog } from "react-aria-components/Dialog";
import { Group } from "react-aria-components/Group";
import { Popover, type Placement } from "react-aria-components/Popover";
import { CalendarPanel, type WeekdayStyle } from "./calendar";
import { DateInputSegments } from "./date-field";
import { CalendarGlyph, FieldLabel, FieldMessages, LocaleBoundary, cx, type DateTimeFieldChromeProps } from "./shared";

export interface DateRangePickerProps<T extends DateValue = CalendarDate>
	extends Omit<AriaDateRangePickerProps<T>, "children" | "className" | "isDisabled" | "isInvalid" | "isOpen" | "isReadOnly" | "isRequired" | "onChange">, DateTimeFieldChromeProps {
	open?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	onValueChange?: AriaDateRangePickerProps<T>["onChange"];
	weekdayStyle?: WeekdayStyle | undefined;
	showMonthYearPickers?: boolean | undefined;
	popoverPlacement?: Placement | undefined;
}

function DateRangePickerImpl<T extends DateValue>(
	{
		label,
		description,
		errorMessage,
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
	return (
		<LocaleBoundary locale={locale}>
			<AriaDateRangePicker
				{...pickerProps}
				ref={ref}
				className={cx("lyds-date-field", "lyds-date-picker", "lyds-date-range-picker", className)}
				data-size={size}
				{...(open === undefined ? {} : { isOpen: open })}
				{...(disabled === undefined ? {} : { isDisabled: disabled })}
				{...(readOnly === undefined ? {} : { isReadOnly: readOnly })}
				{...(required === undefined ? {} : { isRequired: required })}
				{...(invalid === undefined ? {} : { isInvalid: invalid })}
				{...(onValueChange === undefined ? {} : { onChange: onValueChange })}
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
				<FieldMessages description={description} errorMessage={errorMessage} />
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

export const DateRangePicker = forwardRef(DateRangePickerImpl) as <T extends DateValue = CalendarDate>(props: DateRangePickerProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;
