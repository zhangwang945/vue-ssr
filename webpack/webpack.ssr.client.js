const merge = require("webpack-merge");
const path = require('path')
const webpack = require('webpack')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const baseConfig = require('./webpack.base');
const formateEntry = require('./tool/fomateEntry');

const {
    entries,
    dllEntry,
    proxy,
    ...webpackConfig
} = require(path.resolve('webpack.config.js'))
const isPro = process.env.NODE_ENV === 'production'

module.exports = function() {
    const { entry, htmlPluginInstances } = formateEntry([{
        entryName: 'app',
        entryPath: path.resolve('src/entry-client.js'),
        title: 'Demo',
        template: 'src/spa.template.html',
        outPageName: 'spa.template.html'
    }, ])
    return merge(
        baseConfig(), {
            entry,
            stats: 'none',
            performance: {
                hints: 'warning',
                maxAssetSize: 1000000,
                maxEntrypointSize: 400000
            },
            optimization: {
                namedChunks: true,
                moduleIds: 'hashed',
                minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})], //css优化
                splitChunks: {
                    name: false,
                    maxInitialRequests: 5,
                    chunks: 'async',
                    cacheGroups: {
                        commons: {
                            name: 'commons',
                            test: /[\\/]node_modules[\\/]/,
                            minChunks: 2, //多入口引入的第三方包打包到commons
                            chunks: 'all',
                            enforce: true,
                            priority: -10
                        }
                    },
                },
                runtimeChunk: {
                    name: entrypoint => `runtime~${entrypoint.name}`
                },
            },
            module: {

            },
            plugins: (function() {
                const plugins = [
                    ...htmlPluginInstances,
                    new webpack.DllReferencePlugin({
                        manifest: require(path.resolve("dll/dist/dll-manifest.json")) // eslint-disable-line
                    }),

                    new AddAssetHtmlPlugin({
                        filepath: path.resolve('dll/dist/dll.*.js'),
                        outputPath: 'js',
                        publicPath: 'js'
                    }),
                    new VueSSRClientPlugin(),
                    new webpack.DefinePlugin({
                        'process.env.IS_SSR': JSON.stringify(true)
                    }),
                

                ]
                if (isPro) {
                    plugins.push(
                        new CleanWebpackPlugin(),
                        new CopyPlugin([{
                            from: 'src/public/',
                            to: './public'
                        }]),
                        new CompressionPlugin({
                            test: /\.(js|css)(\?.*)?$/i,
                            filename: '[path].gz[query]',
                            // threshold: 10240,
                            minRatio: 0.9,
                        }),
                    )
                } else {
                    plugins.push(new webpack.HotModuleReplacementPlugin())
                }
                return plugins
            })()
        },
        webpackConfig)
}