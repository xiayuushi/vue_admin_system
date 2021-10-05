<template>
  <svg-icon icon-class="fullscreen" class-name="svg-icon-self" @click="toggleFullScreen" />
</template>

<script>
import screenFull from 'screenfull'

export default {
  name: 'ScreenFull',
  methods: {
    toggleFullScreen () {
      screenFull.isEnabled
        ? screenFull.toggle()
        : this.$message.error('当前浏览器不支持全屏功能')
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon-self {
  color: #fff;
  margin-right: 12px;
  cursor: pointer;
}
</style>
