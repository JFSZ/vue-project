// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import api from './api/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

/* Vue.config.productionTip = false */
Vue.prototype.$api = api
Vue.use(ElementUI)
// 阻止启动时在浏览器控制台打印生产消息
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // 使用Vuex
  components: { App },
  template: '<App/>'
})
