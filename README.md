# Linyao Design System

Linyao Design System 是麟曜數位工作室的設計系統，提供 React 元件、設計變數、亮色／深色主題與共用樣式。預計以 npm 套件 `@lyds/ui` 發佈；`@lyds/ui` 與 `lyds-*` 僅為程式識別名稱，不是專案名稱。

元件結構、尺寸、`variant` 與互動狀態以 Modulor Figma 可驗證的設計為依據，色盤改用 Limestone、Charcoal 與 Vermilion。Figma 未提供的元件沿用相同的表面、圓角、字級、間距與狀態規則。

專案目前處於發佈前審閱階段。npm 發佈預設由儲存庫變數 `NPM_PUBLISH_ENABLED` 關閉；未取得明確批准前不會發佈任何版本。

## 功能

- React、strict TypeScript；React 與 ReactDOM 為同儕依賴。
- Base UI 負責一般元件的互動與可存取行為。
- Date & Time 元件使用 React Aria Components 與 `@internationalized/date`。
- 提供完整的亮色／深色語意色彩、尺寸、字體、形狀、陰影與動態效果變數。
- 元件 CSS 只使用語意變數，不包含產品邏輯或硬編碼品牌色。
- Storybook 用於元件審閱、狀態展示與可存取性檢查。
- 元件、設計變數、主題與 CSS 均由 `@lyds/ui` 提供；介面圖示統一使用 `@phosphor-icons/react`。

## 安裝

公開發佈後可安裝：

```sh
pnpm add @lyds/ui @phosphor-icons/react
```

目前請從此工作區開發與審閱；不要假設 npm registry 已存在 `@lyds/ui`。

在應用程式入口匯入一次樣式：

```tsx
import "@lyds/ui/styles.css";
```

從套件根目錄使用公開 API：

```tsx
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { Button, Card, CardBody, CardTitle, TextField } from "@lyds/ui";

export function AccountPanel() {
	return (
		<Card variant="material">
			<CardTitle>帳號設定</CardTitle>
			<CardBody>
				<TextField label="顯示名稱" description="其他協作者會看到這個名稱。" name="displayName" required />
				<Button variant="primary" startIcon={<FloppyDiskIcon weight="bold" />}>
					儲存變更
				</Button>
			</CardBody>
		</Card>
	);
}
```

元件不包含 API 呼叫、路由、分析、localStorage、表單框架或業務驗證。應用程式負責資料、權限、提交與格式；Linyao Design System 負責呈現、互動與可存取狀態。

## 主題

亮色是預設主題。將 `data-lyds-theme` 設在 `html` 或需要隔離的容器即可切換：

```tsx
document.documentElement.dataset.lydsTheme = "dark";
// document.documentElement.dataset.lydsTheme = "light";
```

React 範例：

```tsx
import type { PropsWithChildren } from "react";

export function ThemeSurface({ dark, children }: PropsWithChildren<{ dark: boolean }>) {
	return <section data-lyds-theme={dark ? "dark" : "light"}>{children}</section>;
}
```

一般應用程式應將主題設在 `document.documentElement`。浮層元件預設透過 portal 呈現在 `body`；若只在子樹設定主題，portal 目的節點也必須位於相同主題範圍。

Linyao Design System 不保存主題偏好，也不預設跟隨系統。SSR 應在首次繪製前設定一致的 `data-lyds-theme`，避免閃爍或 hydration 不一致。詳見[主題](docs/theming.md)。

## 設計變數與自訂主題

元件使用 `--background-main`、`--text-main`、`--control-primary`、`--focus-ring` 等角色與狀態名稱，不使用色名或硬編碼十六進位色碼。Figma 名稱依固定規則轉為 CSS 變數：

```text
Text/Always_White -> --text-always-white
Motion/Ease/InOut -> --motion-ease-in-out
```

可在主題範圍覆寫語意變數：

```css
.customer-theme {
	--control-primary: oklch(68% 0.22 34);
	--control-primary-hover: oklch(72% 0.2 34);
	--focus-ring: oklch(52% 0.18 34);
}
```

覆寫後必須重新驗證文字、互動狀態、焦點環與停用狀態的對比。不要直接在 `.lyds-*` 選擇器使用原始色值。詳見[設計變數](docs/tokens.md)。

## 日期與時間

日期與時間 API 使用 `@internationalized/date` 的值，不預設地區設定、格式、12／24 小時制或時區：

```tsx
import { useState } from "react";
import { CalendarDate, DatePicker } from "@lyds/ui";

export function DeliveryDate() {
	const [value, setValue] = useState<CalendarDate | null>(new CalendarDate(2026, 9, 1));

	return <DatePicker label="交付日期" locale="zh-TW" value={value} onValueChange={setValue} minValue={new CalendarDate(2026, 9, 1)} />;
}
```

`CalendarDate` 表示不含時間的日期；`CalendarDateTime` 表示不含指定時區的日期時間；`ZonedDateTime` 表示指定時區中的確切時間。Linyao Design System 不會在三者之間自動轉換。詳見[元件](docs/components.md)。

## 開發

需求為 React 19、Node.js 22.13+ 與儲存庫指定的 pnpm 版本。

```sh
pnpm install --frozen-lockfile
pnpm storybook
```

Storybook 預設網址為 `http://localhost:6006`。常用命令：

```sh
pnpm format:check       # 檢查 Prettier 格式
pnpm lint               # 執行 ESLint
pnpm typecheck          # 檢查工作區 TypeScript
pnpm test               # 執行元件與互動測試
pnpm build:package      # 建置 @lyds/ui
pnpm build:storybook    # 建置 Storybook
pnpm pack:check         # 檢查 npm tarball
pnpm check              # 執行完整本機檢查
```

Storybook 透過 `@lyds/ui` 的工作區套件 API 使用元件，以驗證匯出項目與 CSS 封裝。

### 線上 Storybook

通過完整 CI 的 `main` push 會將 Storybook 部署至 `https://linyao-tw.github.io/ui/`。Pull request 與其他分支只執行驗證，不更新公開網站。GitHub Pages 部署與 npm 發佈相互獨立。

儲存庫擁有者第一次使用時，需在 GitHub `Settings → Pages` 將 Source 設為 `GitHub Actions`。CI 的部署工作只具有 `pages: write` 與 `id-token: write`。

## 可存取性

Linyao Design System 以 WCAG 2.2 AA 為目標。Base UI 與 React Aria Components 提供鍵盤、焦點、浮層與 ARIA 行為；元件樣式提供一致的 `focus-visible`、互動狀態、對比、觸控目標與減少動態效果支援。

使用者仍須提供實際標籤、說明、錯誤訊息、合理的焦點順序與適當的 live region 行為，並以真實流程進行鍵盤與螢幕閱讀器測試。

## 版本與發佈

發佈使用 npm Trusted Publishing／GitHub Actions OIDC。只有儲存庫變數 `NPM_PUBLISH_ENABLED=true` 時，發佈工作流程才能連線至 npm。

| 來源                | 版本                    | dist-tag   | 重複版本              |
| ------------------- | ----------------------- | ---------- | --------------------- |
| push 至 `main`      | `0.0.0-snapshot.<sha6>` | `snapshot` | 相同 integrity 才略過 |
| tag `v1.2.3`        | `1.2.3`                 | `latest`   | 失敗                  |
| tag `v2.0.0-beta.1` | `2.0.0-beta.1`          | `beta`     | 失敗                  |

快照版本不會移動 `latest`。相同快照版本已存在時，只有 registry SHA-512 integrity 與本次 tarball 相同才會略過；內容不一致或狀態不明時工作流程會失敗。標籤預發佈版本使用第一個 prerelease identifier 作為 dist-tag；穩定版本才使用 `latest`。CI 只在工作區暫時修改版本，不提交版本變更。

完整規則與 OIDC 設定見[發佈](docs/publishing.md)。完成 Storybook 審閱並取得明確批准前，不得啟用發佈變數。

## 文件

- [架構](docs/architecture.md)
- [設計原則](docs/design-principles.md)
- [設計變數](docs/tokens.md)
- [主題](docs/theming.md)
- [元件](docs/components.md)
- [貢獻指南](docs/contributing.md)
- [發佈](docs/publishing.md)

## 授權

`@lyds/ui` 的 package metadata 宣告為 Apache-2.0。發佈前應確認 repository 與 package tarball 的授權檔一致且完整。
