const path = require('path')
const chalk = require('chalk');

function setupDev(app, callback) {
    const MemoryFileSystem = require("memory-fs");
    const webpack = require('webpack');
    const address = require('address');
    const ip = address.ip()

    let serverBundle, clientManifest

    function compilingLog() {
        console.clear()
        console.log(chalk.blue('client compiling...'));
    }

    function update() {
        if (serverBundle && clientManifest) {
            callback(serverBundle, clientManifest)
        }
    }
    // clienManifest
    const clientWebpackConfig = require('../webpack/webpack.ssr.client')()
    const entryName = Object.keys(clientWebpackConfig.entry)[0]
    clientWebpackConfig.entry[entryName] = ['webpack-hot-middleware/client', clientWebpackConfig.entry[entryName]]
    const clientCompiler = webpack(clientWebpackConfig);
    const clientFs = new MemoryFileSystem()
    const devMiddleware = require('webpack-dev-middleware')(clientCompiler, {
        publicPath: clientWebpackConfig.output.publicPath,
        logLevel: 'silent',
        fs: clientFs
    })
    const handleBuildStats = require('../webpack/tool/handleBuildStats')
    clientCompiler.hooks.done.tap('getClientManifest', stats => {
        const clientManifestStr = clientFs.readFileSync(path.join(clientWebpackConfig.output.path, 'vue-ssr-client-manifest.json'), 'utf-8')
        clientManifest = JSON.parse(clientManifestStr)
        update()
        handleBuildStats(clientWebpackConfig, stats, () => {
            console.log(chalk.green(`Project is running at http://localhost:${process.env.port}
                      http://${ip}:${process.env.port}\n`));
        })
    })

    clientCompiler.hooks.watchRun.tap('watchClientRun', () => {
        compilingLog()
    })

    app.use(devMiddleware)
    app.use(require('webpack-hot-middleware')(clientCompiler, { heartbeat: 5000, log: false, }))

    // serverbundle
    const serverWebpackConfig = require('../webpack/webpack.ssr.server')()
    const serverFs = new MemoryFileSystem()
    const serverCompiler = webpack(serverWebpackConfig);
    serverCompiler.outputFileSystem = serverFs
    serverCompiler.watch({}, stats => {
        const serverBundleStr = serverFs.readFileSync(path.join(serverWebpackConfig.output.path, 'vue-ssr-server-bundle.json'), 'utf-8')
        serverBundle = JSON.parse(serverBundleStr)
        update()
    })
}

module.exports = setupDev