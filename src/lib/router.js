import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home'
import Settings from '../pages/Settings'
import SelectArea from '../pages/SelectArea'
import PostProcess from '../pages/PostProcess'
import NotFound from '../components/NotFound'

Vue.use( Router )

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/settings',
            component: Settings
        },
        {
            path: '/select-area',
            component: SelectArea
        },
        {
            path: '/post-process',
            component: PostProcess
        },
        {
            path: '*',
            component: NotFound
        }
    ]
})
