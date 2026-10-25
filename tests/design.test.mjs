import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { illustrations } from "../docs/.vitepress/data/illustrations.mjs";
import {
  gearPair,
  chainGeometry,
  gearGeometry,
} from "../docs/.vitepress/theme/utils/design-geometry.mjs";
import {
  springModel,
  gearForces,
  shaftEquivalent,
} from "../docs/.vitepress/theme/utils/design-models.mjs";
import { renderFigure } from "../scripts/figure-drawing.mjs";
const near = (a, b, tol = 1e-8) =>
  assert.ok(Math.abs(a - b) < tol, `${a} != ${b}`);
test("at least 75 unique teaching figures, each placed in its source chapter", () => {
  assert.ok(illustrations.length >= 75);
  assert.equal(
    new Set(illustrations.map((f) => f.id)).size,
    illustrations.length,
  );
  assert.equal(
    new Set(illustrations.map((f) => f.title)).size,
    illustrations.length,
  );
  for (const f of illustrations) {
    const md = fs.readFileSync(
      new URL("../docs" + f.page + ".md", import.meta.url),
      "utf8",
    );
    const marker =
      f.kind === "svg"
        ? f.legacy
          ? `<MechDiagram type="${f.legacy}"`
          : `<DesignFigure id="${f.id}"`
        : `<${f.kind === "force" ? "ForceDiagram" : "CurveChart"} type="${f.type}"`;
    assert.equal(
      md.split(marker).length - 1,
      1,
      `${f.id} must appear once in the chapter`,
    );
  }
  for (let i = 1; i <= 18; i++)
    assert.ok(
      illustrations.some((f) => f.chapter === String(i).padStart(2, "0")),
    );
});
test("SVGs are distinct, complete and synchronized with the reproducible generator", () => {
  const bodies = new Set();
  for (const [i, f] of illustrations
    .filter((f) => f.kind === "svg")
    .entries()) {
    const svg = fs.readFileSync(
      new URL("../docs/public/figures/" + f.id + ".svg", import.meta.url),
      "utf8",
    );
    assert.equal(svg, renderFigure(f, i));
    assert.ok(!/NaN|Infinity|undefined/.test(svg));
    assert.match(svg, /<title[^>]*>.+<\/title>/);
    const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const ref of svg.matchAll(/url\(#([^)]+)\)/g))
      assert.ok(ids.includes(ref[1]), f.id + " unresolved " + ref[1]);
    bodies.add(
      svg
        .slice(svg.indexOf("</style>") + 8)
        .replace(/<text\b[\s\S]*?<\/text>/g, ""),
    );
  }
  assert.equal(
    bodies.size,
    illustrations.filter((f) => f.kind === "svg").length,
  );
});
test("all 42 roller-chain links retain equal pitch and wrapped pins sit at pitch radius", () => {
  const g = chainGeometry();
  assert.equal(g.links.length, 42);
  for (const l of g.links)
    near(Math.hypot(l.a.x - l.b.x, l.a.y - l.b.y), g.pitch);
  for (const wheel of [g.left, g.right])
    for (const p of wheel.seats)
      near(Math.hypot(p.x - wheel.cx, p.y - wheel.cy), g.r);
  near(2 * g.r * Math.sin(Math.PI / g.z), g.pitch);
});
test("involute gear dimensions and common-tangent contact line satisfy geometry", () => {
  const { g1, g2, P, T1, T2, contactRatio } = gearPair();
  near(g2.cx - g1.cx, g1.r + g2.r);
  near(Math.hypot(T1.x - g1.cx, T1.y - g1.cy), g1.rb);
  near(Math.hypot(T2.x - g2.cx, T2.y - g2.cy), g2.rb);
  assert.ok(contactRatio > 1 && contactRatio < 2);
  near(P.x, g1.cx + g1.r);
  const g = gearGeometry(0, 0, 28, 9);
  near(g.ra * 2, g.r * 2 + 18);
  near(g.rf * 2, g.r * 2 - 22.5);
});
test("spring stiffness scales with wire diameter to fourth power, mean diameter to inverse cube", () => {
  const a = springModel(),
    b = springModel({ wire: 10 }),
    c = springModel({ diameter: 90 });
  near(b.stiffness / a.stiffness, 16);
  near(c.stiffness / a.stiffness, 1 / 8);
  near(a.force, a.stiffness * a.compression);
  assert.equal(springModel({ compression: 0 }).force, 0);
});
test("gear force model returns torque balance and zero axial force at zero helix", () => {
  for (const helix of [0, 15, 35]) {
    const g = gearForces({ helix, torque: 80 });
    near((g.tangential * g.diameter) / 2, 80000);
    near(g.axial / g.tangential, Math.tan((helix * Math.PI) / 180));
  }
  assert.equal(gearForces().axial, 0);
  near(
    gearForces({ torque: 160 }).tangential,
    2 * gearForces({ torque: 80 }).tangential,
  );
});
test("third strength theory reduces to twice shear in pure torsion and matches worked example", () => {
  const x = shaftEquivalent({
    diameter: 45,
    moment: 400000,
    torque: 300000,
    alpha: 0.6,
  });
  assert.ok(Math.abs(x.third - 49.03) < 0.1);
  assert.ok(x.third > x.fourth);
  const pure = shaftEquivalent({
    diameter: 45,
    moment: 0,
    torque: 300000,
    alpha: 1,
  });
  near(pure.third, 2 * pure.shear);
  const sources = [
    "../docs/chapters/16-springs.md",
    "../docs/.vitepress/theme/components/FormulaQuickSearch.vue",
  ].map((p) => fs.readFileSync(new URL(p, import.meta.url), "utf8"));
  for (const s of sources) {
    assert.ok(s.includes("Gd^4"));
    assert.ok(!s.includes("Gd}{8D^3n}"));
    assert.ok(!s.includes("Gd/(8D^3n)"));
  }
});

test('all 82 gallery figures exist as standalone downloadable SVGs', () => {
  const files = fs.readdirSync(new URL('../docs/public/figures/', import.meta.url)).filter(f => f.endsWith('.svg'));
  assert.equal(files.length, illustrations.length);
  for (const f of illustrations) {
    const svg = fs.readFileSync(new URL('../docs/public/figures/' + f.id + '.svg', import.meta.url), 'utf8');
    assert.match(svg, /xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.ok(!/\sdata-v-[0-9a-f]+(?=[ >])/.test(svg), 'SSR boolean attributes must not leak into SVG XML');
  }
});
