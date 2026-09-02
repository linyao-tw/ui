#!/usr/bin/env node

import { execFile as execFileCallback } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFile, readFile, stat, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs, promisify } from "node:util";
import { gunzipSync } from "node:zlib";

const execFile = promisify(execFileCallback);

export const PACKAGE_NAME = "@linyao.tw/ui";
export const NPM_REGISTRY = "https://registry.npmjs.org/";
export const MINIMUM_TRUSTED_PUBLISHING_NPM_VERSION = "11.5.1";

const SNAPSHOT_VERSION_PATTERN = /^0\.0\.0-snapshot\.([0-9a-f]{6})$/;
const FULL_SHA_PATTERN = /^[0-9a-f]{40}$/;
const SRI_PATTERN = /^sha512-[A-Za-z0-9+/]+={0,2}$/;
const TAR_BLOCK_SIZE = 512;
const MAX_TARBALL_BYTES = 128 * 1024 * 1024;
const MAX_UNPACKED_TARBALL_BYTES = 512 * 1024 * 1024;
const MAX_PACKAGE_MANIFEST_BYTES = 1024 * 1024;
const DIRECT_PRERELEASE_TAGS = new Set(["alpha", "beta", "rc", "next", "canary", "dev"]);
const SEMVER_PATTERN =
	/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;

export class ReleaseError extends Error {
	constructor(message, details = undefined) {
		super(message, { cause: details });
		this.name = "ReleaseError";
	}
}

function assertNonEmptyString(value, label) {
	if (typeof value !== "string" || value.length === 0) {
		throw new ReleaseError(`${label} must be a non-empty string`);
	}

	return value;
}

export function assertCanonicalVersion(version, label = "version") {
	assertNonEmptyString(version, label);
	const match = SEMVER_PATTERN.exec(version);
	if (match === null || match[5] !== undefined || [match[1], match[2], match[3]].some(identifier => Number(identifier) > Number.MAX_SAFE_INTEGER)) {
		throw new ReleaseError(`${label} must be canonical SemVer; received ${JSON.stringify(version)}`);
	}

	return version;
}

function parseCanonicalVersion(version, label = "version") {
	assertCanonicalVersion(version, label);
	const match = SEMVER_PATTERN.exec(version);
	return {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3]),
		prerelease: match[4] === undefined ? [] : match[4].split(".")
	};
}

function compareIdentifiers(left, right) {
	const leftNumeric = /^\d+$/.test(left);
	const rightNumeric = /^\d+$/.test(right);
	if (leftNumeric && rightNumeric) {
		const leftNumber = BigInt(left);
		const rightNumber = BigInt(right);
		return leftNumber < rightNumber ? -1 : leftNumber > rightNumber ? 1 : 0;
	}
	if (leftNumeric !== rightNumeric) {
		return leftNumeric ? -1 : 1;
	}
	return left < right ? -1 : left > right ? 1 : 0;
}

export function compareVersions(leftVersion, rightVersion) {
	const left = parseCanonicalVersion(leftVersion, "left version");
	const right = parseCanonicalVersion(rightVersion, "right version");
	for (const key of ["major", "minor", "patch"]) {
		if (left[key] !== right[key]) {
			return left[key] < right[key] ? -1 : 1;
		}
	}

	if (left.prerelease.length === 0 || right.prerelease.length === 0) {
		return left.prerelease.length === right.prerelease.length ? 0 : left.prerelease.length === 0 ? 1 : -1;
	}

	for (let index = 0; index < Math.max(left.prerelease.length, right.prerelease.length); index += 1) {
		if (left.prerelease[index] === undefined || right.prerelease[index] === undefined) {
			return left.prerelease[index] === undefined ? -1 : 1;
		}
		const comparison = compareIdentifiers(left.prerelease[index], right.prerelease[index]);
		if (comparison !== 0) {
			return comparison;
		}
	}

	return 0;
}

export function assertFullCommitSha(sha) {
	if (!FULL_SHA_PATTERN.test(sha)) {
		throw new ReleaseError("commit SHA must contain exactly 40 lowercase hexadecimal characters");
	}

	return sha;
}

export function distTagForVersion(version) {
	const { prerelease } = parseCanonicalVersion(version);

	if (prerelease.length === 0) {
		return "latest";
	}

	const identifier = String(prerelease[0]);
	const tag = DIRECT_PRERELEASE_TAGS.has(identifier) ? identifier : `prerelease-${identifier}`;

	if (tag === "latest" || !/^[A-Za-z][0-9A-Za-z._-]*$/.test(tag)) {
		throw new ReleaseError(`derived prerelease dist-tag is unsafe: ${JSON.stringify(tag)}`);
	}

	return tag;
}

export function createReleasePlan({ eventName, ref, sha }) {
	assertFullCommitSha(sha);

	if (eventName !== "push") {
		throw new ReleaseError(`release workflow only accepts push events; received ${JSON.stringify(eventName)}`);
	}

	if (ref === "refs/heads/main") {
		const sha6 = sha.slice(0, 6);
		const version = `0.0.0-snapshot.${sha6}`;
		assertCanonicalVersion(version, "snapshot version");
		return Object.freeze({
			kind: "snapshot",
			version,
			distTag: "snapshot",
			sha,
			sha6
		});
	}

	if (ref.startsWith("refs/tags/")) {
		const tag = ref.slice("refs/tags/".length);
		if (!tag.startsWith("v")) {
			throw new ReleaseError(`production release tag must start with v; received ${JSON.stringify(tag)}`);
		}

		const version = tag.slice(1);
		assertCanonicalVersion(version, "release tag version");

		return Object.freeze({
			kind: "production",
			version,
			distTag: distTagForVersion(version),
			sha,
			tag
		});
	}

	throw new ReleaseError(`unsupported release ref: ${JSON.stringify(ref)}`);
}

export function validatePublicationIdentity({ packageName, kind, version, distTag }) {
	if (packageName !== PACKAGE_NAME) {
		throw new ReleaseError(`only ${PACKAGE_NAME} may be published; received ${JSON.stringify(packageName)}`);
	}

	if (kind === "snapshot") {
		assertCanonicalVersion(version, "snapshot version");
		if (!SNAPSHOT_VERSION_PATTERN.test(version)) {
			throw new ReleaseError(`snapshot version must match 0.0.0-snapshot.<sha6>; received ${JSON.stringify(version)}`);
		}

		if (distTag !== "snapshot") {
			throw new ReleaseError(`snapshot releases must use the snapshot dist-tag; received ${JSON.stringify(distTag)}`);
		}

		return;
	}

	if (kind === "production") {
		assertCanonicalVersion(version);
		const expectedTag = distTagForVersion(version);
		if (distTag !== expectedTag) {
			throw new ReleaseError(`production ${version} must use dist-tag ${expectedTag}; received ${JSON.stringify(distTag)}`);
		}

		return;
	}

	throw new ReleaseError(`release kind must be snapshot or production; received ${JSON.stringify(kind)}`);
}

export async function calculateIntegrity(tarballPath) {
	const tarball = await readFile(tarballPath);
	return `sha512-${createHash("sha512").update(tarball).digest("base64")}`;
}

function readTarString(buffer, start, length) {
	const end = buffer.indexOf(0, start);
	return buffer.toString("utf8", start, end === -1 || end > start + length ? start + length : end);
}

function readTarSize(buffer, offset) {
	const rawSize = readTarString(buffer, offset + 124, 12).trim();
	if (!/^[0-7]+$/.test(rawSize)) {
		throw new ReleaseError("release tarball contains an unsupported tar entry size");
	}

	const size = Number.parseInt(rawSize, 8);
	if (!Number.isSafeInteger(size) || size < 0) {
		throw new ReleaseError("release tarball contains an invalid tar entry size");
	}

	return size;
}

export async function readPackageManifestFromTarball(tarballPath) {
	const compressed = await readFile(tarballPath);
	if (compressed.byteLength > MAX_TARBALL_BYTES) {
		throw new ReleaseError("release tarball exceeds the validation size limit");
	}

	let archive;
	try {
		archive = gunzipSync(compressed, { maxOutputLength: MAX_UNPACKED_TARBALL_BYTES });
	} catch (error) {
		throw new ReleaseError("release tarball is not a valid bounded gzip archive", error);
	}

	for (let offset = 0; offset + TAR_BLOCK_SIZE <= archive.byteLength;) {
		const header = archive.subarray(offset, offset + TAR_BLOCK_SIZE);
		if (header.every(byte => byte === 0)) {
			break;
		}

		const name = readTarString(header, 0, 100);
		const prefix = readTarString(header, 345, 155);
		const path = prefix.length > 0 ? `${prefix}/${name}` : name;
		const size = readTarSize(header, 0);
		const contentStart = offset + TAR_BLOCK_SIZE;
		const contentEnd = contentStart + size;
		if (contentEnd > archive.byteLength) {
			throw new ReleaseError("release tarball contains a truncated tar entry");
		}

		if (path === "package/package.json") {
			if (size > MAX_PACKAGE_MANIFEST_BYTES) {
				throw new ReleaseError("release package manifest exceeds the validation size limit");
			}

			try {
				return JSON.parse(archive.toString("utf8", contentStart, contentEnd));
			} catch (error) {
				throw new ReleaseError("release package manifest is not valid JSON", error);
			}
		}

		offset = contentStart + Math.ceil(size / TAR_BLOCK_SIZE) * TAR_BLOCK_SIZE;
	}

	throw new ReleaseError("release tarball does not contain package/package.json");
}

export async function validateTarballIdentity({ tarballPath, packageName, version }) {
	const manifest = await readPackageManifestFromTarball(tarballPath);
	if (manifest === null || typeof manifest !== "object" || Array.isArray(manifest)) {
		throw new ReleaseError("release package manifest must be a JSON object");
	}

	if (manifest.name !== packageName || manifest.version !== version) {
		throw new ReleaseError(`release tarball identity mismatch; expected ${packageName}@${version}, found ${String(manifest.name)}@${String(manifest.version)}`);
	}

	return manifest;
}

function parseJsonOutput(result, label) {
	if (result.code !== 0) {
		throw new ReleaseError(`${label} failed closed: ${formatCommandFailure(result)}`);
	}

	try {
		return JSON.parse(result.stdout);
	} catch (error) {
		throw new ReleaseError(`${label} returned malformed JSON`, error);
	}
}

function validateVersionList(value) {
	if (!Array.isArray(value)) {
		throw new ReleaseError("npm view versions returned an invalid version array");
	}
	try {
		value.forEach(item => assertCanonicalVersion(item, "npm registry version"));
	} catch (error) {
		throw new ReleaseError("npm view versions returned an invalid version array", error);
	}

	return value;
}

function validateDistTags(value) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) {
		throw new ReleaseError("npm view dist-tags returned an invalid object");
	}

	for (const [tag, version] of Object.entries(value)) {
		try {
			if (tag.length === 0) {
				throw new ReleaseError("empty dist-tag");
			}
			assertCanonicalVersion(version, `npm dist-tag ${tag}`);
		} catch {
			throw new ReleaseError("npm view dist-tags returned an invalid object");
		}
	}

	return value;
}

function validateRegistryIntegrity(value) {
	if (typeof value !== "string" || !SRI_PATTERN.test(value)) {
		throw new ReleaseError("npm view dist.integrity returned an invalid sha512 SRI value");
	}

	return value;
}

function npmViewArgs(specifier, field) {
	return ["view", specifier, field, "--json", `--registry=${NPM_REGISTRY}`];
}

export async function inspectRegistry({ packageName, kind, version, distTag, runCommand = runExternalCommand }) {
	validatePublicationIdentity({ packageName, kind, version, distTag });

	const versionsResult = await runCommand("npm", npmViewArgs(packageName, "versions"));
	let versions;

	try {
		versions = validateVersionList(parseJsonOutput(versionsResult, "npm view versions"));
	} catch (error) {
		return Object.freeze({ state: "error", error });
	}

	if (versions.includes(version)) {
		if (kind === "production") {
			return Object.freeze({ state: "present" });
		}

		const integrityResult = await runCommand("npm", npmViewArgs(`${packageName}@${version}`, "dist.integrity"));
		try {
			const integrity = validateRegistryIntegrity(parseJsonOutput(integrityResult, "npm view dist.integrity"));
			return Object.freeze({ state: "present", integrity });
		} catch (error) {
			return Object.freeze({ state: "error", error });
		}
	}

	const tagsResult = await runCommand("npm", npmViewArgs(packageName, "dist-tags"));
	try {
		const distTags = validateDistTags(parseJsonOutput(tagsResult, "npm view dist-tags"));
		return Object.freeze({ state: "absent", tagVersion: Object.hasOwn(distTags, distTag) ? distTags[distTag] : undefined });
	} catch (error) {
		return Object.freeze({ state: "error", error });
	}
}

export function decidePublication({ kind, version, distTag, localIntegrity, registry }) {
	validatePublicationIdentity({ packageName: PACKAGE_NAME, kind, version, distTag });
	if (!SRI_PATTERN.test(localIntegrity)) {
		throw new ReleaseError("local tarball integrity must be a sha512 SRI value");
	}

	if (registry.state === "error") {
		throw new ReleaseError("npm registry state is indeterminate; refusing to publish", registry.error);
	}

	if (registry.state === "absent") {
		if (kind === "production" && registry.tagVersion !== undefined) {
			assertCanonicalVersion(registry.tagVersion, `current ${distTag} dist-tag version`);
			if (compareVersions(version, registry.tagVersion) <= 0) {
				throw new ReleaseError(`refusing to move the ${distTag} dist-tag backward from ${registry.tagVersion} to ${version}`);
			}
		}

		return "publish";
	}

	if (registry.state !== "present") {
		throw new ReleaseError("npm registry inspection returned an unknown state");
	}

	if (kind === "production") {
		throw new ReleaseError(`${PACKAGE_NAME}@${version} already exists; duplicate production releases are forbidden`);
	}

	if (registry.integrity !== localIntegrity) {
		throw new ReleaseError(`${PACKAGE_NAME}@${version} exists with different tarball integrity`);
	}

	return "skip";
}

export async function assertSnapshotChannelAdvance({ version, currentTagVersion, runCommand = runExternalCommand }) {
	if (currentTagVersion === undefined) {
		return;
	}

	const nextMatch = SNAPSHOT_VERSION_PATTERN.exec(version);
	const currentMatch = SNAPSHOT_VERSION_PATTERN.exec(currentTagVersion);
	if (nextMatch === null || currentMatch === null) {
		throw new ReleaseError(`current snapshot dist-tag has an unexpected version: ${JSON.stringify(currentTagVersion)}`);
	}

	const result = await runCommand("git", ["merge-base", "--is-ancestor", currentMatch[1], nextMatch[1]]);
	if (result.code === 0) {
		return;
	}

	if (result.code === 1) {
		throw new ReleaseError(`refusing to move the snapshot dist-tag from ${currentTagVersion} to an older or unrelated commit ${version}`);
	}

	throw new ReleaseError(`could not verify snapshot commit ancestry: ${formatCommandFailure(result)}`);
}

export function formatCommandFailure(result) {
	const status = result.signal === undefined ? `exit ${String(result.code)}` : `signal ${result.signal}`;
	const stderr = typeof result.stderr === "string" ? result.stderr.trim() : "";
	return stderr.length > 0 ? `${status}: ${stderr}` : status;
}

export async function runExternalCommand(command, args, options = {}) {
	try {
		const { stdout, stderr } = await execFile(command, args, {
			encoding: "utf8",
			maxBuffer: 4 * 1024 * 1024,
			timeout: 60_000,
			...options
		});
		return { code: 0, stdout, stderr };
	} catch (error) {
		return {
			code: typeof error.code === "number" ? error.code : 1,
			signal: error.signal ?? undefined,
			stdout: typeof error.stdout === "string" ? error.stdout : "",
			stderr: typeof error.stderr === "string" ? error.stderr : error.message
		};
	}
}

async function assertTrustedPublishingNpmVersion(runCommand) {
	const result = await runCommand("npm", ["--version"]);
	if (result.code !== 0) {
		throw new ReleaseError(`could not determine npm version: ${formatCommandFailure(result)}`);
	}

	const version = result.stdout.trim();
	assertCanonicalVersion(version, "npm version");
	if (compareVersions(version, MINIMUM_TRUSTED_PUBLISHING_NPM_VERSION) < 0) {
		throw new ReleaseError(`npm ${MINIMUM_TRUSTED_PUBLISHING_NPM_VERSION} or newer is required for trusted publishing; found ${version}`);
	}
}

export async function executePublication({ packageName, kind, version, distTag, tarballPath, expectedIntegrity = undefined, dryRun = false, runCommand = runExternalCommand }) {
	validatePublicationIdentity({ packageName, kind, version, distTag });
	const absoluteTarballPath = resolve(tarballPath);
	const tarballStat = await stat(absoluteTarballPath).catch(error => {
		throw new ReleaseError(`could not inspect release tarball ${absoluteTarballPath}`, error);
	});

	if (!tarballStat.isFile() || !absoluteTarballPath.endsWith(".tgz")) {
		throw new ReleaseError("release tarball must be an existing .tgz file");
	}

	await validateTarballIdentity({ tarballPath: absoluteTarballPath, packageName, version });
	const localIntegrity = await calculateIntegrity(absoluteTarballPath);
	if (expectedIntegrity !== undefined && expectedIntegrity !== localIntegrity) {
		throw new ReleaseError(`downloaded release tarball integrity mismatch; expected ${expectedIntegrity}, calculated ${localIntegrity}`);
	}

	if (dryRun) {
		return Object.freeze({ status: "dry-run", localIntegrity, tarballPath: absoluteTarballPath });
	}

	await assertTrustedPublishingNpmVersion(runCommand);
	const registry = await inspectRegistry({ packageName, kind, version, distTag, runCommand });
	const decision = decidePublication({ kind, version, distTag, localIntegrity, registry });

	if (decision === "skip") {
		return Object.freeze({ status: "skipped", localIntegrity, tarballPath: absoluteTarballPath });
	}

	if (kind === "snapshot") {
		await assertSnapshotChannelAdvance({ version, currentTagVersion: registry.tagVersion, runCommand });
	}

	const publishResult = await runCommand("npm", ["publish", absoluteTarballPath, "--access", "public", "--tag", distTag, `--registry=${NPM_REGISTRY}`]);
	if (publishResult.code === 0) {
		return Object.freeze({ status: "published", localIntegrity, tarballPath: absoluteTarballPath });
	}

	if (kind === "production") {
		throw new ReleaseError(`npm publish failed: ${formatCommandFailure(publishResult)}`);
	}

	const racedRegistry = await inspectRegistry({ packageName, kind, version, distTag, runCommand });
	let racedDecision;

	try {
		racedDecision = decidePublication({ kind, version, distTag, localIntegrity, registry: racedRegistry });
	} catch (error) {
		throw new ReleaseError(`snapshot publish failed and registry reconciliation was not exact: ${formatCommandFailure(publishResult)}`, error);
	}

	if (racedDecision !== "skip") {
		throw new ReleaseError(`snapshot publish failed without a matching concurrent publication: ${formatCommandFailure(publishResult)}`);
	}

	return Object.freeze({ status: "reconciled", localIntegrity, tarballPath: absoluteTarballPath });
}

export async function setPackageVersion({ packageJsonPath, version }) {
	assertCanonicalVersion(version);
	const absolutePath = resolve(packageJsonPath);
	const source = await readFile(absolutePath, "utf8");
	let packageJson;

	try {
		packageJson = JSON.parse(source);
	} catch (error) {
		throw new ReleaseError(`${absolutePath} is not valid JSON`, error);
	}

	if (packageJson.name !== PACKAGE_NAME) {
		throw new ReleaseError(`refusing to version ${JSON.stringify(packageJson.name)}; expected ${PACKAGE_NAME}`);
	}

	packageJson.version = version;
	await writeFile(absolutePath, `${JSON.stringify(packageJson, null, "\t")}\n`, "utf8");
}

function parseCliOptions(args, options) {
	return parseArgs({ args, options, strict: true, allowPositionals: false }).values;
}

function requireOption(values, name) {
	return assertNonEmptyString(values[name], `--${name}`);
}

async function writeOutputs(outputPath, values) {
	if (outputPath === undefined) {
		return;
	}

	for (const [key, value] of Object.entries(values)) {
		const serialized = String(value);
		if (!/^[a-z][a-z0-9_]*$/.test(key) || serialized.includes("\n") || serialized.includes("\r")) {
			throw new ReleaseError("refusing to write an unsafe GitHub Actions output");
		}
		await appendFile(outputPath, `${key}=${serialized}\n`, "utf8");
	}
}

async function runCli(argv) {
	const [command, ...args] = argv;

	if (command === "plan") {
		const values = parseCliOptions(args, {
			event: { type: "string" },
			ref: { type: "string" },
			sha: { type: "string" },
			output: { type: "string" }
		});
		const plan = createReleasePlan({ eventName: requireOption(values, "event"), ref: requireOption(values, "ref"), sha: requireOption(values, "sha") });
		await writeOutputs(values.output, {
			kind: plan.kind,
			version: plan.version,
			dist_tag: plan.distTag,
			sha6: plan.sha6 ?? ""
		});
		process.stdout.write(`${JSON.stringify(plan)}\n`);
		return;
	}

	if (command === "set-version") {
		const values = parseCliOptions(args, {
			file: { type: "string" },
			version: { type: "string" }
		});
		await setPackageVersion({ packageJsonPath: requireOption(values, "file"), version: requireOption(values, "version") });
		process.stdout.write(`Set ${PACKAGE_NAME} workspace version to ${values.version}\n`);
		return;
	}

	if (command === "publish") {
		const values = parseCliOptions(args, {
			kind: { type: "string" },
			version: { type: "string" },
			"dist-tag": { type: "string" },
			tarball: { type: "string" },
			"expected-integrity": { type: "string" },
			"dry-run": { type: "boolean", default: false },
			output: { type: "string" }
		});
		const result = await executePublication({
			packageName: PACKAGE_NAME,
			kind: requireOption(values, "kind"),
			version: requireOption(values, "version"),
			distTag: requireOption(values, "dist-tag"),
			tarballPath: requireOption(values, "tarball"),
			expectedIntegrity: values["expected-integrity"],
			dryRun: values["dry-run"]
		});
		await writeOutputs(values.output, { status: result.status, integrity: result.localIntegrity, tarball: basename(result.tarballPath) });
		if (result.status === "skipped") {
			process.stdout.write(`${PACKAGE_NAME}@${values.version} already exists with identical integrity; safely skipping this snapshot.\n`);
		}
		process.stdout.write(`${JSON.stringify(result)}\n`);
		return;
	}

	throw new ReleaseError(`unknown release command: ${JSON.stringify(command)}`);
}

const isEntrypoint = process.argv[1] !== undefined && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isEntrypoint) {
	runCli(process.argv.slice(2)).catch(error => {
		const cause = error.cause instanceof Error ? `\nCaused by: ${error.cause.message}` : "";
		process.stderr.write(`Release error: ${error.message}${cause}\n`);
		process.exitCode = 1;
	});
}
