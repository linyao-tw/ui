import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = fileURLToPath(new URL("..", import.meta.url));
const scanRoots = ["packages/ui/src/components", "apps/storybook/src"].map(path => join(workspaceRoot, path));

/**
 * Properties that map onto a published scale. A raw length here is a value that silently
 * escapes the design system, so it has to arrive through a custom property or a calc over one.
 */
const SCALE_PROPERTIES =
	"font-size|border-radius|border-(?:start|end)-(?:start|end)-radius|gap|row-gap|column-gap|padding|padding-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?|margin|margin-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?";
const SCALE_DECLARATION = new RegExp(String.raw`(?<![-\w])(${SCALE_PROPERTIES})\s*:\s*([^;{}]+);`, "g");
const KEYWORD_VALUE = /^(?:0|auto|inherit|initial|unset|revert|none|fit-content|min-content|max-content|[\d.]+%)$/;
const FUNCTION_VALUE = /^(?:calc|clamp|min|max|env|var)\(/;

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

/** Splits a declaration value on top-level whitespace so `calc(a + b)` stays in one piece. */
function splitValue(value) {
	const parts = [];
	let depth = 0;
	let current = "";

	for (const character of value) {
		if (character === "(") depth += 1;
		if (character === ")") depth -= 1;

		if (/\s/.test(character) && depth === 0) {
			if (current) parts.push(current);
			current = "";
			continue;
		}

		current += character;
	}

	if (current) parts.push(current);
	return parts;
}

function findUntokenizedLengths(source) {
	return [...source.matchAll(SCALE_DECLARATION)].flatMap(match => {
		const [declaration, property, value] = match;
		const offenders = splitValue(value.trim()).filter(part => !KEYWORD_VALUE.test(part) && !FUNCTION_VALUE.test(part));
		if (offenders.length === 0) return [];

		return [
			{
				description: `untokenized ${property} length; use a design token such as var(--space-*), var(--radius-*) or var(--font-size-*)`,
				line: lineNumber(source, match.index ?? 0),
				value: declaration.trim()
			}
		];
	});
}

let cssFiles = [];

for (const root of scanRoots) {
	try {
		cssFiles.push(...(await collectCssFiles(root)));
	} catch (error) {
		if (error?.code !== "ENOENT") {
			throw error;
		}
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
		...findMatches(source, /\b(?:cubic-bezier|steps)\(/gi, "untokenized motion curve"),
		...findUntokenizedLengths(source)
	];

	findings.push(...matches.map(finding => ({ ...finding, file })));
}

if (findings.length > 0) {
	for (const finding of findings) {
		console.error(`${finding.file}:${finding.line} ${finding.description}: ${finding.value}`);
	}

	console.error(`\n${findings.length} finding(s) across ${cssFiles.length} CSS files.`);
	process.exitCode = 1;
} else {
	console.log(`Validated ${cssFiles.length} CSS files: semantic colors, tokenized lengths, rem units, and tokenized motion.`);
}
