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
| $nominal$ | 代表某种类别、编码、状态，分类的，非定量数据 | （定类）无法用均值、中值衡量；可以用众数衡量。<br/>如颜色、职业等 |
| $binary$  | **对称**：对取值无偏好，价值、权重相同，如男女性别；<br/>**非对称**：状态结果不是同等重要的，如化验结果阴阳 | - |
| $ordinal$ | （定序）有序的，但差值无意义 | 如满意度，小杯中杯大杯等|
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

- 散点矩阵：可以参见 antv 的[矩阵分面](https://antv.alipay.com/zh-cn/g2/3.x/demo/facet/matrix.html)

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

### $nominal$ 属性的邻近性度量

对象 $i$ 和 $j$ 之间的相异性，可以通过**不匹配类率**来计算。在下面的公式中，$p$ 是对象属性总数，$m$ 是 $i$、$j$ 取值相同的属性数量 ——

$$
d(i, j) = \frac{p -m }{p}
$$


### $binary$ 属性的邻近性度量

#### 对称二元属性的相异性

$$
d(i, j) = \frac{r + s}{q + r + s + t}
$$

- $q$：$i$ 和 $j$ 同时取 $1$ 或 $true$ 的属性数量
- $r$：$i$ 中取 $1$、$j$ 中取 $0$ 的属性数量
- $s$：$i$ 中取 $0$、$j$ 中取 $1$ 的属性数量
- $t$：$i$ 和 $j$ 同时取 $0$ 或 $false$ 的属性数量
- 容易得到，$p = q + r + s + t$
- 说白了就是两个取值相异的概率，即 $P(i \neq j)$

#### 非对称二元属性的相异性

对于非对称二元属性，通常**正匹配**被认为更重要，所以会忽略 $t$。

$$
d(i, j) = \frac{r + s}{q + r + s}
$$

非对称的二元相似性 $sim(i, j) = 1 - d(i, j)$。

另外，$sim(i, j)$ 又被成为 **$Jaccard$ 系数**。

### $numeric$ 属性的相异性度量

- 欧几里得距离：直线距离（属性有权重的情况：加权的欧几里得距离）
- 街区距离：曼哈顿距离，网格距离
- 闵可夫斯基距离：$L_p$ 范数$\tiny\text{（这里的\enspace p \enspace 就是属性数量\enspace h）}$

$$
d(i, j) = \sqrt[h]{
  \vert x_{i1} - x_{j1}\vert^h +
  \cdots +
  \vert x_{ip} - x_{jp}\vert^h
}
$$

- 上确界距离：$L_{max}$，$L_{\infty}$ 范数，切比雪夫距离

$$
d(i, j) = \overset{p}{\underset{f}{\max}} \vert x_{if} - x_{jf} \vert 
$$


### $ordinal$ 属性的邻近度量

按照排位（$ranking$）归一化为数值后计算距离。

### 混合类型属性的相异性计算

描述起来有点复杂，留个在线的[链接](http://book.51cto.com/art/201212/370040.htm)吧。下面是截图 ——

![](https://ws3.sinaimg.cn/large/0069RVTdly1fu0br8jx0dj312f0ueq56.jpg){style="max-width:600px"}


### 余弦相似性

以**词频向量**为例，两个向量可能有很多公共的 $0$ 字段。而其实我们只关注两个向量**确实**共有的词及其出现的频率。也就是说，需要一种忽略零匹配的数据度量方法。

$$
\cos{\theta} = \frac{\mathbf{x} \cdot \mathbf{y}} {
  \Vert \mathbf{x} \Vert 
  \Vert \mathbf{y} \Vert
}
$$

当属性是 $binay$ 属性时的一种解释：分子是两者共有的值为 $1$ 的属性数，分母是两者各自值为 $1$ 的属性数的算术平均。

变种：**$Tanimoto$ 距离** ——

$$
\cos{\theta} = \frac{\mathbf{x} \cdot \mathbf{y}} {
  \mathbf{x} \cdot \mathbf{x} +
  \mathbf{y} \cdot \mathbf{y} -
  \mathbf{x} \cdot \mathbf{y}
}
$$
