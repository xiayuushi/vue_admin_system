import router from './router'
import store from './store'

import { PageCancelToken } from '@/utils/request'

const whiteList = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  PageCancelToken()
  if (!store.getters.token) {
    // 没有token，去不做限制的页面可以直接通行,否则必须登录
    if (whiteList.includes(to.path.toLowerCase())) {
      next()
    } else {
      // 没有token，去登录页面时携带参数（使用加密转换避免出现中文字符出错的情况）
      // console.log(to)
      next('/login?xxx=' + encodeURIComponent(to.fullPath))
    }
  } else {
    // 有token，去登录页面直接跳转到首页
    // 有token，去其他页面则先判断是否有用户信息（验证token正确性）再通行
    if (to.path.toLowerCase() === '/login') {
      next('/')
    } else {
      // 有用户id（说明token是正确合法的，非伪造的） 可以直接通行
      if (store.getters.userInfo.userId) {
        next()
      } else {
        // 没有用户id（说明token可能是伪造的）调用定义在vuex中的接口去获取用户信息再次验证token是否是正确的
        await store.dispatch('user/actionsfnGetUserInfo')
        next()
      }
    }
  }
})

router.afterEach((to, from) => {})
