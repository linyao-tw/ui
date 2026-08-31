import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { gzipSync } from "node:zlib";
import {
	MINIMUM_TRUSTED_PUBLISHING_NPM_VERSION,
	NPM_REGISTRY,
	PACKAGE_NAME,
	ReleaseError,
	assertSnapshotChannelAdvance,
	calculateIntegrity,
	compareVersions,
	createReleasePlan,
	decidePublication,
	distTagForVersion,
	executePublication,
	inspectRegistry,
	readPackageManifestFromTarball,
	setPackageVersion,
	validatePublicationIdentity,
	validateTarballIdentity
} from "./release.mjs";

const SHA = "a1b2c3d4e5f678901234567890abcdef12345678";
const SNAPSHOT_VERSION = "0.0.0-snapshot.a1b2c3";
const INTEGRITY = `sha512-${Buffer.alloc(64).toString("base64")}`;

function result(stdout = "", code = 0, stderr = "") {
	return { code, stdout, stderr };
}

function jsonResult(value) {
	return result(JSON.stringify(value));
}

function mockRegistry(commands, responses) {
	return async (command, args) => {
		commands.push({ command, args });
		const response = responses.shift();
		assert.ok(response, `unexpected command: ${command} ${args.join(" ")}`);
		return response;
	};
}

function createPackageTarball({ name = PACKAGE_NAME, version = SNAPSHOT_VERSION } = {}) {
	const content = Buffer.from(JSON.stringify({ name, version, type: "module" }));
	const header = Buffer.alloc(512);
	header.write("package/package.json", 0, "utf8");
	header.write("0000644\0", 100, "ascii");
	header.write("0000000\0", 108, "ascii");
	header.write("0000000\0", 116, "ascii");
	header.write(`${content.byteLength.toString(8).padStart(11, "0")}\0`, 124, "ascii");
	header.write("00000000000\0", 136, "ascii");
	header.fill(0x20, 148, 156);
	header.write("0", 156, "ascii");
	header.write("ustar\0", 257, "ascii");
	header.write("00", 263, "ascii");
	const checksum = [...header].reduce((total, byte) => total + byte, 0);
	header.write(`${checksum.toString(8).padStart(6, "0")}\0 `, 148, "ascii");
	const padding = Buffer.alloc(Math.ceil(content.byteLength / 512) * 512 - content.byteLength);
	return gzipSync(Buffer.concat([header, content, padding, Buffer.alloc(1024)]));
}

async function withTarball(callback, identity = undefined) {
	const directory = await mkdtemp(join(tmpdir(), "lyds-release-test-"));
	const tarballPath = join(directory, "lyds-ui-test.tgz");
	await writeFile(tarballPath, createPackageTarball(identity));

	try {
		return await callback(tarballPath);
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
}

test("creates a deterministic main snapshot plan from a full lowercase SHA", () => {
	assert.deepEqual(createReleasePlan({ eventName: "push", ref: "refs/heads/main", sha: SHA }), {
		kind: "snapshot",
		version: SNAPSHOT_VERSION,
		distTag: "snapshot",
		sha: SHA,
		sha6: "a1b2c3"
	});
});

test("rejects abbreviated, uppercase, non-push, and non-main branch plans", () => {
	assert.throws(() => createReleasePlan({ eventName: "push", ref: "refs/heads/main", sha: "a1b2c3" }), ReleaseError);
	assert.throws(() => createReleasePlan({ eventName: "push", ref: "refs/heads/main", sha: SHA.toUpperCase() }), ReleaseError);
	assert.throws(() => createReleasePlan({ eventName: "push", ref: "refs/heads/main", sha: "0123456789abcdef0123456789abcdef01234567" }), /canonical SemVer/);
	assert.throws(() => createReleasePlan({ eventName: "workflow_dispatch", ref: "refs/heads/main", sha: SHA }), ReleaseError);
	assert.throws(() => createReleasePlan({ eventName: "push", ref: "refs/heads/feature", sha: SHA }), ReleaseError);
});

test("creates stable and approved prerelease production plans", () => {
	assert.deepEqual(createReleasePlan({ eventName: "push", ref: "refs/tags/v1.2.3", sha: SHA }), {
		kind: "production",
		version: "1.2.3",
		distTag: "latest",
		sha: SHA,
		tag: "v1.2.3"
	});
	assert.equal(createReleasePlan({ eventName: "push", ref: "refs/tags/v2.0.0-beta.1", sha: SHA }).distTag, "beta");
	assert.equal(createReleasePlan({ eventName: "push", ref: "refs/tags/v2.0.0-rc.1", sha: SHA }).distTag, "rc");
	assert.equal(createReleasePlan({ eventName: "push", ref: "refs/tags/v2.0.0-preview.1", sha: SHA }).distTag, "prerelease-preview");
});

test("rejects noncanonical release tags", () => {
	for (const ref of ["refs/tags/1.2.3", "refs/tags/v01.2.3", "refs/tags/v1.2", "refs/tags/v1.2.3.4", "refs/tags/vlatest", "refs/tags/v1.2.3-beta.01", "refs/tags/v1.2.3+build.1"]) {
		assert.throws(() => createReleasePlan({ eventName: "push", ref, sha: SHA }), ReleaseError);
	}
});

test("never derives latest or a SemVer range for prereleases", () => {
	for (const version of ["1.0.0-alpha.1", "1.0.0-beta.1", "1.0.0-rc.1", "1.0.0-next.1", "1.0.0-canary.1", "1.0.0-dev.1", "1.0.0-1", "1.0.0-preview.1"]) {
		const tag = distTagForVersion(version);
		assert.notEqual(tag, "latest");
		assert.match(tag, /^(?:alpha|beta|rc|next|canary|dev|prerelease-)/);
	}
});

test("compares canonical SemVer precedence", () => {
	assert.equal(compareVersions("1.2.3", "1.2.2"), 1);
	assert.equal(compareVersions("1.2.3-beta.2", "1.2.3-beta.11"), -1);
	assert.equal(compareVersions("1.2.3-beta.999999999999999999999", "1.2.3-beta.2"), 1);
	assert.equal(compareVersions("1.2.3", "1.2.3-rc.1"), 1);
});

test("validates the package, snapshot shape, and production dist-tag", () => {
	assert.doesNotThrow(() => validatePublicationIdentity({ packageName: PACKAGE_NAME, kind: "snapshot", version: SNAPSHOT_VERSION, distTag: "snapshot" }));
	assert.doesNotThrow(() => validatePublicationIdentity({ packageName: PACKAGE_NAME, kind: "production", version: "2.0.0-beta.1", distTag: "beta" }));
	assert.throws(() => validatePublicationIdentity({ packageName: "other", kind: "snapshot", version: SNAPSHOT_VERSION, distTag: "snapshot" }), ReleaseError);
	assert.throws(() => validatePublicationIdentity({ packageName: PACKAGE_NAME, kind: "snapshot", version: "0.0.0-snapshot.A1B2C3", distTag: "snapshot" }), ReleaseError);
	assert.throws(() => validatePublicationIdentity({ packageName: PACKAGE_NAME, kind: "production", version: "2.0.0-beta.1", distTag: "latest" }), ReleaseError);
});

test("reads and verifies the embedded identity of the exact release tarball", async () => {
	await withTarball(async tarballPath => {
		assert.deepEqual(await readPackageManifestFromTarball(tarballPath), { name: PACKAGE_NAME, version: SNAPSHOT_VERSION, type: "module" });
		await assert.doesNotReject(validateTarballIdentity({ tarballPath, packageName: PACKAGE_NAME, version: SNAPSHOT_VERSION }));
		await assert.rejects(validateTarballIdentity({ tarballPath, packageName: PACKAGE_NAME, version: "0.0.0-snapshot.abcdef" }), /identity mismatch/);
	});

	await withTarball(
		async tarballPath => {
			await assert.rejects(validateTarballIdentity({ tarballPath, packageName: PACKAGE_NAME, version: SNAPSHOT_VERSION }), /identity mismatch/);
		},
		{ name: "@not-lyds/ui" }
	);

	const directory = await mkdtemp(join(tmpdir(), "lyds-invalid-tarball-test-"));
	const tarballPath = join(directory, "invalid.tgz");
	await writeFile(tarballPath, "not a tarball");
	try {
		await assert.rejects(readPackageManifestFromTarball(tarballPath), /valid bounded gzip archive/);
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});

test("classifies a missing exact version as absent from a valid version array", async () => {
	const commands = [];
	const registry = await inspectRegistry({
		packageName: PACKAGE_NAME,
		kind: "snapshot",
		version: SNAPSHOT_VERSION,
		distTag: "snapshot",
		runCommand: mockRegistry(commands, [jsonResult(["0.0.0-snapshot.abcdef"]), jsonResult({})])
	});

	assert.deepEqual(registry, { state: "absent", tagVersion: undefined });
	assert.equal(commands.length, 2);
	assert.deepEqual(commands[0].args, ["view", PACKAGE_NAME, "versions", "--json", `--registry=${NPM_REGISTRY}`]);
});

test("fails closed for registry E404, authentication, network, and malformed responses", async t => {
	for (const [name, response] of [
		["E404", result("", 1, "npm error E404")],
		["authentication", result("", 1, "npm error E401")],
		["network", result("", 1, "npm error ECONNRESET")],
		["malformed JSON", result("not json")],
		["non-array JSON", jsonResult({ version: SNAPSHOT_VERSION })],
		["noncanonical version array", jsonResult(["v1.0.0"])]
	]) {
		await t.test(name, async () => {
			const registry = await inspectRegistry({ packageName: PACKAGE_NAME, kind: "snapshot", version: SNAPSHOT_VERSION, distTag: "snapshot", runCommand: mockRegistry([], [response]) });
			assert.equal(registry.state, "error");
			assert.throws(() => decidePublication({ kind: "snapshot", version: SNAPSHOT_VERSION, distTag: "snapshot", localIntegrity: INTEGRITY, registry }), ReleaseError);
		});
	}
});

test("reads snapshot integrity after exact version existence", async () => {
	const commands = [];
	const registry = await inspectRegistry({
		packageName: PACKAGE_NAME,
		kind: "snapshot",
		version: SNAPSHOT_VERSION,
		distTag: "snapshot",
		runCommand: mockRegistry(commands, [jsonResult([SNAPSHOT_VERSION]), jsonResult(INTEGRITY)])
	});

	assert.deepEqual(registry, { state: "present", integrity: INTEGRITY });
	assert.equal(commands.length, 2);
});

test("marks invalid snapshot detail responses indeterminate", async t => {
	for (const [name, responses] of [
		["integrity command failure", [jsonResult([SNAPSHOT_VERSION]), result("", 1, "timeout")]],
		["bad integrity", [jsonResult([SNAPSHOT_VERSION]), jsonResult("sha1-bad")]],
		["bad tags for an absent version", [jsonResult([]), jsonResult([])]]
	]) {
		await t.test(name, async () => {
			const registry = await inspectRegistry({ packageName: PACKAGE_NAME, kind: "snapshot", version: SNAPSHOT_VERSION, distTag: "snapshot", runCommand: mockRegistry([], responses) });
			assert.equal(registry.state, "error");
		});
	}
});

test("skips an existing snapshot when its immutable tarball integrity matches", () => {
	assert.equal(
		decidePublication({
			kind: "snapshot",
			version: SNAPSHOT_VERSION,
			distTag: "snapshot",
			localIntegrity: INTEGRITY,
			registry: { state: "present", integrity: INTEGRITY }
		}),
		"skip"
	);
	assert.throws(
		() =>
			decidePublication({
				kind: "snapshot",
				version: SNAPSHOT_VERSION,
				distTag: "snapshot",
				localIntegrity: INTEGRITY,
				registry: { state: "present", integrity: `sha512-${Buffer.alloc(64, 1).toString("base64")}` }
			}),
		/different tarball integrity/
	);
});

test("publishes absent versions and rejects every duplicate production version", () => {
	assert.equal(decidePublication({ kind: "snapshot", version: SNAPSHOT_VERSION, distTag: "snapshot", localIntegrity: INTEGRITY, registry: { state: "absent" } }), "publish");
	assert.equal(decidePublication({ kind: "production", version: "1.2.3", distTag: "latest", localIntegrity: INTEGRITY, registry: { state: "absent" } }), "publish");
	assert.equal(decidePublication({ kind: "production", version: "1.2.3", distTag: "latest", localIntegrity: INTEGRITY, registry: { state: "absent", tagVersion: "1.2.2" } }), "publish");
	assert.throws(
		() => decidePublication({ kind: "production", version: "1.2.3", distTag: "latest", localIntegrity: INTEGRITY, registry: { state: "absent", tagVersion: "1.2.4" } }),
		/dist-tag backward/
	);
	assert.throws(() => decidePublication({ kind: "production", version: "1.2.3", distTag: "latest", localIntegrity: INTEGRITY, registry: { state: "present" } }), /duplicate production/);
});

test("allows only descendant snapshot commits to advance the channel", async () => {
	const commands = [];
	await assertSnapshotChannelAdvance({
		version: SNAPSHOT_VERSION,
		currentTagVersion: "0.0.0-snapshot.abcdef",
		runCommand: mockRegistry(commands, [result("", 0)])
	});
	assert.deepEqual(commands[0], { command: "git", args: ["merge-base", "--is-ancestor", "abcdef", "a1b2c3"] });
	await assert.rejects(
		assertSnapshotChannelAdvance({ version: SNAPSHOT_VERSION, currentTagVersion: "0.0.0-snapshot.abcdef", runCommand: mockRegistry([], [result("", 1)]) }),
		/older or unrelated commit/
	);
	await assert.rejects(
		assertSnapshotChannelAdvance({ version: SNAPSHOT_VERSION, currentTagVersion: "0.0.0-snapshot.abcdef", runCommand: mockRegistry([], [result("", 128, "ambiguous")]) }),
		/could not verify snapshot commit ancestry/
	);
});

test("dry-run validates and hashes the tarball without invoking npm", async () => {
	await withTarball(async tarballPath => {
		let calls = 0;
		const release = await executePublication({
			packageName: PACKAGE_NAME,
			kind: "snapshot",
			version: SNAPSHOT_VERSION,
			distTag: "snapshot",
			tarballPath,
			dryRun: true,
			runCommand: async () => {
				calls += 1;
				throw new Error("dry-run must not invoke npm");
			}
		});

		assert.equal(release.status, "dry-run");
		assert.equal(release.localIntegrity, await calculateIntegrity(tarballPath));
		assert.equal(calls, 0);
	});
});

test("publishes the same tarball that was hashed with public access and the planned tag", async () => {
	await withTarball(async tarballPath => {
		const commands = [];
		const release = await executePublication({
			packageName: PACKAGE_NAME,
			kind: "snapshot",
			version: SNAPSHOT_VERSION,
			distTag: "snapshot",
			tarballPath,
			runCommand: mockRegistry(commands, [result(`${MINIMUM_TRUSTED_PUBLISHING_NPM_VERSION}\n`), jsonResult([]), jsonResult({}), result("published")])
		});

		assert.equal(release.status, "published");
		assert.deepEqual(commands.at(-1), {
			command: "npm",
			args: ["publish", tarballPath, "--access", "public", "--tag", "snapshot", `--registry=${NPM_REGISTRY}`]
		});
	});
});

test("rejects a downloaded artifact when its SHA-512 differs from preflight", async () => {
	await withTarball(async tarballPath => {
		let calls = 0;
		await assert.rejects(
			executePublication({
				packageName: PACKAGE_NAME,
				kind: "snapshot",
				version: SNAPSHOT_VERSION,
				distTag: "snapshot",
				tarballPath,
				expectedIntegrity: INTEGRITY,
				runCommand: async () => {
					calls += 1;
					return result();
				}
			}),
			/integrity mismatch/
		);
		assert.equal(calls, 0);
	});
});

test("skips an already exact snapshot without invoking npm publish", async () => {
	await withTarball(async tarballPath => {
		const integrity = await calculateIntegrity(tarballPath);
		const commands = [];
		const release = await executePublication({
			packageName: PACKAGE_NAME,
			kind: "snapshot",
			version: SNAPSHOT_VERSION,
			distTag: "snapshot",
			tarballPath,
			runCommand: mockRegistry(commands, [result(`${MINIMUM_TRUSTED_PUBLISHING_NPM_VERSION}\n`), jsonResult([SNAPSHOT_VERSION]), jsonResult(integrity)])
		});

		assert.equal(release.status, "skipped");
		assert.equal(
			commands.some(command => command.args[0] === "publish"),
			false
		);
	});
});

test("fails a duplicate production release before invoking npm publish", async () => {
	await withTarball(
		async tarballPath => {
			const commands = [];
			await assert.rejects(
				executePublication({
					packageName: PACKAGE_NAME,
					kind: "production",
					version: "1.2.3",
					distTag: "latest",
					tarballPath,
					runCommand: mockRegistry(commands, [result(`${MINIMUM_TRUSTED_PUBLISHING_NPM_VERSION}\n`), jsonResult(["1.2.3"])])
				}),
				/duplicate production/
			);
			assert.equal(
				commands.some(command => command.args[0] === "publish"),
				false
			);
		},
		{ version: "1.2.3" }
	);
});

test("reconciles a failed snapshot publish only after exact integrity agreement", async () => {
	await withTarball(async tarballPath => {
		const integrity = await calculateIntegrity(tarballPath);
		const commands = [];
		const release = await executePublication({
			packageName: PACKAGE_NAME,
			kind: "snapshot",
			version: SNAPSHOT_VERSION,
			distTag: "snapshot",
			tarballPath,
			runCommand: mockRegistry(commands, [
				result(`${MINIMUM_TRUSTED_PUBLISHING_NPM_VERSION}\n`),
				jsonResult([]),
				jsonResult({}),
				result("", 1, "EPUBLISHCONFLICT"),
				jsonResult([SNAPSHOT_VERSION]),
				jsonResult(integrity)
			])
		});

		assert.equal(release.status, "reconciled");
		assert.equal(commands.filter(command => command.args[0] === "publish").length, 1);
	});
});

test("does not swallow failed snapshot publication without exact reconciliation", async () => {
	await withTarball(async tarballPath => {
		await assert.rejects(
			executePublication({
				packageName: PACKAGE_NAME,
				kind: "snapshot",
				version: SNAPSHOT_VERSION,
				distTag: "snapshot",
				tarballPath,
				runCommand: mockRegistry([], [result(`${MINIMUM_TRUSTED_PUBLISHING_NPM_VERSION}\n`), jsonResult([]), jsonResult({}), result("", 1, "EPUBLISHCONFLICT"), jsonResult([]), jsonResult({})])
			}),
			/matching concurrent publication/
		);
	});
});

test("never reconciles a production publish failure", async () => {
	await withTarball(
		async tarballPath => {
			const commands = [];
			await assert.rejects(
				executePublication({
					packageName: PACKAGE_NAME,
					kind: "production",
					version: "1.2.3",
					distTag: "latest",
					tarballPath,
					runCommand: mockRegistry(commands, [result(`${MINIMUM_TRUSTED_PUBLISHING_NPM_VERSION}\n`), jsonResult([]), jsonResult({}), result("", 1, "EPUBLISHCONFLICT")])
				}),
				/npm publish failed/
			);
			assert.equal(commands.length, 4);
		},
		{ version: "1.2.3" }
	);
});

test("rejects npm versions too old for trusted publishing before registry access", async () => {
	await withTarball(async tarballPath => {
		const commands = [];
		await assert.rejects(
			executePublication({ packageName: PACKAGE_NAME, kind: "snapshot", version: SNAPSHOT_VERSION, distTag: "snapshot", tarballPath, runCommand: mockRegistry(commands, [result("11.5.0\n")]) }),
			/trusted publishing/
		);
		assert.equal(commands.length, 1);
	});
});

test("sets only the intended package version in a temporary CI workspace", async () => {
	const directory = await mkdtemp(join(tmpdir(), "lyds-version-test-"));
	const packageJsonPath = join(directory, "package.json");
	await writeFile(packageJsonPath, JSON.stringify({ name: PACKAGE_NAME, version: "0.0.0", private: false, exports: { ".": "./dist/index.js" } }));

	try {
		await setPackageVersion({ packageJsonPath, version: "1.2.3-beta.1" });
		assert.deepEqual(JSON.parse(await readFile(packageJsonPath, "utf8")), { name: PACKAGE_NAME, version: "1.2.3-beta.1", private: false, exports: { ".": "./dist/index.js" } });
		await writeFile(packageJsonPath, JSON.stringify({ name: "not-lyds", version: "0.0.0" }));
		await assert.rejects(setPackageVersion({ packageJsonPath, version: "1.2.3" }), /refusing to version/);
	} finally {
		await rm(directory, { recursive: true, force: true });
	}
});
