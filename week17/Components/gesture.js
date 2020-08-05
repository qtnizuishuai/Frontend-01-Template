  
export function enableGesture(element) {
    let contexts = Object.create(null);

    let MOUSE_SYMBOL = Symbol('mouse');

    if (document.ontouchstart !== null) {
        element.addEventListener('mousedown', e => {
            contexts[MOUSE_SYMBOL] = Object.create(null);
            start(e, contexts[MOUSE_SYMBOL]);
            let mouseMove = e => {
                move(e, contexts[MOUSE_SYMBOL]);
            };

            let mouseEnd = e => {
                end(e, contexts[MOUSE_SYMBOL]);
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mouseup', mouseEnd);
            }

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseEnd);
        });
    }

    element.addEventListener('touchstart', (e) => {
        for (let touch of e.changedTouches) {
            contexts[touch.identifier] = Object.create(null);
            start(touch, contexts[touch.identifier]);
        }
    })

    element.addEventListener('touchmove', (e) => {
        for (let touch of e.changedTouches) {
            move(touch, contexts[touch.identifier]);
        }
    })

    element.addEventListener('touchend', (e) => {
        for (let touch of e.changedTouches) {
            end(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    })

    element.addEventListener('touchcancel', (e) => {
        for (let touch of e.changedTouches) {
            cancel(touch, contexts[touch.identifier]);
            delete contexts[touch.identifier];
        }
    })

    let start = (point, context) => {
        context.startX = point.clientX;
        context.startY = point.clientY;
        context.moves = [];
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        element.dispatchEvent(new CustomEvent('start', {}));

        context.timeoutHandler = setTimeout(() => {
            if (context.isPan) {
                return;
            }

            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            element.dispatchEvent(new CustomEvent('pressStart', {}));
        }, 500)
    }

    let move = (point, context) => {
        let dx = point.clientX - context.startX;
        let dy = point.clientY - context.startY;

        if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {
            if (context.isPress) {
                element.dispatchEvent(new CustomEvent('pressCancel', {}));
            }

            context.isTap = false;
            context.isPan = true;
            context.isPress = false;

            let e = new CustomEvent('panStart');
            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            })
            element.dispatchEvent(e);
        }

        if (context.isPan) {
            context.moves.push({
                dx, dy,
                t: Date.now()
            });
            context.moves = context.moves.filter(record => Date.now() - record.t < 300);
            let e = new CustomEvent('pan');
            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
            })
            element.dispatchEvent(e);
        }
    }

    let end = (point, context) => {
        if (context.isPan) {
            let dx = point.clientX - context.startX;
            let dy = point.clientY - context.startY;

            let record = context.moves[0];
            let speed = Math.sqrt((dx - record.dx) ** 2 + (dy - record.dy) ** 2) / (Date.now() - record.t);

            const isFlick = speed > 2.5;

            if (isFlick) {
                let e = new CustomEvent('flick');
                Object.assign(e, {
                    startX: context.startX,
                    startY: context.startY,
                    clientX: point.clientX,
                    clientY: point.clientY,
                    speed
                });
                element.dispatchEvent(e);
            }

            let e = new CustomEvent('panend');
            Object.assign(e, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                speed,
                isFlick
            });
            element.dispatchEvent(e);
        }

        if (context.isPress) {
            element.dispatchEvent(new CustomEvent('pressEnd', {}));
        }

        if (context.isTap) {
            element.dispatchEvent(new CustomEvent('tapEnd', {}));
        }

        clearTimeout(context.timeoutHandler);
    }

    let cancel = (point, context) => {
        element.dispatchEvent(new CustomEvent('canceled', {}));
        clearTimeout(context.timeoutHandler);
    }
}