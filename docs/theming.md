# Theming

LYDS themes 是 semantic token assignment，不是兩份 component CSS。Component anatomy 與 states 保持一致；Light、Dark 或 consumer theme 只重新指定 role-based variables。

## Load the stylesheet

在 application entry 匯入一次：

```tsx
import "@lyds/ui/styles.css";
```

不要從 `@lyds/ui/dist/**`、`src/**` 或內部 CSS path 匯入。只有 package `exports` 中的 `@lyds/ui/styles.css` 是 public contract。

## Select a theme

Light 是 `:root` 預設，也可明確指定：

```html
<html data-lyds-theme="light"></html>
```

Dark：

```html
<html data-lyds-theme="dark"></html>
```

Theme 可以套在 subtree，方便 preview 或逐步 migration；但 document root 是一般 application 的首選，因為 overlay 元件預設會 portal 到 `body`：

```tsx
<main data-lyds-theme="light">
	<Preview />
	<aside data-lyds-theme="dark">
		<DarkPreview />
	</aside>
</main>
```

`Select`、`Combobox`、`Menu`、`Tooltip`、`Dialog`、`DatePicker` 等 portalled overlay 會依 portal destination 的 ancestor 取得 tokens，而不是依 trigger 的 ancestor。若只對 subtree 套 theme，必須把 portal container 放在同一個 theme scope，或同步將相同的 `data-lyds-theme` 設在 portal destination；否則 popup 可能使用 document root theme。

每個 scope 同時設定適合的 `color-scheme`，讓 browser-native controls 和 LYDS surface 方向一致。

## Theme state belongs to the application

LYDS 不讀 system preference、不寫 localStorage，也不建立全域 React context。Consumer 可依產品需求組合：

```tsx
type LydsTheme = "light" | "dark";

export function AppTheme({ theme, children }: React.PropsWithChildren<{ theme: LydsTheme }>) {
	document.documentElement.dataset.lydsTheme = theme;
	return children;
}
```

需要 follow-system 時，由 application 使用 `matchMedia("(prefers-color-scheme: dark)")`；需要 persistence 時，由 application 選擇 cookie、server profile 或 localStorage。這些 policy 不屬於 design system。

### Avoiding first-paint mismatch

SSR 應讓 server markup 與 client 初次 render 使用相同 theme。若 theme 只能在 browser 決定，可在 application 自己的 pre-hydration bootstrap 設定 `document.documentElement.dataset.lydsTheme`。這段 bootstrap 不由 LYDS 注入，因為 storage、CSP、nonce 與 system preference 都是 product policy。

## Light strategy

Light theme 的 surface hierarchy：

```text
Limestone foundation
├─ Background/Main       near-white warm canvas
├─ Background/Secondary  list and adjacent surface
├─ Background/Elevated   white floating surface
├─ Background/Inset      quiet grouped control surface
└─ Background/Sunken     lower-value supporting surface

Charcoal foundation
├─ Text/Title and Text/Main
├─ icons
└─ low-contrast structural dividers

Vermilion foundation
├─ primary action
├─ selected / checked signal
└─ limited status emphasis
```

Surface depth優先使用 value、selected plate 與結構性 divider；shadow 只用於真正 floating 的 control 或 overlay。Vermilion foreground 使用 `OnAccent` semantic value，不直接使用 Limestone/Charcoal/white。

## Dark strategy

Dark theme 是同一套 physical system 在低光下的表現：

- `Background/Main` 約為 `oklch(0.18 0.008 75)` 的 warm near-black。
- `Background/Secondary` 與 `Background/Elevated` 逐層提高 lightness。
- `Background/Inset` / `Sunken` 調整 lightness，保留 grouped surface 階層而不是 generic black box。
- `Text/Main` 回到 Limestone/warm neutral family。
- Vermilion 維持 signal/action 角色，不加 neon glow。
- Hairlines 與 shadows 依 dark compositing 重新指定，不反轉 Light values。

Dark palette、semantic assignments 與 motion 是 LYDS 自主設計，並非從 Modulor 公開 Figma library 取得。

## Consumer customization

### Scope semantic tokens

使用自己的 class 或 data attribute 覆寫 semantic roles：

```css
.operations-theme {
	--background-main: oklch(88% 0.018 82);
	--background-secondary: oklch(92% 0.014 82);
	--text-main: oklch(35% 0.01 82);
	--control-primary: oklch(67% 0.22 32);
	--control-primary-hover: oklch(72% 0.2 32);
	--control-primary-pressed: oklch(61% 0.23 32);
	--control-on-primary: oklch(10% 0.01 32);
	--focus-ring: oklch(48% 0.17 32);
}
```

```tsx
<section className="operations-theme" data-lyds-theme="light">
	<AccountSettings />
</section>
```

完整 custom theme 至少要覆蓋 semantic roles，而不是只改 `--palette-vermilion`。Palette token 與 semantic assignment 是兩層；component 並不直接使用 palette。

### Prefer roles over anatomy selectors

推薦：

```css
.billing-surface {
	--control-primary: var(--billing-action);
}
```

不推薦：

```css
.billing-surface .lyds-button[data-variant="primary"] {
	background: #e04010;
}
```

直接覆寫 `.lyds-*` anatomy 會繞過 hover/pressed/disabled、Dark 與 future internal changes。若一個 semantic role 無法完成合理的 product customization，先提議新增或調整 token，而不是 fork component CSS。

### Local layout customization

`className` 與 `style` 用於 consumer-owned placement、width、grid/flex relationship：

```tsx
<DatePicker className="checkout-delivery-date" label="Delivery date" />
```

```css
.checkout-delivery-date {
	inline-size: min(100%, 24rem);
}
```

不要用 `style` 寫入 raw component colors。若必須從 React 動態傳 token，可傳 CSS custom property 並使用可審計的型別 wrapper。

## Theme verification checklist

每一個 theme 必須在同一批 realistic compositions 中檢查：

- body、title、secondary、disabled 與 link text；
- primary、secondary、quiet、danger actions；
- input default/hover/focus/invalid/read-only/disabled；
- selected/checked controls；
- popup、dialog、drawer、bottom sheet、backdrop；
- toast/status surfaces；
- date selected/range/today/unavailable states；
- visible focus、keyboard order 與 return focus；
- long Traditional Chinese/English mixed text；
- 200% zoom 與 narrow viewport；
- `prefers-reduced-motion: reduce`；
- print colors where print output is in product scope。

Theme change 不應造成 layout shift；semantic values 改變時 control geometry、hit target 與 text wrapping 應保持一致。

## Contrast ownership

LYDS 內建 themes 以 WCAG 2.2 AA 為目標。Consumer 覆寫 theme 後，即承接自訂 pair 的 contrast verification。至少測量：

- foreground 對最終 composited background；
- focus indicator 對 control 與 adjacent surface；
- non-text control boundaries；
- hover/pressed/selected，不只 default；
- disabled 狀態的可理解性（disabled text 不一定受一般 contrast criterion 約束，但仍應可讀）。

Brand foundations 不是 accessibility guarantee。特別是 Limestone、Charcoal、white 對 Vermilion 都不適合一般尺寸文字；請使用 `--text-on-accent` / `--control-on-primary`。
