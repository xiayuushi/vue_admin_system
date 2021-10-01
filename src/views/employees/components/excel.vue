<template>
  <el-card>
    <ExcelRead :before-upload="beforeUpload" :on-success="onSuccess" />
  </el-card>
</template>

<script>
import { sysUserBatch } from '@/api/employees'
export default {
  methods: {
    beforeUpload (file) {
      const limit2M = file.size / 1024 / 1024 < 2
      if (!limit2M) {
        this.$message.error('文件大小不能超过2M')
      }
      return limit2M // 必须 将上传前的设置return到外界 使用时才会根据验证是否进行excel上传
    },

    async onSuccess ({ header, results }) {
      console.log(results)
      // results是解析出的excel内容，
      // 解析出的格式： [{姓名: "张XX",工号:"123",...},{..}]
      // excel获取的字段是中文，但接口需要的是英文，因此必须统一字段名

      // 1、整合批量上传的接口参数，使之符合接口参数要求的格式
      const excelData = results.map(item => {
        // 当前excel内容字段 与 接口文档字段的对应关系（定义init对象字段时，必须以获取的中文字段在前）
        const init = {
          姓名: 'username',
          手机号: 'mobile',
          聘用形式: 'formOfEmployment',
          工号: 'workNumber',
          组织名称: 'departmentName',
          入职时间: 'timeOfEnter',
          转正时间: 'correctionTime'
        }

        const temp = {} // 定义空对象存放整合后的数据

        Object.keys(item).forEach(item2 => {
          // 将Excel的时间日期转成计算机的时间日期
          if (item2 === '入职时间' || item2 === '转正时间') {
            // st1、获取当前时间（天数）并转成时间戳（记得天数先减1再转成时间戳）
            const timestamp = (item[item2] - 1) * 24 * 60 * 60 * 1000 + 1
            // st2、转换成标准时间Date对象，以便使用Date对象的相关方法进行日期时间转换
            const time = new Date(timestamp)
            // st3、减去70的年份差后，并重新设置完整的年份后再转成标准时间
            // excel年份从1900开始计算，计算机的时间是1970年，因此需要减去70
            const resTime = new Date(time.setFullYear(time.getFullYear() - 70))
            temp[init[item2]] = resTime
          } else {
            temp[init[item2]] = item[item2]
          }
        })
        return temp
      })

      // 2、调用批量上传接口发请求
      await sysUserBatch(excelData)
      this.$message.success('批量导入成功！')
      // 需要在跳转到当前路由的前一个路由中设置
      // this.$router.push('/当前页路由?redirect='+this.$route.fullPath)
      // 后续就可以使用this.$router.push(this.$route.query.redirect)回到之前的路由页
      this.$router.push(this.$route.query.redirect)
    }
  }
}

</script>

<style lang="scss" scoped></style>
