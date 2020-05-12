import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getter.js'
import common from './modules/common'
import user from './modules/user'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    common,
    user
  },
  state: {
    token: '',
    userInfo: ''
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    DEL_TOKEN: (state) => {
      state.token = ''
    },
    DEL_USER_INFO: (state) => {
      state.userInfo = ''
    }
  },
  actions: {
    getToken ({ commit }, token) {
      commit('SET_TOKEN', token)
    },
    getUserInfo ({commit}, userInfo) {
      commit('SET_USER_INFO', userInfo)
    },
    delToken ({commit}) {
      commit('DEL_TOKEN')
    },
    delUserInfo ({commit}) {
      commit('DEL_USER_INFO')
    }
  },
  getters
})
export default store
