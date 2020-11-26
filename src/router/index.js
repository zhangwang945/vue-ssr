// router.js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: process.env.IS_SSR ? 'history' : 'hash',
        routes: [{
                path: '/',
                component: () => import('pages/Root.vue')

            },
            {
                path: '/hellow',
                component: () => import('pages/Hellow.vue')
            }
        ]
    })
}