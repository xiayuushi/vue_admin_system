import store from '@/store'

export default {
  methods: {
    importButtonVisible (pointName) {
      if (store.state.user.userInfo) {
        return store.state.user.userInfo.roles.points.includes(pointName)
      }
    }
  }
}
