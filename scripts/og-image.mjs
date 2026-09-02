// Renders assets/og-image.html to assets/og-image.png (1200×630 @2x) with Playwright.
// Uses a project-local `playwright` if present, otherwise the pnpm global install.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const input = path.resolve(here, "../assets/og-image.html");
const output = path.resolve(here, "../assets/og-image.png");
const scale = Number(process.env.OG_SCALE ?? 2);

async function loadPlaywright() {
	try {
		return await import("playwright");
	} catch {
		// pnpm installs global bins as shell shims that record the real cli.js path.
		const bin = execSync("command -v playwright", { encoding: "utf8", shell: "/bin/sh" }).trim();
		const shim = fs.readFileSync(bin, "utf8");
		const target = shim.match(/cmd-shim-target=(.+)$/m)?.[1] ?? shim.match(/(\/\S+\/node_modules\/playwright\/cli\.js)/)?.[1];
		if (!target) {
			throw new Error("Could not find a global Playwright install. Run: pnpm add -g playwright");
		}
		const pkgDir = path.dirname(path.resolve(path.dirname(bin), target.trim()));
		return await import(pathToFileURL(path.join(pkgDir, "index.mjs")).href);
	}
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
try {
	const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: scale });
	await page.goto(pathToFileURL(input).href, { waitUntil: "networkidle" });
	await page.evaluate("document.fonts.ready");
	await page.waitForTimeout(300);
	await page.screenshot({ path: output, type: "png" });
	console.log(`wrote ${path.relative(process.cwd(), output)} (${1200 * scale}×${630 * scale})`);
} finally {
	await browser.close();
}
