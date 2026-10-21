<script setup lang="ts">
import { withBase } from 'vitepress'

const groups = [
  {
    roman: 'I',
    name: '总论',
    en: 'FOUNDATIONS',
    desc: '建立共同语言：设计流程、失效形式、强度与摩擦学。',
    chapters: [
      {
        n: '01',
        title: '绪论',
        desc: '机械设计的研究对象、课程性质与十八章知识地图。',
        tags: ['工程语境', '学习方法'],
        slug: '01-introduction'
      },
      {
        n: '02',
        title: '机械设计总论',
        desc: '机器组成、设计程序、主要失效形式与设计准则。',
        tags: ['设计流程', '失效', '准则'],
        slug: '02-design-fundamentals'
      },
      {
        n: '03',
        title: '机械零件的强度',
        desc: '疲劳曲线、极限应力图、接触强度与抗断裂。',
        tags: ['疲劳', 'Hertz', 'Miner'],
        slug: '03-strength'
      },
      {
        n: '04',
        title: '摩擦、磨损及润滑概述',
        desc: '四种摩擦状态、磨损机理、润滑剂与流体动压润滑。',
        tags: ['摩擦学', '油膜'],
        slug: '04-friction-wear-lubrication'
      }
    ]
  },
  {
    roman: 'II',
    name: '连接',
    en: 'JOINTS',
    desc: '从可拆到不可拆，理解载荷如何在零件之间传递。',
    chapters: [
      {
        n: '05',
        title: '螺纹连接和螺旋传动',
        desc: '预紧、防松、螺栓组受力、强度计算与螺旋传动效率。',
        tags: ['预紧', '螺栓组', '自锁'],
        slug: '05-threaded-connections'
      },
      {
        n: '06',
        title: '键、花键、无键连接和销连接',
        desc: '平键挤压与剪切、花键承载、过盈与销连接。',
        tags: ['平键', '花键'],
        slug: '06-keys-splines-pins'
      },
      {
        n: '07',
        title: '铆接、焊接、胶接和过盈连接',
        desc: '不可拆连接的失效、强度计算与工艺要点。',
        tags: ['焊接', '过盈'],
        slug: '07-riveting-welding-bonding'
      }
    ]
  },
  {
    roman: 'III',
    name: '机械传动',
    en: 'TRANSMISSIONS',
    desc: '在速度、转矩、效率与尺寸之间，设计一条传动链。',
    chapters: [
      {
        n: '08',
        title: '带传动',
        desc: '欧拉公式、弹性滑动、打滑与 V 带设计计算。',
        tags: ['欧拉公式', 'V带'],
        slug: '08-belt-drives'
      },
      {
        n: '09',
        title: '链传动',
        desc: '滚子链、多边形效应、链速、链节数与润滑。',
        tags: ['多边形效应', '链速'],
        slug: '09-chain-drives'
      },
      {
        n: '10',
        title: '齿轮传动',
        desc: '失效准则、受力分析、接触与弯曲强度、参数选择。',
        tags: ['接触强度', '弯曲强度'],
        slug: '10-gear-drives'
      },
      {
        n: '11',
        title: '蜗杆传动',
        desc: '大传动比、滑动摩擦、效率与热平衡计算。',
        tags: ['热平衡', '自锁'],
        slug: '11-worm-drives'
      }
    ]
  },
  {
    roman: 'IV',
    name: '轴系零、部件',
    en: 'SHAFTING',
    desc: '把旋转件支撑起来，并保证位置、精度和寿命。',
    chapters: [
      {
        n: '12',
        title: '滑动轴承',
        desc: '非液体摩擦的 p、v、pv 校核与流体动压油膜。',
        tags: ['油膜', 'p·v'],
        slug: '12-sliding-bearings'
      },
      {
        n: '13',
        title: '滚动轴承',
        desc: '类型代号、寿命 L₁₀、当量动载荷与轴系组合。',
        tags: ['L₁₀', '组合设计'],
        slug: '13-rolling-bearings'
      },
      {
        n: '14',
        title: '联轴器和离合器',
        desc: '类型、计算转矩、位移补偿与摩擦离合。',
        tags: ['选型', '转矩'],
        slug: '14-couplings-clutches'
      },
      {
        n: '15',
        title: '轴',
        desc: '结构设计、轴径估算、弯扭合成与临界转速。',
        tags: ['轴肩', '弯扭'],
        slug: '15-shafts'
      }
    ]
  },
  {
    roman: 'V',
    name: '其他零、部件',
    en: 'SYSTEMS',
    desc: '弹簧、箱体与减速器：从单个零件回到整机系统。',
    chapters: [
      {
        n: '16',
        title: '弹簧',
        desc: '旋绕比、Wahl 系数、刚度、稳定性与疲劳。',
        tags: ['刚度', '稳定性'],
        slug: '16-springs'
      },
      {
        n: '17',
        title: '机座和箱体简介',
        desc: '结构刚度、加强肋、铸造与焊接工艺性。',
        tags: ['刚度', '工艺'],
        slug: '17-frames-housings'
      },
      {
        n: '18',
        title: '减速器和变速器',
        desc: '传动比分配、功率流、润滑散热与系统设计。',
        tags: ['系统', '传动比'],
        slug: '18-reducers-variators'
      }
    ]
  }
]
</script>

<template>
  <div class="catalog">
    <section v-for="group in groups" :key="group.roman" class="catalog-group">
      <header class="catalog-group__head">
        <span class="catalog-group__roman">{{ group.roman }}</span>
        <div>
          <h2>{{ group.name }}</h2>
          <span>{{ group.en }}</span>
        </div>
        <p>{{ group.desc }}</p>
      </header>
      <div class="catalog-grid">
        <a
          v-for="chapter in group.chapters"
          :key="chapter.n"
          :href="withBase(`/chapters/${chapter.slug}`)"
          class="catalog-card"
        >
          <div class="catalog-card__top">
            <span class="catalog-card__num">{{ chapter.n }}</span>
            <span class="catalog-card__arrow">↗</span>
          </div>
          <h3>{{ chapter.title }}</h3>
          <p>{{ chapter.desc }}</p>
          <div class="catalog-card__tags">
            <span v-for="tag in chapter.tags" :key="tag">{{ tag }}</span>
          </div>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.catalog {
  margin: 10px 0 36px;
}

.catalog-group {
  padding: 28px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.catalog-group:first-child {
  border-top: 0;
}

.catalog-group__head {
  display: grid;
  grid-template-columns: 34px 150px 1fr;
  gap: 14px;
  align-items: baseline;
  margin-bottom: 14px;
}

.catalog-group__roman {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  font-weight: 700;
}

.catalog-group__head h2 {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 19px;
}

.catalog-group__head h2::before {
  display: none;
}

.catalog-group__head > div > span {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  letter-spacing: 0.12em;
}

.catalog-group__head p {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 11.5px;
}

.catalog-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.catalog-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 15px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 11px;
  background: var(--vp-c-bg);
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.18s,
    transform 0.18s,
    box-shadow 0.18s;
}

.catalog-card:hover {
  border-color: rgba(11, 99, 206, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 9px 24px rgba(15, 40, 80, 0.07);
}

.catalog-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.catalog-card__num {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
}

.catalog-card__arrow {
  color: var(--vp-c-text-3);
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.18s;
}

.catalog-card:hover .catalog-card__arrow {
  opacity: 1;
}

.catalog-card h3 {
  margin: 8px 0 0;
  font-size: 15px;
  letter-spacing: -0.01em;
}

.catalog-card p {
  flex: 1;
  margin: 5px 0 0;
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  line-height: 1.65;
}

.catalog-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 11px;
}

.catalog-card__tags span {
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 9px;
}

@media (max-width: 720px) {
  .catalog-group__head {
    grid-template-columns: 26px 1fr;
  }

  .catalog-group__head p {
    grid-column: 2;
  }

  .catalog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
