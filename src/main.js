import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'

// 导航守卫及路由
import './permission'
import router from './router'

// vuex
import store from './store'

import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'

import '@/icons'
import '@/styles/index.scss'

// 全局公共组件及注册
import common from './utils/common'
Vue.use(common)

// 全局过滤器对象集合
import filtersfn from './filters'
Object.keys(filtersfn).forEach(item => Vue.filter(item, filtersfn[item]))

// 全局自定义指令集合
import directives from './directives'
Object.keys(directives).forEach(item => Vue.directive(item, directives[item]))

// bus对象用于非父子组件的传值传值
Vue.prototype.$bus = new Vue()

// 英文版 ElementUI
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// Vue.use(ElementUI, { locale })

// 中文版 ElementUI
Vue.use(ElementUI)

// 打印
import Print from 'vue-print-nb'
Vue.use(Print)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
