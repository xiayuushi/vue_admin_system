import request from '@/utils/request'

// 获取员工列表
export function sysRole (params) {
  return request({
    url: '/sys/role',
    method: 'get',
    addToken: true,
    params
  })
}

// 添加角色
export function sysRoleAdd (data) {
  return request({
    url: '/sys/role',
    method: 'post',
    addToken: true,
    data
  })
}

// 删除角色
export function sysRoleDel (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete',
    addToken: true
  })
}

// 根据id获取角色详情
export function sysRoleGet (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get',
    addToken: true
  })
}

// 编辑更新角色
export function sysRoleEditUpdate (data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data,
    addToken: true
  })
}
