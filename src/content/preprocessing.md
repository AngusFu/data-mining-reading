---
title: '数据预处理'
route: /preprocessing
index: 3
---

# 数据预处理

## 概述

### 数据质量三要素

三要素：准确；完整；一致。

其他影响因素：时效性，可信性（有多少数据的用户信赖的），可解释性（数据是否容易理解）。

### 数据预处理的任务

#### 数据清理

- 填写缺失值
- 光滑噪声数据
- 识别/删除离群点
- 解决不一致性

#### 数据集成

多数据源造成的不一致性；冗余数据。

挑战：数据语义的多样性和结构。

#### 数据归约（data reduction）

得到数据集的简化表示。

- 维归约：压缩（小波变换、（PCA）），属性子集选择，属性构造
- 数量归约：使用参数模型或非参数模型，用较小的表示取代数据
- 数据压缩：对数据进行变换。有损、无损。上面两点也可以视为某种程度的数据压缩

#### 数据变换

- 规范化
- 离散化与概念分层

概念分层是一种数据离散化的形式，如将年龄数值转换为青年、中年、老年等概念。

## 数据清理

### 缺失值处理

- 忽略元组
- 人工填写缺失值
- 全局变量填充
- 使用中心度量值填充
- 使用同类样本均值/中位数
- 使用最可能的值

### 噪声数据处理

噪声是被测量的变量的随机误差或方差。下面是一些数据光滑技术 ——

#### 分箱（binning）

使用周围数据进行光滑处理。

- 均值光滑：$[a, b, c] \Rightarrow [avg, avg, avg]$
- 中位数光滑：类似均值光滑处理
- 边界光滑：将值替换为距离最近的边界值

#### 回归

使用函数进行拟合。

#### 离群点分析

通过聚类检测离群点。


## 数据集成

### 实体识别问题

注意数据结构。函数依赖、参照约束的匹配。

### 元组重复问题

如不同副本之间出现不一致的问题。

### 冗余和相关分析

使用相关分析度量一个属性能在多大程度上蕴含另一个。检验方法 ——

- nominal 属性：卡方检验
- numeric 属性： 相关系数 & 协方差

#### 卡方检验

概念：关联表，$\chi^2$ 计算

以下表为例（[source](https://blog.csdn.net/snowdroptulip/article/details/78770088)）——

![](https://ws4.sinaimg.cn/large/0069RVTdly1fu3sb6nz98j315o0b00su.jpg){style="max-width: 600px"}

```python
import numpy as np

data = np.array([[43, 96], [28, 84]])

mean = data.mean()
rows = data.shape[0]
cols = data.shape[1]
sum_by_col = data.sum(axis=0, keepdims=False).reshape((1, cols))
sum_by_row = data.sum(axis=1, keepdims=False).reshape((rows ,1))
prob_by_col = sum_by_col / data.sum()
expectation = sum_by_row * prob_by_col
chi_squared = ((expectation - data) ** 2 / expectation).sum()
# SEE https://www.cnblogs.com/emanlee/archive/2008/10/25/1319557.html
print(chi_squared > 3.84)

# PS: for 2 x 2 contingency table, you should know `Yates Correction`
# SEE http://www.statisticshowto.com/what-is-the-yates-correction/
```


```python
import numpy as np
from scipy.stats import chi2_contingency
data = np.array([[43, 96], [28, 84]])
chi2, p, dof, ex = chi2_contingency(data, correction=False)
# 1.07709494376 False
print(chi2, p < 0.05)
```

#### 相关系数

$\text{Pearson's product moment coefficient}$

负相关、正相关：$ -1 \leqslant r_{\scriptsize{A,B}} \leqslant 1$

注意，相关性并不意味着存在因果关系。

$$
r_{\scriptsize{A,B}} = \frac{
  \displaystyle\sum_{i=1}^{n}{
    (a_i - \overline{A})(b_i - \overline{B})
  }
}{n\sigma_{\scriptsize{A}}\sigma_{\scriptsize{B}}}
= \frac{
  \displaystyle\sum_{i=1}^{n}{
    (a_i b_i) - \overline{A}\thinspace\overline{B}
  }
}{n\sigma_{\scriptsize{A}}\sigma_{\scriptsize{B}}}
$$

<table style="max-width: 400px">
<tbody><tr>
<th>年广告费投入</th><th>月均销售额
</th></tr>
<tr>
<td>12.5<br>15.3<br>23.2<br>26.4<br>33.5<br>34.4<br>39.4<br>45.2<br>55.4<br>60.9</td><td>21.2<br>23.9<br>32.9<br>34.1<br>42.5<br>43.2<br>49.0<br>52.8<br>59.4<br>63.5
</td></tr></tbody></table>

数据来源：[wiki.mbalib.com](http://wiki.mbalib.com/wiki/%E7%9B%B8%E5%85%B3%E7%B3%BB%E6%95%B0)

```python
import numpy as np

ad_cost_per_year = np.array([12.5, 15.3, 23.2, 26.4, 33.5, 34.4, 39.4, 45.2, 55.4, 60.9])
monthly_sales = np.array([21.2, 23.9, 32.9, 34.1, 42.5, 43.2, 49.0, 52.8, 59.4, 63.5])

N = ad_cost_per_year.shape[0]
r = np.divide(
  np.sum(ad_cost_per_year * monthly_sales) - N * np.mean(ad_cost_per_year) * np.mean(monthly_sales),
  N * np.std(ad_cost_per_year) * np.std(monthly_sales)
)

# 0.994198376237 正相关
print(r, r > 0 and '正相关' or ( r < 0 and '负相关' or '无关'))
```

```python
from scipy.stats import pearsonr
r, p = pearsonr(ad_cost_per_year, monthly_sales)
print(r, p < 0.005)
```

#### 协方差

协方差（$covariance$）用于评估两个属性如何一起变化。

$$
Cov(A, B) = E((A - \overline{A})(B - \overline{B})) = \frac{
  \displaystyle\sum_{i=1}^{n}{
    (a_i - \overline{A})(b_i - \overline{B})
  }
}{n}
$$

$$
r_{\scriptsize{A,B}} = \frac{Cov(A, B)}{\sigma_{\scriptsize{A}}\sigma_{\scriptsize{B}}}
$$

$$
Cov(A, B) = E(A \cdot B) - \overline{A} \thinspace \overline{B}
$$

```python
np.cov(np.vstack((monthly_sales, ad_cost_per_year)), bias=True)
```

## 数据归约

### 小波变换

- 离散小波变换：DWT
- 连续的小波变换 ：CWT
- 实际应用：指纹图像压缩，计算机视觉，时间序列数据分析，数据清理

阅读材料：
- [小波变换教程：基本原理](http://blog.jobbole.com/101976/)
- [小波变换及其应用](http://www3.ntu.edu.sg/home/yfzhou/Publications/wavelet.pdf)
- [小波分析](reference.wolfram.com/language/guide/Wavelets.html.zh)
- [知乎：傅立叶分析和小波分析之间的关系](https://www.zhihu.com/question/22864189)
- [数据分析——数据预处理](http://blog.superyoung.win/2017/04/09/learning_data_analysis_with_python/about_data_preprocessing/)


### 主成分分析（PCA）

参见 [http://book.51cto.com/art/201212/370059.htm](http://book.51cto.com/art/201212/370059.htm)

阅读：[K-means和PCA主成分分析](https://cowry5.com/2018/05/29/180529-K-means%E5%92%8CPCA%E4%B8%BB%E6%88%90%E5%88%86%E5%88%86%E6%9E%90/)

<hr/>

> 余下内容直接[阅读原文](http://book.51cto.com/art/201212/369928.htm)
