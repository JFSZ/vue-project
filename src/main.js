// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import api from './api/index'
import ElementUI from 'element-ui'
import '@/icons'
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import 'element-ui/lib/theme-chalk/index.css'
import { isAuth } from './utils'

/* Vue.config.productionTip = false */
Vue.prototype.$api = api
Vue.use(ElementUI)
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 阻止启动时在浏览器控制台打印生产消息
Vue.config.productionTip = false
Vue.prototype.isAuth = isAuth // 权限方法
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // 使用Vuex
  components: { App },
  template: '<App/>'
})
