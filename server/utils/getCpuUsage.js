/**
 * @description cpu使用率
 * @param {Number} timeStep 步长
 * @param {myCallback} cb 回调
 */
function getCpuUsage(timeStep, cb) {
    if (typeof timeStep !== 'number') throw 'first argument is not number'
    const os = require('os')

    function getCpuInfo() {
        let totalTime = 0,
            idleTime = 0
        os.cpus().forEach(item => {
            const { user, nice, sys, idle, irq } = item.times
            totalTime += user + nice + sys + idle + irq
            idleTime += idle
        })
        return { total: totalTime, idle: idleTime }
    }
    let preInfo = getCpuInfo()
    setInterval(() => {
        let cur = getCpuInfo()
        let totalD = cur.total - preInfo.total
        let usage = totalD - (cur.idle - preInfo.idle)
        let percent = (usage / totalD).toFixed(4)
        preInfo = cur
        cb(percent)
    }, timeStep)
}
/**
 * @callback myCallback
 * @param {String} percent cpu使用率(小数)
 */


module.exports = getCpuUsage