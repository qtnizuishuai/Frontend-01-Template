# 每周总结可以写在这里

## Reactive

### proxy

Proxy对象非常强大，对比往常的Object.definePropety只能监听对象属性而言，他可以监听整个对象
(vue3.0 就是通过Proxy完全改写了以前的Reactive部分)


> Proxy 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。

- handler
包含捕捉器（trap）的占位符对象，可译为处理器对象。
- traps
提供属性访问的方法。这类似于操作系统中捕获器的概念。
- target
被 Proxy 代理虚拟化的对象。它常被作为代理的存储后端。根据目标验证关于对象不可扩展性或不可配置属性的不变量（保持不变的语义）。

==method==

Proxy.revocable()
创建一个可撤销的Proxy对象。

```
// 简单示例
const handler = {
    get: function(obj, prop) {
        return prop in obj ? obj[prop] : 37;
    }
};

const p = new Proxy({}, handler);
p.a = 1;
p.b = undefined;

console.log(p.a, p.b);      // 1, undefined
console.log('c' in p, p.c); // false, 37

```



## 组件化基础

### 对象与组件
- 对象
  - Properties
  - Methods
  - Inherit
- 组件
  - Properties
  - Methods
  - Inherit
  - Attribute
  - Config & State
  - Event
  - Lifecycle
  - Children

### Component
- End User Input
  + State
  + Children
- Component User's Markup Code
  + atrribute
- Component User's JS Code
  + Method
  + Property
  + Event

### Attribute
- Attribute 强调描述性
- Property 强调从属关系

### 如何设计组件状态
- property
  + JS set
  + JS Change
- attribute
  + JS set
  + JS Change
- state
  + User Input Change
- config
  + Js set

### Lifecycle
 - created
   + mount
      - mount
      - mount
      - unmount
   + js change/set
      - render/update
   + user input
      - render/update
 - destroyed

 ### Children
- Content型
- Template型

### learn more
- [proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [vue-next reactive](https://github.com/vuejs/vue-next/blob/master/packages/reactivity/__tests__/reactive.spec.ts)
- [锦江](https://dev.to/jinjiang/understanding-reactivity-in-vue-3-0-1jni)
- [学习笔记](https://www.yuque.com/wendraw/fe/toyed-browser-html-parser)