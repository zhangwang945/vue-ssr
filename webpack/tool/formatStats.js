//stats信息格式化
module.exports = function fomatStats(stats) {
    const fs = require('fs')
    const path = require('path')
    const ui = require('cliui')({ width: 100 })
    const chalk = require('chalk');
    function makeRow(a, b, c) {
        return `  ${a}\t  ${b}\t  ${c}`
    }
    const assets = stats.toJson().assets
    const HTML = 'html', JS = 'js', CSS = 'css', OTHER = 'other'
    const cacheObj = {
        [HTML]: {},
        [JS]: {},
        [CSS]: {},
        [OTHER]: {}
    }
    const isJs = /.*\.js$/,
        isCss = /.*\.css$/,
        isGzip = /.*\.gz$/,
        isMap = /.*\.map$/,
        isHtml = /.*\.html$/

    assets.forEach(item => {
        // debugger
        let name = `${item.name}`
        if (!isMap.test(name)) {
            const flag = isGzip.test(name)
            let typeKey
            // debugger
            if (flag) {
                name = name.slice(0, -3)
                typeKey = 'Gzipped'
            } else {
                typeKey = 'Size'
            }
            let key
            if (isHtml.test(name)) {
                key = HTML
            } else if (isJs.test(name)) {
                key = JS
            } else if (isCss.test(name)) {
                key = CSS
            } else {
                key = OTHER
            }
            if (!cacheObj[key][name]) {
                cacheObj[key][name] = { name }
            }
            const obj = cacheObj[key][name]

            obj[typeKey] = item.size >= 1000 ? `${(item.size / 1000).toFixed(2)} KiB` : `${item.size} B`

        }
    });
    const jsObj = cacheObj[JS], cssObj = cacheObj[CSS], otherObj = cacheObj[OTHER]
    ui.div(
        makeRow(
            chalk.cyan.bold('File'),
            chalk.cyan.bold('Size'),
            chalk.cyan.bold('Gzipped')
        ) + '\n\n' +
        Object.keys(jsObj).sort().map(fileName => {
            const cur = jsObj[fileName]
            return makeRow(
                chalk.green(cur.name),
                chalk.white(cur.Size || '--'),
                chalk.white(cur.Gzipped || '--')
            )
        }).join('\n') + '\n' +
        Object.keys(cssObj).sort().map(fileName => {
            const cur = cssObj[fileName]
            return makeRow(
                chalk.blue(cur.name),
                chalk.white(cur.Size || '--'),
                chalk.white(cur.Gzipped || '--')
            )
        }).join('\n')
    )
    console.log(ui.toString());
}