<template>
  <el-card class="vertical-16 calendar">
    <h3>工作日历</h3>
    <el-divider />
    <div class="select">
      <el-select v-model="year" @change="change">
        <el-option v-for="item in years" :key="item" :value="item" :label="item" />
      </el-select>
      <el-select v-model="month" class="select-2" @change="change">
        <el-option v-for="item in months" :key="item" :value="item" :label="item" />
      </el-select>
    </div>
    <el-calendar v-model="dateTime">
      <template #dateCell="{ date }">
        <div class="date-cell" @click="record(date)">
          <span class="date">{{ date | formatDate }}</span>
          <div class="flex">
            <span v-if="isRest(date)" class="span icon">休</span>
            <span v-else class="span" />
          </div>
          <div class="flex">
            <span v-if="isRecord(date)" class="span record">签</span>
            <span v-else class="span" />
          </div>
        </div>
      </template>
    </el-calendar>
  </el-card>
</template>

<script>
import moment from 'moment'
import { getRecordDate, setRecordDate } from '@/utils/record'
export default {
  props: {
    appointDate: {
      type: Date,
      default: () => new Date() // 外界传入的指定日期年用于做下拉框前后几年，不传时默认值为当前时间
    }
  },
  data () {
    return {
      dateTime: new Date(),
      select: '',
      holidays: ['2021-10-01', '2021-10-02', '2021-10-03', '2021-10-14'], // 特殊节日休假添加到此处
      year: '', // 下拉框选中的年
      month: '', // 下拉框选中的月
      years: [], // 下拉框选项的备选年份（用于存放前后几年）
      months: 12, // 下拉框选项的备选月份（用于存放1-12月）
      recordList: getRecordDate() || [] // 签到日期列表
    }
  },
  watch: {
    appointDate: {
      handler (newVal) {
        const appointYear = moment(newVal).get('year') // 获取传入的年份（默认为当前年份）
        const appointMonth = moment(newVal).get('month') + 1 // 获取传入的年份（默认为当前年份）
        const minAnyYears = appointYear - 6 // 传入年份的前6年
        const maxAnyYears = appointYear + 6 // 传入年份的后6年

        for (var i = minAnyYears; i <= maxAnyYears; i++) {
          this.years.push(i) // 遍历得到当前年份的前后6年的元素加入到下拉框年份备选数组中
        }

        this.year = appointYear // 默认下拉框选中的年份
        this.month = appointMonth // 默认下拉框选中的月份
      },
      immediate: true
    }
  },
  methods: {
    isRest (date) {
      // 周六、日或节假日 带"休"字（且只显示当前选中月份的"休"字）
      const restdays = new Date(date).getDay()
      const holidays = this.holidays.includes(moment(date).format('YYYY-MM-DD'))
      if (new Date(date).getMonth() + 1 === this.month) {
        return restdays === 0 || restdays === 6 || holidays
      }
    },
    change () {
      // 选择时是当前年月则当前日期高亮 否则是每月1号高亮
      new Date().getFullYear() === this.year &&
      new Date().getMonth() + 1 === this.month
        ? (this.dateTime = new Date())
        : (this.dateTime = `${this.year}/${this.month}/1`)
    },
    record (date) {
      date = moment(date).format('YYYY-MM-DD')
      const curDate = moment().format('YYYY-MM-DD')
      // 仅当天签到有效
      if (date !== curDate) return
      // 点击签到，再次点击取消签到
      if (this.recordList && !this.recordList.includes(date)) {
        this.recordList.push(date)
        setRecordDate(this.recordList)
      } else {
        const index = this.recordList.findIndex(item => item === date)
        this.recordList.splice(index, 1)
        setRecordDate(this.recordList)
      }
    },
    isRecord (date) {
      // 是否显示"签到"
      date = moment(date).format('YYYY-MM-DD')
      if (this.recordList) {
        return this.recordList.includes(date)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.vertical-16 {
  margin: 16px 0;
}
.flex {
  display: flex; // BFC
}
.select {
  float: right;
  .select-2 {
    width: 100px;
    margin-left: 6px;
  }
}

.calendar {
  .date-cell {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  .date {
    width: 18px;
    text-align: center;
  }
  .span {
    width: 18px;
    height: 18px;
    padding: 2px;
    &.icon {
      border-radius: 50%;
      font-size: 12px;
      color: #fff;
      margin: 0 6px;
      background-color: #f37f58;
    }
    &.record {
      border-radius: 50%;
      font-size: 12px;
      color: #fff;
      background-color: #0ebe75;
    }
  }

  ::v-deep .el-calendar {
    .el-calendar__header {
      display: none;
    }
    .el-calendar__body {
      .el-calendar-table td {
        border: none;
        &.is-today {
        // 今日日期高亮
        .date {
          color: #fff;
          border-radius: 50%;
          background-color: #409bfc;
        }
        }
      }
      .el-calendar-table thead th {
        padding: 12px 8px;
        text-align: center;
      }
      .el-calendar-table__row {
        .el-calendar-day {
          height: 40px;
        }
      }
    }
  }
}
</style>
