<template>
  <el-card class="permissions">
    <el-button size="mini" type="primary" class="button" @click="add(1,'0')">添加权限</el-button>
    <el-table :data="data" row-key="id">
      <el-table-column label="菜单名称" prop="name" />
      <el-table-column label="权限标识" prop="code" />
      <el-table-column label="权限描述" prop="description" />
      <el-table-column label="权限操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="add(2, row.id)">添加权限</el-button>
          <el-button type="text" @click="add(2, row.id)">添加按钮</el-button>
          <el-button type="text" @click="edit(row)">修改权限</el-button>
          <el-button type="text" @click="del(row.id)">删除权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add ref="add" :visible.sync="visible" @refresh="getPermission" />
  </el-card>
</template>

<script>
import { sysPermission, sysPermissionId } from '@/api/permissions'
import add from './components/add'
export default {
  components: { add },
  data () {
    return {
      data: [],
      visible: false
    }
  },
  created () {
    this.getPermission()
  },
  methods: {
    add (type, pid) {
      this.$refs.add.mode = 'add'
      this.visible = true
      this.$refs.add.confirmTypePid(type, pid)
    },
    async edit (row) {
      this.visible = true
      this.$refs.add.mode = 'edit'
      this.$refs.add.form = JSON.parse(JSON.stringify(row)) // 深拷贝解除引用关系引起的"联动"bug
    },
    async del (id) {
      try {
        await this.$confirm('是否删除该权限?', '提示')
        await sysPermissionId(id)
        this.$message.success('删除权限成功！')
        this.getPermission()
      } catch (error) {
        console.log(error)
      }
    },
    async getPermission () {
      const res = await sysPermission()
      this.data = this.processTreeData(res.data, '0')
    },
    processTreeData (arr, condition) {
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

<style lang="scss" scoped>
.permissions {
  position: relative;
  .button {
    position: absolute;
    top: 26px;
    right: 26px;
    z-index: 999;
  }
}
</style>
