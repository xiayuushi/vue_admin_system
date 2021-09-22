<template>
  <el-card class="employees-container">
    <!-- 顶部 -->
    <TipInfo class="tip-info">
      <template #right>
        <el-button type="primary" @click="uploadExcel">导入</el-button>
        <el-button type="primary" @click="addClick">+ 新增员工</el-button>
      </template>
    </TipInfo>
    <!-- 表格 -->
    <el-table
      v-loading="loading"
      :data="list"
      border
      style="width: 100%"
      lazy
      highlight-current-row
    >
      <el-table-column label="序号" prop="id" width="80" align="center">
        <template v-slot="{ $index }">{{
          (pagination.page - 1) * pagination.size + $index + 1
        }}</template>
      </el-table-column>
      <el-table-column label="姓名" prop="username" align="center" />
      <el-table-column label="手机号" prop="mobile" />
      <el-table-column label="工号" prop="workNumber" width="100" />
      <el-table-column
        label="聘用形式"
        prop="formOfEmployment"
        align="center"
        width="100px"
      >
        <template v-slot="{ row }">{{
          row.formOfEmployment | formatHireType
        }}</template>
      </el-table-column>
      <el-table-column label="部门" prop="departmentName" align="center" />
      <el-table-column label="入职时间" prop="timeOfEntry" width="100">
        <template v-slot="{ row }">{{ row.timeOfEntry | formatTime }}</template>
      </el-table-column>
      <el-table-column
        label="是否在职"
        prop="formOfEmployment"
        align="center"
        width="100"
      />
      <el-table-column
        label="状态"
        prop="formOfEmployment"
        align="center"
        width="100"
      />
      <el-table-column label="操作" prop="username" width="300" align="center">
        <template v-slot="{ row }">
          <el-button type="text">查看</el-button>
          <el-button type="text">转正</el-button>
          <el-button type="text">调岗</el-button>
          <el-button type="text">离职</el-button>
          <el-button type="text">角色</el-button>
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
  </el-card>
</template>

<script>
import { sysUser, sysUserDel } from '@/api/employees'
import add from './components/add'
export default {
  components: { add },
  data () {
    return {
      showAdd: false, // 弹出新增框
      list: [
        // 员工信息
        {
          correctionTime: '2018-11-30', // 离开时间
          departmentName: '总裁办', // 部门
          formOfEmployment: 1, // 聘用形式
          id: '604f764971f93f3ac8f365c2', // id
          mobile: '13800000002', // 手机号
          password: 'e10adc3949ba59abbe56e057f20f883e', // 密码
          // 头像
          staffPhoto:
            'http://lbw-1307422960.cos.ap-nanjing.myqcloud.com/%E4%B8%89%E7%82%AE.jpg',
          timeOfEntry: '2018-10-31T16:00:00.000Z', // 入职时间
          username: '王益区12', // 姓名
          workNumber: '92220' // 工号
        }
      ],
      pagination: {
        // 分页器
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
    uploadExcel () {
      this.$router.push('/excel?redirect=' + this.$route.fullPath)
    },
    // 新增员工
    addClick () {
      this.showAdd = true
    },
    // 删除当前列表项
    async del (id) {
      try {
        await this.$confirm('是否删除该项?', '标题')
        this.loading = true
        await sysUserDel(id)

        this.loading = false
        this.$message.success('删除成功')

        if (this.list.length === 1 && this.pagination.page !== 1) {
          this.pagination.page =
            this.pagination.page < 0 ? 1 : this.pagination.page - 1
        }
        this.getUserList(this.pagination)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取员工列表
    async getUserList (data) {
      const res = await sysUser({
        page: this.pagination.page,
        size: this.pagination.size
      })
      if (res.data.code === 10000) {
        this.list = res.data.data.rows
        this.pagination.total = res.data.data.total
      }
    },
    // 页容量改变
    handleSizeChange (v) {
      this.pagination.size = v
      this.pagination.page = 1
      this.getUserList(this.pagination)
    },
    // 页码改变
    handleCurrentChange (v) {
      this.pagination.page = v
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
}
</style>
