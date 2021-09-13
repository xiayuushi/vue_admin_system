<template>
  <div class="setting">
    <!-- 卡片 -->
    <el-card>
      <!-- 页签 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="roles">
          <el-button
            type="primary"
            size="medium"
            @click="openDialog"
          >新增角色
          </el-button>
          <!-- 表格 -->
          <el-table :data="list">
            <el-table-column label="序号" prop="id">
              <!-- v-slot是作用域插槽，可以获取行数据row、列数据column、索引$index -->
              <!-- 假设：索引0 页容量5 页码2 求当前索引对应的序号（序号从1开始，答案6） -->
              <!-- 推算：页码是2，说明之前一页是满的5条，索引0说明在当前页是第一个 -->
              <!-- 序号 = (页码-1)*页容量 + 索引 + 1-->
              <template v-slot="{ $index }">{{
                (page.page - 1) * page.pageSize + $index + 1
              }}</template>
            </el-table-column>
            <el-table-column label="角色名称" prop="name" />
            <el-table-column label="描述" prop="description" />
            <el-table-column label="测试">
              <!-- slot="header"替换表头文字 -->
              <template slot="header" text-align="center" style="width:100%;">
                <span>操作</span>
              </template>
              <!-- 不写slot则替换内容区域 -->
              <template v-slot="{ row }">
                <div>
                  <el-button type="text">分配权限</el-button>
                  <el-button type="text" @click="edit(row)">修改</el-button>
                  <el-button type="text" @click="del(row)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrap">
            <!-- 分页 -->
            <!-- jumper是跳页、pager页码、sizes是页容量选框、total是总计、prev上一页、next下一页 -->
            <el-pagination
              class="el-pagination"
              background
              :current-page="page.page"
              :page-sizes="page.pageSizes"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total"
              prev-text="上一页"
              next-text="下一页"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="company">公司信息</el-tab-pane>
      </el-tabs>
    </el-card>
    <add ref="add" v-model="dialogShow" @refresh="getRole" />
  </div>
</template>

<script>
import { sysRole, sysRoleDel, sysRoleGet } from '@/api/setting'
import add from './components/add'
export default {
  components: { add },
  data () {
    return {
      roleInfo: '', // 获取角色详情
      dialogShow: false, // 对话框表单显示隐藏
      activeName: 'roles', // 默认选中的tab标签页
      list: [
        // // 表格数据
        // {
        //   id: 1, // 序号
        //   name: 'xxx', // 角色名称
        //   description: 'describe' // 描述
        // }
      ],
      page: {
        // 分页器数据
        total: 10, // 总条数
        page: 1, // 页码
        pageSize: 5, // 每页显示条数（页容量）
        pageSizes: [1, 2, 3, 4, 5, 6, 10, 20, 30, 40, 100] // 分页器可选容量
      }
    }
  },
  created () {
    this.getRole({
      page: this.page.page,
      pagesize: this.page.pageSize
    })
  },
  methods: {
    // 编辑更新
    // sysRoleEdit
    // 编辑表格当前行数据
    async edit (row) {
      this.dialogShow = true
      this.$refs.add.mode = 'edit'

      // A、使用已有数据来编辑
      // this.$refs.add.form = JSON.parse(JSON.stringify(row))

      // B、通过接口来编辑
      const res = await sysRoleGet(row.id)
      if (res.data.code === 10000) {
        this.$refs.add.form = res.data.data
      }
    },
    // 删除表格当前行数据
    async del (row) {
      try {
        await this.$confirm('是否删除当前角色?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        const res = await sysRoleDel(row.id)
        if (res.data.code === 10000) {
          this.$message.success('已删除该角色！')
          // 当前列表空了，页码往前翻一页
          // 调用接口前本地还未更新，
          // 因此本地剩下1条时，表示本地当前表格列表已经清空
          if (this.list.length === 1 && this.page.page !== 1) {
            this.page.page = this.page.page < 0 ? 1 : this.page.page - 1
          }
          this.getRole({
            page: this.page.page,
            pagesize: this.page.pageSize
          })
        }
      } catch {
        console.log(row)
      }
    },
    // 新增角色打开对话框表单
    openDialog () {
      this.$refs.add.mode = 'add'
      this.dialogShow = true
      this.$refs.add.form = {
        name: '',
        description: ''
      }
    },
    // 获取角色列表
    async getRole (v) {
      const res = await sysRole(v)
      if (res.data.code === 10000) {
        this.page.total = res.data.data.total
        this.list = res.data.data.rows
      }
    },
    // 每页显示数量（页容量）改变时触发
    handleSizeChange (val) {
      // 形参：当前页显示数量
      // 更新更改后的页容量
      this.page.pageSize = val
      // 页容量改变时 页码重置为第一页
      this.page.page = 1
      this.getRole({
        page: this.page.page,
        pagesize: this.page.pageSize
      })
    },
    // 当前页（页码）改变时触发
    handleCurrentChange (val) {
      // 形参：当前所在的页码
      // 更新更改后的页码
      this.page.page = val
      this.getRole({
        page: this.page.page,
        pagesize: this.page.pageSize
      })
    },
    // el-table表格内置函数
    handleClick (v, c) {
      // 第一参数：被选中的当前实例对象
      // 第二参数：光标信息
      // console.log(v)
      // console.log(c)
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
