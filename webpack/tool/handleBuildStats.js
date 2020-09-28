const chalk = require('chalk');
const formatStats = require('./formatStats')
// 处理build stats信息
function handleBuildStats(callback) {
    return function(err, stats ) {
        if (err) {
            console.error(err)
        } else {
            if (stats.hasErrors()) {
                console.log(chalk.red.bold('\ncompile failed!\n'));
                stats.compilation.errors.forEach(err => {
                    console.error(`${err.message}\n`)
                });

            } else {
                console.log(chalk.green.bold(`Compiled successfully in ${stats.endTime - stats.startTime}ms\n`));
                formatStats(stats)
                if (stats.hasWarnings()) {
                    console.log(chalk.yellow.bold('\ncompiled with warning!\n'));
                    stats.compilation.warnings.forEach(warning => {
                        console.warn(chalk.yellow(`${warning.message}\n`))
                    });
                }
                if (typeof callback === 'function') callback(stats)
            }
        }
    }
}
module.exports = handleBuildStats