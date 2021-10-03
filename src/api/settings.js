import request from '@/utils/request'

// 获取员工列表
export function sysRole (params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params,
    addToken: true
  })
}

// 添加角色
export function sysRolePost (data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data,
    addToken: true
  })
}

// 根据id删除角色
export function sysRoleIdDelete (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete',
    addToken: true
  })
}

// 根据id获取角色详情
export function sysRoleId (id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get',
    addToken: true
  })
}

// 编辑更新角色、更新角色权限
export function sysRoleEditUpdate (data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data,
    addToken: true
  })
}

// 根据id查询企业
export function getCompany (id) {
  return request({
    url: `/company/${id}`,
    method: 'get',
    addToken: true
  })
}
