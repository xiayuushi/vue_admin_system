<template>
  <el-dialog :visible="visible" title="分配角色" @close="close">
    <el-checkbox v-for="(item, index) in rolesList" :key="index" v-model="checkLabel" :label="item.id">{{ item.name }}</el-checkbox>
    <template #footer>
      <div style="text-align: center">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { sysRole } from '@/api/setting'
import { sysUserPut } from '@/api/employees'

export default {
  model: {
    prop: 'visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: () => {} // 父级传递过来的当前用户信息
    }
  },
  data () {
    return {
      rolesList: [], // 角色列表
      checkLabel: [] // v-model绑定的数组用于存放复选框选中项的label值，此处必须是空字符串，否则一选全选
    }
  },
  async created () {
    const res = await sysRole({ ...this.userInfo })
    this.rolesList = res.data.rows // 获取角色列表渲染复选框
  },
  methods: {
    close () {
      this.$emit('input', false)
    },
    cancel () {
      this.checkLabel = []
      this.close()
    },
    async submit () {
      await sysUserPut({ ...this.userInfo, roleIds: this.checkLabel }) // 更新用户信息（含用户对应的角色信息）

      this.$message.success('更新角色信息成功！')
      this.close()
    }
  }
}
</script>

<style></style>
