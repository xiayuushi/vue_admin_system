// 该文件生成全局组件模板
import tipInfo from '@/components/TipInfo'
import excelRead from '@/components/ExcelRead'

export default {
  install (Vue, options) {
    Vue.component(tipInfo.name, tipInfo)
    Vue.component(excelRead.name, excelRead)
  }
}
