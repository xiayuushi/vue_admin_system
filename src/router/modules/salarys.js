import Layout from '@/layout'

export default {
  path: '/salarys',
  component: Layout,
  meta: { flag: 'salarys' }, // 该字段值与权限路由permissionRoutes数组中的元素salarys对应 用于遍历
  children: [
    {
      path: '',
      name: 'Salarys',
      component: () => import('@/views/salarys/index'),
      meta: { title: '工资', icon: 'money' }
    }
  ]
}
