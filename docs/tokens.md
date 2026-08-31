# Design Tokens

Tokens 是 LYDS 跨 Figma、CSS、themes 與 components 的語意契約。Foundation tokens 可以描述 palette 或量尺；component CSS 則只能依賴 role/state semantic tokens。

## Naming and serialization

Figma variables 採 `Category/Role_State` 形式。CSS serialization 為 deterministic：

1. category boundary `/` 轉為 `-`；
2. underscore `_` 轉為 `-`；
3. 大小寫正規化為 lowercase；
4. 連續 separator 合併；
5. 加上 CSS custom property 的 `--`。

```text
Text/Always_White        -> --text-always-white
Background/Main          -> --background-main
Control/Primary_Hover    -> --control-primary-hover
Motion/Ease/InOut        -> --motion-ease-in-out
```

這個規則修正 research 中可見的 legacy 大小寫／underscore 不一致，但不改變 category/role/state 哲學。新 token 不應依人手例外 mapping。

## Token layers

### Palette

Foundation palette 包含三個品牌原色：

| Token                 | Hex       | OKLCH                        | 角色                        |
| --------------------- | --------- | ---------------------------- | --------------------------- |
| `--palette-limestone` | `#D3CCC1` | `oklch(0.8478 0.0169 79.34)` | warm material foundation    |
| `--palette-charcoal`  | `#4D4D4D` | `oklch(0.4202 0 0)`          | structure / text foundation |
| `--palette-vermilion` | `#FE3300` | `oklch(65% 0.245 31.5)`      | signal / action foundation  |

另有 warm neutral 與 signal ramps，供 theme assignment 使用。Info、success、warning 各自使用低彩度 blue、green、amber ramps；它們是為狀態辨識與對比設計的輔助色相，不取代 Vermilion 的品牌 action 角色。Palette tokens 不是 component contract；component 不應直接取用 `--palette-warm-700` 或 `--palette-vermilion`。

### Semantic colors

主要 categories：

- `Background/*`：`Main`、`Secondary`、`Elevated`、`Inset`、`Sunken`、`Modal`、`Accent`、`Selected`、`Disabled`、`Backdrop`。
- `Text/*`：`Title`、`Main`、`Secondary`、`Muted`、`Disabled`、`Accent`、`Link`、`On_Accent`、`On_Danger`、`Always_White`、`Always_Dark`。
- `Icon/*`：一般、次要、accent、disabled、on-accent 與 always roles。
- `Divider/*` 與 `Border/*`：subtle/main/strong、control states 與 invalid。
- `Control/*`：primary/secondary/quaternary/surface、hover/pressed/disabled、selected、track、thumb、knob、placeholder。
- `Focus/*` 與 `Selection/*`：focus ring、halo/offset 與 selection foreground/background。
- `Status/*`：neutral、info、success、warning、danger 各自的 background/foreground/border。
- `Shadow/*` 與 `Elevation/*`：hairline、low、medium、overlay 與 selected/floating control 的超柔和 shadow。Legacy inset/panel-seam aliases 目前解析為 `none`，只為避免既有 consumer theme 立即破壞；新元件不得依賴它們。

下列寫法是正確的 component rule：

```css
.lyds-button[data-variant="primary"] {
	background: var(--control-primary);
	color: var(--control-on-primary);
	border-color: var(--control-primary);
}

.lyds-button[data-variant="primary"]:hover {
	background: var(--control-primary-hover);
}
```

下列寫法不允許：

```css
.lyds-button {
	background: #fe3300;
	color: black;
}
```

即使 raw value 與目前 theme 恰好相同，component 仍失去 Dark/consumer theme 的 semantic indirection。

## Contrast strategy

三個 brand foundations 並不自動形成可存取配對。依 WCAG relative luminance 計算：

| Pair                   | Contrast | Normal UI text |
| ---------------------- | -------: | -------------- |
| Black on Vermilion     |   5.69:1 | AA             |
| Limestone on Vermilion |   2.32:1 | Fail           |
| Charcoal on Vermilion  |   2.29:1 | Fail           |
| White on Vermilion     |   3.69:1 | Fail           |
| Charcoal on Limestone  |   5.30:1 | AA             |

因此 primary accent surface 使用 `--text-on-accent`／`--control-on-primary`，目前映射至足夠深的 foreground；不把 Limestone、Charcoal 或 white 直接硬塞到 Vermilion 上。`Always_White` / `Always_Dark` 只在跨 theme 不可改變的語意中使用，不能當作一般 text shortcut。

每次更改 semantic assignment 都應重新驗證：

- body、title、secondary、disabled text 對所處 surface；
- button normal/hover/pressed/disabled；
- link normal/hover；
- selected/checked foreground；
- focus ring 與其相鄰 surface；
- status foreground/background/border；
- Light 與 Dark themes；
- normal text 的 4.5:1 與 large text／non-text UI 的適用門檻。

Opacity 疊色必須以實際 composited background 測量，不能只檢查 source color。

## Typography

```css
--font-family-sans: "GenKiGothicTW", system-ui, sans-serif;
--font-family-serif: "GenKiMinTW", ui-serif, serif;
--font-family-mono: "Geist Mono", ui-monospace, monospace;
```

CSS 會載入：

- `https://font.emtech.cc/css/GenKiGothicTW.css`
- `https://font.emtech.cc/css/GenKiMinTW.css`
- Google Fonts 的 Geist Mono variable family

Type scale、weights、line heights 與 letter spacing 各自 tokenized。Dates、times、counters、timers、numeric fields 與 technical readouts 使用：

```css
font-variant-numeric: tabular-nums lining-nums;
```

`.lyds-numeric` 與 `.lyds-technical-label` 是 public utility classes；不要藉它們改變內容 semantics。

## Space, size, shape and hairlines

Fixed lengths 使用 rem：

```css
padding: var(--space-3); /* 0.75rem */
min-height: var(--control-height-md); /* 3rem */
border-radius: var(--radius-md); /* 0.75rem */
```

只有真正 pixel-precise 的 1px border/divider，以及 Figma 明確指定的 0.5px ornamental divider 可使用 `px`。SVG viewBox coordinates 不屬於 CSS lengths。Fluid layout 可使用 `%`、`fr`、`vw`、`dvh` 與 unitless line-height；規則不是把所有 layout 機械轉成 rem。

Control size tokens 與 `--control-target-min` 讓視覺尺寸和 minimum interaction target 分開。`--shape-cut-*` 是相容性 alias，預設為 `0`；Modulor 對應 anatomy 沒有切角時，不得在 component 自行加入 clip-path。

## Motion

Duration vocabulary：

| Figma-style name             | CSS token                      |   Value | 用途                          |
| ---------------------------- | ------------------------------ | ------: | ----------------------------- |
| `Motion/Duration/Instant`    | `--motion-duration-instant`    |   `0ms` | 無 interpolation 的狀態       |
| `Motion/Duration/Fast`       | `--motion-duration-fast`       | `120ms` | hover、press、tiny indicator  |
| `Motion/Duration/Normal`     | `--motion-duration-normal`     | `220ms` | 一般 control/popup transition |
| `Motion/Duration/Slow`       | `--motion-duration-slow`       | `360ms` | 小型 surface transition       |
| `Motion/Duration/Deliberate` | `--motion-duration-deliberate` | `480ms` | 少量非必要展示                |

Easing vocabulary：

| Name       | CSS token                  | Value                               |
| ---------- | -------------------------- | ----------------------------------- |
| Out        | `--motion-ease-out`        | `cubic-bezier(0.16, 1, 0.3, 1)`     |
| InOut      | `--motion-ease-in-out`     | `cubic-bezier(0.65, 0, 0.35, 1)`    |
| In         | `--motion-ease-in`         | `cubic-bezier(0.7, 0, 0.84, 0)`     |
| Snap       | `--motion-ease-snap`       | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Linear     | `--motion-ease-linear`     | `linear`                            |
| Mechanical | `--motion-ease-mechanical` | `steps(4, end)`                     |

`Snap` 只用於 toggle、knob、小 indicator 或 tiny confirmation，不用在 Dialog、Drawer 或 page transitions。`Mechanical` 僅供 scan/indicator 等 decoration，不用於 primary navigation、閱讀或任何必要 motion。Component CSS 不得加入未命名的 `ease` 或 random cubic-bezier。

Reduced motion 下，nonessential durations 會縮至 `1ms`、distance 歸零、press scale 回到 `1`，Snap/Mechanical 改用 linear。State change 必須仍可由 shape、text、icon 或 color 看見，不能因動畫關閉而消失。

## Component-specific tokens

只有當 shared semantic vocabulary 無法合理描述 anatomy，且 component 需要跨 theme/consumer override 時才新增 component token。例如 Calendar 的 selected day、in-range 與 today ring 可以映射至 shared roles：

```css
--component-calendar-day-background-selected: var(--control-primary);
--component-calendar-day-foreground-selected: var(--text-on-accent);
--component-calendar-day-background-in-range: var(--background-selected);
--component-calendar-day-ring-today: var(--focus-ring);
```

Component token 應組合 semantic tokens，而不是成為藏 raw values 的後門。

## Adding or changing a token

1. 描述它解決的 role/state，而非想要的顏色名稱。
2. 搜尋現有 semantic token 是否已能表達。
3. 在 Light 與 Dark 同時提供 assignment。
4. 若是 fixed length，使用 rem；若是 motion，使用共享 duration/ease。
5. 更新 Storybook Foundations 頁與本文件。
6. 檢查所有 consumers，避免同義 tokens。
7. 對受影響 foreground/background/state pairs 重跑 contrast 與 interaction review。

刪除或重新定義 public semantic token 是可能破壞 consumer themes 的變更，應依 SemVer 評估。
