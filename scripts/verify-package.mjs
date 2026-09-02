import { spawnSync } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const storybookRequire = createRequire(join(repositoryRoot, "apps", "storybook", "package.json"));
const packageDirectory = join(repositoryRoot, "packages", "ui");
const packageJsonPath = join(packageDirectory, "package.json");
const temporaryDirectoryPrefix = "lyds-pack-check-";

const workspaceCli = {
	attw: join(dirname(require.resolve("@arethetypeswrong/cli/package.json")), "dist", "index.js"),
	publint: join(dirname(require.resolve("publint")), "cli.js"),
	tsc: join(dirname(require.resolve("typescript/package.json")), "bin", "tsc"),
	vite: join(dirname(storybookRequire.resolve("vite/package.json")), "bin", "vite.js")
};

const requiredFiles = ["LICENSE", "README.md", "dist/index.d.ts", "dist/index.js", "dist/styles.css", "package.json"];

const forbiddenFiles = [
	{ pattern: /(^|\/)src(?:\/|$)/i, reason: "source files" },
	{ pattern: /(^|\/)(?:test|tests|__tests__)(?:\/|$)/i, reason: "test files" },
	{ pattern: /^dist\/test(?:\/|$)/i, reason: "test declarations in dist" },
	{ pattern: /(^|\/)(?:story|stories|\.storybook)(?:\/|$)/i, reason: "Storybook files" },
	{ pattern: /(^|\/)[^/]+\.(?:spec|story|stories|test)\.[^/]+$/i, reason: "test or story modules" },
	{ pattern: /(^|\/)(?:config|configs)(?:\/|$)/i, reason: "configuration directories" },
	{
		pattern: /(^|\/)(?:config|[^/]+\.config|tsconfig(?:\.[^/]+)?)\.[^/]+$/i,
		reason: "tool configuration"
	},
	{ pattern: /(^|\/)(?:coverage|storybook-static)(?:\/|$)/i, reason: "generated QA output" }
];

const commandEnvironment = {
	...process.env,
	NO_COLOR: "1",
	npm_config_color: "false"
};

function log(message) {
	process.stdout.write(`[pack:check] ${message}\n`);
}

function parseArguments(arguments_) {
	if (arguments_.length === 0) return { providedTarball: undefined };
	if (arguments_.length === 2 && arguments_[0] === "--tarball" && arguments_[1]) {
		return { providedTarball: resolve(arguments_[1]) };
	}
	throw new Error("Usage: node scripts/verify-package.mjs [--tarball <existing-package.tgz>]");
}

function formatCommand(command, arguments_) {
	return [command, ...arguments_].map(argument => (/^[a-zA-Z0-9_./:@=-]+$/.test(argument) ? argument : JSON.stringify(argument))).join(" ");
}

function runCommand(label, command, arguments_, options = {}) {
	const { capture = false, cwd = repositoryRoot } = options;
	log(`${label}: ${formatCommand(command, arguments_)}`);

	const result = spawnSync(command, arguments_, {
		cwd,
		encoding: "utf8",
		env: commandEnvironment,
		maxBuffer: 64 * 1024 * 1024,
		stdio: capture ? "pipe" : "inherit"
	});

	if (result.error) {
		throw new Error(`${label} could not start: ${result.error.message}`, { cause: result.error });
	}

	if (result.signal) {
		throw new Error(`${label} was terminated by signal ${result.signal}.`);
	}

	if (result.status !== 0) {
		const details = capture
			? [result.stdout, result.stderr]
					.map(output => output?.trim())
					.filter(Boolean)
					.join("\n")
			: "See the command output above.";
		throw new Error(`${label} failed with exit code ${result.status}.\n${details}`);
	}

	if (capture && result.stderr?.trim()) {
		process.stderr.write(`${result.stderr.trim()}\n`);
	}

	return result.stdout ?? "";
}

function parseJsonOutput(output, label) {
	try {
		return JSON.parse(output.trim());
	} catch (error) {
		const excerpt = output.trim().slice(0, 2_000);
		throw new Error(`${label} did not return valid JSON. Output began with:\n${excerpt}`, { cause: error });
	}
}

function normalizePackagePath(filePath, label) {
	if (typeof filePath !== "string" || filePath.length === 0) {
		throw new Error(`${label} returned a file entry without a valid path.`);
	}

	const normalized = filePath
		.replaceAll("\\", "/")
		.replace(/^\.\//, "")
		.replace(/^package\//, "");
	const segments = normalized.split("/");

	if (normalized.startsWith("/") || segments.includes("..") || segments.includes("")) {
		throw new Error(`${label} returned an unsafe package path: ${JSON.stringify(filePath)}.`);
	}

	return normalized;
}

function readPackManifest(value, label, expectArray) {
	const manifest = expectArray ? value?.[0] : value;
	if (!manifest || (expectArray && (!Array.isArray(value) || value.length !== 1))) {
		throw new Error(`${label} did not return exactly one package manifest.`);
	}

	if (!Array.isArray(manifest.files)) {
		throw new Error(`${label} did not include a files array.`);
	}

	const files = manifest.files.map(file => normalizePackagePath(file?.path, label));
	const duplicates = files.filter((file, index) => files.indexOf(file) !== index);
	if (duplicates.length > 0) {
		throw new Error(`${label} returned duplicate file entries:\n${formatFileList(duplicates)}`);
	}

	return { files: files.toSorted(), manifest };
}

function formatFileList(files) {
	return files.length === 0 ? "  (none)" : files.map(file => `  - ${file}`).join("\n");
}

function assertPackageIdentity(manifest, packageJson, label) {
	const problems = [];
	if (manifest.name !== packageJson.name) {
		problems.push(`name is ${JSON.stringify(manifest.name)}, expected ${JSON.stringify(packageJson.name)}`);
	}
	if (manifest.version !== packageJson.version) {
		problems.push(`version is ${JSON.stringify(manifest.version)}, expected ${JSON.stringify(packageJson.version)}`);
	}

	if (problems.length > 0) {
		throw new Error(`${label} described the wrong package:\n${formatFileList(problems)}`);
	}
}

function assertPhosphorPeerContract(manifest, label) {
	const peerRange = manifest.peerDependencies?.["@phosphor-icons/react"];
	if (typeof peerRange !== "string" || peerRange.length === 0) {
		throw new Error(`${label} must declare @phosphor-icons/react as a peer dependency.`);
	}
}

function assertPackageFiles(files, label) {
	const fileSet = new Set(files);
	const missing = requiredFiles.filter(file => !fileSet.has(file));
	const forbidden = files.flatMap(file => forbiddenFiles.filter(({ pattern }) => pattern.test(file)).map(({ reason }) => `${file} (${reason})`));
	const unexpectedTopLevel = files.filter(file => !file.startsWith("dist/") && !["LICENSE", "README.md", "package.json"].includes(file));
	const unexpectedDistFiles = files.filter(file => file.startsWith("dist/") && !/(?:\.css(?:\.map)?|\.d\.[cm]?ts(?:\.map)?|\.js(?:\.map)?)$/i.test(file));
	const sourceMaps = files.filter(file => /^dist\/.+\.js\.map$/i.test(file));
	const orphanedSourceMaps = sourceMaps.filter(file => !fileSet.has(file.slice(0, -4)));

	const problems = [];
	if (missing.length > 0) {
		problems.push(`Missing required files:\n${formatFileList(missing)}`);
	}
	if (forbidden.length > 0) {
		problems.push(`Forbidden files are publishable:\n${formatFileList(forbidden)}`);
	}
	if (unexpectedTopLevel.length > 0) {
		problems.push(`Unexpected top-level package files:\n${formatFileList(unexpectedTopLevel)}`);
	}
	if (unexpectedDistFiles.length > 0) {
		problems.push(`Unexpected dist file types:\n${formatFileList(unexpectedDistFiles)}`);
	}
	if (sourceMaps.length === 0) {
		problems.push("No JavaScript source maps were included under dist/.");
	}
	if (orphanedSourceMaps.length > 0) {
		problems.push(`JavaScript source maps without matching modules:\n${formatFileList(orphanedSourceMaps)}`);
	}

	if (problems.length > 0) {
		throw new Error(`${label} violates the @linyao.tw/ui tarball contract.\n${problems.join("\n")}`);
	}
}

function assertSameFiles(actual, expected, actualLabel, expectedLabel) {
	const actualSet = new Set(actual);
	const expectedSet = new Set(expected);
	const onlyActual = actual.filter(file => !expectedSet.has(file));
	const onlyExpected = expected.filter(file => !actualSet.has(file));

	if (onlyActual.length > 0 || onlyExpected.length > 0) {
		throw new Error(
			`${actualLabel} and ${expectedLabel} disagree about package contents.\n` +
				`Only in ${actualLabel}:\n${formatFileList(onlyActual)}\n` +
				`Only in ${expectedLabel}:\n${formatFileList(onlyExpected)}`
		);
	}
}

async function readPackageJson() {
	return JSON.parse(await readFile(packageJsonPath, "utf8"));
}

async function assertTarball(tarballPath, temporaryRoot) {
	const resolvedTarball = resolve(tarballPath);
	const resolvedRoot = temporaryRoot ? resolve(temporaryRoot) : undefined;
	if (resolvedRoot && (!resolvedTarball.startsWith(`${resolvedRoot}${sep}`) || basename(resolvedTarball) !== basename(tarballPath))) {
		throw new Error(`npm pack returned a tarball outside the guarded temporary directory: ${tarballPath}`);
	}

	await access(resolvedTarball);
	const tarballStat = await stat(resolvedTarball);
	if (!tarballStat.isFile() || tarballStat.size === 0) {
		throw new Error(`Expected a non-empty package tarball at ${resolvedTarball}.`);
	}

	return resolvedTarball;
}

function inspectTarball(tarballPath) {
	const label = "actual npm tarball";
	const archiveEntries = runCommand("List the actual tarball contents", "tar", ["-tzf", tarballPath], { capture: true })
		.split(/\r?\n/u)
		.map(entry => entry.trim())
		.filter(entry => entry && !entry.endsWith("/"));
	const files = archiveEntries.map(entry => normalizePackagePath(entry, label)).toSorted();
	const duplicates = files.filter((file, index) => files.indexOf(file) !== index);
	if (duplicates.length > 0) {
		throw new Error(`${label} contains duplicate file entries:\n${formatFileList(duplicates)}`);
	}

	const manifest = parseJsonOutput(
		runCommand("Read package.json from the actual tarball", "tar", ["-xOf", tarballPath, "package/package.json"], { capture: true }),
		"package/package.json in the actual tarball"
	);

	return { files, manifest };
}

function dependencyVersion(packageJson, dependencyName) {
	const version = packageJson.devDependencies?.[dependencyName];
	if (typeof version !== "string") {
		throw new Error(`packages/ui/package.json must provide ${dependencyName} as a devDependency so the consumer smoke test can match the library's supported development version.`);
	}
	return version;
}

async function verifyConsumer(tarballPath, temporaryRoot, packageJson) {
	const consumerDirectory = join(temporaryRoot, "consumer");
	const consumerPackageJson = {
		name: "lyds-package-consumer-smoke",
		private: true,
		type: "module",
		dependencies: {
			"@linyao.tw/ui": `file:${tarballPath}`,
			"@phosphor-icons/react": dependencyVersion(packageJson, "@phosphor-icons/react"),
			"@types/react": dependencyVersion(packageJson, "@types/react"),
			"@types/react-dom": dependencyVersion(packageJson, "@types/react-dom"),
			react: dependencyVersion(packageJson, "react"),
			"react-dom": dependencyVersion(packageJson, "react-dom")
		}
	};

	await mkdir(consumerDirectory);
	await writeFile(join(consumerDirectory, "package.json"), JSON.stringify(consumerPackageJson, null, 2));

	runCommand("Install the exact tarball in an isolated consumer", "npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--package-lock=false"], { cwd: consumerDirectory });

	const runtimeSmokePath = join(consumerDirectory, "smoke.mjs");
	await writeFile(
		runtimeSmokePath,
		`import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { Button, CodeField, DatePicker } from "@linyao.tw/ui";

for (const [name, value] of Object.entries({ Button, CodeField, DatePicker, PlusIcon })) {
  if (value == null) throw new Error(\`@linyao.tw/ui did not provide the named ESM export \${name}.\`);
}

const cssUrl = import.meta.resolve("@linyao.tw/ui/styles.css");
const cssPath = fileURLToPath(cssUrl);
const css = await readFile(cssPath, "utf8");
if (css.trim().length === 0) throw new Error("@linyao.tw/ui/styles.css resolved to an empty file.");

console.log(\`Named ESM imports work; CSS export resolves to \${cssPath}.\`);
`
	);
	runCommand("Verify Node ESM named imports and the CSS export", "node", [runtimeSmokePath], {
		cwd: consumerDirectory
	});

	const typeScriptSmokePath = join(consumerDirectory, "smoke.tsx");
	await writeFile(
		typeScriptSmokePath,
		`import { createElement, type ComponentProps } from "react";
import { Button, CodeField, DatePicker } from "@linyao.tw/ui";

const buttonProps = { children: "Verify package", startIcon: createElement("span") } satisfies ComponentProps<typeof Button>;
const codeFieldProps = {
  length: 6,
  groupSize: 3,
  value: "",
  onValueChange: () => {},
  ref: null
} satisfies ComponentProps<typeof CodeField>;
void buttonProps;
void codeFieldProps;
void DatePicker;
`
	);
	await writeFile(
		join(consumerDirectory, "tsconfig.json"),
		JSON.stringify(
			{
				compilerOptions: {
					exactOptionalPropertyTypes: true,
					jsx: "react-jsx",
					lib: ["ES2022", "DOM", "DOM.Iterable"],
					module: "NodeNext",
					moduleResolution: "NodeNext",
					noEmit: true,
					skipLibCheck: false,
					strict: true,
					target: "ES2022",
					verbatimModuleSyntax: true
				},
				include: ["smoke.tsx"]
			},
			null,
			2
		)
	);

	runCommand("Verify TypeScript NodeNext resolution", process.execPath, [workspaceCli.tsc, "--project", join(consumerDirectory, "tsconfig.json")], { cwd: repositoryRoot });

	await writeFile(join(consumerDirectory, "button-consumer.js"), 'export { Button } from "@linyao.tw/ui";\n');
	await writeFile(
		join(consumerDirectory, "vite.config.mjs"),
		`export default {
  logLevel: "silent",
  build: {
    emptyOutDir: true,
    minify: true,
    outDir: "bundle-dist",
    lib: { entry: "button-consumer.js", formats: ["es"], fileName: "button" },
    rolldownOptions: { output: { entryFileNames: "button.js" } }
  }
};
`
	);
	runCommand("Bundle a Button-only consumer through the public root export", process.execPath, [workspaceCli.vite, "build"], { cwd: consumerDirectory });
	const buttonBundle = await stat(join(consumerDirectory, "bundle-dist", "button.js"));
	const maximumButtonBundleBytes = 100_000;
	if (buttonBundle.size >= maximumButtonBundleBytes) {
		throw new Error(`The Button-only ESM bundle is ${buttonBundle.size} bytes; expected less than ${maximumButtonBundleBytes}. The public root export is no longer tree-shaking component families.`);
	}
	log(`Button-only public-root bundle is ${buttonBundle.size} bytes, below the ${maximumButtonBundleBytes}-byte regression budget.`);
}

function combineErrors(first, second) {
	if (!first) return second;
	return new AggregateError([first, second], "Package verification and cleanup/version checks both failed.");
}

function formatError(error) {
	if (error instanceof AggregateError) {
		return [error.message, ...error.errors.map(formatError)].join("\n\n");
	}
	return error instanceof Error ? error.message : String(error);
}

async function main() {
	const { providedTarball } = parseArguments(process.argv.slice(2));
	const packageJson = await readPackageJson();
	if (packageJson.name !== "@linyao.tw/ui") {
		throw new Error(`Expected packages/ui to be @linyao.tw/ui, found ${JSON.stringify(packageJson.name)}.`);
	}
	assertPhosphorPeerContract(packageJson, "packages/ui/package.json");

	const originalVersion = packageJson.version;
	let failure;
	let temporaryRoot;

	try {
		runCommand("Build @linyao.tw/ui before packing", "pnpm", ["--filter", "@linyao.tw/ui", "build"]);

		const npmDryRunValue = parseJsonOutput(
			runCommand("Inspect npm's dry-run package manifest", "npm", ["pack", "--dry-run", "--json", "--ignore-scripts"], { capture: true, cwd: packageDirectory }),
			"npm pack --dry-run"
		);
		const npmDryRun = readPackManifest(npmDryRunValue, "npm pack --dry-run", true);
		assertPackageIdentity(npmDryRun.manifest, packageJson, "npm pack --dry-run");
		assertPackageFiles(npmDryRun.files, "npm pack --dry-run");

		const pnpmDryRunValue = parseJsonOutput(
			runCommand("Inspect pnpm's dry-run package manifest", "pnpm", ["--config.ignore-scripts=true", "pack", "--dry-run", "--json"], { capture: true, cwd: packageDirectory }),
			"pnpm pack --dry-run"
		);
		const pnpmDryRun = readPackManifest(pnpmDryRunValue, "pnpm pack --dry-run", false);
		assertPackageIdentity(pnpmDryRun.manifest, packageJson, "pnpm pack --dry-run");
		assertPackageFiles(pnpmDryRun.files, "pnpm pack --dry-run");
		assertSameFiles(npmDryRun.files, pnpmDryRun.files, "npm dry run", "pnpm dry run");

		log(`Validated ${npmDryRun.files.length} dry-run package files:\n${formatFileList(npmDryRun.files)}`);

		temporaryRoot = await mkdtemp(join(tmpdir(), temporaryDirectoryPrefix));
		let tarballPath;
		if (providedTarball) {
			tarballPath = await assertTarball(providedTarball);
			log(`Validating caller-owned tarball without repacking or deleting it: ${tarballPath}`);
		} else {
			const actualPackValue = parseJsonOutput(
				runCommand("Create the isolated npm tarball", "npm", ["pack", "--json", "--ignore-scripts", "--pack-destination", temporaryRoot], { capture: true, cwd: packageDirectory }),
				"npm pack"
			);
			const actualPack = readPackManifest(actualPackValue, "npm pack", true);
			assertPackageIdentity(actualPack.manifest, packageJson, "npm pack");
			assertPackageFiles(actualPack.files, "npm pack");
			assertSameFiles(actualPack.files, npmDryRun.files, "npm pack manifest", "npm dry run");

			if (typeof actualPack.manifest.filename !== "string") {
				throw new Error("npm pack did not report the generated tarball filename.");
			}
			if (actualPack.manifest.filename !== basename(actualPack.manifest.filename)) {
				throw new Error(`npm pack returned an unsafe tarball filename: ${actualPack.manifest.filename}`);
			}
			tarballPath = await assertTarball(join(temporaryRoot, actualPack.manifest.filename), temporaryRoot);
		}

		const tarball = inspectTarball(tarballPath);
		assertPackageIdentity(tarball.manifest, packageJson, "actual npm tarball");
		assertPhosphorPeerContract(tarball.manifest, "actual npm tarball");
		assertPackageFiles(tarball.files, "actual npm tarball");
		assertSameFiles(tarball.files, npmDryRun.files, "actual npm tarball", "npm dry run");

		runCommand("Run publint in strict mode", process.execPath, [workspaceCli.publint, tarballPath, "--strict"]);
		runCommand("Run Are the Types Wrong in ESM-only mode", process.execPath, [
			workspaceCli.attw,
			tarballPath,
			"--profile",
			"esm-only",
			"--exclude-entrypoints",
			"styles.css",
			"--no-emoji",
			"--no-color"
		]);

		await verifyConsumer(tarballPath, temporaryRoot, packageJson);
		log("All package, tarball, ESM, CSS, TypeScript, and tree-shaking checks passed.");
	} catch (error) {
		failure = error;
	} finally {
		let finalPackageJson;
		try {
			finalPackageJson = await readPackageJson();
		} catch (error) {
			failure = combineErrors(failure, error);
		}
		if (finalPackageJson && finalPackageJson.version !== originalVersion) {
			failure = combineErrors(
				failure,
				new Error(`Package version changed during pack verification (${JSON.stringify(originalVersion)} -> ${JSON.stringify(finalPackageJson.version)}). The verifier never permits version mutation.`)
			);
		}

		if (temporaryRoot) {
			if (!basename(temporaryRoot).startsWith(temporaryDirectoryPrefix)) {
				failure = combineErrors(failure, new Error(`Refusing to clean an unguarded directory: ${temporaryRoot}`));
			} else {
				try {
					await rm(temporaryRoot, { force: true, recursive: true });
					log(providedTarball ? "Removed the temporary consumer directory; the caller-owned tarball was left untouched." : "Removed the temporary tarball and consumer directory.");
				} catch (error) {
					failure = combineErrors(failure, error);
				}
			}
		}
	}

	if (failure) throw failure;
}

main().catch(error => {
	process.stderr.write(`\n[pack:check] FAILED\n${formatError(error)}\n`);
	process.exitCode = 1;
});
