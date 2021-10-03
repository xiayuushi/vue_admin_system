import router from './router'
import store from './store'
import { PageCancelToken } from '@/utils/request'
const whiteList = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  // 页面切换时，取消之前页面的请求操作
  PageCancelToken()

  if (!store.getters.token) {
    whiteList.includes(to.path.toLowerCase())
      ? next()
      : next('/login?xxx=' + encodeURIComponent(to.fullPath))
  } else {
    if (to.path.toLowerCase() === '/login') {
      next('/')
    } else {
      if (store.getters.userInfo.userId) {
        next()
      } else {
        await store.dispatch('user/actionsfnGetUserInfo')
        // 有用户信息后，根据服务器返回的用户已有的权限 去动态加载需要权限的页面
        await store.dispatch('routes/dynamicAddUserRoutes')
        // 坑点1：router.addRoutes()添加的路由不能立即生效
        // 解决方法：将next()改成next(to.fullPath)
        next(to.fullPath)
      }
    }
  }
})
// 没有token，去不做限制的页面可以直接通行
// 没有token，去登录页面时携带参数（使用加密转换避免出现中文字符出错的情况）

// 有token，去登录页面直接跳转到首页，去其他页面则先判断是否有用户信息（验证token正确性）再通行
// 有token，有用户id（说明token是正确合法的，非伪造的） 可以直接通行
// 有token，没有用户id（说明token可能是伪造的）调用定义在vuex中的接口去获取用户信息再次验证token是否是正确的 验证通过再通行
router.afterEach((to, from) => {})
