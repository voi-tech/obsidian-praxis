import { readFile } from "node:fs/promises";

const requiredFiles = ["theme.css", "publish.css", "manifest.json"];

const readThemeFile = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

const fail = (message) => {
  console.error(`Theme validation failed: ${message}`);
  process.exitCode = 1;
};

const files = new Map();

for (const file of requiredFiles) {
  try {
    const content = await readThemeFile(file);
    files.set(file, content);

    if (content.trim().length === 0) {
      fail(`${file} is empty.`);
    }
  } catch (error) {
    fail(`${file} is missing or unreadable: ${error.message}`);
  }
}

let manifest;
try {
  manifest = JSON.parse(files.get("manifest.json"));
} catch (error) {
  fail(`manifest.json is not valid JSON: ${error.message}`);
}

const requiredManifestFields = ["name", "version", "minAppVersion", "author", "authorUrl"];
for (const field of requiredManifestFields) {
  if (!manifest?.[field]) {
    fail(`manifest.json is missing "${field}".`);
  }
}

const requiredThemeMarkers = [
  "body",
  ".theme-light",
  ".theme-dark",
  "--background-primary",
  "--background-secondary",
  "--background-modifier-border",
  "--text-normal",
  "--text-muted",
  "--text-accent",
  "--interactive-accent",
  "--font-interface-theme",
  "--font-text-theme",
  "--font-monospace-theme",
  "--h1-color",
  "--code-background",
  "--table-border-color",
  "--tag-color",
  "--nav-item-color",
  "--tab-text-color",
  ".callout",
  ".cards table",
  ".list-cards",
  ".img-grid",
  "@media (max-width: 400pt)"
];

const themeCss = files.get("theme.css") ?? "";
for (const marker of requiredThemeMarkers) {
  if (!themeCss.includes(marker)) {
    fail(`theme.css is missing "${marker}".`);
  }
}

const publishCss = files.get("publish.css") ?? "";
const requiredPublishMarkers = [
  "Minimal Publish / MIT License",
  ".published-container",
  ".theme-light",
  ".theme-dark",
  ".cards table",
  ".list-cards",
  ".img-grid",
  ".callout"
];

for (const marker of requiredPublishMarkers) {
  if (!publishCss.includes(marker)) {
    fail(`publish.css is missing "${marker}".`);
  }
}

if (process.exitCode) {
  process.exit();
}

console.log("Obsidian theme files are valid.");
