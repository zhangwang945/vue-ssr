const merge = require("webpack-merge");
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const os = require('os');
const {
    entries,
    dllEntry,
    proxy,
    ...webpackConfig
} = require(path.resolve('webpack.config.js'))

const isPro = process.env.NODE_ENV === 'production'
const isBuildServer = process.env.SSR === 'server'

function selectStyleLoader() {
    const arr = []
    if (!isPro) {
        arr.push('vue-style-loader')
    } else if (!isBuildServer) {
        arr.push(MiniCssExtractPlugin.loader)
    }
    return arr
}

module.exports = function() {
    return merge({
            mode: isPro ? "production" : 'development',
            output: {
                filename: `js/[name].[${isPro?'contenthash':'hash'}:6].js`,
                chunkFilename: `js/[name].[${isPro?'contenthash':'hash'}:6].js`,
                path: path.resolve('dist'),
                pathinfo: false
            },
            devtool: "source-map",

            module: {
                rules: [{
                        test: /\.(js|vue)$/,
                        exclude: /node_modules/,
                        enforce: 'pre',
                        loader: 'eslint-loader',
                        options: {
                            // emitError: true,
                            emitWarning: true,
                            failOnError: true,
                            // formatter: 'codeframe',
                            // quiet:true
                        }
                    },
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader'
                    },
                    {
                        test: /\.js$/,
                        exclude: file => (
                            /node_modules/.test(file) &&
                            !/\.vue\.js/.test(file)
                        ),
                        use: [{
                                loader: 'cache-loader'
                            },
                            {
                                loader: 'thread-loader',
                                options: {
                                    workers: os.cpus().length
                                }
                            },
                            {
                                loader: 'babel-loader',
                            }
                        ]
                    },
                    {
                        test: /\.(css|sass|scss)$/,
                        exclude: /node_modules/,
                        oneOf: [{
                                resourceQuery: /module/,
                                use: [
                                    ...selectStyleLoader(),
                                    {
                                        loader: 'css-loader',
                                        options: {
                                            modules: {
                                                // mode: 'local',
                                                localIdentName: '[name]__[local]--[hash:base64:5]',
                                                context: path.resolve('src'),
                                                // hashPrefix: 'my-custom-hash',
                                            },
                                        },
                                    },
                                    {
                                        loader: 'postcss-loader',
                                        options: {
                                            ident: 'postcss',
                                            plugins: [
                                                require('postcss-preset-env')(),
                                            ]
                                        }
                                    },
                                    {
                                        loader: 'sass-loader',
                                        options: {
                                            sassOptions: {
                                                includePaths: [path.resolve('src/style')]
                                            }
                                        }
                                    }
                                ],
                            },
                            {
                                use: [
                                    ...selectStyleLoader(),
                                    'css-loader',
                                    {
                                        loader: 'postcss-loader',
                                        options: {
                                            ident: 'postcss',
                                            plugins: [
                                                require('postcss-preset-env')(),
                                            ]
                                        }
                                    },
                                    {
                                        loader: 'sass-loader',
                                        options: {
                                            sassOptions: {
                                                includePaths: [path.resolve('src/style')]
                                            }
                                        }
                                    }
                                ],
                            }
                        ],

                    },
                    {
                        test: /\.css$/,
                        include: /node_modules/,
                        use: [
                            ...selectStyleLoader(),
                            'css-loader'
                        ]
                    },
                    {
                        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz|video)$/i,
                        use: [{
                            loader: 'url-loader',
                            options: {
                                name: '[name][contenthash:6].[ext]',
                                outputPath: 'assets',
                                publicPath: `${webpackConfig.output.publicPath}assets`,
                                limit: 8000,
                                esModule: false
                            },
                        }, ],
                    },
                ]
            },
            plugins: (function() {
                const plugins = [
                    new VueLoaderPlugin(),
                    new webpack.DefinePlugin({
                        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
                    }),
                ]
                isPro && !isBuildServer && plugins.push(new MiniCssExtractPlugin({
                    // Options similar to the same options in webpackOptions.output
                    // both options are optional
                    filename: "css/[name].[contenthash:6].css",
                    chunkFilename: "css/[name].[contenthash:6].css"
                }))
                return plugins
            })()
        },

    )
}