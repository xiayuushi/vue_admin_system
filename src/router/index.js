import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    // hidden是人为添加的自定义属性
    // 当其值为true时，不会将该路由对应的组件显示到首页侧边栏菜单中
    // 总之，只要在路由配置中设置hidden:true该路由对应组件就不会出现在侧边栏
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404')
    // meta: { title: '404', icon: 'el-icon-error' }
    // hidden: true
  },
  // 如果有子级路由就会在首页layout侧边栏生成二级菜单
  // 之所以这样是因为在sidebarItem组件中进行了逻辑封装
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    // meta对象就是设置侧边栏标题及图标的
    // meta: { title: '测试侧边菜单栏标题', icon: 'dashboard' },
    children: [
      // 此处children配置的路由会显示到侧边菜单栏中（当数量2个以上时就会显示二级菜单导航,且hidden不为true时）
      // 如果子路由只有一个的情况下，也只会显示到侧边栏菜单
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      },
      {
        // 设置为hidden: true就不会显示
        hidden: true,
        path: '/xxx',
        name: 'Xxx',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/test',
    // 必须设置component: Layout
    // 否则不会被嵌套进layout组件中成为layout的子级组件
    component: Layout,
    children: [
      {
        path: '',
        name: 'Test',
        component: () => import('@/views/dashboard/test'),
        // icon可以直接添加element-ui的icon类名（无锡带"."）
        meta: { title: 'Test', icon: 'dashboard' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
