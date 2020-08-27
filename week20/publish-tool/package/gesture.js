export function enableGesture(element) {
    
    let contexts = Object.create(null);
    
    let MOUSE_SYMBOL = Symbol("mouse");
    
    //有触摸屏不监听鼠标
    // if(document.ontouchstart == null)
    // {        // PC 端点击事件
        element.addEventListener('mousedown', (event) => {
            contexts[MOUSE_SYMBOL] = Object.create(null);
            start(event, contexts[MOUSE_SYMBOL]);
    
            let mousemove = (event) => {
                move(event, contexts[MOUSE_SYMBOL] );
            }
    
            let mouseup = (event) => {
                end(event, contexts[MOUSE_SYMBOL]);
                delete contexts[MOUSE_SYMBOL];
                document.removeEventListener('mousemove', mousemove);
                document.removeEventListener('mouseup', mouseup);
            }
    
            document.addEventListener('mousemove', mousemove);
            document.addEventListener('mouseup', mouseup);
        });
    // }
    
    //移动端触摸事件
    element.addEventListener('touchstart', (event) => {
        for(let touch of event.changedTouches) {
            contexts[touch.identifier] = Object.create(null);
            start(touch, contexts[touch.identifier]);
        }
    });
    
    element.addEventListener('touchmove', (event) => {
        for(let touch of event.changedTouches) {
            move(touch, contexts[touch.identifier]);
        }
    });
    
    element.addEventListener('touchend', (event) => {
        for(let touch of event.changedTouches) {
            end(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    });
    
    element.addEventListener('touchcancel', (event) => {
        for(let touch of event.changedTouches) {
            cancel(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    });
    
    let start = (point, context) => {
        context.startX = point.clientX, context.startY = point.clientY;
    
        element.dispatchEvent(new CustomEvent('start', {
            detail: {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY
            }
        }));
    
        context.moves = [];
    
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.timeoutHandler = setTimeout(()=> {
            if(context.isPan) {
                return;
            }
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            element.dispatchEvent(new CustomEvent('pressstart', {
                detail: {}
            }));
        }, 500);
    } ;
    
    let move = (point, context) => {
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
        if(dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            if(context.isPress) 
                element.dispatchEvent(new CustomEvent('presscancel', {
                    detail: {}
                }));
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            console.log('panstart');
            element.dispatchEvent(new CustomEvent('panstart', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY
                }
            }));
        }
    
        if(context.isPan) {
            context.moves.push({
                dx, dy,
                t: Date.now()
            });
            context.moves = context.moves.filter(record => Date.now() - record.t < 300);
            element.dispatchEvent(new CustomEvent('pan', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY
                }
            }));
        }
    } 
    
    let end = (point, context) => {
        if(context.isPan) {
            let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
            let record = context.moves[0];
            let speed =  Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2) / (Date.now() - record.t);
            console.log('speed',speed);
            let isFlick = speed > 1;
            if(isFlick) {
                console.log('flick');
                element.dispatchEvent(new CustomEvent('flick', {
                    detail: {
                        startX: context.startX,
                        startY: context.startY,
                        clientX: point.clientX,
                        clientY: point.clientY,
                        speed: speed
                    }
                }));
            }
            console.log('paneend');
            element.dispatchEvent(new CustomEvent('panend', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    speed: speed,
                    isFlick: isFlick
                }
            }));
        }
        if(context.isPress)
            console.log('pressend');
            element.dispatchEvent(new CustomEvent('pressend', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY
                }
            }));
        if(context.isTap)
            console.log('tap');
            element.dispatchEvent(new CustomEvent('tap', {
                detail: {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY
                }
            }));    
        clearTimeout(context.timeoutHandler);
    }
    
    let cancel = (point, context) => {
        console.log('cancelend');
        clearTimeout(context.timeoutHandler);
    }
    }