import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getter.js'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {

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
    }
  },
  actions: {
    getToken ({ commit }, token) {
      commit('SET_TOKEN', token)
    },
    getUserInfo ({commit}, userInfo) {
      commit('SET_USER_INFO', userInfo)
    }
  },
  getters
})
export default store
