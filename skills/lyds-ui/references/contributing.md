# 擴充 Linyao Design System

Linyao Design System 是麟曜數位工作室的設計系統。顯示名稱不得縮寫；小寫 `lyds` 只用於技術 API。

## 判斷是否需要新元件

先檢查 `packages/ui/src/index.ts`、既有元件、公開型別、測試與 Storybook。現有組成部分已提供正確語意時，優先組合，不要重複建立基礎元件。元件庫只收錄可跨產品重用且不含商業邏輯的行為；資料、路由、持久化、分析、篩選與驗證政策留在應用程式。

Base UI 是主要的互動與無障礙基礎。日期時間元件可以使用儲存庫既有的國際化日期與 React Aria 邏輯。不要加入其他帶樣式的元件系統，也不要重寫依賴已提供的鍵盤、焦點、選取或關閉行為。新增重要的執行階段依賴時必須說明理由。

## 圖示

- 加入圖示前先搜尋 Phosphor 圖示目錄。套件原始碼、Storybook 與測試只使用 `@phosphor-icons/react`；瀏覽器端 TSX 從個別 `/dist/csr/<Name>` 匯入。
- 不得手寫 JSX `<svg>`、以 Unicode 或 CSS pseudo-element 代替控制項圖示，或使用舊版 `phosphor-react`。品牌標誌、插圖與資料視覺化必須另行設計檢查。
- 尺寸由元件結構與 `--icon-size-*` 設計變數控制。圖示繼承 `currentColor`，不得指定原始色值。圖示粗細依 Figma 使用 `regular` 或 `bold`；`fill` 只用於有語意的已選取或已勾選狀態。
- `Button` 使用 `startIcon`／`endIcon`；`IconButton` 只放一個視覺內容，並提供可存取名稱。裝飾圖示對輔助技術隱藏；重要狀態同時用文字表達。
- 含圖示的元件 Storybook 範例應展示適用的尺寸、載入中與停用狀態。測試必須確認 Button 文字仍是可存取名稱、IconButton 有名稱，而且載入中不會同時顯示前後圖示。

## 元件 API

- 匯出精確 props，並轉送正確的 ref。
- 有內部狀態時支援受控與非受控用法，沿用 `value`／`defaultValue`／`onValueChange` 或 `open`／`defaultOpen`／`onOpenChange`。
- 適用時沿用 `variant`、`size`、`orientation`、`disabled`、`readOnly`、`required`、`invalid` 與 `loading`。
- 保留 `className`、`style`、children 與公開 composition API，不要暴露私有視覺結構。
- 從套件進入點匯出公開模組；使用端與 Storybook 不得匯入內部模組。
- 元件應支援 tree shaking；CSS 必須包含於套件樣式表，並由 `sideEffects` metadata 保留。

依基礎元件支援的狀態或 data attributes 實作樣式。適用時涵蓋預設、懸停、按下、`focus-visible`、選取／勾選／開啟、停用、唯讀、載入中與無效狀態。顏色、邊框、焦點環、陰影、浮層、停用與狀態色一律使用語意設計變數。固定長度使用設計變數或 `rem`；`1px` 與 Figma 已確認的 `0.5px` 只保留給真正的細線。動畫只使用動態效果設計變數，並維持 `prefers-reduced-motion` 規則。

視覺工作必須先檢查對應的 Modulor Figma 樣本或元件集，再決定結構、尺寸、圓角、間距、字級與變體。實際色彩映射至 Linyao Design System 的語意設計變數。沒有對應元件時，延伸相同的乾淨表面與狀態語言；不要自行加入切角、內嵌接縫、虛構技術標籤、裝飾格線或全面大寫。

## Storybook

將元件放在正確分類，並從 `@lyds/ui` 匯入以驗證公開 API。展示實際適用的變體、尺寸、停用、載入中、無效、長文字、淺色／深色主題與真實組合。鍵盤或浮層行為應加入 Storybook `play` 互動測試。範例內容使用簡潔、專業的繁體中文，只描述元件與狀態，不自創產品名稱或裝飾文案。

## 行為與無障礙測試

使用儲存庫既有的 Vitest、Testing Library、user-event 與無障礙工具，測試可觀察行為，不要只依賴快照。依元件性質檢查：

- 渲染與 ref；
- 受控及非受控更新；
- 鍵盤選取、導覽與焦點順序；
- 浮層的 Escape 關閉、焦點限制與關閉後焦點返回；
- 可存取名稱、`role`、`description`、無效與停用語意；
- 日期邊界、範圍選取、locale 顯示與時區值保存；
- axe 自動檢查及必要的人工 assertions；
- 可觀察的 reduced-motion 行為。

不得移除瀏覽器原生焦點外框而沒有等效的可見焦點。裝飾不得降低文字、狀態、觸控尺寸或對比的清楚程度。

## 驗證

開發時執行相關測試；交付前從儲存庫根目錄執行：

```sh
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build:package
pnpm build:storybook
pnpm pack:check
```

修改匯出項目、型別或 CSS 時，檢查產生的套件與 tarball。確認使用端可從 `@lyds/ui` 匯入元件、從 `@lyds/ui/styles.css` 匯入樣式，且 tarball 不會暴露內部原始碼。
