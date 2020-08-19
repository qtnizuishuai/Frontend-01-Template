var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
      }
      collecting() {
        this.log('method 1 just ran');

      }

      creating() {
        //   this.npmInit()
         this.fs.copyTpl(
            this.templatePath('package.json'),
            this.destinationPath('package.json'),
            { title: 'Templating with Yeoman' }
          );
          this.fs.copyTpl(
            this.templatePath('createElement.js'),
            this.destinationPath('lib/createElement.js')
          );
          this.fs.copyTpl(
            this.templatePath('gesture.js'),
            this.destinationPath('lib/gesture.js')
          );
          this.fs.copyTpl(
            this.templatePath('Carousel.js'),
            this.destinationPath('lib/Carousel.js')
          );
          this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/main.js')
          );
          this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('index.html'),
            { title: 'Templating with Yeoman' }
          );
          this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js')
          );
        this.npmInstall([
            'webpack',
            'webpack-cli',
            'webpack-dev-server',
            'babel-loader',
            '@babel/core',
            '@babel/preset-env',
            '@babel/plugin-transform-react-jsx',
            'mocha',
            'nyc',
            '@istanbuljs/nyc-config-babel',
            'babel-plugin-istanbul'
    ], { 'save-dev': true });
       
      }
    };