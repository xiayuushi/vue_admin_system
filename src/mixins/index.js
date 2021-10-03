import store from '@/store'

export default {
  methods: {
    importButtonVisible (pointName) {
      return store.state.user.userInfo.roles.points.includes(pointName)
    }
  }
}
