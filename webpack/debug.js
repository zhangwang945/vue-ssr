var program = require('commander')
var fs = require('fs')
var startup = require('../webpack/startup')
program.version('v1.0.0')
// 创建项目
program
    .command('create <appName>')
    .description('create project ')
    .action(function (appName, cmd) {
        require('../create')(appName, cmd)
    })
// 开启dev服务
program
    .command('start')
    .description('创建dev服务')
    .option('-p, --port <port>', 'Port used by the server (default: 3000)')
    .action(function (cmd) {
        startup('start', { port: cmd.port })
    })
// build构建
program
    .command('build')
    .description('构建')
    .option(' --profile', 'generate stats.json')
    .action(function (cmd) {   
        startup('build', {profile:cmd.profile})
    })
program
    .command('dll')
    .description('生成dll')
    .action(function (cmd) {
        startup('dll', {})
    })
program.parse(process.argv);



