# 每周总结可以写在这里

> 正式进入JavaScript Expressions部分

### 1.0 Left-Hand-Side

#### 1.1 MemberExpression (成员表达式)

- Member
    - a.b
    - a[b]
    - foo\`string\`
    - super.b
    - super['b']
    - new.target
    - new Foo()
    - Call
      - foo()
      - super()
      - foo()['b']
      - foo().b

举例说明

1. **a.b**

```
let obj = {a:1};
obj.a; // 1
```

2. **a[b]** (依靠了JavaScript动态对象的特性)

```
let a = {c : 2};
let b = 'c';
a[b]; // 2
```
3. **foo\`string\`**

```
let str = 'hello, world!'
`bar ${str}`; // bar hello, world!

function cls3(){console.log(arguments)}
cls3`JavaScript${str}node`
// [['JavaScript','noe'],'hello, world!']
```
4. **super.b**

```
class Parent {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.height = "175";
  }
  static say() {
    return "hello,world";
  }
  eat() {
    console.log(`name is: ${this.name}`);
  }
}

class Son extends Parent {
  constructor(name, age) {
    super(name, age);
  }
  static say() {
    console.log(super.say() + "....");
  }
  eat() {
    super.eat();
    console.log(2);
  }
}

Son.say();
new Son("bar").eat();
```

5. **super[b]**：同上，只是获取方法的方式变成通过变量去调用


6. ==new.target==为了区分函数是普通调用还是被“new”关键字调用
```
function F(){
    console.log(new.target)
}

F(); // undefined
new F(); // ƒ F(){console.log(new.target)}

```
7. ==new foo== 当foo当做构造函数，生成对应实例

```
function Cls1(){

}

function Cls2(){
    return Cls1;
}

new new Cls2(); // Cls1{}
new Cls2()(); // undefined
// 有()执行的优先级更高
```

==Reference==

- Object
- Key

具有写入能力的只有**`assign`和'delete`**

8. call关键字强行绑定this，并调用函数

**只有函数调用的表达式比new优先级低。**

**Left-Hand-Side & Right-Hand-Side**

Example:
- a.b = c
- a+b = c

注：`Left-Hand-Side`满足语法上是**‘Left-Hand-Side’**,`run-time`的值是**reference**。


### 2.0、 **Right-Hand-Side**

- Update
  - a++
  - a--
  - --a
  - ++a

++a++ // Invalid left-hand side expression in prefix operation



 LineTerminator会破坏原有的表达式结构

```
var a = 1, b = 1, c = 1;
a
++
b
++
c
// 2
// 注由于a与++之间产生了换行(LineTerminator)破坏了左结合的运算规则，所以b,c发生了++。
```



- Unary
  - delete a.b
  - void foo()
  - typeof a
  - +a
  - -a
  - ~a
  - !a
  - await a



- Expressions
    - Exponental
        - **
    - Multiplicative
        - */%
    - Additive
        - + -
    - Shift
      - << >> >>>
    - Relationship
      - <> <= >= instanceof in
    - Equality
      - ==
      - !=
      - ===
      - !==
    - Bitwise
      - & ^ |
    - Logical
      - ||
      - &&
    - Conditional
      - ?:


==**==

Example:

```
3 ** 2 ** 3
3 ** (2 ** 3)
```
**“**”是唯一一个右结合的**


**Logical**运算符存在短路逻辑

推荐用三目运算符代替 if/else，三目运算符同样存在短路，一般用来作为react/vue的模板语法。

### 3.0、Type Convertion

| __        | Number               | String              | Boolean | Undefined | Null | Object | Symbol |
| --------- | -------------------- | ------------------- | ------- | --------- | ---- | ------ | ------ |
| Number    | -                    |                     | 0 false | x         | x    | Boxing | x      |
| String    |                      | -                   | ""false | x         | x    | Boxing | x      |
| Boolean   | true 1 </br> false 0 | 'true'<br/>'false'  | -       | x         | x    | Boxing | x      |
| Undefined | NaN                  | 'Undefined'         | false   | -         | x    | x      | x      |
| Null      | 0                    | 'Null'              | false   | -         | x    | x      | x      |
| Object    | valueOf              | valueOf<br>toString | true    | x         | x    | -      | x      |
| Symbol    | x                    | x                   | x       | x         | x    | Boxing | -      |



### 4.0、Boxing & unBoxing

#### 4.1、Boxing
```
'123'.length // 3
'123'.slice(1) // 23


new Number(2) == Number(2) // true
new Number(2) === Number(2) // false
new Number(2).valueOf() === Number(2) // true
let num = 2;
num.toFixed() // '2'

Object(true) // Boolean {true}
Object(false) // Boolean {false}

Symbol('f') // 
new Symbol // Symbol is not a constructor at new Symbol 

Object(Symbol()) // Symbol {Symbol()}

Object(Symbol('1')).constructor // ƒ Symbol() { [native code] }
Reflect.getPrototypeOf(Object(Symbol('1'))) === Symbol.prototype // true
Object(Symbol('1')) instanceof Symbol // true
```

- **String,Number,Boolean,Symbol**其中一种类(构造器)对应的基本类型转换成对应实例对象的过程叫做装箱操作(Boxing)
- String(),Number(),Boolean()直接调用叫做强制转换成基本类型
- Symbol没有constructor属性不能被new，但是包含prototype属性，可以通过Symbol()创建实例，以及使用Object(Symbol())装箱。

#### 4.2、unBoxing
// 当一个对象转换成基本类型的时候会发生拆箱操作(unBoxing)

```
1 + { toString(){return '3'}} // '13'
1 + { valueOf(){return 3}} // 4
1 + {valueOf(){return 3}, toString(){return '3'}} // 4
1 + {[Symbol.toPrimitive](){return 4},valueOf(){return 3}, toString(){return '3'}} // 5
```

在输出一个值的时候，js引擎会按照以下的规则去检测

1. 输出的值是一个JavaScript基本类型的值，则会原封不动的输出该值
2. 如果该值是一个对象会按照下列步骤执行


```
 ToPrimitive(input [, PreferredType])

1.如果没有传入PreferredType参数，则让hint的值为'default'
2.否则，如果PreferredType值为String，则让hint的值为'string'
3.否则，如果PreferredType值为Number，则让hint的值为'number'
4.如果input对象有@@toPrimitive方法，则让exoticToPrim的值为这个方法，否则让exoticToPrim的值为undefined
5.如果exoticToPrim的值不为undefined，则
	a.让result的值为调用exoticToPrim后得到的值
	b.如果result是原值，则返回
	c.抛出TypeError错误
6.否则，如果hint的值为'default'，则把hint的值重新赋为'number'
7.返回 OrdinaryToPrimitive(input,hint)

OrdinaryToPrimitive(input,hint)

1.如果hint的值为'string',则
	a.调用input对象的toString()方法，如果值是原值则返回
	b.否则，调用input对象的valueOf()方法，如果值是原值则返回
	c.否则，抛出TypeError错误
2.如果hint的值为'number',则
	a.调用input对象的valueOf()方法，如果值是原值则返回
	b.否则，调用input对象的toString()方法，如果值是原值则返回
	c.否则，抛出TypeError错误
```
- 自定义[Symbol.toPrimitive]接口的前提下，先按照接口的输出
- 在没有改写或自定义@@toPrimitive方法的条件下，如果是Date求原值，则PreferredType是String，其他均为Number。
- PreferredType是String，则先调用toString()，结果不是原始值的话再调用valueOf()，还不是原始值的话则抛出错误；
- PreferredType是Number，则先调用valueOf()再调用toString(),还不是原始值的话则抛出错误；

