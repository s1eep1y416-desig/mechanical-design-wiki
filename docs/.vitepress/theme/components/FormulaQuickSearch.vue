<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed, ref } from 'vue'
import katex from 'katex'
import 'katex/dist/katex.min.css'

type Formula = {
  name: string
  cat: '强度' | '连接' | '传动' | '轴系' | '弹簧'
  latex: string
  note: string
  chapter: string
  link: string
  hot?: boolean
  keys?: string
}

const raw: Formula[] = [
  {
    name: '疲劳曲线',
    cat: '强度',
    latex: String.raw`\sigma_{-1}^{m}N=C`,
    note: '应力比 r = −1 时，疲劳极限与循环次数的经验关系。m 与材料有关。',
    chapter: '03',
    link: '/chapters/03-strength',
    hot: true,
    keys: 'S-N 曲线 疲劳极限'
  },
  {
    name: 'Goodman 方程',
    cat: '强度',
    latex: String.raw`\frac{\sigma_a}{\sigma_{-1}}+\frac{\sigma_m}{\sigma_b}=1`,
    note: '用强度极限折减平均应力影响的直线型疲劳失效判据，偏保守、工程常用。',
    chapter: '03',
    link: '/chapters/03-strength',
    hot: true,
    keys: '平均应力 应力幅'
  },
  {
    name: 'Gerber 方程',
    cat: '强度',
    latex: String.raw`\frac{\sigma_a}{\sigma_{-1}}+\left(\frac{\sigma_m}{\sigma_b}\right)^2=1`,
    note: '抛物线型疲劳判据，比 Goodman 线更贴近塑性材料试验数据。',
    chapter: '03',
    link: '/chapters/03-strength',
    keys: '抛物线 疲劳'
  },
  {
    name: 'Soderberg 方程',
    cat: '强度',
    latex: String.raw`\frac{\sigma_a}{\sigma_{-1}}+\frac{\sigma_m}{\sigma_s}=1`,
    note: '用屈服极限代替强度极限，最保守，适合对变形和屈服敏感的零件。',
    chapter: '03',
    link: '/chapters/03-strength',
    keys: '屈服 保守'
  },
  {
    name: 'Hertz 接触应力',
    cat: '强度',
    latex: String.raw`\sigma_{H\max}=\sqrt{\frac{F_n}{\pi b}\cdot\frac{1/\rho}{\frac{1-\mu_1^2}{E_1}+\frac{1-\mu_2^2}{E_2}}}`,
    note: '线接触最大接触压应力；1/ρ = 1/ρ₁ + 1/ρ₂。齿轮、滚动轴承的点蚀计算基础。',
    chapter: '03',
    link: '/chapters/03-strength',
    hot: true,
    keys: '赫兹 接触疲劳 点蚀'
  },
  {
    name: '螺栓总拉力',
    cat: '连接',
    latex: String.raw`F_2=F_0+\frac{C_b}{C_b+C_m}F`,
    note: '预紧螺栓受轴向工作载荷 F 后的总拉力。C_b、C_m 分别为螺栓与被连接件刚度。',
    chapter: '05',
    link: '/chapters/05-threaded-connections',
    hot: true,
    keys: '预紧 刚度 残余预紧力'
  },
  {
    name: '螺栓强度校核',
    cat: '连接',
    latex: String.raw`\sigma=\frac{1.3F_2}{\frac{\pi}{4}d_1^2}\le[\sigma]`,
    note: '系数 1.3 近似计入拧紧扭转切应力，d₁ 为螺纹小径。',
    chapter: '05',
    link: '/chapters/05-threaded-connections',
    keys: '拉扭复合 小径'
  },
  {
    name: '拧紧力矩估算',
    cat: '连接',
    latex: String.raw`T\approx 0.2F_0d`,
    note: '钢制粗牙螺栓在常用摩擦条件下的工程估算式，d 为公称直径。',
    chapter: '05',
    link: '/chapters/05-threaded-connections',
    keys: '预紧力 扳手'
  },
  {
    name: '螺旋传动效率',
    cat: '连接',
    latex: String.raw`\eta=\frac{\tan\psi}{\tan(\psi+\varphi_v)}`,
    note: 'ψ 为导程角，φᵥ 为当量摩擦角。ψ 越小越易自锁，但效率越低。',
    chapter: '05',
    link: '/chapters/05-threaded-connections',
    keys: '自锁 导程角'
  },
  {
    name: '平键挤压强度',
    cat: '连接',
    latex: String.raw`\sigma_p=\frac{2T}{dkl}\le[\sigma_p]`,
    note: 'k 为接触高度（通常约 h/2），l 为工作长度；A 型平键 l = L − b。',
    chapter: '06',
    link: '/chapters/06-keys-splines-pins',
    hot: true,
    keys: '平键 压溃'
  },
  {
    name: '平键剪切强度',
    cat: '连接',
    latex: String.raw`\tau=\frac{2T}{dbl}\le[\tau]`,
    note: 'b 为键宽。一般挤压是主要失效，剪切校核用于重要连接。',
    chapter: '06',
    link: '/chapters/06-keys-splines-pins',
    keys: '键 剪切'
  },
  {
    name: '带传动有效拉力',
    cat: '传动',
    latex: String.raw`F_e=1000\frac{P}{v}`,
    note: 'P 为传递功率（kW），v 为带速（m/s），F_e 为紧边与松边拉力之差。',
    chapter: '08',
    link: '/chapters/08-belt-drives',
    hot: true,
    keys: '功率 带速'
  },
  {
    name: '柔索欧拉公式',
    cat: '传动',
    latex: String.raw`\frac{F_1}{F_2}=e^{f\alpha}`,
    note: '临界状态下紧边与松边拉力之比；f 为摩擦系数，α 为包角（rad）。',
    chapter: '08',
    link: '/chapters/08-belt-drives',
    keys: '包角 摩擦'
  },
  {
    name: '最大有效拉力',
    cat: '传动',
    latex: String.raw`F_{ec}=2F_0\frac{e^{f\alpha}-1}{e^{f\alpha}+1}`,
    note: '初拉力 F₀ 越大、包角和摩擦系数越大，极限有效拉力越高。',
    chapter: '08',
    link: '/chapters/08-belt-drives',
    keys: '打滑 初拉力'
  },
  {
    name: 'V 带根数',
    cat: '传动',
    latex: String.raw`z=\frac{K_AP}{(P_0+\Delta P_0)K_\alpha K_L}`,
    note: '按单根带额定功率、包角系数和长度系数修正，结果向上取整。',
    chapter: '08',
    link: '/chapters/08-belt-drives',
    keys: 'V带 设计'
  },
  {
    name: '平均链速',
    cat: '传动',
    latex: String.raw`v=\frac{z_1pn_1}{60000}`,
    note: 'p 为节距（mm），n₁ 为主动链轮转速（r/min），v 的单位为 m/s。',
    chapter: '09',
    link: '/chapters/09-chain-drives',
    keys: '链轮 节距'
  },
  {
    name: '链节数',
    cat: '传动',
    latex: String.raw`L_p=\frac{2a}{p}+\frac{z_1+z_2}{2}+\left(\frac{z_2-z_1}{2\pi}\right)^2\frac{p}{a}`,
    note: '计算后圆整为偶数，避免使用过渡链节。a 为中心距。',
    chapter: '09',
    link: '/chapters/09-chain-drives',
    keys: '中心距 链长'
  },
  {
    name: '齿轮圆周力',
    cat: '传动',
    latex: String.raw`F_t=\frac{2T_1}{d_1}`,
    note: 'T₁ 为小齿轮转矩，d₁ 为分度圆直径。它是齿轮强度计算的基准力。',
    chapter: '10',
    link: '/chapters/10-gear-drives',
    hot: true,
    keys: '转矩 分度圆'
  },
  {
    name: '直齿轮径向力',
    cat: '传动',
    latex: String.raw`F_r=F_t\tan\alpha`,
    note: '标准压力角 α = 20°。径向力使轴产生弯曲，方向指向轮心。',
    chapter: '10',
    link: '/chapters/10-gear-drives',
    keys: '压力角'
  },
  {
    name: '斜齿轮轴向力',
    cat: '传动',
    latex: String.raw`F_a=F_t\tan\beta`,
    note: 'β 为螺旋角。轴向力由轴承承担，β 过大会增加轴承负担。',
    chapter: '10',
    link: '/chapters/10-gear-drives',
    keys: '螺旋角 轴向力'
  },
  {
    name: '齿面接触强度',
    cat: '传动',
    latex: String.raw`\sigma_H=Z_EZ_HZ_\varepsilon\sqrt{\frac{2KT_1}{bd_1^2}\cdot\frac{u+1}{u}}`,
    note: 'Z_E 弹性系数、Z_H 节点区域系数、Z_ε 重合度系数；u 为大、小齿轮齿数比。',
    chapter: '10',
    link: '/chapters/10-gear-drives',
    hot: true,
    keys: '点蚀 接触疲劳'
  },
  {
    name: '齿根弯曲强度',
    cat: '传动',
    latex: String.raw`\sigma_F=\frac{2KT_1Y_{Fa}Y_{Sa}Y_\varepsilon}{bd_1m}\le[\sigma_F]`,
    note: 'Y_Fa 齿形系数、Y_Sa 应力修正系数；斜齿轮还需计入螺旋角系数 Y_β。',
    chapter: '10',
    link: '/chapters/10-gear-drives',
    keys: '弯曲疲劳 齿根'
  },
  {
    name: '蜗杆传动比',
    cat: '传动',
    latex: String.raw`i=\frac{n_1}{n_2}=\frac{z_2}{z_1}`,
    note: 'z₁ 为蜗杆头数，z₂ 为蜗轮齿数。单头蜗杆可获得很大传动比。',
    chapter: '11',
    link: '/chapters/11-worm-drives',
    hot: true,
    keys: '头数 蜗轮'
  },
  {
    name: '蜗杆传动效率',
    cat: '传动',
    latex: String.raw`\eta=\frac{\tan\gamma}{\tan(\gamma+\varphi_v)}`,
    note: 'γ 为导程角，φᵥ 为当量摩擦角。滑动摩擦大，效率通常低于齿轮传动。',
    chapter: '11',
    link: '/chapters/11-worm-drives',
    keys: '导程角 自锁'
  },
  {
    name: '蜗杆热平衡',
    cat: '传动',
    latex: String.raw`1000P(1-\eta)=K_sA(t_1-t_0)`,
    note: 'P 为输入功率（kW），K_s 散热系数，A 散热面积，t₁ 为油温，t₀ 为环境温度。',
    chapter: '11',
    link: '/chapters/11-worm-drives',
    keys: '温升 散热'
  },
  {
    name: '滑动轴承比压',
    cat: '轴系',
    latex: String.raw`p=\frac{F}{dB}\le[p]`,
    note: 'd 为轴颈直径，B 为轴承宽度。用于非液体摩擦轴承的耐磨性限制。',
    chapter: '12',
    link: '/chapters/12-sliding-bearings',
    keys: '非液体润滑 耐磨'
  },
  {
    name: '滑动轴承 pv 值',
    cat: '轴系',
    latex: String.raw`pv=\frac{F}{dB}\cdot\frac{\pi dn}{60}\le[pv]`,
    note: 'p v 与单位面积摩擦功率成正比，限制它可控制轴承温升。',
    chapter: '12',
    link: '/chapters/12-sliding-bearings',
    hot: true,
    keys: '发热 温升'
  },
  {
    name: '滚动轴承寿命',
    cat: '轴系',
    latex: String.raw`L_{10h}=\frac{10^6}{60n}\left(\frac{C}{P}\right)^\varepsilon`,
    note: 'C 为基本额定动载荷，P 为当量动载荷；球轴承 ε = 3，滚子轴承 ε = 10/3。',
    chapter: '13',
    link: '/chapters/13-rolling-bearings',
    hot: true,
    keys: 'L10 额定动载荷'
  },
  {
    name: '轴承当量动载荷',
    cat: '轴系',
    latex: String.raw`P=XF_r+YF_a`,
    note: 'X、Y 由 F_a/F_r 与参数 e 比较后查表确定；深沟球轴承的 Y 随轴向载荷变化。',
    chapter: '13',
    link: '/chapters/13-rolling-bearings',
    keys: '径向载荷 轴向载荷'
  },
  {
    name: '轴扭转切应力',
    cat: '轴系',
    latex: String.raw`\tau_T=\frac{T}{W_T}=\frac{9550P/n}{0.2d^3}`,
    note: '实心圆轴 W_T ≈ 0.2d³。用于按扭转强度初步估算轴径。',
    chapter: '15',
    link: '/chapters/15-shafts',
    keys: '扭转 轴径'
  },
  {
    name: '轴径估算',
    cat: '轴系',
    latex: String.raw`d\ge A_0\sqrt[3]{\frac{P}{n}}`,
    note: 'A₀ 由材料许用切应力决定；P 单位 kW，n 单位 r/min，d 单位 mm。',
    chapter: '15',
    link: '/chapters/15-shafts',
    hot: true,
    keys: '初估 轴径'
  },
  {
    name: '弯扭合成强度',
    cat: '轴系',
    latex: String.raw`\sigma_{ca}=\sqrt{\sigma_b^2+3(\alpha\tau_T)^2}\le[\sigma_{-1}]`,
    note: 'α 为转矩循环特性折合系数：稳定转矩约 0.3，脉动约 0.6，频繁正反转取 1。',
    chapter: '15',
    link: '/chapters/15-shafts',
    hot: true,
    keys: '当量应力 弯扭'
  },
  {
    name: '弹簧曲度系数',
    cat: '弹簧',
    latex: String.raw`K=\frac{4C-1}{4C-4}+\frac{0.615}{C}`,
    note: 'Wahl 系数，计入簧丝曲率和直接剪切效应；C = D/d 为旋绕比。',
    chapter: '16',
    link: '/chapters/16-springs',
    keys: 'Wahl 旋绕比'
  },
  {
    name: '弹簧最大切应力',
    cat: '弹簧',
    latex: String.raw`\tau=\frac{8KFD}{\pi d^3}\le[\tau]`,
    note: 'F 为轴向载荷，D 为中径，d 为簧丝直径。',
    chapter: '16',
    link: '/chapters/16-springs',
    hot: true,
    keys: '压缩弹簧 强度'
  },
  {
    name: '弹簧变形',
    cat: '弹簧',
    latex: String.raw`\lambda=\frac{8FD^3n}{Gd^4}`,
    note: 'n 为有效圈数，G 为材料切变模量。变形与 D³ 成正比、与 d⁴ 成反比。',
    chapter: '16',
    link: '/chapters/16-springs',
    keys: '变形 圈数'
  },
  {
    name: '弹簧刚度',
    cat: '弹簧',
    latex: String.raw`F'=\frac{Gd}{8D^3n}`,
    note: '增加簧丝直径或减少有效圈数会提高刚度；增大中径会显著降低刚度。',
    chapter: '16',
    link: '/chapters/16-springs',
    keys: '刚度 圈数'
  },
  {
    name: '循环应力参数',
    cat: '强度',
    latex: String.raw`\sigma_m=\frac{\sigma_{\max}+\sigma_{\min}}{2},\quad \sigma_a=\frac{\sigma_{\max}-\sigma_{\min}}{2}`,
    note: '平均应力与应力幅；应力比 r = σmin/σmax。对称循环 r = −1，脉动循环 r = 0。',
    chapter: '03',
    link: '/chapters/03-strength',
    keys: '应力比 平均应力 应力幅'
  },
  {
    name: '零件疲劳安全系数',
    cat: '强度',
    latex: String.raw`S_{ca}=\frac{\sigma_{-1}}{K_\sigma\sigma_a+\psi_\sigma\sigma_m}\ge S`,
    note: '用综合影响系数 Kσ 和材料常数 ψσ 修正后的零件疲劳强度条件。',
    chapter: '03',
    link: '/chapters/03-strength',
    keys: '综合影响系数 疲劳'
  },
  {
    name: 'Miner 损伤累积',
    cat: '强度',
    latex: String.raw`\sum_{i=1}^{k}\frac{n_i}{N_i}=1`,
    note: '不稳定变应力的线性损伤累积假设；损伤和达到 1 时认为发生疲劳破坏。',
    chapter: '03',
    link: '/chapters/03-strength',
    keys: '疲劳损伤 载荷谱'
  },
  {
    name: '螺纹升角与自锁',
    cat: '连接',
    latex: String.raw`\tan\psi=\frac{nP}{\pi d_2},\qquad \psi\le\varphi_v`,
    note: '导程角由线数、螺距和中径决定；ψ 不大于当量摩擦角时螺旋副自锁。',
    chapter: '05',
    link: '/chapters/05-threaded-connections',
    keys: '导程 自锁 当量摩擦角'
  },
  {
    name: '残余预紧力',
    cat: '连接',
    latex: String.raw`F_1=F_0-\frac{C_m}{C_b+C_m}F`,
    note: '受轴向工作载荷后，被连接件卸载一部分，螺栓残余预紧力必须大于零。',
    chapter: '05',
    link: '/chapters/05-threaded-connections',
    keys: '预紧 刚度 残余'
  },
  {
    name: '螺栓组受转矩',
    cat: '连接',
    latex: String.raw`F_{\max}=\frac{Tr_{\max}}{\sum_{i=1}^{z}r_i^2}`,
    note: '转矩作用下各螺栓的横向力与到形心距离成正比，离形心最远的螺栓受力最大。',
    chapter: '05',
    link: '/chapters/05-threaded-connections',
    keys: '螺栓组 转矩 形心'
  },
  {
    name: '螺栓组受倾覆力矩',
    cat: '连接',
    latex: String.raw`F_{\max}=\frac{ML_{\max}}{\sum_{i=1}^{z}L_i^2}`,
    note: '底板视为刚性时，倾覆力矩使离翻转轴最远的螺栓承受最大工作拉力。',
    chapter: '05',
    link: '/chapters/05-threaded-connections',
    keys: '倾覆 翻转轴'
  },
  {
    name: '铰制孔螺栓剪切',
    cat: '连接',
    latex: String.raw`\tau=\frac{4F}{\pi d_0^2}\le[\tau]`,
    note: '铰制孔用螺栓直接承受横向剪力；d₀ 取螺栓孔直径。',
    chapter: '05',
    link: '/chapters/05-threaded-connections',
    keys: '剪切 铰制孔'
  },
  {
    name: '花键挤压强度',
    cat: '连接',
    latex: String.raw`\sigma_p=\frac{2T}{d_mhlz}\le[\sigma_p]`,
    note: 'dm 为平均直径，h 为齿面工作高度，l 为工作长度，z 为齿数。',
    chapter: '06',
    link: '/chapters/06-keys-splines-pins',
    keys: '花键 挤压'
  },
  {
    name: '铆钉剪切强度',
    cat: '连接',
    latex: String.raw`\tau=\frac{4F}{z\pi d^2}\le[\tau]`,
    note: 'z 为铆钉数，d 为铆钉直径；双剪切时每个剪切面的剪力应取 F/2。',
    chapter: '07',
    link: '/chapters/07-riveting-welding-bonding',
    keys: '铆接 剪切'
  },
  {
    name: '角焊缝强度',
    cat: '连接',
    latex: String.raw`\sigma=\frac{F}{0.7hl}\le[\sigma]`,
    note: '角焊缝有效厚度取 0.7h，h 为焊脚尺寸，l 为有效焊缝长度。',
    chapter: '07',
    link: '/chapters/07-riveting-welding-bonding',
    keys: '焊接 角焊缝'
  },
  {
    name: '过盈连接转矩',
    cat: '连接',
    latex: String.raw`T=\frac{\pi d^2lpf}{2}`,
    note: '靠配合面径向压力 p 产生的摩擦传递转矩；l 为配合长度，f 为摩擦系数。',
    chapter: '07',
    link: '/chapters/07-riveting-welding-bonding',
    keys: '过盈 摩擦 转矩'
  },
  {
    name: '小带轮包角',
    cat: '传动',
    latex: String.raw`\alpha_1=180^\circ-\frac{d_{d2}-d_{d1}}{a}\times57.3^\circ`,
    note: 'V 带传动要求 α₁ ≥ 120°；包角过小会降低极限有效拉力。',
    chapter: '08',
    link: '/chapters/08-belt-drives',
    keys: '包角 中心距'
  },
  {
    name: '带长',
    cat: '传动',
    latex: String.raw`L_{d0}=2a_0+\frac{\pi}{2}(d_{d1}+d_{d2})+\frac{(d_{d2}-d_{d1})^2}{4a_0}`,
    note: '初定中心距后计算带长，再按标准基准长度选取并反算实际中心距。',
    chapter: '08',
    link: '/chapters/08-belt-drives',
    keys: '基准长度 中心距'
  },
  {
    name: '带初拉力',
    cat: '传动',
    latex: String.raw`F_0=500\frac{(2.5-K_\alpha)P_{ca}}{K_\alpha zv}+qv^2`,
    note: '按计算功率、包角、带速和单位长度质量确定单根 V 带的最小初拉力。',
    chapter: '08',
    link: '/chapters/08-belt-drives',
    keys: '初拉力 张紧'
  },
  {
    name: '带传动压轴力',
    cat: '传动',
    latex: String.raw`F_p=2zF_0\sin\frac{\alpha_1}{2}`,
    note: '带传动作用在轴上的压轴力，用于轴和轴承设计。',
    chapter: '08',
    link: '/chapters/08-belt-drives',
    keys: '压轴力 轴承载荷'
  },
  {
    name: '带传动比',
    cat: '传动',
    latex: String.raw`i=\frac{n_1}{n_2}=\frac{d_{d2}}{d_{d1}(1-\varepsilon)}`,
    note: 'ε 为滑动率；忽略弹性滑动时 i ≈ dd2/dd1。',
    chapter: '08',
    link: '/chapters/08-belt-drives',
    keys: '传动比 滑动率'
  },
  {
    name: '链传动比',
    cat: '传动',
    latex: String.raw`i=\frac{n_1}{n_2}=\frac{z_2}{z_1}`,
    note: '这是平均传动比；由于多边形效应，瞬时传动比会周期性波动。一般取 i ≤ 6，常用 2～3.5。',
    chapter: '09',
    link: '/chapters/09-chain-drives',
    keys: '链轮 齿数'
  },
  {
    name: '齿轮载荷系数',
    cat: '传动',
    latex: String.raw`K=K_AK_vK_\beta K_\alpha`,
    note: '使用系数、动载系数、齿向载荷分布系数和齿间载荷分配系数的乘积。',
    chapter: '10',
    link: '/chapters/10-gear-drives',
    keys: '计算载荷 系数'
  },
  {
    name: '齿面接触强度设计式',
    cat: '传动',
    latex: String.raw`d_1\ge\sqrt[3]{\frac{2KT_1}{\phi_d}\cdot\frac{u+1}{u}\left(\frac{Z_EZ_HZ_\varepsilon}{[\sigma_H]}\right)^2}`,
    note: '闭式软齿面齿轮按接触强度确定小齿轮分度圆直径，再校核弯曲强度。',
    chapter: '10',
    link: '/chapters/10-gear-drives',
    keys: '接触疲劳 设计式'
  },
  {
    name: '齿根弯曲强度设计式',
    cat: '传动',
    latex: String.raw`m\ge\sqrt[3]{\frac{2KT_1Y_{Fa}Y_{Sa}Y_\varepsilon}{\phi_dz_1^2[\sigma_F]}}`,
    note: '按弯曲强度确定模数，结果向上圆整为标准模数。',
    chapter: '10',
    link: '/chapters/10-gear-drives',
    keys: '弯曲疲劳 模数'
  },
  {
    name: '蜗杆几何尺寸',
    cat: '传动',
    latex: String.raw`d_1=mq,\quad d_2=mz_2,\quad a=\frac{m(q+z_2)}{2}`,
    note: 'q 为蜗杆直径系数，z₂ 为蜗轮齿数；中心距由模数、q 和 z₂ 共同决定。',
    chapter: '11',
    link: '/chapters/11-worm-drives',
    keys: '蜗杆 几何 中心距'
  },
  {
    name: '蜗杆轴向力',
    cat: '传动',
    latex: String.raw`F_{a1}=F_{t2}=\frac{2T_2}{d_2}`,
    note: '蜗杆轴向力与蜗轮圆周力大小相等；蜗轮轴向力等于蜗杆圆周力。',
    chapter: '11',
    link: '/chapters/11-worm-drives',
    keys: '受力 轴向力'
  },
  {
    name: '减速器输出转矩',
    cat: '传动',
    latex: String.raw`T_2=T_1i\eta`,
    note: '降速增矩关系；效率 η 包括齿轮、轴承、搅油和密封损失。',
    chapter: '18',
    link: '/chapters/18-reducers-variators',
    keys: '减速器 转矩 效率'
  },
  {
    name: '总传动比',
    cat: '传动',
    latex: String.raw`i=i_1i_2\cdots i_k`,
    note: '多级传动总传动比等于各级传动比之积，分配时要兼顾尺寸、承载和浸油。',
    chapter: '18',
    link: '/chapters/18-reducers-variators',
    keys: '多级 传动比分配'
  },
  {
    name: '最小油膜厚度',
    cat: '轴系',
    latex: String.raw`h_{\min}=r\psi(1-\chi)`,
    note: 'r 为轴颈半径，ψ 为相对间隙，χ 为偏心率；必须大于许用油膜厚度。',
    chapter: '12',
    link: '/chapters/12-sliding-bearings',
    keys: '流体润滑 油膜'
  },
  {
    name: '轴承静载荷校核',
    cat: '轴系',
    latex: String.raw`P_0=X_0F_r+Y_0F_a\le\frac{C_0}{S_0}`,
    note: '低速重载或冲击工况下，除寿命外还要校核基本额定静载荷 C₀。',
    chapter: '13',
    link: '/chapters/13-rolling-bearings',
    keys: '静载荷 额定'
  },
  {
    name: '联轴器计算转矩',
    cat: '轴系',
    latex: String.raw`T_{ca}=K_AT`,
    note: '按名义转矩乘以工况系数选型，同时校核许用转速、轴孔直径和补偿量。',
    chapter: '14',
    link: '/chapters/14-couplings-clutches',
    keys: '联轴器 选型'
  },
  {
    name: '轴疲劳安全系数',
    cat: '轴系',
    latex: String.raw`S=\frac{S_\sigma S_\tau}{\sqrt{S_\sigma^2+S_\tau^2}}\ge[S]`,
    note: '弯扭复合交变应力下，由正应力安全系数和切应力安全系数合成。',
    chapter: '15',
    link: '/chapters/15-shafts',
    keys: '疲劳 弯扭 安全系数'
  },
  {
    name: '扭转弹簧应力',
    cat: '弹簧',
    latex: String.raw`\sigma=\frac{32T}{\pi d^3}`,
    note: '圆柱螺旋扭转弹簧的簧丝主要承受弯曲应力，T 为转矩。',
    chapter: '16',
    link: '/chapters/16-springs',
    keys: '扭转弹簧 弯曲'
  }
]

const formulas = raw.map((item) => ({
  ...item,
  html: katex.renderToString(item.latex, {
    throwOnError: false,
    strict: false,
    displayMode: false
  })
}))

const props = withDefaults(defineProps<{ compact?: boolean; limit?: number }>(), {
  compact: false,
  limit: 6
})

const query = ref('')
const category = ref('全部')
const copied = ref('')

const categories = ['全部', '强度', '连接', '传动', '轴系', '弹簧'] as const

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return formulas.filter((f) => {
    const catOk = category.value === '全部' || f.cat === category.value
    const textOk =
      !q ||
      `${f.name} ${f.note} ${f.keys || ''} ${f.chapter}`.toLowerCase().includes(q)
    return catOk && textOk
  })
})

const shown = computed(() =>
  props.compact
    ? formulas.filter((f) => f.hot).slice(0, props.limit)
    : filtered.value
)

async function copy(item: (typeof formulas)[number]) {
  try {
    await navigator.clipboard.writeText(item.latex)
    copied.value = item.name
    window.setTimeout(() => {
      if (copied.value === item.name) copied.value = ''
    }, 1600)
  } catch {
    copied.value = ''
  }
}
</script>

<template>
  <section class="formula-search" :class="{ 'is-compact': compact }">
    <header v-if="compact" class="formula-search__compact-head">
      <div>
        <span class="formula-search__eyebrow">FORMULA INDEX</span>
        <h2>先查公式，再回章节</h2>
      </div>
      <a :href="withBase('/appendix/formulas')">全部 66 个公式 →</a>
    </header>

    <template v-if="!compact">
      <div class="formula-search__controls">
        <div class="formula-search__input">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" />
            <path d="m16 16 4.5 4.5" />
          </svg>
          <input v-model="query" type="search" placeholder="搜索公式、符号或关键词，例如：螺栓、L10、包角…" />
          <button v-if="query" aria-label="清除" @click="query = ''">×</button>
        </div>
        <span class="formula-search__result">{{ shown.length }} 条</span>
      </div>

      <div class="formula-search__tabs">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="{ active: category === cat }"
          @click="category = cat"
        >
          {{ cat }}
        </button>
      </div>
    </template>

    <div class="formula-grid">
      <article v-for="item in shown" :key="item.name" class="formula-card">
        <div class="formula-card__top">
          <span class="formula-card__cat">{{ item.cat }}</span>
          <a class="formula-card__chapter" :href="withBase(item.link)">第 {{ item.chapter }} 章 ↗</a>
        </div>
        <h3>{{ item.name }}</h3>
        <div class="formula-card__math" v-html="item.html" />
        <p>{{ item.note }}</p>
        <button class="formula-card__copy" @click="copy(item)">
          {{ copied === item.name ? '已复制 LaTeX' : '复制 LaTeX' }}
        </button>
      </article>
    </div>

    <p v-if="!shown.length" class="formula-search__empty">
      没有匹配的公式。试试更短的关键词，或切换到“全部”。
    </p>
  </section>
</template>

<style scoped>
.formula-search {
  margin: 28px 0;
}

.formula-search__compact-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}

.formula-search__compact-head h2 {
  margin: 3px 0 0;
  padding: 0;
  border: 0;
  font-size: 26px;
  letter-spacing: -0.02em;
}

.formula-search__compact-head a {
  flex: none;
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.formula-search__eyebrow {
  color: var(--vp-c-brand-1);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.formula-search__controls {
  display: flex;
  align-items: center;
  gap: 14px;
}

.formula-search__input {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 9px;
  padding: 0 13px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
}

.formula-search__input:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.formula-search__input svg {
  flex: none;
  width: 17px;
  height: 17px;
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1.7;
}

.formula-search__input input {
  width: 100%;
  height: 42px;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.formula-search__input button {
  border: 0;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 18px;
  cursor: pointer;
}

.formula-search__result {
  flex: none;
  color: var(--vp-c-text-3);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 11px;
}

.formula-search__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin: 12px 0 18px;
}

.formula-search__tabs button {
  padding: 5px 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 11px;
  cursor: pointer;
}

.formula-search__tabs button.active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
}

.formula-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.formula-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  padding: 17px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 13px;
  background: var(--vp-c-bg);
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.formula-card:hover {
  border-color: rgba(11, 99, 206, 0.45);
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(15, 40, 80, 0.07);
}

.formula-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.formula-card__cat {
  color: var(--vp-c-text-3);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.formula-card__chapter {
  color: var(--vp-c-brand-1);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 9.5px;
  text-decoration: none;
}

.formula-card h3 {
  margin: 7px 0 0;
  color: var(--vp-c-text-1);
  font-size: 14.5px;
  font-weight: 700;
}

.formula-card__math {
  margin: 8px 0 4px;
  overflow-x: auto;
  overflow-y: hidden;
  color: var(--vp-c-text-1);
  font-size: 14px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.formula-card__math::-webkit-scrollbar {
  display: none;
}

.formula-card p {
  flex: 1;
  margin: 5px 0 0;
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  line-height: 1.65;
}

.formula-card__copy {
  align-self: flex-start;
  margin-top: 10px;
  padding: 3px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  background: transparent;
  color: var(--vp-c-text-3);
  font-size: 10px;
  cursor: pointer;
}

.formula-card__copy:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.formula-search__empty {
  padding: 30px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  color: var(--vp-c-text-3);
  font-size: 13px;
  text-align: center;
}

@media (max-width: 640px) {
  .formula-grid {
    grid-template-columns: 1fr;
  }

  .formula-search__compact-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }

  .formula-search__compact-head h2 {
    font-size: 22px;
  }
}
</style>
