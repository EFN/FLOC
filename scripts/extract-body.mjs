import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = await readFile(resolve(root, "src/index.mdh"), "utf8");
const boundary = source.match(/^\.\.\.\s*$/m);

if (!boundary || boundary.index === undefined) {
  throw new Error("src/index.mdh must contain a metadata header terminated by ...");
}

const body = source.slice(boundary.index + boundary[0].length).replace(/^\s*\n/, "");
await mkdir(resolve(root, "build"), { recursive: true });
await writeFile(resolve(root, "build/index.mdh"), body);
