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
  boltJointModel,
  bearingLifeModel,
  beltForceModel,
} from "../docs/.vitepress/theme/utils/design-models.mjs";
import { renderFigure } from "../scripts/figure-drawing.mjs";
import {
  formulaSections,
  headingAnchor,
} from "../docs/.vitepress/theme/utils/link-targets.mjs";
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
test("new teaching figures follow the content section they explain", () => {
  const pages = new Map();
  for (const f of illustrations.filter((item) => item.section)) {
    const md =
      pages.get(f.page) ??
      fs.readFileSync(
        new URL("../docs" + f.page + ".md", import.meta.url),
        "utf8",
      );
    pages.set(f.page, md);
    assert.ok(
      !md.includes("## 结构与设计图解"),
      `${f.page} must not collect figures at the end of the chapter`,
    );
    const marker =
      f.kind === "svg"
        ? `<DesignFigure id="${f.id}"`
        : `<${f.kind === "force" ? "ForceDiagram" : "CurveChart"} type="${f.type}"`;
    const position = md.indexOf(marker);
    assert.ok(position >= 0, `${f.id} must be embedded in its chapter`);
    const headings = [...md.slice(0, position).matchAll(/^#{2,3} .+$/gm)].map(
      (match) => match[0],
    );
    assert.equal(
      headings.at(-1),
      f.section,
      `${f.id} must immediately follow its corresponding section`,
    );
  }
  assert.equal(
    illustrations.filter((item) => item.section).length,
    70,
    "all chapter figures with a corresponding section need an explicit content placement",
  );
  const calculators = [
    ["/chapters/10-gear-drives", "gear", "### 受力参数实验"],
    ["/chapters/16-springs", "spring", "### 刚度"],
  ];
  for (const [page, type, section] of calculators) {
    const md = fs.readFileSync(
      new URL("../docs" + page + ".md", import.meta.url),
      "utf8",
    );
    const position = md.indexOf(`<DesignCalculator type="${type}"`);
    const headings = [...md.slice(0, position).matchAll(/^#{2,3} .+$/gm)].map(
      (match) => match[0],
    );
    assert.equal(headings.at(-1), section);
  }
  const engineering = [
    [
      "/chapters/05-threaded-connections",
      "bolt",
      "### 受预紧力和轴向工作载荷的紧螺栓连接",
    ],
    ["/chapters/08-belt-drives", "belt", "### 欧拉公式与极限有效拉力"],
    ["/chapters/13-rolling-bearings", "bearing", "### 基本额定寿命"],
    ["/chapters/15-shafts", "shaft", "### 按弯扭合成强度校核"],
  ];
  for (const [page, type, section] of engineering) {
    const md = fs.readFileSync(
      new URL("../docs" + page + ".md", import.meta.url),
      "utf8",
    );
    const position = md.indexOf(`<EngineeringCalculator type="${type}"`);
    const headings = [...md.slice(0, position).matchAll(/^#{2,3} .+$/gm)].map(
      (match) => match[0],
    );
    assert.ok(position >= 0, `${type} engineering calculator must be embedded`);
    assert.equal(headings.at(-1), section);
  }
});
test("formula and figure links target exact knowledge sections", () => {
  assert.equal(Object.keys(formulaSections).length, 66);
  assert.equal(headingAnchor("## 16.4 应力与变形"), "#_16-4-应力与变形");
  assert.equal(headingAnchor("### $pv$ 值"), "#pv-值");
  for (const section of Object.values(formulaSections))
    assert.ok(headingAnchor(section).startsWith("#"));
  const source = fs.readFileSync(
    new URL(
      "../docs/.vitepress/theme/components/FormulaQuickSearch.vue",
      import.meta.url,
    ),
    "utf8",
  );
  const cards = [
    ...source.matchAll(/name: ["']([^"']+)["'][\s\S]*?link: ["']([^"']+)["']/g),
  ];
  assert.equal(cards.length, 66);
  for (const [, name, page] of cards) {
    const section = formulaSections[name];
    assert.ok(section, `${name} needs an exact target section`);
    const md = fs.readFileSync(
      new URL("../docs" + page + ".md", import.meta.url),
      "utf8",
    );
    assert.ok(md.includes(section), `${name} target heading must exist`);
  }
});
test("published summaries stay consistent with corrected knowledge", () => {
  const appendix = fs.readFileSync(
    new URL("../docs/appendix/formulas.md", import.meta.url),
    "utf8",
  );
  const spring = fs.readFileSync(
    new URL("../docs/chapters/16-springs.md", import.meta.url),
    "utf8",
  );
  const standards = fs.readFileSync(
    new URL("../docs/appendix/standards.md", import.meta.url),
    "utf8",
  );
  assert.match(appendix, /σ_ca = √\(σ_b² \+ 4\(ατ\)²\)/);
  assert.ok(!appendix.includes("σ_b² + 3(ατ)²"));
  assert.ok(spring.includes("刚度与 $d^4$ 成正比"));
  assert.ok(standards.includes("GB/T 1243-2024"));
  assert.ok(!standards.includes("GB/T 1243-2006"));
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
test("bolt preload model conserves the external load before separation", () => {
  const x = boltJointModel({
    preload: 15000,
    workLoad: 10000,
    boltStiffness: 1,
    memberStiffness: 4,
  });
  near(x.loadFraction, 0.2);
  near(x.boltLoad - 15000, 2000);
  near(15000 - x.residual, 8000);
  near(x.separationLoad, 18750);
  assert.equal(x.separated, false);
  const separated = boltJointModel({
    preload: 15000,
    workLoad: 40000,
    boltStiffness: 1,
    memberStiffness: 4,
  });
  assert.equal(separated.separated, true);
  near(separated.residual, 0);
  near(separated.boltLoad, 40000);
});
test("bearing life follows the C over P exponent and speed conversion", () => {
  const x = bearingLifeModel({
    dynamicRating: 30,
    equivalentLoad: 5,
    speed: 1500,
  });
  near(x.millionRevolutions, 216);
  near(x.hours, 2400);
  near(
    bearingLifeModel({ dynamicRating: 60, equivalentLoad: 5, speed: 1500 })
      .hours / x.hours,
    8,
  );
});
test("belt forces satisfy Euler ratio and effective-force balance", () => {
  const x = beltForceModel({ power: 5.5, speed: 12, friction: 0.3, wrap: 165 });
  near(x.tight - x.slack, x.effective);
  near(x.tight / x.slack, x.ratio);
  near(x.effective, (1000 * 5.5) / 12);
});

test("all 82 gallery figures exist as standalone downloadable SVGs", () => {
  const files = fs
    .readdirSync(new URL("../docs/public/figures/", import.meta.url))
    .filter((f) => f.endsWith(".svg"));
  assert.equal(files.length, illustrations.length);
  for (const f of illustrations) {
    const svg = fs.readFileSync(
      new URL("../docs/public/figures/" + f.id + ".svg", import.meta.url),
      "utf8",
    );
    assert.match(svg, /xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    assert.ok(
      !/\sdata-v-[0-9a-f]+(?=[ >])/.test(svg),
      "SSR boolean attributes must not leak into SVG XML",
    );
  }
});
