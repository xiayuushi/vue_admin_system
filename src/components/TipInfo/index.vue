<template>
  <el-card class="container">
    <div class="left">
      <!-- 定义一个v-if控制显示隐藏 值由外部使用者传入 -->
      <div v-if="showLeft" class="wrap">
        <i class="iconself el-icon-info" />
        <div class="context">
          <!-- 定义插槽 以便后续自定义结构 -->
          <slot name="context">
            本月：社保在缴 增员 减员 入职 离职
          </slot>
        </div>
      </div>
    </div>
    <div class="right">
      <!-- 定义插槽 以便后续自定义结构 -->
      <slot name="right">
        <el-button type="primary">历史归档</el-button>
        <el-button type="primary">202001报表</el-button>
      </slot>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'TipInfo',
  props: {
    showLeft: {
      // 是否显示左侧内容（由全局公共组件使用者传入）
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  ::v-deep .el-card__body {
    display: flex;
    justify-content: space-between;
  }

  .left {
    display: flex;
    justify-content: space-between;
    .wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border: 1px solid #3f9efc;
      .iconself {
        color: #3f9efc;
      }
      .context {
        margin-left: 6px;
        font-size: 12px;
        color: #666;
      }
    }
  }
  ::v-deep .right {
    .el-button {
      padding: 6px 20px;
    }
  }
}
</style>
