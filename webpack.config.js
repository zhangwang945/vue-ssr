const webpack = require('webpack')
const path = require('path')

module.exports = {
    // publicPath: '/', //远程根目录的路径
    proxy: {
        '/api': 'http://cftx.hcqh.net'
    },
    dllEntry: {
        vuebase: ["vue", "vuex", "vue-router", 'element-ui']
    },
    entries: [{
        entryName: 'index',
        entryPath: path.resolve('src/entry-client.js'),
        title: 'Demo',
        template: 'src/spa.template.html',
    }, ],
    output: {
        publicPath:'/'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            module: path.resolve('src/module/'),
            assets: path.resolve('src/assets'),
            pages: path.resolve('src/pages'),
            store: path.resolve('src/store'),
            router: path.resolve('src/router'),
        }
    },
    plugins: [

    ]
}