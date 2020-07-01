import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getter.js'
import common from './modules/common'
import user from './modules/user'
Vue.use(Vuex)
const store = new Vuex.Store({
  // 模块化状态管理
  modules: {
    common,
    user
  },
  // 存放状态
  state: {
    token: ''
  },
  // state成员操作
  mutations: {
    setToken: (state, token) => {
      state.token = token
      localStorage.token = token
    }
  },
  // 异步操作
  actions: {

  },
  // 加工state成员给外界
  getters
})
export default store
