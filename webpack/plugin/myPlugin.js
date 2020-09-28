const chalk = require('chalk');
const address = require('address');
const ip = address.ip()
class MyPlugin {
    mode = process.env.NODE_ENV
    apply(compiler) {
        // compiling
        compiler.hooks.compile.tap('_startCompiling', () => {
            console.clear()
            console.log(chalk.blue('compiling...'));
        });

        //Executed when the compilation has completed
        compiler.hooks.done.tapAsync('_done', (
            stats, callback
        ) => {
            console.clear()
            if (stats.hasErrors()) {
                console.log(chalk.red('\ncompile failed!\n'));
                stats.compilation.errors.forEach(err => {
                    console.error(`${err.module ? err.module.resource : ""}\n${err.message}`)
                });

            } else if (stats.hasWarnings()) {
                console.log(chalk.green(`Project is running at http://${ip}:${process.env.port}`));
                console.log(chalk.yellow('\ncompiled with warning!\n'));
                stats.compilation.warnings.forEach(warning => {
                    console.warn(`${warning.module ? warning.module.resource : ''}\n${warning.message}`)
                });

            } else {
                console.log(chalk.green(`Project is running at http://${ip}:${process.env.port}`));
                console.log(chalk.green('compile successful!\n'));
            }
            callback()
        });
    }
}

module.exports = MyPlugin;