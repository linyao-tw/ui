# Contributing

LYDS 的 contribution goal 是維持一個可預測的 public design-system contract。新增元件並不是只加一個 `.tsx`：API、behavior primitive、semantic tokens、Light/Dark、states、Storybook、tests、exports、types 與 package contents 必須一起完成。

## Prerequisites

- Node.js 22.13+（release workflow 另需符合 npm Trusted Publishing 的較高版本要求）。
- Repository `packageManager` 欄位指定的 pnpm。
- macOS/Linux shell；CI 是最終 cross-environment gate。

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm pack:check
```

不要在未檢查 `package.json` / lockfile 前替換工具。只為 ad-hoc visual inspection 時，優先使用 globally installed Playwright CLI：

```sh
command -v playwright
```

若 global CLI 可用，就用它做 screenshot/open/codegen；不要只為人工檢查把 Playwright 加進 project。只有要提交 reusable tests 或 CI browser coverage 時，才評估 project dependency。

## Before adding a component

依序確認：

1. `@lyds/ui` 是否已存在相同 semantics 的 component？
2. 是否能用現有 anatomy parts 或 `render` composition 完成？
3. 差異是否只是 layout 或 token assignment？
4. 行為是否已由 Base UI 提供？
5. Date & Time 是否應使用現有 React Aria Components stack？
6. 需求是否其實是 business logic，應留在 application？

不要因為某個產品需要一個特例，就 fork `Button` 或建立 `CustomerDatePicker`。先改善 shared primitive 的可組合性；只有跨產品、無 domain assumptions 且可維持 accessibility 的行為才進 LYDS。

## Component implementation checklist

### API

- 使用一致的 `variant`、`size`、`orientation` vocabulary。
- Stateful component 支援適用的 controlled/uncontrolled API。
- 保留 underlying callback details；若簡化 callback，不應讓 consumer 失去辨識 interaction reason 或 cancel event 的能力。
- Forward ref 至實際有用的 root/interactive element。
- 保留 `className`、`style` 與 Base UI stateful class/render 能力，除非有具體型別或安全理由。
- Native semantics props 如 `name`、`required`、`min`、`max`、`step` 正確傳遞。
- Icon-only action 在型別或 runtime 結構上要求 accessible name。
- 不加入 API、router、storage、analytics、form-framework 或 domain validation assumptions。

### Behavior primitive

- 一般 actions、selection、overlays、disclosure、navigation 優先使用 Base UI。
- Date & Time 使用 React Aria Components 與 `@internationalized/date`；不匯入 Base UI private internals，也不自行寫 calendar arithmetic。
- 不加入另一套 styled component system。
- Base UI composition 使用 `render`，不是 `asChild`；render callback 必須把 primitive 提供的 props/ref 完整帶到實際 DOM。

### CSS

- Component colors 全部使用 semantic tokens，包括 shadows、overlay、status、focus 與 disabled。
- Fixed CSS lengths 使用 rem；只允許真正 hairline/decorative divider 使用 1px。
- 所有 transition duration/easing 使用 motion tokens。
- 加入 Light/Dark，以及 relevant hover/pressed/focus-visible/selected/open/disabled/read-only/loading/invalid states。
- 不加入 Figma anatomy 沒有依據的切角、偽技術標籤、面板接縫或裝飾性工程網格；reference 延伸也不能遮住文字、focus 或 hit target。
- `prefers-reduced-motion: reduce` 下仍能理解 state。

### Storybook

每個 significant component 至少涵蓋適用的：

- default、variants、sizes；
- disabled、loading、invalid、read-only；
- controlled/uncontrolled；
- Light/Dark；
- long text、narrow viewport；
- realistic composition；
- keyboard interaction／play function；
- date locale/range/constraints 或 overlay nesting 等 family-specific edge cases。

Storybook 必須從 `@lyds/ui` public API 匯入，不跨 package 使用 `../../packages/ui/src/**`。

### Tests

測試 behavior，不以 snapshots 取代 interaction assertions：

- render 與 accessible name/description/error relationships；
- controlled/uncontrolled state；
- keyboard arrows、Enter/Space、Escape、Tab；
- focus trap、return focus、dismissal、outside interaction；
- disabled/read-only/invalid/loading；
- form value 與 reset；
- Base UI composition；
- date leap years、month/year boundaries、range、min/max/unavailable；
- locale-sensitive segment order、first-day-of-week、12/24-hour；
- zoned vs wall-clock value semantics；
- axe automated checks；
- reduced motion，能自動化的部分應驗證 token/state。

Jsdom tests 不能證明真實 browser focus、layout 或 pointer behavior。Overlay、DatePicker in Dialog/Drawer、RTL 與 responsive UI 需在 Storybook/browser 額外驗證。

## Adding a token

1. 用 role/state 定義需求。
2. 搜尋是否已有 semantic token。
3. Light 與 Dark 一起加入。
4. 更新 `docs/tokens.md` 與 Storybook Foundations。
5. 檢查 component CSS 沒有 raw color 或未命名 easing。
6. 驗證受影響 contrast pairs 與 states。

不要用新 token 掩飾只出現一次、應由既有 role 表達的值。Public token rename/removal 可能是 breaking change。

## Adding a public export

1. 從 component family `index.ts` export implementation 與必要 types。
2. 從 `packages/ui/src/index.ts` export family public API。
3. 不 export internal class helpers、test setup 或 private anatomy。
4. `pnpm build:package`，檢查 `dist/index.d.ts`。
5. Storybook 用 package name 匯入。
6. `pnpm pack:check`，確認 tarball 有 JS/types/CSS/README/license，沒有 source/tests/config/cache。

Subpath export 只有在有穩定 maintenance boundary 與 consumer bundle evidence 時才新增；同步更新 `package.json#exports`、types、build 與 pack verification。

## Validation

提交前執行完整 gate：

```sh
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build:package
pnpm build:storybook
pnpm pack:check
```

或：

```sh
pnpm check
pnpm pack:check
```

若某項未執行，PR 必須明確說明未執行與原因，不能聲稱通過。

Visual changes 需啟動 Storybook：

```sh
pnpm storybook
```

至少檢查 Light/Dark、desktop/mobile、keyboard focus、reduced motion 與 realistic mixed form。PR 附適用 screenshot；不易截圖的 interaction 描述人工檢查方式。

## Commit messages

依 repository 規範使用 Linux kernel/Git-style area prefix，不使用 generic Conventional Commit type：

```text
ui/button: add loading state semantics
ui/date-time: validate zoned picker values
storybook: document overlay compositions
publishing: guard npm releases behind repository variable
```

Summary 使用 imperative verb、具體且盡量少於 72 characters，不加句點。原因無法從 diff 看出時加 commit body 解釋 why。每個 commit 應是 coherent working milestone，不切成沒有意義的小 commit，也不混入無關改動。

## Pull requests

PR 應包含：

- changed area 與 user/developer-visible impact；
- API 或 token compatibility notes；
- validation commands 的實際結果；
- related issues；
- visible UI screenshots；
- accessibility/keyboard/manual checks；
- deferred work 或 remaining risks。

永遠不要在 component PR 中順便啟用 `NPM_PUBLISH_ENABLED`、建立 release tag 或直接發布 package。發佈是獨立且需要明確批准的操作，詳見 [Publishing](publishing.md)。
