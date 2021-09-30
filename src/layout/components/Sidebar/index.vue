<template>
  <div class="sidebar" :class="{ 'has-logo': showLogo }">
    <Logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- 循环遍历所有路由 并将当前路由信息传递给 item属性 （该item属性会传输给sidebarItem组件） -->
        <sidebarItem
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['sidebar']),
    routes () {
      // 整个项目的所有配置信息，是一个 数组，包含所有路由路径
      return this.$router.options.routes
    },
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    variables () {
      return variables
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  .el-scrollbar {
    background-color: #43a7fe;
    ::v-deep .el-menu {
      border: none;
      height: 100%;
      width: 100% !important;

      a {
        // 1、a标签未被选中时其内部子或者后代元素的样式
        &.router-link-exact-active,
        &.router-link-active,
        &:hover {
          .svg-icon {
            color: #43a7fe !important;
          }
          span {
            color: #43a7fe !important;
          }
          li {
            // a标签被选中时内部li标签的颜色
            background-color: #fff !important;
          }
        }
        // 2、a标签未被选中时其内部子或者后代元素的样式
        li {
          // 此处li标签的颜色与variables.scss的$menuBg背景色保持一致
          background-color: #43a7fe !important;
          .svg-icon {
            color: #fff !important;
            font-size: 18px;
            vertical-align: middle;
            .icon {
              color: #fff !important;
            }
          }
          span {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
