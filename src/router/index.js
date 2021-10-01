import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

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
    path: '/departments',
    // 必须设置component: Layout
    // 否则不会被嵌套进layout组件中成为layout的子级组件
    component: Layout,
    children: [
      {
        path: '',
        name: 'Departments',
        component: () => import('@/views/departments/index'),
        // icon可以直接添加element-ui的icon类名（无锡带"."）
        meta: { title: '组织架构', icon: 'el-icon-menu' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Setting',
        component: () => import('@/views/setting/index'),
        meta: { title: '公司设置', icon: 'el-icon-setting' }
      }
    ]
  },
  {
    path: '/employees',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/employees/index'),
        meta: { title: '员工', icon: 'el-icon-s-custom' }
      },
      {
        hidden: true,
        path: '/excel',
        component: () => import('@/views/employees/components/excel')
      },
      {
        hidden: true,
        path: '/detail/:id?',
        component: () => import('@/views/employees/components/detail')
      },
      {
        hidden: true,
        path: '/print',
        component: () => import('@/views/employees/components/print')
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/permission'),
        meta: { title: '权限', icon: 'el-icon-s-promotion' }
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
