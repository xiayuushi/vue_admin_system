// 该文件生成全局组件模板
import tipInfo from '@/components/TipInfo'
import excelRead from '@/components/ExcelRead'
import fileUpload from '@/components/FileUpload'

export default {
  install (Vue, options) {
    Vue.component(tipInfo.name, tipInfo)
    Vue.component(excelRead.name, excelRead)
    Vue.component(fileUpload.name, fileUpload)
  }
}
