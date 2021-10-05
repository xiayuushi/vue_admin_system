<template>
  <div v-if="show" id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      show: true
    }
  },
  methods: {
    reload () {
      this.show = false
      this.$nextTick(() => (this.show = true))
    }
  }
}
</script>
