---
title: 用户信息收集与分析
description: 收集用户信息并进行AI分析
version: 1.0
---

<!-- 支持如下的代码编辑，也支持类似notion的编辑方式 -->
<!-- 就想markdown一样，但是支持更多的元素 -->
<!-- markdown编辑器有很多，有的是直接写md, 有的是所见即所得，输入‘/’可以调出组件面板那种 -->
<!-- 期望下面的这种格式可以支持这两种编辑方式，这就是它的亮点 -->
<!-- 通过各种丰富的块来组合出强大（但不复杂）的功能，在强大的同时，通过AI来简化复杂操作 -->

# 用户信息调查

## 信息收集

<Layout id="userForm">
姓名：
  <Input type="text" id="name" required />
邮箱：
  <Input type="email" id="email" />
年龄段：
  <Input type="select" id="age" options="0-18,19-30,31-50,51+" />
头像：
  <Input type="file" id="avatar" accept="image" />
  <Action type="submit" label="提交" target="processForm" />
</Layout>

## 数据处理

<Flow id="processForm">
  <AI model="gpt-4o" id="aiProcess" output="userData">
    <Prompt>
      请分析以下用户数据,提供见解:
      {{userForm}}
    </Prompt>
  </AI>
  <Store id="userData" />
</Flow>

## 结果展示

<Logic type="if" condition="{{userData.exists}}">
  <Display type="table" data="{{userData}}" />
  <Display type="chart" chartType="pie" data="{{userData.ageGroup}}" title="年龄分布" />
</Logic>

## AI 分析

<AI model="gpt-4" id="aiAnalysis">
  <Prompt>
    分析以下用户数据,提供见解:
    {{userData}}
  </Prompt>
  <Action type="button" label="进行AI分析" />
</AI>

<Display type="markdown" source="{{aiAnalysis.output}}" />

---

- [帮助](https://example.com/help)

- © 2023 示例公司
