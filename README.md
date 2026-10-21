# 机械设计知识库

以西北工业大学《机械设计》（第十版）十八章目录为知识框架的静态学习网站，参考 [OI Wiki](https://oi-wiki.org/) 的文档组织方式。

## 本地运行

```bash
npm install
npm run dev
```

默认地址：`http://127.0.0.1:5173`。也可以显式指定端口：

```bash
npm run dev -- --port 5180
```

构建与预览：

```bash
npm run build
npm run preview
```

## 目录结构

```text
docs/
├── .vitepress/
│   ├── config.mts              # 导航、侧栏、搜索、MathJax
│   └── theme/
│       ├── style.css           # 全局视觉与排版
│       └── components/         # 首页、章节头、公式检索、学习进度
├── index.md                    # 自定义首页
├── guide/                      # 使用指南、教材目录、学习路线、符号约定
├── fundamentals/               # 公差与配合、表面处理、表面热处理专题
├── chapters/                   # 十八章正文
├── appendix/                   # 公式速查、单位、复习
├── about.md
└── public/                     # logo / favicon
```

## 内容约定

- 正文为独立撰写的学习笔记，不复制教材原文、例题和插图；
- 公式用于建立计算逻辑，许用值、系数、标准件参数应以教材、国家标准或设计手册为准；
- 每章包含设计思路、失效原因与防控、计算/选型、核心公式、曲线图和易错点；章节页标注教材页码；
- 「教材目录与页码」页列出五篇十八章、116 个目录条目及起始页，方便与纸质书对照；
- 公式速查共 66 条，支持中文搜索与分类筛选；
- 疲劳曲线、极限应力图、Stribeck 曲线、螺栓力–变形图等 11 张曲线图均为按公式关系重绘的 SVG。

## 技术栈

- VitePress 1.6 / Vue 3
- markdown-it-mathjax3（正文公式）
- KaTeX（公式卡片）
- 本地全文搜索
- 无后端，学习进度保存在 `localStorage`

## 部署

构建产物位于 `docs/.vitepress/dist`，可部署到任意静态托管服务。若部署在子路径下，请在 `docs/.vitepress/config.mts` 中设置 `base`，并同步调整自定义组件中的绝对链接。

## 免责声明

本站仅供学习与复习使用，不替代正式教材；不收录教材 PDF 扫描件或正文原文。实际工程设计的强度、寿命、安全性与合规性，须由具备资质的设计人员按现行标准和完整计算书确认。
