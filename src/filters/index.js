import moment from 'moment'
import EmployeeEnum from '@/api/constant/employees'

export default {
  // 处理聘用形式
  formatHireType: payload => {
    // Q1、有聘用字段
    if (payload) {
      if (payload === '非正式') {
        return '非正式'
      }
      if (payload === '正式') {
        return '正式'
      }
      try {
        payload = Number(payload) // 考虑到后端返回的数据类型不一致，因此必须转数据格式
        const str = EmployeeEnum.hireType.find(item => item.id === payload)
        return str.value
      } catch (error) {
        // 出错逻辑暂时不作处理
      }
    } else {
      return '非正式' // Q2、没有聘用字段 或者 聘用字段不规范
    }
  },

  // 处理聘用时间
  formatTime: payload => {
    return moment(payload).format('YYYY-MM-DD')
  },
  // 处理日历时间（转为日期）
  formatDate: payload => {
    return moment(payload).get('date')
  }
}
