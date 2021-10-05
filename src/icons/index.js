import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon' // svg component

// register globally
Vue.component('svg-icon', SvgIcon)

/*
    写法2：Vue.component('svg-icon', SvgIcon)
    采用这类写法时，无需在组件SvgIcon内部设置name字段
    因为这是固定写法（此处写什么字符串就必须使用什么字符串作为组件名）
    后续，就只能使用 <svg-icon /> 来使用该公共全局组件SvgIcon

    非固定写法可以参考 utils/common.js 中的全局公共组件模板
*/

const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
