# 每周总结可以写在这里

# 本周总结

> 这周是关于组件化的内容，首先是搭建了一个具有 JSX 语法的环境，然后在该环境中设计与实现了一个轮播组件。
最后学到了写技术博客的一些细节。

## 组件化——为组件添加JSX语法

 > 以下是搭建组件化的关键步骤。

### 初始化项目

创建一个文件夹，并使用 npm init 命令初始化一个 package.json 文件。

### 安装依赖环境

--save-dev 表示将这些依赖安装到项目中，并且这些依赖是在开发和测试环境中使用。

``` node
npm install @babel/core --save-dev
npm install @babel/plugin-transform-react-jsx --save-dev
npm install @babel/preset-env --save-dev
npm install babel-loader --save-dev
npm install webpack --save-dev
npm install webpack-cli --save-dev
npm install webpack-dev-server --save-dev
```

### 配置 webpack 入口文件

将以下代码添加到新增的 webpack.config.js 文件中。

``` js
module.exports = {
    entry: './main.js',
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement'}]]
                }
            }
        }]
    },
    mode: 'development',
    optimization: {
        minimize: false
    }
};
```

### 设计组件

1. 添加一个 createElement 函数，该函数接收一个 Class、attribute 和 child 参数。并为这个 Class 添加 property。
2. 处理小写标签（省略）。
3. 处理文本（省略）。

``` js
function createElement(Cls, attributes, ...children){
    let o = new Cls({ timer: {} });

    for (let name in attributes) {
        o.setAttribute(name, attributes[name]);
    }

    for (let child of children) {
        o.appendChild(child);
    }

    return o;
}

class MyComponent {
    constructor(config) {
        this.children = [];
        this.root = document.createElement('div');
    }

    setAttribute(name, value) {
        this.root.setAttribute(name, value);
    }

    appendChild(child) {
        this.children.push(child);
    }

    render() {}

    mount(parent) {
        parent.appendChild(this.root);

        for(let child of this.children) {
            child.mount(this.root);
        }
    }
}

let component = <Div id="a" style="width: 100px; height: 100px; background-color: pink;">
    <Div></Div>
    <Div></Div>
    <Div></Div>
</Div>

component.mount(document.body);
```

## 组件化——轮播组件

### 设计成什么样？

- 定时播放幻灯片
- 可以通过鼠标滑动幻灯片

### 如何设计？

...未完待续

## 如何写技术博客

1. 初衷
2. 受众
3. 方法

