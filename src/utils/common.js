// 该文件生成全局组件模板
import tipInfo from '@/components/TipInfo'
import excelRead from '@/components/ExcelRead'
import fileUpload from '@/components/FileUpload'
import screenFull from '@/components/ScreenFull'
import language from '@/components/Language'

export default {
  install (Vue, options) {
    Vue.component(tipInfo.name, tipInfo)
    Vue.component(excelRead.name, excelRead)
    Vue.component(fileUpload.name, fileUpload)
    Vue.component(screenFull.name, screenFull)
    Vue.component(language.name, language)
  }
}

/*
    写法1：Vue.component(xxx.name, xxx)
    采用这类写法时，必须在对应的xxx组件内部设置name字段，后续使用name值来使用组件
    因为这是不固定写法（此时的 xxx.name 只是一个暂时性的别称），
    后续在组件中再设置name字段，并可以自定义name值，该name值就是使用时的组件名
    例如：export default { name: 'abc', data(){ return { ... } }, methods:{ ... } }
    后续，则使用 <abc /> 来使用该公共全局组件xxx

    写法2：Vue.component('abc', xxx)
    采用这类写法时，无需在组件xxx内部设置name字段
    因为这是固定写法（此处写什么字符串就必须使用什么字符串作为组件名）
    后续，就只能使用 <abc /> 来使用该公共全局组件xxx

*/
