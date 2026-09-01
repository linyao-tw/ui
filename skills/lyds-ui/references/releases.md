# 套件與發布規則

Linyao Design System 是麟曜數位工作室的設計系統。npm 套件的技術名稱是 `@lyds/ui`，不得用套件名稱取代專案顯示名稱。

Git 是發布版本的唯一來源。CI 為發布暫時修改的版本號不得提交回儲存庫。發布必須使用乾淨的檢出、通過完整驗證、以 `--access public` 發布 `@lyds/ui`，並使用 npm Trusted Publishing／OIDC，不得提交 npm token。

只有以下兩個條件同時成立時才能發布：

1. 使用者已明確同意發布。
2. GitHub 儲存庫變數 `NPM_PUBLISH_ENABLED` 的值正好是 `true`。

發布工作只保留必要權限：

```yaml
permissions:
  contents: read
  id-token: write
```

npm 套件擁有者必須先把 GitHub 儲存庫與工作流程設為 trusted publisher，之後才能啟用發布開關。

## 主要分支快照

發布開關啟用後，push 至 `main` 會對應到：

```text
<提交 SHA> -> sha6 = 前六個十六進位字元
@lyds/ui@0.0.0-snapshot.<sha6>
npm dist-tag: snapshot
```

例如 `a1b2c3d4...` 發布為 `0.0.0-snapshot.a1b2c3`，並使用 `--tag snapshot`；不得變更 `latest`。工作流程必須先通過所有檢查，動態取得小寫 SHA，只在 CI 工作目錄設定版本，而且不得建立 Git 提交。

主要分支發布必須依序執行，且不得以 `cancel-in-progress` 取消排隊中的提交。重新執行時，先查詢 npm 上的精確快照版本，再比較其 SHA-512 integrity 與本機已驗證 tarball。只有兩者相同時才能明確記錄並略過；integrity 不同、缺少或 npm registry 結果無法判定時必須失敗。

## 標籤正式發布

以 `v` 開頭的有效 SemVer tag 是版本唯一來源：

```text
v1.2.3 -> @lyds/ui@1.2.3 -> npm dist-tag latest
v2.0.0-beta.1 -> @lyds/ui@2.0.0-beta.1 -> npm dist-tag beta
```

發布前必須驗證 SemVer、確認標籤所指的提交可從 `main` 到達、在乾淨的標籤檢出中執行完整驗證，並查詢 npm 上的精確版本。正式版或預發布版已存在時必須明確失敗；不得像快照一樣略過。

穩定版使用 `latest`。預發布版使用第一個 prerelease identifier 產生的 npm-safe channel，例如 `beta`，不得移動 `latest`。標籤版本只寫入 CI 工作目錄，不建立發布提交，並透過 OIDC 發布。

## 驗證不代表授權發布

以下操作只用於安全準備：

```sh
pnpm check
pnpm pack:check
```

檢查 tarball 或執行不發布的預演，不代表取得 `npm publish` 授權。未取得使用者明確同意前，不得手動發布快照或標籤版本、啟用 `NPM_PUBLISH_ENABLED`、建立發布標籤或修改 npm dist-tag。

正式發布前，必須確認已安裝的 Base UI 正式版本包含巢狀選單 portal ownership 修正 [#5058](https://github.com/mui/base-ui/pull/5058)。儲存庫可以暫時修補 Base UI 1.7.0 以驗證已合併的修正，但 pnpm workspace patch 不會隨 `@lyds/ui` tarball 傳給使用端。

升級到含修正的 Base UI 正式版本後，才能移除暫時修補；接著使用獨立安裝的封裝套件，重新檢查子選單開啟狀態的 axe、方向鍵、Tab／Shift+Tab、Escape、焦點返回與 Safari VoiceOver。在這些檢查通過前不得發布。
