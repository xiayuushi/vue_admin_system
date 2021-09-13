<template>
  <!-- 给el-dialog的visible属性添加.sync修饰符 可以在右上角x按钮关闭该对话框 -->
  <el-dialog
    :title="mode === 'edit' ? '编辑组织架构' : '新增组织架构'"
    :visible="openAdd"
    @close="closeAdd"
  >
    <el-form ref="form" :model="model" :rules="rules" label-width="100px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="model.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="model.code" />
      </el-form-item>
      <el-form-item label="负责人" prop="manager">
        <el-select v-model="model.manager" placeholder="请选择">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :value="item.username"
            :label="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="model.introduce" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="text-align: center" class="primary">
        <el-button @click="closeAdd">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {
  sysUserSimple,
  companyDepartmentAdd,
  companyDepartmentEdit
} from '@/api/departments'
export default {
  props: {
    openAdd: {
      // 父级传过来的控制显示与隐藏
      type: Boolean,
      default: null
    },
    initData: {
      // 父级传过来的所有部门信息
      type: Array,
      default: null
    }
  },
  data () {
    // 1、自定义规则验证 部门是否重复
    // 需要数据：所有部门列表、当前点击的那个部门信息
    var validateName = (rule, value, callback) => {
      // 情况1、新增表单时部门名称不能重复
      if (this.mode === 'add') {
        // st1、找出同一层级的子级部门：
        // （当前项点击新增，增加的是当前项的子级）
        // 遍历列表中pid（子级）与当前点击项的id确认同一层级的子级部门
        const xxx = this.initData.filter(
          item => item.pid === this.currentRow.id
        )
        // st2、查看部门名称是否重复
        // 新增时，所有都不能重复
        const bol = xxx.some(item => item.name === value)
        bol ? callback(new Error('已存在重复部门' + value)) : callback()
      } else {
        // 情况2、编辑表单时部门名称可以重复
        // st1、找出自己的同级部门：
        // （当前项点击编辑，编辑的是当前项自己）
        // 遍历列表中pid（子级）与当前点击项的pid确认同一层级部门
        const xxx = this.initData.filter(
          item => item.pid === this.currentRow.pid
        )
        const bol = xxx.some(
          // st2、查看部门名称是否重复
          // 编辑时，因为自己可以重复，因此要排除自己，但其他不能重复
          item => item.name === value && item.id !== this.currentRow.id
        )

        bol ? callback(new Error('已存在重复部门' + value)) : callback()
      }
    }

    // 2、自定义验证规则 编码是否重复
    var validateCode = (rule, value, callback) => {
      // 情况1、新增时，所有部门的编码都不可重复
      if (this.mode === 'add') {
        const bol = this.initData.some(item => item.code === value)
        bol ? callback(new Error('已存在重复编码')) : callback()
      } else {
        // 情况2、编辑时，自身编码可以重复，因此需要排除自身
        const bol = this.initData.some(
          item => item.code === value && item.id !== this.currentRow.id
        )
        bol ? callback(new Error('已存在重复编码')) : callback()
      }
    }
    return {
      mode: 'add', // 定义标识符用于区分 edit编辑表单 与 add新增表单
      options: [], // 下拉框选项
      currentRow: '', // 当前行的数据
      model: {
        // 表单数据
        name: '',
        code: '',
        manager: '',
        introduce: '',
        pid: '' // 当前点击项的id
      },
      rules: {
        // 表单验证规则
        name: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 1, max: 50, message: '请输入1-50位字符', trigger: 'blur' },
          { validator: validateName }
        ],
        code: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 1, max: 50, message: '请输入1-50位字符', trigger: 'blur' },
          {
            validator: validateCode
          }
        ],
        // 下拉选项 el-option 的触发条件只能是 change ，如果设置为blur则无效
        manager: [{ required: true, message: '必填', trigger: 'change' }],
        introduce: [
          { required: true, message: '必填', trigger: 'blur' },
          { min: 1, max: 300, message: '请输入1-300位字符', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    // 侦听oppAdd
    openAdd: {
      handler (newVal) {
        if (newVal === false) {
          // 重置表单（回归到 第一次时的状态、与清空还是有区别的）
          // 例如：第一次是编辑表单，那么该方法会重置为有数据的状态
          // 例如：第一次是新增表单，那么该方法会重置为无数据的状态
          this.$refs['form'].resetFields()

          // 手动清空数据
          // （之所以不直接将对象this.model={} 是因为渲染HTML结构必须要相应字段）
          this.model = {
            name: '',
            code: '',
            manager: '',
            introduce: '',
            pid: '',
            id: ''
          }
        }
      }
    }
  },
  created () {
    // 打开表单
    this.openForm()
    // 获取员工列表用于option选项
    this.getUserList()
  },
  mounted () {},
  destroyed () {
    this.$bus.$off('openAddFn')
  },
  methods: {
    closeAdd () {
      this.$emit('update:openAdd', false)
    },
    async getUserList () {
      const res = await sysUserSimple()
      if (res.data.code === 10000) {
        this.options = res.data.data
      }
    },
    submit () {
      this.$refs['form'].validate(async result => {
        if (result) {
          // 新增确认
          if (this.mode === 'add') {
            this.addDepartment()
          } else {
            // 编辑确认
            this.editDepartment()
          }
          // 刷新父级
          // this.$parent.getList() // 该方式有弊端不建议使用
          this.$emit('refresh') // 先在父级定义@refresh="getList"后通过$emit调用
          this.closeAdd() // 关闭弹窗
        }
      })
    },
    openForm () {
      // 打开弹框接收数据
      this.$bus.$on('openAddFn', (v1, v2, v3 = 'add') => {
        // v1 接收兄弟下拉组件传递的 显示隐藏的布尔值实参
        // v2 接收兄弟下拉组件传递的 当前点击行的部门信息
        // v3 接收兄弟下拉组件传递的 默认值为add表示是新增表单
        this.$emit('update:openAdd', v1) // 子组件下拉组件打开弹框
        this.currentRow = v2 // 存储传入的当前点击项信息
        this.mode = v3 // 如果有传v3，则v3的默认值'add'会被覆盖
        // 如果是编辑表单
        if (v3 === 'edit') {
          this.model = JSON.parse(JSON.stringify(v2))
        }
      })
    },
    // 部门新增
    async addDepartment () {
      const res = await companyDepartmentAdd({
        ...this.model,
        pid: this.currentRow.id
      })
      if (res.data.code === 10000) {
        this.$message.success('新增成功')
      }
    },
    // 部门编辑
    async editDepartment () {
      const res = await companyDepartmentEdit({
        name: this.model.name,
        code: this.model.code,
        manager: this.model.manager,
        introduce: this.model.introduce,
        id: this.model.id
      })
      if (res.data.code === 10000) {
        this.$message.success('编辑成功')
      }
    }
  }
}
</script>

<style></style>
