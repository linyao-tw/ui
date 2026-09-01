# @lyds/ui

LYDS 是一套 React component design system，以 Base UI 為主要 behavior primitive，並以 warm retro-industrial technology 為視覺方向。套件提供 React components、TypeScript declarations、semantic tokens、Light/Dark themes 與完整 component CSS。

> Pre-release status：此 repository 已準備 package，但本次工作不會發佈到 npm。取得 owner 明確批准前，不要假設 registry package 可用。

## Install

公開發佈啟用後：

```sh
pnpm add @lyds/ui @phosphor-icons/react
```

在 application entry 匯入一次 CSS：

```tsx
import "@lyds/ui/styles.css";
```

## Use

```tsx
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { Button, TextField } from "@lyds/ui";

export function ProfileForm() {
	return (
		<form>
			<TextField label="Display name" name="displayName" required />
			<Button type="submit" startIcon={<FloppyDiskIcon weight="bold" />}>
				Save
			</Button>
		</form>
	);
}
```

Switch theme with a semantic scope:

```html
<html data-lyds-theme="dark"></html>
```

Customize semantic roles, not component raw colors：

```css
.product-theme {
	--control-primary: oklch(67% 0.22 32);
	--control-primary-hover: oklch(72% 0.2 32);
	--control-on-primary: oklch(10% 0.01 32);
	--focus-ring: oklch(48% 0.17 32);
}
```

## Design boundaries

- LYDS components 不進行 API calls、routing、analytics、storage 或 business validation。
- DataTable 不內建 sorting、filtering 或 data fetching。
- FileUpload/DropZone 不內建 upload transport 或 security validation。
- Date & Time 使用 structured values；不把 locale、timezone 或格式寫死。
- 一般互動使用 Base UI；Date & Time 是 React Aria Components + `@internationalized/date` 的限定例外，視覺仍完全由 LYDS tokens/CSS 控制。

## Public contract

只依賴 package `exports`：

```tsx
import { Button, DatePicker } from "@lyds/ui";
import "@lyds/ui/styles.css";
```

不要匯入 `@lyds/ui/src/**`、`@lyds/ui/dist/**` 或 internal helpers。Public symbols 以 shipped `dist/index.d.ts` 為準。

## Accessibility

LYDS 以 WCAG 2.2 AA 為目標，提供 keyboard/focus behavior、清楚 `focus-visible`、semantic error/status、minimum control target 與 reduced-motion response。Consumer 仍必須提供正確 labels、內容、focus order、contrast-safe custom theme 與真實流程測試。

## Repository documentation

完整安裝、Storybook、開發、元件、tokens、theming 與發佈合約位於 [repository README](https://github.com/linyao-tw/ui#readme) 與 [docs](https://github.com/linyao-tw/ui/tree/main/docs)。

License metadata：Apache-2.0。發佈前須確認 tarball 內授權檔與 repository 一致。
