export default {
  // 自定义指令 v-imgerr
  // 图片有src使用src，否则使用指令值设置给图片src
  imgerr: {
    inserted (dom, obj) {
      dom.src = dom.src || obj.value
      dom.onerror = () => (dom.src = obj.value)
    },
    // inserted周期只执行一次，但onerror监听只要有错误就会监听
    // 为了避免监听到错误但自定义指令却不生效的情况
    // 加入componentUpdate周期，只有组件dom有变化就触发指令
    componentUpdated (dom, obj) {
      dom.src = dom.src || obj.value
    }
  }
}
