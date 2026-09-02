# 架構

Linyao Design System 採 pnpm 單一儲存庫架構，對外只提供 `@linyao.tw/ui`。使用者安裝一個套件即可取得 React 元件、TypeScript 型別與 CSS；Storybook、測試與發佈流程使用相同的公開邊界。

## 工作區結構

```text
/
├─ apps/
│  └─ storybook/       # 審閱與文件，不發佈
├─ packages/
│  └─ ui/              # 唯一預計公開的 npm 套件
├─ docs/               # 架構、設計、使用與發佈規則
├─ skills/
│  └─ lyds-ui/         # coding-agent skill 原始檔
├─ scripts/            # 儲存庫與 tarball 驗證工具
└─ .github/workflows/  # CI 與受開關保護的發佈流程
```

根目錄與 `apps/storybook` 的套件均為 `private: true`。只有 `packages/ui` 對應 `@linyao.tw/ui`。

## 公開套件邊界

公開使用方式：

```tsx
import { Button, DatePicker } from "@linyao.tw/ui";
import "@linyao.tw/ui/styles.css";
```

`packages/ui/package.json` 的 `exports` 是公開 API 的依據。`src/**`、測試工具、內部工具與建置設定均不是公開 API。`files` 白名單與 `pnpm pack:check` 會限制 tarball 內容。

CSS 標記為 side effect，避免正式建置的 tree shaking 移除樣式。建置必須輸出 ESM JavaScript、TypeScript 宣告與 `dist/styles.css`。Storybook 只能透過 `@linyao.tw/ui` 工作區依賴使用套件，不得以跨套件相對路徑匯入原始碼。

目前使用單一根目錄匯出。只有在 bundle 分析證明有需要、子路徑有穩定維護邊界、型別與 CSS side effects 可測試，而且不會暴露內部檔案結構時，才新增元件子路徑匯出。

## 行為層級

```text
產品狀態與業務規則
        ↓
Linyao Design System 元件 API 與樣式
        ↓
Base UI 基礎元件         React Aria Components
（一般元件行為）         （日期與時間行為）
        ↓
React、瀏覽器平台與 Intl
```

### Base UI

Base UI 負責按鈕、選取、選單、浮層、展開元件與導覽等一般互動。Linyao Design System 保留其焦點管理、鍵盤互動、ARIA 關聯與受控／非受控模式，再加入一致的 API、元件結構與語意 CSS。

不得重新實作 Base UI 已處理的巡迴焦點、Escape 關閉、焦點限制、焦點返回或彈出元件定位。

### 日期與時間

Base UI 不提供完整的日期元件，因此日期與時間元件使用：

- `react-aria-components`：日曆格線、日期區段、範圍選取、鍵盤導覽、依地區設定調整的 ARIA 與焦點行為。
- `@internationalized/date`：`CalendarDate`、`CalendarDateTime`、`ZonedDateTime`、日期運算與時區明確的值型別。

這兩項依賴只負責日期邏輯與行為。可見介面、設計變數、間距與狀態仍由 Linyao Design System 控制。其他元件不得只為方便而引入 React Aria Components。

### 圖示

`@phosphor-icons/react` 是唯一標準介面圖示套件。它是 `@linyao.tw/ui` 的同儕依賴，也是套件與 Storybook 的開發依賴。建置時會將 Phosphor 設為外部依賴，不把整套圖示庫包入 `@linyao.tw/ui`。

套件原始碼、Storybook 與一般用戶端元件使用個別 `/dist/csr/<Name>` 匯出；React Server Components 使用 `/ssr`。品牌標誌、插圖與資料視覺化不屬於介面圖示，但仍需設計審核；不得用手寫 JSX SVG、Unicode 字形或 CSS 偽元素圖示取代既有圖示。

## API 規則

相同概念使用相同名稱：

- `variant`：語意或視覺層級，例如 `primary`、`secondary`、`quiet`、`danger`。
- `size`：主要使用 `sm`、`md`、`lg`。
- `orientation`：只用於需要水平或垂直方向的元件。
- `disabled`、`readOnly`、`required`、`invalid`、`loading`：映射至底層基礎元件。
- `value`／`defaultValue`／`onValueChange`：受控／非受控值。
- `open`／`defaultOpen`／`onOpenChange`：浮層與展開元件狀態。
- `className`、`style`、`render` 或元件 parts：支援組合，不暴露內部樣式細節。

`name`、`min`、`max`、`step` 等 HTML 屬性應正確傳遞。Ref 應指向最有用的互動或根元素。可安全繼承底層型別時，不應複製 props 清單。

## 產品邏輯邊界

下列責任由應用程式處理：

- API 呼叫、server actions、快取與樂觀更新。
- 路由導覽、權限與分析。
- localStorage、cookie 或主題保存。
- 領域驗證、貨幣／日期業務規則與資料轉換。
- DataTable 排序、篩選、分頁資料來源與虛擬化規則。
- 檔案上傳端點、multipart 協定、病毒掃描與重試規則。
- Toast 文案、錯誤代碼映射與通知去重複。

元件可提供回呼、render slot 與組合 parts，但不決定回呼的業務效果。

## CSS 架構

單一 CSS entry 的順序：

1. 字體匯入與最小基準樣式；
2. 色盤、字體、間距、形狀、動態效果、z-index 等基礎設計變數；
3. 亮色／深色語意值；
4. 共用工具類別；
5. 元件結構與狀態 selectors。

所有元件顏色必須使用語意變數。固定長度使用 `rem`；只有 1px 細線或分隔線可使用 `px`。流動版面可使用 `%`、`fr`、viewport units 或無單位行高。

全域基準樣式限定為：

```css
*,
*::before,
*::after {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

@media print {
	* {
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
	}
}
```

新增全域正規化前必須說明具體的相容性問題，不加入完整且具版面偏好的 CSS reset。

## 依賴規則

新增正式環境依賴前必須確認：

1. 瀏覽器、React、Base UI 或現有日期依賴無法可靠完成需求；
2. 依賴只提供邏輯／headless 行為，不是另一套樣式化元件系統；
3. bundle、tree shaking、型別、SSR 與授權可接受；
4. 不包含業務假設；
5. 在架構或元件文件記錄原因。

不得加入 MUI、Chakra UI、Mantine、Ant Design 或另一套樣式執行環境。GSAP 不得成為 `@linyao.tw/ui` 執行期依賴；一般動態效果使用設計變數控制的 CSS transition／animation。

## 驗證範圍

`pnpm check` 必須涵蓋格式、lint、型別檢查、測試、套件建置與 Storybook 建置；`pnpm pack:check` 驗證實際 npm tarball。可見介面變更還需在 Storybook 檢查桌面、行動裝置、亮色、深色、鍵盤操作與減少動態效果。

原始碼可編譯不代表套件可使用；Storybook 可顯示也不代表公開匯出與 tarball 正確。兩項都必須驗證。
