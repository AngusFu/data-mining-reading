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

- 维归约：压缩（小波变换、主成分分析），属性子集选择，属性构造
- 数值归约：使用参数模型或非参数模型，用较小的表示取代数据

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
print(chi2, p < 0.05)
```
