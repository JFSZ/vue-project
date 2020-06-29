<template>
  <el-dialog
    :title="configForm.id ? '修改' : '新增' "
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="620px">
    <el-form :model="configForm" :rules="rules" ref="configForm" label-width="85px" size="small" :inline="true"
             @keyup.enter.native="saveOrUpdate">
      <el-form-item label="参数名称" prop="paramKey">
        <el-input v-model="configForm.paramKey" placeholder="参数名称"></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="paramValue">
        <el-input v-model="configForm.paramValue" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item label="参数描述" prop="remark">
        <el-input v-model="configForm.remark" placeholder="参数描述"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      configForm: {
        id: 0,
        paramKey: '',
        paramValue: '',
        remark: ''
      },
      visible: false,
      rules: {
        paramKey: [
          { required: true, message: '参数名称不能为空', trigger: 'blur' }
        ],
        paramValue: [
          { required: true, message: '参数值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init: function (id) {
      this.visible = true
      this.configForm.id = id || 0
      this.$nextTick(() => {
        this.$refs['configForm'].resetFields()
        if (this.configForm.id) {
          this.$api.get(`/sys/config/info/${this.configForm.id}`, null)
            .then(res => {
              if (Object.is(res.code, 0)) {
                this.configForm.paramKey = res.sysConfig.paramKey
                this.configForm.paramValue = res.sysConfig.paramValue
                this.configForm.remark = res.sysConfig.remark
              }
            })
        }
      })
    },
    saveOrUpdate: function (id) {
      let data = {
        id: this.configForm.id || undefined,
        paramKey: this.configForm.paramKey,
        paramValue: this.configForm.paramValue,
        remark: this.configForm.remark
      }
      this.$refs['configForm'].validate((valid) => {
        if (valid) {
          this.$api.post(this.configForm.id ? '/sys/config/update' : '/sys/config/save', data)
            .then(res => {
              if (Object.is(res.code, 0)) {
                this.$message({
                  type: 'success',
                  message: (this.configForm.id ? '更新' : '添加') + '成功!',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message({
                  type: 'error',
                  message: (this.configForm.id ? '更新' : '添加') + '失败!',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              }
            })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
