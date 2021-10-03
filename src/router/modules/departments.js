import Layout from '@/layout'

export default {
  path: '/departments',
  component: Layout, // 必须设置component: Layout， 否则不会被嵌套进layout组件中成为layout的子级组件
  meta: { flag: 'departments' }, // 该字段值与权限路由permissionRoutes数组中的元素departments对应 用于遍历
  children: [
    {
      path: '',
      name: 'Departments',
      component: () => import('@/views/departments/index'),
      meta: { title: '部门', icon: 'el-icon-menu' } // icon可以直接添加当前项目icons/svg目录下的名称或者element-ui的icon类名（不要带"."）
    }
  ]
}
