import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

import departments from './modules/departments'
import employees from './modules/employees'
import settings from './modules/settings'
import permissions from './modules/permissions'
import social from './modules/social'
import salarys from './modules/salarys'
import attendances from './modules/attendances'
import approvals from './modules/approvals'

Vue.use(Router)

// D1、不需要权限访问的路由
export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      // 此处children配置的路由会显示到侧边菜单栏中（当数量2个以上时就会显示二级菜单导航,且hidden不为true时）
      // 如果子路由只有一个的情况下，也只会显示到侧边栏菜单
      // 如果有子级路由（chilren属性）就会在首页layout侧边栏生成二级菜单
      // 之所以这样是因为在sidebarItem组件中进行了逻辑封装
      {
        path: '/xxx',
        name: 'Xxx',
        hidden: true, // 设置为hidden属性，当其值为true时，不会将该路由对应的组件显示到首页侧边栏菜单中
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' } // meta对象就是设置侧边栏标题及图标的
      }
    ]
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true // hidden是人为添加的自定义属性 只要在路由配置中设置hidden:true该路由对应组件就不会出现在侧边栏
  },

  {
    path: '/index',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/404')
  }

  // { path: '*', redirect: '/404', hidden: true } // 重定向到404的页面必须放到最底部
  // 坑点2：router.addRoutes()首次配置不生效时导致的重定向到404
  // 解决坑点2：将该代码剪切到 router.addRoutes() 内部
]

// D2、需要权限访问的路由
// path的设置必须与角色标识一致才会在菜单栏显示对应的路由组件页面
export const permissionRoutes = [
  departments,
  employees,
  settings,
  permissions,
  social,
  salarys,
  attendances,
  approvals
]

// 路由实例化对象
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    // 默认只加载不需要权限的路由，后续会根据用户信息使用router.addRoutes()加载需要权限的路由
    routes: [...constantRoutes]
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
