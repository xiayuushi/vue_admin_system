import request from '@/utils/request'

// 1、获取登录信息token
export function sysLogin (data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data,
    // 自定义布尔值属性用于标识当前登录接口,方便在响应拦截器中进行识别接口做逻辑处理
    isLogin: true
  })
}

// 2、获取用户信息（可验证token）
export function sysProfile () {
  return request({
    url: '/sys/profile',
    method: 'post',
    addToken: true
  })
}

// 3、获取员工信息（含头像）
export function sysUserId (id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'get',
    addToken: true
  })
}
