# 每周总结可以写在这里

### css 选择器

  ##### 简单选择器

  - *
  - div svg|a

```
 <!DOCTYPE html>
 <html>
 <head>
   <meta charset="utf-8">
   <title>JS Bin</title>
   <style>
        @namespace svg url(http://www.w3.org/2000/svg);
        @namespace html url(http://www.w3.org/1999/xhtml);
        svg|a {
        stroke:blue;
        stroke-width:1;
        }
        
        html|a {
        font-size:40px
        }
   </style>
 </head>
 <body>
 <svg width="100" height="28" viewBox="0 0 100 28" version="1.1"
      xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
   <desc>Example link01 - a link on an ellipse
   </desc>
   <a xlink:href="http://www.w3.org">
     <text y="100%">name</text>
   </a>
 </svg>
 <br/>
 <a href="javascript:void 0;">name</a>
 </body>
 </html>
 ```
- .cls
- #id
-[attr=value]
    - [attr] 直接在方括号中放入属性名，是检查元素是否具有这个属性，只要元素有这个属性，不论属性是什么值，都可以被选中
    - [attr=value] 精确匹配， 检查一个元素属性的值是value
    - [attr~=value] 模糊匹配，检查value值是否是元素的若干属性值之一
    - [attr*=value] 全局匹配 检查元素的属性值的字符是否包含value值
    - [attr|=value] 开头匹配，检查一个元素是否以val开头
- :hover
- ::before

### 复合选择器

- 交集选择器 p.orange
- 并集选择器 div,p
- 后代选择器 div p
- 相邻兄弟选择器 div + p
- 子元素选择 div > p
- 属性选择器 div [attr=value]
- [简单选择][简单选择器]



### 选择器优先级

```
div#a.b .c[id=x] // [0,1,3,1]

#a:not(#b) // [0,2,0,0]

*.a // [0,0,1,0]

div.a // [0,0,1,1]

```

注: :not 不参与优先级计算
内联样式 > ID选择器 > 类选择器 > 标签选择器


[图解 css-specificity](http://www.standardista.com/css3/css-specificity/)

[w3 css-specificity](w3.org/TR/2018/WD-selectors-4-20181121/#specificity-rules)

[MDN css-specificity](https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity)


### 伪类

##### 链接/行为

- :any-link 

未访问过的链接元素

- :link:vister

访问过的链接元素

- :hover 

鼠标悬浮的元素

- :active

鼠标或键盘激活的元素

- :focus
  鼠标或键盘聚焦的元素

- :target
  锚点的目标元素

##### 树结构

- :empty
- :nth-child(an+b)
    - 0n+3 或简单的 3 匹配第三个元素。
    - 1n+0 或简单的 n 匹配每个元素。
    - 2n+0 或简单的 2n 匹配位置为 2、4、6、8...的元素（n=0时，2n+0=0，第0个元素不存在，因为是从1开始排序)。你可以使用关键字 even 来替换此表达式。
    - 2n+1 匹配位置为 1、3、5、7...的元素。你可以使用关键字 odd 来替换此表达式。
    - 3n+4 匹配位置为 4、7、10、13...的元素。

- :nth-last-child()
- :first-child
- :last-child
- :only-child


##### 逻辑型

- :not 伪类
- where :has

### 伪元素

- ::before
- ::after
- ::first-line
  - 元素的第一行
  - first-line (设置第一行为float会脱离文档流，导致下一行为第一行然后无限loop)
- ::first-letter
  - 元素的第一个字母
  

### 重学css

#### 排版

##### 盒(box)
    - margin
    - padding
    - border
    - width
    - box-sizing
  
##### 正常流

- 从左到右，会产生换行，从上到下
- 行模型 IFC
- 一个盒里面没有文字，基线为盒的底部
- 有文字，基线是文字基线
- inline可能产生多个盒


##### float clear

- 文字绕排
- 会脱离文档流
- 产生高度塌陷

##### BFC/margin重叠
> 块格式化上下文对浮动定位（参见 float）与清除浮动（参见 clear）都很重要。浮动定位和清除浮动时只会应用于同一个BFC内的元素。浮动不会影响其它BFC中元素的布局，而清除浮动只能清除同一BFC中在它前面的元素的浮动。外边距折叠（Margin collapsing）也只会发生在属于同一BFC的块级元素之间。

- 在一个正常流的bfc中可产生margin重叠
- 基本可以包含一个block box都会产生bfc


```
1. 根元素(<html>)
2. 浮动元素（元素的 float 不是 none）
3. 绝对定位元素（元素的 position 为 absolute 或 fixed）
4. 行内块元素（元素的 display 为 inline-block）
5. 表格单元格（元素的 display为 table-cell，HTML表格单元格默认为该值）
6. 表格标题（元素的 display 为 table-caption，HTML表格标题默认为该值）
7. 匿名表格单元格元素（元素的 display为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table）
8. overflow 值不为 visible 的块元素
9. display 值为 flow-root 的元素
10. contain 值为 layout、content或 paint 的元素
11. 弹性元素（display为 flex 或 inline-flex元素的直接子元素）
12. 网格元素（display为 grid 或 inline-grid 元素的直接子元素）
13. 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count 为 1）
14. column-span 为 all 的元素始终会创建一个新的BFC，即使该元素没有包裹在一个多列容器中（标准变更，Chrome bug）。

```



##### inline

- flex inline-flex
- table inline-table
- grid inline-grid
- block inline-block
- inline
- run-in

##### flex (flex-grow,flex-shrink,flex-basis)
flex: 可以指定1，2，3个值

- 单值语法： 值必须为以下其中之一:
    - 一个无单位数(<number>): 它会被当作<flex-grow>的值。
    - 一个有效的宽度(width)值: 它会被当作 <flex-basis>的值。
    - 关键字none，auto或initial.   
  
- 双值语法： 第一个值必须为一个无单位数，并且它会被当作 <flex-grow> 的值。第二个值必须为以下之一：
    - 一个无单位数：它会被当作 <flex-shrink> 的值。
    - 一个有效的宽度值: 它会被当作 <flex-basis> 的值。
- 三值语法:
    - 第一个值必须为一个无单位数，并且它会被当作 <flex-grow> 的值。
    - 第二个值必须为一个无单位数，并且它会被当作  <flex-shrink> 的值。
    - 第三个值必须为一个有效的宽度值， 并且它会被当作 <flex-basis> 的值。 

> 规定了弹性元素如何伸长或缩短以适应flex容器中的可用空间

- 主轴 交叉轴


- block-level 可以放入bfc
- block-container 可以容纳bfc元素
- bfc中可以保护一个正常流和多个ifc
- block-box = block-level + block-container
