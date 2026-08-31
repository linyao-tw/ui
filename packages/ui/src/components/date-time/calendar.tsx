import type { CalendarDate } from "@internationalized/date";
import { forwardRef, type ReactElement, type RefAttributes } from "react";
import { Button } from "react-aria-components/Button";
import {
	Calendar as AriaCalendar,
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeaderCell,
	CalendarHeading,
	CalendarMonthPicker,
	CalendarYearPicker,
	type CalendarProps as AriaCalendarProps,
	type DateValue
} from "react-aria-components/Calendar";
import { LocaleBoundary, cx } from "./shared";

export type FirstDayOfWeek = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
export type WeekdayStyle = "narrow" | "short" | "long";

export interface CalendarProps<T extends DateValue = CalendarDate> extends Omit<AriaCalendarProps<T>, "children" | "className" | "isDisabled" | "isInvalid" | "isReadOnly" | "onChange"> {
	locale?: string | undefined;
	className?: string;
	disabled?: boolean;
	readOnly?: boolean;
	invalid?: boolean;
	onValueChange?: AriaCalendarProps<T>["onChange"];
	weekdayStyle?: WeekdayStyle | undefined;
}

export interface CalendarPanelProps {
	weekdayStyle?: WeekdayStyle | undefined;
	showMonthYearPickers?: boolean | undefined;
	disabled?: boolean | undefined;
	className?: string | undefined;
}

export function CalendarNavigation({ showMonthYearPickers = true, disabled }: Pick<CalendarPanelProps, "showMonthYearPickers" | "disabled">) {
	return (
		<>
			<div className="lyds-calendar-navigation">
				<Button slot="previous" className="lyds-calendar-navigation-button">
					<span aria-hidden="true">‹</span>
				</Button>
				<CalendarHeading className="lyds-calendar-heading" />
				<Button slot="next" className="lyds-calendar-navigation-button">
					<span aria-hidden="true">›</span>
				</Button>
			</div>
			{showMonthYearPickers ? (
				<div className="lyds-calendar-period-pickers">
					<CalendarMonthPicker>
						{({ items, value, onChange, ...ariaProps }) => (
							<select {...ariaProps} className="lyds-calendar-period-select" value={String(value)} disabled={disabled} onChange={event => onChange(Number(event.currentTarget.value))}>
								{items.map(item => (
									<option key={item.id} value={item.id}>
										{item.formatted}
									</option>
								))}
							</select>
						)}
					</CalendarMonthPicker>
					<CalendarYearPicker>
						{({ items, value, onChange, ...ariaProps }) => (
							<select {...ariaProps} className="lyds-calendar-period-select" value={String(value)} disabled={disabled} onChange={event => onChange(Number(event.currentTarget.value))}>
								{items.map(item => (
									<option key={item.id} value={item.id}>
										{item.formatted}
									</option>
								))}
							</select>
						)}
					</CalendarYearPicker>
				</div>
			) : null}
		</>
	);
}

export function CalendarGridView({ weekdayStyle = "short" }: Pick<CalendarPanelProps, "weekdayStyle">) {
	return (
		<CalendarGrid weekdayStyle={weekdayStyle} className="lyds-calendar-grid">
			<CalendarGridHeader>{day => <CalendarHeaderCell className="lyds-calendar-weekday">{day}</CalendarHeaderCell>}</CalendarGridHeader>
			<CalendarGridBody>{date => <CalendarCell date={date} className="lyds-calendar-cell" />}</CalendarGridBody>
		</CalendarGrid>
	);
}

export function CalendarPanel({ weekdayStyle, showMonthYearPickers, disabled, className }: CalendarPanelProps) {
	return (
		<div className={cx("lyds-calendar-panel", className)}>
			<CalendarNavigation showMonthYearPickers={showMonthYearPickers} disabled={disabled} />
			<CalendarGridView weekdayStyle={weekdayStyle} />
		</div>
	);
}

function CalendarImpl<T extends DateValue>(
	{ locale, className, disabled, readOnly, invalid, onValueChange, weekdayStyle, ...calendarProps }: CalendarProps<T>,
	ref: React.ForwardedRef<HTMLDivElement>
) {
	return (
		<LocaleBoundary locale={locale}>
			<AriaCalendar
				{...calendarProps}
				ref={ref}
				className={cx("lyds-calendar", className)}
				{...(disabled === undefined ? {} : { isDisabled: disabled })}
				{...(readOnly === undefined ? {} : { isReadOnly: readOnly })}
				{...(invalid === undefined ? {} : { isInvalid: invalid })}
				{...(onValueChange === undefined ? {} : { onChange: onValueChange })}
			>
				<CalendarPanel weekdayStyle={weekdayStyle} disabled={disabled} />
			</AriaCalendar>
		</LocaleBoundary>
	);
}

export const Calendar = forwardRef(CalendarImpl) as <T extends DateValue = CalendarDate>(props: CalendarProps<T> & RefAttributes<HTMLDivElement>) => ReactElement | null;
