# Publishing

本文件是 `@lyds/ui` 的 release contract。它同時約束 local practice、GitHub Actions 與 LYDS Agent Skill；任一處變更都應同步更新另外兩處。

> 現況：`@lyds/ui` 尚未在本次工作中發佈。`NPM_PUBLISH_ENABLED` 預設不存在或不是字串 `true`，因此 publish job 必須保持 disabled。只有完成 Storybook review 並取得 repository owner 的明確批准後，才能執行 bootstrap 或啟用 publishing。

## Security model

正常 publication 使用 npm Trusted Publishing 與 GitHub Actions OIDC，不儲存 npm write token：

```yaml
permissions:
  contents: read
  id-token: write
```

Publish job 必須使用 GitHub-hosted runner、clean checkout、npm CLI 11.5.1+ 與 Node.js 22.14+。Repository 本地開發最低版本不能覆蓋 npm OIDC 的 release requirement；workflow 應使用符合條件的 Node 版本。

依 npm 官方文件，trusted publishing 會在 public repository + public package 的 GitHub Actions publication 自動產生 provenance，不需要 `NPM_TOKEN` 或額外 `--provenance`。Package manifest 目前使用 npm 慣用的 Git URL `git+https://github.com/linyao-tw/ui.git`；它所識別的 GitHub owner/repository 必須與 OIDC publisher 的 `linyao-tw/ui` 大小寫及來源完全一致。發佈不可從未同步 metadata 的 fork 進行。

參考：

- [npm Trusted publishing](https://docs.npmjs.com/trusted-publishers/)
- [npm provenance](https://docs.npmjs.com/generating-provenance-statements/)
- [Publishing scoped public packages](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/)

## Global publication gate

GitHub repository variable：

```text
NPM_PUBLISH_ENABLED=true
```

只有**精確等於**字串 `true` 時，workflow 才能 publish。Unset、empty、`false`、`TRUE` 或任何其他值都視為 disabled。

這個 variable 是技術 gate，不取代人類批准。啟用前仍須：

1. owner 明確批准 publication；
2. review Storybook 與 tarball；
3. 完成 npm Trusted Publisher 設定；
4. 確認 workflow revision 已在 protected `main`；
5. 確認沒有 npm write secrets。

未批准時不要「測試」publish、建立 release tag、把 gate 暫時改成預設 true，或執行 `npm dist-tag` mutation。可用 `pnpm pack:check`、`npm publish --dry-run` 與 registry read-only queries 驗證。

## Snapshot releases from `main`

當 publishing 已啟用，每次 push 至 `main` 產生 commit-specific snapshot：

```text
commit a1b2c3d4…
-> 0.0.0-snapshot.a1b2c3
-> @lyds/ui@0.0.0-snapshot.a1b2c3
-> dist-tag snapshot
```

Install forms：

```sh
pnpm add @lyds/ui@snapshot
pnpm add @lyds/ui@0.0.0-snapshot.a1b2c3
```

Snapshot contract：

1. Quality checks 與 package/Storybook builds 必須先成功。
2. 使用 clean checkout，不使用 developer workspace artifacts。
3. 從 `GITHUB_SHA` 取前 6 個 hexadecimal characters；不接受手動輸入版本。
4. 只在 CI workspace/tarball 暫時將 `packages/ui/package.json` version 設為 `0.0.0-snapshot.<sha6>`。
5. 不產生 commit、不 push version change、不建立 tag。
6. 發佈命令使用 `--access public --tag snapshot`。
7. `snapshot` publication 絕不帶 `latest`；不可依 npm default tag。
8. 發佈前查詢 exact version：若已存在，必須再比對 registry 與本次已驗證 tarball 的 SHA-512 integrity；只有完全一致才 log 清楚說明並成功略過。
9. Integrity 不一致、network/auth/permission error 或不完整的 registry response 一律 fail closed，不得誤判為安全 rerun。
10. Main publish concurrency 要 serialize，且 `cancel-in-progress: false`，避免較舊但已排隊的 commit 靜默失去 snapshot。

Snapshot idempotency 只適用 exact snapshot rerun；不能覆寫既有 version，因為 npm version contents immutable。

## Tagged production releases

Production source of truth 是 SemVer tag：

```text
v1.2.3 -> package 1.2.3 -> dist-tag latest
v2.0.0-beta.1 -> package 2.0.0-beta.1 -> dist-tag beta
```

Release steps：

1. Workflow 嚴格驗證 tag 是 `v` + valid SemVer；不是只用寬鬆 regex。
2. 移除前綴 `v` 得到 npm version。
3. Fetch `main` history，驗證 tagged commit 可從 `main` reach；不符合即 fail。
4. 從 tag 的 clean checkout 執行完整 install、format、lint、typecheck、tests、package build、Storybook build 與 pack validation。
5. Query `@lyds/ui@<version>`。
6. Exact tagged version 若已存在，**明確 fail**；production rerun 不得 silent skip。
7. 只在 CI workspace/tarball 暫時設定 version；不 commit、不 push。
8. 使用 `--access public`。
9. Stable release 使用 `--tag latest`。
10. Prerelease 依第一個 prerelease identifier 使用 channel，例如 `beta`；不得移動 `latest`。

操作範例（只有 owner 明確批准，且目標 commit 已在 `main` 時）：

```sh
git switch main
git pull --ff-only
pnpm check
pnpm pack:check
git tag v1.2.3
git push origin v1.2.3
```

Prerelease：

```sh
git tag v2.0.0-beta.1
git push origin v2.0.0-beta.1
```

Tag push 是 publication request，不是一般 metadata 操作。建立前先以 `npm view @lyds/ui@<version> version` 做 read-only duplicate check，但 CI 仍須再次檢查，避免 race。

### Dist-tag rules

| Tag                | npm version             | npm dist-tag | Effect on `latest`                      |
| ------------------ | ----------------------- | ------------ | --------------------------------------- |
| `v1.2.3`           | `1.2.3`                 | `latest`     | moves `latest` after successful publish |
| `v2.0.0-beta.1`    | `2.0.0-beta.1`          | `beta`       | unchanged                               |
| main SHA `a1b2c3…` | `0.0.0-snapshot.a1b2c3` | `snapshot`   | unchanged                               |

Prerelease identifier 必須能安全作為 npm dist-tag。若未來採 `alpha`、`rc` 或其他 channel，workflow 與本文件需先以 tests 證明 mapping；不要讓 semver-looking tag 被 npm 誤解，也不要 fallback 到 `latest`。

## Duplicate behavior

Snapshot 與 production 刻意不同：

```text
snapshot exact version exists
-> compare registry SHA-512 with the verified local tarball
-> fail if integrity differs or cannot be established
-> log "already exists with identical integrity"
-> skip publish
-> workflow succeeds

tagged exact version exists
-> log duplicate release error
-> workflow fails
```

理由：snapshot rerun 是同一 commit 的 idempotent automation；tagged production duplicate 通常代表 release process、tag ownership 或 registry state 需要人類調查。兩者都不會嘗試 overwrite，因為 npm 不允許覆寫已發佈 version。

## First-time npm setup

### 1. Verify namespace and package ownership

在 npm 上確認操作帳號可公開發佈 `@lyds/*` scope，並啟用 2FA。確認 `@lyds/ui` 名稱與 repository metadata 正確；不要用名稱相近的個人 scope 代替。

### 2. Bootstrap only if the package settings page does not exist

npm 的 Trusted Publisher UI 位於既有 package 的 Settings。若 `@lyds/ui` 尚無 package page，就無法先在該頁建立 trust relationship。取得明確 publication approval 後，以 interactive npm account + 2FA 做**一次性、非 `latest`** bootstrap，建立 reviewed snapshot package；不要為 bootstrap 發佈假的 stable version。

安全流程：

1. 從 reviewed clean commit 完成 `pnpm check` 與 `pnpm pack:check`。
2. 用 temporary directory 解開／修改已檢查 tarball 的 package version，不改 git working tree。
3. 使用該 commit 的 `0.0.0-snapshot.<sha6>`。
4. 再用 `npm publish <tarball> --access public --tag snapshot`；interactive 2FA，不把 token 寫進 repository/CI。
5. 核對 registry package、files、repository、version 與 `snapshot` tag；確認沒有意外 `latest`。
6. 立即設定 Trusted Publisher，再以後續 commit 驗證 OIDC。

這個 bootstrap **不屬於目前任務，不可現在執行**。若 npm 在實際設定時已支援未發佈 package 的 trusted publisher creation，優先使用 tokenless 路徑，跳過 manual bootstrap；以當時的 [npm 官方文件](https://docs.npmjs.com/trusted-publishers/) 為準。

### 3. Configure Trusted Publisher

在 npmjs.com 開啟 `@lyds/ui` → Settings → Trusted publishing → GitHub Actions，填入：

| Field                | Exact value                                                |
| -------------------- | ---------------------------------------------------------- |
| Organization or user | `linyao-tw`                                                |
| Repository           | `ui`                                                       |
| Workflow filename    | `publish.yml`                                              |
| Environment name     | **留空**（目前 `publish.yml` 沒有宣告 GitHub Environment） |
| Allowed actions      | `npm publish`                                              |

Workflow filename **只填 basename** `publish.yml`，不是 `.github/workflows/publish.yml`。所有欄位 case-sensitive；npm 儲存時不會驗證，錯誤通常到第一次 publish 才出現。

若未來在 workflow 加入 GitHub Environment，必須先同步修改 npm Trusted Publisher 的 Environment name 與本文件；只改一邊會讓 OIDC publication authentication 失敗。

也可在 package 已存在、interactive npm account 已啟用 2FA 且 CLI 支援 `npm trust` 時使用相同資訊設定。2026-08-31 的 `npm trust` 需要 npm 11.15+；這高於 publish workflow 對 OIDC publication 的 npm 11.5.1+ 最低要求。實際執行前先以最新 [npm trust CLI 文件](https://docs.npmjs.com/cli/v11/commands/npm-trust/) 核對，並先使用 `--dry-run`：

```sh
npm trust github @lyds/ui \
	--repo linyao-tw/ui \
	--file publish.yml \
	--allow-publish
```

### 4. Enable the GitHub gate only after trust exists

GitHub repository → Settings → Secrets and variables → Actions → Variables：

```text
Name:  NPM_PUBLISH_ENABLED
Value: true
```

這是 repository **variable**，不是 secret。不要建立 `NPM_TOKEN`。若 install 私有 dependencies 日後需要 token，使用 read-only token，且不可讓它擁有 publish permission。

### 5. Verify and harden

1. 以新 main commit 觸發 snapshot。
2. 確認 exact version、`snapshot` dist-tag、tarball files 與 provenance。
3. 確認 `latest` 未改變。
4. npm package settings 限制／撤銷 traditional publish tokens；只保留 OIDC。
5. GitHub 保護 `main` 與 release tags，必要時為 publish job 加 environment approval。
6. 定期核對 npm trusted publisher、workflow filename 與 repository metadata。

## Pre-release checklist

- [ ] Owner 已明確批准這次 publication。
- [ ] `git status --short` 為空。
- [ ] Commit/tag 正確且在 `main` policy 內。
- [ ] `pnpm install --frozen-lockfile` 成功。
- [ ] `pnpm check` 成功。
- [ ] `pnpm pack:check` 成功且人工檢查 tarball。
- [ ] `@lyds/ui` version/exports/types/styles/license/repository metadata 正確。
- [ ] Base UI 正式 release 已包含 #5058 submenu portal-owner 修正，workspace temporary patch 已移除，consumer tarball 的 submenu open-state axe／keyboard／VoiceOver 驗證已通過。
- [ ] npm exact version read-only query 符合 snapshot/production policy。
- [ ] npm Trusted Publisher exact fields 正確。
- [ ] Workflow 使用 GitHub-hosted runner、`contents: read`、`id-token: write`。
- [ ] 沒有 npm write token。
- [ ] `NPM_PUBLISH_ENABLED=true` 是有意且已核准的狀態。
- [ ] Stable/prerelease dist-tag 已確認，不會誤移 `latest`。

## Rollback and incident response

npm version 不可覆寫；不要用重跑嘗試「修正」同一 production version。若 publication 有問題：

1. 停用 `NPM_PUBLISH_ENABLED`。
2. 暫停/撤銷 Trusted Publisher 或 GitHub environment approval。
3. 記錄 affected version、SHA、workflow run 與 tarball digest。
4. 依 npm policy評估 deprecate/unpublish；這些是外部、可能具破壞性的操作，需另行明確批准。
5. 修正後建立新的 SemVer version；不要 retag 已發佈的 tag。

`latest` / `snapshot` / prerelease dist-tags 的手動更動也屬外部 mutation，不能從本文件自動推導授權。
