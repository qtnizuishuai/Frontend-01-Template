### 1.0、 Realm

#### 1.1、 什么是 Realm?

JavaScript 引入了 realm(领域的概念)，在对其进行评估之前，必须将所有 ECMAScript 代码与一个领域相关联。从概念上讲，领域由一组内部对象，一个 ECMAScript 全局环境，在该全局环境范围内加载的所有 ECMAScript 代码以及其他关联的状态和资源组成。

语言参考使用抽象术语，因为 JavaScript 环境可能有很大差异。在浏览器中，**window**（**iframe**，使用 window.open()或打开的窗口或只是普通的浏览器选项卡）是一个领域。**Web Worker**是与**Window**不同的"领域"。**Service Worker**也是如此。

### 2.0、 JavaScript 的执行过程

> JavaScript 是动态/解释性语言，js 引擎开始扫描代码，然后经历以下几个过程:

- 分词(词法分析)
- 解析(语法分析)
- 执行代码

#### 2.1、 词法分析

这个过程将字符串分解成词法单元，如 var a = 2; 会被分解成词法单元 var、 a、 = 、2、;。空格一般没意义会被忽略

#### 2.2、 语法分析

这个过程会将词法单元转换成 抽象语法树（Abstract Syntax Tree,AST）。 如 var a = 2; 对应的 抽象语法树 如下, 可通过 [在线可视化 AST 网址(https://astexplorer.net/)在线分析

```
{
  "type": "Program",
  "start": 0,
  "end": 10,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 10,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 9,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 5,
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "start": 8,
            "end": 9,
            "value": 2,
            "raw": "2"
          }
        }
      ],
      "kind": "var"
    }
  ],
  "sourceType": "module"
}
```

#### 2.3、 代码执行

> 将 AST 转换成可执行的代码，存放于内存中，并分配内存和转化为一些机器指令

++**代码执行的时候，其实有一个创建执行上下文，然后最后执行代码的过程。**++

### 3.0、 那什么是执行上下文呢？

**简而言之，执行上下文是评估和执行 JavaScript 代码的环境的抽象概念。每当 Javascript 代码在运行的时候，它都是在执行上下文中运行。**

##### 3.1、执行上下文的类型(Execution Context)

- 全局执行上下文 — 这是默认或者说基础的上下文，任何不在函数内部的代码都在全局上下文中。它会执行两件事：创建一个全局的 window 对象（浏览器的情况下），并且设置 this 的值等于这个全局对象。一个程序中只会有一个全局执行上下文。
- 函数执行上下文 — 每当一个函数被调用时, 都会为该函数创建一个新的上下文。每个函数都有它自己的执行上下文，不过是在函数被调用时创建的。函数上下文可以有任意多个。每当一个新的执行上下文被创建，它会按定义的顺序（将在后文讨论）执行一系列步骤。
- Eval 函数执行上下文 — 执行在 eval 函数内部的代码也会有它属于自己的执行上下文，但由于 JavaScript 开发者并不经常使用 eval，所以在这里我不会讨论它。

#### 3.2、 执行上下文栈(Execution Context Stack)

执行栈，在其他编程语言中也被叫做调用栈，具有 LIFO（后进先出）结构，用于存储在代码执行期间创建的所有执行上下文。
当 JavaScript 引擎首次读取你的脚本时，它会创建一个全局执行上下文并将其推入当前的执行栈。每当发生一个函数调用，引擎都会为该函数创建一个新的执行上下文并将其推到当前执行栈的顶端。
引擎会运行执行上下文在执行栈顶端的函数，当此函数运行完成后，其对应的执行上下文将会从执行栈中弹出，上下文控制权将移到当前执行栈的下一个执行上下文。

```
let a = 'Hello World!';

function first() {
  console.log('Inside first function');
  second();
  console.log('Again inside first function');
}

function second() {
  console.log('Inside second function');
}

first();
console.log('Inside Global Execution Context');
```

![image](https://user-gold-cdn.xitu.io/2018/11/5/166e258e1d0281a6?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

当上述代码在浏览器中加载时，JavaScript 引擎会创建一个全局执行上下文并且将它推入当前的执行栈。当调用 **first**() 函数时，JavaScript 引擎为该函数创建了一个新的执行上下文并将其推到当前执行栈的顶端。
当在 **first**() 函数中调用 second() 函数时，Javascript 引擎为该函数创建了一个新的执行上下文并将其推到当前执行栈的顶端。当 **second**() 函数执行完成后，它的执行上下文从当前执行栈中弹出，上下文控制权将移到当前执行栈的下一个执行上下文，即 **first**() 函数的执行上下文。
当 **first**() 函数执行完成后，它的执行上下文从当前执行栈中弹出，上下文控制权将移到全局执行上下文。一旦所有代码执行完毕，Javascript 引擎把全局执行上下文从执行栈中移除。

#### 3.3 创建执行上下文

执行上下文创建分为两个阶段

- 创建阶段
- 执行阶段

##### 3.3.1 创建阶段

执行上下文处于创建阶段，总共发送了三件事情

- 确定 this 的值，也被称为 This Binding。
- LexicalEnvironment（词法环境） 组件被创建。
- VariableEnvironment（变量环境） 组件被创建。

```
ExecutionContext = {
  ThisBinding = <this value>,     // 确定this
  LexicalEnvironment = { ... },   // 词法环境
  VariableEnvironment = { ... },  // 变量环境
}
```

==绑定 this==

- 在全局执行上下文中，**this** 的值指向全局对象。(在浏览器中，this 引用 **Window** 对象)。
- 在函数执行上下文中，**this** 的值取决于该函数是如何被调用的。如果它被一个引用对象调用，那么 **this** 会被设置成那个对象，否则 **this** 的值被设置为全局对象或者 **undefined**（在严格模式下）。例如：

```
let foo = {
  baz: function() {
  console.log(this);
  }
}

foo.baz();   // 'this' 引用 'foo', 因为 'baz' 被
             // 对象 'foo' 调用

let bar = foo.baz;

bar();       // 'this' 指向全局 window 对象，因为
             // 没有指定引用对象

```

==词法环境（Lexical Environment）==

[官方的 Es6 文档](http://ecma-international.org/ecma-262/6.0/)把词法环境定义为:

> 词法环境是一种规范类型，基于 ECMAScript 代码的词法嵌套结构来定义标识符和具体变量和函数的关联。一个词法环境由环境记录器和一个可能的引用外部词法环境的空值组成。

简单来说词法环境是一种持有标识符—变量映射的结构。（这里的标识符指的是变量/函数的名字，而变量是对实际对象[包含函数类型对象]或原始数据的引用）。

**词法环境内部有两个组成部分：**

- 1、环境记录：存储变量和函数声明的实际位置

- 2、对外部环境的引用：可以访问其外部词法环境

**词法环境有两种类型：**

- 全局环境（在全局执行上下文中）是没有外部环境引用的词法环境(唯一的词法环境，它在任何 ECMA 脚本的代码执行前创建)。全局环境的外部环境引用是 null。它拥有内建的 Object/Array/等、在环境记录器内的原型函数（关联全局对象，比如 window 对象）还有任何用户定义的全局变量，并且 this 的值指向全局对象。
- 在函数环境中，函数内部用户定义的变量存储在环境记录器中。并且引用的外部环境可能是全局环境，或者任何包含此内部函数的外部函数

**环境记录器也有两种类型（如上！）：**

- 声明式环境记录器存储变量、函数声明和参数。
- 对象环境记录器用来定义出现在全局上下文中的变量和函数的关系

简而言之

- 在全局环境中，环境记录器是对象环境记录器。
- 在函数环境中，环境记录器是声明式环境记录器。

**注意 — 对于函数环境，声明式环境记录器还包含了一个传递给函数的 arguments 对象（此对象存储索引和参数的映射）和传递给函数的参数的 length。**

抽象地讲，词法环境在伪代码中看起来像这样：

```
GlobalExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
    }
    outer: <null>
  }
}

FunctionExectionContext = {
  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
    }
    outer: <Global or outer function environment reference>
  }
}
```

==**变量环境:**==

它同样是一个词法环境，其环境记录器持有变量声明语句在执行上下文中创建的绑定关系。
如上所述，变量环境也是一个词法环境，所以它有着上面定义的词法环境的所有属性。
在 ES6 中，词法环境和变量环境的一个不同就是前者被用来存储函数声明和变量（let 和 const）绑定，而后者只用来存储 var 变量绑定。

看几个例子来理解一下上面的概念：

```
let a = 20;
const b = 30;
var c;

function multiply(e, f) {
 var g = 20;
 return e * f * g;
}

c = multiply(20, 30);
```

执行上下文看起来像这样：

```
GlobalExectionContext = {

  ThisBinding: <Global Object>,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      a: < uninitialized >,
      b: < uninitialized >,
      multiply: < func >
    }
    outer: <null>
  },

  VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Object",
      // 在这里绑定标识符
      c: undefined,
    }
    outer: <null>
  }
}

FunctionExectionContext = {
  ThisBinding: <Global Object>,

  LexicalEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      Arguments: {0: 20, 1: 30, length: 2},
    },
    outer: <GlobalLexicalEnvironment>
  },

VariableEnvironment: {
    EnvironmentRecord: {
      Type: "Declarative",
      // 在这里绑定标识符
      g: undefined
    },
    outer: <GlobalLexicalEnvironment>
  }
}

```

— 只有遇到调用函数 **multiply** 时，函数执行上下文才会被创建。
可能你已经注意到 **let** 和 **const** 定义的变量并没有关联任何值，但 **var** 定义的变量被设成了 **undefined**。
这是因为在创建阶段时，引擎检查代码找出变量和函数声明，虽然函数声明完全存储在环境中，但是变量最初设置为 **undefined**（**var** 情况下），或者未初始化（**let** 和 **const** 情况下）。
这就是为什么你可以在声明之前访问 **var** 定义的变量（虽然是 **undefined**），但是在声明之前访问 **let** 和 **const** 的变量会得到一个引用错误。
这就是我们说的变量声明提升。

**执行阶段**

最后就是完成所有对这些变量的分配，然后执行代码，包括变量赋值，函数调用等

注：let a;会被赋值为 undefined。
