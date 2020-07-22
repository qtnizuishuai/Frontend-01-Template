module.exports = {
    entry: './main.js',
    devServer: {
      port:9999,
      open:true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                [
                  '@babel/plugin-transform-react-jsx',
                  {
                    pragma: "createElement"
                  }
                ]
              ]
            }
          }
        }
      ]
    },
    mode: 'development',
    optimization: {
      minimize: false
    }
  }