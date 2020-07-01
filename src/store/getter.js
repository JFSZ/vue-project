const getters = {
  token: state => state.token,
  userInfo: state => state.userInfo,
  getToken: state => {
    if (!state.token) {
      state.token = localStorage.getItem('token')
    }
    return state.token
  }
}
export default getters
