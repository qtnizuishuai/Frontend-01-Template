# 每周总结可以写在这里
# 每周总结可以写在这里

## 手势

## 常用手势

- Tap (手指轻点屏幕)
- Pan(手指拖拽)
- Flick(快速点)
- Press(点后较长时间离开屏幕)

## 轮播组件需要添加手势
* 点击跳转问题（移动端：手指左右滑切换，轻触、点击跳转）
  * mouseup  mousedown  无法区分左右滑与点击的 
  * 手指会抖动，压触形状也会变化，无法保证 100% 不触发 mousemove 这样的事件
  * 触屏不做兼容，无法触发 mouse 系列事件
* 拖拽行为的研究
  * 即使没有拖动 1/2 的距离，最后离开时只要速度够快，也会触发翻页效果
  * 必须是横向开始（一旦触发纵向拖拽，横向拖拽就没有效果了）
* 移动兼容问题
  * TouchEvent 与 MouseEvent 完全不一样
  * TouchEvent.changedTouches 中才有 x  y 
  * TouchEvent.changedTouches  列表中允许多指触控
  * MouseEvent
    * mousedown
    * mouseup
    * mousemove
  * TouchEvent
    * touchstart
    * touchmove
    * touchend
    * touchcancel
  * PointerEvent（不需要区分 MouseEvent 和 TouchEvent）

## 手势介绍（业界比较常见的一组抽象）
    将单点的事件，识别成反应人类操作意图的手势
* Tap（手，点击屏幕）
* Pan（手，较慢的拖拽一个物体）
* Filck（与 Pan 相似，但速度非常快，需要很快的离开屏幕）
* Press（手，长按在屏幕上，然后松开） 

## 如何监听鼠标事件？
* 在 mousedown  中，监听 mousemove 和 mouseup
```
let element = document.body

element.addEventListener('mousedown', () => {
    // 在 mousedown 中，监听 mousemove 和 mouseup 事件
    let move = event => {
        console.log(event.clientX, event.clientY)
    }

    let end = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', end)
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', end)
})

```

## 如何监听 touch 事件？
* TouchEvent
  * identifier 识别是哪个 touch
  * changedTouches 一个类数组 (保存touch变化序列)
  
* 几个重要事件
  * touchstart
  * touchmove
  * touchend
  * touchcancel ：与 touchend 只会触发一个（如屏幕突然弹窗，会触发 touchcancel ）
  
```
let element = document.body

element.addEventListener('touchstart', event => {
    console.log(event) // 得到一个 TouchEvent -> changedTouches
})

element.addEventListener('touchstart', () => {
    console.log('start')
})

element.addEventListener('touchmove', () => {
    console.log('move')
})

element.addEventListener('touchend', () => {
    console.log('end')
})

// 一定要监听，与 touchend 只会触发一个
// 当有弹窗、系统消息、触发系统手势终止了自定义手势时，都会触发 touchcancel，而不会触发 touchend
element.addEventListener('touchcancel', () => {
    console.log('cancel')
})

```

## 封装 touch 与 mouse 都支持的事件
* 监听
  
```
let element = document.body

// 1. 监听 mousedown 事件
element.addEventListener('mousedown', event => {
    start(event)

    // 在 mousedown 中，监听 mousemove 和 mouseup 事件
    let mousemove = event => {
        move(event)
    }

    let mouseend = () => {
        end(event)
        document.removeEventListener('mousemove', mousemove)
        document.removeEventListener('mouseup', mouseend)
    }

    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseend)
})

// 2. 监听 touch 事件
element.addEventListener('touchstart', event => {
    for (let touch of event.changedTouches) {
        start(touch)
    }
})

element.addEventListener('touchmove', () => {
    for (let touch of event.changedTouches) {
        move(touch)
    }
})

element.addEventListener('touchend', () => {
    for (let touch of event.changedTouches) {
        end(touch)
    }
})

element.addEventListener('touchcancel', () => {
    for (let touch of event.changedTouches) {
        cancel(touch)
    }
})

let start = (point) => {
    console.log('start', point.clientX, point.clientY)
}

let move = (point) => {
    console.log('move', point.clientX, point.clientY)
}

let end = (point) => {
    console.log('end', point.clientX, point.clientY)
}

let cancel = (point) => {
    console.log('cancel', point.clientX, point.clientY)
}

```

### 手势架构
* 监听
* 识别
* 分发

### 手势识别状态图
![Image text](https://github.com/qtnizuishuai/Frontend-01-Template/blob/master/week16/commongesture1.png)
![Image text](https://github.com/qtnizuishuai/Frontend-01-Template/blob/master/week16/commongesture2.png)
### 参考链接
[DOM Events](https://developer.mozilla.org/en-US/docs/Web/Events)
[triggering events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events)