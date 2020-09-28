const merge = require("webpack-merge");
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const baseConfig = require('./webpack.base');
const formateEntry = require('./tool/fomateEntry')

const {
    entries,
    publicPath,
    dllEntry,
    proxy,
    ...webpackConfig
} = require(path.resolve('webpack.config.js'))
module.exports = function() {
    const { entry, htmlPluginInstances } = formateEntry([{
        entryName: 'index',
        entryPath: path.resolve('src/entry-server.js'),
        title: 'Demo',
        template: 'src/index.html',
        outPageName: 'ssr.template.html'
    }, ])
    return merge({
            entry,

            // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
            // 并且还会在编译 Vue 组件时，
            // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
            target: 'node',

            // 对 bundle renderer 提供 source map 支持
            // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
            output: {
                libraryTarget: 'commonjs2'
            },

            // https://webpack.js.org/configuration/externals/#function
            // https://github.com/liady/webpack-node-externals
            // 外置化应用程序依赖模块。可以使服务器构建速度更快，
            // 并生成较小的 bundle 文件。
            externals: nodeExternals({
                // 不要外置化 webpack 需要处理的依赖模块。
                // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
                // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
                allowlist: [/\.css$/, /.scss$/]
            }),
            // 这是将服务器的整个输出
            // 构建为单个 JSON 文件的插件。
            // 默认文件名为 `vue-ssr-server-bundle.json`
            module: {
              
            },
            plugins: [
                ...htmlPluginInstances,
                new VueSSRServerPlugin()
            ]
        },
        baseConfig(),
        webpackConfig)
}