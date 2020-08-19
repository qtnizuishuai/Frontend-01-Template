// enableGesture(document.body);
export function enableGesture(element) {
    // function enableGesture(element) {
    
        let contexts = Object.create(null);
    
        let MOUSE_SYMBOL = Symbol('mouse');
        
        if(document.ontouchstart!== null)
            element.addEventListener('mousedown', (event) => {
                contexts[MOUSE_SYMBOL] = Object.create(null);
                start(event, contexts[MOUSE_SYMBOL]);
                let mousemove = event => {
                    move(event, contexts[MOUSE_SYMBOL]);
        
                }
        
                let mouseend = event => {
                    end(event, contexts[MOUSE_SYMBOL]);
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseend);
                }
        
                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseend);
            }, false);
        
        
        element.addEventListener('touchstart',event => {
            for(let touch of event.changedTouches) {
                contexts[touch.identifier] = Object.create(null);
                start(touch, contexts[touch.identifier]);
            }
        });
        
        element.addEventListener('touchmove',event => {
            for(let touch of event.changedTouches) {
                move(touch, contexts[touch.identifier]);
            }
            // console.log(event.changedTouches[0]);
        });
        
        element.addEventListener('touchend',event => {
            for(let touch of event.changedTouches) {
                end(touch, contexts[touch.identifier]);
                delete contexts[touch.identifier];
            }
        });
        
        element.addEventListener('touchcancel',event => {
            for(let touch of event.changedTouches) {
                cancel(touch, contexts[touch.identifier]);
                delete contexts[touch.identifier];
            }
        });
        // tap
        // pan    panstart     panmove     panend
        // flick
        // press   pressstart    pressend
        let start = (point, context) => {
            const event = new CustomEvent('start', {
                startX: context.clientX,
                startY: context.clientY,
                clientX: point.clientX,
                clientY: point.clientY,
            });
            element.dispatchEvent(event);
            context.startX = point.clientX;
            context.startY = point.clientY;
            context.isTap = true;
            context.isPan = false;
            context.isPress = false;
            context.moves = [];
            context.timeoutHandler = setTimeout(() => {
        
                if(context.isPan) {
                    return;
                }
                context.isTap = false;
                context.isPan = false;
                context.isPress = true;
                const event = new CustomEvent('pressstart', {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                });
                // console.log('pressstart');
            }, 500);
        
            // console.log('start');
            // console.log(point);
        }
        
        let move = (point, context) => {
            let dx = point.clientX - context.startX, dy = point.clientY - context.startY;console.log(dy);
            if(dx**2 + dy** 2 > 100 && !context.isPan) {
                // console.log(1);
                if(context.isPress) {
                    element.dispatchEvent(new CustomEvent('presscancel', {}));
                }
                context.isTap = false;
                context.isPan = true;
                context.isPress = false;
                // console.log(context);
                element.dispatchEvent(new CustomEvent('panstart', {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                }));
            }
            context.moves.push({
                dx,dy,
                t: Date.now()
            });
            // console.log(context);
            if(context.isPan) {
                context.moves.push({
                    dx,dy,t:Date.now()
                });
                context.moves = context.moves.filter(record => Date.now() - record.t < 300);
                let e = new CustomEvent('pan');
                Object.assign(e, {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY
                });
                element.dispatchEvent(e);
                console.log('dispatch   pan')
            }
        
        }
        
        let end = (point,context) => {
            if(context.isPan) {
                let dx = point.clientX - context.clientX, dy = point.clientY - context.clientY;
                let record = context.moves[0];
                let speed = Math.sqrt((record.dx - dx) ** 2 + (record.dy - dy) ** 2 ) / (Date.now()- record.t);
                let isFlick = speed > 2.5;
                if(isFlick) {
                    element.dispatchEvent(new CustomEvent('panstart', {
                        startX: context.startX,
                        startY: context.startY,
                        clientX: point.clientX,
                        clientY: point.clientY,
                        speed: speed
                    }));
                }
                console.log(context, point);
                let e = new CustomEvent('panend');
                Object.assign(e, {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    speed: speed,
                    isFlick: isFlick
                });
                console.log(e,context);
                element.dispatchEvent(e);
                
            }
        
            if(context.isTap) {
                const event = new CustomEvent('tap');
                element.dispatchEvent(event);
                console.log('tapend');
            }
        
            if(context.isPress) {
                console.log('pressend');
                const event = new CustomEvent('pressend');
                element.dispatchEvent(event);
            }
            clearTimeout(context.timeoutHandler);
            // console.log('end');
            // console.log(point);
        }
        
        let cancel = (point) => {
            console.log('cancel');
            const event = new CustomEvent('cancel');
                element.dispatchEvent(event);
            clearTimeout(context.timeoutHandler);
            
            // console.log(point);
        }
        
    }