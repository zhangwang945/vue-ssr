const net = require('net')

function detectPort(port) {
    const server = net.createServer().listen(port, '0.0.0.0')
    return new Promise((resolve, reject) => {
        server.on('listening', () => {
            server.close()
            resolve(port)
        })

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(detectPort(port + 1))//注意这句，如占用端口号+1
            } else {
                reject(err)
            }
        })
    })
}

module.exports = detectPort