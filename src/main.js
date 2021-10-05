import Vue from 'vue'
import App from './App'
import Element from 'element-ui'

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

// 全局mixin混入
import mixin from './mixins'
Vue.mixin(mixin)

// 国际化 i18n 针对 ElementUI的处理
import i18n from './lang'
Vue.use(Element, { i18n: (key, value) => i18n.t(key, value) })

// 英文版 ElementUI
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// Vue.use(Element, { locale })

// 中文版 ElementUI
// Vue.use(Element)

// 打印
import Print from 'vue-print-nb'
Vue.use(Print)

Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
