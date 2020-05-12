import axios from 'axios'
import qs from 'qs'
import router from '../router'
import store from '../store'
import {clearLoginInfo} from '../utils'
import {
  Message,
  MessageBox
} from 'element-ui'

// 环境的切换
if (process.env.NODE_ENV === 'development') { // 开发环境
  axios.defaults.baseURL = '/api/'
} else if (process.env.NODE_ENV === 'testing') { // 测试环境
  axios.defaults.baseURL = ''
} else if (process.env.NODE_ENV === 'production') { // 生产环境
  axios.defaults.baseURL = 'http://localhost:8083/'
}

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true, // 允许服务器使用cookies
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})

// 请求拦截
axios.interceptors.request.use(config => {
  config.headers['token'] = store.state.token // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
axios.interceptors.response.use(response => {
  // 成功处理
  return response
}, error => {
  if (error && error.response) {
    switch (error.response.status) {
      case 401:
        MessageBox.confirm(
          '没有权限!',
          '温馨提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          router.push({path: '/login'})
        })
        break
      case 403:
        Message({
          message: error.message,
          type: 'error',
          duration: 2 * 1000,
          onClose: () => {
            clearLoginInfo()
            router.push({path: '/login'})
          }
        })
        break
      case 404:
        router.push({path: '/login'})
        break
      default:
        Message({
          message: error.message,
          type: 'error',
          duration: 2 * 1000
        })
    }
    return Promise.reject(error)
  }
})

// get请求
function get (url, params) {
  return new Promise((resolve, reject) => {
    http.get(url, {
      params: params
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

// post 请求
function post (url, params) {
  return new Promise((resolve, reject) => {
    http.post(url, qs.stringify(params))
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
export default {
  get: function (url, params) {
    return get(url, params)
  },
  post: function (url, params) {
    return post(url, params)
  }
}
