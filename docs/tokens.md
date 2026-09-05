# 設計變數

設計變數是 Linyao Design System 在 Figma、CSS、主題與元件之間的語意契約。基礎變數描述色盤與量尺；元件 CSS 只使用角色／狀態語意變數。

## 命名與轉換

Figma variables 使用 `Category/Role_State`。CSS 變數依下列規則轉換：

1. `/` 轉為 `-`；
2. `_` 轉為 `-`；
3. 英文字母轉為小寫；
4. 合併連續分隔符號；
5. 加上 `--`。

```text
Text/Always_White        -> --text-always-white
Background/Main          -> --background-main
Control/Primary_Hover    -> --control-primary-hover
Motion/Ease/InOut        -> --motion-ease-in-out
```

新的設計變數不得使用手動例外映射。

## 變數層級

### 色盤

品牌色：

| 變數                  | Hex       | OKLCH                        | 用途               |
| --------------------- | --------- | ---------------------------- | ------------------ |
| `--palette-limestone` | `#D3CCC1` | `oklch(0.8478 0.0169 79.34)` | 暖色材質基礎       |
| `--palette-charcoal`  | `#4D4D4D` | `oklch(0.4202 0 0)`          | 結構與文字基礎     |
| `--palette-vermilion` | `#FE3300` | `oklch(65% 0.245 31.5)`      | 主要操作與選取狀態 |

另提供暖色中性色階與狀態色階。資訊、成功、警告使用低彩度藍色、綠色、琥珀色色階，負責狀態辨識與對比，不取代 Vermilion 的主要操作角色。

色盤變數只供主題設定使用。元件不得直接使用 `--palette-warm-700` 或 `--palette-vermilion`。

### 語意色彩

- `Background/*`：`Main`、`Secondary`、`Elevated`、`Inset`、`Sunken`、`Modal`、`Accent`、`Selected`、`Disabled`、`Backdrop`。
- `Text/*`：`Title`、`Main`、`Secondary`、`Muted`、`Disabled`、`Accent`、`Link`、`On_Accent`、`On_Danger`、`Always_White`、`Always_Dark`。
- `Icon/*`：一般、次要、強調、停用、on-accent 與固定角色。
- `Divider/*`、`Border/*`：subtle／main／strong、控制項狀態與無效狀態。
- `Control/*`：primary／secondary／neutral／quaternary／surface、hover／按下／停用、選取、軌道、knob、預留文字。`neutral` 提供跨主題的高對比灰色操作；`danger` 保留給破壞性操作。控制項邊框一律使用 `Border/*` 角色，沒有平行的 `Control/Border` 系列。
- `Focus/*`、`Selection/*`：焦點環、光暈與選取前景色／背景色。在強調色表面內側繪製的焦點環使用 `--focus-ring-on-accent`。
- `Status/*`：中性、資訊、成功、警告、危險的背景色／前景色／邊框。
- `Shadow/*`、`Elevation/*`：低、中、浮層、選取與浮動控制項陰影。

正確：

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

不允許：

```css
.lyds-button {
	background: #fe3300;
	color: black;
}
```

## 對比

品牌原色不保證彼此符合可存取性：

| 配色                 |   對比 | 一般介面文字 |
| -------------------- | -----: | ------------ |
| 純黑／Vermilion      | 5.69:1 | AA           |
| Limestone／Vermilion | 2.32:1 | 不通過       |
| Charcoal／Vermilion  | 2.29:1 | 不通過       |
| 純白／Vermilion      | 3.69:1 | 不通過       |
| Warm 25／Signal 600  | 4.54:1 | AA           |
| Charcoal／Limestone  | 5.30:1 | AA           |

品牌強調表面使用 `--text-on-accent` 的深色前景；主要控制項使用較深的 `--palette-signal-600` 與暖近白 `--control-on-primary`。這兩種語意不可互換。`Always_White`／`Always_Dark` 只用於跨主題不可改變的語意，不得當作一般文字捷徑。

每次修改語意設定都必須驗證：

- 內文、標題、次要與停用文字；
- 按鈕預設／hover／按下／停用；
- 連結預設／hover；
- 選取／勾選前景色；
- 焦點環與相鄰表面；
- 狀態前景色／背景色／邊框；
- 亮色與深色主題；
- 一般文字 4.5:1，以及大型文字／非文字介面的適用門檻。

使用 opacity 時，必須以實際合成後的背景測量。

## 字體

```css
--font-family-sans: "GenKiGothicTW", system-ui, sans-serif;
--font-family-serif: "GenKiMinTW", ui-serif, serif;
--font-family-mono: "Geist Mono", ui-monospace, monospace;
```

CSS 會載入：

- `https://font.emtech.cc/css/GenKiGothicTW.css`
- `https://font.emtech.cc/css/GenKiMinTW.css`
- Google Fonts 的 Geist Mono variable family

字級、字重、行高與字距均有對應設計變數。日期、時間、計數器、計時器與數值欄位使用：

```css
font-variant-numeric: tabular-nums lining-nums;
```

`.lyds-numeric` 與 `.lyds-technical-label` 是公開工具類別，不得用來改變內容語意。

## 間距、尺寸與形狀

固定長度使用 `rem`：

```css
padding: var(--space-3); /* 0.75rem */
min-height: var(--control-height-md); /* 3.5rem */
border-radius: var(--radius-md); /* 0.75rem */
```

只有 1px 邊框／分隔線與 Figma 明確指定的 0.5px 分隔線可使用 `px`。SVG viewBox 座標不屬於 CSS 長度。流動版面可使用 `%`、`fr`、`vw`、`dvh` 與無單位行高。

控制項高度分成兩組刻度，元件 CSS 不得再寫入原始高度：

| 刻度                          |       值 | 用途                                                         |
| ----------------------------- | -------: | ------------------------------------------------------------ |
| `--control-height-sm`         |   `3rem` | 有 `size` 屬性的元件：Button、IconButton、ListCell、各種欄位 |
| `--control-height-md`         | `3.5rem` | 同上，預設尺寸                                               |
| `--control-height-lg`         |   `4rem` | 同上                                                         |
| `--control-height-compact-sm` | `2.5rem` | 行內與次要控制項：選單項目、工具列按鈕、頭像                 |
| `--control-height-compact-md` |   `3rem` | 同上                                                         |
| `--control-height-compact-lg` | `3.5rem` | 同上                                                         |

主刻度最小值是 `3rem`，高於 `--control-target-min`（`2.75rem`）；`--control-target-min` 仍用於本身沒有高度刻度的圖示命中區。沒有 Figma 結構依據時，不得在元件加入 `clip-path`。

## 動態效果

持續時間：

| Figma 名稱                   | CSS 變數                       |      值 | 用途                    |
| ---------------------------- | ------------------------------ | ------: | ----------------------- |
| `Motion/Duration/Instant`    | `--motion-duration-instant`    |   `0ms` | 無插值的狀態            |
| `Motion/Duration/Fast`       | `--motion-duration-fast`       | `120ms` | hover、按下、小型指示器 |
| `Motion/Duration/Normal`     | `--motion-duration-normal`     | `220ms` | 一般控制項／彈出元件    |
| `Motion/Duration/Slow`       | `--motion-duration-slow`       | `360ms` | 小型表面                |
| `Motion/Duration/Deliberate` | `--motion-duration-deliberate` | `480ms` | 少量非必要展示          |

Easing：

| 名稱       | CSS 變數                   | 值                                  |
| ---------- | -------------------------- | ----------------------------------- |
| Out        | `--motion-ease-out`        | `cubic-bezier(0.16, 1, 0.3, 1)`     |
| InOut      | `--motion-ease-in-out`     | `cubic-bezier(0.65, 0, 0.35, 1)`    |
| In         | `--motion-ease-in`         | `cubic-bezier(0.7, 0, 0.84, 0)`     |
| Snap       | `--motion-ease-snap`       | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Linear     | `--motion-ease-linear`     | `linear`                            |
| Mechanical | `--motion-ease-mechanical` | `steps(4, end)`                     |

`Snap` 只用於 toggle、knob、小型指示器或確認回饋，不用於 Dialog、Drawer 或頁面轉場。`Mechanical` 只用於非必要裝飾，不用於導覽或閱讀。元件 CSS 不得加入未命名的 `ease` 或 cubic-bezier。

在減少動態效果下，非必要持續時間降至 `1ms`、位移歸零、按下縮放回到 `1`，Snap／Mechanical 改為 linear。動畫關閉後仍須能透過形狀、文字、圖示或顏色辨識狀態。

## 元件專用變數

`--component-*` 是設計變數的第三層，用於在不移動全域語意角色的前提下微調單一元件。所有元件專用變數集中定義在 `styles.css` 的元件角色區塊，該區塊同時對 `:root`、`[data-lyds-theme="light"]` 與 `[data-lyds-theme="dark"]` 生效，因此子樹主題會一併重新計算：

```css
:root,
[data-lyds-theme="light"],
[data-lyds-theme="dark"] {
	--component-field-background: var(--control-surface);
	--component-field-border-focus: var(--border-control-focus);
	--component-calendar-day-background-selected: var(--control-primary);
	--component-calendar-day-foreground-selected: var(--control-on-primary);
	--component-calendar-day-indicator-today: currentColor;
}
```

規則：

- 只有共用語意變數無法描述元件，而且需要跨主題覆寫時，才新增元件專用變數。
- 元件專用變數必須引用語意角色或 `currentColor`，不得包含原始色值。
- 元件 CSS 直接讀取元件專用變數，不再使用 `var(--component-x, var(--semantic-y))` 這種行內備援；備援會讓變數看起來存在卻從未被定義。
- 元件專用變數不得定義在基礎 `:root` 區塊，否則會在 `:root` 上算出亮色值並繼承到深色子樹。

## 新增或修改變數

1. 定義要解決的角色／狀態。
2. 檢查現有語意變數是否可使用。
3. 同時設定亮色與深色。
4. 固定長度使用 `rem`；動態效果使用共用持續時間／easing。
5. 更新 Storybook Foundations 與本文件。
6. 檢查所有使用處，避免同義變數。
7. 重新驗證受影響的對比與互動狀態。

刪除或重新定義公開語意變數可能破壞使用者主題，應依 SemVer 評估。
