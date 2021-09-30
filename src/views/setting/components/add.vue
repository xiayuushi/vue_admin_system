<template>
  <div class="dialog-self">
    <el-dialog :visible="visible" :title="title" @close="close">
      <el-form ref="form" label-width="100px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>
      </el-form>
      <template slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { sysRolePost, sysRoleEditUpdate } from '@/api/setting'
export default {
  model: {
    prop: 'visible'
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mode: 'add', // 标记对话框为编辑状态或者新增状态
      form: { id: '', name: '', description: '' },
      rules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        description: [{ required: true, message: '请输入描述信息', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title () {
      return this.mode === 'add' ? '新增角色' : '编辑角色'
    }
  },
  methods: {
    async addRole () {
      await sysRolePost({ ...this.form })
      this.$message.success('新增角色成功！')
      this.close()
      this.$emit('refresh')
    },
    async submit () {
      // A、提交新增
      if (this.mode === 'add') {
        this.$refs['form'].validate(result => {
          result
            ? this.addRole()
            : this.$message.error('未按要求输入，请重新输入！')
        })
      } else {
        // B、提交编辑
        await sysRoleEditUpdate({ ...this.form })
        this.$message.success('更新角色成功！')
        this.$emit('refresh')
        this.close()
      }
    },
    close () {
      this.$emit('input', false) // 关闭弹框
      this.$refs['form'].resetFields() // 重置表单验证规则
      this.form = { id: '', name: '', description: '' } // 清空表单数据
    }
  }

}
</script>

<style lang="scss" scoped>
.dialog-self {
  ::v-deep .el-dialog__header {
    background-color: #64b0fd;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn,
    .el-dialog__close {
      color: #fff;
    }
  }
  ::v-deep .el-dialog__footer {
    text-align: center;
  }
}
</style>
