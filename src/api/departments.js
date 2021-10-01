import request from '@/utils/request'

// 公司部门列表
export function companyDepartment () {
  return request({
    url: '/company/department',
    addToken: true
  })
}

// 员工信息列表
export function sysUserSimple () {
  return request({
    url: '/sys/user/simple',
    method: 'get',
    addToken: true
  })
}

// 新增部门
export function companyDepartmentPost (data) {
  return request({
    url: '/company/department',
    method: 'post',
    data,
    addToken: true
  })
}

// 删除部门
export function companyDepartmentDel (id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete',
    addToken: true
  })
}

// 编辑部门
export function companyDepartmentPut (data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data,
    addToken: true
  })
}
