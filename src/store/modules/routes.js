import router, { constantRoutes, permissionRoutes, resetRouter } from '@/router'

const state = {
  allRoutes: constantRoutes
}

const mutations = {
  setAllRoutes (state, payload) {
    state.allRoutes = payload
  },
  resetAllRoutes (state) {
    resetRouter()
    state.allRoutes = constantRoutes
  }
}

const actions = {
  // 动态添加路由
  // 该方法需要在合适的地方进行调用（通常是拿到用户信息第一时间进行调用，即本项目已经对登录信息进行处理的前置守卫中）
  dynamicAddUserRoutes (store) {
    // st1、服务器返回的用户可访问路由列表（获取当前用户的不需要权限与需要权限的所有路由）
    const userRolesMenus = store.rootGetters.userInfo.roles.menus

    // st2、匹配出当前用户需要权限的路由（为后续动态添加路由做准备）
    const userNeedPerRoutes = permissionRoutes.filter(item =>
      userRolesMenus.includes(item.meta.flag)
    )

    // st3、使用 router.addRoutes(需要权限的路由) --> 为用户动态添加需要权限的路由到路由配置列表
    // 坑点1：router.addRoutes()添加的路由不能立即使用 （解决方法：在获取用户登录信息的前置守卫内next(to.fullPath) ）
    // 坑点2：因为添加的路由不能立即使用，导致引起重定向到404的bug（解决方法：将路由匹配失败重定向到404的代码剪切到addRoutes方法内）
    router.addRoutes([
      ...userNeedPerRoutes,
      {
        path: '*',
        redirect: '/404',
        hidden: true
      }
    ])

    // st4、响应式更新用户的路由信息：（将默认的不需要权限的路由 以及 用户已经获得的需要权限的路由重新设置给vuex）
    store.commit('setAllRoutes', [...constantRoutes, ...userNeedPerRoutes])
  }
}

const getters = {}

export default { namespaced: true, state, mutations, actions, getters }
