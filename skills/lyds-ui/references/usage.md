# 使用 Linyao Design System

Linyao Design System 是麟曜數位工作室的設計系統。顯示名稱不得縮寫；小寫 `lyds` 只用於技術 API。

## 安裝 Skill

`lyds-ui/SKILL.md` 是 Skill 入口，`agents/`、`references/` 與 `scripts/` 是支援檔案。先預覽安裝位置，再明確執行：

```sh
./skills/lyds-ui/scripts/install.sh
./skills/lyds-ui/scripts/install.sh --apply
```

預設目標是 `$CODEX_HOME/skills`；未設定 `CODEX_HOME` 時使用 `$HOME/.codex/skills`。也可傳入 `--target-root DIRECTORY`。安裝程式不會覆寫既有的 `lyds-ui` Skill。

## 檢查與安裝套件

變更依賴前先檢查使用端：

```sh
rg -n --glob 'package.json' --glob '!node_modules/**' '"(@lyds/ui|@phosphor-icons/react)"' .
pnpm list @lyds/ui @phosphor-icons/react --depth 0
```

pnpm workspace 應限定至實際使用的套件：

```sh
pnpm --filter '<consumer-package>' list @lyds/ui @phosphor-icons/react --depth 0
pnpm --filter '<consumer-package>' add @lyds/ui @phosphor-icons/react
```

使用同一 workspace 的本機版本：

```sh
pnpm --filter '<consumer-package>' add '@lyds/ui@workspace:*' @phosphor-icons/react
```

相容版本已存在時不要無故重裝。使用不熟悉的元件前，檢查套件 `exports`、型別與 Storybook。不得匯入 `@lyds/ui/src/**`、`@lyds/ui/dist/**` 或其他內部路徑。

## 樣式與主題

在應用程式入口或框架版面中匯入一次樣式：

```tsx
import "@lyds/ui/styles.css";
```

在文件根節點或獨立區域設定主題：

```tsx
<main data-lyds-theme={theme === "dark" ? "dark" : "light"}>{children}</main>
```

Dialog、Menu、Tooltip 等元件會透過 portal 顯示於 `body` 時，優先在文件根節點設定主題。應用程式負責取得、儲存與同步使用者偏好。

自訂樣式以語意變數為界線：

```css
.account-panel {
	--account-panel-background: var(--background-elevated);
	--account-panel-border: var(--divider-main);

	padding: var(--space-4);
	color: var(--text-main);
	background: var(--account-panel-background);
	border: 1px solid var(--account-panel-border);
}
```

設計變數會固定轉為 CSS 變數，例如 `Text/Always_White` 轉為 `--text-always-white`。產品可以建立指向語意設計變數的別名，但不得在元件 CSS 寫入 hex、rgb、hsl、oklch、命名顏色或含顏色的陰影。

固定長度優先使用現有的間距、字體、控制項、圓角、層級與動態效果設計變數；沒有適用設計變數時使用 `rem`。百分比、`fr`、視窗單位與無單位 `line-height` 可依語意使用。只有真正的細線可使用 `1px`。

## 圖示與操作元件

介面圖示統一使用 `@phosphor-icons/react`。瀏覽器端應從單一 CSR 檔案匯入，避免開發工具處理完整的圖示匯出入口：

```tsx
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { Button, IconButton } from "@lyds/ui";

export function Actions() {
	return (
		<>
			<Button startIcon={<FloppyDiskIcon weight="bold" />}>儲存變更</Button>
			<Button endIcon={<ArrowRightIcon weight="bold" />}>繼續</Button>
			<IconButton aria-label="新增項目">
				<PlusIcon weight="bold" />
			</IconButton>
		</>
	);
}
```

元件名稱保留 `Icon` 後綴，個別檔案路徑不含後綴。不得從 `@phosphor-icons/react` 的根匯出入口、舊版 `phosphor-react` 或手寫 JSX `<svg>` 匯入瀏覽器端圖示。Phosphor 已有對應概念時，不得以 `×`、`✓`、箭頭、圓點或 CSS pseudo-element 代替。

`Button` 的 `startIcon` 與 `endIcon` 是裝飾內容，可存取名稱由按鈕文字提供。圖示不指定任意 `color` 或 `size`，而是繼承 `currentColor` 與按鈕尺寸。`IconButton` 必須提供 `aria-label` 或 `aria-labelledby`。獨立裝飾圖示應加上 `aria-hidden="true"`；重要狀態還必須有文字或其他可存取名稱。

React Server Component 或無法使用 React Context 的環境使用公開 SSR 模組：

```tsx
import { FishIcon } from "@phosphor-icons/react/ssr";
```

CSR 與 SSR 的匯入應留在各自的環境邊界。

## 選擇與組合元件

1. 檢查公開匯出項目、型別與對應 Storybook。
2. 選擇已具備所需語意與鍵盤行為的元件。
3. 複雜浮層、選單、表格或集合使用文件公開的組成部分。
4. 透過 `className`、`style`、children 或公開渲染 API 加入產品版面。
5. 只有現有組合無法表達，而且行為可跨產品重用時，才新增基礎元件。

遵循各元件宣告的 API。常見名稱包含 `variant`、`size`、`orientation`、`disabled`、`loading` 與 `invalid`。保留轉送的 ref、可存取名稱及受控／非受控行為。資料請求、路由、排序、篩選、驗證政策、分析與儲存由產品負責。

## 日期與時間

日期時間元件使用結構化國際化值，不使用格式不明的字串或 JavaScript `Date`：

- `CalendarDate`：不含時間與時區的日期。
- `Time`：不含日期與時區的時間。
- `CalendarDateTime`：不含時區的日期與時間。
- `ZonedDateTime`：含具名時區與確切 offset／instant。

依用途使用 `DatePicker`、`DateRangePicker`、`TimePicker`／`TimeField` 或 `DateTimePicker`。`value`／`defaultValue`、`onValueChange`、`minValue`、`maxValue` 應使用相同的值類型，不要自動轉換。

```tsx
import { CalendarDate } from "@internationalized/date";
import { DatePicker } from "@lyds/ui";

const minimum = new CalendarDate(2026, 1, 1);

<DatePicker label="日期" locale={locale} value={date} minValue={minimum} onValueChange={setDate} />;
```

若公開 API 沒有重新匯出建構函式或解析器，使用端必須直接安裝 `@internationalized/date`，不要依賴間接依賴提升。

地區設定控制顯示順序、名稱與數字符號，不會指定時區。只傳入元件型別實際支援的 BCP 47 locale、`firstDayOfWeek`、`hourCycle`、granularity 或停用日期判斷函式。需要時區的 `DateTimePicker` 應在應用程式邊界建立或解析 `ZonedDateTime`；時區稍後才決定的預約使用 `CalendarDateTime`。可重用元件不得硬編碼地區設定、日期格式、12／24 小時制或時區。
