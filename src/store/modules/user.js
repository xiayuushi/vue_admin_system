import { sysLogin, sysProfile, sysUserId } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'

const state = {
  userInfo: '',
  token: getToken() || ''
}

const mutations = {
  // 1、设置token （同时进行本地备份）
  mutationsfnSetToken (state, payload) {
    state.token = payload
    setToken(payload)
  },

  // 2、重置清空token（同时清理掉本地备份）
  mutationsfnRemoveToken (state) {
    state.token = ''
    removeToken()
  },

  // 3、设置用户信息
  mutationsfnSetUserInfo (state, payload) {
    state.userInfo = payload
  },

  // 4、删除token与用户信息userInfo
  mutationsfnDel () {
    this.commit('user/mutationsfnRemoveToken')
    this.commit('user/mutationsfnSetUserInfo', '')
  }
}

const actions = {
  async actionsfnLogin ({ commit }, v) {
    const res = await sysLogin(v) // 调用预先封装好的api 获取token
    localStorage.setItem('loginTime', Date.now()) // 记录时间做主动触发token失效
    commit('mutationsfnSetToken', res.data) // 将请求回来的数据替换修改原来state中的初始数据
  },

  async actionsfnGetUserInfo ({ commit }) {
    const res = await sysProfile()
    commit('mutationsfnSetUserInfo', res.data) // 获取用户信息用于验证token正确性
    const res2 = await sysUserId(res.data.userId) // 获取头像
    commit('mutationsfnSetUserInfo', Object.assign({}, res, res2)) // 对象合并 方式2
    // commit('mutationsfnSetUserInfo', { ...res, ...res2 }) // 对象合并 方式1
  }
}

const getters = {}

export default { namespaced: true, state, mutations, actions, getters }
