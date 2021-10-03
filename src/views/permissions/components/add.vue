<template>
  <el-dialog :visible="visible" :title="title" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="企业可见" prop="enVisible">
        <el-switch v-model="form.enVisible" active-text="可见" inactive-text="不可见" active-value="1" inactive-value="0" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="权限描述" prop="description">
        <el-input v-model="form.description" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: center">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { sysPermissionPost, sysPermissionPut } from '@/api/permissions'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {
        name: '',
        code: '',
        description: '',
        type: '', // 该值为1时表示新增或编辑菜单 2时表示新增或者编辑按钮
        pid: '', // 该值为'0'时为一级菜单 该值为某个值的id时表示当前项有父级（父级id就是子级的pid）
        enVisible: '0'// 该值与active-value和inactive-value对应 '0'不可见，'1'可见
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入标识', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述', trigger: 'blur' }]
      },
      mode: 'add' // 用于标识新增与编辑
    }
  },
  computed: {
    title () {
      return this.mode === 'add' ? '新增权限' : '编辑权限'
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
      this.$refs['form'].resetFields() // 重置表单验证规则
      this.form = { name: '', code: '', description: '', type: '', pid: '', enVisible: '0' } // 清空表单
    },
    submit () {
      this.$refs['form'].validate(async result => {
        if (result) {
          if (this.mode === 'add') {
            await sysPermissionPost({ ...this.form })
            this.$message.success('新增权限成功！')
          } else {
            await sysPermissionPut({ ...this.form })
            this.$message.success('编辑权限成功！')
          }
          this.$emit('refresh') // 刷新父级列表
          this.close()
        } else {
          this.$message.error('验证失败！')
        }
      })
    },
    // 该方法用于确定父级传递过来的type与pid（该方法会在父级中以实参传入并调用）
    // type为1表示菜单、为2表示按钮
    // pid 为'0'表示是一级菜单、非'0'则是一级菜单下的子级按钮
    // 总之，该方法是为了确定是点击的是哪个"新增"，右上角的则表示新增菜单，权限操作内的则是新增菜单下的子级按钮
    confirmTypePid (type, pid) {
      this.form.type = type
      this.form.pid = pid
    }
  }
}
</script>

<style></style>
