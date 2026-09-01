# Linyao Design System 日期與時間架構

Base UI 尚未提供公開的日期或時間基礎元件。因此，此系列使用 `react-aria-components` 處理區段編輯、日曆狀態、鍵盤操作、焦點管理、驗證，以及 Popover 與 Dialog 語意；`@internationalized/date` 則負責不可變值與日曆運算。兩項依賴都只透過公開套件介面匯入。Linyao Design System 負責視覺呈現，不以自訂事件處理取代 React Aria 行為。

## 值的語意

- `Calendar`、`DateField` 與 `DatePicker` 預設使用 `CalendarDate`，表示不含時間與時區的日期。
- `DateRangePicker` 預設使用一組 `CalendarDate` 範圍。
- `TimeField` 與 `TimePicker` 預設使用 `Time`，表示不含日期與時區的時間。
- `DateTimePicker<CalendarDateTime>` 表示不含時區的日期與時間。
- `DateTimePicker<ZonedDateTime>` 表示位於明確 IANA 時區的日期與時間。Linyao Design System 不會將 `CalendarDateTime` 自動轉換成 `ZonedDateTime`，也不會預設本地時區。

可使用公開的 `parseDate`、`parseTime`、`parseDateTime` 與 `parseZonedDateTime` 建立值。受控值使用 `value` 與 `onValueChange`；非受控值使用 `defaultValue`。選擇器的開啟狀態使用 `open`、`defaultOpen` 與 `onOpenChange`。

## 地區設定與限制

選用的 `locale` 屬性接受 BCP 47 地區代碼，控制區段順序、在地化標籤、數字、星期名稱與預設小時制。省略時會沿用最近的 React Aria `I18nProvider` 或瀏覽器地區設定。使用端可個別設定 `hourCycle`、`firstDayOfWeek` 與 `granularity`，不會影響整個應用程式。

`minValue`、`maxValue` 與 `isDateUnavailable` 由使用端提供。`DateRangePicker` 也會轉交 `allowsNonContiguousRanges`。業務規則與最終顯示格式仍由應用程式負責。

`TimePicker` 使用可存取的區段式時間輸入，不預設有限的時間選項。此設計可準確支援秒數、符合地區慣例的上午／下午表示、最小值、最大值與時區值，同時避免加入特定業務的時間間隔。
