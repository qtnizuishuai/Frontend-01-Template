# 每周总结可以写在这里

### 重学JavaScript结构化

> OC： Objective-C 是一种通用、高级、面向对象的编程语言。它扩展了标准的 ANSI C 编程语言，将 Smalltalk 式的消息传递机制加入到 ANSI C 中。当前主要支持的编译器有 GCC 和 Clang（采用 LLVM 作为后端）。


## 1. 基本概念

## Javascript的运行机制

（1） 所有同步任务都做主线程上执行，形成一个执行栈 (execution content stack) .(其实一个script可以看作是一个JS主线程形成的宏任务)
 (2)  主线程之外，还存在"任务队列"（task queue).只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。
 (3) 一旦 “执行栈”中的所有任务执行完毕，系统就会读取“任务队列”，看看里面有哪些事件，哪些对应的异步任务，如果有 ，就结 束等待状态，进入执行栈，开始执行。
 
 (4) 主线程不断重复第三步
 
 概况就是: 调用栈的所有任务执行完毕，栈内被清空了，就代表主线程空闲了，这个时候就会去任务队列按照顺序读取一个任务放入到栈中执行。每次栈内被清空了，都会去检查任务队列是否存在任务，有就执行，一直循环 读取-执行的操作。
 
 
 > 一个事件循环有一个或多个任务队列
 
 > JavaScript有两种异步任务
 
 1. 宏任务: Script,setTimeout,setInterval,setImmediate,I/O,UI rendering，requestAnimationFrame (是第三方宿主提供的)
 2. 微任务: process.nextTrick, Promises,Object.observe,MutationObserver (JS自带的标准)
 
> 宏任务

| #                         | 浏览器 | Node |
| ------------------------- | ------ | ---- |
| ==Script==                | ✅      | ❌    |
| ==I/O==                   | ✅      | ✅    |
| ==setTimeout==            | ✅      | ✅    |
| ==setInterval==           | ✅      | ✅    |
| ==setImmediate==          | ❌      | ✅    |
| ==UI rendering==          | ✅      | ❌    |
| ==requestAnimationFrame== | ✅      | ❌    |


> 微任务

| #                    | 浏览器 | Node |
| -------------------- | ------ | ---- |
| ==process.nextTick== | ❌      | ✅    |
| ==MutationObserver== | ✅      | ❌    |
| ==setTimeout==       | ✅      | ✅    |


## 2. 什么是事件循环 (even-loop)?

主线程从“任务队列”中读取执行事件，这个事件是循环不断的，这个机制被称为事件循环。此机制具体如下:主线程会不断地从任务队列中按照顺序取任务执行，可以看作每一个任务都是宏任务，而宏任务包含着一个待执行的微任务队列，每执行完一个任务都会检查microtask队列是否为空(执行完一个任务的具体标志是函数执行栈为空)，如果不空则会一次性执行所有microtask.然后再进入下一个循环去任务队列中取下一个任务执行。


> 详细说明

1. 选择当前执行的宏任务队列，选择一个最先进入任务队列的宏任务，如果没有宏任务可以选择，则会跳转至microtask的执行步骤
2. 将事件循环的当前运行宏任务设置为已选择的宏任务
3. 运行宏任务
4. 将事件循环的当前运行任务设置为null
5. 将运行完的宏任务从宏任务队列中移除
6. microtasks步骤: 进入microtask检查点
7. 更新界面渲染
8. 返回第一步


执行进入microtask检查的具体步骤如下:
1. 设置进入microTask检查点的标志为true
2. 当事件循环的微任务队列不为空时，选择一个最先进入microtask队列的microtask;设置事件循环的当前任务为已选择的microtask;运行microtask;设置事件循环的当前运行任务为null；将运行结束的microtask从mictotask队列移除。
3. 对于相应事件循环的每个环境设置对象 (environment setting object), 通知它们哪些promise为rejected.
4. 清理indexedDB的事务
5. 设置进入microtask检查点的标志为false


需要注意的是:当前执行栈完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一个事件循环中，微任务永远在宏任务之前在前执行。

图示:

![image](http://user-gold-cdn.xitu.io/2019/3/22/169a4038c4e156f0)


## 3. Event-loop是如何工作的

eg1.

```
setTimeout(()=>{
    console.log("setTimeout1");
    Promise.resolve().then(data => {
        console.log(222);
    });
});
setTimeout(()=>{
    console.log("setTimeout2");
});
Promise.resolve().then(data=>{
    console.log(111);
});
```

运行结果如下:

```
111
setTimeout1
222
setTimeout2
```

tell me why?


我们来详细说明一下，JS引擎是如何执行这段代码的:

1. 主线程上没有需要执行的代码
2. 接着遇到setTimeout 0,他的作用是在oms后将回调函数放到宏任务队列中(这个任务在下次的事件循环中执行)
3. 接着又遇到setTimeout 0，作用和上面一样
4. 然后遇到Promise resolve then,这是一个微任务，它的回调函数立即会被放入到微任务队列中
5. 首先检查微任务队列，即microtask队列，发现此队列不为空，执行microtask队列中promise的then的回调，输出”111“，然后将该事件从microtask队列中移除
6. 此时micro队列为空，进入下一个事件循环，检测宏任务队列，发现有setTimeout的回调函数，立即执行回调函数输出‘setTimeout1',然后和第四步一样往microtask队列中添加Promise的resolve的回调函数,检查microtask队列，发现队列不为空，执行promise的then回调，输出’222‘,进入下一个事件循环
7. 检测宏任务队列，发现有setTimeout的回调函数，立即执行回调函数输出'setTimeout2'


再看一下下面的执行顺序

```
console.log('script start');

setTimeout(function () {
    console.log('setTimeout---0');
}, 0);

setTimeout(function () {
    console.log('setTimeout---200');
    setTimeout(function () {
        console.log('inner-setTimeout---0');
    });
    Promise.resolve().then(function () {
        console.log('promise5');
    });
}, 200);

Promise.resolve().then(function () {
    console.log('promise1');
}).then(function () {
    console.log('promise2');
});
Promise.resolve().then(function () {
    console.log('promise3');
});
console.log('script end');
```

思考一下，运行结果是什么？
运行结果为:

```
script start
script end
promise1
promise3
promise2
setTimeout---0
setTimeout---200
promise5
inner-setTimeout---0
```
看看js代码的执行过程

1. 首先顺序执行完主进程上的同步任务，第一句和最后一句的console.log

2. 接着遇到setTimeout 0，它的作用是在 0ms 后将回调函数放到宏任务队列中(这个任务在下一次的事件循环中执行)。
3. 接着遇到setTimeout 200，它的作用是在 200ms 后将回调函数放到宏任务队列中(这个任务在再下一次的事件循环中执行)。
4. 同步任务执行完之后，首先检查微任务队列, 即 microtask队列，发现此队列不为空，执行第一个promise的then回调，输出 'promise1'，然后执行第二个promise的then回调，输出'promise3'，由于第一个promise的.then()的返回依然是promise，所以第二个.then()会放到microtask队列继续执行，输出 'promise2';
5. 此时microtask队列为空，进入下一个事件循环, 检查宏任务队列，发现有setTimeout的回调函数，立即执行回调函数输出 'setTimeout---0',检查microtask 队列，队列为空，进入下一次事件循环.
6. 检查宏任务队列，发现有 setTimeout的回调函数, 立即执行回调函数输出'setTimeout---200'.
7. 接着遇到setTimeout 0，它的作用是在 0ms 后将回调函数放到宏任务队列中，检查微任务队列，即 microtask 队列，发现此队列不为空，执行promise的then回调，输出'promise5'。
8. 此时microtask队列为空，进入下一个事件循环，检查宏任务队列，发现有 setTimeout 的回调函数，立即执行回调函数输出，输出'inner-setTimeout---0'。代码执行结束.


## 4. 为什么会需要event-loop?

因为JavaScript是单线程的。单线程就意味着，所有任务需要排队,前一个任务结束，才会执行后一个任务。如果前一个任务耗时很长，后一个就必须一直等待。为了协调事件(event), 用户交互 (user interaction), 脚本 (script), 渲染 (rendering),网络(networking)等，用户代理(user agent) 必须使用事件循环 (event loops).

如上所述，是发生在浏览器中的Event-loop.


### 5. Node上的实现

nodejs的event loop 分为6个阶段，它们会按照顺序反复运行，分别如下：

> 1. timers: 执行setTimeout() 和setInterval()中到期的callback.
> 2. I/O callbacks: 上一轮循环中有少数的I/O callback会被延迟到这一轮的这一阶段执行
> 3. idle, prepare: 队列的移动，仅内部使用
> 4. poll: 最为重要的阶段，执行I/O callback,在适当的条件下会阻塞这个阶段
> 5. check: 执行setImmediate的callback
> 6. close callbacks: 执行close事件的callback,例如socket.on("close
", func)

不同于浏览器的是，在每个阶段完成后，而不是MacroTask任务完成后，microTask队列就会被执行。这就导致了同样的代码在不同的上下文环境下会出现不同的结果。我们在下文中会探讨。

另外需要注意的是，如果在timers阶段执行时创建了setImmediate则会在此轮循环的check阶段执行，如果在timers阶段创建了setTimeout，由于timers已取出完毕，则会进入下轮循环，check阶段创建timers任务同理。

![image](http://segmentfault.com/img/bV6iwC?w=655&h=503)

#### 5.1、 示例
```
setTimeout(()=>{
    console.log('timer1')

    Promise.resolve().then(function() {
        console.log('promise1')
    })
}, 0)

setTimeout(()=>{
    console.log('timer2')

    Promise.resolve().then(function() {
        console.log('promise2')
    })
}, 0)



浏览器输出：
time1
promise1
time2
promise2

Node11之前

Node输出：
time1
time2
promise1
promise2

Node11之后和浏览器保持一致
time1
promise1
time2
promise2

```

最初timer1和timer2就在timers阶段中。开始时首先进入timers阶段，执行timer1的回调函数，打印timer1，并将promise1.then回调放入microtask队列，同样的步骤执行timer2，打印timer2；
至此，timer阶段执行结束，event loop进入下一个阶段之前，执行microtask队列的所有任务，依次打印promise1、promise2。

而浏览器则因为两个setTimeout作为两个MacroTask, 所以先输出timer1, promise1，再输出timer2，promise2。

更加详细的信息可以查阅[《深入理解js事件循环机制（Node.js篇）》](http://lynnelv.github.io/js-event-loop-nodejs)

为了证明上面的理论，把代码修改一下

```
setImmediate(() => {
  console.log('timer1')

  Promise.resolve().then(function () {
    console.log('promise1')
  })
})

setTimeout(() => {
  console.log('timer2')

  Promise.resolve().then(function () {
    console.log('promise2')
  })
}, 0)

Node输出：
timer1               timer2
promise1    或者     promise2
timer2               timer1
promise2             promise1
```
按理说setTimeout(fn,0)应该比setImmediate(fn)快，应该只有第二种结果，为什么会出现两种结果呢？
这是因为Node 做不到0毫秒，最少也需要1毫秒。实际执行的时候，进入事件循环以后，有可能到了1毫秒，也可能还没到1毫秒，取决于系统当时的状况。如果没到1毫秒，那么 timers 阶段就会跳过，进入 check 阶段，先执行setImmediate的回调函数。

另外，如果已经过了Timer阶段，那么setImmediate会比setTimeout更快，例如：

```
const fs = require('fs');

fs.readFile('test.js', () => {
  setTimeout(() => console.log(1));
  setImmediate(() => console.log(2));
});
```
上面代码会先进入 I/O callbacks 阶段，然后是 check 阶段，最后才是 timers 阶段。因此，setImmediate才会早于setTimeout执行。

具体可以看[《Node 定时器详解》](http://www.ruanyifeng.com/blog/2018/02/node-event-loop.html)。

#### 5.2、不同异步任务执行的快慢

```
setTimeout(() => console.log(1));
setImmediate(() => console.log(2));

Promise.resolve().then(() => console.log(3));
process.nextTick(() => console.log(4));


输出结果：4 3 1 2或者4 3 2 1
```
因为我们上文说过microTask会优于macroTask运行，所以先输出下面两个，而在Node中process.nextTick比Promise更加优先[3]，所以4在3前。而根据我们之前所说的Node没有绝对意义上的0ms，所以1,2的顺序不固定。

#### 5.3 MicroTask与MacroTask队列

```
 setTimeout(function () {
       console.log(1);
   },0);
   console.log(2);
   process.nextTick(() => {
       console.log(3);
   });
   new Promise(function (resolve, rejected) {
       console.log(4);
       resolve()
   }).then(res=>{
       console.log(5);
   })
   setImmediate(function () {
       console.log(6)
   })
   console.log('end');

Node输出：
2 4 end 3 5 1 6
```
这个例子来源于[《JavaScript中的执行机制》](https://juejin.im/post/5a623a11f265da3e2d33846b#heading-1)。Promise的代码是同步代码，then和catch才是异步的，所以4要同步输出，然后Promise的then位于microTask中，优于其他位于macroTask队列中的任务，所以5会优于1,6输出，而Timer优于Check阶段,所以1,6。

6. 总结

- 同一个上下文下，MicroTask会比MacroTask先运行
- 然后浏览器按照一个MacroTask任务，所有MicroTask的顺序运行，Node按照六个阶段的顺序运行，并在每个阶段后面都会运行MicroTask队列
- 同个MicroTask队列下process.tick()会优于Promise

