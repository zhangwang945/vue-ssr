# 文档

## SPA

## 1、 npm run start

```
本地开发环境
```

## 2、npm run dll
 
 ```
 第三方依赖库生成dll文件：只需更新第三方库依赖时执行一次
 ```

 ## 3、npm run build

 ```
 构建生产包
 ```

 ## debug模式

 ```
 方便调试webpack相关的插件
 ./bin/mycli start --debug  
 或者
 ./bin/mycli build --debug
 ```
## webpack.config.js
```javascript
    publicPath:'/', //必填 远程的根目录路径
    proxy:{}, //代理配置
    dllEntry: {
        vuebase: ["vue", "vuex", "vue-router"]
    },
    entries: [
        {
            entryName: 'index',
            entryPath: path.resolve('src/index.js'),
            title: 'index1',
            template: 'src/index.html',
        },
        {
            entryName: 'index2',
            entryPath: path.resolve('src/index2.js'),
            title: 'index2',
            template: 'src/index.html',
        }
    ],
```
```
1、新增 dllEntry 提前打包项目共用的第三方依赖库（必填）
2、entries代替原有的entry字段  作为项目打包入口项（必填）数组的长度就是入口的数量
   entryName 入口的名称
   entryPath 入口文件
   其余字段与 HtmlWebpackPlugin 的参数一致
3、publicpath  必填 网络访问的静态文件根目录路径
4、proxy  代理转发配置
5、其余配置同webpack原有配置一致
```

## SSR
```
yarn ssr:dev  启动开发环境
yarn ssr:build 构建生产
yarn ssr:start 启动生产服务
```