# 每周总结可以写在这里

### SFC(Single-File Component, 单文件组件)

#### 模板

+ 每个 .vue 文件最多包含一个 ```<template>``` 块。
  
+ 内容将被提取并传递给 vue-template-compiler 为字符串，预处理为 JavaScript 渲染函数，并最终注入到从 ```<script>``` 导出的组件中。

#### 脚本
+ 每个 .vue 文件最多包含一个 ```<script>``` 块。

+ 这个脚本会作为一个 ES Module 来执行。

+ 它的默认导出应该是一个 Vue.js 的组件选项对象。也可以导出由 Vue.extend() 创建的扩展对象，但是普通对象是更好的选择。

+ 任何匹配 .js 文件 (或通过它的 lang 特性指定的扩展名) 的 webpack 规则都将会运用到这个 ```<script>``` 块的内容中。

#### 样式
+ 默认匹配：/\.css$/。
+ 一个 .vue 文件可以包含多个 ```<style>``` 标签；
+ 可以使用scope和module进行封装；
+ 具有不同封装模式的多个 ```<style>``` 标签可以在同一个组件中混合使用；

#### 自定义块
+ vue-loader 将会使用块名来查找对应的 loader 进行处理，需要配置webpack.config

#### src导入

src 导入遵循和 webpack 模块请求相同的路径解析规则，这意味着:
+ 相对路径需要以 ./ 开始
+ 你可以从 NPM 依赖中导入资源
```
<template src="./template.html"></template>
<style src="./style.css"></style>
<script src="./script.js"></script>
```


### 如何编写 webpack 的 loader
https://webpack.js.org/contribute/writing-a-loader/


### 组件化 | 动画

- css 动画无法方便的暂停，将 transition 置为"none"时，不会停止动画，而是直接跳到动画的最后一帧
- JS 动画
  - Timeline
    - constructor
      - this.animations = []; // 存放加进来的动画
      - this.requestId = null; // requestAnimationFrame 产生的 id
      - this.state = "inited"; // timeline 的状态，包括"inited", "playing", "paused"
    - tick()
      - timeline 的每一帧里执行的操作，重复调用即可形成动画
    - start()
      - timeline 开始执行
    - restart()
      - 重置 timeline 的状态和动画的状态，重新开始 timeline
    - pause()
      - timeline 暂停执行
    - resume()
      - time 继续执行
    - add(animation, startTime)
      - 在 timeline 中加入动画
      - animation：Animation 类的实例
      - startTime：动画加入的时间
  - Animation
    - constructor(object, property, start, end, duration, delay, timingFunction, template)
      - timingFunction: 跟随时间变化的函数，返回 0-1 之间的一个数
      - template: 根据 value 计算的模板函数，最终值赋值给 object[property]
    - valueFromProgression(progression)
      - progression: timingFunction 的返回值