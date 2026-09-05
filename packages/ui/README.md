# @linyao.tw/ui

![Linyao Design System 元件示意圖](https://raw.githubusercontent.com/linyao-tw/ui/main/assets/og-image.png)

Linyao Design System 是麟曜數位工作室的設計系統。`@linyao.tw/ui` 提供 React 元件、TypeScript 型別、語意設計變數、亮色與深色主題，以及元件樣式。

## 安裝

使用 pnpm 安裝：

```sh
pnpm add @linyao.tw/ui @phosphor-icons/react
```

在應用程式入口匯入一次樣式：

```tsx
import "@linyao.tw/ui/styles.css";
```

`styles.css` 不含任何遠端請求。需要品牌字型時另外匯入可選入口，或自行代管字型並覆寫 `--font-family-*`：

```tsx
import "@linyao.tw/ui/fonts.css";
```

`styles.css` 除了設計變數與元件樣式，也包含一層文件基準樣式：`box-sizing`、`margin`／`padding` 歸零、`body` 的背景與文字色、表單控制項的 `font: inherit` 與 `::selection`。這層放在 `@layer lyds.base`，未分層的應用程式樣式一律勝過它，因此覆寫不需要提高選擇器權重。

## 使用

```tsx
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { Button, TextField } from "@linyao.tw/ui";

export function ProfileForm() {
	return (
		<form>
			<TextField label="顯示名稱" name="displayName" required />
			<Button type="submit" startIcon={<FloppyDiskIcon weight="bold" />}>
				儲存
			</Button>
		</form>
	);
}
```

## 主題

以 `data-lyds-theme` 切換亮色或深色主題：

```html
<html data-lyds-theme="dark"></html>
```

自訂主題時應覆寫語意角色，不要直接修改元件顏色：

```css
.product-theme {
	--control-primary: var(--palette-signal-600);
	--control-primary-hover: var(--palette-signal-700);
	--control-on-primary: var(--palette-warm-25);
	--focus-ring: oklch(48% 0.17 32);
}
```

## 設計邊界

- 元件不包含 API 呼叫、路由、分析、儲存或業務驗證。
- `DataTable` 不內建排序、篩選或資料擷取。
- `FileUpload` 與 `DropZone` 不內建上傳傳輸或安全驗證。
- 日期與時間元件使用結構化值，不預設地區、時區或顯示格式。
- 一般互動以 Base UI 實作；日期與時間元件使用 React Aria Components 與 `@internationalized/date`。

## 公開介面

請從套件公開匯出項目匯入：

```tsx
import { Button, DatePicker } from "@linyao.tw/ui";
import "@linyao.tw/ui/styles.css";
```

不要匯入 `@linyao.tw/ui/src/**`、`@linyao.tw/ui/dist/**` 或內部工具。公開介面以套件提供的 `dist/index.d.ts` 為準。

## 無障礙

Linyao Design System 以 WCAG 2.2 AA 為目標，提供鍵盤操作、焦點樣式、錯誤與狀態語意、最小操作尺寸及降低動態效果支援。使用端仍須提供正確標籤、內容、焦點順序、符合對比要求的自訂主題與實際流程測試。

## 文件

變更記錄見 [CHANGELOG.md](https://github.com/linyao-tw/ui/blob/main/CHANGELOG.md)。完整的安裝、Storybook、開發、元件、設計變數、主題與發佈規範請參閱 [專案 README](https://github.com/linyao-tw/ui#readme) 與 [文件目錄](https://github.com/linyao-tw/ui/tree/main/docs)。

授權：Apache-2.0。套件與專案包含相同的完整授權檔。
