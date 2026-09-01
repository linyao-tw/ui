# Components

本文件描述 LYDS 的 component families、共同 API 與 composition boundaries。專案仍在首次發佈前整合；**實際可匯入的符號一律以 `packages/ui/src/index.ts` 及 build 產生的 `dist/index.d.ts` 為準**。Source tree 中存在但尚未納入 public barrel 的檔案，不構成 release guarantee。

## Common API vocabulary

不同 component semantics 需要不同 props，但相同概念使用相同名稱：

| Concept          | API                                                            | Notes                                                      |
| ---------------- | -------------------------------------------------------------- | ---------------------------------------------------------- |
| 視覺／語意層級   | `variant`                                                      | 不使用 `intent` / `appearance` 表達同一件事                |
| 尺寸             | `size="sm"` / `size="md"` / `size="lg"`                        | 某些 primitive 可只支援適用 subset                         |
| Layout direction | `orientation`                                                  | 只在語意存在 horizontal/vertical 時使用                    |
| State            | `disabled`, `readOnly`, `required`, `invalid`, `loading`       | 映射到 native/Base UI/RAC semantics                        |
| Value            | `value`, `defaultValue`, `onValueChange`                       | controlled/uncontrolled；不混用兩種 ownership              |
| Open             | `open`, `defaultOpen`, `onOpenChange`                          | popup/disclosure controlled/uncontrolled                   |
| Form semantics   | `name`, `min`, `max`, `step`                                   | 在 underlying primitive 支援時穿透                         |
| Localization     | `locale`, `hourCycle`, `firstDayOfWeek`, structured value type | 只在相關 component 使用；時區由 `ZonedDateTime` value 表達 |
| Composition      | `children`, anatomy parts, `render`                            | 優先 compose，不 fork source                               |
| Consumer layout  | `className`, `style`                                           | 用於 placement/size；顏色優先覆寫 tokens                   |

Controlled example：

```tsx
const [value, setValue] = React.useState("line-a");

<SegmentedControl value={value} onValueChange={next => next && setValue(next)} aria-label="Production line">
	<SegmentedControlItem value="line-a">Line A</SegmentedControlItem>
	<SegmentedControlItem value="line-b">Line B</SegmentedControlItem>
</SegmentedControl>;
```

Uncontrolled example：

```tsx
<Select
	defaultValue="normal"
	options={[
		{ value: "normal", label: "Normal" },
		{ value: "priority", label: "Priority" }
	]}
	aria-label="Dispatch mode"
/>
```

不要同時傳 `value` 與 `defaultValue`。Consumer 若控制 value/open，亦負責同步更新 callback；LYDS 不在背後建立第二份 business state。

## Implementation inventory

以下是首次 release candidate 的 source inventory，仍需在整合結束後與 public barrel、Storybook 及 tarball 逐項校對。

### Foundations and basic

- `Button`：`primary`、`secondary`、`quiet`、`danger`；sizes、loading、start/end icon。
- `IconButton`：強制 accessible name 的 icon-only action。
- `Link`：保持 link/navigation semantics。
- `Badge`、`Avatar`、`Separator`。
- `Card` anatomy 與 `CloudBox` alias：material/elevated/inset/outline/cloud surfaces。
- `SectionHeading`。
- `ListCell` anatomy：leading、content、title、description、metadata、trailing。

`Button` loading 會使 action disabled 並加上 `aria-busy`；consumer 仍須提供清楚 label，不能只靠 spinner。`IconButton` 的 visual child 會是 decorative，因此 accessible name 必須由 `aria-label` 或 `aria-labelledby` 提供。

```tsx
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { Button, IconButton } from "@lyds/ui";

<Button startIcon={<FloppyDiskIcon weight="bold" />}>Save changes</Button>;
<Button endIcon={<ArrowRightIcon weight="bold" />}>Continue</Button>;
<IconButton aria-label="Add item">
	<PlusIcon weight="bold" />
</IconButton>;
```

`startIcon`／`endIcon` 是 decorative `ReactNode` slots，尺寸與顏色由 Button anatomy 控制；loading 時 spinner 取代 start icon，end icon 同時隱藏，但 visible label 保留為 accessible name。Icon-only action 不使用 Button icon slots，而使用 `IconButton` 的唯一 visual child。Client code 採 Phosphor individual CSR import；不要手寫 SVG 或以 Unicode 字元代替 icon。

### Forms and input

- Low-level `Input`。
- `TextField`、`Textarea` / `TextView`。
- `SearchField`、`PasswordField`、`NumberField`。
- `CodeField`、`PhoneField`、`OTPField`。
- `FileUpload`、`DropZone`。

Field family 共用 label、description、error、required/invalid/disabled/readOnly 與 `sm/md/lg` anatomy。省略 visible label 時必須在實際 control 提供 `aria-label` 或 `aria-labelledby`。

`PhoneField` 只設定適合的 input affordance，不解析國碼、不驗證電話號碼，也不綁定聯絡人資料。`CodeField` 不決定 verification protocol。`OTPField` 管理 multi-slot input interaction，但發送、重送、倒數與 server verification 屬於 application。

`FileUpload` / `DropZone` 只回傳 browser `File` objects；upload transport、limits、MIME/content validation、retry、progress source 與 security scan 由 application 決定。`accept` 只是 browser hint，不是安全驗證。

### Selection

- `Checkbox`、`CheckboxGroup` 與 labeled `CheckboxItem`。
- `RadioGroup`、`Radio` 與 labeled `RadioItem`。
- `Switch`。
- `Slider`。
- `Toggle`、`ToggleGroup`、`SegmentedControl` / `SegmentedControlItem`。
- `Select`，同時提供 high-level `options` API 與 compositional parts。
- `Combobox`、`Autocomplete`，同時提供 high-level options 與 anatomy parts。
- `DropdownMenu` / `Menu`、`ContextMenu`。

使用 `Switch` 表達立即生效的 binary setting；用 `Checkbox` 表達表單中的獨立 choice；用 `RadioGroup` 表達一組互斥 options；用 `SegmentedControl` 表達少量且並列的互斥 views/modes。不要只因外觀相近而交換 semantics。

High-level `Select` / `Combobox` 適合一般 options。需要 group、separator、rich item 或特殊 render 時使用同一 component 的 anatomy parts，不要繞過 LYDS 直接混搭 unstyled primitives。

### Disclosure and structure

- `Accordion` family。
- `Collapsible` family。
- `Tabs` family：Root、List、Tab、Indicator 與 Panel；Indicator 預設隱藏，可由產品在確有需要時自行樣式化。

Accordion 是多 section disclosure；Collapsible 是單一 region；Tabs 是在同一 context 中切換 panels。Tabs 不應被拿來偽裝 route navigation；需要真正 URL/link semantics 時使用 navigation patterns。

### Overlays

- `Tooltip`、`Popover`、`PreviewCard`。
- `Dialog` / `Modal`。
- `AlertDialog`。
- `Drawer`。
- `BottomSheet`，包含 handle、header/body/footer 與 snap points。

Overlay family 採 anatomy composition，保留 Base UI 的 focus trapping、Escape、return focus、outside interaction 與 positioning semantics。最小 Dialog 結構：

```tsx
<Dialog.Root>
	<Dialog.Trigger render={triggerProps => <Button {...triggerProps}>Open settings</Button>} />
	<Dialog.Portal>
		<Dialog.Backdrop />
		<Dialog.Viewport>
			<Dialog.Popup hasCustomClose>
				<Dialog.Header>
					<Dialog.Title>Settings</Dialog.Title>
					<Dialog.Description>Adjust this workstation.</Dialog.Description>
				</Dialog.Header>
				<Dialog.Body>{/* fields */}</Dialog.Body>
				<Dialog.Footer>
					<Dialog.Close
						render={closeProps => (
							<Button {...closeProps} variant="secondary">
								Done
							</Button>
						)}
					/>
				</Dialog.Footer>
			</Dialog.Popup>
		</Dialog.Viewport>
	</Dialog.Portal>
</Dialog.Root>
```

若 `Dialog.Popup` 中另外提供 accessible `Dialog.Close`，設定 `hasCustomClose`，避免重複內建 close。`AlertDialog` 用於需要明確確認的中斷式決策，不用於一般資訊。Tooltip 不能承載完成任務所必需、keyboard/touch 無法取得的唯一內容；trigger 的 accessible name 必須包含 visible label。需要 screen reader 與 touch 使用者主動探索內容時，改用 `Popover`。

### Feedback

- `Alert` / `AlertView` anatomy 與 `Banner`。
- `ToastProvider`、`ToastViewport`、`ToastRoot` 與 toast manager helpers。
- `Progress`、`Meter`。
- `Spinner` / `Loader`。
- `Skeleton`。
- `EmptyState`。

Feedback status vocabulary 為 `neutral`、`info`、`success`、`warning`、`danger`。Status 不能只靠 signal color，仍要有可理解 title/description 或 accessible label。

Toast queue 由 Base UI manager 管理；consumer 決定何時 enqueue、deduplicate、retry 或將 backend error 轉成文案。長時間、需要回顧或會影響 task completion 的訊息不應只放 transient toast。

`Progress` 表達 task completion；`Meter` 表達已知 range 中的 measurement。Indeterminate loading 使用 `Spinner` / `Loader`，並由 surrounding region 提供適當的 busy relationship。

### Navigation and application chrome

- `Breadcrumb`、`Pagination`。
- `NavigationMenu`、`Menubar`、`Toolbar`。
- `Header` composition primitives。
- `TabBar` pattern。
- `CommandPalette` composition。

LYDS 不知道 application router。Link destination、active route、prefetch 與 navigation side effects 由 consumer 提供；可透過 render/composition API 接上 router link，但必須保留 anchor semantics、accessible name 與 keyboard behavior。

Pagination 只呈現 controls 與目前狀態，不取得資料也不決定 zero/one-based page model。CommandPalette 提供 dialog + combobox composition，不建立 command registry、hotkey policy、permissions 或 async search backend。

### Data and content

- Native-semantic `Table` anatomy、`TableFrame`。
- `DataTable` presentation composition：header/title/description/controls/status/region。
- `ScrollArea` anatomy。
- `List`、`OrderedList`、`Collection` 與 item/content/actions/meta primitives。

`DataTable` 刻意不含 sorting algorithm、filter state、server pagination、row selection business rule、data fetching 或 column schema engine。Consumer 可用 native table semantics、buttons、checkboxes 與 status regions compose 自己的 data behavior。

`Collection` 是 presentation/composition primitive，不宣稱處理 large-data virtualization。超大型清單的 windowing、measurement 與 async loading 需由 product 選擇合適策略，再保持 LYDS semantics/tokens。

### Date & Time

- `Calendar`，包含 month/year navigation、keyboard calendar grid、min/max 與 unavailable dates。
- `DateField`。
- `DatePicker`。
- `DateRangePicker`。
- `TimeField`、`TimePicker`。
- `DateTimePicker`。

Date & Time 使用 React Aria Components 和 `@internationalized/date`。LYDS 從 package root re-export 常用 value classes/parsers，因此 consumer 不需穿透 internal dependency path：

```tsx
import { useState } from "react";
import { CalendarDate, DateRangePicker } from "@lyds/ui";

const [range, setRange] = useState({
	start: new CalendarDate(2026, 9, 1),
	end: new CalendarDate(2026, 9, 5)
});

<DateRangePicker
	label="Maintenance window"
	locale="zh-TW"
	value={range}
	onValueChange={next => next && setRange(next)}
	minValue={new CalendarDate(2026, 9, 1)}
	isDateUnavailable={date => date.day === 13}
/>;
```

Value semantics：

- `CalendarDate`：不帶時間／時區的曆日，例如生日或結算日。
- `CalendarDateTime`：沒有具名時區的 wall-clock date/time。
- `ZonedDateTime`：包含具名 IANA time zone 與 exact instant semantics。
- `Time`：不帶日期的 wall-clock time。

`locale` 控制語言與 locale-sensitive segments；`hourCycle`、`granularity`、`firstDayOfWeek`、`minValue`、`maxValue` 與 `isDateUnavailable` 在相應 underlying API 支援時由 consumer 指定。不要把 `zh-TW`、`Asia/Taipei`、`YYYY/MM/DD` 或 24-hour clock 當作 library default。

LYDS 不靜默把 `CalendarDateTime` 轉成 `ZonedDateTime`。若產品需要 exact instant，必須在 boundary 明確提供 time zone，處理 DST/nonexistent/ambiguous wall time，並以 domain rule 決定序列化方式。

## Intentionally not in the component layer

首次 release candidate 刻意不內建：

- DataTable sorting/filtering/data fetching/virtualization engine；
- upload transport 或 cloud-provider adapter；
- international phone parsing／country database；
- command registry、global keyboard shortcut manager 或 router integration；
- form-library-specific adapters；
- analytics、persistence、permissions、API clients；
- product-specific date formatting、holiday calendars、booking constraints 或 timezone conversion policy。

這些不是「未完成的小功能」，而是 design system 與 application 的 ownership boundary。若未來出現跨產品、無 business assumptions、可維持 accessibility 的穩定需求，才評估新增 headless adapter 或 pattern。

## Choosing composition over forks

新增 wrapper 前依序判斷：

1. 現有 `variant` / `size` / semantic token 是否已涵蓋？
2. 是否可用 anatomy parts 組合？
3. 差異是否只是 consumer layout，可用 `className` 解決？
4. 是否是 business logic，應留在 product？
5. 只有 shared、repeatable、accessible behavior 才新增 LYDS component。

Fork component 會切斷 future fixes、tokens、keyboard behavior 與 tests。若確實需要新 component，請依 [Contributing](contributing.md) 完成 API、states、stories、tests、a11y 與 package export。
