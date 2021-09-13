<template>
  <div class="dialog-self">
    <el-dialog
      :visible="value"
      :title="mode === 'add' ? '新增角色' : '编辑角色'"
      @close="closeDialog"
    >
      <el-form ref="form" label-width="100px" :model="form" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>
      </el-form>
      <template slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { sysRoleAdd, sysRoleEditUpdate } from '@/api/setting'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['value'],
  data () {
    return {
      mode: 'add', // 标记对话框为编辑状态或者新增状态
      form: {
        // 表单数据
        id: '',
        name: '',
        description: ''
      },
      rules: {
        // 表单验证规则
        name: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        description: [
          {
            required: true,
            message: '请输入描述信息',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {},
  methods: {
    // 添加角色
    async addRole () {
      const res = await sysRoleAdd(this.form)
      if (res.data.code === 10000) {
        this.$message.success(res.data.message)
        this.closeDialog()
        this.$emit('refresh')
      }
    },
    // 确认提交
    async submit () {
      // A提交新增
      if (this.mode === 'add') {
        this.$refs['form'].validate(v => {
          if (v) {
            // 验证通过，调接口
            this.addRole()
          } else {
            this.$message.error('未按要求输入，请重新输入！')
            return false
          }
        })
      } else {
        // B提交编辑
        const res = await sysRoleEditUpdate(this.form)
        if (res.data.code === 10000) {
          this.$message.success('角色信息更新成功！')
          this.$emit('refresh')
          this.closeDialog()
        }
      }
    },
    // 关闭对话框、重置表单清除规则、清空对话框表单数据
    closeDialog () {
      this.$emit('input', false)
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        name: '',
        description: ''
      }
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
