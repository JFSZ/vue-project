<template>
   <div>
     <el-dialog
       title="上传"
       :close-on-click-modal="false"
       :visible.sync="visible"
       width="500px">
        <el-form ref="dataForm" :model="dataForm" label-width="80px" size="small">
          <el-form-item label="文件名">
            <el-input v-model="dataForm.name" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="上传">
            <el-upload
              ref="upload"
              :action="url"
              :before-upload="beforeUpload"
              :auto-upload="false"
              :headers="headers"
              :on-success="handleSuccess"
              :on-error="handleError"
              :limit="1">
              <div class="zz-upload"><i class="el-icon-upload"/>添加文件</div>
              <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
            </el-upload>
          </el-form-item>
        </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="visible = false">取消</el-button>
         <el-button type="primary" @click="upload()">确定</el-button>
       </div>
     </el-dialog>
   </div>
</template>

<script>
import store from '@/store'
export default {
  name: 'upload',
  data () {
    return {
      visible: false,
      dataForm: {
        name: ''
      },
      headers: {'token': store.getters.getToken},
      url: '',
      fileList: []
    }
  },
  activated: {

  },
  methods: {
    init: function (val) {
      this.url = this.$api.baseUrl + '/sys/oss/upload?name=' + this.dataForm.name
      this.visible = true
    },
    // 上传
    upload: function (val) {
      this.$refs.upload.submit()
    },
    beforeUpload: function (file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.dataForm.name = file.name
      return isLt2M
    },
    // 监听上传成功
    handleSuccess: function (response, file, fileList) {
      this.fileList = fileList
      if (response && response.code === 0) {
        this.$message({
          type: 'success',
          message: '上传成功!',
          duration: 1500,
          onClose: () => {
            this.visible = false
            this.$refs.upload.clearFiles()
            this.dataForm.name = ''
            this.$emit('refreshDataList')
          }
        })
      } else {
        this.$message.error(response.msg)
      }
    },
    // 监听上传失败
    handleError: function (e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    }
  }
}
</script>

<style scoped>
  .zz-upload {
    border: 1px dashed #c0ccda;
    border-radius: 5px;
    height: 45px;
    line-height: 45px;
    width: 368px;
  }
</style>
