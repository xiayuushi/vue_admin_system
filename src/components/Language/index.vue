<template>
  <el-dropdown @command="handleCommand">
    <svg-icon icon-class="language" class-name="svg-icon-self" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="zh" :disabled="$i18n.locale==='zh'">中文</el-dropdown-item>
        <el-dropdown-item command="en" :disabled="$i18n.locale==='en'">English</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: 'Language',
  inject: ['reload'],
  methods: {
    handleCommand (val) {
      this.$i18n.locale = val
      Cookie.set('lang', val)
      this.reload() // 方式1：静默刷新
      // this.$router.go(0) // 方式2：全局刷新
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
