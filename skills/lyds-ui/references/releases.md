# Package and release safeguards

The release source of truth is Git. Version changes made for publishing are temporary CI workspace changes: never commit them back. Build from a clean checkout, run the complete shared quality suite, publish `@lyds/ui` with `--access public`, and use npm Trusted Publishing/OIDC rather than a committed npm token.

Publishing must remain inert unless both conditions are true:

1. the user has explicitly approved publication; and
2. the GitHub repository variable `NPM_PUBLISH_ENABLED` is exactly `true`.

The publish job should have only the permissions it needs, including:

```yaml
permissions:
  contents: read
  id-token: write
```

Do not add npm credentials to the repository. The npm package owner must configure the GitHub repository/workflow as a trusted publisher before enabling the gate.

## Main-branch snapshots

A push to `main`, once publishing is enabled, maps to:

```text
<commit SHA> -> sha6 = first six hexadecimal characters
@lyds/ui@0.0.0-snapshot.<sha6>
npm dist-tag: snapshot
```

For example, `a1b2c3d4...` publishes `0.0.0-snapshot.a1b2c3` with `--tag snapshot`; it must not modify `latest`. The workflow must run all checks, derive the lowercase SHA dynamically, set the version only in CI, and avoid a git commit. Serialize concurrent main publications without `cancel-in-progress`, so one main commit is not silently discarded.

Snapshot reruns are idempotent only when artifact identity is proven: query npm for the exact snapshot version, compare its SHA-512 integrity with the verified local tarball, and skip only when they are identical. An integrity mismatch, an unavailable integrity value, or an indeterminate registry response must fail closed.

## Tagged production releases

A pushed valid SemVer tag beginning with `v` is the version source of truth:

```text
v1.2.3 -> @lyds/ui@1.2.3 -> npm dist-tag latest
v2.0.0-beta.1 -> @lyds/ui@2.0.0-beta.1 -> npm dist-tag beta
```

Before publishing, validate SemVer, verify the tagged commit is reachable from `main`, run the full suite from that clean tagged checkout, and query npm for the exact version. If the production/prerelease version already exists, fail explicitly; unlike snapshots, tagged duplicates must never be silently skipped.

Stable versions publish with the default production `latest` tag. Prereleases publish with an npm-safe channel derived from the first prerelease identifier (`beta` in the example) and must not move `latest`. Set the tag-derived package version only in the CI workspace, create no release commit, and publish through OIDC.

## Verification is not publication

Safe preparation includes:

```sh
pnpm check
pnpm pack:check
```

Inspecting a tarball or using a non-publishing dry run does not authorize `npm publish`. Do not manually publish snapshots or tag releases, enable `NPM_PUBLISH_ENABLED`, create release tags, or alter npm dist-tags without explicit user authorization.

Before publication, verify that the installed Base UI release contains upstream fix [#5058](https://github.com/mui/base-ui/pull/5058) for nested-menu portal ownership. The repository may temporarily patch Base UI 1.7.0 so Storybook can validate the merged fix, but a pnpm workspace patch does not propagate through the `@lyds/ui` npm tarball to consumers. Remove the temporary patch only after upgrading to an official fixed release, then rerun submenu open-state axe, Arrow keys, Tab/Shift+Tab, Escape, return-focus, and Safari VoiceOver checks against an isolated packed consumer. Treat this as a publication blocker, not a rule to disable or work around in consumer DOM.
