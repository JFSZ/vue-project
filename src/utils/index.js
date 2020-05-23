import store from '../store/index'
import router from '@/router'
/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

export function clearLoginInfo () {
  store.commit('token', '')
  router.options.isAddDynamicMenuRoutes = false
}
