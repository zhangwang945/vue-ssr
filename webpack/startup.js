const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const chalk = require('chalk');
const detectPort = require('./tool/detectPort')
const handleBuildStats = require('./tool/handleBuildStats')
const fs = require('fs')
const path = require('path');

module.exports = function(action, option) {
    if (action === 'start') {
        process.env.NODE_ENV = 'development'

        const webpackDevConfig = require('./webpack.dev')

        const config = webpackDevConfig()
        const compiler = webpack(config)
        const devServerOption = config.devServer
        let port = option.port || devServerOption.port

        detectPort(port)
            .then(port => {
                process.env.port = devServerOption.port = port
                const server = new webpackDevServer(compiler, devServerOption)
                server.listen(port, devServerOption.host || '0.0.0.0', () => {});
            })

    } else if (action === 'build') {
        // process.env.NODE_ENV = 'production'
        let webpackProdConfig
        if (option.client) {
            process.env.SSR = 'client'
            webpackProdConfig = require('./webpack.ssr.client')
        } else if (option.server) {
            process.env.SSR = 'server'
            webpackProdConfig = require('./webpack.ssr.server')
        } else {
            webpackProdConfig = require('./webpack.prod')
        }

        const config = webpackProdConfig()
        const compiler = webpack(config)
        compiler.run((err, stats) => {
            if (err) {
                console.error(err)
            } else {
                handleBuildStats(config, stats, () => {
                    option.profile && fs.writeFileSync(path.resolve('stats.json'), JSON.stringify(stats.toJson()));
                })
            }
        })

    } else if (action === 'dll') {
        const webpackDllConfig = require('./webpack.dll')

        const config = webpackDllConfig()
        const compiler = webpack(config)
        compiler.run((err, stats) => {
            if (err) {
                console.error(err)
            } else {
                handleBuildStats(config, stats)
            }
        })
    }

}