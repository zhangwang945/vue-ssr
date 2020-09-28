const merge = require('webpack-merge');
const path = require('path')
const MyPlugin = require('./plugin/myPlugin')
const baseConfig = require('./webpack.base');
const fomateEntry = require("./tool/fomateEntry");

const {
    entries,
    proxy,
    dllEntry,
    ...webpackConfig
} = require(path.resolve('webpack.config.js'))

module.exports = function() {
    const { entry, htmlPluginInstances } = fomateEntry(entries)

    return merge(baseConfig(), {
            mode: 'development',
            devtool: 'source-map',
            entry,
            devServer: {
                host: '0.0.0.0',
                port: 3000,
                open: true,
                contentBase: [path.resolve('src/public')],
                hot: true,
                noInfo: true,
                // clientLogLevel: 'warn',
                stats: 'none',
                // stats: 'minimal',
                overlay: true,
                useLocalIp: true,
                proxy
            },
            module: {
                
            },
            plugins: [
                ...htmlPluginInstances,
                new MyPlugin(),
            ]
        },
        webpackConfig
    )
}