const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  // 以上非自己定义
  token: state => state.user.token,
  userInfo: state => state.user.userInfo
}
export default getters
