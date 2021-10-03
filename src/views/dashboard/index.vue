<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <el-button @click="btnclick">测试</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['name'])
  },
  methods: {
    btnclick () {
      this.$store.dispatch('routes/dynamicAddUserRoutes')
    }
  }
}
</script>

<style lang="scss" scoped>
.xxx {
  color: #f00;
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
