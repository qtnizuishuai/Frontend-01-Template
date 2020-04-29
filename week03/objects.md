### JavaScript中有几种对象，大致可以分为以下几类




#### 1.1、ordinary object(普通对象)

> 具有必须由所有对象支持的基本内部方法的默认行为的对象
- 内部具有[[prototype]]隐式原型对象，用于实现继承
- 内部具有[[Extensible]]属性用于扩展属性
  
- [[GetPrototypeOf]] ( ) 获取对应的原型对象

- [[SetPrototypeOf]] ( V ) 设置原型对象
- [[IsExtensible]] ( ) 返回对象的[[Extensible]] 值
- [[PreventExtensions]] ( ) 设置对象的[[Extensible]]为false
- [[GetOwnProperty]] ( P ) 返回一个对象指定属性的Desciptors(描述符)
- [[DefineOwnProperty]] 对应对应的原有属性或添加新属性，并返回该对象
- [[HasProperty]] ( P ) 判断一个对象是否存在某个属性
- [[Get]] ( P, Receiver ) 返回属性值，未定义getter返回undefined
- [[Set]] ( P, V, Receiver ) 设置对象属性
- [[Delete]] ( P ) 删除属性
- [[OwnPropertyKeys]] ( ) 不存在： 返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组。
  


### 1.2、  ECMAScript Function Objects
> 
函数对象具有和普通对象相同的插槽，还有如下额外的其他插槽：

[[Environment]] <Lexical Environment> 函数被定义的词法环境，在评估函数代码时被看作外部环境。
[[FormalParameters]] <Parse Node>
源文本的根解析节点，用于定义函数的形式参数列表
[[FunctionKind]] <String> 函数类型："normal", "classConstructor", "generator", "async", or "async generator".
[[ECMAScriptCode]] <Parse Node> 定义函数主题的根节点
[[ConstructorKind]] <String> 'base'或者’derived‘
[[Realm]] <Realm Record> 访问内部函数对象的作用域
[[ScriptOrModule]] <Script Record or Module Record> 创建函数的脚本或模块
[[ThisMode]] <(lexical, strict, global)> this上下文
[[Strict]] <Boolean> 严格模式 true|false
[[HomeObject]] <Object> 对这个属性值使用 GetPrototypeOf 来获取 super
[[SourceText]] <String> 定义函数的文本

内部方法：

-[[Call]] 普通调用使用的内部方法
- [[Construct]] 作为构造函数所使用的内部方法



### 1.3 built-in object(内置对象)

#### 1.3.1、 Bound Function Exotic Objects

> Function.prototype.bind 会产生一个 bound function 对象。 一个 bound function 没有普通函数的内部槽，但它有 [[Call]] 和 [[Constructor]] 方法。调用它们会间接调用被包裹的函数。

- [[BoundTargetFunction]] 包裹的函数对象
 - [[BoundThis]] 传递的值作为包裹函数的上下文
- [[BoundArguments]]包裹函数对象的传入的第一个参数列表


#### 1.3.2、Array Exotic Objects
- length的范围(0-2^32 - 1)
- Array对象，属性的名称是数组索引下标，每增加属性的时候，length会比该索引的下标大1
-  [[DefineOwnProperty]] ( P, Desc ) 更改数组'length'属性值，会修改整个数组，导致数组元素增加或减少。

### 1.3.3、 String Exotic Objects

- 内部插槽  [[StringData]]
-length属性：
    - 返回字符的个数
    - 不可写且不可配置
- 支持下标运算，用0或正整数可以取到对应位置上的字符

### 1.3.4、 Arguments Exotic Objects

> 函数执行上下文被创建的时候，会生成一个arguments对象指向其声明的形参参数列表

- 具有普通对象的插槽
- 还有一个[[ParameterMap]插槽，该值始终是未定义的
- arguments对象传入的是引用对象的指针，改变变量，外部对象也会改变。

### 1.3.5、 Integer-Indexed Exotic Objects
除了普通对象共享插槽之外额外的插槽如下:

- [[ViewedArrayBuffer]]
- [[ArrayLength]]
- [[ByteOffset]]
- [[TypedArrayName]]

### 1.3.6、Module Namespace Exotic Objects
> 模块对象，一般用于es模块导入导出，导出的绑定名称和对象的自身属性一一对应，每个属性键和属性值存在key-value的关系，该模块名称都存在{[[[Writable]]：true，[[Enumerable]]：true，[[Configurable]]：false}特性，而且不可扩展。
- [[Module]]
- [[Exports]]
- [[Prototype]]

### 1.3.7、 Immutable Prototype Exotic Objects
> 具有 [[Prototype]]的不可突变对象，一旦初始化就不会更改，只要不触发一下情况都和普通对象一致。

- 只要在指定该对象的[[SetPrototypeOf]]方法时发生

### 1.4 Proxy Object(代理对象)

具有内部插槽：

- [[ProxyHandler]] 代理的处理程序对象 Object | null
- [[ProxyTarget]] 代理的目标对象 Object | null