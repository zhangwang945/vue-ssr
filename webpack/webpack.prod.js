const merge = require("webpack-merge");
const path = require('path')
const webpack = require('webpack')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const {
    entries,
    dllEntry,
    proxy,
    ...webpackConfig
} = require(path.resolve('webpack.config.js'))
const baseConfig = require('./webpack.base')
const formateEntry = require('./tool/fomateEntry')
const minChunksNum = Math.ceil((entries.length + 1) / 2)
module.exports = function() {
    const { entry, htmlPluginInstances } = formateEntry(entries)
    return merge(
        baseConfig(), {
            mode: "production",
            entry,
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
                            minChunks: minChunksNum > 1 ? minChunksNum : 2, //多入口引入的第三方包打包到commons
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
            module: {},
            plugins: [
                new CleanWebpackPlugin(),
                ...htmlPluginInstances,
                // new MiniCssExtractPlugin({
                //     // Options similar to the same options in webpackOptions.output
                //     // both options are optional
                //     filename: "css/[name].[contenthash:6].css",
                //     chunkFilename: "css/[name].[contenthash:6].css"
                // }),
                new webpack.DllReferencePlugin({
                    manifest: require(path.resolve("dll/dist/dll-manifest.json")) // eslint-disable-line
                }),

                new AddAssetHtmlPlugin({
                    filepath: path.resolve('dll/dist/dll.*.js'),
                    outputPath: 'js',
                    publicPath: 'js'
                }),
                new CopyPlugin([{
                    from: 'src/public/',
                    to: './public'
                }]),
                new ManifestPlugin(),
                new CompressionPlugin({
                    test: /\.(js|css)(\?.*)?$/i,
                    filename: '[path].gz[query]',
                    // threshold: 10240,
                    minRatio: 0.9,
                }),
            ]
        },

        webpackConfig
    )
}