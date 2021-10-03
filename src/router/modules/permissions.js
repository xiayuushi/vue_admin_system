import Layout from '@/layout'

export default {
  path: '/permissions',
  component: Layout,
  meta: { flag: 'permissions' }, // 该字段值与权限路由permissionRoutes数组中的元素permission对应 用于遍历
  children: [
    {
      path: '',
      component: () => import('@/views/permissions'),
      meta: { title: '权限', icon: 'el-icon-s-promotion' }
    }
  ]
}
