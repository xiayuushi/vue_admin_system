<template>
  <div class="tree-item">
    <div class="i1">{{ item.name }}</div>
    <span class="i2">{{ item.manager }}</span>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">操作<i class="el-icon-arrow-down el-icon--right" /></span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="add">新增</el-dropdown-item>
        <el-dropdown-item v-if="!isTop" command="edit">编辑</el-dropdown-item>
        <el-dropdown-item v-if="!isTop" command="del">删除</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { companyDepartmentDel } from '@/api/departments'
export default {
  props: {
    item: {
      // 每一行的数据
      type: Object,
      default: null
    },
    isTop: {
      type: Boolean,
      default: null
    }
  },
  data () {
    return {}
  },
  methods: {
    handleCommand (command) {
      switch (command) {
        case 'add':
          // 点击新增按钮: true打开弹窗 this.item传递当前点击项的数据
          this.$bus.$emit('openAddFn', true, this.item)
          break
        case 'del':
          // 点击删除按钮：删除当前点击项
          this.$confirm('是否删除当前项？', '提示')
            .then(async () => {
              await this.delDepartment()
            })
            .catch(() => console.log('用户取消了操作'))
          break
        case 'edit':
          // 编辑按钮：编辑弹框表单（与新增的弹框表单公用）
          // 第三参数 'edit'标识当前会编辑表单状态
          this.$bus.$emit('openAddFn', true, this.item, 'edit')
          break
      }
    },
    async delDepartment () {
      await companyDepartmentDel(this.item.id)
      this.$message.success('删除部门成功！')
      this.$emit('refresh') // 需要回到父组件标签中 添加 @refresh="getList"
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-item {
  display: flex;
  .i1 {
    flex: 1;
  }
  .i2 {
    padding-right: 20px;
  }
}
</style>
