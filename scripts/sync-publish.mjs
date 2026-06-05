import { copyFile, mkdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const defaultTarget =
  "/Users/voitech/Library/Mobile Documents/iCloud~md~obsidian/Documents/Notes/publish.css";

const source = new URL("../publish.css", import.meta.url);
const target = resolve(process.env.OBSIDIAN_PUBLISH_CSS ?? defaultTarget);

await stat(source);
await mkdir(dirname(target), { recursive: true });
await copyFile(source, target);

console.log(`Synced publish.css to ${target}`);
