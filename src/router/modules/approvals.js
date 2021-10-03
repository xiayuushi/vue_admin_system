import Layout from '@/layout'

export default {
  path: '/approvals',
  component: Layout,
  meta: { flag: 'approvals' }, // 该字段值与权限路由permissionRoutes数组中的元素approvals对应 用于遍历
  children: [
    {
      path: '',
      name: 'Approvals',
      component: () => import('@/views/approvals/index'),
      meta: { title: '审批', icon: 'tree-table' }
    }
  ]
}
