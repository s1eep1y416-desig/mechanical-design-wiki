<script setup lang="ts">
import { computed } from 'vue'

type Section = { id: string; title: string; page: string }
type Chapter = {
  n: string
  title: string
  slug: string
  pages: string
  sections: Section[]
}
type Part = { roman: string; name: string; en: string; chapters: Chapter[] }

const parts: Part[] = [
  {
    roman: 'I',
    name: '总论',
    en: 'FOUNDATIONS',
    chapters: [
      {
        n: '01',
        title: '绪论',
        slug: '01-introduction',
        pages: '003–004',
        sections: [
          { id: '1-1', title: '机械与机械设计在社会发展中的作用', page: '003' },
          { id: '1-2', title: '机械设计课程的内容、性质与任务', page: '003' }
        ]
      },
      {
        n: '02',
        title: '机械设计总论',
        slug: '02-design-fundamentals',
        pages: '005–026',
        sections: [
          { id: '2-1', title: '机器的组成', page: '005' },
          { id: '2-2', title: '设计机器的一般程序', page: '006' },
          { id: '2-3', title: '对机器的主要要求', page: '011' },
          { id: '2-4', title: '机械零件的主要失效形式', page: '013' },
          { id: '2-5', title: '设计机械零件时应满足的基本要求', page: '014' },
          { id: '2-6', title: '机械零件的设计准则', page: '016' },
          { id: '2-7', title: '机械零件的设计方法', page: '019' },
          { id: '2-8', title: '机械零件设计的一般步骤', page: '020' },
          { id: '2-9', title: '机械零件的材料及其选用', page: '021' },
          { id: '2-10', title: '机械零件设计中的标准化', page: '024' },
          { id: '2-11', title: '机械现代设计方法简介', page: '024' }
        ]
      },
      {
        n: '03',
        title: '机械零件的强度',
        slug: '03-strength',
        pages: '027–052',
        sections: [
          { id: '3-1', title: '材料的疲劳强度', page: '027' },
          { id: '3-2', title: '机械零件的疲劳强度', page: '030' },
          { id: '3-3', title: '机械零件的抗断裂强度', page: '039' },
          { id: '3-4', title: '机械零件的接触强度', page: '041' },
          { id: '3-5', title: '机械零件可靠性设计简介', page: '042' },
          { id: '附录', title: '本章附录', page: '045' },
          { id: '习题', title: '习题', page: '051' }
        ]
      },
      {
        n: '04',
        title: '摩擦、磨损及润滑概述',
        slug: '04-friction-wear-lubrication',
        pages: '053–070',
        sections: [
          { id: '4-1', title: '摩擦', page: '053' },
          { id: '4-2', title: '磨损', page: '057' },
          { id: '4-3', title: '润滑剂、添加剂和润滑方法', page: '059' },
          { id: '4-4', title: '流体润滑原理简介', page: '066' }
        ]
      }
    ]
  },
  {
    roman: 'II',
    name: '连接',
    en: 'JOINTS',
    chapters: [
      {
        n: '05',
        title: '螺纹连接和螺旋传动',
        slug: '05-threaded-connections',
        pages: '071–114',
        sections: [
          { id: '5-1', title: '螺纹', page: '071' },
          { id: '5-2', title: '螺纹连接的类型和标准连接件', page: '073' },
          { id: '5-3', title: '螺纹连接的预紧', page: '077' },
          { id: '5-4', title: '螺纹连接的防松', page: '079' },
          { id: '5-5', title: '螺栓组连接的设计', page: '081' },
          { id: '5-6', title: '螺纹连接的强度计算', page: '088' },
          { id: '5-7', title: '螺纹连接件的材料及许用应力', page: '096' },
          { id: '5-8', title: '提高螺纹连接强度的措施', page: '097' },
          { id: '5-9', title: '螺旋传动', page: '103' },
          { id: '习题', title: '习题', page: '112' }
        ]
      },
      {
        n: '06',
        title: '键、花键、无键连接和销连接',
        slug: '06-keys-splines-pins',
        pages: '115–128',
        sections: [
          { id: '6-1', title: '键连接', page: '115' },
          { id: '6-2', title: '花键连接', page: '121' },
          { id: '6-3', title: '无键连接', page: '123' },
          { id: '6-4', title: '销连接', page: '126' },
          { id: '习题', title: '习题', page: '127' }
        ]
      },
      {
        n: '07',
        title: '铆接、焊接、胶接和过盈连接',
        slug: '07-riveting-welding-bonding',
        pages: '129–154',
        sections: [
          { id: '7-1', title: '铆接', page: '129' },
          { id: '7-2', title: '焊接', page: '133' },
          { id: '7-3', title: '胶接', page: '139' },
          { id: '7-4', title: '过盈连接', page: '142' },
          { id: '习题', title: '习题', page: '150' }
        ]
      }
    ]
  },
  {
    roman: 'III',
    name: '机械传动',
    en: 'TRANSMISSIONS',
    chapters: [
      {
        n: '08',
        title: '带传动',
        slug: '08-belt-drives',
        pages: '155–176',
        sections: [
          { id: '8-1', title: '概述', page: '155' },
          { id: '8-2', title: '带传动工作情况的分析', page: '157' },
          { id: '8-3', title: '普通 V 带传动的设计计算', page: '163' },
          { id: '8-4', title: 'V 带轮的设计', page: '171' },
          { id: '8-5', title: 'V 带传动的张紧、安装与防护', page: '173' },
          { id: '习题', title: '习题', page: '176' }
        ]
      },
      {
        n: '09',
        title: '链传动',
        slug: '09-chain-drives',
        pages: '177–196',
        sections: [
          { id: '9-1', title: '链传动的特点及应用', page: '177' },
          { id: '9-2', title: '传动链的结构特点', page: '178' },
          { id: '9-3', title: '滚子链链轮的结构和材料', page: '181' },
          { id: '9-4', title: '链传动的工作情况分析', page: '183' },
          { id: '9-5', title: '滚子链传动的设计计算', page: '187' },
          { id: '9-6', title: '链传动的布置、张紧、润滑与防护', page: '193' },
          { id: '习题', title: '习题', page: '196' }
        ]
      },
      {
        n: '10',
        title: '齿轮传动',
        slug: '10-gear-drives',
        pages: '197–250',
        sections: [
          { id: '10-1', title: '概述', page: '197' },
          { id: '10-2', title: '齿轮传动的失效形式及设计准则', page: '197' },
          { id: '10-3', title: '齿轮的材料及其选择原则', page: '201' },
          { id: '10-4', title: '齿轮传动的计算载荷', page: '204' },
          { id: '10-5', title: '标准直齿圆柱齿轮传动的强度计算', page: '209' },
          { id: '10-6', title: '齿轮传动的精度、设计参数与许用应力', page: '215' },
          { id: '10-7', title: '标准斜齿圆柱齿轮传动的强度计算', page: '226' },
          { id: '10-8', title: '标准直齿锥齿轮传动的强度计算', page: '235' },
          { id: '10-9', title: '变位齿轮传动强度计算概述', page: '242' },
          { id: '10-10', title: '齿轮的结构设计', page: '243' },
          { id: '10-11', title: '齿轮传动的润滑', page: '246' },
          { id: '10-12', title: '圆弧齿圆柱齿轮传动简介', page: '248' },
          { id: '习题', title: '习题', page: '250' }
        ]
      },
      {
        n: '11',
        title: '蜗杆传动',
        slug: '11-worm-drives',
        pages: '251–284',
        sections: [
          { id: '11-1', title: '蜗杆传动的类型', page: '251' },
          { id: '11-2', title: '普通圆柱蜗杆传动的基本参数及几何尺寸计算', page: '256' },
          { id: '11-3', title: '普通圆柱蜗杆传动承载能力计算', page: '261' },
          { id: '11-4', title: '圆弧圆柱蜗杆传动设计计算', page: '267' },
          { id: '11-5', title: '普通圆柱蜗杆传动的效率、润滑及热平衡计算', page: '272' },
          { id: '11-6', title: '圆柱蜗杆和蜗轮的结构设计', page: '277' },
          { id: '习题', title: '习题', page: '280' }
        ]
      }
    ]
  },
  {
    roman: 'IV',
    name: '轴系零、部件',
    en: 'SHAFTING',
    chapters: [
      {
        n: '12',
        title: '滑动轴承',
        slug: '12-sliding-bearings',
        pages: '285–316',
        sections: [
          { id: '12-1', title: '概述', page: '285' },
          { id: '12-2', title: '滑动轴承的主要结构形式', page: '285' },
          { id: '12-3', title: '滑动轴承的失效形式及常用材料', page: '287' },
          { id: '12-4', title: '轴瓦结构', page: '290' },
          { id: '12-5', title: '滑动轴承润滑剂的选用', page: '293' },
          { id: '12-6', title: '不完全流体润滑滑动轴承设计计算', page: '295' },
          { id: '12-7', title: '流体动力润滑径向滑动轴承设计计算', page: '297' },
          { id: '12-8', title: '其他形式滑动轴承简介', page: '309' },
          { id: '习题', title: '习题', page: '316' }
        ]
      },
      {
        n: '13',
        title: '滚动轴承',
        slug: '13-rolling-bearings',
        pages: '317–352',
        sections: [
          { id: '13-1', title: '概述', page: '317' },
          { id: '13-2', title: '滚动轴承的主要类型及其代号', page: '318' },
          { id: '13-3', title: '滚动轴承类型的选择', page: '322' },
          { id: '13-4', title: '滚动轴承的工作情况', page: '324' },
          { id: '13-5', title: '滚动轴承尺寸的选择', page: '327' },
          { id: '13-6', title: '轴承装置的设计', page: '336' },
          { id: '13-7', title: '其他', page: '347' },
          { id: '习题', title: '习题', page: '352' }
        ]
      },
      {
        n: '14',
        title: '联轴器和离合器',
        slug: '14-couplings-clutches',
        pages: '353–370',
        sections: [
          { id: '14-1', title: '联轴器的种类和特性', page: '353' },
          { id: '14-2', title: '联轴器的选择', page: '360' },
          { id: '14-3', title: '离合器', page: '363' },
          { id: '14-4', title: '安全联轴器及安全离合器', page: '366' },
          { id: '14-5', title: '特殊功用及特殊结构的联轴器及离合器', page: '368' },
          { id: '习题', title: '习题', page: '369' }
        ]
      },
      {
        n: '15',
        title: '轴',
        slug: '15-shafts',
        pages: '371–400',
        sections: [
          { id: '15-1', title: '概述', page: '371' },
          { id: '15-2', title: '轴的结构设计', page: '374' },
          { id: '15-3', title: '轴的计算', page: '381' },
          { id: '习题', title: '习题', page: '396' }
        ]
      }
    ]
  },
  {
    roman: 'V',
    name: '其他零、部件',
    en: 'SYSTEMS',
    chapters: [
      {
        n: '16',
        title: '弹簧',
        slug: '16-springs',
        pages: '401–420',
        sections: [
          { id: '16-1', title: '概述', page: '401' },
          { id: '16-2', title: '圆柱螺旋弹簧的结构、制造、材料及许用应力', page: '402' },
          { id: '16-3', title: '圆柱螺旋压缩（拉伸）弹簧的设计计算', page: '406' },
          { id: '16-4', title: '圆柱螺旋扭转弹簧的设计计算', page: '416' },
          { id: '习题', title: '习题', page: '420' }
        ]
      },
      {
        n: '17',
        title: '机座和箱体简介',
        slug: '17-frames-housings',
        pages: '421–428',
        sections: [
          { id: '17-1', title: '概述', page: '421' },
          { id: '17-2', title: '机座和箱体的一般类型与材料选择', page: '421' },
          { id: '17-3', title: '机座和箱体设计概要', page: '423' },
          { id: '17-4', title: '机座和箱体的截面形状及肋板布置', page: '425' }
        ]
      },
      {
        n: '18',
        title: '减速器和变速器',
        slug: '18-reducers-variators',
        pages: '429–438',
        sections: [
          { id: '18-1', title: '减速器', page: '429' },
          { id: '18-2', title: '变速器', page: '433' },
          { id: '18-3', title: '摩擦轮传动简介', page: '436' }
        ]
      }
    ]
  }
]

const totalSections = computed(() =>
  parts.reduce((sum, part) => sum + part.chapters.reduce((n, ch) => n + ch.sections.length, 0), 0)
)
</script>

<template>
  <div class="textbook">
    <div class="textbook__stats">
      <div><b>441</b><span>页（至参考文献）</span></div>
      <div><b>18</b><span>章</span></div>
      <div><b>{{ totalSections }}</b><span>个目录条目</span></div>
      <div><b>2019</b><span>第 10 版</span></div>
    </div>

    <section v-for="part in parts" :key="part.roman" class="textbook-part">
      <header class="textbook-part__head">
        <span>{{ part.roman }}</span>
        <h2>{{ part.name }}</h2>
        <i>{{ part.en }}</i>
      </header>

      <div class="textbook-list">
        <details v-for="chapter in part.chapters" :key="chapter.n" class="textbook-chapter">
          <summary>
            <span class="textbook-chapter__num">{{ chapter.n }}</span>
            <b>{{ chapter.title }}</b>
            <span class="textbook-chapter__pages">p.{{ chapter.pages }}</span>
            <span class="textbook-chapter__count">{{ chapter.sections.length }} 节</span>
            <span class="textbook-chapter__toggle" aria-hidden="true">⌄</span>
          </summary>
          <div class="textbook-chapter__body">
            <ul>
              <li v-for="section in chapter.sections" :key="section.id">
                <span>{{ section.id }}</span>
                <p>{{ section.title }}</p>
                <em>p.{{ section.page }}</em>
              </li>
            </ul>
            <a :href="`/chapters/${chapter.slug}`">进入本站本章 →</a>
          </div>
        </details>
      </div>
    </section>
  </div>
</template>

<style scoped>
.textbook__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 34px;
  margin: 24px 0 12px;
  padding: 18px 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.textbook__stats div {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.textbook__stats b {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 22px;
}

.textbook__stats span {
  color: var(--vp-c-text-3);
  font-size: 11px;
}

.textbook-part {
  margin-top: 34px;
}

.textbook-part__head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding-bottom: 9px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.textbook-part__head > span {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 700;
}

.textbook-part__head h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 20px;
}

.textbook-part__head h2::before {
  display: none;
}

.textbook-part__head i {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  font-style: normal;
  letter-spacing: 0.12em;
}

.textbook-list {
  border-bottom: 1px solid var(--vp-c-divider);
}

.textbook-chapter {
  border-top: 1px solid var(--vp-c-divider);
}

.textbook-chapter:first-child {
  border-top: 0;
}

.textbook-chapter summary {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto 48px 16px;
  gap: 10px;
  align-items: center;
  padding: 12px 8px;
  list-style: none;
  cursor: pointer;
  transition: background 0.15s;
}

.textbook-chapter summary::-webkit-details-marker {
  display: none;
}

.textbook-chapter summary:hover {
  background: var(--vp-c-bg-soft);
}

.textbook-chapter__num {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
}

.textbook-chapter summary b {
  color: var(--vp-c-text-1);
  font-size: 13.5px;
  font-weight: 600;
}

.textbook-chapter__pages {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
}

.textbook-chapter__count {
  color: var(--vp-c-text-3);
  font-size: 10px;
  text-align: right;
}

.textbook-chapter__toggle {
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1;
  text-align: center;
  transition: transform 0.18s;
}

.textbook-chapter[open] .textbook-chapter__toggle {
  transform: rotate(180deg);
}

.textbook-chapter__body {
  padding: 2px 8px 18px 42px;
}

.textbook-chapter__body ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.textbook-chapter__body li {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: 10px;
  align-items: baseline;
  padding: 5px 0;
  border-top: 1px dashed var(--vp-c-divider);
}

.textbook-chapter__body li:first-child {
  border-top: 0;
}

.textbook-chapter__body li > span {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
}

.textbook-chapter__body li > p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 11.5px;
  line-height: 1.55;
}

.textbook-chapter__body li > em {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
  font-style: normal;
}

.textbook-chapter__body > a {
  display: inline-block;
  margin-top: 12px;
  color: var(--vp-c-brand-1);
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 640px) {
  .textbook__stats {
    gap: 20px;
  }

  .textbook-chapter summary {
    grid-template-columns: 26px minmax(0, 1fr) auto 16px;
  }

  .textbook-chapter__count {
    display: none;
  }

  .textbook-chapter__body {
    padding-left: 8px;
  }

  .textbook-chapter__body li {
    grid-template-columns: 38px minmax(0, 1fr) auto;
  }
}
</style>
