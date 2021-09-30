<template>
  <div class="upload">
    <!-- 上传：用于头像上传 有上传显示图片 无上传显示icon -->
    <el-upload
      class="avatar-uploader"
      action="#"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :http-request="httpRequest"
    >
      <img
        v-if="imageUrl.trim()"
        :src="imageUrl.trim()"
        class="avatar"
        @click.stop.prevent="imgClick"
      >
      <i v-else class="el-icon-plus avatar-uploader-icon" />
    </el-upload>
    <!-- 弹框：点击图片 放大预览图 -->
    <el-dialog
      :visible.sync="isShow"
      :show-close="false"
      class="el-dialog-self"
    >
      <div style="text-align:center">
        <img :src="imageUrl.trim()" class="dialog-img">
      </div>
    </el-dialog>
    <!-- icon：当有上传图片时 移入光标 显示icon 点击icon可以删除上传到图片 -->
    <i v-if="imageUrl.trim()" class="el-icon-close" @click="removeUpload" />
    <!-- 进度条：el-progress 为了显示效果给个动画 transition -->
    <transition name="xxx">
      <el-progress v-if="showProgress" :percentage="percent" />
    </transition>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
export default {
  name: 'FileUpload',
  props: {
    imageUrl: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      cos: '', // 接收SDK实例化对象
      isShow: false, // 弹窗放大显示预览图
      percent: 0, // 进度条百分比
      showProgress: false // 是否显示进度条
    }
  },
  created () {
    this.cos = new COS({
      SecretId: 'AKIDg7IDrEKAj01lEVWGkxtYw3tSlmWzA4h3', // 腾讯云APPID
      SecretKey: '6wVnoZ3FAoBH5csrZ0A3i6C2buvgASUF' // 腾讯云密钥
    })
  },
  methods: {
    removeUpload () {
      this.$emit('update:imageUrl', '')
    },
    imgClick () {
      this.isShow = true
    },
    beforeUpload (file) {
      const limit = file.size / 1024 < 500
      const type = file.type === ('image/jpeg' || 'image/png' || 'image/jpg')
      if (!type) {
        this.$message.error('只能传入 jpg | jpeg | png 格式的图片')
      }
      if (!limit) {
        this.$message.error('文件不能超过500KB')
      }
      // 符合条件，才会执行上传动作
      return type && limit
    },
    httpRequest (params) {
      this.showProgress = true // 上传时开启进度条
      this.cos.putObject(
        {
          Bucket: 'xxx-1259403839', // 腾讯云存储桶名称（必填）
          Region: 'ap-nanjing', // 腾讯云存储桶所在区域的英文名（必填）
          Key: params.file.name, // 上传到腾讯云的文件的名称（必填）
          StorageClass: 'STANDARD', // 固定写法 存储模式标准
          Body: params.file, // 上传文件对象
          onProgress: ProgressData => {
            // 上传进度相关
            // el-progress进度条数值是0-100 而当前SDK获取的是0-1 因此 *10
            this.percent = ProgressData.percent * 100
            if (ProgressData.percent === 1) {
              setTimeout(
                // 为了能够直观看到进度条加载效果给个延时器
                () => (this.showProgress = false), // 上传完成关闭进度条
                1000
              )
            }
          }
        },
        (err, data) => {
          // 上传到腾讯云存储桶服务器的状态（err失败，data成功）
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            // 修改预览图
            // this.imageUrl = `https://${data.Location}`
            // 考虑到使用v-model或者.sync时都是props传参
            // props传参如果子组件内部直接修改父组件传递的预览图数据会发生单向数据流报错
            this.$emit('update:imageUrl', `http://${data.Location}`)
          }
        }
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  position: relative;
  width: 178px;
  height: 178px;
  // el-upload
  ::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  // el-dialog
  ::v-deep .el-dialog-self {
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
  // 删除上传图的icon样式
  // 引入到父盒子时 显示子元素内容
  .el-icon-close {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
    padding: 5px;
    font-size: 20px;
    cursor: pointer;
  }
  &:hover {
    .el-icon-close {
      display: block;
    }
  }

  // el-progress
  ::v-deep .el-progress {
    position: absolute;
    left: 0px;
    bottom: -20px;
    display: flex;
    .el-progress-bar {
      width: 178px;
      padding-right: 0;
      margin-right: 0;
      box-sizing: border-box;
    }
  }
  // el-progress 动画效果
  .xxx-enter-active,
  .xxx-leave-active {
    transition: all 2s;
  }
  .xxx-enter,
  .xxx-leave-to {
    opacity: 0;
  }
}
</style>
