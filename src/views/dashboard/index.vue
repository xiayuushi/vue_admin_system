<template>
  <div class="dashboard">
    <el-card class="top-info">
      <img :src="avatar" alt="">
      <div class="msg">
        <h3>早安，{{ '管理员' }}，祝你开心每一天！</h3>
        <span>{{ '管理员' }} | {{ '总裁办' }}</span>
      </div>
    </el-card>
    <el-row :gutter="16">
      <el-col class="left-wrap" :span="14">
        <calendar :appoint-date="appointDate" />
        <el-card class="vertical-16">
          <h3>公告</h3>
        </el-card>
      </el-col>
      <el-col class="right-wrap" :span="10">
        <el-card class="vertical-16">
          <h3>流程申请</h3>
        </el-card>
        <el-card class="vertical-16">
          <h3>快速开始</h3>
        </el-card>
        <el-card class="vertical-16">
          <h3>帮助链接</h3>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {
    calendar: () => import('./components/calendar')
  },
  data () {
    return {
      avatar: require('../../assets/common/head.jpg'),
      appointDate: new Date('2021-10-4') // 传入指定的年份 或者 时间日期 （用于做下拉框前后几年的备选）
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.top-info {
  ::v-deep .el-card__body {
    display: flex;
  }
  .msg {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 6px;
    color: #666;
  }
}
.vertical-16 {
  margin: 16px 0;
}

</style>
