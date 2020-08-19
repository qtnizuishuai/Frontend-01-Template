
# 每周总结可以写在这里

## 用 yeoman 实现工具链

### 1. 创建 yeoman 项目

> 创建项目 generator-toy-tool，并安装相关依赖

```
npm i  yeoman-generator -D
```

> 创建 app 文件夹，文件夹下创建 index.js 开始编写脚手架相关的逻辑

```index.js
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  // 脚本会依照书写方法的顺序依次执行
  method1() {
    this.log('method 1 just ran');
  }
};

```

最后在项目下执行 npm link,在本地创建一个软链接,`.../node/v10.13.0/lib/node_modules/generator-toy-tool` 映射到 `.../generator/toy-tool`

在执行`yo toy-tool`命令时，会找到 node modules 的`generator-toy-tool`指向的地址。

> 如果项目名 yeoman 项目名需要修改，则将 package.json 中的 name 修改成`generator-xxx`再执行 npm lnik，然后`yo xxx`即可

## 2. 初始化依赖

npm install 需要的依赖

有三种安装依赖的方式：

1. this.npmInstall 方法安装

```
installingLodash() {
    this.npmInstall(['lodash'], { 'save-dev': true });
  }
```

2. 创建一个 package.json 并写入依赖

```
writing() {
  const pkgJson = {
    devDependencies: {
      eslint: '^3.15.0'
    },
    dependencies: {
      react: '^16.2.0'
    }
  };

  // Extend or create package.json file in destination path
  this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
}

install() {
  this.npmInstall();
}
```

3. 编写 package.json 的 template

编写好一个 package.json 再用 this.fs.copyTpl 方法来生成 template

```
this.fs.copyTpl(
  this.templatePath('package.json'),
  this.destinationPath('package.json')
);
this.npmInstall();
```

## 3. 生成文件

利用this.fs.copyTpl方法生成文件。


# 发布系统

*三个项目的角色*


- publish-server-vanilla 建立一个http服务器(源服务器)，并监听对应端口8081
- publish-server 处理内网开发，创建路由 (中间件，代理服务器)

- publish-tool 发起一个具体的请求到刚才启动的http服务(8081)。



> 初级形态：同机发布在publish-server中的输出文件到server的public中

验证用户、版本管理、权限管理