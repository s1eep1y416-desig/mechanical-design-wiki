import fs from "node:fs";
import path from "node:path";

const sourceRoot = path.resolve("docs");
const outputRoot = path.resolve("docs/.vitepress/dist");
const publicBase = "/mechanical-design-wiki/";
const publicSite = "https://s1eep1y416-desig.github.io/mechanical-design-wiki/";
const pages = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".vitepress") continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith(".md")) pages.push(file);
  }
}

walk(sourceRoot);
const broken = [];
let checked = 0;

for (const markdown of pages) {
  const relative = path
    .relative(sourceRoot, markdown)
    .replace(/\.md$/, ".html");
  const htmlFile = path.join(outputRoot, relative);
  if (!fs.existsSync(htmlFile)) {
    broken.push({ page: relative, reason: "missing rendered page" });
    continue;
  }
  const html = fs.readFileSync(htmlFile, "utf8");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  if (!canonical?.startsWith(publicSite))
    broken.push({ page: relative, reason: "missing or invalid canonical URL" });

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    if (/^(https?:|mailto:|#|data:)/.test(raw)) continue;
    let url = raw.split("#")[0].split("?")[0];
    if (!url) continue;
    if (url.startsWith(publicBase)) url = url.slice(publicBase.length);
    else if (url === publicBase.slice(0, -1)) url = "";
    else if (url.startsWith("/")) url = url.slice(1);

    let target = raw.startsWith("/")
      ? path.resolve(outputRoot, url)
      : path.resolve(path.dirname(htmlFile), url);
    if (url.endsWith("/") || !url) target = path.join(target, "index.html");
    else if (!path.extname(target)) target += ".html";
    checked += 1;
    if (!fs.existsSync(target)) broken.push({ page: relative, link: raw });
  }
}

const sitemap = fs.readFileSync(path.join(outputRoot, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  (match) => match[1],
);
if (locations.length !== pages.length - 1)
  broken.push({
    reason: `sitemap has ${locations.length} URLs; expected ${pages.length - 1}`,
  });
if (new Set(locations).size !== locations.length)
  broken.push({ reason: "sitemap contains duplicate URLs" });
for (const url of locations)
  if (!url.startsWith(publicSite))
    broken.push({ reason: "invalid sitemap URL", url });

if (!fs.existsSync(path.join(outputRoot, "robots.txt")))
  broken.push({ reason: "missing robots.txt" });
if (!fs.existsSync(path.join(outputRoot, "og-cover.png")))
  broken.push({ reason: "missing social preview image" });

if (broken.length) {
  console.error(JSON.stringify({ checked, broken }, null, 2));
  process.exit(1);
}
console.log(
  `Validated ${pages.length} pages and ${checked} internal resources; broken: 0`,
);
