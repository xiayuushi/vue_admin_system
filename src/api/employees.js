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
