const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(entries) {
    const entry = entries.reduce(
        (entry, item) => {
            entry[item.entryName] = item.entryPath
            return entry
        }, {}
    )
    // htmlWebpack
    const htmlPluginInstances = entries.reduce(
        (arr, item) => {
            arr.push(
                new HtmlWebpackPlugin({
                    filename: item.outPageName || `${item.entryName}.html`,
                    title: item.title,
                    template: item.template,
                    chunks: ['vendors', `commons`, `runtime~${item.entryName}`, item.entryName]
                })
            )
            return arr
        }, []
    )
    return {
        entry,
        htmlPluginInstances
    }
}