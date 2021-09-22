<template>
  <el-card class="container">
    <el-tabs>
      <el-tab-pane label="登录账户设置">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="200px"
          style="padding: 40px"
        >
          <el-form-item label="姓名" prop="username">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit">更新</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="个人详情" lazy>
        <component :is="'user'" :user-info="c_userInfo" />
      </el-tab-pane>
      <el-tab-pane label="岗位信息">
        <component :is="'job'" />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { sysUser } from '@/api/user'
import { sysUserPut } from '@/api/employees'
export default {
  components: {
    user: () => import('./user'),
    job: () => import('./job')
  },
  data () {
    return {
      id: this.$route.params.id,
      userInfo: '', // 员工基本信息
      c_userInfo: '', // 员工基本信息（深拷贝）
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    // 修改员工基本信息
    submit () {
      this.$refs['form'].validate(async result => {
        if (result) {
          await sysUserPut({ ...this.userInfo, ...this.form })
          this.$message.success('更新成功')
        } else {
          this.$message.error('验证失败')
        }
      })
    },
    // 获取员工基本信息
    async getUserInfo () {
      const res = await sysUser(this.id)
      this.userInfo = res.data.data
      this.c_userInfo = JSON.parse(JSON.stringify(this.userInfo))
      this.form.username = res.data.data.username
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  ::v-deep .el-form {
    width: 600px;
  }
}
</style>
