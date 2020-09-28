const express = require('express')
const path = require('path')
const LRU = require('lru-cache')
const app = express();
// const createApp = require('./app')
const { createBundleRenderer } = require('vue-server-renderer');
const setupDev = require('./setupDev')

const template = require('fs').readFileSync(path.resolve('src/ssr.template.html'), 'utf-8');

const isPro = process.env.NODE_ENV === 'production'
let renderer, dllPath

function createRenderer(serverBundle, clientManifest) {
    // 获取dllpath
    dllPath = clientManifest.all.find(file => /dll\.vendors.*\.js$/.test(file))
    if (dllPath) dllPath = clientManifest.publicPath + dllPath

    return createBundleRenderer(serverBundle, {
        inject: false,
        template,
        clientManifest
    })
}
if (isPro) {
    const serverBundle = require(path.resolve('dist/vue-ssr-server-bundle.json'))
    const clientManifest = require(path.resolve('dist/vue-ssr-client-manifest.json'))
    renderer = createRenderer(serverBundle, clientManifest)

} else {
    setupDev(app, (serverBundle, clientManifest) => {
        renderer = createRenderer(serverBundle, clientManifest)
    })
}

const microCache = new LRU({
    max: 100,
    maxAge: 1 * 1000 // 重要提示：条目在 1 秒后过期。
})


const context = {
    title: 'vue ssr',
    meta: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
    headSource() {
        let str = this.renderResourceHints()
        str.replace(RegExp('<link[\\s\\S]*?>'), '')
        str = `<link rel="preload" href="${dllPath}" as="script">` + str
        str += this.renderStyles()
        return str
    },
    scriptSource() {
        let str = `<script src="${dllPath}" defer=""></script>` + this.renderScripts()
        return str
    }
}

app.use(express.static('dist'))
app.get('*', (req, res) => {

    // 缓存是否命中
    const hit = microCache.get(req.url)
    if (hit) {
        return res.end(hit)
    }
    context.url = req.url
    renderer.renderToString(context, (err, html) => {
        if (err) {
            console.log(err);
            res.status(500).end('Internal Server Error')
            return;
        }
        res.end(html);
        // 缓存
        microCache.set(req.url, html)
        console.log('url:', req.url);
    });
})

app.listen(3000);