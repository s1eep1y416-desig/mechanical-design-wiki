<script setup lang="ts">
import { computed } from 'vue'

type Failure = { form: string; cause: string; avoid: string }
type Plan = { flow: string[]; failures: Failure[] }

const props = defineProps<{ chapter: string | number }>()

const bank: Record<string, Plan> = {
  '1': {
    flow: ['明确功能与工况', '拟定机械系统方案', '拆解到通用零部件', '按失效准则设计', '试验与改进'],
    failures: [
      { form: '功能失效', cause: '运动方案或功率、速度不满足使用要求', avoid: '先做功能原理和传动链匹配，再进行零件设计' },
      { form: '强度/寿命失效', cause: '载荷估计不足，或只按静强度设计', avoid: '建立载荷谱，区分静强度、疲劳和接触强度' },
      { form: '工艺与维护失效', cause: '结构不可制造、不可装配或难维护', avoid: '设计阶段同步考虑标准化、工艺性和可维护性' }
    ]
  },
  '2': {
    flow: ['明确需求与约束', '方案与传动链设计', '载荷与失效分析', '选择设计准则', '材料与结构设计', '校核与试验'],
    failures: [
      { form: '整体断裂', cause: '过载、疲劳、应力集中或材料缺陷', avoid: '强度校核、降低应力集中、控制材料与热处理' },
      { form: '塑性变形', cause: '工作应力超过屈服极限，或局部接触压溃', avoid: '限制名义应力与接触应力，留足安全系数' },
      { form: '表面磨损/点蚀/胶合', cause: '润滑不良、接触应力高、相对滑动大', avoid: '选配合材料、提高硬度、改善润滑与表面质量' },
      { form: '变形过大', cause: '刚度不足或支承布置不合理', avoid: '按刚度准则设计，增加截面惯性矩和支承刚度' },
      { form: '振动与松动', cause: '共振、交变载荷或预紧力不足', avoid: '避开临界转速，采用防松和预紧结构' }
    ]
  },
  '3': {
    flow: ['确定载荷谱与循环特性', '获取材料疲劳极限', '修正零件疲劳极限', '极限应力图校核', '结构强化与验证'],
    failures: [
      { form: '疲劳断裂', cause: '循环应力、应力集中、表面缺陷', avoid: '增大圆角、降低粗糙度、喷丸/滚压、选用高疲劳强度材料' },
      { form: '屈服/塑性变形', cause: '短时过载或平均应力过大', avoid: '补做静强度校核，控制最大应力不超过屈服极限' },
      { form: '低应力脆断', cause: '裂纹、焊接缺陷、低温或高强钢韧性不足', avoid: '控制缺陷尺寸，选用足够断裂韧度，进行无损检测' },
      { form: '接触疲劳', cause: '局部接触应力高、循环次数多', avoid: '增大曲率半径和接触面积，提高硬度与润滑质量' }
    ]
  },
  '4': {
    flow: ['判断摩擦状态', '选择润滑剂与润滑方式', '计算 p、v、pv 或油膜', '控制温升', '材料配对与表面处理'],
    failures: [
      { form: '黏着磨损', cause: '油膜破裂、同种材料直接接触、高速重载', avoid: '提高黏度、加极压添加剂、采用异种材料配对' },
      { form: '磨粒磨损', cause: '粉尘、磨屑进入摩擦面', avoid: '密封、过滤、防尘，提高表面硬度' },
      { form: '疲劳磨损', cause: '循环接触应力导致表层剥落', avoid: '降低接触应力、提高硬度、改善润滑' },
      { form: '腐蚀磨损', cause: '介质腐蚀与机械作用叠加', avoid: '耐蚀材料、涂层、缓蚀剂和良好密封' },
      { form: '烧瓦/胶合', cause: '供油不足、温升过高、油膜承载不足', avoid: '校核热平衡，保证油量、油温和散热' }
    ]
  },
  '5': {
    flow: ['分析载荷与工况', '选择连接类型', '确定预紧力', '螺栓组布置与受力', '强度校核', '防松与工艺'],
    failures: [
      { form: '螺栓拉断/疲劳', cause: '预紧力过大、工作载荷交变、应力集中', avoid: '控制预紧力，减小螺栓刚度，增大过渡圆角' },
      { form: '螺纹滑扣/脱扣', cause: '螺纹牙剪切强度不足、旋合长度太短', avoid: '保证旋合长度，选择足够性能等级，避免过载' },
      { form: '连接松动', cause: '振动、温度变化、预紧力松弛', avoid: '机械防松、双螺母、自锁螺母，重要连接控制预紧' },
      { form: '铰制孔螺栓剪断/压溃', cause: '横向载荷过大、孔壁挤压不足', avoid: '校核剪切和挤压强度，保证孔与杆配合精度' }
    ]
  },
  '6': {
    flow: ['确定转矩与轴径', '选择键/花键/销', '确定工作长度', '挤压与剪切校核', '轴毂结构与对中'],
    failures: [
      { form: '平键挤压压溃', cause: '接触高度不足、键长太短、轮毂材料软', avoid: '按轴径选标准键，保证工作长度，校核挤压强度' },
      { form: '键剪断', cause: '冲击载荷或键宽不足', avoid: '校核剪切强度，重要连接改用花键或增加键数' },
      { form: '键槽处轴疲劳', cause: '键槽尖角应力集中、轴的截面削弱', avoid: '增大槽底圆角，键槽布置在同一母线，必要时增大轴径' }
    ]
  },
  '7': {
    flow: ['选择连接方式', '确定接头形式', '载荷分配与危险截面', '强度计算', '工艺与检验'],
    failures: [
      { form: '铆钉剪断/孔壁压溃', cause: '铆钉数量不足、板厚太薄、孔距不当', avoid: '按剪切和挤压校核，合理布置铆钉与端距' },
      { form: '板件撕裂', cause: '铆钉孔削弱净截面', avoid: '校核净截面拉伸，合理排列铆钉' },
      { form: '焊缝裂纹/疲劳', cause: '残余应力、未焊透、应力集中', avoid: '合理坡口和焊接顺序，焊后消应力，重要焊缝探伤' },
      { form: '胶接剥离/老化', cause: '接头受剥离、表面处理不良、环境老化', avoid: '采用搭接/嵌接，控制胶层厚度，做好表面处理' },
      { form: '过盈连接松动/开裂', cause: '过盈量不足或过大、边缘应力集中', avoid: '按传递载荷计算过盈量，校核配合面应力与装配工艺' }
    ]
  },
  '8': {
    flow: ['确定计算功率', '选择带型与带轮直径', '确定中心距和带长', '验算包角与带速', '确定根数与初拉力', '张紧与防护'],
    failures: [
      { form: '打滑', cause: '过载、初拉力不足、包角过小、摩擦系数低', avoid: '控制有效拉力，保证包角≥120°，合理张紧' },
      { form: '带疲劳断裂', cause: '弯曲应力大、带轮直径过小、循环次数多', avoid: '增大带轮直径，选择合适带型，避免过小包角' },
      { form: '带磨损/老化', cause: '张紧过大、油污、温度高、带轮槽磨损', avoid: '控制初拉力，保持清洁，定期更换，防护罩隔离' },
      { form: '带轮槽磨损', cause: '带与轮槽不匹配、安装不对中', avoid: '保证带轮槽角与带型匹配，两轮轴线平行对中' }
    ]
  },
  '9': {
    flow: ['确定工况与功率', '选择齿数与传动比', '选链号与排数', '计算链节数和中心距', '校核链速与润滑', '布置与张紧'],
    failures: [
      { form: '铰链磨损、链节伸长', cause: '润滑不良、粉尘、销轴与套筒间隙增大', avoid: '按链速选润滑方式，保持清洁，定期检查伸长量' },
      { form: '跳齿/脱链', cause: '磨损后节距增大、中心距过大、齿数过少', avoid: '控制 z₁、z₂ 和中心距，及时更换整链，保证张紧' },
      { form: '链板疲劳断裂', cause: '循环拉力、冲击载荷、链轮齿数过少', avoid: '选择足够链号，减小多边形效应，避免急反转' },
      { form: '滚子/套筒疲劳', cause: '啮合冲击、润滑不足、载荷过大', avoid: '改善润滑，控制链速，选用合适排数和节距' }
    ]
  },
  '10': {
    flow: ['分析工况与转向', '选择材料与热处理', '判断失效准则', '初选 z、m、β、φd', '接触/弯曲校核', '结构与润滑'],
    failures: [
      { form: '齿根折断', cause: '弯曲疲劳、过载、齿根应力集中', avoid: '增大模数和齿根圆角，提高材料韧性，避免偏载' },
      { form: '齿面点蚀', cause: '接触疲劳、硬度不足、润滑不良', avoid: '提高齿面硬度、降低粗糙度、增大接触强度' },
      { form: '齿面磨损', cause: '开式传动、磨粒进入、润滑不足', avoid: '采用闭式传动，清洁润滑，提高表面硬度' },
      { form: '齿面胶合', cause: '高速重载、油膜破裂、局部温升过高', avoid: '极压添加剂、降低滑动速度、提高硬度和精度' },
      { form: '塑性变形', cause: '低速重载、齿面屈服', avoid: '提高材料屈服强度，改善润滑，限制接触应力' }
    ]
  },
  '11': {
    flow: ['确定传动比和功率', '选择 z₁、z₂、q、m', '计算几何尺寸', '材料与强度校核', '效率与热平衡', '润滑与散热'],
    failures: [
      { form: '齿面胶合', cause: '滑动速度大、油膜破裂、温升过高', avoid: '选用抗胶合材料配对和极压蜗轮油，控制油温' },
      { form: '齿面磨损', cause: '润滑不良、油品污染、滑动摩擦大', avoid: '保证充分润滑，定期换油，采用耐磨青铜' },
      { form: '齿面点蚀', cause: '接触应力高、循环次数多', avoid: '增大中心距和接触面积，提高蜗轮材料性能' },
      { form: '蜗轮齿折断', cause: '过载、冲击、齿根强度不足', avoid: '校核弯曲强度，避免冲击，保证齿根圆角' },
      { form: '箱体过热', cause: '效率低、散热面积不足', avoid: '进行热平衡计算，加散热片、风扇或循环冷却' }
    ]
  },
  '12': {
    flow: ['确定载荷与转速', '选轴承结构与材料', '选润滑剂和润滑方式', '非液体摩擦校核 p/v/pv', '流体润滑算油膜', '热平衡与间隙'],
    failures: [
      { form: '磨损', cause: '边界润滑、粉尘、供油不足', avoid: '选择合适材料与润滑，控制 p、v、pv，做好密封' },
      { form: '胶合/烧瓦', cause: '油膜破裂、温升过高、间隙过小', avoid: '保证最小油膜厚度，校核热平衡，控制间隙' },
      { form: '疲劳剥落', cause: '循环接触应力、轴瓦结合不良', avoid: '提高轴瓦材料与结合质量，降低局部峰值压力' },
      { form: '腐蚀', cause: '润滑油氧化、介质侵入', avoid: '选耐蚀材料，控制油品，密封防污' }
    ]
  },
  '13': {
    flow: ['分析载荷与转速', '选择轴承类型与布置', '计算当量动载荷', '寿命/静载荷校核', '配合、游隙与预紧', '润滑与密封'],
    failures: [
      { form: '疲劳剥落', cause: '循环接触应力、载荷过大、润滑不良', avoid: '按 L₁₀ 选型，保证润滑和安装精度' },
      { form: '磨损', cause: '污染、润滑不足、游隙过大', avoid: '有效密封，清洁润滑，控制游隙' },
      { form: '塑性压痕', cause: '冲击、过载、安装敲击', avoid: '校核静载荷，采用正确装配工具和工艺' },
      { form: '保持架/套圈断裂', cause: '安装不当、偏载、高速离心力', avoid: '保证同轴度和配合，避免冲击，正确预紧' },
      { form: '腐蚀/电蚀', cause: '水分、酸碱介质、轴电流', avoid: '密封、耐蚀材料、接地或绝缘轴承' }
    ]
  },
  '14': {
    flow: ['计算名义转矩', '选工况系数', '选择联轴器/离合器类型', '校核转矩、转速、轴径', '对中与安装', '防护与维护'],
    failures: [
      { form: '转矩过载损坏', cause: '冲击载荷、选型偏小', avoid: '按计算转矩 T_ca=K_A T 选型，留足裕度' },
      { form: '振动/不对中', cause: '两轴不同心、基础刚度不足', avoid: '选择补偿型联轴器，保证安装对中' },
      { form: '弹性元件老化/磨损', cause: '温度、油污、交变载荷', avoid: '选耐温耐油材料，定期更换弹性件' },
      { form: '摩擦片磨损/过热', cause: '频繁接合、压紧力不足、散热差', avoid: '校核摩擦转矩和发热，改善散热与操纵机构' }
    ]
  },
  '15': {
    flow: ['确定功率与转速', '初估轴径', '轴系结构设计', '求弯矩和转矩', '弯扭合成/疲劳校核', '刚度与临界转速'],
    failures: [
      { form: '轴肩/键槽疲劳断裂', cause: '应力集中、交变弯曲、表面缺陷', avoid: '增大圆角、降低粗糙度、避免截面突变，精确疲劳校核' },
      { form: '静强度屈服', cause: '短时过载、转矩冲击', avoid: '按最大载荷校核，设置安全离合器或过载保护' },
      { form: '变形过大', cause: '刚度不足、跨距过大', avoid: '增大轴径、缩短跨距、增加支承，校核挠度和转角' },
      { form: '共振', cause: '工作转速接近临界转速', avoid: '调整轴径/跨距/支承，使工作转速避开临界转速' }
    ]
  },
  '16': {
    flow: ['确定载荷与变形', '选择弹簧类型和材料', '选旋绕比与簧丝直径', '计算圈数和刚度', '应力/稳定性校核', '疲劳与结构'],
    failures: [
      { form: '疲劳断裂', cause: '循环应力、表面缺陷、旋绕比过小', avoid: '增大旋绕比、喷丸强化、提高表面质量' },
      { form: '塑性变形/松弛', cause: '应力超过屈服、长期高温', avoid: '控制工作应力，选择耐热材料，进行强压处理' },
      { form: '失稳', cause: '高径比过大、端部支承不良', avoid: '加导杆/导套，控制高径比，改善端部结构' },
      { form: '共振', cause: '激振频率接近弹簧固有频率', avoid: '调整刚度/圈数，增加阻尼或避开工作频率' }
    ]
  },
  '17': {
    flow: ['确定载荷与布局', '选择材料与工艺', '设计壁厚和截面', '布置轴承座与加强肋', '精度与装配', '刚度/散热校核'],
    failures: [
      { form: '箱体刚度不足', cause: '壁厚薄、肋板少、轴承座悬臂', avoid: '合理布置加强肋，增大关键截面惯性矩' },
      { form: '轴承孔变形/偏载', cause: '箱体变形、加工同轴度差', avoid: '提高轴承座刚度，一次装夹加工，控制公差' },
      { form: '铸造/焊接裂纹', cause: '壁厚突变、圆角过小、残余应力', avoid: '均匀壁厚、圆角过渡、合理焊接顺序和退火' },
      { form: '漏油/密封失效', cause: '剖分面不平、密封结构不当', avoid: '保证剖分面加工精度，合理选择密封和回油结构' }
    ]
  },
  '18': {
    flow: ['确定工作机工况', '选择电动机', '分配总传动比', '设计各级传动', '轴系与箱体', '润滑/散热/试验'],
    failures: [
      { form: '齿轮/蜗杆过早失效', cause: '传动比分配不合理、润滑不足、散热差', avoid: '合理分配传动比，保证浸油和散热，按准则校核' },
      { form: '轴承过热/损坏', cause: '轴承受力计算错误、游隙/配合不当', avoid: '按实际轴向/径向载荷选轴承，正确布置与配合' },
      { form: '箱体漏油', cause: '密封失效、通气器堵塞、油面过高', avoid: '设置通气器、油标和回油槽，控制油面高度' },
      { form: '振动/噪声', cause: '对中不良、齿轮精度低、共振', avoid: '提高安装对中与齿轮精度，避开共振区' }
    ]
  }
}

const calcBank: Record<string, { calc: string[]; select: string[] }> = {
  '1': {
    calc: ['功率、转速与总传动比', '各级效率与转矩', '主要零件的载荷与寿命'],
    select: ['电动机与传动方案', '通用零部件类型', '材料、标准件与配合']
  },
  '2': {
    calc: ['载荷与载荷谱', '安全系数与许用应力', '强度、刚度、寿命与可靠性'],
    select: ['材料与热处理', '标准件与标准尺寸', '表面处理与配合']
  },
  '3': {
    calc: ['σₘ、σₐ 与应力比 r', 'Kσ、σ₋₁ₑ 与 S_ca', '接触应力与 Miner 损伤'],
    select: ['材料与热处理', '表面强化工艺', '过渡圆角与结构细节']
  },
  '4': {
    calc: ['p、v、pv', '最小油膜厚度与承载系数', '摩擦功耗与温升'],
    select: ['润滑油黏度与添加剂', '润滑方式与供油量', '摩擦副材料配对']
  },
  '5': {
    calc: ['F₀、F₂、F₁ 与相对刚度', '1.3F₂/A₁ 强度校核', '螺栓组转矩/倾覆受力'],
    select: ['螺栓性能等级与规格', '螺栓数量与布置', '防松方式与垫圈']
  },
  '6': {
    calc: ['平键挤压 σp 与剪切 τ', '花键挤压强度', '销的剪切与挤压'],
    select: ['键 b×h×L', '花键规格与齿数', '销的类型与直径']
  },
  '7': {
    calc: ['铆钉剪切/挤压/板净截面', '角焊缝有效厚度与长度', '过盈量、压力与转矩'],
    select: ['铆钉/焊条/胶粘剂', '接头形式与坡口', '过盈配合与装配方法']
  },
  '8': {
    calc: ['P_ca、v、α₁、L_d', '带根数 z、初拉力 F₀', '压轴力 F_p'],
    select: ['带型与带轮基准直径', '标准基准长度', '张紧方式与防护罩']
  },
  '9': {
    calc: ['z₁、z₂ 与平均链速 v', '链节数 L_p 与实际中心距', '压轴力与润滑方式'],
    select: ['链号与排数', '链轮齿数与材料', '张紧/润滑/防护']
  },
  '10': {
    calc: ['T₁、F_t、F_r、F_a', 'K 与 σ_H、σ_F', 'd₁ 与标准模数 m'],
    select: ['材料与热处理', 'z、m、β、φ_d', '精度等级与润滑方式']
  },
  '11': {
    calc: ['i、d₁、d₂、a、γ', 'F_t、F_a、F_r', 'η 与热平衡'],
    select: ['z₁、z₂、q、m', '蜗杆/蜗轮材料配对', '润滑剂与散热方式']
  },
  '12': {
    calc: ['p、v、pv', 'h_min 与承载系数 C', '摩擦功耗与温升'],
    select: ['轴承结构、轴瓦材料', '相对间隙 ψ 与黏度', '润滑方式与密封']
  },
  '13': {
    calc: ['F_r、F_a 与当量动载荷 P', 'L₁₀h 与静载荷 P₀', '内部轴向力与压紧端'],
    select: ['轴承类型与代号', '尺寸系列与精度', '配合、游隙、润滑与密封']
  },
  '14': {
    calc: ['T=9550P/n', 'T_ca=K_A T', '摩擦转矩与发热'],
    select: ['联轴器类型与型号', '离合器类型', '安全联轴器/离合器']
  },
  '15': {
    calc: ['d≥A₀(P/n)^(1/3)', 'M、T 与 σ_ca', '疲劳安全系数、刚度、临界转速'],
    select: ['材料与热处理', '轴肩/圆角/键槽结构', '轴承、键与联轴器']
  },
  '16': {
    calc: ['K、τ、λ、F′', '稳定性与疲劳', '固有频率'],
    select: ['弹簧材料与许用应力', 'd、D、n 与端部结构', '导杆/导套与表面强化']
  },
  '17': {
    calc: ['壁厚与截面惯性矩', '轴承座局部刚度', '连接螺栓与地脚载荷'],
    select: ['铸铁/铸钢/焊接结构', '肋板布置与剖分面', '公差、粗糙度与密封']
  },
  '18': {
    calc: ['总传动比与各级分配', '各轴 P、n、T', '效率、热平衡与寿命'],
    select: ['电动机与减速器类型', '级数、传动件与轴承', '润滑、密封、附件']
  }
}

const plan = computed(() => {
  const key = String(props.chapter)
  const base = bank[key]
  const extra = calcBank[key]
  return base && extra ? { ...base, ...extra } : undefined
})
</script>

<template>
  <section v-if="plan" class="design-logic">
    <header class="design-logic__head">
      <div>
        <span>DESIGN LOGIC</span>
        <h3>设计思路与失效防控</h3>
      </div>
      <p>先判断会怎么坏，再决定怎么算、怎么防。</p>
    </header>

    <div class="design-flow">
      <span v-for="(step, i) in plan.flow" :key="step">
        <i>{{ String(i + 1).padStart(2, '0') }}</i>
        {{ step }}
      </span>
    </div>

    <div class="failure-table">
      <div class="failure-table__head">
        <span>常见失效</span>
        <span>为什么会发生</span>
        <span>设计时如何避免</span>
      </div>
      <div v-for="failure in plan.failures" :key="failure.form" class="failure-row">
        <b>{{ failure.form }}</b>
        <p>{{ failure.cause }}</p>
        <p>{{ failure.avoid }}</p>
      </div>
    </div>

    <div class="calc-grid">
      <div class="calc-card">
        <h4><span>CALC</span>计算什么</h4>
        <ul>
          <li v-for="item in plan.calc" :key="item">{{ item }}</li>
        </ul>
      </div>
      <div class="calc-card">
        <h4><span>SELECT</span>选什么</h4>
        <ul>
          <li v-for="item in plan.select" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>

    <p class="design-logic__note">
      表中列的是本章主要失效形式，计算与选型要形成闭环。实际设计还要结合载荷谱、环境、材料和标准，逐项排除次要失效。
    </p>
  </section>
</template>

<style scoped>
.design-logic {
  margin: 0 0 30px;
  padding: 20px 22px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background:
    radial-gradient(120% 120% at 0% 0%, rgba(11, 99, 206, 0.06), transparent 55%),
    var(--vp-c-bg-soft);
}

.design-logic__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.design-logic__head span {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.design-logic__head h3 {
  margin: 3px 0 0;
  padding: 0;
  border: 0;
  font-size: 18px;
  letter-spacing: -0.01em;
}

.design-logic__head > p {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 10.5px;
}

.design-flow {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 15px 0;
}

.design-flow span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 9px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 10.5px;
}

.design-flow i {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  font-style: normal;
}

.failure-table {
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  overflow: hidden;
}

.failure-table__head,
.failure-row {
  display: grid;
  grid-template-columns: 138px minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 0;
}

.failure-table__head {
  background: var(--vp-c-bg-alt);
}

.failure-table__head span {
  padding: 7px 10px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 8.5px;
  letter-spacing: 0.04em;
}

.failure-row {
  border-top: 1px solid var(--vp-c-divider);
}

.failure-row b,
.failure-row p {
  padding: 8px 10px;
  font-size: 11px;
  line-height: 1.6;
}

.failure-row b {
  color: var(--vp-c-text-1);
  font-weight: 650;
}

.failure-row p {
  margin: 0;
  border-left: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
}

.calc-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 10px;
}

.calc-card {
  padding: 11px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}

.calc-card h4 {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0 0 6px;
  color: var(--vp-c-text-1);
  font-size: 11.5px;
}

.calc-card h4 span {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 7.5px;
  letter-spacing: 0.08em;
}

.calc-card ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.calc-card li {
  position: relative;
  padding-left: 12px;
  color: var(--vp-c-text-2);
  font-size: 10.5px;
  line-height: 1.65;
}

.calc-card li::before {
  position: absolute;
  left: 0;
  color: var(--vp-c-brand-1);
  content: '·';
}

.design-logic__note {
  margin: 9px 0 0;
  color: var(--vp-c-text-3);
  font-size: 9.5px;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .design-logic {
    padding: 16px 14px 12px;
  }

  .design-logic__head {
    align-items: flex-start;
    flex-direction: column;
    gap: 5px;
  }

  .design-logic__head > p {
    font-size: 9.5px;
  }

  .calc-grid {
    grid-template-columns: 1fr;
  }

  .failure-table__head {
    display: none;
  }

  .failure-row {
    display: block;
    padding: 9px 10px;
  }

  .failure-row b,
  .failure-row p {
    display: block;
    padding: 0;
    border-left: 0;
  }

  .failure-row b {
    margin-bottom: 4px;
    font-size: 12px;
  }

  .failure-row p {
    padding-left: 13px;
    font-size: 10.5px;
  }

  .failure-row p::before {
    margin-right: 5px;
    color: var(--vp-c-brand-1);
    font-family: var(--vp-font-family-mono);
    font-size: 8px;
  }

  .failure-row p:nth-of-type(1)::before {
    content: '原因';
  }

  .failure-row p:nth-of-type(2)::before {
    content: '避免';
  }
}
</style>
