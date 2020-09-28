import App from './App.vue'
import Vue from 'vue'
import VueRouter from 'vue-router'

import el from 'element-ui/lib/element-ui.common'
import 'element-ui/lib/theme-chalk/index.css';

import './style/global.scss'

Vue.use(VueRouter)
Vue.use(el)
const routes = [
    { path: '/hellow', component: () => import(/* webpackChunkName:"Hellow" */'./pages/Hellow.vue') },
]
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})
new Vue({
    el: '#app',
    router,
    render: h => h(App),
    // components: { App }
})
if (process.env.NODE_ENV !== 'production') {
    console.log('Looks like we are in development mode!');
}
// if (module.hot) {
//     module.hot.accept('./print.js', function () {
//         console.log('Accepting the updated printMe module!');
//         // printMe();
//     })
// }