<template>
  <el-dialog :visible="powerVisible" title="设置权限" @close="close">
    <el-tree
      ref="tree"
      :data="data"
      show-checkbox
      :props="{label: 'name'}"
      :check-strictly="true"
      node-key="id"
      :default-checked-keys="defaultChecked"
    />
    <template #footer>
      <div style="text-align: center">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { sysPermission } from '@/api/permission'
import { sysRoleId, sysRoleEditUpdate } from '@/api/setting'
export default {
  model: {
    prop: 'powerVisible'
  },
  props: {
    powerVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: [], // 树形数据
      userInfo: [], // 角色详情（含当前角色的权限信息）
      defaultChecked: [] // 树形默认勾选的项
    }
  },
  created () {
    this.getPowerList()
  },
  methods: {
    async getPowerList () {
      const res = await sysPermission()
      this.data = this.processTreeData(res.data.data)
    },
    // 该方法会在父组件传入id进行调用
    async getRoleDetail (id) {
      const res = await sysRoleId(id)
      this.userInfo = res.data.data
      // 方式1、从个人详细信息中获取角色已有权限 设置给 el-tree的复选框默认选中数组 （default-checked-keys属性）
      // 注意：default-checked-keys属性只能初次设置默认勾选，后续不能通过该属性更改勾选
      this.defaultChecked = this.userInfo.permIds

      // 方式2、从个人详细信息中获取角色已有权限 设置给 el-tree的内置方法（setCheckedKeys方法）用于勾选复选框
      this.$refs['tree'].setCheckedKeys(this.userInfo.permIds)
    },
    close () {
      this.$emit('input', false)
      this.$refs['tree'].setCheckedKeys([])
    },
    async submit () {
      await sysRoleEditUpdate({ ...this.userInfo, permIds: this.$refs['tree'].getCheckedKeys() })
      this.close()
      this.$message.success('更新权限成功！')
    },
    processTreeData (arr, condition = '0') {
      return arr.filter(item => {
        if (item.pid === condition) {
          item.children = this.processTreeData(arr, item.id)
          return true
        }
      })
    }
  }
}
</script>

<style></style>
