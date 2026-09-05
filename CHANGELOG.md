# 變更記錄

版本號依循 [Semantic Versioning](https://semver.org/lang/zh-TW/)。發佈流程與 dist-tag 規則見 [`docs/publishing.md`](docs/publishing.md)。

## 未發佈

### 破壞性變更

- `styles.css` 不再載入品牌字型。字型移到可選入口 `@linyao.tw/ui/fonts.css`；未匯入時元件改用設計變數內建的系統字型備援。原本依賴自動載入的專案需要新增一行 `import "@linyao.tw/ui/fonts.css";`，或自行代管字型並覆寫 `--font-family-*`。
- `PasswordField` 不再預設 `autoComplete="current-password"`。登入表單請明確傳入 `autoComplete="current-password"`，註冊或修改密碼表單傳入 `"new-password"`。
- `AlertDialog.Popup` 不再自動加入角落關閉控制項。警示對話框應由內容提供明確的確認與取消操作；需要關閉鈕時傳入 `closeButton`。明確傳入 `hasCustomClose={false}` 的呼叫端行為不變。
- 移除從未被任何元件使用的設計變數：`--font-size-100` 至 `--font-size-900`（與具名字級刻度重複）、`--control-border`／`--control-border-hover`／`--control-border-disabled`（與 `--border-control-*` 重複，後者已補上 `--border-control-disabled`）、`--control-thumb`／`--control-thumb-checked`／`--control-track-checked`／`--control-track-checked-hover`／`--control-range-indicator`（Switch 與 Slider 實際使用 `--control-knob` 與 `--control-selected`）、`--shape-cut-sm`／`--shape-cut-md`、`--elevation-inset`／`--elevation-panel-seam`、`--shadow-hairline`、`--focus-ring-offset`（與 `--focus-halo` 重複）。自訂主題若覆寫過這些名稱，請改用括號中的對應角色。
- `--control-height-sm`／`-md`／`-lg` 重新定義為 `3rem`／`3.5rem`／`4rem`，對應所有具 `size` 屬性的元件；原本的 `2.5rem`／`3rem`／`3.5rem` 改名為 `--control-height-compact-*`。元件呈現不變。

### 修正

- Button 的載入指示器改用 `currentColor`。原本使用 `--icon-on-accent`（近黑），在淺色 `neutral` 以及深色的 `secondary`／`neutral`／`quiet`／`danger` 上與按鈕底色對比低於 2:1，實際上看不見。
- `FileUpload` 與 `DropZone` 的檔案輸入元件恢復可聚焦。原本 `tabIndex={-1}` 讓 `aria-describedby`、`aria-invalid` 與 `required` 掛在鍵盤永遠到不了的元素上，說明與錯誤訊息不會被輔助科技讀出，`required` 也會讓瀏覽器無法回報驗證結果。可見的觸發元件改為綁定該輸入的 `<label>`。
- `FileUpload` 與 `DropZone` 的 `aria-describedby` 不再指向未渲染的錯誤元素。懸空的 ID 會讓輔助科技整串忽略，連說明文字一起遺失。
- `CheckboxItem` 與 `RadioItem` 的 `description` 不再併入可及名稱，改以 `aria-describedby` 關聯。
- 元件專用變數（`--component-*`）改為在每個主題範圍內重新計算。原本定義在基礎 `:root`，在 `[data-lyds-theme="dark"]` 子樹中會沿用亮色值，例如日曆範圍內日期會在深色背景上使用亮色文字。
- 日期欄位的高度刻度與文字欄位一致。原本 `md` 是 `3rem` 而 `TextField` 是 `3.5rem`，同一份表單內高度不齊。
- Dialog、Drawer 與 Bottom Sheet 的內建關閉鈕移到 DOM 最前。原本在 `children` 之後，但視覺上位於右上角，鍵盤使用者必須走完整個面板才能到達。
- 日曆選取日的焦點環改用 `--focus-ring-on-accent`。原本在強調色底上使用 `--focus-ring`，對比僅 1.6:1。
- Backdrop 移至 `--z-overlay`，不再與自己的 popup 同層。
- `Select` 的 `items` 加上 memo，`Slider` 的 thumb ref 改為穩定的 callback，`CommandPalette` 以 context 共用輸入元件的 ref，不再用 CSS class 字串尋找焦點目標。
- `.d.ts` 中指向目錄的 barrel 匯入會補上 `/index.js`。原本一律補 `.js`，產生無法解析的路徑。

### 新增

- `MessagesProvider`、`useMessages`、`zhTWMessages`、`enUSMessages` 與 `ComponentMessages`：元件預設字串集中管理，可整份替換或逐項覆寫。未使用 provider 時維持繁體中文，行為不變。
- `@linyao.tw/ui/fonts.css`：可選的品牌字型入口。
- `Dialog.Popup`、`Drawer.Popup`、`BottomSheet.Popup` 與 `AlertDialog.Popup` 新增 `closeButton`；`hasCustomClose` 標記為 deprecated，仍可使用。
- 設計變數新增 `--space-05`、`--radius-2xs`、`--border-control-disabled`、`--control-height-compact-*`，以及 `--component-field-*`、`--component-toast-signal-offset`、`--component-calendar-day-*` 等元件角色。

### 內部

- 六份重複的 className 工具收斂為 `src/internal`。
- 跨目錄匯入改用 `@/` 別名，並由 ESLint 強制。
- `pnpm lint:css` 新增長度 token 化檢查，涵蓋範圍擴大到 `apps/storybook/src`。
- Story 測試改為淺色與深色各跑一次，無障礙檢查同時涵蓋兩種主題。
- 文件基準樣式移入 `@layer lyds.base`，使用端未分層的樣式一律勝過它。
