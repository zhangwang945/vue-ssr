var path = require("path");
var webpack = require("webpack");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { dllEntry } = require(path.resolve('webpack.config.js'))

module.exports = function () {
    return {
        mode: "production",
        entry: dllEntry,//第三方库名称,
        output: {
            path: path.resolve("dll/dist"),
            filename: "dll.vendors.[hash:6].js",
            library: "[name][hash]"
        },
        stats: {
            entrypoints: false,
            chunks: false,
            children: false,
            modules: false
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.DllPlugin({
                path: path.resolve("dll/dist/dll-manifest.json"),
                name: "[name][hash]"
            })
        ]
    }
}