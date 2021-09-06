<template>
  <div class="navbar">
    <div class="left">
      <!-- 图标是根据左侧菜单栏sidebar组件伸缩而伸缩的 因此需要取到sidebar的控制属性sidebar.opened -->
      <i
        v-if="sidebar.opened"
        class="icon el-icon-s-unfold"
        @click="openSideBar"
      />
      <i v-else class="icon el-icon-s-fold" @click="openSideBar" />
      <span>vue admin system</span>
      <em>体验版</em>
    </div>
    <div class="right">
      <el-dropdown @command="commandEvent">
        <div class="el-dropdown-link wrap">
          <img
            v-imgerr="defaultImg"
            class="auth-img"
            :src="userInfo.data.data.staffPhoto"
            alt=""
          >
          <span class="username">{{ userInfo.data.data.username }}</span>
          <i class="el-icon-arrow-down el-icon--right" />
        </div>
        <el-dropdown-menu>
          <el-dropdown-item command="home">首页</el-dropdown-item>
          <el-dropdown-item command="exit">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
// import { removeToken } from '@/utils/auth'
export default {
  // 局部自定义指令 v-imgerr
  // 当图片地址报错时，使用默认线上地址图片
  directives: {
    imgerr: {
      inserted (dom, obj, vnode) {
        // 图片有src属性，则使用src属性的内容(服务器返回的图片)，否则默认使用本地或者固定线上图片给src属性
        dom.src = dom.src || obj.value
        dom.onerror = () => {
          dom.src = obj.value
        }
      }
    }
  },
  data () {
    return {
      // 线上图片
      defaultImg: 'http://via.placeholder.com/30x30.png'
      // 本地图片
      // defaultImg: require('@/assets/404_images/404.png')
    }
  },
  computed: {
    ...mapState('user', ['userInfo']),
    ...mapGetters(['sidebar'])
  },
  created () {
    // console.log(this.userInfo.data.data.staffPhoto)
    // console.log(this.userInfo.data.data.username)
  },

  methods: {
    ...mapActions('app', ['toggleSideBar']),
    ...mapMutations('user/', ['mutationsfnDel']),
    openSideBar () {
      this.toggleSideBar()
    },
    commandEvent (command) {
      switch (command) {
        case 'home':
          this.$router.push('/')
          break
        case 'exit':
          this.$confirm('是否现在退出登录？', '', {
            confirmButtonText: '是',
            cancelButtonText: '否'
          })
            .then(() => {
              // this.$store.commit('user/mutationsfnDel')
              this.mutationsfnDel()
              this.$router.push('/login')
            })
            .catch(() => {
              // window.console.log('点击了取消')
            })
          // removeToken()
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding-left: 20px;
  background-color: #4c7bfb;
  .left {
    display: flex;
    align-items: center;
    i {
      font-size: 25px;
      color: #fff;
      cursor: pointer;
    }
    span {
      padding: 0 20px;
      color: #fff;
    }
    em {
      font-style: normal;
      font-size: 12px;
      padding: 4px 8px;
      border-radius: 8px;
      color: #fff;
      background-color: rgba(255, 255, 255, 0.4);
    }
  }
  .right {
    .wrap {
      display: flex;
      padding-right: 20px;
      align-items: center;
      .auth-img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
      .username {
        margin: 0 10px;
        font-size: 12px;
        color: #fff;
      }
      .el-dropdown-link {
        font-size: 12px;
        cursor: pointer;
        color: #fff;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
    }
  }
}
</style>
