import request from '@/utils/request'

// 获取所有权限
export function sysPermission () {
  return request({
    url: '/sys/permission',
    addToken: true
  })
}

// 根据id删除权限
export function sysPermissionId (id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete',
    addToken: true
  })
}

// 添加权限
export function sysPermissionPost (data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data,
    addToken: true
  })
}

// 根据id更新权限详情
export function sysPermissionPut (data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data,
    addToken: true
  })
}
