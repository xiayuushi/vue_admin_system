<template>
  <div class="setting">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色管理" name="roles">
          <el-button type="primary" size="medium" @click="add">新增角色</el-button>
          <el-table :data="list">
            <el-table-column label="序号" prop="id">
              <!-- v-slot是作用域插槽，可以获取行数据row、列数据column、索引$index -->
              <!-- 假设：索引0 页容量5 页码2 求当前索引对应的序号（序号从1开始，答案6） -->
              <!-- 推算：页码是2，说明之前一页是满的5条，索引0说明在当前页是第一个 -->
              <!-- 序号 = (页码-1)*页容量 + 索引 + 1-->
              <template v-slot="{ $index }">{{ (pagination.page - 1) * pagination.pageSize + $index + 1 }}</template>
            </el-table-column>
            <el-table-column label="角色名称" prop="name" />
            <el-table-column label="描述" prop="description" />
            <el-table-column>
              <!-- v-slot:header 简写 #header 具名插槽替换表头文字 -->
              <template #header text-align="center" style="width:100%;">
                <span>操作</span>
              </template>
              <!-- v-slot:default="xxx" 简写 v-slot="xxx" 是默认作用域插槽 -->
              <template v-slot="{ row }">
                <div>
                  <el-button type="text" @click="setPower(row)">分配权限</el-button>
                  <el-button type="text" @click="edit(row)">修改</el-button>
                  <el-button type="text" @click="del(row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrap">
            <el-pagination
              class="el-pagination"
              background
              :current-page="pagination.page"
              :page-sizes="pagination.pageSizes"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total"
              prev-text="上一页"
              next-text="下一页"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="company">
          <!-- 异步动态组件 -->
          <component :is="'company'" ref="company" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <component :is="'add'" ref="add" v-model="visible" @refresh="getRole" />
    <component :is="'power'" ref="power" v-model="powerVisible" />
  </div>
</template>

<script>
import { sysRole, sysRoleIdDelete, sysRoleId, getCompany } from '@/api/setting'
import { mapGetters } from 'vuex'

export default {
  components: {
    add: () => import('./components/add'),
    company: () => import('./components/company'),
    power: () => import('./components/power')
  },
  data () {
    return {
      roleInfo: '', // 获取角色详情
      visible: false, // 添加或编辑面板显示隐藏
      powerVisible: false, // 权限分配面板显示隐藏
      activeName: 'roles', // 默认选中的tab标签页
      list: [],
      pagination: {
        total: 10, // 总条数
        page: 1, // 页码
        pageSize: 5, // 每页显示条数（页容量）
        pageSizes: [1, 2, 3, 4, 5, 6, 10, 20, 30, 40, 100] // 分页器可选容量
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created () {
    this.getRole({
      page: this.pagination.page,
      pagesize: this.pagination.pageSize
    })
    this.getCompanyInfo()
  },
  methods: {
    async getRole (v) {
      const res = await sysRole(v)
      this.pagination.total = res.data.total
      this.list = res.data.rows
    },
    async getCompanyInfo () {
      const res = await getCompany(this.userInfo.companyId)
      this.$refs.company.companyInfo = res.data
    },
    add () {
      this.$refs.add.mode = 'add'
      this.visible = true
      this.$refs.add.form = { name: '', description: '' }
    },
    async edit (row) {
      this.$refs.add.mode = 'edit'
      this.visible = true

      // A、当前数据完整：使用已有数据来编辑
      // this.$refs.add.form = JSON.parse(JSON.stringify(row))

      // B、当前数据不完整：通过接口来编辑
      const res = await sysRoleId(row.id)
      this.$refs.add.form = res.data
    },
    async del (row) {
      try {
        await this.$confirm('是否删除当前角色?', '提示')
        await sysRoleIdDelete(row.id)
        this.$message.success('删除角色成功！')
        // 当前列表空了，页码往前翻一页
        // 调用接口前本地还未更新，
        // 因此本地剩下1条时，表示本地当前表格列表已经清空
        if (this.list.length === 1 && this.pagination.page !== 1) {
          this.pagination.page = this.pagination.page < 0 ? 1 : this.pagination.page - 1
        }
        this.getRole({
          page: this.pagination.page,
          pagesize: this.pagination.pageSize
        })
      } catch {
        console.log('用户取消了操作')
      }
    },
    setPower (row) {
      this.powerVisible = true
      this.$refs['power'].getRoleDetail(row.id)
    },
    // 每页显示数量（页容量）改变时触发
    handleSizeChange (val) {
      // 形参：当前页显示数量
      // 更新更改后的页容量
      this.pagination.pageSize = val
      // 页容量改变时 页码重置为第一页
      this.pagination.page = 1
      this.getRole({
        page: this.pagination.page,
        pagesize: this.pagination.pageSize
      })
    },
    // 当前页（页码）改变时触发
    handleCurrentChange (val) {
      // 形参：当前所在的页码
      // 更新更改后的页码
      this.pagination.page = val
      this.getRole({
        page: this.pagination.page,
        pagesize: this.pagination.pageSize
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.setting {
  .el-pagination {
    text-align: center;
  }
  .pagination-wrap {
    padding-top: 12px;
  }
}
</style>
