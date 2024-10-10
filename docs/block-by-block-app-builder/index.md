# 块级应用构建器

这里的块级别应用是指AI生成一份类似于markdown的文档。除了markdown元素外，包含了自定义的块级元素和内联元素。
这些拓展元素尽量克制，只包含最基础的元素，方便AI理解和生成。但是基本上需要包括输入、输出、按钮等核心元素。
输入可以通过变量来引用。

示例1：
一个输入多个单词，AI进行造句的应用
```markdown
请输入多个单词，用空格隔开
<Input type="text" id="words" placeholder="请输入多个单词，用空格隔开" />

<Action type="button" ai-command="请根据 {{words}} 生成一个句子" target="sentence">生成</Action>

生成结果：
<Output type="text" id="sentence" />
```
示例2:
思维发散机
```markdown
请输入一个主题，AI会根据这个主题进行思维发散

:::tip 提示
这是一个提示
:::

<Input type="text" id="topic" placeholder="请输入一个主题" />

<Action type="button" ai-command="请根据 {{topic}} 进行思维发散，输出至少5个相关的主题" model="gpt-4o" target="result">生成</Action>

思维发散结果：
<Output type="markdown" autorun id="result" />
```

示例3:
自动代办事项拆解
```markdown
请输入任何提示
<Input type="text" id="info" placeholder="请输入任何提示" />

<Action type="button" ai-command="信息： {{info}}. 请根据以上信息进行拆解，输出5个代办事项" model="gpt-4o" target="result">生成</Action>

代办事项：
<Output type="markdown" autorun id="result" />
```

示例4:
自动代办事项拆解+中英文切换
```markdown
请输入任何提示
<Input type="text" id="info" placeholder="请输入任何提示" />
<Input.Radio id="lang" options="中文,英文" />

<Action type="button" ai-command="信息： {{info}}. 请根据以上信息进行拆解，输出5个代办事项. 语言：{{lang}}" model="gpt-4o" target="result">生成</Action>

代办事项：
<Output type="mdx" autorun id="result" />
```

示例5:
交互式小说生成器
```markdown
<Setup>
<Knowledge>
mdx格式：基于markdown的拓展语法，支持更多的元素，比如按钮、输入框、输出框等。
</Knowledge>
<Preference>
在回复用户时，请使用mdx格式。在按需添加拓展元素。
<Example title="一个思维联想工具">
用户：苹果
AI：有多种联系方式。你更倾项于哪种？请选择一种：
<Input.Radio id="contact" options="邮件,电话,微信" emit="$nextMessage"/>
</Example>
在这个例子中，当用户选择完联系方式后，消息会再次发送给AI。
</Preference>
<Setup>
</Setup>


请输入一个主题
<Input type="text" id="topic" placeholder="请输入一个主题" />

<Action type="button" ai-command="续写小说。请根据 {{topic}} 生成小说的一段，并且考虑后续的不同发展方向，每个方向给出一个选项" model="gpt-4o" target="result">生成</Action>

小说：
<Output type="markdown" placeholder="等待AI生成" autorun replace id="result" />

```