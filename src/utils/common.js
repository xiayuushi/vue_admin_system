// 该文件生成全局组件模板
import tipInfo from '@/components/TipInfo'
import excelUpload from '@/components/ExcelUpload'

export default {
  install (Vue, options) {
    Vue.component(tipInfo.name, tipInfo)
    Vue.component(excelUpload.name, excelUpload)
  }
}
