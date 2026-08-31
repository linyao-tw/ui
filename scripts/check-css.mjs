import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = fileURLToPath(new URL("..", import.meta.url));
const componentRoot = join(workspaceRoot, "packages/ui/src/components");

async function collectCssFiles(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const nestedFiles = await Promise.all(
		entries.map(entry => {
			const path = join(directory, entry.name);
			return entry.isDirectory() ? collectCssFiles(path) : [path];
		})
	);

	return nestedFiles.flat().filter(path => extname(path) === ".css");
}

function lineNumber(source, offset) {
	return source.slice(0, offset).split("\n").length;
}

function findMatches(source, expression, description, predicate = () => true) {
	return [...source.matchAll(expression)].filter(match => predicate(match[0])).map(match => ({ description, line: lineNumber(source, match.index ?? 0), value: match[0] }));
}

let cssFiles = [];

try {
	cssFiles = await collectCssFiles(componentRoot);
} catch (error) {
	if (error?.code !== "ENOENT") {
		throw error;
	}
}

const findings = [];

for (const path of cssFiles) {
	const source = await readFile(path, "utf8");
	const file = relative(workspaceRoot, path);
	const matches = [
		...findMatches(source, /#[\da-f]{3,8}\b/gi, "raw hexadecimal color"),
		...findMatches(source, /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|lab|lch|color)\(/gi, "raw color function"),
		...findMatches(source, /(?<![-\w])(?:black|white|transparent)(?![-\w])/gi, "raw named color"),
		...findMatches(source, /(?:\d*\.)?\d+px\b/gi, "fixed px length other than an approved 0.5px/1px hairline", value => !["0.5px", "1px"].includes(value)),
		...findMatches(source, /\btransition\s*:[^;]*\ball\b/gi, "transition: all"),
		...findMatches(source, /\b(?:cubic-bezier|steps)\(/gi, "untokenized motion curve")
	];

	findings.push(...matches.map(finding => ({ ...finding, file })));
}

if (findings.length > 0) {
	for (const finding of findings) {
		console.error(`${finding.file}:${finding.line} ${finding.description}: ${finding.value}`);
	}

	process.exitCode = 1;
} else {
	console.log(`Validated ${cssFiles.length} component CSS files: semantic colors, rem lengths, and tokenized motion.`);
}
