import Layout from '@/layout'

export default {
  path: '/employees',
  component: Layout,
  meta: { flag: 'employees' }, // 该字段值与权限路由permissionRoutes数组中的元素employees对应 用于遍历
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
}
