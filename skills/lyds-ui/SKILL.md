---
name: lyds-ui
description: 使用、擴充、檢查或規劃發布 @lyds/ui，並維持 Linyao Design System 的元件 API、語意設計變數、日期時間語意、無障礙與發布安全規則。
---

# Linyao Design System

Linyao Design System 是麟曜數位工作室的設計系統。所有對外顯示名稱只能使用 `Linyao Design System`，不得縮寫。小寫 `lyds` 只保留於 `@lyds/ui`、`data-lyds-theme`、Skill 識別與其他技術 API。

透過公開套件 API 使用元件。開始實作前，先檢查已安裝版本的匯出項目與型別，不要假設所有元件都支援相同 props。

## 依工作讀取參考文件

- 安裝、圖示、樣式、主題、元件選擇、設計變數或日期時間：讀取 [references/usage.md](references/usage.md)。
- 新增或修改元件、Storybook、測試：讀取 [references/contributing.md](references/contributing.md)。
- 套件驗證、快照或正式發布：讀取 [references/releases.md](references/releases.md)。

## 必須遵守的規則

- 優先使用既有元件或組合方式；只從 `@lyds/ui` 與文件列出的公開路徑匯入。
- 在應用程式入口匯入一次 `@lyds/ui/styles.css`。以 `data-lyds-theme="light"` 或 `data-lyds-theme="dark"` 設定主題；偏好儲存與同步由應用程式負責。
- 元件顏色一律使用語意 CSS 變數，例如 `--background-elevated`、`--text-main`、`--control-primary`、`--focus-ring`；不得使用未轉為設計變數的顏色。
- 介面圖示只使用 `@phosphor-icons/react`。使用 `@lyds/ui` 時一併安裝；瀏覽器端使用單一 CSR 匯出檔案，React Server Component 使用公開 `/ssr` 模組。不得手寫 JSX `<svg>`、以 Unicode 或 CSS 圖形代替圖示，或使用舊版 `phosphor-react`。
- `Button` 的裝飾圖示放在 `startIcon` 或 `endIcon`；僅有圖示的操作使用 `IconButton`，並提供 `aria-label` 或 `aria-labelledby`。圖示應繼承 `currentColor` 與元件尺寸。
- 視覺應依 Figma 與現有元件的結構、尺寸、圓角、間距、字級及狀態延伸。不要加入切角、面板接縫、裝飾格線、虛構編號、全面大寫或終端機樣式。
- 固定長度使用設計變數或 `rem`。`1px` 與 Figma 已確認的 `0.5px` 只用於真正的細線；SVG 座標不受此限。
- 保留既有受控／非受控 API，例如 `value`、`defaultValue`、`onValueChange`、`open`、`defaultOpen`、`onOpenChange`、`variant` 與 `size`。不得加入路由、儲存、分析、網路請求、商業驗證或表單框架假設。
- 維持可存取名稱、可見焦點、鍵盤操作、浮層焦點管理、觸控尺寸、對比與減少動態效果設定。不得以樣式取代 Linyao Design System 或 Base UI 提供的互動行為。

未取得使用者明確同意前，絕對不得發布 `@lyds/ui`。發布還必須符合 [references/releases.md](references/releases.md) 的開關與驗證規則。
