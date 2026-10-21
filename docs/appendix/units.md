---
title: 单位、符号与换算
description: 机械设计中常用物理量、单位、材料参数与换算关系
---

# 单位、符号与换算

> 机械设计计算中，单位错误比公式错误更常见。本页把常用量和换算集中在一起，方便随时核对。

## 常用物理量

| 物理量 | 符号 | 单位 | 备注 |
| --- | --- | --- | --- |
| 长度 | $l$ | mm | 机械设计基本长度单位 |
| 质量 | $m$ | kg | — |
| 力 | $F$ | N | $1\ \mathrm{N}=1\ \mathrm{kg\cdot m/s^2}$ |
| 力矩/转矩 | $T$ | N·m、N·mm | 强度计算常用 N·mm |
| 功率 | $P$ | kW | $1\ \mathrm{kW}=1000\ \mathrm{W}$ |
| 转速 | $n$ | r/min | 每分钟转数 |
| 角速度 | $\omega$ | rad/s | $\omega=2\pi n/60$ |
| 压力/压强 | $p$ | Pa、MPa | $1\ \mathrm{MPa}=1\ \mathrm{N/mm^2}$ |
| 正应力 | $\sigma$ | MPa | — |
| 切应力 | $\tau$ | MPa | — |
| 弹性模量 | $E$ | MPa | 钢约 $2.06\times10^5\ \mathrm{MPa}$ |
| 切变模量 | $G$ | MPa | 钢约 $7.9\times10^4\ \mathrm{MPa}$ |
| 泊松比 | $\mu$ | — | 钢约 0.3 |
| 密度 | $\rho$ | kg/m³ | 钢约 $7850\ \mathrm{kg/m^3}$ |
| 动力黏度 | $\eta$ | Pa·s | — |
| 运动黏度 | $\nu$ | mm²/s（cSt） | $\nu=\eta/\rho$ |

## 常用换算

### 长度

$$
1\ \mathrm{m}=10^3\ \mathrm{mm}=10^6\ \mu\mathrm{m}
$$

$$
1\ \mathrm{in}=25.4\ \mathrm{mm}
$$

### 力

$$
1\ \mathrm{kN}=10^3\ \mathrm{N}
$$

$$
1\ \mathrm{kgf}\approx9.807\ \mathrm{N}
$$

### 应力

$$
1\ \mathrm{MPa}=1\ \mathrm{N/mm^2}=10^6\ \mathrm{Pa}
$$

$$
1\ \mathrm{GPa}=10^3\ \mathrm{MPa}
$$

### 转矩

$$
1\ \mathrm{N\cdot m}=10^3\ \mathrm{N\cdot mm}
$$

$$
1\ \mathrm{kgf\cdot m}\approx9.807\ \mathrm{N\cdot m}
$$

### 功率

$$
1\ \mathrm{kW}=10^3\ \mathrm{W}
$$

$$
1\ \mathrm{PS}\approx0.7355\ \mathrm{kW}
$$

### 黏度

$$
1\ \mathrm{Pa\cdot s}=10^3\ \mathrm{mPa\cdot s}
$$

$$
1\ \mathrm{mm^2/s}=1\ \mathrm{cSt}=10^{-6}\ \mathrm{m^2/s}
$$

## 功率—转速—转矩

$$
T=9550\frac{P}{n}\quad(\mathrm{N\cdot m})
$$

$$
T=9.55\times10^6\frac{P}{n}\quad(\mathrm{N\cdot mm})
$$

其中 $P$ 为 kW，$n$ 为 r/min。

若已知转矩和转速，功率为：

$$
P=\frac{Tn}{9550}\quad(\mathrm{kW})
$$

## 圆周速度

$$
v=\frac{\pi dn}{60\times1000}\quad(\mathrm{m/s})
$$

其中 $d$ 为 mm，$n$ 为 r/min。

## 常用材料参数（典型值）

| 材料 | $E$ / MPa | $G$ / MPa | $\mu$ | 密度 / (kg/m³) |
| --- | --- | --- | --- | --- |
| 碳钢 | $2.06\times10^5$ | $7.9\times10^4$ | 0.30 | 7850 |
| 合金钢 | $2.06\times10^5$ | $7.9\times10^4$ | 0.30 | 7850 |
| 铸铁 | $1.2\times10^5$ | $4.5\times10^4$ | 0.25 | 7200 |
| 铝合金 | $7.0\times10^4$ | $2.6\times10^4$ | 0.33 | 2700 |
| 铜合金 | $1.1\times10^5$ | $4.0\times10^4$ | 0.34 | 8800 |

::: warning 这些只是典型值
材料参数随牌号、热处理和温度变化。正式计算应查材料标准或设计手册，不能直接套用上表。
:::

## 标准与优先数

机械设计中的尺寸、模数、螺纹、轴承、键等都必须优先采用标准值。常用标准体系：

- 国家标准（GB/T）；
- 机械行业标准（JB/T）；
- 国际标准（ISO）；
- 企业标准。

选用标准件时，要同时核对：

1. 尺寸规格；
2. 性能等级；
3. 公差与配合；
4. 材料与热处理；
5. 许用载荷/转速。

## 单位检查清单

计算前：

- [ ] 功率是 kW 还是 W？
- [ ] 转速是 r/min 还是 rad/s？
- [ ] 转矩是 N·m 还是 N·mm？
- [ ] 直径是 mm 还是 m？
- [ ] 应力是 MPa 还是 Pa？

计算后：

- [ ] 结果数量级是否合理？
- [ ] 单位是否与许用值一致？
- [ ] 是否按标准系列圆整？
- [ ] 是否检查了安全系数和适用条件？
