import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _import = file => require('@/views/' + file + '.vue')
const globalRoutes = [
  {path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' }}
]

const router = new Router({
  model: 'hash',

})
export default router
