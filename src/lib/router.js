import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home'
import SelectArea from '../pages/SelectArea'
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
          path: '/select-area',
          component: SelectArea
      },
      {
          path: '*',
          component: NotFound
      }
  ]
})
