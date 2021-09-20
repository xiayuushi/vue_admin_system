import request from '@/utils/request'

// 获取员工列表
export function sysUser (params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params,
    addToken: true
  })
}

// 删除员工
export function sysUserDel (id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete',
    addToken: true
  })
}

// 新增员工
export function sysUserAdd (data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data,
    addToken: true
  })
}
