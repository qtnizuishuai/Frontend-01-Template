# 每周总结可以写在这里


## [异步编程]
- setTimeout
- promise
- generator
- async await

```
function* g{
    yield 1;
    yield 2;
    yield 3;
}

for(v of g()){
    console.log(v)
}

async function* ag(){
    let i=0;
    while(true){
        await sleep(1000);
        yield i++;
    }
}

for await(let v of ag()){
    console.log(v)
}
```

## [寻路问题]
- 绘制画板
- 广度优先搜索
- 深度优先搜索
- A* (A-Star) 
- (启发式算法)


### 简单思路

- 获取起始点坐标
- 根据起始点坐标扩展（8 个方向），并标记扩展坐标
- 遇到障碍物或边界停止扩展
- 不能重复访问已扩展的坐标
- 返回搜索最佳路径

## [正则表达式]
- match
- replace
- exec
- lastIndex

## [EventTarget.addEventListener()](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)


+ [Event reference](https://developer.mozilla.org/en-US/docs/Web/Events)
  - Resource events
    + error
    + abort
    + load
    + beforeunload
    + unload
  - Network events
    + online
    + offline
  - Foucs events
    + focus
    + blur
    + focusin
    + focusout
  - WebSocket events
    + open
    + message
    + error
    + close
  - Seesion History events
    + pagehide
    + pageshow
    + popstate
  - CSS Animation events
    + animationstart
    + animationcancel
    + animationend
    + animationiteration
  - CSS Transition events
    + transitionstart
    + transitioncancel
    + transitionend
    + transitionrun
  - Form events
    + reset
    + submit
  - Printing events
    + beforeprint
    + afterprint
  - Text Composition events
    + compositionstart
    + compositionupdate
    + compositionend
  - View events
    + fullscreenchange
    + fullscreenerror
    + resize
    + scroll
  - Clipboard events
    + cut
    + copy
    + paste
  - Keyboard events
    + keydown
    + keypress
    + keyup
  - Mouse events
    + auxclick
    + click
    + contextmenu
    + dblclick
    + mousedown
    + mouseenter
    + mouseleave
    + mousemove
    + mouseover
    + mouseout
    + mouseup
    + pointerlockchange
    + pointerlockerror
    + select
    + wheel
  - Drag & Drop events
    + drag
    + dragend
    + dragenter
    + dragstart
    + dragleave
    + dragover
    + drop
  - Media events
    + audioprocess
    + canplay
    + canplaythrough
    + complete
    + durationchange
    + emptied
    + ended
    + loadeddata
    + loadedmetadata
    + pause
    + play
    + playing
    + ratechange
    + seeked
    + seeking
    + stalled
    + suspend
    + timeupdate
    + volumechange
    + waiting
  - Progress events
    + abort
    + error
    + load
    + loadend
    + loadstart
    + progress
    + timeout
  - Storage events
    + change
    + storage
  - Update events
    + checking
    + downloading
    + error
    + noupdate
    + obsolete
    + updateready
  - Value Change events
    + broadcast
    + CheckboxStateChange
    + hashchange
    + input
    + RadioStateChange
    + readystatechange
    + ValueChange
  - Uncategorized events
    + invalid
    + message
    + open
    + show
  - Abortable Fetch events
    + abort
  - WebVR events
  - SVG events
    + SVGAbort
    + SVGError
    + SVGLoad
    + SVGResize
    + SVGScroll
    + SVGUnload
    + SVGZoom
  - Database events
    + abort
    + blocked
    + complete
    + error
    + success
    + upgradeneeded
    + versionchange
  - Script events
    + afterscriptexecute
    + beforescriptexecute
  - Menu events
    + DOMMenuItemActive
    + DOMMenuItemInactive
  - Window events
    + close
  - Popup events
    + popuphidden
    + popuphiding
    + popupshowing
    + popupshown
  - Tab events
    + visibilitychange
  - Battery events
    + chargingchange
    + chargingtimechange
    + dischargingtimechange
    + levelchange
  - Call events
    + alerting
    + busy
    + callschanged
    + cfstatechange
    + connected
    + connecting
    + dialing
    + disconnected
    + disconnecting
    + error
    + held, holding
    + incoming
    + resuming
    + statechange
    + voicechange
  - Sensor events
    + compassneedscalibration
    + devicemotion
    + deviceorientation
    + orientationchange
  - SMS and USSD events
    + delivered
    + received
    + sent
    + ussdreceived
  - Touch events
    + touchcancel
    + touchend
    + touchmove
    + touchstart
  - Pointer events
    + pointerover
    + pointerenter
    + pointerdown
    + pointermove
    + pointerup
    + pointercancel
    + pointerout
    + pointerleave
    + gotpointercapture
    + lostpointercapture