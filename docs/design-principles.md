# Design Principles

LYDS 不是 Modulor 的重製，也不是把 Base UI 塗成橘色。它借用成熟 design system 的組織方法，再建立自己的 retro-industrial visual language 與可驗證的 application usability。

## Evidence from Modulor

研究來源是公開 Figma 檔案「❖ Modulor・Components (Community)」。`1277:150465` 是頂層 **Start Here** canvas，不是單一元件，因此研究先從 hierarchy 尋找 Glossary 與個別 component pages，再檢查可取得的 component set、variants 與 variables。

本次可直接驗證的 public subset：

| Node          | 可驗證內容            | LYDS 採用的觀察                                                            |
| ------------- | --------------------- | -------------------------------------------------------------------------- |
| `1277:150465` | Start Here            | 以 component library 導覽層理解系統，而非把一張 canvas 當成元件 screenshot |
| `26014:40556` | Glossary              | 元件分類、命名與 composition vocabulary                                    |
| `1233:146652` | Metadata              | library 層級與描述資訊                                                     |
| `9457:23398`  | Control page          | control family 被視為同一個 state model                                    |
| `204:69822`   | Control set           | `Type = Checkbox / Radio / Switch` × state × disabled 的 variant matrix    |
| `234:61252`   | Segmented control set | 2–6 options、Medium/Small 的結構化 variants                                |
| `224:61156`   | Atomic segment        | `Active × Icon`，由小 primitive 組合完整 control                           |
| `9457:26266`  | Bottom Sheet page     | sheet anatomy 與不同 layout contexts                                       |
| `2589:10397`  | Mobile Bottom Sheet   | mobile surface、handle、content 與 viewport 關係                           |
| `2589:10009`  | Docked actions        | action area 作為穩定 anatomy，而不是任意排版                               |
| `9457:28825`  | Bottom Sheet examples | anatomy 在實際內容中的組合方式                                             |
| `16469:37880` | Button instance       | instance-level button usage；hidden master 無法存取                        |
| `9457:29048`  | ListCell instance     | list composition usage；hidden master 無法存取                             |

公開檔案中可驗證的 token vocabulary 包含：

- `Background/Main`、`Background/Secondary`、`Background/Modalview`
- `Text/Title`、`Text/Subtitle`、`Text/Body`、`Text/Regular`、`Text/Link`、`Text/Primary_Control`、`Text/Always_White`
- `Icon/Main`、`Icon/Chevron`、`Icon/Inversion`、`Icon/Always_Dark`
- `Divider/Main`
- `Control/Primary`、`Control/Secondary`、`Control/Quaternary`、`Control/Inactive_Switcher`、`Control/Switcher_Active`、`Control/Switcher_Knob` 與 disabled variants
- `Radius/md`、Shadow／Toasts 相關 variables

這份公開存取沒有提供可驗證的完整 component master hierarchy；Button 與 ListCell 只能讀到 instances，且不是 Glossary 內每個概念都能取得完整 design context。Modulor library 也沒有附上可驗證的 Dark theme，motion context nodes 為空。因此：

- LYDS 對 Modulor 的聲明限於上述 evidence。
- LYDS 的 Dark theme 與 motion system 是本專案自行設計、實作與驗證的內容。
- LYDS 不宣稱像素級複製、完整 token 對應或涵蓋隱藏 masters。

## What LYDS learned

### 1. Families before one-off components

Checkbox、Radio、Switch 共享 selection language，但保留各自正確 semantics。SegmentedControl 由 atomic items 與 group behavior 組成。Overlay 由 Root、Trigger、Portal、Backdrop、Viewport、Popup、Title、Description、Close 等 anatomy parts 組成。

這讓 state coverage 與命名可推理，也讓 consumer 能組合複雜介面，不必 fork 一個「差一點」的 monolith。

### 2. State is a matrix, not a gallery

每個 interactive primitive 必須按適用性檢查 default、hover、pressed、focus-visible、selected/checked、open、disabled、read-only、loading 與 invalid。Storybook 的 variants 不只展示外觀；tests 必須觸發實際 keyboard/focus/open behavior。

### 3. Semantic variables form the contract

Component CSS 說的是 `Text/Main`、`Control/Primary_Hover`、`Divider/Main`，不說 Limestone 600 或 #FE3300。這使同一 anatomy 能在 Light、Dark 與 consumer theme 中維持角色，而不是被 physical swatch 綁死。

Modulor 原 vocabulary 中有 legacy 大小寫與 underscore 不一致；LYDS 保留 category/role/state 思想，但統一為 deterministic kebab-case CSS serialization。

### 4. Composition carries identity

Retro-industrial identity不是依賴背景圖、發光特效或大量 decoration，而是來自重複且受控的系統細節：

- inset/elevated surface hierarchy；
- panel seams 與 1px technical hairlines；
- asymmetric but disciplined geometry；
- clipped/segmented motifs；
- tabular numeric readouts 與 technical labels；
- Vermilion 作為有限的 action/signal；
- control knob、track、handle 與 pressed offset 的 tactile feedback。

這些 motif 應服務 hierarchy 與 affordance。若 ornament 會減少文字對比、遮住 focus、縮小 hit target 或讓內容難掃讀，就必須移除。

## LYDS visual principles

### Warm material, not beige decoration

Light theme 以 Limestone 為 dominant material，利用相近的 warm neutrals 區分 main、secondary、elevated、inset 與 sunken surfaces。Charcoal 提供結構與文字。介面不依賴 pure white cards 或 generic gray borders 才能形成層次。

Dark theme 不是 invert。Near-black surfaces 保留約 75° hue 的微暖色偏，elevation 由 surface value、seams 與克制陰影共同建立；Vermilion 繼續是 signal，不變成霓虹 glow。

### Signal color is scarce

Vermilion 用於 primary action、selected/checked state、必要 indicator 與少量 emphasis。若每一條線、icon、heading 都使用 accent，訊號就失去意義。Danger 使用自己的 semantic status tokens；不因品牌色是紅橘就把 primary action 和 destructive action 混為一談。

### Typography conveys function

- `GenKiGothicTW` 是一般 UI sans-serif。
- `GenKiMinTW` 可用於少量 editorial/expressive headings，不作為密集 controls 的預設。
- `Geist Mono` 用於 serial、date/time、counter、timer、numeric input 與 technical annotations。

變化優先來自 weight、scale、tracking、case、OpenType features 與 tabular numerals，而不是加入大量字體。大技術數字應有資訊角色，不能只當裝飾造成 reading order 噪音。

### Tactile, not toy-like

Pressed offset、inset surface、knob、rail 與短促 motion 建立 physical-control affordance。不要使用過度立體、塑膠玩具式 shadow，或用 skeuomorphism 犧牲 predictable web behavior。

### Experimental, but operational

LYDS 可使用 asymmetry、segment cuts 與 technical labels，但正常 SaaS workflow 仍必須：

- 快速掃讀；
- 支援長文字與 locale expansion；
- 在 mobile hit targets 上可操作；
- 清楚顯示 validation 與 disabled/read-only 差異；
- keyboard-only 完整使用；
- reduced motion 下不失去 state change。

## Accessibility as visual direction

WCAG 2.2 AA 不是最後才執行的 audit。它直接影響 semantic token assignment、control target、focus halo、popup anatomy、字重與狀態冗餘。

不要只靠顏色區分 selected、invalid 或 status。不要移除 outline 後只留低對比 shadow。不要把 disabled opacity 套到整個 subtree，使必要 label 無法閱讀。Dark theme 的 focus 必須與 Light theme 同樣明確。

Motion 也屬於 accessibility contract：ordinary transitions 透過 tokens 統一，`prefers-reduced-motion: reduce` 時將非必要 duration/distance 大幅降低。大型 dialogs/pages 不使用 overshoot，`steps()` 不用於 primary navigation 或閱讀必要內容。
