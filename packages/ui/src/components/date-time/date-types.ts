import type { CalendarDate, CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date";
import type { CSSProperties, FocusEventHandler, KeyboardEventHandler } from "react";

export type DateValue = CalendarDate | CalendarDateTime | ZonedDateTime;
export type TimeValue = Time | CalendarDateTime | ZonedDateTime;
export type DateGranularity = "day" | "hour" | "minute" | "second";
export type TimeGranularity = Exclude<DateGranularity, "day">;
export type FirstDayOfWeek = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
export type PageBehavior = "single" | "visible";
export type DatePopoverPlacement = "top" | "top start" | "top end" | "bottom" | "bottom start" | "bottom end" | "left" | "left top" | "left bottom" | "right" | "right top" | "right bottom";

export interface DateRange<T> {
	start: T;
	end: T;
}

export type DateValidationError = string | string[];
export type DateValidationResult = DateValidationError | true | null | undefined;

interface DateControlDOMProps {
	id?: string;
	style?: CSSProperties;
	"aria-label"?: string;
	"aria-labelledby"?: string;
	"aria-describedby"?: string;
	"aria-details"?: string;
}

interface DateFieldDOMProps extends DateControlDOMProps {
	onBlur?: FocusEventHandler<HTMLElement>;
	onFocus?: FocusEventHandler<HTMLElement>;
	onKeyDown?: KeyboardEventHandler<HTMLElement>;
	onKeyUp?: KeyboardEventHandler<HTMLElement>;
}

export interface DateFieldBehaviorProps<T extends DateValue> extends DateFieldDOMProps {
	value?: T | null;
	defaultValue?: T | null;
	onValueChange?: (value: T | null) => void;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	autoFocus?: boolean;
	name?: string;
	form?: string;
	minValue?: DateValue | null;
	maxValue?: DateValue | null;
	isDateUnavailable?: (date: DateValue) => boolean;
	placeholderValue?: T | null;
	hourCycle?: 12 | 24;
	granularity?: DateGranularity;
	hideTimeZone?: boolean;
	shouldForceLeadingZeros?: boolean;
	validationBehavior?: "aria" | "native";
	validate?: (value: T | null) => DateValidationResult;
}

export interface DatePickerBehaviorProps<T extends DateValue> extends DateFieldBehaviorProps<T> {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	shouldCloseOnSelect?: boolean | (() => boolean);
	pageBehavior?: PageBehavior;
	firstDayOfWeek?: FirstDayOfWeek;
}

export interface DateRangePickerBehaviorProps<T extends DateValue> extends Omit<DatePickerBehaviorProps<T>, "defaultValue" | "isDateUnavailable" | "name" | "onValueChange" | "validate" | "value"> {
	value?: DateRange<T> | null;
	defaultValue?: DateRange<T> | null;
	onValueChange?: (value: DateRange<T> | null) => void;
	allowsNonContiguousRanges?: boolean;
	isDateUnavailable?: (date: DateValue, anchorDate: CalendarDate | null) => boolean;
	startName?: string;
	endName?: string;
	validate?: (value: DateRange<T> | null) => DateValidationResult;
}

export interface TimeFieldBehaviorProps<T extends TimeValue> extends DateFieldDOMProps {
	value?: T | null;
	defaultValue?: T | null;
	onValueChange?: (value: T | null) => void;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
	invalid?: boolean;
	autoFocus?: boolean;
	name?: string;
	form?: string;
	hourCycle?: 12 | 24;
	granularity?: TimeGranularity;
	hideTimeZone?: boolean;
	shouldForceLeadingZeros?: boolean;
	placeholderValue?: T;
	minValue?: TimeValue | null;
	maxValue?: TimeValue | null;
	validationBehavior?: "aria" | "native";
	validate?: (value: T | null) => DateValidationResult;
}

export interface CalendarBehaviorProps<T extends DateValue> extends DateControlDOMProps {
	value?: T | null;
	defaultValue?: T | null;
	onValueChange?: (value: T) => void;
	disabled?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	autoFocus?: boolean;
	minValue?: DateValue | null;
	maxValue?: DateValue | null;
	isDateUnavailable?: (date: DateValue) => boolean;
	focusedValue?: DateValue | null;
	defaultFocusedValue?: DateValue | null;
	onFocusChange?: (date: CalendarDate) => void;
	pageBehavior?: PageBehavior;
	firstDayOfWeek?: FirstDayOfWeek;
	selectionAlignment?: "start" | "center" | "end";
	weeksInMonth?: number;
}
