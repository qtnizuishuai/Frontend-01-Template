# 每周总结可以写在这里

> 这一周已经正式进入 JavaScript 的学习，winter 老师希望以不同的视角回顾"重学前端"中的知识总结，希望大家掌握的是追溯或者说探索知识的过程，让自己尽量记得更牢固，俗言之，授人以鱼不如授人以渔，奥利给！

### 1、 探索语法理论的源头

> 语法大概可以分为两类，非形式语言和形式语言

#### 1.1、非形式语言

    - 中文
    - 英文

#### 1.2、 形式语言

首先说说乔姆斯基范式是美国语言学家在 1955 年提出的博士论文中，发现了自己的一些语言学思想，后来不断归纳总结，1957 写出了代表作 [句法结构](https://en.wikipedia.org/wiki/Syntactic_Structures)，然后在 1958-1959 形成了后面的[乔姆斯基体系](https://en.wikipedia.org/wiki/Chomsky_hierarchy)

| 语法 | 语言能力                                 | 自动化                                                            |
| ---- | ---------------------------------------- | ----------------------------------------------------------------- |
| 0 型 | 递归可枚举或图灵可识别的语言(无限制文法) | 图灵机(Turing machine)                                            |
| 1 型 | 上下文相关文法                           | 线性不确定图灵机(Linear-bounded non-deterministic Turing machine) |
| 2 型 | 上下文无关文法                           | 非确定性下推自动机(Non-deterministic pushdown automaton)          |
| 3 型 | 正则文法(常规文法)                       | 有限状态自动机( Finite state automaton)                           |

##### 1.2.1、生产约束

- 0 型，无限制文法
  - ?::=?

```math
\alpha A \beta \Rightarrow \delta
```

- 1 型，上下文相关文法
  - ?<A>?::=?<B>?

```math
\alpha A \beta \rightarrow \alpha \gamma \beta
```

- 2 型、上下文无关文法
  <A>::=?

```math
A \rightarrow \alpha
```

- 3 型、正则文法 (能被解析为正则的统称)
  - <A>::=<A>? // 遵循左递归的原则

```math
	 A \rightarrow a
     |
      A \rightarrow a B
```

##### 1.2.2、语法定义：

- a =终端
- A，B = 非终端
- α，β,γ,δ = 终端和/或非终端的字符串
  - α，β,δ = 可以为空
  - γ=永不为空

##### 1.2.3 产生式(BNF)

- 用尖括号括起来的名称来表示语法结构名
- 语法结构分成基础结构和需要用其他语法结构定义的复合结构
  - 基础结构称为终结符
  - 复合结构称为非终结符
- 引号和中间的字符表示总结福
- 可以有括号
- - 表示重复多次
- |表示或
- - 表示至少一次

eg:定义一个四则远算的产生式

```
// 数字
<Number> = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
// 十进制数字
<DecimalNumber> = "0" | (("1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9")<Number>*)



// 乘除
<MultiplicativeExpression> = <DecimalNumber> |
<MultiplicativeExpression> "*" <DecimalNumber> |
<MultiplicativeExpression> "/" <DecimalNumber>

// 加减

<AdditiveExpression> = <MultiplicativeExpression> |
<AdditiveExpression> "+" <MultiplicativeExpression> |
<AdditiveExpression> "-" <MultiplicativeExpression>

// 逻辑运算符
<LogicalExpression> = <AdditiveExpression> |
<LogicalExpression> "||" <AdditiveExpression> |
<LogicalExpression> "&& " <AdditiveExpression>

// 括号

<PrimaryExpression> = <DecimalNumber> |
    "("<LogicalExpression>")"
```

{
get a {return 1} // 上下文相关: 左边不止一个非终结符(get,a),a 对应着 {return 1} 有明确的上下文
get:1 // 上下文无关: 左边只有一个非终结符 get
}

2 ** 1 ** 2 // 严格符合正则文法

注意：==\*\*==和其他符号不一样，它属于右结合的

```
2**3**2 = 512;
9/3/3 = 1
```

##### 1.2.4、 其他产生式

- EBNF
- ABNF
- Customized (一些自定义的)

###### 1.2.4.1、 EBNF(Extended Backus–Naur Form)

> 扩展巴科斯-瑙尔范式（EBNF, Extended Backus–Naur Form）是表达作为描述计算机编程语言和形式语言的正规方式的上下文无关文法的元语法(metalanguage)符号表示法。它是基本巴科斯范式(BNF)元语法符号表示法的一种扩展。 <br>
> 它最初由尼克劳斯·维尔特开发，最常用的 EBNF 变体由标准，特别是 ISO-14977 所定义。

###### 1.2.4.2、 ABNF

> 在计算机科学中，扩充巴科斯-瑙尔范式（ABNF）是一种基于巴科斯-瑙尔范式（BNF）的元语言，但它有自己的语法和派生规则。ABNF 的原动原则是描述一种作为双向通信协议的语言的形式系统。它是由第 68 号互联网标准（"STD 68"，大小写样式按照原文）定义的，也就是 RFC 5234，经常用于互联网工程任务组（IETF）通信协议的定义语言。[1][2]

RFC 5234 取代了 RFC 4234 (取代了 RFC 2234).[3]

#### 1.3 现代语言的特例

- C++中，”_“ 可能表示乘号或者指针，具体是哪个，取决于”_“前面的标识符是否被声明为类型
- VB 中， “<”可能是小于号，也可能是**XML**直接量的开始，取决于当前位置是否可以接受**XML**直接量
- Python 中，行首的 tab 符和空格会根据上一行的行首空白以一定规则被处理成虚拟总结符 indent 或者 dedent
- JavaScript 中，”/“ 可能是除号，也可能是正则表达式开头，处理方法类似 VB，字符串模板中也需要类似处理”}“，还有自动插入分号规则。

##### 1.4 图灵完备性

- 图灵完备性 -命令式 —————— 图灵机 - goto - if 和 while
  - 声明式 ———————— lambda
    - 递归

#### 1.5 动态与静态

- 动态：
  - 在用户的设备/在线服务器上
  - 产品实际运行时
  - Runtime
- 静态
  - 在程序员的设备上
  - 产品开发时
  - Compiletime

#### 1.6 类型系统

- 动态类型系统与静态类型系统
  动态类型：Javascript，lua，python，lisp ...
  静态类型：c/c++ C# Java

**注意：静态类型虽然编写的时候麻烦点，但是更加稳定，调试起来方便，相反动态类型的语言编写的时候舒服，但是调试火葬场。**

- 强类型与弱类型:(不容许类型的自动隐式转换的语言称为强类型)
  - String + Number
  - String == Boolean

> 强类型定义语言（Explicit type conversion，强制数据类型定义语言，类型安全的语言）：

**强类型语言是指需要进行变量/对象类型声明的语言，一般情况下需要编译执行。例如 C/C++/Java/C#**

> 弱类型定义语言（Implicit type conversion，类型不安全的语言）：

数据类型可以被忽略的语言。它与强类型定义语言相反, 一个变量可以赋不同数据类型的值。

```
true == 1 // true
// 会发生隐式转换，true变成1
```

- 复合类型

  - 结构体

  **在 C 语言中，结构体(struct)指的是一种数据结构，是 C 语言中聚合数据类型(aggregate data type)的一类。结构体可以被声明为变量、指针或数组等，用以实现较复杂的数据结构。结构体同时也是一些元素的集合，这些元素称为结构体的成员(member)，且这些成员可以为不同的类型，成员一般用名字访问，在 JavaScript 对象字面量 `{a:1,b:2}`可以看做是一个结构体**。

  - 函数签名
    - 1.0 参数及参数的类型
    - 2.0 一个的返回值及其类型
    - 3.0 可能会抛出或传回的异常
    - 4.0 该方法在面向对象程序中的可用性方面的信息（如 public、static 或 prototype）。

  > 或者类型签名，抑或方法签名）定义了函数或方法的输入与输出

  ==JavaScript 签名==：

  ** JavaScript 是一种松散类型或动态语言。这意味着您不必提前声明变量的类型。类型将在程序处理时自动确定。JavaScript 中的签名仍然可以为您提供有关该方法的一些信息：**

  ```
      MyObject.prototype.myFunction(value)
          1、该方法是安装在一个名为 MyObject 的 对象上。
          2、该方法安装在 MyObject 的原型上（因此它是一个实例方法），而不3、 是static method。
          4、 该方法名为 myFunction。
          5、 该方法接受一个参数，该参数被称为 value，且没有进一步定义。
  ```

```

==Java 的签名==
** 在 Java 中，签名用于识别虚拟机代码级别的方法和类。你必须在代码中声明变量的类型才能运行 Java 代码。 Java 是强类型的，将在编译时检查任何参数是否正确。**

```

      public static void main(String[] args)
          1、public 关键字是一个访问修饰符，表示该方法可以被任何对象调用。
          2、static 关键字表示该方法是一个类方法，而不是一个实例方法。
          3、void 关键字表示此方法没有返回值。
          4、方法的名称为 main。
          5、 该方法接受一个字符串数组类型的参数。它被命名为 args。

```

- 子类型

- 逆变/协变

> 是在计算机科学中，描述具有父/子型别关系的多个型别通过型别构造器、构造出的多个复杂型别之间是否有父/子型别关系的用语

- 凡是能用 Array<Parent>的地方，都能使用 Array<Child>
- 凡是能用 Function<Child>的地方，都能使用 Function<Parent>
```

#### 1.7 一般命令式编程语言

##### 1.7.1、Atom

- Identifier
- Literal

##### 1.7.2、Expression

- Atom
- Operator
- Punctuator

##### 1.7.3 Statement

- Expression
- Keyword
- Punctuator

##### 1.7.4 Structure

- Function (无副作用)
- Class
- Process (无返回值)
- Namespace
- ...

**现在 Function 不区分 Process 和 Function**

##### 1.7.5 Program

- Program
- Module(JavaScript)
- package
- Library

### 2、 Lexical Grammar

> 包含所有 Unicode 码点

**Unicode 是什么？**
[官网](https://home.unicode.org/)
[按块区分](https://www.fileformat.info/info/unicode/block/index.htm)
[按类区分](https://www.fileformat.info/info/unicode/category/index.htm)

> Unicode（中文：万国码、国际码、统一码、单一码）是计算机科学领域里的一项业界标准。它对世界上大部分的文字系统进行了整理、编码，使得电脑可以用更为简单的方式来呈现和处理文字

0-127:包括了所有的 Ascill 编码：如下图所示：

| ASCILL 值 | 字符 | ASCILL 值 | 字符    | ASCILL 值 | 字符 | ASCILL 值 | 字符 |
| --------- | ---- | --------- | ------- | --------- | ---- | --------- | ---- |
| 0         | NUT  | 32        | (space) | 64        | @    | 96        | 、   |
| 1         | SOH  | 33        | !       | 65        | A    | 97        | a    |
| 2         | STX  | 34        | ''      | 66        | B    | 98        | b    |
| 3         | ETX  | 35        | #       | 67        | C    | 99        | c    |
| 4         | EOT  | 36        | \$      | 68        | D    | 100       | d    |
| 5         | ENQ  | 37        | %       | 69        | E    | 101       | e    |
| 6         | ACK  | 38        | &       | 70        | F    | 102       | f    |
| 7         | BEL  | 39        | ,       | 71        | G    | 103       | g    |
| 8         | BS   | 40        | (       | 72        | H    | 104       | h    |
| 9         | HT   | 41        | )       | 73        | I    | 105       | i    |
| 10        | LF   | 42        | \*      | 74        | J    | 106       | j    |
| 11        | VT   | 43        | +       | 75        | K    | 107       | k    |
| 12        | FF   | 44        | ,       | 76        | L    | 108       | l    |
| 13        | CR   | 45        | -       | 77        | M    | 109       | m    |
| 14        | SO   | 46        | .       | 78        | N    | 110       | n    |
| 15        | SI   | 47        | /       | 79        | O    | 111       | o    |
| 16        | DLE  | 48        | 0       | 80        | P    | 112       | p    |
| 17        | DCI  | 49        | 1       | 81        | Q    | 113       | q    |
| 18        | DC2  | 50        | 2       | 82        | R    | 114       | r    |
| 19        | DC3  | 51        | 3       | 83        | S    | 115       | s    |
| 20        | DC4  | 52        | 4       | 84        | T    | 116       | t    |
| 21        | NAk  | 53        | 5       | 85        | U    | 117       | u    |
| 22        | SYN  | 54        | 6       | 86        | V    | 118       | v    |
| 23        | TB   | 55        | 7       | 87        | W    | 119       | w    |
| 24        | CAN  | 56        | 8       | 88        | X    | 120       | x    |
| 25        | EM   | 57        | 9       | 89        | Y    | 121       | y    |
| 26        | SUB  | 58        | ：      | 90        | Z    | 122       | z    |
| 27        | ESC  | 59        | ；      | 91        | [    | 123       | {    |
| 28        | FS   | 60        | <       | 92        | /    | 124       |      |
| 29        | GS   | 61        | =       | 93        | ]    | 125       | }    |
| 30        | RS   | 62        | >       | 94        | ^    | 126       | ~    |
| 31        | US   | 63        | ?       | 95        | -    | 127       | DEL  |

```
InputElementDiv::
    WhiteSpace
    LineTerminator
    Comment
    CommonToken
    DivPunctuator
    RightBracePunctuator
```

```
WhiteSpace::
    <TAB>
    <VT>
    <FF>
    <SP>
    <NBSP>
    <ZWNBSP>
     <USP> (所有unicode支持的空格)
```

#### 2.1、 WhiteSpace

- \<TAB\<
  **横向制表符，一般用于表格缩进**
- \<VT\>
  **纵向制表符**
- \<FF\>
  **一種格式控制字元，用以使列印機（或顯示器）由現行位置跳至下一頁的預定的第一行第一格的位置**
- \<SP\>
  **普通空格,键盘上的\<space\>键**
- \<NBSP\> (NO-BREAK SPACE)
  **一般在页面排版中用来连接两个单词，**
- \<ZWNBSP\> (ZERO WIDTH NO-BREAK SPACE)
- <USP> (所有 unicode 支持的空格)
  **历史遗留微软弄的 0 宽空格**

#### 2.2、 LineTerminator(换行符)

- <LF> (LINE FEED) U+000A
  "\n" windows 空格是"\r\n"

- <CR> (CARRIAGE RETURN) U+000D
- <LS> (LINE SEPARATOR) U+2028 ❌
- <PS> (PARAGRAPH SEPARATOR) U+2029 ❌

**下面两个不在 BMP(0-65535)中，不推荐**

#### 2.3、 Comment

- MultiLineComment (/\* \*/ 多行注释)
- SingleLineComment (// 单行注释)

#### 2.4 Token

```
CommonToken
    IdentifierName
    Punctuator
    NumericLiteral
    StringLiteral
    Template
```

便于理解分成

```
Token:
     Punctuator
     IdentifierName
        KeyWords
        Identifier
        Future reserved Keywords: enum
     Literal
```

##### 2.4.1、 IdentifierName

IdentifierName::
IdentifierStart
IdentifierName IdentifierPart

IdentifierStart::

    UnicodeIDStart
    $
    _
    \ UnicodeEscapeSequence

IdentifierPart::
UnicodeIDContinue
\$
\ UnicodeEscapeSequence
<ZWNJ>
<ZWJ>

UnicodeIDStart ::

具有 Unicode 属性“ID_Start”的任何 Unicode 代码点

UnicodeIDContinue ::

具有 Unicode 属性“ID_Continue”的任何 Unicode 代码点

### 3.0 runtime

> JavaScript 中的类型：

    Types

- Number
- String
- Undefined
- Null
- Boolean
- Symbol
- Object
- BigInt(暂时不讨论)

#### 3.1、Number

- IEEE 754 Double Float

  - Sigh(1) 符号位
  - Exponent(11) 指数位
  - Fraction(52) 精度位

![image](https://pic3.zhimg.com/80/v2-0faecd08386e94b0259056de48dcde9e_1440w.jpg)

最高位是符号位(sign)，0 表示正数，1 表示负数。接下来的 11 位储存的是的指数(exponent)，最后是 52 位储存的是小数(fraction)。浮点数的值可以用下面这个式子算出，类似于十进制的科学计数法。

[公式]

需要注意的是 exponent 和 fraction 并不是直接储存的。

```
0.1 + 0.2 == 0.3 // false
```

为什么呢？，其实就是因为 javascript 里面 float 字符的计算，是 IEE754 的双精度规则

1. 第一步会发生进制转换

```
0.1 -> 0.0001100110011001...(无限循环)
0.2 -> 0.0011001100110011...(无限循环)
```

但是由于 IEEE 754 尾数位数限制，需要将后面多余的位截掉（本文借助这个[网站](https://babbage.cs.qc.cuny.edu/IEEE-754.old/Decimal.html)直观展示浮点数在内存中的二进制表示）

0.1
![image](https://user-gold-cdn.xitu.io/2018/9/16/165e176158caf0ba?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

0.2
![image](https://user-gold-cdn.xitu.io/2018/9/16/165e176237c96972?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

标准中规定尾数 f 的固定长度是 52 位，再加上省略的一位，这 53 位是 JS 精度范围。它最大可以表示 2^53(9007199254740992), 长度是 16，所以可以使用 toPrecision(16) 来做精度运算，超过的精度会自动做凑整处理

```
0.10000000000000000555.toPrecision(16)
// 返回 0.1000000000000000，去掉末尾的零后正好为 0.1

// 但来一个更高的精度：
0.1.toPrecision(21) = 0.100000000000000005551
```

1. 对阶运算

> 由于指数位数不相同，运算时需要对阶运算 这部分也可能产生精度损失
> 按照上面两步运算（包括两步的精度损失），最后的结果是

```
0.0100110011001100110011001100110011001100110011001100
```

结果转换成十进制之后就是 0.30000000000000004，所以：0.1 + 0.2 != 0.3

**只要进制转换，对阶运算产生了精度损失，计算结果就会出现偏差**

#### 3.1.1 Number-Grammar

- DecimalLiteral (0, 0., .2, 1e3)
- BinaryIntegerLiteral (0b111)
- OctalIntegerLiteral (0o10)
- HexIntegerLiteral (0xFF)

#### 3.1.2 Number-Practice

    - Safe Integer
    - Float Compare

```
Number.MAX_SAFE_INTEGER.toString(16) // "1fffffffffffff"
Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON
```

#### 3.2、String

- ASCII
- Unicode
- UCS U+0000 - U+FFFF
- GB
  - GB2312
  - GBK(GB13000)
  - GB18030
- ISO-8859
- BIG5

##### 3.2.1、String-Encoding

- UTF
  - UTF-8
  - UTF-16
  - UTF-32
