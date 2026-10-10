import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlDir = resolve(root, "html");
const markdown = new MarkdownIt({ linkify: true, typographer: true });

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function parseMdh(source) {
  const [header, body] = source.split(/^\.\.\.\s*$/m, 2);
  if (body === undefined) throw new Error("src/index.mdh must contain a metadata header terminated by ...");
  const metadata = Object.fromEntries(header.trim().split("\n").filter(Boolean).map((line) => line.split(/:\s*/, 2)));
  return { body: body.trim(), metadata };
}

function render(language, metadata, body) {
  const title = escapeHtml(metadata.title || "FLOC");
  return `<!doctype html>
<html lang="${language}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <link rel="stylesheet" href="floc.css">
  </head>
  <body>
    <main>
      ${markdown.render(body)}
    </main>
  </body>
</html>
`;
}

await mkdir(htmlDir, { recursive: true });
const [source, norwegian] = await Promise.all([readFile(resolve(root, "src/index.mdh"), "utf8"), readFile(resolve(root, "build/index.mdh.no"), "utf8")]);
const { body: english, metadata } = parseMdh(source);
await Promise.all([
  copyFile(resolve(root, "src/floc.css"), resolve(htmlDir, "floc.css")),
  writeFile(resolve(htmlDir, "index.html.en"), render("en", metadata, english)),
  writeFile(resolve(htmlDir, "index.html.no"), render("no", metadata, norwegian)),
]);
