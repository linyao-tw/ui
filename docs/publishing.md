# 發佈

本文件定義 `@linyao.tw/ui` 的發佈規則，並同步適用於本機操作、GitHub Actions 與 Linyao Design System 代理技能。

> [!IMPORTANT] `@linyao.tw/ui` 尚未發佈。`NPM_PUBLISH_ENABLED` 預設不存在或不等於字串 `true`，發佈工作必須保持停用。只有完成 Storybook 審閱並取得儲存庫擁有者明確批准後，才能執行初始發佈或啟用發佈。

## 安全設定

正式發佈使用 npm Trusted Publishing 與 GitHub Actions OIDC，不儲存 npm 寫入 token：

```yaml
permissions:
  contents: read
  id-token: write
```

發佈工作必須使用 GitHub-hosted runner、乾淨的 checkout、npm CLI 11.5.1+ 與 Node.js 22.14+。本機最低 Node.js 版本不能取代 OIDC 的發佈版本要求。

Trusted Publishing 在公開儲存庫與公開套件的 GitHub Actions 發佈中會自動產生 provenance，不需要 `NPM_TOKEN` 或額外的 `--provenance`。套件 manifest 的儲存庫 URL 為 `git+https://github.com/linyao-tw/ui.git`；GitHub 擁有者／儲存庫必須與 OIDC 發佈者的 `linyao-tw/ui` 完全一致。不得從 metadata 未同步的分支儲存庫發佈。

參考：

- [npm Trusted publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)
- [Publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)

## 發佈開關

GitHub 儲存庫變數：

```text
NPM_PUBLISH_ENABLED=true
```

只有精確等於字串 `true` 時，工作流程才能發佈。未設定、空值、`false`、`TRUE` 或其他值都視為停用。

啟用前必須：

1. 擁有者明確批准發佈；
2. 完成 Storybook 與 tarball 審閱；
3. 完成 npm Trusted Publisher 設定；
4. 確認工作流程版本已在受保護的 `main`；
5. 確認沒有 npm 寫入 secrets。

未批准時不得測試發佈、建立發佈 tag、將開關預設設為 true，或修改 npm dist-tag。可執行 `pnpm pack:check`、`npm publish --dry-run` 與 registry 唯讀查詢。

## 快照版本發佈

啟用發佈後，每次 push 至 `main` 都會產生對應該 commit 的快照版本：

```text
commit a1b2c3d4…
-> 0.0.0-snapshot.a1b2c3
-> @linyao.tw/ui@0.0.0-snapshot.a1b2c3
-> dist-tag snapshot
```

安裝方式：

```sh
pnpm add @linyao.tw/ui@snapshot
pnpm add @linyao.tw/ui@0.0.0-snapshot.a1b2c3
```

規則：

1. 品質檢查、套件建置與 Storybook 建置必須先成功。
2. 使用乾淨的 checkout，不使用開發者工作區產物。
3. 從 `GITHUB_SHA` 取得前 6 個十六進位字元，不接受手動版本。
4. 只在 CI 工作區／tarball 暫時將 `packages/ui/package.json` 版本設為 `0.0.0-snapshot.<sha6>`。
5. 不建立 commit、不 push 版本變更、不建立 tag。
6. 發佈使用 `--access public --tag snapshot`。
7. 快照版本絕不使用或移動 `latest`。
8. 發佈前查詢確切版本；若已存在，必須比對 registry 與本次 tarball 的 SHA-512 integrity。完全相同才可明確記錄並略過。
9. Integrity 不同，或發生網路／驗證／權限錯誤、registry 回應不完整時必須失敗，不得視為安全重跑。
10. `main` 發佈工作必須依序執行，且 `cancel-in-progress: false`，避免排隊中的 commit 遺失快照版本。

快照版本的冪等處理只適用於同一確切快照的重跑。npm 版本內容不可覆寫。

## 標籤版本發佈

SemVer tag 是正式版本的唯一依據：

```text
v1.2.3 -> package 1.2.3 -> dist-tag latest
v2.0.0-beta.1 -> package 2.0.0-beta.1 -> dist-tag beta
```

流程：

1. 嚴格驗證 tag 為 `v` 加有效 SemVer。
2. 移除 `v` 取得 npm 版本。
3. 取得 `main` 歷史，確認標記的 commit 可從 `main` 追溯；否則失敗。
4. 從 tag 的乾淨 checkout 執行完整安裝、格式、lint、型別檢查、測試、套件建置、Storybook 建置與封裝驗證。
5. 查詢 `@linyao.tw/ui@<version>`。
6. 確切的標籤版本已存在時必須失敗，不得略過。
7. 只在 CI 工作區／tarball 暫時設定版本；不 commit、不 push。
8. 使用 `--access public`。
9. 穩定版本使用 `--tag latest`。
10. 預發佈版本使用第一個 prerelease identifier，例如 `beta`；不得移動 `latest`。

只有擁有者明確批准，且目標 commit 已在 `main` 時，才能執行：

```sh
git switch main
git pull --ff-only
pnpm check
pnpm pack:check
git tag v1.2.3
git push origin v1.2.3
```

預發佈版本：

```sh
git tag v2.0.0-beta.1
git push origin v2.0.0-beta.1
```

Push tag 即為發佈要求。建立前先以 `npm view @linyao.tw/ui@<version> version` 進行唯讀重複版本檢查；CI 仍須再次檢查。

### npm dist-tag 規則

| Git 來源           | npm version             | npm dist-tag | `latest`       |
| ------------------ | ----------------------- | ------------ | -------------- |
| `v1.2.3`           | `1.2.3`                 | `latest`     | 發佈成功後更新 |
| `v2.0.0-beta.1`    | `2.0.0-beta.1`          | `beta`       | 不變           |
| main SHA `a1b2c3…` | `0.0.0-snapshot.a1b2c3` | `snapshot`   | 不變           |

預發佈識別字必須可安全作為 npm dist-tag。若採用 `alpha`、`rc` 或其他頻道，工作流程與本文件必須先以測試驗證映射；不得回退至 `latest`。

## 重複版本

快照版本：

```text
確切版本已存在
-> 比對 registry SHA-512 與已驗證的本機 tarball
-> integrity 不同或無法確認時失敗
-> 相同時記錄 "already exists with identical integrity"
-> 略過發佈
-> 工作流程成功
```

標籤版本：

```text
確切版本已存在
-> 記錄重複發佈錯誤
-> 工作流程失敗
```

快照重跑是同一 commit 的冪等自動化；正式版本重複需要人工調查發佈流程、tag 所有權或 registry 狀態。兩者都不得覆寫已發佈版本。

## 第一次 npm 設定

### 1. 確認 npm scope 與套件所有權

確認 npm 帳號可公開發佈 `@linyao.tw/*` scope，並啟用 2FA。確認 `@linyao.tw/ui` 名稱與儲存庫 metadata 正確。

### 2. 建立套件頁面

npm Trusted Publisher 設定位於既有套件的 Settings。若 `@linyao.tw/ui` 尚無套件頁面，取得明確發佈批准後，才可使用互動式 npm 帳號與 2FA 執行一次非 `latest` 的初始發佈。不得使用假的穩定版本。

安全流程：

1. 從已審閱的乾淨 commit 執行 `pnpm check` 與 `pnpm pack:check`。
2. 在暫存目錄解開並修改已檢查 tarball 的版本，不改 git 工作目錄。
3. 使用該 commit 的 `0.0.0-snapshot.<sha6>`。
4. 執行 `npm publish <tarball> --access public --tag snapshot`，使用互動式 2FA，不將 token 寫入儲存庫／CI。
5. 核對套件、檔案、儲存庫、版本與 `snapshot` tag，確認未產生 `latest`。
6. 立即設定 Trusted Publisher，之後以新 commit 驗證 OIDC。

這項初始發佈不屬於目前工作，不得現在執行。若 npm 已支援為未發佈套件建立 Trusted Publisher，應依當時的 [npm 官方文件](https://docs.npmjs.com/trusted-publishers/) 使用無 token 流程。

### 3. 設定 Trusted Publisher

在 npmjs.com 開啟 `@linyao.tw/ui` → Settings → Trusted publishing → GitHub Actions：

| 欄位                 | 值                                                 |
| -------------------- | -------------------------------------------------- |
| Organization or user | `linyao-tw`                                        |
| Repository           | `ui`                                               |
| Workflow filename    | `publish.yml`                                      |
| Environment name     | 留空；目前 `publish.yml` 未宣告 GitHub Environment |
| Allowed actions      | `npm publish`                                      |

Workflow filename 只填 `publish.yml`，不是 `.github/workflows/publish.yml`。所有欄位區分大小寫，npm 儲存時不會驗證。

若工作流程日後加入 GitHub Environment，必須同步修改 npm Trusted Publisher 的 Environment name 與本文件。

若套件已存在、npm 帳號已啟用 2FA 且 CLI 支援 `npm trust`，也可使用相同資料設定。2026-08-31 的 `npm trust` 需要 npm 11.15+，高於發佈工作流程的 npm 11.5.1+ 最低需求。實際執行前應依最新 [npm trust CLI 文件](https://docs.npmjs.com/cli/v11/commands/npm-trust/) 確認，並先使用 `--dry-run`：

```sh
npm trust github @linyao.tw/ui \
	--repo linyao-tw/ui \
	--file publish.yml \
	--allow-publish
```

### 4. 啟用 GitHub 發佈開關

完成信任設定後，在 GitHub 儲存庫 → Settings → Secrets and variables → Actions → Variables 新增：

```text
Name:  NPM_PUBLISH_ENABLED
Value: true
```

這是儲存庫變數，不是 secret。不得建立 `NPM_TOKEN`。若日後安裝私有依賴需要 token，只能使用沒有發佈權限的唯讀 token。

### 5. 驗證與權限

1. 以新的 main commit 觸發快照版本。
2. 確認確切版本、`snapshot` dist-tag、tarball 檔案與 provenance。
3. 確認 `latest` 未改變。
4. 在 npm 套件設定限制或撤銷傳統發佈 token，只保留 OIDC。
5. 保護 GitHub `main` 與發佈 tags；必要時為發佈工作加入環境核准。
6. 定期核對 Trusted Publisher、工作流程檔名與儲存庫 metadata。

## 發佈前檢查

- [ ] 擁有者已明確批准發佈。
- [ ] `git status --short` 為空。
- [ ] Commit／tag 正確且符合 `main` 規則。
- [ ] `pnpm install --frozen-lockfile` 成功。
- [ ] `pnpm check` 成功。
- [ ] `pnpm pack:check` 成功且已人工檢查 tarball。
- [ ] `@linyao.tw/ui` 版本／匯出／型別／樣式／授權／儲存庫 metadata 正確。
- [ ] Base UI 正式版本已包含 #5058 子選單 portal owner 修正；暫時 patch 已移除；使用端 tarball 的子選單開啟狀態 axe／鍵盤／VoiceOver 驗證已通過。
- [ ] npm 確切版本唯讀查詢符合快照／正式版本規則。
- [ ] npm Trusted Publisher 欄位正確。
- [ ] 工作流程使用 GitHub-hosted runner、`contents: read`、`id-token: write`。
- [ ] 沒有 npm 寫入 token。
- [ ] `NPM_PUBLISH_ENABLED=true` 是已核准的狀態。
- [ ] 穩定／預發佈 dist-tag 已確認，不會誤移 `latest`。

## 發佈問題處理

npm 版本不可覆寫。發佈發生問題時：

1. 停用 `NPM_PUBLISH_ENABLED`。
2. 暫停或撤銷 Trusted Publisher／GitHub Environment 核准。
3. 記錄受影響版本、SHA、工作流程執行記錄與 tarball digest。
4. 依 npm 規則評估 deprecate／unpublish；這些操作可能破壞外部狀態，需要另行明確批准。
5. 修正後建立新的 SemVer 版本；不得重新指定已發佈的 tag。

手動修改 `latest`、`snapshot` 或預發佈 dist-tag 也是外部變更，必須另行取得明確批准。
