import { readdir, readFile, stat } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const requiredFiles = ["theme.css", "publish.css", "manifest.json", "README.md", "LICENSE", "screenshot.png"];
const allowedPackageScripts = new Set(["build", "validate"]);

const fail = (message) => {
  console.error(`Theme validation failed: ${message}`);
  process.exitCode = 1;
};

const readText = (file) => readFile(new URL(file, root), "utf8");

const checkBalancedCss = (name, css) => {
  let braces = 0;
  let inComment = false;

  for (let index = 0; index < css.length; index += 1) {
    const char = css[index];
    const next = css[index + 1];

    if (!inComment && char === "/" && next === "*") {
      inComment = true;
      index += 1;
      continue;
    }

    if (inComment && char === "*" && next === "/") {
      inComment = false;
      index += 1;
      continue;
    }

    if (inComment) {
      continue;
    }

    if (char === "{") {
      braces += 1;
    } else if (char === "}") {
      braces -= 1;
    }

    if (braces < 0) {
      fail(`${name} has an unmatched closing brace.`);
      return;
    }
  }

  if (inComment) {
    fail(`${name} has an unterminated CSS comment.`);
  }

  if (braces !== 0) {
    fail(`${name} has unbalanced braces.`);
  }
};

const requireMarkers = (name, content, markers) => {
  for (const marker of markers) {
    if (!content.includes(marker)) {
      fail(`${name} is missing "${marker}".`);
    }
  }
};

const validateStyleSettings = (themeCss) => {
  const match = themeCss.match(/\/\*\s*@settings[\s\S]*?\*\//);
  if (!match) {
    fail("theme.css is missing a Style Settings @settings block.");
    return;
  }

  const block = match[0];
  requireMarkers("Style Settings block", block, [
    "name: Praxis",
    "id: praxis",
    "settings:",
    "praxis-font-text-size",
    "praxis-line-width",
    "praxis-accent",
    "praxis-properties-label-width",
    "praxis-properties-input-height",
    "praxis-properties-gap",
    "praxis-properties-spacious",
    "praxis-cards-min-width",
    "type: variable-color",
    "type: class-toggle"
  ]);

  const settingIds = [...block.matchAll(/^\s+id:\s+([a-z0-9-]+)/gm)].map(([, id]) => id);
  const duplicates = settingIds.filter((id, index) => settingIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    fail(`Style Settings block contains duplicate ids: ${[...new Set(duplicates)].join(", ")}.`);
  }
};

const validatePackage = async () => {
  const packageJson = JSON.parse(await readText("package.json"));

  if (packageJson.dependencies || packageJson.devDependencies) {
    fail("package.json must not declare runtime or development dependencies.");
  }

  for (const script of Object.keys(packageJson.scripts ?? {})) {
    if (!allowedPackageScripts.has(script)) {
      fail(`package.json contains non-neutral script "${script}".`);
    }
  }
};

for (const file of requiredFiles) {
  try {
    const fileStat = await stat(new URL(file, root));
    if (fileStat.size === 0) {
      fail(`${file} is empty.`);
    }
  } catch (error) {
    fail(`${file} is missing or unreadable: ${error.message}`);
  }
}

let manifest;
try {
  manifest = JSON.parse(await readText("manifest.json"));
} catch (error) {
  fail(`manifest.json is not valid JSON: ${error.message}`);
}

for (const field of ["name", "version", "minAppVersion", "author", "authorUrl"]) {
  if (!manifest?.[field]) {
    fail(`manifest.json is missing "${field}".`);
  }
}

if (manifest?.name !== "Praxis") {
  fail('manifest.json "name" must be "Praxis".');
}

if (manifest?.minAppVersion !== "1.13.0") {
  fail('manifest.json "minAppVersion" must be "1.13.0".');
}

await validatePackage();

const themeCss = await readText("theme.css");
const publishCss = await readText("publish.css");
const readme = await readText("README.md");

checkBalancedCss("theme.css", themeCss);
checkBalancedCss("publish.css", publishCss);
validateStyleSettings(themeCss);

requireMarkers("theme.css", themeCss, [
  "body",
  ".theme-light",
  ".theme-dark",
  "--praxis-",
  "--praxis-radius: 13px",
  "--background-primary",
  "--font-text-theme",
  "--metadata-padding",
  "--metadata-input-height",
  "--metadata-label-width",
  ".metadata-property-value :is(.metadata-input-date, .metadata-input-datetime)",
  ".workspace-ribbon .clickable-icon",
  ".sidebar-toggle-button",
  "--callout-icon: lucide-",
  'data-callout="author"',
  'data-callout-metadata="noicon"',
  ".markdown-rendered input[data-task]:not",
  ".HyperMD-task-line[data-task",
  ".cm-task-list-item-checkbox",
  ".cards table",
  ".list-cards",
  ".img-grid",
  ".callout"
]);

requireMarkers("publish.css", publishCss, [
  "Praxis for Obsidian Publish",
  ".published-container",
  ".theme-light",
  ".theme-dark",
  "--praxis-radius: 13px",
  "--page-width",
  "--callout-icon: lucide-",
  'data-callout="author"',
  'data-callout-metadata="noicon"',
  ".published-container input[data-task]:not",
  ".cards table",
  ".list-cards",
  ".img-grid",
  ".callout"
]);

for (const forbidden of ["@import", "base64,", "Mobile Documents", "iCloud~md~obsidian", "/Users/", "--callout-color: 152, 120, 224", "rgba(var(--callout-color)"]) {
  if (themeCss.includes(forbidden) || publishCss.includes(forbidden) || readme.includes(forbidden)) {
    fail(`Repository contains forbidden private or heavy asset marker "${forbidden}".`);
  }
}

for (const forbiddenPublishSelector of [".HyperMD-task-line", ".cm-task-list-item-checkbox", ".markdown-source-view"]) {
  if (publishCss.includes(forbiddenPublishSelector)) {
    fail(`publish.css contains app-only checkbox selector "${forbiddenPublishSelector}".`);
  }
}

if (publishCss.includes(".metadata-") || publishCss.includes("--metadata-")) {
  fail("publish.css must not contain app-only Properties selectors or metadata variables.");
}

if (/\.metadata-property\s*\{[\s\S]*?(?:display|flex|min-height)/.test(themeCss)) {
  fail("theme.css must not reimplement the Properties row layout with broad .metadata-property overrides.");
}

requireMarkers("README.md", readme, [
  "Install with BRAT",
  "https://github.com/voitech/obsidian-praxis",
  "Appearance -> Themes"
]);

if (!themeCss.includes("data:image/svg+xml") || !publishCss.includes("data:image/svg+xml")) {
  fail("Checkbox icon masks must be present as Lucide-based inline SVG data URIs.");
}

if (publishCss.length > 100_000) {
  fail("publish.css should stay below 100KB.");
}

const files = await readdir(new URL("scripts", root));
if (files.some((file) => file.includes("sync"))) {
  fail("scripts directory must not contain sync scripts with local vault assumptions.");
}

if (process.exitCode) {
  process.exit();
}

console.log("Praxis theme files are valid.");
