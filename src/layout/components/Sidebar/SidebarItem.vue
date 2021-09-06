<template>
  <div v-if="!item.hidden">
    <!-- 2、将从sidebar/index.vue组件传递过来的item信息传入 hasOneShowingChild 方法中 -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
          (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
          !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <!-- el-menu-item 针对1层菜单的 -->
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>
    <!-- el-submenu 针对多层菜单的-->
    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // 1
    // 从sidebar/index.vue组件中接收传递过来的当条路由信息
    // 作为显示侧边栏单层或者多层的判断依据
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // 3、在hasOneShowingChild方法中判断
    // 总之，只要在路由配置中设置hidden:true该路由对应组件就不会出现在侧边栏
    // a、如果item（路由配置信息）中hidden属性为true、则不保留该项（就不会将这条路由对应的组件显示在侧边栏）

    // b、如果item（路由配置信息）中没有hidden属性，则保留该项（就会将这条路由对应的组件显示到侧边栏）
    // c、如果item（路由配置信息）中只有一个子级路由，那么也会将该子级路由对应的组件显示到侧边栏
    // d、如果item（路由配置信息）中，没有子级路由且hidden为false就会将父级路由显示到侧边栏
    // 满足bcd三种情况中任意一种才会将路由对应组件显示到侧边栏菜单中
    hasOneShowingChild (children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          // 如果子路由只有一个的情况下，也会将子路由对应的组件显示到侧边栏菜单
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      // 如果子路由只有一个的情况下，也会将子路由对应的组件显示到侧边栏菜单
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      // 如果没有子路由就会将父级路由对应的组件显示到侧边菜单栏
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath (routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
