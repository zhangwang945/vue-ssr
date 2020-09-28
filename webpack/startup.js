const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')
const chalk = require('chalk');
const detectPort = require('./tool/detectPort')
const formatStats = require('./tool/formatStats')
const fs = require('fs')
const path = require('path');
const {
    error
} = require('console');

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
        console.log(99, process.env.NODE_ENV);
        // process.env.NODE_ENV = 'production'
        let webpackProdConfig
        if (option.client) {
            webpackProdConfig = require('./webpack.ssr.client')
        } else if (option.server) {
            process.env.BUILD_BUNDLE = 'server'
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
                if (stats.hasErrors()) {
                    console.log(chalk.red.bold('\ncompile failed!\n'));
                    stats.compilation.errors.forEach(err => {
                        console.error(`${err.message}\n`)
                    });

                } else {
                    console.log(chalk.green.bold(`Compiled successfully in ${stats.endTime - stats.startTime}ms\n`));
                    console.log(`${chalk.cyan.bold('Assets Root Directory: ')}${config.output.path}\n`);

                    formatStats(stats)
                    if (stats.hasWarnings()) {
                        console.log(chalk.yellow.bold('\ncompiled with warning!\n'));
                        stats.compilation.warnings.forEach(warning => {
                            console.warn(chalk.yellow(`${warning.message}\n`))
                        });
                    }
                    option.profile && fs.writeFileSync(path.resolve('stats.json'), JSON.stringify(stats.toJson()));
                }
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
                if (stats.hasErrors()) {
                    console.log(chalk.red.bold('\ncompile failed!\n'));
                    stats.compilation.errors.forEach(err => {
                        console.error(`${err.message}\n`)
                    });

                } else {
                    console.log(chalk.green.bold(`Compiled successfully in ${stats.endTime - stats.startTime}ms\n`));
                    console.log(`${chalk.cyan.bold('Assets Root Directory: ')}${config.output.path}\n`);

                    formatStats(stats)
                    if (stats.hasWarnings()) {
                        console.log(chalk.yellow.bold('\ncompiled with warning!\n'));
                        stats.compilation.warnings.forEach(warning => {
                            console.warn(chalk.yellow(`${warning.message}\n`))
                        });
                    }
                }
            }
        })
    }

}