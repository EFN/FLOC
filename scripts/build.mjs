import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlDir = resolve(root, "html");
const strapdownDir = resolve(root, "vendor/strapdown");
const strapdown = resolve(strapdownDir, "strapdown.js");
const stylesheets = ["strapdown.css", "bootstrap-responsive.min.css", "spacelab.min.css"];

function parseMdh(source) {
  const normalized = source.replace(/^(.+?) (\w+:.*)\n\n/, "$1\n$2\n...\n");
  const [header, markdown] = normalized.split(/^\.\.\.\s*$/m, 2);
  const metadata = Object.fromEntries(header.trim().split("\n").filter(Boolean).map((line) => line.split(/:\s*/, 2)));
  return { markdown: markdown?.trim() ?? "", metadata };
}

async function render(language, source) {
  const { markdown, metadata } = parseMdh(source);
  const styles = stylesheets.map((name) => `<link rel="stylesheet" href="${pathToFileURL(resolve(strapdownDir, name)).href}">`).join("");
  const dom = new JSDOM(`<!doctype html><html lang="${language}"><head><title>${metadata.title || "FLOC"}</title>${styles}</head><body><textarea data-theme="${metadata.theme || "spacelab"}" style="display:none;">${markdown}</textarea><script src="${pathToFileURL(strapdown).href}"></script></body></html>`, { resources: "usable", runScripts: "dangerously", pretendToBeVisual: true });
  await new Promise((resolveLoad, reject) => { dom.window.addEventListener("load", resolveLoad, { once: true }); dom.window.addEventListener("error", reject, { once: true }); });
  dom.window.document.head.prepend(dom.window.document.createElement("meta"));
  dom.window.document.head.firstChild.setAttribute("charset", "utf-8");
  for (const script of dom.window.document.querySelectorAll("script")) script.remove();
  for (const link of dom.window.document.querySelectorAll('link[rel="stylesheet"]')) {
    const name = stylesheets.find((stylesheet) => link.href.endsWith(`/${stylesheet}`));
    if (name) link.setAttribute("href", `assets/${name}`);
  }
  return `<!doctype html>\n${dom.serialize()}`;
}

await mkdir(resolve(htmlDir, "assets"), { recursive: true });
const [english, norwegian] = await Promise.all([readFile(resolve(root, "src/index.mdh"), "utf8"), readFile(resolve(root, "build/index.mdh.no"), "utf8")]);
await Promise.all([...stylesheets.map((name) => copyFile(resolve(strapdownDir, name), resolve(htmlDir, "assets", name))), writeFile(resolve(htmlDir, "index.html.en"), await render("en", english)), writeFile(resolve(htmlDir, "index.html.no"), await render("no", norwegian))]);
