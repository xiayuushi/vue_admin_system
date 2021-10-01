<template>
  <el-card class="employees-container">
    <!-- 顶部 -->
    <TipInfo class="tip-info">
      <template #right>
        <el-button type="primary" @click="toExcelUploadPage">导入</el-button>
        <el-button type="primary" @click="addEmployees">+ 新增员工</el-button>
      </template>
    </TipInfo>
    <!-- 表格 -->
    <el-table v-loading="loading" :data="list" border style="width: 100%" lazy highlight-current-row>
      <el-table-column label="序号" prop="id" width="80" align="center">
        <template v-slot="{ $index }">{{ (pagination.page - 1) * pagination.size + $index + 1 }}</template>
      </el-table-column>
      <el-table-column label="头像" prop="staffPhoto" align="center">
        <template v-slot="{ row }">
          <img v-imgerr="defaultImg" :src="row.staffPhoto" style="width:30px;height: 30px" @click="generateQRcode(row.staffPhoto)">
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="username" align="center" />
      <el-table-column label="手机号" prop="mobile" />
      <el-table-column label="工号" prop="workNumber" width="100" />
      <el-table-column label="聘用形式" prop="formOfEmployment" align="center" width="100px">
        <template v-slot="{ row }">{{ row.formOfEmployment | formatHireType }}</template>
      </el-table-column>
      <el-table-column label="部门" prop="departmentName" align="center" />
      <el-table-column label="入职时间" prop="timeOfEntry" width="100">
        <template v-slot="{ row }">{{ row.timeOfEntry | formatTime }}</template>
      </el-table-column>
      <el-table-column label="操作" prop="username" width="300" align="center">
        <template v-slot="{ row }">
          <el-button type="text" @click="lookDetail(row.id)">查看</el-button>
          <el-button type="text">转正</el-button>
          <el-button type="text">调岗</el-button>
          <el-button type="text">离职</el-button>
          <el-button type="text" @click="assignRole(row.id)">角色</el-button>
          <el-button type="text" @click="del(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination-self"
      background
      :current-page="pagination.page"
      :page-size="pagination.size"
      :total="pagination.total"
      :page-sizes="[1, 2, 5, 10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      prev-text="上一页"
      next-text="下一页"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 新增框表单 -->
    <add :show.sync="showAdd" @refresh="getUserList" />
    <!-- 二维码 -->
    <el-dialog :visible.sync="showCode" class="el-dialog-self" @close="closeQRCode">
      <canvas ref="qrcode" />
    </el-dialog>
    <!-- 分配角色 -->
    <role v-model="visible" :user-info="userInfo" />
  </el-card>
</template>

<script>
import Qrcode from 'qrcode'
import { sysUser, sysUserDel } from '@/api/employees'
import { sysUserId } from '@/api/user'
import add from './components/add'
import role from './components/role'
export default {
  components: { add, role },
  data () {
    return {
      userInfo: {},
      visible: false, // 角色分配显示隐藏
      showCode: false, // 二维码显示隐藏
      showAdd: false, // 新增框显示隐藏
      defaultImg: 'https://via.placeholder.com/30', // 图片出错加载的默认图片
      list: [
        // 员工信息
        {
          correctionTime: '2018-11-30', // 离开时间
          departmentName: '总裁办', // 部门
          formOfEmployment: 1, // 聘用形式
          id: '604f764971f93f3ac8f365c2', // id
          mobile: '13800000002', // 手机号
          password: 'e10adc3949ba59abbe56e057f20f883e', // 密码
          staffPhoto: 'https://via.placeholder.com/30', // 头像
          timeOfEntry: '2018-10-31T16:00:00.000Z', // 入职时间
          username: '王益区12', // 姓名
          workNumber: '92220' // 工号
        }
      ],
      pagination: {
        total: 1, // 数据总数
        page: 1, // 页码
        size: 10 // 页容量
      },
      loading: false // loading效果
    }
  },
  created () {
    this.getUserList(this.pagination)
  },
  methods: {
    async assignRole (id) {
      this.visible = true
      const res = await sysUserId(id)
      this.userInfo = res.data.data
    },
    closeQRCode () {
      this.showCode = false
    },
    generateQRcode (staffPhoto) {
      if (!staffPhoto) return
      this.showCode = true
      this.$nextTick(() => {
        // 必须使用$nextTick等canvas标签生成后再写入二维码，否则初次打开对话框看不到二维码
        Qrcode.toCanvas(this.$refs.qrcode, staffPhoto, {
          width: 300,
          height: 300
        })
      })
    },
    lookDetail (id) {
      this.$router.push('/detail/' + id)
    },
    toExcelUploadPage () {
      this.$router.push('/excel?redirect=' + this.$route.fullPath)
    },
    addEmployees () {
      this.showAdd = true
    },
    async del (id) {
      try {
        await this.$confirm('是否删除该项?', '标题')
        this.loading = true
        await sysUserDel(id)
        this.loading = false
        this.$message.success('删除成功')

        if (this.list.length === 1 && this.pagination.page !== 1) {
          this.pagination.page = this.pagination.page < 0 ? 1 : this.pagination.page - 1
        }
        this.getUserList(this.pagination)
      } catch (error) {
        console.log(error)
      }
    },
    async getUserList (data) {
      const res = await sysUser({
        page: this.pagination.page,
        size: this.pagination.size
      })
      this.list = res.data.data.rows
      this.pagination.total = res.data.data.total
    },
    // 页容量改变
    handleSizeChange (val) {
      this.pagination.size = val
      this.pagination.page = 1
      this.getUserList(this.pagination)
    },
    // 页码改变
    handleCurrentChange (val) {
      this.pagination.page = val
      this.getUserList(this.pagination)
    }
  }
}
</script>

<style lang="scss" scoped>
.employees-container {
  min-height: 800px;
  ::v-deep .pagination-self {
    text-align: center;
    margin-top: 10px;
  }
  ::v-deep .el-dialog-self {
    text-align: center;
    .el-dialog__header {
      padding: 0;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__headerbtn {
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 0;
    }
    .dialog-img {
      width: 100%;
      vertical-align: middle;
    }
  }
}
</style>
