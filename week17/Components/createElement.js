  
import { enableGesture } from "./gesture";

export function createElement(Cls, attributes, ...children) {
    let o;

    if (typeof Cls === 'string') {
        o = new Wrapper(Cls);
    } else {
        o = new Cls({
            timer: {},
        });
    }

    for (let name in attributes) {
        o.setAttribute(name, attributes[name]);
    }

    let visit = children => {
        for (let child of children) {
            if (typeof child === 'object' && child instanceof Array) {
                visit(child);
                continue;
            }

            if (typeof child === 'string')
                child = new Text(child);

            o.appendChild(child);
        }
    }

    visit(children);
    // console.log(o);
    return o;
}

export class Text {
    constructor(text) {
        this.root = document.createTextNode(text);
    }

    mountTo(parent) {
        parent.appendChild(this.root);
    }

    getAttribute(name) {
        return;
    }
}

export class Wrapper {
    constructor(type) {
        this.children = [];
        this.root = document.createElement(type);
    }

    setAttribute(name, value) {
        //attribute
        this.root.setAttribute(name, value);

        if (name.match(/^on([\s\S]+)$/)) {
            // console.log(RegExp.$1);
            const eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
            // console.log(eventName);
            this.addEventListener(eventName, value);
        }

        if (name === 'enableGesture') {
            enableGesture(this.root);
        }
    }

    getAttribute(name) {
        return this.root.getAttribute(name);
    }

    appendChild(child) {
        this.children.push(child);
    }

    addEventListener() {
        this.root.addEventListener(...arguments);
    }

    get style() {
        return this.root.style;
    }

    set innerText(text) {
        this.root.innerText = text;
    }

    get classList() {
        return this.root.classList;
    }

    mountTo(parent) {
        parent.appendChild(this.root);

        for (let child of this.children) {
            // console.log('child', child);
            if (typeof child === 'string') {
                child = new Text(child);
            }
            child.mountTo(this.root);
        }
    }
}