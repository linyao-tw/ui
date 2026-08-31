import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date";
import { forwardRef, type ReactElement, type RefAttributes } from "react";
import { Button } from "react-aria-components/Button";
import { Calendar as AriaCalendar } from "react-aria-components/Calendar";
import { DatePicker as AriaDatePicker, type DatePickerProps as AriaDatePickerProps } from "react-aria-components/DatePicker";
import { Dialog } from "react-aria-components/Dialog";
import { Group } from "react-aria-components/Group";
import { Popover } from "react-aria-components/Popover";
import { CalendarPanel, type WeekdayStyle } from "./calendar";
import { DateInputSegments } from "./date-field";
import type { DatePickerBehaviorProps, DatePopoverPlacement, DateValue as LydsDateValue } from "./date-types";
import { CalendarGlyph, FieldLabel, FieldMessages, LocaleBoundary, cx, type DateTimeFieldChromeProps } from "./shared";

interface DatePickerChromeProps extends DateTimeFieldChromeProps {
	open?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	weekdayStyle?: WeekdayStyle | undefined;
	showMonthYearPickers?: boolean | undefined;
	popoverPlacement?: DatePopoverPlacement | undefined;
}

export interface DatePickerProps<T extends LydsDateValue = CalendarDate> extends DatePickerBehaviorProps<T>, DatePickerChromeProps {}

type DatePickerForwardedKeys = Exclude<keyof DatePickerBehaviorProps<LydsDateValue>, "disabled" | "invalid" | "onValueChange" | "open" | "readOnly" | "required">;
type DatePickerUnexpectedForwardedKeys = Exclude<DatePickerForwardedKeys, keyof AriaDatePickerProps<LydsDateValue>>;
type DatePickerPropContract = DatePickerUnexpectedForwardedKeys extends never ? true : never;
const datePickerPropContract: DatePickerPropContract = true;
void datePickerPropContract;

/**
 * Date-time values intentionally carry their own semantics. Use `CalendarDateTime` for a wall-clock value or
 * `ZonedDateTime` for an exact time-zone-aware value. LYDS never silently converts between the two.
 */
export type DateTimeValue = CalendarDateTime | ZonedDateTime;

export interface DateTimePickerProps<T extends DateTimeValue = CalendarDateTime> extends Omit<DatePickerProps<T>, "granularity"> {
	granularity?: "hour" | "minute" | "second";
}

function SingleDatePicker<T extends LydsDateValue>(
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
	}: DatePickerProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>,
	dateTime: boolean
) {
	const ariaPickerProps = pickerProps as unknown as Omit<AriaDatePickerProps<T>, "children" | "className" | "isDisabled" | "isInvalid" | "isOpen" | "isReadOnly" | "isRequired" | "onChange">;

	return (
		<LocaleBoundary locale={locale}>
			<AriaDatePicker
				{...ariaPickerProps}
				ref={ref}
				className={cx("lyds-date-field", "lyds-date-picker", dateTime && "lyds-date-time-picker", className)}
				data-size={size}
				{...(open === undefined ? {} : { isOpen: open })}
				{...(disabled === undefined ? {} : { isDisabled: disabled })}
				{...(readOnly === undefined ? {} : { isReadOnly: readOnly })}
				{...(required === undefined ? {} : { isRequired: required })}
				{...(invalid === undefined ? {} : { isInvalid: invalid })}
				{...(onValueChange === undefined ? {} : { onChange: onValueChange as unknown as NonNullable<AriaDatePickerProps<T>["onChange"]> })}
				{...(firstDayOfWeek === undefined ? {} : { firstDayOfWeek })}
			>
				<FieldLabel>{label}</FieldLabel>
				<Group className="lyds-date-picker-group">
					<DateInputSegments className="lyds-date-picker-input" />
					<Button className="lyds-date-picker-button">
						<CalendarGlyph />
					</Button>
				</Group>
				<FieldMessages description={description} error={error} />
				<Popover className="lyds-date-popover" placement={popoverPlacement}>
					<Dialog className="lyds-date-popover-dialog">
						<AriaCalendar className="lyds-calendar" {...(firstDayOfWeek === undefined ? {} : { firstDayOfWeek })}>
							<CalendarPanel weekdayStyle={weekdayStyle} showMonthYearPickers={showMonthYearPickers} disabled={disabled} />
						</AriaCalendar>
					</Dialog>
				</Popover>
			</AriaDatePicker>
		</LocaleBoundary>
	);
}

function DatePickerImpl<T extends LydsDateValue>(props: DatePickerProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
	return SingleDatePicker(props, ref, false);
}

function DateTimePickerImpl<T extends DateTimeValue>(props: DateTimePickerProps<T>, ref: React.ForwardedRef<HTMLDivElement>) {
	return SingleDatePicker({ ...props, granularity: props.granularity ?? "minute" }, ref, true);
}

export const DatePicker = forwardRef(DatePickerImpl) as <T extends LydsDateValue = CalendarDate>(props: DatePickerProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;

export const DateTimePicker = forwardRef(DateTimePickerImpl) as <T extends DateTimeValue = CalendarDateTime>(props: DateTimePickerProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;
