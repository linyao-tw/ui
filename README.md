# LYDS

LYDS 是一套給 React 應用使用的設計系統，預計以 `@lyds/ui` 發佈。它把可組合、可存取的互動 primitive，轉譯成「retro industrial technology」的 LYDS 視覺語言：溫暖材料、機械面板接縫、技術標示、清楚的實體控制暗示，以及作為動作／訊號色的 Vermilion。

目前 repository 處於發佈前審閱階段。套件、Storybook、測試與發佈自動化都在此 monorepo 維護，但 **本次實作不會發佈任何 npm 版本**；npm 發佈預設由 `NPM_PUBLISH_ENABLED` repository variable 關閉。

## 套件特色

- React + strict TypeScript，React 與 ReactDOM 維持 peer dependencies。
- Base UI 作為一般互動與可存取性 primitive 的主要基礎。
- Date & Time 元件使用 React Aria Components 與 `@internationalized/date`，避免自行發明日曆、locale、鍵盤與時區邏輯。
- Light／Dark 完整語意色彩、尺寸、字體、形狀、陰影與 motion tokens。
- 標準 CSS；元件只取用 semantic variables，不把品牌色或產品邏輯寫死。
- Storybook 是主要的人類審閱、狀態展示與 accessibility 檢查介面。
- ESM、TypeScript declarations 與獨立 `styles.css`，最終只需安裝一個 npm package。

## 安裝

公開發佈啟用後，consumer 可安裝：

```sh
pnpm add @lyds/ui
```

目前請從此 workspace 開發與審閱，不要預期 npm registry 已存在 `@lyds/ui`。

在應用程式入口匯入一次樣式：

```tsx
import "@lyds/ui/styles.css";
```

接著從 package root 使用 public API：

```tsx
import { Button, Card, CardBody, CardTitle, TextField } from "@lyds/ui";

export function AccountPanel() {
	return (
		<Card variant="inset">
			<CardTitle>Account console</CardTitle>
			<CardBody>
				<TextField label="Call sign" description="Shown to collaborators." name="callSign" required />
				<Button variant="primary">Save changes</Button>
			</CardBody>
		</Card>
	);
}
```

元件不包含 API call、routing、analytics、localStorage、表單框架或業務驗證。應用程式負責資料取得、提交、權限、錯誤映射與最終格式；LYDS 負責呈現、互動 primitive 與可存取狀態。

## Themes

Light 是預設 theme。把 `data-lyds-theme` 設在 `html` 或需要隔離的容器上即可切換：

```tsx
document.documentElement.dataset.lydsTheme = "dark";
// document.documentElement.dataset.lydsTheme = "light";
```

也可在 React 內由產品自己的 theme state 控制：

```tsx
import type { PropsWithChildren } from "react";

export function ThemeSurface({ dark, children }: PropsWithChildren<{ dark: boolean }>) {
	return <section data-lyds-theme={dark ? "dark" : "light"}>{children}</section>;
}
```

一般 application 建議把 theme 設在 `document.documentElement`。Overlay 預設 portal 到 `body`；若只在 subtree 設 theme，請把 portal destination 放在同一 scope，或同步設定 destination，避免 popup 與 trigger 使用不同 theme。

LYDS 不自行持久化 theme，也不假設 system preference。若應用程式在 SSR／hydration 前決定 theme，應在首次 paint 前把相同的 `data-lyds-theme` 寫入文件，避免閃爍與 hydration 不一致。詳見 [Theming](docs/theming.md)。

## Tokens 與客製化

元件層使用 role/state 名稱，例如 `--background-main`、`--text-main`、`--control-primary`、`--focus-ring`，而不是 `--orange` 或硬編碼 hex。Figma 名稱以固定規則序列化：

```text
Text/Always_White -> --text-always-white
Motion/Ease/InOut -> --motion-ease-in-out
```

在 theme scope 覆寫 semantic token，可調整品牌表現而不 fork 元件：

```css
.customer-console {
	--control-primary: oklch(68% 0.22 34);
	--control-primary-hover: oklch(72% 0.2 34);
	--focus-ring: oklch(52% 0.18 34);
}
```

覆寫後必須重新驗證 normal text、interactive state、focus ring 與 disabled state 的對比；不要直接在 `.lyds-*` selector 上蓋 raw color。完整 vocabulary 與規則見 [Tokens](docs/tokens.md)。

## Date & Time

Date & Time API 接受 `@internationalized/date` values，保留日期的語意，且不把 locale、格式、12/24 小時制或時區寫死：

```tsx
import { useState } from "react";
import { CalendarDate, DatePicker } from "@lyds/ui";

export function DeliveryDate() {
	const [value, setValue] = useState<CalendarDate | null>(new CalendarDate(2026, 9, 1));

	return <DatePicker label="Delivery date" locale="zh-TW" value={value} onValueChange={setValue} minValue={new CalendarDate(2026, 9, 1)} />;
}
```

`CalendarDate` 表示不帶時間的曆日、`CalendarDateTime` 表示 wall-clock date/time、`ZonedDateTime` 表示具名時區中的確切時間。LYDS 不會在三者之間靜默轉換；應用程式必須依資料語意選擇。請以實際 TypeScript exports 與 [Components](docs/components.md) 為準。

## Storybook 與開發

需求為 React 19、Node.js 22.13+ 與 repository 指定的 pnpm 版本。

```sh
pnpm install --frozen-lockfile
pnpm storybook
```

Storybook 預設開在 `http://localhost:6006`。常用命令：

```sh
pnpm format:check       # Prettier
pnpm lint               # ESLint
pnpm typecheck          # workspace TypeScript
pnpm test               # component / interaction tests
pnpm build:package      # build @lyds/ui
pnpm build:storybook    # production Storybook
pnpm pack:check         # inspect and validate the npm tarball
pnpm check              # full local quality gate
```

Storybook 使用 `@lyds/ui` 的 workspace package API，而非複製元件來源，藉此盡早發現 exports 與 CSS packaging 問題。

## Accessibility

LYDS 以 WCAG 2.2 AA 為目標。Base UI 與 React Aria Components 處理各自擅長的 keyboard、focus、overlay 與 ARIA semantics；LYDS 再提供一致且可見的 `focus-visible`、interactive states、warm-theme contrast、觸控目標與 reduced-motion tokens。

Consumer 仍須提供實際 label、說明、錯誤訊息、合理的 focus order，以及符合情境的 live-region 行為。設計系統不能替產品判斷內容是否清楚，亦不能替代使用真實流程做 keyboard 與 screen-reader 測試。

## Versioning 與發佈

發佈採 npm Trusted Publishing／GitHub Actions OIDC，且預設關閉：只有 repository variable `NPM_PUBLISH_ENABLED=true` 時，publish workflow 才能觸及 npm。

| 來源                | 版本                    | dist-tag   | 重複版本           |
| ------------------- | ----------------------- | ---------- | ------------------ |
| push 至 `main`      | `0.0.0-snapshot.<sha6>` | `snapshot` | 明確記錄後安全略過 |
| tag `v1.2.3`        | `1.2.3`                 | `latest`   | 失敗               |
| tag `v2.0.0-beta.1` | `2.0.0-beta.1`          | `beta`     | 失敗               |

Snapshot 只移動 `snapshot`，不會移動 `latest`。Tagged prerelease 依第一個 prerelease identifier 使用 channel tag，例如 `beta`；stable release 才使用 npm 預設的 `latest`。CI 只在乾淨 checkout 暫時改 package version，不產生或 push version commit。

完整合約、OIDC 首次設定欄位、重複版本策略與人工 release 步驟見 [Publishing](docs/publishing.md)。在 review Storybook 並取得明確批准以前，請勿啟用 publish variable。

## 文件

- [Architecture](docs/architecture.md)
- [Design principles](docs/design-principles.md)
- [Tokens](docs/tokens.md)
- [Theming](docs/theming.md)
- [Components](docs/components.md)
- [Contributing](docs/contributing.md)
- [Publishing](docs/publishing.md)

## 授權

`@lyds/ui` 的 package metadata 宣告為 Apache-2.0；發佈前應確認 repository 與 package tarball 中的授權檔一致且完整。
