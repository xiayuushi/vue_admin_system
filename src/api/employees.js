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

// 批量导入员工
export function sysUserBatch (data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data,
    addToken: true
  })
}

// 修改员工个人信息
export function sysUserPut (data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data,
    addToken: true
  })
}

// 获取用户详情的基础信息
export function getPersonalDetail (id) {
  return request({
    url: `/employees/${id}/personalInfo`,
    method: 'get',
    addToken: true
  })
}

// 更新用户详情的基础信息
export function updatePersonalDetail (data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data,
    addToken: true
  })
}

// 获取用户岗位信息
export function getJobDetail (id) {
  return request({
    url: `/employees/${id}/jobs`,
    addToken: true
  })
}

// 更新用户岗位信息
export function updateJob (data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data,
    addToken: true
  })
}
