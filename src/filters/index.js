// 全局过滤器

import moment from 'moment'
// 需要处理的对象
import EmployeeEnum from '@/views/employees/constant'

export default {
  // 处理聘用形式
  formatHireType: v => {
    // Q1、有聘用字段
    if (v) {
      if (v === '非正式') {
        return '非正式'
      }
      if (v === '正式') {
        return '正式'
      }
      try {
        // 考虑到后端返回的数据类型不一致，因此必须转数据格式
        v = Number(v)
        // 匹配数据
        const str = EmployeeEnum.hireType.find(item => item.id === v)
        // 匹配成功返回数据对应的值
        return str.value
      } catch (error) {
        // 出错逻辑暂时不作处理
      }
    } else {
      // Q2、没有聘用字段 或者 聘用字段不规范
      return '非正式'
    }
  },
  // 处理聘用形式
  formatTime: v => {
    return moment(v).format('YYYY-MM-DD')
  }
}
