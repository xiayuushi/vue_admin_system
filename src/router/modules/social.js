import Layout from '@/layout'

export default {
  path: '/social',
  component: Layout,
  meta: { flag: 'social' }, // 该字段值与权限路由permissionRoutes数组中的元素social对应 用于遍历
  children: [
    {
      path: '',
      name: 'Social',
      component: () => import('@/views/social/index'),
      meta: { title: '社保', icon: 'table' }
    }
  ]
}
