<template>
  <div>
    <el-card class="box-card">
      <el-tabs>
        <el-tab-pane label="组织架构">
          <div class="tree-container">
            <treeItem :item="topInfo" :is-top="true" @refresh="getList" />
            <hr>
            <!-- 树形结构 -->
            <el-tree
              v-loading="loading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              :data="treeData"
            >
              <template v-slot="{ node, data }">
                <!-- 作用域插槽中 scoped对象 结构为node与data -->
                <!-- node 是当前节点的node对象，是element-ui进行过处理的一些数据 -->
                <!-- data 是当前节点中的数据 可以通过data获取当前行的数据 -->
                <treeItem :item="data" style="width: 100%;" @refresh="getList" />
              </template>
            </el-tree>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 弹框 -->
    <add :open-add.sync="openAddf" :init-data="initDataf" @refresh="getList" />
  </div>
</template>

<script>
import treeItem from './components/treeItem'
import add from './components/add'
import { companyDepartment } from '@/api/departments'
export default {
  components: { treeItem, add },
  data () {
    return {
      loading: false,
      openAddf: false,
      activeName: 'first',
      initDataf: [], // 传递给弹出框的所有部门信息
      topInfo: { // 顶部公司数据
        name: '广州韵时有限公司',
        manager: '负责人',
        id: '' // 人为添加该字段用于表单验证中是否重复判断
      },
      treeData: [] // 公司下方的部门信息渲染
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () {
      this.loading = true
      const res = await companyDepartment()
      this.initDataf = res.data.data.depts
      this.treeData = this.processData(res.data.data.depts, '')
      this.topInfo.name = res.data.data.companyName
      this.topInfo.manager = res.data.data.companyManage
      this.loading = false
    },
    processData (arr, condition) {
      // 处理第一层数据 pid === ''(没有父级)
      // 处理第二层数据 pid === 父级的id
      return arr.filter(item => {
        if (item.pid === condition) {
          item.children = this.processData(arr, item.id)
          return true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-container {
  padding: 20px 30px;
  background-color: #fff;
  .tree-item {
    display: flex;
    .i1 {
      flex: 1;
    }
    .i2 {
      padding-right: 20px;
    }
  }
}
</style>
