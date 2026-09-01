# LYDS Architecture

LYDS 是單一 public package、內含 design tokens 與 React components 的 pnpm monorepo。架構的首要目標不是追求最多 package，而是讓 consumer 安裝 `@lyds/ui` 一次，就能取得元件、types 與 CSS，並讓 Storybook、測試及 release 使用相同 public boundary。

## Workspace topology

```text
/
├─ apps/
│  └─ storybook/       # 審閱與文件應用，不發佈
├─ packages/
│  └─ ui/              # 唯一預計公開的 npm package
├─ docs/               # 架構、設計、使用與 release 契約
├─ skills/
│  └─ lyds-ui/         # coding-agent skill source
├─ scripts/            # repository / tarball validation helpers
└─ .github/workflows/  # CI 與受 gate 保護的 publish workflows
```

Root package 永遠為 `private: true`。`apps/storybook` 也是 private；只有 `packages/ui` 對應 `@lyds/ui`。

## Public package boundary

Consumer-facing contract 是：

```tsx
import { Button, DatePicker } from "@lyds/ui";
import "@lyds/ui/styles.css";
```

`packages/ui/package.json` 的 `exports` 是 source of truth。只有列出的 entry points 屬於 public API；`src/**`、測試 helpers、internal utilities、原始 build configuration 都不是。`files` whitelist 與 `pnpm pack:check` 共同限制 tarball 內容。

CSS 被標為 side effect，避免 production tree shaking 靜默移除樣式。Build 必須產出 ESM JavaScript、TypeScript declarations 與 `dist/styles.css`。Storybook 應透過 `@lyds/ui` workspace dependency 取用套件，而不是使用跨 package 相對路徑。

目前以單一 root export 保持 discoverability。只有在以下條件同時成立時才考慮新增 component subpath exports：bundle 分析證明 root ESM 不足、每個 subpath 有穩定維護邊界、types/CSS side effects 可被測試，且不會暴露 internal file layout。

## Behavioral layers

```text
product state and business rules
             ↓
LYDS component API and visual contract
             ↓
Base UI primitives       React Aria Components
(general UI behavior)    (date/time behavior)
             ↓
React + browser platform + Intl
```

### Base UI

Base UI 是 buttons、selection、menu、overlay、disclosure、navigation 等一般互動 primitive 的主要層。LYDS 保留其成熟的 focus management、keyboard interactions、ARIA relationship 與 controlled/uncontrolled model，再加入一致的 API naming、anatomy class、semantic CSS，以及由 Modulor 可見 specimens 驗證的視覺比例與狀態層級。

不要為了「統一」而在 LYDS 重新實作 Base UI 已正確處理的 roving focus、Escape close、focus trap、return focus 或 popup positioning。

### Date & Time exception

Base UI 不提供完整 calendar/date input stack。Date & Time family 因此限定使用兩個 logic/behavior dependencies：

- `react-aria-components`：calendar grids、date segments、range selection、keyboard navigation、locale-sensitive ARIA 與 focus behavior。
- `@internationalized/date`：`CalendarDate`、`CalendarDateTime`、`ZonedDateTime`、date arithmetic 與時區明確的 value types。

這是範圍明確的例外，不是第二套視覺系統。所有可見 UI、tokens、spacing 與 states 仍由 LYDS 控制。其他元件不應僅為方便而引入 React Aria Components。

### Iconography

`@phosphor-icons/react` 是 LYDS 唯一標準 UI icon family，提供一致 vocabulary、typed React components、weight variants、`currentColor`、tree shaking 與不依賴 Context 的 SSR exports。它是 `@lyds/ui` 的 consumer-facing peer dependency，也是 package build/test 的 dev dependency；Storybook 因直接使用 icon 而持有自己的 dependency。UI build 將 Phosphor externalize，不把 icon library 內嵌進套件。

Library source、Storybook 與一般 client component 使用 individual `/dist/csr/<Name>` export，避免部分 bundler 在開發時處理 root barrel 的大量 modules；React Server Components 使用官方 `/ssr` module。品牌 logo、illustration 與 data visualization 不屬於 icon family，但需要明確設計審核，不能成為隨手寫 JSX SVG、Unicode glyph 或 CSS pseudo-icon 的後門。

## State and API architecture

LYDS API 採一致 vocabulary：

- `variant`：語意或視覺階層，例如 `primary`、`secondary`、`quiet`、`danger`。
- `size`：主要採 `sm`、`md`、`lg`。
- `orientation`：只在 component semantics 需要時出現。
- `disabled`、`readOnly`、`required`、`invalid`、`loading`：採可讀的 LYDS names，再映射到 underlying primitive。
- `value` / `defaultValue` / `onValueChange`：有狀態 primitive 的標準 controlled/uncontrolled contract。
- `open` / `defaultOpen` / `onOpenChange`：overlay/disclosure contract。
- `className`、`style`、`render` 或 anatomy parts：允許 composition，而不暴露 styling implementation details。

HTML 原生語意屬性如 `name`、`min`、`max`、`step` 應穿透。Ref 應指向最有用的 interactive/root element。若 underlying primitive 的型別可安全繼承，應優先擴充它而非複製一份易漂移的 props 清單。

## Business-logic boundary

LYDS 只提供一般化 primitives 與 presentation patterns。下列責任明確屬於 application：

- API calls、server actions、cache 與 optimistic updates。
- route navigation、permissions 與 analytics。
- localStorage、cookie 或 theme persistence。
- domain validation、currency/date business rules、資料轉換。
- DataTable sorting、filtering、pagination source、virtualization policy。
- File upload endpoint、multipart protocol、virus scan 與 retry policy。
- Toast 文案策略、錯誤代碼映射與 notification deduplication。

元件可以提供 `onValueChange`、`onOpenChange`、render slot 或 composition parts；它不能替 application 決定這些 callback 的業務效果。

## Styling architecture

單一 CSS entry 依以下順序工作：

1. font imports 與最小 baseline；
2. palette、typography、space、shape、motion、z-index 等 foundation tokens；
3. Light/Dark semantic assignments；
4. shared utilities；
5. component anatomy 與 state selectors。

所有 component colors 必須引用 semantic variables。固定 CSS lengths 使用 `rem`；只有 1px hairlines、decorative dividers 等真正像素精準的細節可使用 `px`。Fluid layout 可合理使用 `%`、`fr`、viewport units 或 unitless line-height。

Global baseline 限定為：

```css
*,
*::before,
*::after {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

@media print {
	* {
		print-color-adjust: exact;
		-webkit-print-color-adjust: exact;
	}
}
```

新增 global normalization 前必須說明具體 interoperability 問題，不建立隱含 typography/layout opinions 的完整 reset。

## Dependency policy

新增 production dependency 前需證明：

1. browser/platform、React、Base UI 或現有 date stack 無法可靠完成；
2. dependency 是 logic/headless，而非另一套 styled component system；
3. bundle、tree shaking、types、SSR 與 license 可接受；
4. 無 business assumptions；
5. 在 architecture 或 component docs 記錄理由。

MUI、Chakra UI、Mantine、Ant Design 或另一套 styling runtime 不在架構允許範圍。GSAP 不應成為 `@lyds/ui` runtime dependency；一般 component motion 使用 tokenized CSS transitions/animations。

## Verification boundaries

Repository 的 `pnpm check` 應覆蓋 format、lint、typecheck、tests、package build 與 Storybook build；`pnpm pack:check` 再驗證真實 npm tarball。可見 UI 變更還需在 Storybook 實際檢查 desktop、mobile、Light、Dark、keyboard 與 reduced motion。

「source 可編譯」不等於「package 可用」；「Storybook 看得到」也不等於「public export 與 tarball 正確」。兩條路徑都必須驗證。
