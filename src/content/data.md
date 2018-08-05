---
title: '认识数据'
route: /data
index: 2
meta:
  style:
    - cssText: '.markdown-body img { width: 100%!important }'
---

# 认识数据

## 数据对象与属性类型

**数据对象**：代表一个实体，又称为样本、实例、数据点

**数据属性**的不同称谓 ——

- $attribute$
- $dimension$（数据仓库）
- $feature$（机器学习）
- $variable$（统计学）

### 属性类型

| 类型    | 说明 | 其他 |
| ------- | ---- | --- |
| $nominal$ | 代表某种类别、编码、状态，分类的，非定量数据 | 无法用均值、中值衡量；可以用众数衡量。<br/>如颜色、职业等 |
| $binary$  | **对称**：对取值无偏好，价值、权重相同，如男女性别；<br/>**非对称**：状态结果不是同等重要的，如化验结果阴阳 | - |
| $ordinal$ | 有序的，但差值无意义 | 如满意度，小杯中杯大杯等|
| $numeric$ | **区间标度**（$\text{interval-scaled}$）：$\degree C$、$AD 2018$<br/>**比率标度**（$\text{ratio-scaled}$）：$\degree K$ | $\text{ratio-scaled}$ 属性具有固定零点，可以计算比例 |

此外，还有按照**离散**、**连续**来区分数据。


## 基本统计描述

### 1、中心趋势

- 均值（$mean$）
  - 对极端值敏感
  - 使用截尾均值（$\text{trimmed mean}$），如去掉头尾的 $\text{2 \%}$

- 中值（$median$）
  - 对非对称数据来说，中值是更好的度量方式
  - 使用插值计算中位数近似值（$L1$ 中位数区间下界，$width$ 中位数区间宽度） ——

$$
median = L_l + \left( \frac{ N/2 - (\sum{freq})_l }{freq_{median}} \right){width}
$$

- 众数（$mode$）
  - 多个众数的分布：单峰、双峰（$bimodal$）、三峰（$trimodal$）

- 中列数（$midrange$）
  - 最大值和最小值的均值

### 2、数据分散程度

- 极差（range）

- 四分位数（$quartile$）: $Q_1 \enspace Q_2 \enspace Q_3$

- 四分位极差：$IQR = Q_3 - Q_1$

- 五数概括：$Minimun$，$Q_1$，$Median$，$Q_3$，$Maximun$

- 箱线图（$boxplot$）与离群点：

[![](https://ws3.sinaimg.cn/large/006tNc79ly1ftz7bd11xdj31340k8jrr.jpg){style="max-width: 600px;"}](https://antv.alipay.com/zh-cn/g2/3.x/demo/box/with-error.html)

- 方差与标准差：
  - $\left(1 - 1/{k^2} \right) \times 100\%$ 的观测离均值不超过 $k$ 个标准差

## 数据可视化

### 基于像素的可视化

![](https://ws4.sinaimg.cn/large/006tNc79ly1ftz75upy61j30x00hm764.jpg){style="max-width: 400px;"}

### 几何投影可视化

- 散点图、三维散点图

[![](https://ws3.sinaimg.cn/large/006tNc79ly1ftz7ivxt1oj312i0lu0tf.jpg){style="max-width: 600px;"}](https://antv.alipay.com/zh-cn/g2/3.x/demo/index.html)

- 三点矩阵：可以参见 antv 的[矩阵分面](https://antv.alipay.com/zh-cn/g2/3.x/demo/facet/matrix.html)

- 平行坐标可视化：数据过多的时候可读性差

[![](https://ws2.sinaimg.cn/large/006tNc79ly1ftz7udtuo0j318u0mqwh8.jpg){style="max-width: 600px"}](https://www.douban.com/note/663111627/)


### 基于 $\text{icon}$ 的可视化

1. [$\text{Chernoff faces}$](https://en.wikipedia.org/wiki/Chernoff_face)：18 维 OR 36 维数据。可阅读 [How to visualize data with cartoonish faces ala Chernoff](http://flowingdata.com/2010/08/31/how-to-visualize-data-with-cartoonish-faces/)。插图来自维基百科 ——

[![Chernoff_faces_for_evaluations_of_US_judges](https://upload.wikimedia.org/wikipedia/commons/1/17/Chernoff_faces_for_evaluations_of_US_judges.svg){style="max-width: 600px"}](https://en.wikipedia.org/wiki/File:Chernoff_faces_for_evaluations_of_US_judges.svg)

2. 人物线条画（$\text{stick figures}$）：二维坐标轴，四肢 + 躯体。（[链接](https://slidewiki.org/deck/1401/slide/10477-3/10477-3:3/view)）

### 层次可视化

- $\text{worlds-within-worlds, or N-vision}$：
- $\text{tree map}$：层次数据 $\Rightarrow$ 嵌套矩形

[![](https://ws4.sinaimg.cn/large/006tNc79ly1ftz8ym3h0qj31800s6ta1.jpg){style="max-width: 600px"}](https://antv.alipay.com/zh-cn/vis/chart/treemap.html)

### 复杂关系可视化

越来越多的非数值数据受到关注。

- 标签云、[词云](https://antv.alipay.com/zh-cn/vis/chart/word-cloud.html)
- etc.


## 数据的相似性、相异性度量

### 数据矩阵与相异性矩阵

$n \times p$ 数据矩阵，$n$ 代表数据量，$p$ 代表特征维度 —— 

$
\begin{bmatrix}
  x_{11} & \cdots & x_{1f} & \cdots & x_{1p} \\
  \cdots & \cdots & \cdots & \cdots & \cdots \\
  x_{i1} & \cdots & x_{if} & \cdots & x_{ip} \\
  \cdots & \cdots & \cdots & \cdots & \cdots \\
  x_{n1} & \cdots & x_{nf} & \cdots & x_{np} \\
\end{bmatrix}
$

$n \times n$ 相异性矩阵，$d(i, j)$ 代表数据 $i$ 和 $j$ 之间的差异 —— 

$
\begin{bmatrix}
  0 \\
  \small{d(2, 1)} & 0 \\
  \small{d(3, 1)} & \small{d(3, 2)} & 0 \\
  \vdots & \vdots & \vdots \\
  \small{d(n, 1)} & \small{d(n, 2)} & \cdots & \cdots & 0 \\
\end{bmatrix}
$
