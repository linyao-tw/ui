# 儲存庫規範

## 提交與 PR

提交標題使用 Linux kernel／Git 風格，前綴應指出主要變更的目錄、套件、元件或子系統：

```text
area: imperative patch summary
sub/sys: imperative patch summary
```

- 不要以 `fix:`、`feat:`、`chore:`、`docs:` 或 `refactor:` 等泛用 Conventional Commits 類型取代實際範圍。
- 冒號後使用祈使動詞，例如 `fix`、`clarify`、`split`、`validate`、`rename`、`remove`、`add`、`update` 或 `document`。
- 標題應具體、簡短，建議不超過 72 個字元，不加句號。
- 跨多個範圍時，選擇最小的共同範圍；若沒有共同範圍，使用主要行為作為前綴。

例如：

```text
storybook: clarify build ownership
web/routes: split route-level chunks
ui/field: fix select menu positioning
server/auth: validate session cookie
```

變更原因無法從差異直接看出時，應在提交本文說明原因。PR 應列出變更範圍、使用者或開發者可見的影響、實際執行的驗證、相關議題，以及視覺變更的截圖。未執行驗證時，必須明確說明原因。

## Linyao Design System Skill

Linyao Design System 是麟曜數位工作室的設計系統。專案顯示名稱只能使用 `Linyao Design System`，不得縮寫。小寫 `lyds` 只保留於 `data-lyds-theme`、CSS 類別、Skill 識別與其他既有技術 API。

安裝或使用 `@linyao.tw/ui`、組合元件、調整語意設計變數或主題、新增元件、撰寫 Storybook 或測試、檢查無障礙，或準備發布時，必須先讀取 `skills/lyds-ui/SKILL.md`，並依工作類型讀取其中指定的參考文件。

程式碼規範：跨目錄匯入一律使用 `@/` 別名，不得出現 `../`；同目錄使用 `./`。元件 CSS 的顏色、長度與動態效果一律使用設計變數，不得寫入原始值；`pnpm lint:css` 會強制檢查。完整規範見 `docs/contributing.md` 與 `docs/tokens.md`。

優先使用既有公開元件或組合方式，不要先建立新的基礎元件。未取得使用者明確同意前，不得發布 `@linyao.tw/ui`、建立發布標籤、啟用 npm 發布開關或變更 npm dist-tag。
