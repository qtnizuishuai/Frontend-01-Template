import { Timeline, Animation } from './animation.js';
import { ease } from './cubicBezier.js'
import { createElement } from './utils';
export class Carousel {
    constructor(config) {  // config
        // console.log('Parent::config', config);
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
    }

    setAttribute(name, value) {    // attribute
        // 这里将 attribute 存起来，在 render 中处理
        this.attributes.set(name, value); 
        this[name] = value;
    }

    appendChild(child) {   // children
        this.children.push(child);
        // child.mountTo(this.root);    
    }

    mountTo(parent) {
        this.render().mountTo(parent);
    }

    render() {
        let timeline = new Timeline;
        window.xtimeline = timeline;
        timeline.start();

        let positon = 0;

        let nextPicStophandler = null;

        let children = this.attributes.get('data').map((url, currentPosition) => {
            let lastPosition = (currentPosition - 1 + this.data.length) % this.data.length;
            let nextPosition = (currentPosition + 1) % this.data.length;

            let offset = 0;

            let onStart = () => {
                console.log('onStart');
                timeline.pause();
                clearTimeout(nextPicStophandler);
                let currentElement = children[currentPosition];
                console.log(currentElement.style.transform, currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/));
                let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]);
                offset = currentTransformValue + 500 * currentPosition;
            }

            let onPanMove = event => {
                console.log('onPan', lastPosition, currentPosition, nextPosition);
                let lastElement = children[lastPosition];
                let currentElement = children[currentPosition];
                let nextElement = children[nextPosition];

                let dx = event.detail.clientX - event.detail.startX;

                let lastTransformValue = -500 - 500 * lastPosition + offset + dx;
                let currentTransformValue = -500 * currentPosition + offset + dx;
                let nextTransformValue = 500 - 500 * nextPosition + offset + dx;

                console.log(lastTransformValue + dx, currentTransformValue + dx, nextTransformValue + dx);

                lastElement.style.transform = `translateX(${lastTransformValue}px)`;
                currentElement.style.transform = `translateX(${currentTransformValue}px)`;
                nextElement.style.transform = `translateX(${nextTransformValue}px)`;

            }

            let onPanEnd = event => {
                console.log('onPanEnd');
                let direction = 0;
                let dx = event.detail.clientX - event.detail.startX;
                if (dx + offset > 250) {
                    direction = 1;
                } else if (dx + offset < -250) {
                    direction = -1;
                }

                timeline.reset();
                timeline.start();

                // let lastTransformValue = -500 - 500 * lastPosition + offset + dx;
                // let currentTransformValue = 500 * currentPosition + offset + dx;
                // let nextTransformValue = 500 - 500 * lastPosition + offset + dx;

                let lastElement = children[lastPosition];
                let currentElement = children[currentPosition];
                let nextElement = children[nextPosition];

                let lastAnimation = new Animation(lastElement.style, 'transform', -500 - 500 * lastPosition + offset + dx, -500 - 500 * lastPosition + direction * 500, 500, 0, ease, v => `translateX(${v}%)`);
                let currentAnimation = new Animation(currentElement.style, 'transform', - 500 * currentPosition + offset + dx, - 500 * currentPosition + direction * 500, 500, 0, ease, v => `translateX(${v}%)`);
                let nextAnimation = new Animation(nextElement.style, 'transform', 500 - 500 * nextPosition + offset + dx, 500 - 500 * nextPosition + direction * 500, 500, 0, ease, v => `translateX(${v}%)`);

                timeline.add(lastAnimation);
                timeline.add(currentAnimation);
                timeline.add(nextAnimation);

                console.log(timeline);

                positon = (positon - direction + this.data.length) % this.data.length;
                // lastElement.style.transform = `translateX(${lastTransformValue + dx}px)`;
                // currentElement.style.transform = `translateX(${currentTransformValue + dx}px)`;
                // nextElement.style.transform = `translateX(${nextTransformValue + dx}px)`;
                nextPicStophandler = setTimeout(nextPic, 3000);
            }

            let element = <img src={url} onStart={onStart} onPanmove={onPanMove} onPanend={onPanEnd} enableGesture={true} />
            element.style.transform = 'translateX(0px)';
            element.addEventListener('dragstart', event => event.preventDefault());
            return element;
        });

        // debugger;
        let root = <div class={this.attributes.get('class')}>
            {children}
        </div>;

        let nextPic = () => {
            console.log('nextPic');
            let nextPositon = (positon + 1) % this.data.length;

            let current = children[positon];
            let next = children[nextPositon];

            let currentAnimation = new Animation(current.style, 'transform', -100 * positon, -100 - 100 * positon, 500, 0, ease, v => `translateX(${5 * v}px)`);
            let nextAnimation = new Animation(next.style, 'transform', 100 - 100 * nextPositon, -100 * nextPositon, 500, 0, ease, v => `translateX(${5 * v}px)`);

            timeline.add(currentAnimation);
            timeline.add(nextAnimation);

            positon = nextPositon;
            // window.xstopHandler = setTimeout(nextPic, 3000);
            nextPicStophandler = setTimeout(nextPic, 3000);
        }
        nextPicStophandler = setTimeout(nextPic, 3000);

        return root;
    }
}
// class Carousel {
//     constructor(config) {
//         this.children = [];
//         this.attribute = new Map();
//         this.properties = new Map();
//     }

//     setAttribute(name, value) { // 设置 attribute
//         // 这里将attribute存起来 在render中处理
//         this.attributes.set(name, value);
//         this[name] = value;
//     }

//     appendChild(child) { // 设置 children
//         this.children.push(child);
//     }

//     render() {
//         const children = this.data.map((url) => (
//             <img src={url} draggable="false" />
//         ));
//         const root = <div class="carousel">{children}</div>;

//         let position = 0;
//         let nextPic = () => {
//             const nextPosition = (position + 1) % this.data.length;
//             const current = children[position];
//             const next = children[nextPosition];

//             current.style.transition = "ease 0s";
//             next.style.transition = "ease 0s";

//             current.style.transform = `translateX(${-100 * position}%)`;
//             next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

//             setTimeout(() => {
//                 current.style.transition = "";
//                 next.style.transition = "";

//                 current.style.transform = `translateX(${-100 - 100 * position}%)`;
//                 next.style.transform = `translateX(${-100 * nextPosition}%)`;

//                 position = nextPosition;
//             }, 16);

//             setTimeout(nextPic, 3000);
//         };
//         setTimeout(nextPic, 3000);

//         root.addEventListener("mousedown", (event) => {
//             let startX = event.clientX;
//             const nextPosition = (position + 1) % this.data.length;
//             const lastPosition = (position - 1 + this.data.length) % this.data.length;

//             const current = children[position];
//             const next = children[nextPosition];
//             const last = children[lastPosition];

//             current.style.transition = "ease 0s";
//             next.style.transition = "ease 0s";
//             last.style.transition = "ease 0s";

//             current.style.transform = `translateX(${-500 * position}px)`;
//             next.style.transform = `translateX(${-500 - 500 * nextPosition}px)`;
//             last.style.transform = `translateX(${500 - 500 * lastPosition}px)`;

//             let move = (event) => {
//                 current.style.transform = `translateX(${
//                     event.clientX - startX - 500 * position
//                     }px)`;
//                 next.style.transform = `translateX(${
//                     event.clientX - startX + 500 - 500 * nextPosition
//                     }px)`;
//                 last.style.transform = `translateX(${
//                     event.clientX - startX - 500 - 500 * lastPosition
//                     }px)`;
//             };
//             let up = (event) => {
//                 let offset = 0;
//                 if (event.clientX - startX > 250) {
//                     offset = 1; // 往右拖动
//                 } else if (event.clientX - startX < -250) {
//                     offset = -1; // 往左拖动
//                 }

//                 current.style.transition = "";
//                 next.style.transition = "";
//                 last.style.transition = "";

//                 current.style.transform = `translateX(${
//                     offset * 500 - 500 * position
//                     }px)`;
//                 next.style.transform = `translateX(${
//                     offset * 500 + 500 - 500 * nextPosition
//                     }px)`;
//                 last.style.transform = `translateX(${
//                     offset * 500 - 500 - 500 * lastPosition
//                     }px)`;

//                 position = (position - offset + this.data.length) % this.data.length;
//                 document.removeEventListener("mousemove", move);
//                 document.removeEventListener("mouseup", up);
//             };
//             document.addEventListener("mousemove", move);
//             document.addEventListener("mouseup", up);
//         });

//         return root;
//     }

//     mountTo(parent) {
//         this.render().mountTo(parent);
//     }
// }
const data = [
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];
// debugger;
let component = <Carousel class="carousel" data={data} />;

component.mountTo(document.body);

console.log(component);