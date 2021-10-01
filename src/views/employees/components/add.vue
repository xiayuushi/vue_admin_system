<template>
  <el-dialog class="dialog-container" :visible="show" title="新增员工" @close="close">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="form.mobile" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="form.timeOfEntry" type="date" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="form.formOfEmployment">
          <el-option v-for="(item, index) in hireType" :key="index" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="form.workNumber" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-cascader value="form.departmentName" :options="departmentList" :props="props" @change="handleChange" />
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align:center">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { sysUserAdd } from '@/api/employees'
import { companyDepartment } from '@/api/departments'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      departmentList: [],
      form: {
        username: '',
        mobile: '',
        departmentName: [],
        workNumber: '',
        correctionTime: '', // 转正时间
        timeOfEntry: '', // 入职时间
        formOfEmployment: '' // 聘用形式
      },
      rules: {
        username: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        workNumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        departmentName: [{ required: true, message: '请选择部门', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '请选择入职时间', trigger: 'change' }],
        formOfEmployment: [{ required: true, message: '请选择聘用形式', trigger: 'change' }],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              validMobile(value)
                ? callback()
                : callback(new Error('请输入正确的手机号'))
            },
            trigger: 'blur'
          }
        ]
      },
      hireType: EmployeeEnum.hireType, // 引入本地资源进行实时渲染必须先在data中声明
      props: { label: 'name', value: 'id' } // 重新配置级联数据键值对
    }
  },
  created () {
    this.getdepartmentsList()
  },
  methods: {
    close () {
      this.$emit('update:show', false)
      this.$refs['form'].resetFields()
      this.form = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        timeOfEntry: '',
        correctionTime: '',
        departmentName: []
      }
    },

    submit () {
      this.$refs['form'].validate(async result => {
        if (result) {
          await sysUserAdd(this.form)
          this.$message.success('新增成功!')
          this.$emit('refresh')
          this.close()
        } else {
          this.$message.error('新增失败!')
        }
      })
    },

    async getdepartmentsList () {
      const res = await companyDepartment()
      const depts = this.processData(res.data.depts, '') // 获取部门列表 进行递归 得到级联选择器数据（部门列表中的树形结构数据）
      const _depts = this.processCascaderUndefined(depts) // 解决空级联无法选择的问题（将空字符置为undefined）
      this.departmentList = this.processCascaderData(_depts) // 整合为级联需要的数据格式只有id、name、children三项的数据
      this.departmentList = this.value2Label(this.departmentList) // 将value(id)置换为label(name)方便接口调用
    },

    // 1、树形结构数据整合 arr遍历的数据源数组 condition遍历条件
    processData (arr, condition) {
      return arr.filter(item => {
        if (item.pid === condition) {
          item.children = this.processData(arr, item.id)
          return true
        }
      })
    },

    // 2、处理空级联
    // 级联选择器中如果最后选项出现空会出现无法选择的bug
    // 必须将最后的空字符转成undefined
    processCascaderUndefined (arr) {
      arr.forEach(item => {
        if (item.children && item.children.length === 0) {
          item.children = undefined
        } else {
          this.processCascaderUndefined(item.children)
        }
      })
      return arr
    },

    // 3、整合为级联数据格式
    // 只有id、name、children三类key的多维数组形式
    processCascaderData (arr) {
      return arr.map(({ id, name, children }) =>
        children
          ? {
            id: id,
            name: name,
            children: this.processCascaderData(children)
          }
          : {
            id: id,
            name: name
          }
      )
    },

    // 4、将选中的级联数据value(id)显示为label(name)，以便符合接口需求
    // 当前接口需要的是 label(name)
    value2Label (arr) {
      arr.map(item => {
        // 对数据进行处理
        item.id = item.name
        if (item.children && item.children.length) {
          this.value2Label(item.children)
        }
      })
      return arr
    },

    handleChange (value) {
      this.form.departmentName = value.join('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  ::v-deep .el-dialog__header {
    background-color: #409eff;
    .el-dialog__title {
      color: #fff;
    }
    .el-dialog__headerbtn {
      .el-dialog__close {
        color: #fff;
      }
    }
  }
}
</style>
