import axios from 'axios'
import qs from 'qs'
import router from '../router'
import store from '../store'
import {clearLoginInfo} from '../utils'
import {
  Message,
  MessageBox
} from 'element-ui'

// 封装axios工具
function apiAxios (method, path, params, success, failure) {
  console.log('请求地址为:' + process.env.API_ROOT + path)
  axios({
    timeout: 1000 * 30,
    method: method,
    url: process.env.API_ROOT + path,
    data: Object.is(params, null) ? '' : qs.stringify(params),
    params: Object.is(params, null) ? '' : qs.stringify(params),
    withCredentials: true, // 允许服务器使用cookies
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  }).then(res => {
    console.log(res)
    let status = res.status
    let returnFlag = res.data.code
    if (Object.is(status, 200)) {
      if (returnFlag === 0) {
        // 请求成功
        success(res.data)
      } else if (returnFlag === 2) {
        MessageBox.confirm(
          '登录信息失效,请重新登录!',
          '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          router.push({path: '/login'})
        })
      } else if (returnFlag === 4) {
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
      } else {
        if (failure) {
          // 请求失败
          failure(res.data)
        }
      }
    } else if (Object.is(status, 404)) {
      // 处理404问题 路径不对,跳转到登陆页面
    } else if (Object.is(status, 405)) {
      // 处理405问题 路径不对
    } else if (Object.is(status, 501)) {
      // 处理501问题 服务器问题
    }
  })
    .catch((err) => {
      // 网络或者其他问题
      Message({
        message: err.message,
        type: 'error',
        duration: 5 * 1000
      })
    })
}
axios.interceptors.request.use(config => {
  config.headers['token'] = store.state.token // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    // 清除登录信息,然后重定向到登录页面
    clearLoginInfo()
    router.push({ path: '/login' })
  }
  return response
}, error => {
  return Promise.reject(error)
})
// 上传图片
function uploadImg (method, path, params, success, failure) {
  console.log('请求地址为:' + process.env.API_ROOT + path)
  axios({
    method: method,
    baseURL: process.env.API_ROOT,
    url: path,
    data: params,
    params: qs.stringify(params),
    withCredentials: true, // 允许服务器使用cookies
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(function (res) {
      let status = res.status
      let returnFlag = res.data.code
      if (Object.is(status, 200)) {
        if (returnFlag === 0) {
          // 请求成功
          success(res.data)
        } else if (returnFlag === 2) {
          MessageBox.confirm(
            '登录信息失效,请重新登录!',
            '确定登出', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }
          ).then(() => {
            router.push({path: '/login'})
          })
        } else {
          // 请求失败
          failure(res.data)
        }
      } else if (Object.is(status, 404)) {
        // 处理404问题 路径不对
      } else if (Object.is(status, 501)) {
        // 处理501问题 服务器问题
      }
    })
    .catch(() => {
      // 网络或者其他问题
      Message({
        message: '网络繁忙,请稍后重试...',
        type: 'error',
        duration: 5 * 1000
      })
    })
}

export default {
  get: function (path, params, success, failure) {
    return apiAxios('GET', path, params, success, failure)
  },
  post: function (path, params, success, failure) {
    return apiAxios('POST', path, params, success, failure)
  },
  uploadImg: function (path, params, success, failure) {
    return uploadImg('POST', path, params, success, failure)
  }
}
