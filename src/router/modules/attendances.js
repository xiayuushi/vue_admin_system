import Layout from '@/layout'

export default {
  path: '/attendances',
  component: Layout,
  meta: { flag: 'attendances' }, // 该字段值与权限路由permissionRoutes数组中的元素attendances对应 用于遍历
  children: [
    {
      path: '',
      name: 'Attendances',
      component: () => import('@/views/attendances/index'),
      meta: { title: '考勤', icon: 'skill' }
    }
  ]
}
