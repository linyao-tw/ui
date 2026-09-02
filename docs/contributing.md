# 貢獻指南

新增或修改元件時，必須同時處理 API、行為基礎、語意變數、亮色／深色、互動狀態、Storybook、測試、匯出項目、型別與套件內容。

## 開發需求

- Node.js 22.13+；發佈工作流程另需符合 npm Trusted Publishing 的版本要求。
- 儲存庫 `packageManager` 欄位指定的 pnpm。
- macOS 或 Linux shell；CI 是跨環境檢查依據。

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm pack:check
```

不得在檢查 `package.json` 與鎖定檔前替換工具。臨時視覺檢查優先使用全域 Playwright CLI：

```sh
command -v playwright
```

若全域 CLI 可用，使用它執行截圖、開啟頁面或 codegen。只有需要提交可重複使用的測試或 CI 瀏覽器覆蓋時，才新增專案層級的 Playwright 依賴。

## 新增元件前的檢查

1. `@linyao.tw/ui` 是否已有相同語意的元件？
2. 是否能以現有 parts 或 `render` 組合？
3. 差異是否只需調整版面或設計變數設定？
4. Base UI 是否已提供所需行為？
5. 日期與時間是否應使用現有 React Aria Components 技術組合？
6. 需求是否屬於應用程式業務邏輯？

不要為單一產品建立 `CustomerDatePicker` 或分支修改 `Button`。只有跨產品、沒有業務假設且可維持可存取性的行為才納入 Linyao Design System。

## 元件實作檢查

### API

- 使用一致的 `variant`、`size`、`orientation`。
- 有狀態元件提供適用的受控／非受控 API。
- 保留底層回呼資訊，不移除互動原因或取消事件。
- Ref 指向有用的根元素或互動元素。
- 保留 `className`、`style` 與 Base UI 狀態 class／render 能力，除非有明確型別或安全理由。
- 正確傳遞 `name`、`required`、`min`、`max`、`step` 等原生屬性。
- 只有圖示的操作必須有可存取名稱。
- 不加入 API、路由、儲存、分析、表單框架或領域驗證假設。

### 行為基礎

- 操作、選取、浮層、展開元件與導覽優先使用 Base UI。
- 日期與時間使用 React Aria Components 與 `@internationalized/date`；不得自行實作日曆運算。
- 不加入另一套樣式化元件系統。
- Base UI 組合使用 `render`，不是 `asChild`。Render 回呼必須完整傳遞 props 與 ref。

### 圖示

- 介面圖示只使用 `@phosphor-icons/react`；用戶端原始碼、Storybook 與測試使用個別 `/dist/csr/<Name>` 匯入。
- 禁止手寫 JSX `<svg>`、舊版 `phosphor-react`、Unicode 控制字形與 CSS 偽元素圖示。
- 圖示繼承 `currentColor`；尺寸由元件與 `--icon-size-*` 變數控制。
- 文字按鈕使用 `startIcon`／`endIcon`；只有圖示的操作使用 `IconButton` 並提供 `aria-label` 或 `aria-labelledby`。
- 新增含圖示的元件時，stories 必須顯示尺寸與停用／載入狀態；測試必須驗證可存取名稱與載入圖示替換。

### CSS

- 所有顏色使用語意變數，包括陰影、浮層、狀態、焦點與停用狀態。
- 固定長度使用 `rem`；只有細線／分隔線可使用 1px。
- 所有 transition 持續時間／easing 使用動態效果變數。
- 實作適用的亮色／深色、hover、按下、`focus-visible`、選取、開啟、停用、唯讀、載入與無效狀態。
- 不加入 Figma 沒有依據的切角、假標籤、面板接縫或工程網格。
- `prefers-reduced-motion: reduce` 下仍能辨識狀態。

### Storybook

每個主要元件應涵蓋適用的：

- 預設、variants、尺寸；
- 停用、載入、無效、唯讀；
- 受控／非受控；
- 亮色／深色；
- 長文字與窄螢幕；
- 實際組合；
- 鍵盤互動／play function；
- 日期地區設定／範圍／限制或浮層巢狀結構等特定情況。

Storybook 必須從 `@linyao.tw/ui` 公開 API 匯入，不得使用 `../../packages/ui/src/**`。

### 測試

測試互動行為，不以快照取代斷言：

- render 與可存取名稱／說明／錯誤關聯；
- 受控／非受控狀態；
- 方向鍵、Enter／Space、Escape、Tab；
- 焦點限制、焦點返回、關閉與外部互動；
- 停用／唯讀／無效／載入；
- 表單值與重設；
- Base UI 組合；
- 閏年、月份／年份邊界、範圍、最小／最大值、不可用日期；
- 依地區設定排列的區段、一週首日、12／24 小時制；
- 有時區與當地時間的值語意；
- axe 自動檢查；
- 可自動化的減少動態效果變數／狀態。

Jsdom 測試無法證明真實瀏覽器焦點、版面或指標行為。浮層元件、Dialog／Drawer 內的 DatePicker、RTL 與響應式介面必須另用 Storybook／瀏覽器驗證。

## 新增設計變數

1. 以角色／狀態定義需求。
2. 檢查是否已有適用的語意變數。
3. 同時設定亮色與深色。
4. 更新 `docs/tokens.md` 與 Storybook Foundations。
5. 確認元件 CSS 沒有原始色值或未命名 easing。
6. 驗證受影響的對比與狀態。

公開變數重新命名／移除可能是破壞性變更。

## 新增公開匯出

1. 從元件分類的 `index.ts` 匯出實作與必要型別。
2. 從 `packages/ui/src/index.ts` 匯出公開 API。
3. 不匯出內部 class 工具、測試設定或私有 parts。
4. 執行 `pnpm build:package` 並檢查 `dist/index.d.ts`。
5. Storybook 使用套件名稱匯入。
6. 執行 `pnpm pack:check`，確認 tarball 有 JS、型別、CSS、README 與授權，且沒有原始碼、測試、設定或快取。

只有具備穩定維護邊界與使用端 bundle 證據時才新增子路徑匯出，並同步更新 `package.json#exports`、型別、建置與封裝驗證。

## 驗證

提交前執行：

```sh
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build:package
pnpm build:storybook
pnpm pack:check
```

或：

```sh
pnpm check
pnpm pack:check
```

若未執行任何項目，PR 必須明確說明原因。

視覺變更需啟動 Storybook：

```sh
pnpm storybook
```

至少檢查亮色／深色、桌面／行動裝置、鍵盤焦點、減少動態效果與實際組合。PR 應附適用截圖；無法截圖的互動需說明人工檢查方式。

## Git commit 訊息

依儲存庫規範使用 Linux kernel／Git-style 區域前綴，不使用通用 Conventional Commit 類型：

```text
ui/button: add loading state semantics
ui/date-time: validate zoned picker values
storybook: document overlay compositions
publishing: guard npm releases behind repository variable
```

摘要使用祈使動詞、具體且盡量少於 72 個字元，不加句點。理由無法從差異看出時，在 commit 內容說明原因。每個 commit 應是可獨立檢查的完整變更，不混入無關內容。

## Pull request

PR 應包含：

- 修改範圍與使用者／開發者可見的影響；
- API 或設計變數相容性；
- 實際執行的驗證命令與結果；
- 相關 issues；
- 可見介面的截圖；
- 可存取性、鍵盤與人工檢查；
- 延後工作或剩餘風險。

不得在元件 PR 中啟用 `NPM_PUBLISH_ENABLED`、建立發佈 tag 或直接發佈套件。發佈需要另行明確批准，詳見[發佈](publishing.md)。
