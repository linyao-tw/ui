# Design Principles

LYDS 的元件 anatomy、尺寸節奏、variant 組織與互動層級直接依循 Modulor Figma 中可驗證的設計。LYDS 不另加「未來工業」裝飾；與 reference 的主要差異是品牌色盤、字體與為 Web/WCAG 補上的狀態。Figma 沒有對應元件時，才使用相同的表面、圓角、字級、間距與狀態語言延伸。

## Evidence from Modulor

研究來源是公開 Figma 檔案「❖ Modulor・Components (Community)」。`1277:150465` 是 **Start Here** canvas，不是單一元件；實作前先由 hierarchy 定位 Glossary、可見 specimens、component sets、variants 與 variables，再以 individual design context 驗證，screenshot 只用於交叉檢查。

| 範圍                      | Figma nodes                             | 已套用的可驗證規格                                                                  |
| ------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------- |
| Glossary / structure      | `26014:40556`, `1277:150465`            | component families、composition vocabulary、公開頁面邊界                            |
| Button regular            | `16469:37879`–`16469:37882`             | 高 `3.5rem`、radius `0.75rem`、16/20 semibold、無 border/shadow                     |
| Checkbox / Radio / Switch | `204:69822`                             | 12-state matrix；24px controls；52×30px switch 與 28px knob                         |
| Segmented control         | `234:61252`, `224:61156`                | 2–6 options、medium/small、共同 surface 與 selected inner plate                     |
| Tabs                      | `9457:23922`, `1009:124555`             | 2rem content-width pills、0.25rem gap、active quaternary surface、無 rail/underline |
| Text fields               | `132:59432`, `709:93524`, `740:98259`   | 56px field、12px radius、1px outline、floating-label 與 error anatomy               |
| Code / Phone fields       | `9297:23908`, `10703:28303`             | 56px segmented fields、8px gap、phone country segment width                         |
| List / Section heading    | `9457:29047`–`9457:29056`               | 56px row、inset 0.5px divider；32px uppercase section caption                       |
| Bottom Sheet anatomy      | `9457:26270`, `2589:10397`–`2589:10405` | surface、handle、navigation、docked action、divider 與 mobile safe-area composition |

可驗證的 Modulor vocabulary 包含 `Background/Main`、`Background/Secondary`、`Text/Title`、`Text/Body`、`Icon/Main`、`Divider/Main`、`Control/Primary`、`Control/Secondary`、`Control/Quaternary`、switch state roles 與 `Radius/md`。LYDS 依 category/role/state 哲學建立 deterministic CSS variables，元件不直接使用 physical swatches。

Figma MCP 無法直接讀取未放在可見 canvas 的 hidden masters。特別是 Button low 沒有可驗證 specimen；LYDS 不會把任意縮小的 Button regular 宣稱為其 1:1 複刻。Dark theme、Web hover/focus states 與 Figma 未提供的 component families，依已驗證語言延伸並另外做 accessibility/browser 驗證。

## What LYDS follows

### 1. Families before one-off components

Checkbox、Radio、Switch 共享 selection vocabulary；SegmentedControl 由 equal-width items 組成；Tabs 則維持 content-width pills，兩者不可混成同一種 rail。Overlay 以 Root、Trigger、Portal、Backdrop、Popup、Title、Description 與 Close 等 anatomy parts 組合。

### 2. State is a matrix, not a gallery

每個 interactive primitive 按適用性檢查 default、hover、pressed、focus-visible、selected/checked、open、disabled、read-only、loading 與 invalid。Storybook variants 必須呈現實際狀態，tests 觸發 keyboard、focus、open/close 與 controlled/uncontrolled behavior。

### 3. Semantic variables form the contract

Component CSS 使用 `--text-main`、`--control-primary-hover`、`--divider-main`，不使用 `--orange` 或 component-local hex。這使同一 anatomy 能在 Light、Dark 與 consumer theme 中維持角色。

### 4. Surface hierarchy carries identity

Modulor 的質感來自少量、重複且可預測的手段：

- main、secondary、elevated 與 quaternary surfaces；
- 只在結構需要時出現的低對比 hairline divider；
- `0.75rem` 為核心的柔和 radius；
- selected plate、switch knob 與少量超柔和 shadow；
- 規律的 32/40/56px control heights；
- 清楚的 title/body/caption 層級。

LYDS 不再使用裝飾性切角、偽 serial labels、背景工程網格、面板刻紋、內凹接縫或全庫 uppercase 來製造風格。若一個細節在 Figma anatomy 或互動 affordance 中沒有角色，就不應加入元件。

## LYDS visual principles

### Reference geometry, LYDS palette

Light theme 使用接近 Modulor `Background/Main` 的暖白作為主畫布，Limestone 衍生色建立 secondary/quaternary surfaces；Charcoal 衍生色負責文字與 icon；Vermilion 取代 Modulor blue，作為 primary、selected 與 checked signal。Limestone 是色盤基礎，不代表整頁必須是深米色。

Dark theme 保留相同 anatomy 與 spacing，以 warm near-black、逐層變亮的 surfaces 和 Limestone text 重建層級，不做簡單反相。Vermilion 仍是 signal，不加入 neon glow。

### Signal color is scarce

Vermilion 用於 primary action、selected/checked state、必要 indicator 與少量 emphasis。Danger 有自己的 semantic pair，不因品牌色是紅橘就把 destructive action 和 primary action混為一談。Vermilion 上的一般尺寸文字使用經對比驗證的深色 `OnAccent`，不照搬 Figma 的白色而犧牲 WCAG 2.2 AA。

### Typography conveys hierarchy

- `GenKiGothicTW` 是一般 UI sans-serif。
- `GenKiMinTW` 只用於 consumer-owned editorial content，不改變 controls anatomy。
- `Geist Mono` 只用於真正的 code、date/time、counter、timer 與 numeric value。
- SectionHeading 的 uppercase 是 reference 中明確存在的 12/16 caption；其他元件不泛用 uppercase。
- Dates、times 與 numeric fields 使用 tabular numerals。

### Tactile through state, not ornament

觸感來自 hover/pressed surface、selected plate、knob position、短促 motion 與 focus feedback。元件不靠厚邊框、硬陰影、位移刻線或 skeuomorphic panel details 表達可操作性。

### Operational in real products

任何 reference 延伸都必須：

- 支援長文字與 locale expansion；
- 在 narrow viewport 不溢出；
- 維持至少 44px interaction target，或提供等效 hit area；
- 清楚區分 validation、disabled 與 read-only；
- keyboard-only 完整使用；
- reduced motion 下不失去 state change。

## Accessibility is part of the visual mapping

LYDS 以 WCAG 2.2 AA 為目標。Figma reference 的尺寸與 anatomy 是主要視覺依據，但若原始 physical swatch pairing 對 Web normal text 不足，LYDS 會保留角色並替換成可存取的 semantic foreground，例如 Vermilion 上使用深色 `OnAccent`。

Focus-visible 不能被低對比 shadow 取代；selected、invalid 與 status 不能只靠顏色；disabled 不應把整個 subtree 降到不可讀。Ordinary transitions 使用 motion tokens，`prefers-reduced-motion: reduce` 時移除非必要 distance 與 duration。
