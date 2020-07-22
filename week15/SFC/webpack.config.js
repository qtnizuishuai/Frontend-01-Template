// const path = require("path");

module.exports = {
    entry: "./main.js",
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            [
                                "@babel/plugin-transform-react-jsx",
                                {
                                    pragma: "createElement"
                                },
                            ],
                        ],
                    },
                },
            },
            {
                test: /\.view$/,
                use: {
                    loader: require.resolve("./myloader.js")
                }
            }
        ],
    },
    mode: "development",
    optimization: {
        minimize: false,
    },
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        // compress:true,
        hot: true,
        port: "8000",
        inline: true,
        open: true,
        overlay: true,
        proxy: {
            "/api": {
                target: "",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": "",
                },
            },
        },
    },
};