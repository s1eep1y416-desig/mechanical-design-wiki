import {
  gearGeometry,
  chainGeometry,
  gearPair,
  point,
  linePath,
} from "../docs/.vitepress/theme/utils/design-geometry.mjs";
export const drawings = {};
const esc = (s) =>
  String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const attrs = (o) =>
  Object.entries(o)
    .map(([k, v]) => `${k}="${esc(v)}"`)
    .join(" ");
export const tag = (n, a = {}, body = "") => `<${n} ${attrs(a)}>${body}</${n}>`;
export const text = (x, y, s, c = "label", anchor = "start") =>
  tag("text", { x, y, class: c, "text-anchor": anchor }, esc(s));
export const path = (d, c = "metal", extra = {}) =>
  tag("path", { d, class: c, ...extra });
export const rect = (x, y, width, height, c = "metal", rx = 3) =>
  tag("rect", { x, y, width, height, rx, class: c });
export const circle = (cx, cy, r, c = "metal") =>
  tag("circle", { cx, cy, r, class: c });
export const line = (x1, y1, x2, y2, c = "ink", extra = {}) =>
  tag("line", { x1, y1, x2, y2, class: c, ...extra });
export const group = (x, y, body, scale = 1) =>
  tag("g", { transform: `translate(${x} ${y}) scale(${scale})` }, body);
const arrow = (x1, y1, x2, y2, label = "", c = "force") =>
  line(x1, y1, x2, y2, c, {
    "marker-end": `url(#${c === "flow" ? "flow" : "arrow"})`,
  }) +
  (label ? text((x1 + x2) / 2 + 9, (y1 + y2) / 2 - 10, label, "small") : "");
const dim = (x1, y1, x2, y2, label) =>
  line(x1, y1, x2, y2, "dimension", {
    "marker-start": "url(#dim)",
    "marker-end": "url(#dim)",
  }) + text((x1 + x2) / 2, (y1 + y2) / 2 - 10, label, "small", "middle");
const leader = (x, y, ex, ey, label) =>
  circle(x, y, 3, "red") +
  path(`M${x} ${y}L${ex} ${ey}h16`, "guide") +
  text(ex + 20, ey + 5, label, "small");
const panel = (x, y, w, h, title) =>
  rect(x, y, w, h, "panel", 12) + text(x + 20, y + 30, title, "subtitle");
const note = (x, y, lines) =>
  lines.map((t, i) => text(x, y + i * 30, t, "small")).join("");
const axis = (x1, y1, x2, y2) => line(x1, y1, x2, y2, "axis");
const bolt = (x, y, h = 150) =>
  group(
    x,
    y,
    rect(-16, 0, 32, h, "steel") +
      path("M-30 0v-20h60V0Z", "metal") +
      rect(-28, h - 25, 56, 25, "metal") +
      Array.from({ length: 7 }, (_, i) =>
        line(-16, h - 35 + i * 5, 16, h - 43 + i * 5, "fine"),
      ).join("") +
      axis(0, -40, 0, h + 20),
  );
const bearing = (x, y, r = 80) =>
  group(
    x,
    y,
    circle(0, 0, r, "steel") +
      circle(0, 0, r * 0.81, "paper") +
      circle(0, 0, r * 0.52, "steel") +
      circle(0, 0, r * 0.35, "paper") +
      circle(0, 0, r * 0.665, "cage") +
      Array.from({ length: 10 }, (_, i) => {
        const p = point(0, 0, r * 0.665, (i * Math.PI) / 5);
        return circle(p.x, p.y, r * 0.135, "ball");
      }).join(""),
  );
const bearingSide = (x, y) =>
  group(
    x,
    y,
    rect(-27, -75, 54, 150, "hatch") +
      rect(-28, -45, 56, 90, "paper") +
      rect(-27, -23, 54, 46, "hatch") +
      circle(0, -43, 15, "ball") +
      circle(0, 43, 15, "ball") +
      axis(0, -90, 0, 90),
  );
const gear = (x, y, z = 24, m = 7, phase = 0) =>
  path(gearGeometry(x, y, z, m, phase).path, "metal") +
  circle(x, y, (m * z) / 2, "pitch") +
  circle(x, y, m * z * 0.17, "steel") +
  circle(x, y, m * z * 0.09, "paper") +
  rect(x - 6, y - m * z * 0.09 - 6, 12, 10, "paper", 0);
const spring = (x, y, len = 290, r = 52, n = 7) => {
  const pts = Array.from({ length: 401 }, (_, i) => ({
    x: x + (len * i) / 400 + 9 * Math.sin((i / 400) * n * 2 * Math.PI),
    y: y + r * Math.cos((i / 400) * n * 2 * Math.PI),
  }));
  return (
    path(linePath(pts), "coil-shadow") +
    path(linePath(pts), "coil") +
    axis(x - 20, y, x + len + 20, y)
  );
};
const shaft = (x, y, w = 600) =>
  group(
    x,
    y,
    path(
      `M0 -22H${w * 0.16}V-36H${w * 0.26}V-48H${w * 0.74}V-36H${w * 0.84}V-22H${w}V22H${w * 0.84}V36H${w * 0.74}V48H${w * 0.26}V36H${w * 0.16}V22H0Z`,
      "steel",
    ) + axis(-25, 0, w + 25, 0),
  );
const support = (x, y) =>
  path(`M${x} ${y}l-20 32h40Z`, "hatch") + line(x - 33, y + 38, x + 33, y + 38);
const toothBlock = (x, y) =>
  group(
    x,
    y,
    path("M0 150V105Q45 94 52 20L70 0H120L138 20Q146 95 190 105V150Z", "hatch"),
  );
const heat = (x, y) =>
  path(`M${x} ${y}q-15 -15 0 -30t0 -30t0 -30`, "force", {
    "marker-end": "url(#arrow)",
  });

// Assemblies: calculated involutes and an exactly closed, equal-pitch roller chain.
drawings["overview-gear"] = () => {
  const g = gearPair();
  return (
    group(
      0,
      25,
      gear(g.g1.cx, g.g1.cy, 24, 7.5, g.g1.phase) +
        gear(g.g2.cx, g.g2.cy, 36, 7.5, g.g2.phase) +
        path(g.loa, "force") +
        path(g.contact, "contact") +
        circle(g.P.x, g.P.y, 5, "red") +
        axis(60, 230, 600, 230),
    ) +
    leader(290, 255, 315, 110, "节点 P") +
    leader(355, 90, 620, 110, "公法线 / 作用线") +
    panel(665, 175, 285, 275, "啮合几何") +
    note(688, 235, [
      "z₁ = 24，z₂ = 36",
      "同模数 m，同压力角 α",
      "中心距 a = m(z₁+z₂)/2",
      "ω₂ / ω₁ = −z₁ / z₂",
      "绿色段：实际啮合线段",
      "虚线：分度圆",
    ]) +
    dim(200, 465, 425, 465, "中心距 a")
  );
};
drawings["overview-chain"] = () => {
  const g = chainGeometry();
  return (
    group(
      -35,
      20,
      g.left &&
        [g.left, g.right]
          .map(
            (s) =>
              path(s.path, "metal") +
              circle(s.cx, s.cy, s.r, "pitch") +
              circle(s.cx, s.cy, 28, "steel") +
              circle(s.cx, s.cy, 14, "paper"),
          )
          .join("") +
          g.links
            .map((l) =>
              line(
                l.a.x,
                l.a.y,
                l.b.x,
                l.b.y,
                l.outer ? "plate-outer" : "plate-inner",
              ),
            )
            .join("") +
          g.pins.map((p) => circle(p.x, p.y, 6, "ball")).join(""),
    ) +
    dim(150, 385, 486, 385, "中心距 12p") +
    dim(150, 115, 178, 115, "p") +
    panel(620, 105, 335, 360, "放大看一个链节") +
    group(
      640,
      150,
      line(55, 100, 230, 100, "plate-outer") +
        circle(55, 100, 36, "steel") +
        circle(230, 100, 36, "steel") +
        circle(55, 100, 14, "ball") +
        circle(230, 100, 14, "ball") +
        dim(55, 180, 230, 180, "销轴中心距 p"),
    ) +
    note(643, 410, ["滚子落入齿槽，链板连接销轴", "相邻销轴间距保持不变"]) +
    text(85, 465, "等齿数例用于清楚展示闭合链的几何约束", "small")
  );
};
drawings["overview-belt"] = () => {
  const x1 = 210,
    x2 = 585,
    y = 270,
    r1 = 90,
    r2 = 140,
    a = Math.acos((r1 - r2) / (x2 - x1));
  const p1 = point(x1, y, r1, -a),
    p2 = point(x2, y, r2, -a),
    p3 = point(x2, y, r2, a),
    p4 = point(x1, y, r1, a);
  return (
    circle(x1, y, r1, "steel") +
    circle(x2, y, r2, "steel") +
    circle(x1, y, 25, "paper") +
    circle(x2, y, 35, "paper") +
    path(
      `M${p1.x} ${p1.y}L${p2.x} ${p2.y}A${r2} ${r2} 0 1 1 ${p3.x} ${p3.y}L${p4.x} ${p4.y}A${r1} ${r1} 0 0 1 ${p1.x} ${p1.y}`,
      "belt",
    ) +
    axis(60, y, 790, y) +
    arrow(290, 385, 430, 405, "F₁ 紧边") +
    arrow(430, 130, 290, 150, "F₂ 松边") +
    text(120, 455, "主动小带轮，顺时针", "small") +
    text(505, 455, "从动大带轮，同向", "small") +
    note(765, 250, ["Fₑ = F₁ − F₂", "T₁ = Fₑ d₁/2", "α₁ < 180°"])
  );
};
drawings["overview-bolt"] = () =>
  panel(55, 95, 440, 400, "剖面：拧紧后夹紧连接件") +
  rect(155, 205, 240, 80, "hatch") +
  rect(155, 285, 240, 80, "hatch2") +
  rect(252, 165, 46, 230, "paper") +
  bolt(275, 190, 200) +
  arrow(170, 195, 170, 260, "压紧") +
  arrow(170, 390, 170, 320) +
  panel(525, 95, 420, 400, "工作载荷的分配") +
  arrow(695, 270, 695, 155, "螺栓 F₂") +
  rect(655, 270, 80, 25, "steel") +
  arrow(625, 295, 625, 395, "剩余夹紧力 F₁") +
  arrow(790, 295, 790, 395, "外载 F") +
  note(565, 435, ["F₂ = F₀ + CF", "F₁ = F₀ − (1−C)F；未分离时成立"]);
drawings["overview-key"] = () =>
  circle(270, 280, 135, "hatch2") +
  circle(270, 280, 85, "steel") +
  rect(241, 181, 58, 42, "gold", 0) +
  line(241, 176, 299, 176, "force") +
  axis(110, 280, 435, 280) +
  axis(270, 110, 270, 445) +
  leader(298, 205, 450, 130, "键侧面传力") +
  leader(272, 178, 450, 180, "键顶与轮毂留隙") +
  panel(535, 250, 410, 230, "沿轴向的局部剖面") +
  rect(570, 330, 325, 75, "steel") +
  rect(620, 315, 220, 30, "gold", 15) +
  dim(620, 290, 840, 290, "总长 L") +
  dim(650, 450, 810, 450, "工作长度 l = L − b") +
  text(150, 470, "端面：轴、键、轮毂", "small");
drawings["overview-shaft"] = () =>
  shaft(130, 290, 730) +
  bearingSide(255, 290) +
  bearingSide(725, 290) +
  rect(430, 155, 55, 270, "metal") +
  rect(430, 233, 55, 25, "gold") +
  rect(355, 230, 14, 120, "metal") +
  rect(600, 250, 50, 80, "metal") +
  leader(435, 245, 470, 115, "键：周向固定") +
  leader(355, 260, 125, 110, "轴肩 / 套筒：轴向定位") +
  leader(725, 220, 740, 160, "轴承支承") +
  dim(255, 470, 725, 470, "两支点跨距 L");
drawings["overview-bearing"] = () =>
  bearing(300, 290, 155) +
  leader(210, 155, 470, 115, "外圈及外滚道") +
  leader(344, 235, 520, 185, "滚动体") +
  leader(338, 293, 570, 275, "内圈及内滚道") +
  leader(220, 347, 510, 390, "保持架：分隔滚动体") +
  panel(710, 130, 225, 330, "轴向局部剖面") +
  bearingSide(820, 285) +
  text(735, 425, "滚道包络滚动体", "small");
drawings["overview-journal"] = () =>
  rect(110, 115, 370, 350, "hatch") +
  circle(295, 285, 145, "gold") +
  circle(295, 285, 122, "oil") +
  circle(310, 302, 98, "steel") +
  circle(295, 285, 4, "red") +
  circle(310, 302, 4, "red") +
  axis(145, 285, 450, 285) +
  arrow(310, 240, 310, 340, "载荷 W") +
  leader(224, 380, 530, 400, "薄油膜区 hmin（夸大）") +
  leader(295, 285, 545, 170, "轴瓦中心 O") +
  leader(310, 302, 545, 230, "轴颈中心 O₁") +
  note(580, 300, [
    "偏心距 e = OO₁",
    "径向间隙 c = R − r",
    "偏心率 ε = e/c < 1",
  ]);
drawings["overview-spring"] = () =>
  spring(150, 270, 430, 90, 8) +
  rect(110, 150, 15, 240, "hatch") +
  rect(610, 150, 15, 240, "hatch") +
  arrow(55, 270, 108, 270, "F") +
  arrow(690, 270, 628, 270, "F") +
  dim(150, 440, 580, 440, "自由长度 / 工作长度") +
  dim(740, 180, 740, 360, "中径 D") +
  leader(390, 190, 525, 120, "簧丝直径 d") +
  note(795, 245, ["有效圈数 n", "k = Gd⁴/(8D³n)", "λ = F/k"]);
drawings["overview-worm"] = () =>
  gear(380, 335, 36, 6.3) +
  rect(155, 163, 450, 58, "steel", 24) +
  rect(95, 179, 570, 26, "steel") +
  Array.from({ length: 10 }, (_, i) =>
    path(`M${175 + i * 40} 165q-16 20 15 54`, "thread"),
  ).join("") +
  axis(60, 192, 700, 192) +
  circle(380, 335, 32, "paper") +
  leader(320, 177, 685, 120, "蜗杆轴线：水平") +
  leader(380, 335, 685, 300, "蜗轮轴线：垂直纸面") +
  text(380, 342, "⊙", "label", "middle") +
  note(700, 375, [
    "轴交角 Σ = 90°",
    "z₁：蜗杆头数",
    "z₂：蜗轮齿数",
    "i = z₂/z₁",
  ]);
drawings["overview-coupling"] = () =>
  shaft(85, 290, 820) +
  rect(310, 160, 70, 260, "metal") +
  rect(400, 160, 70, 260, "metal") +
  [200, 380]
    .map(
      (y) =>
        rect(350, y - 20, 100, 40, "gold") +
        rect(320, y - 9, 150, 18, "steel") +
        circle(435, y, 5, "paper"),
    )
    .join("") +
  leader(405, 190, 520, 120, "弹性套与柱销") +
  leader(330, 310, 530, 420, "两半联轴器固定在各自轴端") +
  dim(380, 460, 400, 460, "端面间隙");
function reducerAssembly() {
  return (
    rect(100, 105, 790, 405, "hatch", 20) +
    rect(125, 130, 740, 355, "paper", 12) +
    [190, 300, 410]
      .map((y) =>
        group(
          150,
          y,
          tag("g", { transform: "scale(1 .55)" }, shaft(0, 0, 710)),
        ),
      )
      .join("") +
    rect(330, 155, 28, 70, "metal") +
    rect(330, 225, 28, 150, "metal") +
    rect(630, 265, 28, 70, "metal") +
    rect(630, 335, 28, 150, "metal") +
    [190, 300, 410]
      .map(
        (y) =>
          group(235, y, bearingSide(0, 0), 0.46) +
          group(775, y, bearingSide(0, 0), 0.46),
      )
      .join("") +
    text(390, 160, "高速轴", "small") +
    text(390, 265, "中间轴：两只齿轮同轴", "small") +
    text(390, 455, "低速轴", "small")
  );
}
drawings["overview-reducer"] = () =>
  reducerAssembly() +
  text(
    125,
    535,
    "轴线平行；两对齿轮分别处于不同轴向位置。剖面比例为示意。",
    "small",
  );

// General design and strength.
drawings["machine-power"] = () => {
  let s = rect(65, 210, 210, 155, "steel", 18) + circle(65, 287, 55, "metal");
  for (let i = 0; i < 8; i++)
    s += line(100 + i * 20, 225, 100 + i * 20, 350, "fine");
  return (
    s +
    rect(280, 270, 75, 35, "steel") +
    rect(370, 170, 240, 220, "hatch", 16) +
    gear(432, 285, 20, 4) +
    gear(532, 285, 30, 4, Math.PI / 30) +
    rect(625, 270, 100, 35, "steel") +
    circle(795, 285, 75, "steel") +
    path("M785 215L840 285L785 355Z", "gold") +
    text(85, 415, "原动机", "subtitle") +
    text(410, 435, "传动装置", "subtitle") +
    text(730, 415, "执行机构", "subtitle") +
    arrow(160, 130, 470, 130, "P入，n入") +
    arrow(520, 130, 815, 130, "P出 = ηP入") +
    text(
      170,
      490,
      "每级：转速改变 ↔ 转矩改变；计入效率后，功率沿传动链减少。",
      "small",
    )
  );
};
drawings["component-assembly"] = () =>
  shaft(75, 300, 850) +
  bearing(220, 300, 75) +
  gear(485, 300, 30, 8) +
  bearing(745, 300, 75) +
  rect(390, 227, 80, 20, "gold") +
  rect(820, 205, 25, 190, "hatch") +
  axis(60, 300, 950, 300) +
  [220, 485, 745, 832]
    .map((x, i) =>
      leader(x, 210, x - 55, 120, ["轴承", "齿轮＋平键", "轴承", "端盖"][i]),
    )
    .join("") +
  dim(100, 480, 900, 480, "沿轴线装配；位置为爆炸示意");
drawings["load-path"] = () =>
  rect(120, 390, 760, 40, "hatch") +
  rect(190, 280, 620, 110, "hatch2") +
  shaft(110, 250, 780) +
  bearingSide(250, 250) +
  bearingSide(740, 250) +
  rect(470, 135, 60, 220, "metal") +
  arrow(500, 95, 500, 190, "齿面载荷") +
  arrow(440, 270, 260, 270) +
  arrow(560, 270, 730, 270) +
  arrow(250, 300, 250, 385) +
  arrow(740, 300, 740, 385) +
  bolt(190, 390, 80) +
  bolt(810, 390, 80) +
  text(345, 475, "轴 → 轴承 → 箱体 → 地脚连接 → 基础", "small");
drawings["design-process"] = () =>
  [0, 1, 2, 3]
    .map((i) => {
      const x = 45 + i * 240;
      return (
        panel(
          x,
          140,
          215,
          320,
          ["01 工况输入", "02 载荷计算", "03 结构校核", "04 生产图样"][i],
        ) +
        (i === 0
          ? gear(x + 105, 270, 20, 5)
          : i === 1
            ? line(x + 25, 280, x + 185, 280) +
              support(x + 35, 280) +
              support(x + 175, 280) +
              arrow(x + 105, 205, x + 105, 278, "F")
            : i === 2
              ? shaft(x + 20, 280, 175)
              : rect(x + 25, 220, 165, 120, "paper") +
                dim(x + 40, 300, x + 175, 300, "d / L")) +
        note(
          x + 20,
          395,
          [
            ["功率 / 转速 / 寿命", "环境 / 维护要求"],
            ["力、转矩与支反力", "载荷谱与工况系数"],
            ["强度 / 刚度 / 配合", "材料 / 尺寸 / 圆角"],
            ["基准 / 公差 / 粗糙度", "加工 / 装配 / 检验"],
          ][i],
        ) +
        (i < 3 ? arrow(x + 215, 110, x + 250, 110) : "")
      );
    })
    .join("");
drawings["failure-modes"] = () =>
  [0, 1, 2, 3]
    .map((i) => {
      const x = 55 + i * 235;
      return (
        panel(x, 125, 215, 355, ["断裂", "塑性变形", "接触点蚀", "磨损"][i]) +
        (i === 0
          ? rect(x + 35, 255, 145, 65, "steel") +
            path(`M${x + 100} 250l-14 20 25 15-20 35`, "force")
          : i === 1
            ? path(
                `M${x + 30} 240Q${x + 105} 360 ${x + 180} 240L${x + 180} 290Q${x + 105} 410 ${x + 30} 290Z`,
                "steel",
              )
            : i === 2
              ? toothBlock(x + 12, 220) +
                [65, 89, 105, 125]
                  .map((a, j) => circle(x + a, 280 + (j % 2) * 12, 6, "pit"))
                  .join("")
              : rect(x + 30, 245, 155, 80, "steel") +
                Array.from({ length: 7 }, (_, j) =>
                  path(`M${x + 45} ${260 + j * 8}l120 5`, "scratch"),
                ).join("")) +
        text(
          x + 20,
          430,
          ["裂纹扩展至断开", "卸载后不能恢复", "表层疲劳剥落", "材料逐渐流失"][
            i
          ],
          "small",
        )
      );
    })
    .join("");
drawings["design-criteria"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 50 + i * 315;
      return (
        panel(
          x,
          110,
          290,
          385,
          ["强度：是否破坏", "刚度：变形是否过大", "稳定性：是否失稳"][i],
        ) +
        (i < 2
          ? rect(x + 25, 270, 240, 30, "steel") +
            support(x + 35, 300) +
            support(x + 255, 300) +
            arrow(x + 145, 180, x + 145, 265, "F") +
            (i === 0
              ? path(`M${x + 145} 270l-8 12 15 8-8 10`, "force")
              : path(`M${x + 30} 305Q${x + 145} 365 ${x + 260} 305`, "force"))
          : line(x + 145, 205, x + 145, 375, "axis") +
            path(`M${x + 145} 205Q${x + 235} 290 ${x + 145} 375`, "coil") +
            support(x + 145, 375) +
            arrow(x + 145, 155, x + 145, 205, "P")) +
        text(
          x + 20,
          455,
          ["σ ≤ [σ]", "y ≤ [y]，θ ≤ [θ]", "P < Pcr（含稳定安全度）"][i],
          "small",
        )
      );
    })
    .join("");
drawings["material-selection"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 70 + i * 310;
      let micro = rect(x + 25, 205, 220, 170, "steel");
      for (let k = 0; k < 22; k++) {
        const a = x + 40 + ((k * 67) % 185),
          b = 222 + ((k * 43) % 130);
        micro +=
          i === 0
            ? path(`M${a} ${b}l22 8-12 15`, "ink")
            : i === 1
              ? circle(a, b, 7, "dark")
              : path(`M${a} ${b}l18 -10 16 16-15 20Z`, "fine");
      }
      return (
        panel(
          x,
          120,
          270,
          365,
          ["灰铸铁：片状石墨", "球墨铸铁：球状石墨", "钢：晶粒与组织"][i],
        ) +
        micro +
        note(
          x + 20,
          420,
          [
            ["减振 / 铸造成形", "注意缺口与脆性"],
            ["球化改善承载能力", "性能取决于牌号与处理"],
            ["可热处理、适用面广", "兼顾韧性与制造工艺"],
          ][i],
        )
      );
    })
    .join("");
drawings["stress-cycle"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 55 + i * 315,
        y = 305,
        amp = 65,
        mean = i === 0 ? 0 : 65;
      const pts = Array.from({ length: 181 }, (_, k) => ({
        x: x + 35 + k * 1.2,
        y: y - mean - amp * Math.sin((k * Math.PI) / 45),
      }));
      return (
        panel(
          x,
          110,
          295,
          390,
          ["对称循环 r = −1", "脉动循环 r = 0", "一般循环 0 < r < 1"][i],
        ) +
        axis(x + 20, y, x + 275, y) +
        axis(x + 35, 170, x + 35, 390) +
        path(
          linePath(pts.map((p) => ({ ...p, y: i === 2 ? p.y - 35 : p.y }))),
          "force",
        ) +
        line(
          x + 40,
          y - mean - (i === 2 ? 35 : 0),
          x + 265,
          y - mean - (i === 2 ? 35 : 0),
          "pitch",
        ) +
        note(
          x + 20,
          435,
          [
            ["σm = 0", "σa = σmax"],
            ["σmin = 0", "σm = σa = σmax/2"],
            ["σm > σa > 0", "r = σmin / σmax"],
          ][i],
        )
      );
    })
    .join("");
drawings["notch-stress"] = () =>
  [0, 1]
    .map((i) => {
      const x = 65 + i * 475;
      return (
        panel(x, 105, 440, 390, i ? "圆角过渡" : "尖锐轴肩") +
        path(
          `M${x + 45} 235h110${i ? "q30 0 30 -30" : "v-30h30"}h160v150H${x + 185}${i ? "q0 -30 -30 -30" : "v-30h-30"}H${x + 45}Z`,
          "steel",
        ) +
        Array.from({ length: 6 }, (_, j) =>
          path(
            `M${x + 50} ${250 + j * 15}C${x + 160} ${250 + j * 15} ${x + 150} ${218 + j * 23} ${x + 340} ${220 + j * 23}`,
            "stress",
          ),
        ).join("") +
        arrow(x + 10, 280, x + 45, 280) +
        arrow(x + 350, 280, x + 415, 280) +
        note(x + 25, 435, [
          i ? "过渡平缓，局部峰值通常降低" : "截面突变，局部应力增大",
          "彩色线仅表示应力流趋势，非有限元结果",
        ])
      );
    })
    .join("");
// Lubrication, threaded and shaft connections.
drawings["film-regimes"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 55 + i * 315,
        gap = [18, 18, 65][i],
        top = 255 - gap / 2,
        bottom = 255 + gap / 2;
      const peak = (y, dir) =>
        Array.from(
          { length: 11 },
          (_, j) =>
            `${j ? "L" : "M"}${x + 25 + j * 24} ${y + dir * (j % 2 ? (i === 1 && j % 3 ? 10 : 18) : 0)}`,
        ).join(" ");
      return (
        panel(x, 110, 295, 385, ["边界润滑", "混合润滑", "全膜润滑"][i]) +
        rect(x + 25, 200, 240, 145, "oil") +
        path(`${peak(top, 1)}V175H${x + 25}Z`, "hatch") +
        path(`${peak(bottom + 18, -1)}V360H${x + 25}Z`, "hatch2") +
        arrow(x + 45, 390, x + 205, 390, "相对运动", "flow") +
        note(
          x + 20,
          440,
          [
            ["吸附膜很薄", "粗糙峰显著接触"],
            ["部分油膜分隔", "仍有局部峰体接触"],
            ["连续流体膜承载", "两固体表面分隔"],
          ][i],
        )
      );
    })
    .join("");
drawings["wear-modes"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 55 + i * 315;
      return (
        panel(x, 110, 295, 385, ["黏着磨损", "磨粒磨损", "接触疲劳磨损"][i]) +
        rect(x + 25, 290, 240, 70, "hatch") +
        rect(x + 25, 200, 240, 60, "steel") +
        (i === 0
          ? path(`M${x + 100} 260l20 -10 20 20 10 20h-60Z`, "gold") +
            path(`M${x + 90} 276l50 4`, "force")
          : i === 1
            ? path(`M${x + 90} 265l30 -15 32 25-30 28Z`, "gold") +
              path(`M${x + 150} 292h90`, "force")
            : path(`M${x + 75} 323l32 -20 26 13 32 -14 28 10`, "force") +
              path(`M${x + 160} 290q25 30 50 0`, "paper")) +
        arrow(x + 70, 175, x + 210, 175, "滑动", "flow") +
        note(
          x + 20,
          425,
          [
            ["微凸体焊合后剪断", "可发生材料转移"],
            ["硬质颗粒或硬峰犁削", "形成方向性沟槽"],
            ["交变接触应力促生裂纹", "扩展后出现表层剥落"],
          ][i],
        )
      );
    })
    .join("");
drawings["lubrication-circuit"] = () =>
  rect(90, 345, 230, 125, "hatch") +
  rect(105, 380, 200, 70, "oil") +
  circle(400, 250, 45, "metal") +
  path("M380 270l40 -20-40 -20Z", "blue") +
  rect(530, 215, 100, 70, "paper") +
  path("M540 270l80 -45", "guide") +
  bearing(800, 250, 85) +
  path("M205 400V250H350M450 250H530M630 250H710M800 335V425H320", "flow", {
    "marker-end": "url(#flow)",
  }) +
  path("M470 250V155H210V345", "flow", { "marker-end": "url(#flow)" }) +
  path("M445 155l25 -20 25 20-25 20Z", "gold") +
  text(120, 500, "油箱", "small") +
  text(365, 320, "油泵", "small") +
  text(535, 320, "过滤器", "small") +
  text(750, 365, "轴承回油", "small") +
  text(410, 110, "溢流阀限压支路", "small") +
  arrow(650, 250, 690, 250, "供油", "flow");
drawings["thread-geometry"] = () =>
  panel(50, 110, 550, 380, "轴向牙型（外螺纹）") +
  path(
    "M90 300L120 250H140L180 320H200L240 250H260L300 320H320L360 250H380L420 320H440L480 250H500L540 300V365H90Z",
    "steel",
  ) +
  line(80, 250, 555, 250, "pitch") +
  line(80, 285, 555, 285, "pitch") +
  line(80, 320, 555, 320, "pitch") +
  dim(130, 210, 250, 210, "螺距 p") +
  path("M168 295Q188 274 211 293", "force") +
  text(167, 266, "60°", "small") +
  text(90, 435, "截平牙顶与牙底；中径线穿过牙厚＝槽宽处", "small") +
  panel(625, 110, 325, 380, "螺距与导程") +
  note(650, 180, [
    "p：相邻牙的轴向距离",
    "L：同一条螺旋转一圈前进量",
    "单线：L = p",
    "双线：L = 2p",
  ]) +
  path("M660 385l220 -80M660 410l220 -80", "thread") +
  dim(660, 450, 880, 450, "示意双线，勿把p当成L");
drawings["bolt-joint-types"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 55 + i * 315;
      return (
        panel(x, 110, 295, 390, ["通孔螺栓", "双头螺柱", "螺钉"][i]) +
        rect(x + 40, 230, 210, 65, "hatch") +
        rect(x + 40, 295, 210, 110, "hatch2") +
        rect(x + 126, 210, 42, i ? 160 : 210, "paper") +
        (i === 0
          ? bolt(x + 147, 220, 210)
          : i === 1
            ? rect(x + 132, 190, 30, 180, "steel") +
              rect(x + 117, 215, 60, 25, "metal") +
              Array.from({ length: 9 }, (_, k) =>
                line(x + 132, 325 + k * 5, x + 162, 317 + k * 5, "fine"),
              ).join("")
            : bolt(x + 147, 225, 135).replace(
                /<rect x="-28"[^>]*><\/rect>/,
                "",
              )) +
        axis(x + 147, 160, x + 147, 450) +
        text(
          x + 20,
          465,
          [
            "两板通孔，外侧螺母夹紧",
            "一端旋入基体，一端配螺母",
            "头部夹紧，螺纹旋入基体",
          ][i],
          "small",
        )
      );
    })
    .join("");
drawings["locking-methods"] = () =>
  panel(50, 110, 440, 385, "槽形螺母＋开口销") +
  rect(170, 180, 60, 220, "steel") +
  path("M135 260v-55h35v25h25v-25h25v25h25v-25h25v110H135Z", "metal") +
  path("M120 270h175q20 0 20 12q0 12-20 12H145l-40 30M145 294l-40 -9", "pin") +
  leader(295, 280, 310, 360, "销穿过螺栓孔") +
  panel(515, 110, 435, 385, "止动垫圈＋圆螺母") +
  circle(730, 290, 105, "gold") +
  circle(730, 290, 78, "steel") +
  circle(730, 290, 40, "paper") +
  rect(720, 240, 20, 20, "gold") +
  path("M800 220l38 -32 17 20-42 35Z", "gold") +
  leader(730, 250, 775, 165, "内舌入轴槽") +
  leader(826, 213, 760, 435, "外舌折入螺母槽");
drawings["spline-section"] = () => {
  const cx = 300,
    cy = 290;
  let pts = [];
  for (let i = 0; i < 12; i++) {
    for (const [a, r] of [
      [-0.22, 105],
      [-0.22, 130],
      [0.22, 130],
      [0.22, 105],
    ])
      pts.push(point(cx, cy, r, (i * Math.PI) / 6 + a));
  }
  return (
    circle(cx, cy, 165, "hatch2") +
    path(linePath(pts, true), "steel") +
    circle(cx, cy, 52, "paper") +
    Array.from({ length: 8 }, (_, i) => {
      const p = point(cx, cy, 115, (i * Math.PI) / 4);
      return arrow(
        p.x,
        p.y,
        p.x - 25 * Math.sin((i * Math.PI) / 4),
        p.y + 25 * Math.cos((i * Math.PI) / 4),
      );
    }).join("") +
    panel(540, 150, 400, 295, "传递转矩的工作面") +
    note(565, 220, [
      "周向：由多组齿侧承受挤压",
      "径向定心：由所选定心方式决定",
      "齿数多 ≠ 每个齿分担完全相同",
      "图示矩形花键，非渐开线花键",
    ]) +
    axis(120, cy, 490, cy)
  );
};
drawings["key-load"] = () =>
  panel(50, 110, 420, 385, "端面：侧面受压，顶面留隙") +
  circle(255, 290, 125, "hatch2") +
  circle(255, 290, 82, "steel") +
  rect(227, 195, 56, 42, "gold") +
  line(227, 189, 283, 189, "force") +
  arrow(180, 207, 226, 207, "轮毂") +
  arrow(330, 225, 284, 225, "轴") +
  panel(495, 110, 455, 385, "俯视：圆头平键有效长度") +
  rect(545, 245, 350, 90, "steel") +
  rect(580, 265, 280, 50, "gold", 25) +
  line(605, 250, 605, 345, "guide") +
  line(835, 250, 835, 345, "guide") +
  dim(605, 390, 835, 390, "l = L − b") +
  dim(580, 215, 860, 215, "L") +
  note(535, 445, ["挤压面积约为 (h/2)l；校核接触强度"]);
drawings["pin-joints"] = () =>
  [0, 1]
    .map((i) => {
      const x = 65 + i * 470;
      return (
        panel(x, 110, 435, 385, i ? "双剪：两个剪切面" : "单剪：一个剪切面") +
        rect(x + 70, 210, 120, 140, "hatch") +
        rect(x + 190, 210, 100, 140, "hatch2") +
        (i ? rect(x + 290, 210, 70, 140, "hatch") : "") +
        rect(x + 40, 264, 340, 32, "steel") +
        line(x + 190, 185, x + 190, 375, "force") +
        (i ? line(x + 290, 185, x + 290, 375, "force") : "") +
        arrow(x + 240, 135, x + 240, 205, "F") +
        arrow(x + 120, 350, x + 120, 415, i ? "F/2" : "F") +
        (i ? arrow(x + 325, 350, x + 325, 415, "F/2") : "") +
        text(
          x + 35,
          465,
          i ? "τ = F/(2A)，A = πd²/4" : "τ = F/A，A = πd²/4",
          "small",
        )
      );
    })
    .join("");
drawings["rivet-lap"] = () =>
  rect(90, 230, 540, 70, "hatch") +
  rect(375, 300, 530, 70, "hatch2") +
  [450, 560]
    .map(
      (x) =>
        rect(x - 20, 215, 40, 170, "steel") +
        path(`M${x - 40} 230q0 -45 40 -45t40 45Z`, "metal") +
        path(`M${x - 40} 370q0 45 40 45t40 -45Z`, "metal"),
    )
    .join("") +
  line(370, 300, 640, 300, "force") +
  arrow(90, 265, 45, 265, "F") +
  arrow(900, 335, 955, 335, "F") +
  leader(465, 300, 685, 150, "搭接面：铆钉受剪") +
  leader(432, 275, 195, 135, "孔壁接触：受挤压") +
  dim(375, 465, 450, 465, "边距") +
  text(570, 480, "连接板还需校核净截面拉伸与边缘撕裂", "small");
drawings["weld-throat"] = () =>
  rect(160, 355, 440, 65, "hatch") +
  rect(220, 140, 65, 215, "hatch2") +
  path("M285 235L405 355H285Z", "gold") +
  line(285, 355, 345, 295, "force") +
  dim(285, 455, 405, 455, "焊脚 h") +
  dim(455, 235, 455, 355, "h") +
  text(295, 312, "a", "subtitle") +
  panel(630, 145, 320, 310, "等焊脚直角焊缝") +
  note(655, 215, [
    "理论喉厚是根部到斜边的",
    "最短距离，而不是焊脚。",
    "a = h sin45°",
    "a ≈ 0.707h",
    "图示不含余高和根部熔深。",
  ]);
drawings["adhesive-lap"] = () =>
  [0, 1]
    .map((i) => {
      const x = 65 + i * 470;
      return (
        panel(x, 110, 435, 385, i ? "对称双搭接" : "单搭接") +
        rect(x + 30, 245, 245, 45, "steel") +
        rect(x + 180, 300, 225, 45, "metal") +
        rect(x + 180, 290, 95, 10, "gold") +
        (i
          ? rect(x + 180, 190, 225, 45, "metal") +
            rect(x + 180, 235, 95, 10, "gold")
          : "") +
        arrow(x + 110, 267, x + 20, 267, "F") +
        arrow(x + 310, i ? 267 : 322, x + 410, i ? 267 : 322, "F") +
        (i
          ? ""
          : path(`M${x + 170} 280q-30 45 5 75`, "force", {
              "marker-end": "url(#arrow)",
            })) +
        note(x + 25, 420, [
          i ? "两侧胶层分担剪切，传力更对称" : "偏心传力产生附加弯曲和端部剥离",
          "黄色薄层为胶层；厚度已放大",
        ])
      );
    })
    .join("");
drawings["press-fit"] = () =>
  circle(300, 290, 160, "hatch2") +
  circle(300, 290, 105, "steel") +
  Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6,
      p = point(300, 290, 145, a),
      q = point(300, 290, 107, a);
    return arrow(p.x, p.y, q.x, q.y);
  }).join("") +
  circle(300, 290, 105, "contact") +
  panel(540, 115, 410, 375, "装配后：接触压力形成摩擦能力") +
  note(565, 185, [
    "接触直径 d，配合长度 l",
    "接触面积 A = πdl",
    "均匀压力近似：",
    "T ≤ μp(πdl)·d/2",
    "轴向承载：F ≤ μpπdl",
    "同时承受转矩与轴向力时需联合校核。",
  ]) +
  text(220, 485, "箭头：轮毂作用于轴的压力", "small");
drawings["v-belt-section"] = () =>
  path("M160 160H290L355 360H445L510 160H640V440H160Z", "hatch") +
  path("M302 180H498L449 330H351Z", "dark") +
  line(302, 180, 351, 330, "contact") +
  line(498, 180, 449, 330, "contact") +
  arrow(210, 240, 330, 270, "法向力") +
  arrow(590, 240, 470, 270, "法向力") +
  dim(575, 330, 575, 360, "底隙") +
  leader(355, 330, 690, 340, "带底悬空") +
  leader(480, 235, 690, 180, "侧面接触工作") +
  text(200, 485, "楔紧作用提高摩擦能力；磨损后不能让带底落到槽底。", "small");
drawings["belt-tensioner"] = () =>
  circle(240, 260, 90, "steel") +
  circle(660, 260, 130, "steel") +
  circle(240, 260, 25, "paper") +
  circle(660, 260, 35, "paper") +
  path(
    "M231 170L648 131A130 130 0 1 1 648 389L231 350A90 90 0 0 1 231 170Z",
    "belt",
  ) +
  rect(110, 375, 275, 45, "hatch") +
  rect(140, 388, 210, 15, "dark", 7) +
  [170, 310].map((x) => circle(x, 396, 13, "gold")).join("") +
  arrow(175, 455, 320, 455, "底座沿滑槽平移") +
  dim(240, 110, 660, 110, "中心距 a 可调") +
  text(560, 475, "停机调节 → 复核张紧力 → 锁紧底座", "small");
drawings["chain-exploded"] = () => {
  let s = "";
  for (const [x, y, c] of [
    [100, 265, "metal"],
    [280, 265, "metal"],
    [640, 265, "metal"],
    [820, 265, "metal"],
  ])
    s +=
      rect(x, y, 65, 135, c, 20) +
      circle(x + 32, y + 30, 15, "paper") +
      circle(x + 32, y + 105, 15, "paper");
  for (const y of [295, 370])
    s +=
      rect(95, y - 10, 790, 20, "steel", 10) +
      rect(355, y - 22, 275, 44, "gold", 18) +
      rect(430, y - 35, 125, 70, "steel", 25) +
      circle(430, y, 29, "metal") +
      circle(430, y, 17, "gold");
  return (
    s +
    leader(130, 330, 75, 135, "外链板：固定销轴") +
    leader(307, 285, 275, 195, "内链板：固定套筒") +
    leader(385, 285, 490, 110, "套筒与销轴构成铰链") +
    leader(490, 272, 660, 175, "滚子绕套筒转动") +
    text(
      180,
      480,
      "同一内链节两套筒轴线平行；分解位置仅用于辨认零件。",
      "small",
    )
  );
};
drawings["chain-wear"] = () =>
  panel(50, 110, 555, 385, "相同节数：磨损后累计节距增大") +
  [0, 1]
    .map((i) => {
      const p = 66 + i * 8,
        y = 240 + i * 120;
      return (
        Array.from(
          { length: 6 },
          (_, j) =>
            line(100 + j * p, y, 100 + (j + 1) * p, y, "plate-outer") +
            circle(100 + j * p, y, 10, "ball"),
        ).join("") +
        circle(100 + 6 * p, y, 10, "ball") +
        dim(
          100,
          y - 35,
          100 + 6 * p,
          y - 35,
          i ? "磨损后长度 L₂" : "原始长度 L₁",
        )
      );
    })
    .join("") +
  panel(630, 110, 320, 385, "局部磨损示意（放大）") +
  circle(790, 275, 65, "gold") +
  circle(790, 275, 43, "paper") +
  circle(805, 275, 27, "steel") +
  arrow(790, 275, 850, 275, "载荷") +
  note(655, 395, [
    "销轴 / 套筒间隙增加",
    "ΔL/L₁ = (L₂−L₁)/L₁",
    "磨损限值需按具体链条规定",
  ]);
// Gears, lubrication supports and rolling bearings.
drawings["gear-dimensions"] = () =>
  gear(300, 290, 28, 9) +
  circle(300, 290, 126 * Math.cos(Math.PI / 9), "base") +
  circle(300, 290, 135, "guide") +
  circle(300, 290, 114.75, "root") +
  axis(140, 290, 460, 290) +
  leader(300, 155, 490, 120, "齿顶圆 da = d + 2m") +
  leader(425, 290, 590, 205, "分度圆 d = mz") +
  leader(300, 408.4, 530, 365, "基圆 db = d cosα") +
  leader(185.25, 290, 80, 450, "齿根圆 df = d − 2.5m") +
  note(620, 300, [
    "标准全齿高、无变位",
    "α = 20°",
    "齿厚 s = πm/2",
    "齿距 p = πm",
  ]);
drawings["gear-failures"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 55 + i * 315;
      return (
        panel(x, 110, 295, 385, ["齿根弯曲疲劳", "齿面点蚀", "齿面胶合"][i]) +
        toothBlock(x + 50, 220) +
        (i === 0
          ? path(`M${x + 90} 319l18 -8 8 8 10 -6`, "force") +
            arrow(x + 200, 225, x + 165, 265, "Fn")
          : i === 1
            ? Array.from({ length: 11 }, (_, k) =>
                circle(
                  x + 120 + ((k * 13) % 48),
                  260 + ((k * 17) % 36),
                  3 + (k % 3),
                  "pit",
                ),
              ).join("")
            : Array.from({ length: 7 }, (_, k) =>
                path(`M${x + 112 + k * 8} 250l-4 45`, "scratch"),
              ).join("")) +
        note(
          x + 20,
          430,
          [
            ["危险区在齿根过渡附近", "交变弯曲使裂纹扩展"],
            ["反复接触形成小坑", "还应区分正常磨合与损伤"],
            ["高滑动、高温与润滑失效", "形成沿滑动方向的擦伤"],
          ][i],
        )
      );
    })
    .join("");
drawings["helical-contact"] = () => {
  const x = 240,
    y = 285,
    z = 24,
    m = 7,
    b = 110;
  const back = gearGeometry(x + b, y - 60, z, m, 0.5),
    front = gearGeometry(x, y, z, m, 0);
  let s = path(back.path, "steel");
  for (let i = 0; i < z; i++) {
    const a = (i * 2 * Math.PI) / z;
    const p = point(x, y, front.ra, a),
      q = point(x + b, y - 60, front.ra, a + 0.5);
    s += path(
      `M${p.x} ${p.y}Q${(p.x + q.x) / 2 + 6} ${(p.y + q.y) / 2 - 5} ${q.x} ${q.y}`,
      "tooth",
    );
  }
  return (
    s +
    gear(x, y, z, m) +
    axis(130, 345, 490, 145) +
    leader(320, 200, 495, 130, "齿线绕分度圆柱形成螺旋") +
    panel(560, 190, 390, 290, "从法向力分解") +
    note(585, 250, [
      "端面：圆周力 Ft 与径向力 Fr",
      "轴向：Fa = Ft tan|β|",
      "Fr = Ft tanαn / cosβ",
      "法向模数 mn = mt cosβ",
      "图为单轮齿线示意，非制造齿面。",
    ])
  );
};
drawings["worm-geometry"] = () =>
  panel(50, 110, 470, 385, "沿分度圆柱切开展开") +
  rect(90, 200, 380, 220, "paper") +
  path("M90 420L470 200", "thread") +
  dim(90, 460, 470, 460, "圆周长 πd₁") +
  dim(490, 200, 490, 420, "导程 L") +
  path("M160 420A70 70 0 0 0 150 385", "force") +
  text(168, 400, "γ", "subtitle") +
  panel(545, 110, 405, 385, "导程角的物理含义") +
  note(575, 185, [
    "tanγ = L/(πd₁)",
    "L = z₁ px",
    "γ：螺旋线与端面方向的夹角",
    "px：轴向齿距",
    "同一分度直径下，导程越大，γ越大。",
  ]) +
  rect(610, 370, 270, 50, "steel", 20) +
  Array.from({ length: 7 }, (_, i) =>
    path(`M${630 + i * 33} 370l28 50`, "thread"),
  ).join("");
drawings["worm-thermal"] = () =>
  rect(160, 220, 490, 220, "hatch", 20) +
  rect(190, 245, 430, 165, "paper", 12) +
  rect(190, 340, 430, 70, "oil") +
  gear(410, 325, 30, 4) +
  rect(255, 250, 320, 24, "steel") +
  Array.from({ length: 7 }, (_, i) =>
    rect(660 + i * 17, 250, 8, 150, "steel"),
  ).join("") +
  [250, 360, 470, 580, 710].map((x) => heat(x, 200)).join("") +
  arrow(65, 285, 155, 285, "P入") +
  arrow(650, 330, 825, 330, "P出") +
  note(735, 445, ["P损 = P入 − P出", "稳态：发热率＝散热率"]) +
  text(
    190,
    490,
    "油液携热 → 箱壁导热 → 对流与辐射散热；散热片增加面积。",
    "small",
  );
drawings["bearing-split"] = () =>
  rect(130, 350, 470, 95, "hatch") +
  path("M150 350V300Q365 90 580 300V350H500Q365 190 230 350Z", "hatch") +
  path("M150 200Q365 -10 580 200V245H500Q365 85 230 245H150Z", "hatch2") +
  path("M240 320Q365 175 490 320L470 335Q365 215 260 335Z", "gold") +
  circle(365, 290, 65, "steel") +
  bolt(180, 180, 250) +
  bolt(550, 180, 250) +
  leader(360, 110, 670, 145, "上盖：与下座定位") +
  leader(440, 275, 670, 260, "可更换轴瓦") +
  leader(365, 300, 670, 340, "轴颈") +
  text(
    200,
    490,
    "上盖沿竖直方向移开；装配时检查轴瓦背部接触与工作间隙。",
    "small",
  );
drawings["hydrodynamic-wedge"] = () =>
  rect(100, 300, 740, 30, "steel") +
  path("M100 190L840 270V300H100Z", "oil") +
  path("M100 140L840 220V270L100 190Z", "hatch") +
  arrow(170, 350, 740, 350, "下表面速度 U", "flow") +
  dim(80, 190, 80, 300, "h₁") +
  dim(890, 270, 890, 300, "h₂") +
  axis(110, 485, 840, 485) +
  axis(110, 485, 110, 385) +
  path("M120 485C290 335 520 390 820 485", "force") +
  text(130, 400, "表压 p", "small") +
  text(850, 490, "x", "small") +
  text(370, 130, "收敛间隙 h₁ > h₂", "small") +
  text(350, 525, "下图为表压分布趋势；两端与环境连通。", "small");
drawings["thrust-pad"] = () =>
  rect(100, 180, 760, 45, "steel") +
  arrow(230, 145, 730, 145, "推力盘速度 U", "flow") +
  path("M180 285L740 235V275L180 325Z", "gold") +
  path("M180 225H740V235L180 285Z", "oil") +
  circle(470, 335, 27, "steel") +
  support(470, 363) +
  arrow(450, 90, 450, 173, "轴向载荷 W") +
  dim(150, 225, 150, 285, "入口") +
  dim(790, 225, 790, 235, "出口") +
  leader(470, 335, 620, 440, "支点允许瓦块倾转") +
  text(
    120,
    490,
    "图为单瓦沿运动方向展开；油楔随推力盘运动形成承载能力。",
    "small",
  );
drawings["bearing-types"] = () =>
  [0, 1, 2, 3]
    .map((i) => {
      const x = 45 + i * 240;
      let s =
        rect(x + 50, 215, 140, 25, "hatch") +
        rect(x + 50, 325, 140, 25, "hatch") +
        rect(x + 50, 275, 140, 15, "hatch2");
      if (i === 0 || i === 2)
        s +=
          circle(x + 120, 255, 21, "ball") + circle(x + 120, 307, 21, "ball");
      else
        s += path(
          i === 1
            ? `M${x + 90} 240h60v35h-60Z M${x + 90} 290h60v35h-60Z`
            : `M${x + 90} 240l65 10v25l-65 -10Z M${x + 90} 300l65 -10v25l-65 10Z`,
          "steel",
        );
      if (i > 1) s += line(x + 65, 360, x + 170, 200, "force");
      return (
        panel(
          x,
          110,
          225,
          385,
          ["深沟球轴承", "圆柱滚子轴承", "角接触球轴承", "圆锥滚子轴承"][i],
        ) +
        s +
        note(
          x + 18,
          410,
          [
            ["以径向载荷为主", "可承受一定轴向载荷"],
            ["径向承载能力较高", "轴向能力取决于挡边"],
            ["径向＋单向轴向", "压力线倾斜"],
            ["径向＋单向轴向", "滚子为截锥形"],
          ][i],
        )
      );
    })
    .join("");
drawings["bearing-arrangement"] = () =>
  rect(120, 165, 760, 80, "hatch") +
  rect(120, 355, 760, 80, "hatch") +
  shaft(80, 300, 840) +
  bearingSide(250, 300) +
  bearingSide(720, 300) +
  rect(205, 220, 18, 140, "gold") +
  rect(278, 220, 18, 140, "gold") +
  rect(665, 220, 8, 140, "gold") +
  rect(770, 220, 8, 140, "gold") +
  arrow(700, 145, 755, 145, "外圈轴向滑移") +
  arrow(450, 300, 620, 300, "热伸长") +
  text(155, 480, "固定端：双向定位轴系", "small") +
  text(605, 480, "游动端：留轴向移动空间", "small");
drawings["bearing-db-df"] = () =>
  [0, 1]
    .map((i) => {
      const x = 55 + i * 475;
      let s = rect(x + 35, 270, 365, 35, "steel");
      for (const cx of [x + 125, x + 310]) s += bearingSide(cx, 285);
      const a = i ? x + 165 : x + 85,
        b = i ? x + 270 : x + 350;
      s += path(
        `M${2 * (x + 125) - a} 199L${a} 285L${2 * (x + 125) - a} 371M${2 * (x + 310) - b} 199L${b} 285L${2 * (x + 310) - b} 371`,
        "force",
      );
      return (
        panel(x, 110, 435, 390, i ? "面对面 DF / X形" : "背对背 DB / O形") +
        s +
        dim(a, 420, b, 420, "压力中心间距") +
        text(
          x + 25,
          470,
          i
            ? "压力线向内交于轴线，支点距离较小"
            : "压力线向外交于轴线，支点距离较大",
          "small",
        )
      );
    })
    .join("");
drawings["coupling-misalignment"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 55 + i * 315;
      return (
        panel(
          x,
          110,
          295,
          385,
          ["径向位移 Δr", "角向位移 Δθ", "轴向位移 Δx"][i],
        ) +
        rect(x + 20, 250, 110, 55, "steel") +
        group(
          x + 165,
          275,
          tag(
            "g",
            { transform: i === 1 ? "rotate(-14)" : "" },
            rect(0, i === 0 ? 10 : -25, 105, 55, "steel"),
          ),
        ) +
        rect(x + 125, 230, 20, 95, "metal") +
        rect(
          x + 150 + (i === 2 ? 25 : 0),
          i === 0 ? 265 : 230,
          20,
          95,
          "metal",
        ) +
        axis(x + 15, 277, x + 130, 277) +
        axis(x + 170, i === 0 ? 313 : 277, x + 275, i === 0 ? 313 : 277) +
        text(
          x + 20,
          425,
          ["两轴线平行但不重合", "两轴线有夹角", "两轴端距离发生变化"][i],
          "small",
        ) +
        text(x + 20, 460, "补偿能力取决于联轴器类型", "small")
      );
    })
    .join("");
drawings["clutch-friction"] = () =>
  rect(120, 165, 710, 235, "hatch", 10) +
  rect(150, 190, 650, 185, "paper") +
  rect(75, 270, 850, 40, "steel") +
  Array.from({ length: 8 }, (_, i) =>
    rect(
      300 + i * 48,
      i % 2 ? 235 : 190,
      22,
      i % 2 ? 140 : 140,
      i % 2 ? "gold" : "steel",
    ),
  ).join("") +
  rect(720, 205, 35, 165, "metal") +
  arrow(865, 230, 760, 230, "压紧力 Fa") +
  leader(322, 205, 160, 120, "主动片连接外壳") +
  leader(395, 350, 550, 470, "从动片连接内毂") +
  text(90, 480, "摩擦面承受轴向压力；接合时通过摩擦力矩驱动输出轴。", "small");
drawings["shaft-fillet"] = () =>
  [0, 1]
    .map((i) => {
      const x = 65 + i * 470;
      return (
        panel(
          x,
          110,
          435,
          385,
          i ? "留出倒角包络：可贴紧" : "圆角过大：端面不能贴紧",
        ) +
        path(
          `M${x + 45} 230h135q${i ? 12 : 50} 0 ${i ? 12 : 50} 50h155v90H${x + 45}Z`,
          "steel",
        ) +
        path(`M${x + 200} 170h135v110H${x + 220}l-20 -20Z`, "hatch") +
        circle(x + 200, 270, i ? 12 : 40, "root") +
        leader(
          x + 208,
          272,
          x + 65,
          410,
          i ? "r 小于倒角允许尺寸" : "干涉区：检查安装圆角",
        ) +
        text(x + 30, 465, "示意为轴肩与轴承内圈的局部剖面", "small")
      );
    })
    .join("");
drawings["shaft-torsion"] = () =>
  circle(270, 290, 135, "steel") +
  axis(110, 290, 430, 290) +
  arrow(270, 290, 395, 290, "r") +
  Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4,
      p = point(270, 290, 115, a);
    return arrow(p.x, p.y, p.x - 50 * Math.sin(a), p.y + 50 * Math.cos(a));
  }).join("") +
  panel(505, 110, 445, 385, "实心圆轴：切应力与半径成正比") +
  axis(580, 385, 880, 385) +
  axis(580, 385, 580, 195) +
  path("M580 385L835 205", "force") +
  text(865, 415, "r", "small") +
  text(545, 190, "τ", "small") +
  note(620, 265, ["τ(r) = Tr/J", "J = πd⁴/32", "τmax = 16T/(πd³)"]) +
  text(135, 480, "切应力方向沿截面圆周切线", "small");
drawings["spring-end"] = () =>
  [0, 1]
    .map((i) => {
      const x = 65 + i * 470;
      return (
        panel(x, 110, 435, 385, i ? "闭口磨平端" : "开口端") +
        group(
          x + 90,
          190,
          tag(
            "g",
            { transform: "rotate(90 110 110)" },
            spring(0, 110, 220, 65, 5),
          ),
        ) +
        rect(x + 90, 415, 245, 15, "hatch") +
        (i
          ? line(x + 145, 410, x + 280, 410, "contact")
          : circle(x + 280, 413, 5, "red")) +
        text(
          x + 25,
          465,
          i
            ? "支承面较平整，端圈不全计入有效圈数"
            : "端部接触区域较小，支承形式不同",
          "small",
        )
      );
    })
    .join("");
drawings["spring-stability"] = () =>
  [0, 1]
    .map((i) => {
      const x = 65 + i * 470;
      const pts = Array.from({ length: 501 }, (_, j) => {
        const t = j / 500;
        return {
          x:
            x +
            215 +
            (i ? 0 : 65 * Math.sin(t * Math.PI)) +
            65 * Math.cos(t * 14 * Math.PI),
          y: 200 + 200 * t,
        };
      });
      return (
        panel(
          x,
          110,
          435,
          385,
          i ? "导杆约束，留工作间隙" : "细长弹簧，关注侧向失稳",
        ) +
        (i ? rect(x + 197, 180, 36, 245, "steel") : "") +
        path(linePath(pts), "coil-shadow") +
        path(linePath(pts), "coil") +
        rect(x + 100, 410, 240, 20, "hatch") +
        arrow(x + 215, 145, x + 215, 195, "F") +
        text(
          x + 25,
          465,
          i
            ? "导杆与簧圈不能在工作时卡死"
            : "失稳示意；临界条件还与端部约束有关",
          "small",
        )
      );
    })
    .join("");
drawings["housing-ribs"] = () =>
  path("M150 220L630 130L850 255L380 355Z", "metal") +
  path("M150 220L380 355V445L150 310Z", "hatch") +
  path("M380 355L850 255V355L380 445Z", "steel") +
  [0, 1, 2]
    .map((i) =>
      path(`M${440 + i * 140} ${330 - i * 30}l-5 -130 85 112Z`, "metal"),
    )
    .join("") +
  circle(330, 205, 65, "hatch") +
  circle(330, 205, 40, "paper") +
  circle(680, 190, 65, "hatch") +
  circle(680, 190, 40, "paper") +
  arrow(330, 100, 330, 160, "轴承载荷") +
  leader(580, 240, 700, 115, "加强筋连接座孔与底脚") +
  text(
    155,
    490,
    "避免孤立的装饰筋；使载荷传递路径连续，并保留装配与加工空间。",
    "small",
  );
drawings["casting-details"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 55 + i * 315;
      return (
        panel(
          x,
          110,
          295,
          385,
          ["均匀壁厚", "转角圆滑过渡", "凸台与筋合理连接"][i],
        ) +
        (i === 0
          ? path(
              `M${x + 65} 190h155v185H${x + 65}v-30h125V220H${x + 65}Z`,
              "hatch",
            )
          : i === 1
            ? path(
                `M${x + 65} 190h35v125q0 30 30 30h110v35H${x + 100}q-35 0-35 -35Z`,
                "hatch",
              )
            : rect(x + 50, 345, 205, 35, "hatch") +
              rect(x + 110, 210, 70, 135, "hatch") +
              path(
                `M${x + 75} 345l35 -70v70Z M${x + 180} 345v-70l40 70Z`,
                "metal",
              )) +
        note(
          x + 20,
          430,
          [
            ["减少收缩差异", "避免局部厚大热节"],
            ["降低应力集中", "有利于充型与清理"],
            ["保证连接刚度", "兼顾壁厚与冷却"],
          ][i],
        )
      );
    })
    .join("");
drawings["housing-datums"] = () =>
  rect(150, 160, 650, 250, "hatch") +
  rect(190, 200, 570, 165, "paper") +
  circle(240, 285, 70, "steel") +
  circle(240, 285, 45, "paper") +
  circle(690, 285, 70, "steel") +
  circle(690, 285, 45, "paper") +
  rect(80, 274, 820, 22, "gold") +
  axis(65, 285, 925, 285) +
  rect(120, 420, 710, 25, "metal") +
  text(130, 470, "基准 A：安装底面", "small") +
  arrow(345, 485, 345, 447) +
  leader(520, 280, 540, 120, "镗杆与两端座孔同轴") +
  text(290, 360, "合箱后加工；剖分面按定位要求装配", "small");
drawings["reducer-layout"] = () =>
  [0, 1, 2]
    .map((i) => {
      const y = 185 + i * 120;
      return (
        shaft(100, y, 800) +
        group(
          0,
          0,
          group(180, y, bearingSide(0, 0), 0.6) +
            group(820, y, bearingSide(0, 0), 0.6),
          1,
        )
      );
    })
    .join("") +
  rect(345, 145, 25, 80, "metal") +
  rect(345, 225, 25, 160, "metal") +
  rect(625, 265, 25, 80, "metal") +
  rect(625, 345, 25, 160, "metal") +
  text(405, 155, "轴Ⅰ：z₁ = 20", "small") +
  text(405, 277, "轴Ⅱ：z₂ = 40；z₃ = 20", "small") +
  text(405, 455, "轴Ⅲ：z₄ = 40", "small") +
  text(
    165,
    525,
    "i总 = (z₂/z₁)(z₄/z₃) = 4；两级齿轮分别位于两个轴向平面。",
    "small",
  );
drawings["reducer-accessories"] = () =>
  rect(195, 200, 580, 240, "hatch", 18) +
  rect(220, 225, 530, 190, "paper", 12) +
  rect(220, 340, 530, 75, "oil") +
  rect(370, 175, 200, 30, "steel") +
  rect(255, 160, 35, 45, "steel") +
  rect(245, 145, 55, 20, "metal") +
  rect(765, 295, 30, 100, "paper") +
  rect(770, 340, 20, 45, "oil") +
  bolt(680, 415, 55) +
  circle(630, 185, 32, "steel") +
  circle(630, 185, 16, "paper") +
  leader(270, 155, 100, 110, "通气器") +
  leader(470, 185, 400, 110, "检查孔盖") +
  leader(630, 165, 710, 115, "吊耳") +
  leader(785, 340, 820, 245, "油标") +
  leader(680, 440, 750, 485, "低位放油塞") +
  text(250, 490, "油位按润滑方案确定，不应任意灌满箱体。", "small");
drawings["fits-overview"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 55 + i * 315;
      const holes = [
          [-0, 30],
          [0, 30],
          [0, 30],
        ][i],
        shafts = [
          [-40, -20],
          [10, 40],
          [45, 65],
        ][i];
      return (
        panel(x, 110, 295, 385, ["间隙配合", "过渡配合", "过盈配合"][i]) +
        axis(x + 20, 345, x + 275, 345) +
        rect(
          x + 55,
          345 - holes[1] * 2,
          65,
          (holes[1] - holes[0]) * 2,
          "blue",
        ) +
        rect(
          x + 160,
          345 - shafts[1] * 2,
          65,
          (shafts[1] - shafts[0]) * 2,
          "gold",
        ) +
        text(x + 62, 245, "孔", "small") +
        text(x + 172, 190, "轴", "small") +
        text(x + 25, 375, "零线：基本尺寸", "small") +
        note(
          x + 20,
          430,
          [
            ["Xmin > 0", "总能形成间隙"],
            ["可能间隙，也可能过盈", "取决于实际孔轴尺寸"],
            ["Xmax < 0", "总有过盈量"],
          ][i],
        )
      );
    })
    .join("");
drawings["surface-coatings"] = () =>
  [0, 1, 2]
    .map((i) => {
      const x = 55 + i * 315;
      return (
        panel(
          x,
          110,
          295,
          385,
          ["电镀：沉积金属层", "涂装：附着涂膜", "阳极氧化：转化膜"][i],
        ) +
        rect(x + 30, 285, 235, 90, "steel") +
        rect(
          x + 30,
          250,
          235,
          35,
          i === 0 ? "gold" : i === 1 ? "blue" : "hatch",
        ) +
        (i === 2
          ? Array.from({ length: 12 }, (_, j) =>
              line(x + 40 + j * 18, 250, x + 40 + j * 18, 275, "paperline"),
            ).join("")
          : "") +
        leader(x + 110, 270, x + 40, 205, "表层（厚度放大）") +
        note(
          x + 20,
          425,
          [
            ["耐蚀 / 耐磨 / 装饰", "基体、前处理与镀层共同决定性能"],
            ["阻隔环境介质", "附着与涂层完整性影响寿命"],
            ["如铝合金的氧化膜", "膜层与基体有转化生长关系"],
          ][i],
        )
      );
    })
    .join("");
drawings["heat-treatment"] = () =>
  [0, 1]
    .map((i) => {
      const x = 65 + i * 470;
      return (
        panel(
          x,
          110,
          435,
          390,
          i ? "感应淬火：局部加热淬硬" : "渗碳淬火：表面富碳后淬硬",
        ) +
        circle(x + 125, 270, 80, "gold") +
        circle(x + 125, 270, 62, "steel") +
        axis(x + 245, 375, x + 390, 375) +
        axis(x + 245, 375, x + 245, 190) +
        path(
          `M${x + 250} 210C${x + 290} 210 ${x + 290} 330 ${x + 345} 330H${x + 385}`,
          "force",
        ) +
        text(x + 245, 170, "硬度", "small") +
        text(x + 270, 410, "距表面深度", "small") +
        note(x + 25, 455, [
          i
            ? "表面组织改变，碳含量不因此增加"
            : "硬化表层承载，心部保留所需韧性",
        ])
      );
    })
    .join("");

export function renderFigure(meta, index) {
  if (!drawings[meta.id]) throw new Error("Missing drawing " + meta.id);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="600" viewBox="0 0 1000 600" role="img" aria-labelledby="title desc"><title id="title">${esc(meta.title)}</title><desc id="desc">${esc(meta.note)}</desc><defs>
 <linearGradient id="metal" x2="0.6" y2="1"><stop stop-color="#edf5fa"/><stop offset=".45" stop-color="#bbd0df"/><stop offset="1" stop-color="#7e9aad"/></linearGradient><linearGradient id="steel" x2="0" y2="1"><stop stop-color="#6c8da7"/><stop offset=".45" stop-color="#e0ebf3"/><stop offset="1" stop-color="#6c8da7"/></linearGradient><radialGradient id="ball" cx=".3" cy=".25"><stop stop-color="white"/><stop offset="1" stop-color="#47697d"/></radialGradient>
 <pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#e3ebf1"/><path d="M-2 2L2 -2M0 10L10 0M8 12L12 8" stroke="#8ba1b3" stroke-width="1"/></pattern><pattern id="hatch2" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#e8f2ee"/><path d="M0 0L10 10" stroke="#94b5a8" stroke-width="1"/></pattern>
 ${["arrow", "flow", "dim"].map((id) => `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="${id === "dim" ? 5 : 7}" markerHeight="${id === "dim" ? 5 : 7}" orient="auto-start-reverse"><path d="M1 1L9 5L1 9Z" fill="${id === "arrow" ? "#d45b33" : id === "flow" ? "#168979" : "#526879"}"/></marker>`).join("")}
 </defs><style>
 text{font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;fill:#1b364b}.label{font-size:21px}.small{font-size:17px}.subtitle{font-size:20px;font-weight:650}.title{font-size:27px;font-weight:700}.eyebrow{font-size:13px;letter-spacing:1.5px;fill:#607c8c}.footer{font-size:14px;fill:#587084}
 .metal,.steel,.ball,.hatch,.hatch2,.gold,.blue,.oil,.paper,.dark,.pit{stroke:#3b586a;stroke-width:1.8}.metal{fill:url(#metal)}.steel{fill:url(#steel)}.ball{fill:url(#ball)}.hatch{fill:url(#hatch)}.hatch2{fill:url(#hatch2)}.gold{fill:#e9ba66}.blue{fill:#70aacb}.oil{fill:#b8e5df;stroke:#40a99a}.paper{fill:#fff}.dark{fill:#334858}.pit{fill:#536774}.red{fill:#d45b33;stroke:none}
 .ink,.fine,.guide,.axis,.dimension,.pitch,.root,.base,.force,.flow,.contact,.thread,.tooth,.scratch,.stress,.paperline{fill:none;stroke:#3b586a;stroke-width:2}.fine{stroke-width:1}.guide{stroke:#8196a5;stroke-width:1.4}.axis{stroke:#a0afba;stroke-width:1.2;stroke-dasharray:10 4 2 4}.dimension{stroke:#526879;stroke-width:1.3}.pitch{stroke:#239588;stroke-width:1.4;stroke-dasharray:7 5}.root{stroke:#b98643;stroke-dasharray:4 4}.base{stroke:#9577bd;stroke-dasharray:7 4}.force{stroke:#d45b33;stroke-width:2.8}.flow{stroke:#168979;stroke-width:3}.contact{stroke:#109c86;stroke-width:5}.thread{stroke:#47697d;stroke-width:7;stroke-linecap:round}.tooth{stroke:#597a91;stroke-width:5}.scratch{stroke:#d06f3b;stroke-width:3}.stress{stroke:#ce724a;stroke-width:1.7}.paperline{stroke:white;stroke-width:5}.panel{fill:#f4f7f9;stroke:#dbe4eb;stroke-width:1}.belt{fill:none;stroke:#334858;stroke-width:12;stroke-linejoin:round}.cage{fill:none;stroke:#d2a65d;stroke-width:13}.coil-shadow{fill:none;stroke:#3b586a;stroke-width:12;stroke-linecap:round}.coil{fill:none;stroke:#aac3d4;stroke-width:7;stroke-linecap:round}.pin{fill:none;stroke:#be883c;stroke-width:8;stroke-linecap:round}.plate-outer{stroke:#395b74;stroke-width:18;stroke-linecap:round}.plate-inner{stroke:#9bb8c9;stroke-width:14;stroke-linecap:round}
 </style><rect width="1000" height="600" rx="16" fill="#fff"/>${text(40, 30, `MECHANICAL DESIGN · ${String(index + 1).padStart(2, "0")} / ENGINEERING FIGURE`, "eyebrow")}${text(40, 70, meta.title, "title")}${drawings[meta.id]()}${line(40, 550, 960, 550, "guide")}${text(40, 580, "独立绘制 · 教学示意 · 细节与比例以图下注释为准", "footer")}${text(960, 580, meta.id, "footer", "end")}</svg>\n`;
}
