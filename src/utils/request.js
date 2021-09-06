import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store/index'
import router from '@/router'

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

// 假设已知token两小时过期
const tokenExpireTime = 2 * 60 * 60 * 1000
// const tokenExpireTime = 10000

// 用于接收同一接口的请求
let requestArr = []
// 用于接收路由切换时的接口请求
// 4、路由切换时取消前一个页面的所有接口请求
export function PageCancelToken () {
  window.cancelToken = requestArr.filter(item => {
    item.fn()
    return false
  })
}

instance.interceptors.request.use(
  config => {
    // 3、取消同一接口前一次的请求
    requestArr = requestArr.filter(item => {
      if (item.url === config.url && item.method === config.method) {
        // 匹配同一接口调用取消方法 并删除该请求
        item.fn()
        return false
      } else {
        return true
      }
    })
    // 使用axios.CancelToken构造函数创建实例对象，并将取消方法添加给数组，再挂载到config
    config.cancelToken = new axios.CancelToken(cancel => {
      requestArr.push({
        fn: cancel,
        url: config.url,
        method: config.method
      })
    })
    // 2、主动触发token失效（实际开发一般不常用）
    const currentTime = Date.now()
    const loginTime = localStorage.getItem('loginTime')
    if (store.getters.token && currentTime - loginTime >= tokenExpireTime) {
      store.commit('user/mutationsfnDel')
      Message.error('主动触发的登录过期测试')
      // 跳转回登录页并携带参数
      router.push('/login?xxx=' + window.location.href.split('#')[1])
    }
    // 1、自动添加请求头携带token（在需要携带token的请求头中自定义添加addToken:true）
    if (store.getters.token && config.addToken) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  res => {
    if (res.data.success) {
      return res
    } else {
      // 弹出错误提示、重置token、捕捉错误
      Message.error(res.data.message)
      // 针对登录接口做筛选，只有登录失败才会清空token
      if (res.config.isLogin) {
        store.commit('user/mutationsfnRemoveToken')
      }
      return Promise.reject(res.data.message)
    }
  },
  err => {
    // 处理非200报错
    // 此处以处理token超时为例
    if (err.response && err.response.data && err.response.data.code === 10002) {
      // 删除token与用户信息userInfo
      // 弹框提示
      // 中止Promise对象.then，直接.catch
      store.commit('user/mutationsfnDel')
      Message.error(err.response.data.message)
      // 此处参数拼接要与前置导航守卫的参数拼接格式保持一致
      // 跳转回登录页并携带参数
      router.push('/login?xxx=' + window.location.href.split('#')[1])
    }
    return Promise.reject(err)
  }
)

// 一劳永逸解决封装的api在浏览器控制台出现Promise抛错的问题
// 通过Promise将axios实例对象包裹一层，另外在catch()捕获到错误时选择不进行reject抛出错误
function _instance (payload) {
  return new Promise((resolve, reject) => {
    instance(payload)
      .then(res => resolve(res))
      .catch(err => console.log(err))
  })
}

export default _instance
