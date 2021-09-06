import { sysLogin, sysProfile, sysUser } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
const state = {
  // 本地有则读取本地缓存，否则取空值
  token: getToken() || '',
  userInfo: ''
}
const mutations = {
  // 1、设置token
  mutationsfnSetToken (state, payload) {
    state.token = payload
    // 同时进行本地备份
    setToken(payload)
  },

  // 2、重置清空token
  mutationsfnRemoveToken (state) {
    state.token = ''
    // 清理掉本地备份
    removeToken()
  },
  // 3、设置用户信息
  mutationsfnSetUserInfo (state, payload) {
    state.userInfo = payload
  },
  // 4、同时删除token与用户信息userInfo
  mutationsfnDel () {
    this.commit('user/mutationsfnRemoveToken')
    this.commit('user/mutationsfnSetUserInfo', '')
  }
}
const actions = {
  async actionsfnLogin ({ commit }, v) {
    // 调用预先封装好的api 获取token
    const res = await sysLogin(v)
    // 记录时间做主动触发token失效
    localStorage.setItem('loginTime', Date.now())
    // 将请求回来的数据替换修改原来state中的初始数据
    commit('mutationsfnSetToken', res.data.data)
    // console.log(res)
  },
  async actionsfnGetUserInfo ({ commit }) {
    // 获取用户信息用于验证token正确性
    const res = await sysProfile()
    commit('mutationsfnSetUserInfo', res)
    // 获取完用户信息后再调用另一个有头像的接口获取头像
    const res2 = await sysUser(res.data.data.userId)
    // 将两个请求的数据合并到state.userInfo中 方式1
    // commit('mutationsfnSetUserInfo', { ...res, ...res2 })
    // 将两个请求的数据合并到state.userInfo中 方式2
    commit('mutationsfnSetUserInfo', Object.assign({}, res, res2))
  }
}
const getters = {}

export default { namespaced: true, state, mutations, actions, getters }
