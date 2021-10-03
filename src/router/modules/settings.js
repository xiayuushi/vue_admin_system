import Layout from '@/layout'

export default {
  path: '/settings',
  component: Layout,
  meta: { flag: 'settings' }, // 该字段值与权限路由permissionRoutes数组中的元素setting对应 用于遍历
  children: [
    {
      path: '',
      name: 'Settings',
      component: () => import('@/views/settings/index'),
      meta: { title: '角色', icon: 'el-icon-setting' }
    }
  ]
}
