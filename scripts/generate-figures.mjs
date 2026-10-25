import { writeFile, mkdir, readFile } from "node:fs/promises";
import { illustrations } from "../docs/.vitepress/data/illustrations.mjs";
import { renderFigure } from "./figure-drawing.mjs";
const directory = new URL("../docs/public/figures/", import.meta.url);
await mkdir(directory, { recursive: true });
for (const [i, meta] of illustrations
  .filter((f) => f.kind === "svg")
  .entries()) {
  const svg = renderFigure(meta, i),
    url = new URL(meta.id + ".svg", directory);
  if (process.argv.includes("--check")) {
    if ((await readFile(url, "utf8")) !== svg)
      throw new Error("Outdated figure: " + meta.id);
  } else await writeFile(url, svg);
}
console.log(
  "63 standalone SVG figures " +
    (process.argv.includes("--check") ? "verified" : "generated"),
);
