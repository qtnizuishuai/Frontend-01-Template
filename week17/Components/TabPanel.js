  
import { createElement, Text, Wrapper } from './createElement';
import { Timeline, Animation } from './animation'
import { ease, linear } from './cubicBezier'
import { enableGesture } from './gesture'

export class TabPanel {
    constructor(config) {
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
        this.state = Object.create(null);
    }

    setAttribute(name, value) {
        this[name] = value;
    }

    getAttribute(name) {
        return this[name];
    }

    appendChild(child) {
        this.children.push(child);
    }

    select(i) {
        for (const childView of this.childViews) {
            childView.style.display = 'none';
        }

        this.childViews[i].style.display = '';

        for (const view of this.titleViews) {
            view.classList.remove('selected');
        }

        this.titleViews[i].classList.add('selected');
    }

    render() {
        setTimeout(() => this.select(0), 16)
        this.childViews = this.children.map(child => <div style='min-height: 300px'>{child}</div>);
        this.titleViews = this.children.map((child, i) => <span class='tab-title' onClick={() => this.select(i)} style=''>{child.getAttribute('title')}</span>);
        console.log(this.titleViews);

        return <div class="panel" style="min-width: 300px">
            <h1 style="margin: 0">{this.titleViews}</h1>
            <div>
                {this.childViews}
            </div>
        </div>
    }

    mountTo(parent) {
        this.render().mountTo(parent);
    }
}