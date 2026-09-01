# @lyds/ui

Linyao Design System 是麟曜數位工作室的設計系統。`@lyds/ui` 提供 React 元件、TypeScript 型別、語意設計變數、亮色與深色主題，以及元件樣式。

> 此套件尚未發佈至 npm。取得專案負責人明確批准前，不得發佈套件。

## 安裝

套件公開發佈後，可使用 pnpm 安裝：

```sh
pnpm add @lyds/ui @phosphor-icons/react
```

在應用程式入口匯入一次樣式：

```tsx
import "@lyds/ui/styles.css";
```

## 使用

```tsx
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { Button, TextField } from "@lyds/ui";

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
	--control-primary: oklch(67% 0.22 32);
	--control-primary-hover: oklch(72% 0.2 32);
	--control-on-primary: oklch(10% 0.01 32);
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
import { Button, DatePicker } from "@lyds/ui";
import "@lyds/ui/styles.css";
```

不要匯入 `@lyds/ui/src/**`、`@lyds/ui/dist/**` 或內部工具。公開介面以套件提供的 `dist/index.d.ts` 為準。

## 無障礙

Linyao Design System 以 WCAG 2.2 AA 為目標，提供鍵盤操作、焦點樣式、錯誤與狀態語意、最小操作尺寸及降低動態效果支援。使用端仍須提供正確標籤、內容、焦點順序、符合對比要求的自訂主題與實際流程測試。

## 文件

完整的安裝、Storybook、開發、元件、設計變數、主題與發佈規範請參閱 [專案 README](https://github.com/linyao-tw/ui#readme) 與 [文件目錄](https://github.com/linyao-tw/ui/tree/main/docs)。

授權：Apache-2.0。發佈前須確認套件內容中的授權檔與專案一致。
