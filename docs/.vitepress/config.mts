import { createMarkdownRenderer, defineConfig } from "vitepress";
import fs from "node:fs";
import path from "node:path";

const pagesBase = process.env.GITHUB_ACTIONS ? "/mechanical-design-wiki/" : "/";
const publicSite = "https://s1eep1y416-desig.github.io/mechanical-design-wiki";

const sidebar = [
  {
    text: "开始之前",
    items: [
      { text: "使用指南", link: "/guide/" },
      { text: "82 张工程图解", link: "/figures/" },
      { text: "教材目录与页码", link: "/guide/textbook" },
      { text: "学习路线", link: "/guide/roadmap" },
      { text: "符号与约定", link: "/guide/conventions" },
    ],
  },
  {
    text: "第一篇 · 总论",
    collapsed: false,
    items: [
      { text: "01 绪论", link: "/chapters/01-introduction" },
      { text: "02 机械设计总论", link: "/chapters/02-design-fundamentals" },
      { text: "03 机械零件的强度", link: "/chapters/03-strength" },
      {
        text: "04 摩擦、磨损及润滑概述",
        link: "/chapters/04-friction-wear-lubrication",
      },
    ],
  },
  {
    text: "第二篇 · 连接",
    collapsed: false,
    items: [
      {
        text: "05 螺纹连接和螺旋传动",
        link: "/chapters/05-threaded-connections",
      },
      {
        text: "06 键、花键、无键连接和销连接",
        link: "/chapters/06-keys-splines-pins",
      },
      {
        text: "07 铆接、焊接、胶接和过盈连接",
        link: "/chapters/07-riveting-welding-bonding",
      },
    ],
  },
  {
    text: "第三篇 · 机械传动",
    collapsed: false,
    items: [
      { text: "08 带传动", link: "/chapters/08-belt-drives" },
      { text: "09 链传动", link: "/chapters/09-chain-drives" },
      { text: "10 齿轮传动", link: "/chapters/10-gear-drives" },
      { text: "11 蜗杆传动", link: "/chapters/11-worm-drives" },
    ],
  },
  {
    text: "第四篇 · 轴系零、部件",
    collapsed: false,
    items: [
      { text: "12 滑动轴承", link: "/chapters/12-sliding-bearings" },
      { text: "13 滚动轴承", link: "/chapters/13-rolling-bearings" },
      { text: "14 联轴器和离合器", link: "/chapters/14-couplings-clutches" },
      { text: "15 轴", link: "/chapters/15-shafts" },
    ],
  },
  {
    text: "第五篇 · 其他零、部件",
    collapsed: false,
    items: [
      { text: "16 弹簧", link: "/chapters/16-springs" },
      { text: "17 机座和箱体简介", link: "/chapters/17-frames-housings" },
      { text: "18 减速器和变速器", link: "/chapters/18-reducers-variators" },
    ],
  },
  {
    text: "基础专题",
    collapsed: false,
    items: [
      { text: "公差与配合基础", link: "/fundamentals/fits" },
      { text: "表面处理", link: "/fundamentals/surface-treatment" },
      { text: "表面热处理", link: "/fundamentals/surface-heat-treatment" },
    ],
  },
  {
    text: "附录",
    collapsed: false,
    items: [
      { text: "核心公式速查", link: "/appendix/formulas" },
      { text: "国家标准与手册", link: "/appendix/standards" },
      { text: "单位、符号与换算", link: "/appendix/units" },
    ],
  },
];

// Build chapter sub-directories from the Markdown headings, so the sidebar
// stays in sync with the notes without maintaining a second manual list.
// Use the same parser and heading IDs as the pages, including repeated headings.
const navigationMarkdown = await createMarkdownRenderer(
  path.resolve(process.cwd(), "docs"),
  {
    math: true,
    headers: { level: [2, 3] },
  },
);
type Heading = { title: string; slug: string; children: Heading[] };
type NavItem = {
  text: string;
  link: string;
  collapsed?: boolean;
  items?: NavItem[];
};

function pageSections(link: string) {
  const file = path.resolve(process.cwd(), "docs", `${link.slice(1)}.md`);
  if (!fs.existsSync(file)) return [];
  const source = fs.readFileSync(file, "utf8");
  const env: { path: string; headers?: Heading[] } = { path: file };
  navigationMarkdown.render(source, env);
  const toItem = (heading: Heading): NavItem => ({
    text: heading.title,
    link: `${link}#${heading.slug}`,
    ...(heading.children?.length
      ? { items: heading.children.map(toItem), collapsed: true }
      : {}),
  });
  return (env.headers || []).map(toItem);
}

for (const group of sidebar as any[]) {
  for (const item of group.items ?? []) {
    if (
      typeof item.link === "string" &&
      /^\/(chapters|fundamentals)\//.test(item.link)
    ) {
      const sections = pageSections(item.link);
      if (sections.length) {
        item.collapsed = true;
        item.items = sections;
      }
    }
  }
}

export default defineConfig({
  base: pagesBase,
  lang: "zh-CN",
  title: "机械设计知识库",
  titleTemplate: ":title · 机械设计知识库",
  description:
    "以西北工业大学《机械设计》（第十版）十八章为骨架的开放学习笔记：概念梳理、核心公式、工程直觉与易错点。",
  cleanUrls: true,
  lastUpdated: true,
  sitemap: {
    hostname: "https://s1eep1y416-desig.github.io",
    transformItems(items) {
      return items
        .filter((item) => item.url.replace(/^\/+/, "") !== "404")
        .map((item) => {
          let route = item.url.replace(/^\/+/, "");
          if (route === "mechanical-design-wiki") route = "";
          return { ...item, url: `/mechanical-design-wiki/${route}` };
        });
    },
  },
  appearance: "dark",
  transformHead({ pageData }) {
    const route = pageData.relativePath
      .replace(/(^|\/)index\.md$/, "$1")
      .replace(/\.md$/, "");
    const url = `${publicSite}/${route}`;
    return [
      ["link", { rel: "canonical", href: url }],
      ["meta", { property: "og:url", content: url }],
    ];
  },
  head: [
    [
      "link",
      { rel: "icon", type: "image/svg+xml", href: `${pagesBase}favicon.svg` },
    ],
    ["meta", { name: "theme-color", content: "#0b63ce" }],
    [
      "script",
      {},
      `(function(){try{var b=localStorage.getItem('mdwiki-bg');if(b==='white'||b==='black'){document.documentElement.setAttribute('data-bg',b);localStorage.setItem('vitepress-theme-appearance',b==='black'?'dark':'light');}}catch(e){}})()`,
    ],
    ["meta", { name: "author", content: "机械设计知识库" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "机械设计, 濮良贵, 第十版, 西北工业大学, 知识库, 机械零件, 齿轮, 轴承, 螺栓",
      },
    ],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:title", content: "机械设计知识库" }],
    ["meta", { property: "og:image", content: `${publicSite}/og-cover.png` }],
    ["meta", { property: "og:image:width", content: "1200" }],
    ["meta", { property: "og:image:height", content: "630" }],
    [
      "meta",
      {
        property: "og:description",
        content: "把厚厚的教材，读成一张可以检索的知识地图。",
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "机械设计知识库" }],
    [
      "meta",
      {
        name: "twitter:description",
        content: "把厚厚的教材，读成一张可以检索的知识地图。",
      },
    ],
    ["meta", { name: "twitter:image", content: `${publicSite}/og-cover.png` }],
  ],
  markdown: {
    math: true,
    lineNumbers: true,
    theme: {
      light: "github-light",
      dark: "github-dark-dimmed",
    },
  },
  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "机械设计知识库",
    nav: [
      { text: "工程图解", link: "/figures/" },
      { text: "学习指南", link: "/guide/" },
      { text: "十八章", link: "/chapters/" },
      { text: "公式速查", link: "/appendix/formulas" },
      { text: "关于", link: "/about" },
    ],
    sidebar,
    outline: {
      level: [2, 3],
      label: "本页目录",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    lastUpdated: {
      text: "最近更新",
      formatOptions: { dateStyle: "medium", timeStyle: "short" },
    },
    darkModeSwitchLabel: "外观",
    lightModeSwitchTitle: "切换到浅色模式",
    darkModeSwitchTitle: "切换到深色模式",
    sidebarMenuLabel: "目录",
    returnToTopLabel: "回到顶部",
    langMenuLabel: "语言",
    externalLinkIcon: true,
    footer: {
      message:
        "以《机械设计》（第十版）的知识框架为参照，独立编写的学习笔记。教材文字与插图版权归原作者及出版社所有。",
      copyright: "仅供学习交流 · Mechanical Design Wiki",
    },
    search: {
      provider: "local",
      options: {
        detailedView: true,
        translations: {
          button: {
            buttonText: "搜索知识库",
            buttonAriaLabel: "搜索知识库",
          },
          modal: {
            displayDetails: "显示详情",
            resetButtonTitle: "清除搜索",
            backButtonTitle: "返回",
            noResultsText: "没有找到相关内容",
            footer: {
              selectText: "选择",
              selectKeyAriaLabel: "回车",
              navigateText: "切换",
              navigateUpKeyAriaLabel: "上箭头",
              navigateDownKeyAriaLabel: "下箭头",
              closeText: "关闭",
              closeKeyAriaLabel: "Esc",
            },
          },
        },
      },
    },
  },
});
