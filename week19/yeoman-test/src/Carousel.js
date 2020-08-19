import { create, Text, Wraper } from '../createElement.js'
import {Timeline, Animation} from '../animation/animation'

import{ease} from '../animation/cubicBezier'

import {enableGesture} from '../gesture/gesture'


export class Carousel {
    constructor(config) {
        this.child = [];
        this.root = document.createElement('div');
    }
    set id(v) { //property
        console.log('parent:id', v);
    }
    setAttribute(name, value) {
        // console.log(name,value);
        this[name] = value;
    }
    appendChild(child) {
        this.child.push(child);
    }
    render() {
        let position = 0;
        let timeline = new Timeline;

        timeline.start();

        let nextPicStopHandler = null;

        

        let children = this.data.map((url, currentPosition) => {
            let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length;
            let nextPosition = (currentPosition + 1) % this.data.length;


                
                let offset = 0;
            let onStart = () => {
                timeline.pause();
                clearTimeout(nextPicStopHandler);
                let currentElement = children[currentPosition];
                let currentTransformValue = ((currentElement.style.transform).match(/translateX\(([\s\S]+)px\)/))
                    && Number(((currentElement.style.transform).match(/translateX\(([\s\S]+)px\)/))[1]);
                offset = currentTransformValue + 500 * currentPosition;
                
            }
    
            let onPan = event => {
                let lastElement = children[lastPosition];
                let currentElement = children[currentPosition];
                let nextElement = children[nextPosition];

                let dx = event.clientX - event.startX;
                let currentTransformValue = -500 * currentPosition + offset + dx;
                let lastTransformValue = -500 -500 * lastPosition + offset +dx;
                let nextTransformValue = 500 -500 * nextPosition + offset +dx;


                console.log(currentElement.style.transform);

                
                console.log(currentTransformValue, offset);

                
                console.log(dx);
                currentElement.style.transform  = `translateX(${currentTransformValue }px)`
                lastElement.style.transform  = `translateX(${lastTransformValue }px)`
                nextElement.style.transform  = `translateX(${nextTransformValue}px)`
            }

            let onPanend = event => {
                let direction = 0;
                let dx = event.clientX - event.startX;
                
                if(dx + offset > 150) {
                    direction = 1;
                } else if(dx + offset  < -150) {
                    direction = -1;
                }
                timeline.reset();
                timeline.start();

                let lastElement = children[lastPosition];
                let currentElement = children[currentPosition];
                let nextElement = children[nextPosition];
                console.log(dx+offset);
                console.log(direction);
                let lastTransformValue = -500 -500 * lastPosition + offset +dx;
                let currentTransformValue = -500 * currentPosition + offset + dx;
                
                let nextTransformValue = 500 - 500 * nextPosition + offset +dx;

                let lastTransformValueTarget = -500 -500 * lastPosition  +direction*500;

                let currentTransformValueTarget = -500 * currentPosition  + direction * 500;
                
                let nextTransformValueTarget = 500 -500 * nextPosition  +direction*500;
                // let lastTransformValue = -500 -500 * lastPosition + offset +dx;
                console.log(currentTransformValue,lastTransformValue,nextTransformValue);
                console.log(currentTransformValueTarget,lastTransformValueTarget,nextTransformValueTarget);
                let currentAnimation = new Animation(currentElement.style, 'transform',v=>`translateX(${v}px)`, currentTransformValue, currentTransformValueTarget, 500 ,0 ,ease);
                let lastAnimation = new Animation(lastElement.style, 'transform',v=>`translateX(${v}px)`,lastTransformValue,lastTransformValueTarget, 500 ,0 ,ease);
                let nextAnimation = new Animation(nextElement.style, 'transform',v=>`translateX(${v}px)`, nextTransformValue,nextTransformValueTarget, 500 ,0 ,ease);
            
                timeline.add(currentAnimation)
                timeline.add(lastAnimation)
                timeline.add(nextAnimation)

                position = (position - direction + this.data.length) % this.data.length;
                nextPicStopHandler = setTimeout(nextPic, 3000);
            }
            let element = <img src={url} onStart= {onStart} onPan= {onPan} onPanend = {onPanend} enableGesture = {true} />;
            element.style.transform = 'translateX(0x)';
            element.addEventListener('dragstart', event => event.preventDefault());
            return element;
        });
        let root = <div class='carousel'>
            {
                children
            }
        </div>;
        
        window.timeline = timeline;
        
        let nextPic = () => {
            console.log(children);
            
            let nextPosition = (position + 1) % this.data.length;
            let current = children[position].root;
            let next = children[nextPosition].root;
            console.log(position);
            let currentAnimation = new Animation(current.style, 'transform',v=>`translateX(${v*5}px)`, -100 *position, -100 -100 *position, 500 ,0 ,ease);
            let nextAnimation = new Animation(next.style, 'transform',v=>`translateX(${v*5}px)`, 100-100 *nextPosition,-100 *nextPosition, 500 ,0 ,ease);
            timeline.add(currentAnimation)
            timeline.add(nextAnimation)
            position = nextPosition;
            nextPicStopHandler = setTimeout(nextPic, 3000);
        }
        setTimeout(nextPic, 3000);
        return root;

    }
    mountTo(parent) {
        this.render().mountTo(parent);
    }
}