<template>
  <el-form label-width="160px" :model="companyInfo">
    <el-form-item label="企业名称">
      <el-input v-model="companyInfo.name" disabled />
    </el-form-item>
    <el-form-item label="公司地址">
      <el-input v-model="companyInfo.companyAddress" disabled />
    </el-form-item>
    <el-form-item label="公司电话">
      <el-input v-model="companyInfo.companyPhone" disabled />
    </el-form-item>
    <el-form-item label="邮箱">
      <el-input v-model="companyInfo.mailbox" disabled />
    </el-form-item>
    <el-form-item label="备注">
      <el-input v-model="companyInfo.remarks" disabled />
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data () {
    return {
      companyInfo: {
        // 公司信息
        name: '',
        companyAddress: '',
        companyPhone: '',
        mailbox: '',
        remarks: ''
      }
    }
  }
}
</script>

<style></style>
