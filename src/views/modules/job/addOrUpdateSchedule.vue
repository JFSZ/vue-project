<template>
  <el-dialog
    :title="jobForm.id ? '修改' : '新增' "
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="620px">
    <el-form :model="jobForm" :rules="rules" ref="roleForm" label-width="85px" size="small" :inline="true"
             @keyup.enter.native="saveOrUpdate">
      <el-form-item label="任务名称" prop="beanName">
        <el-input v-model="jobForm.beanName" placeholder="定时任务Bean名称"></el-input>
      </el-form-item>
      <el-form-item label="表达式" prop="cronExpression">
        <el-input v-model="jobForm.cronExpression" placeholder="定时任务表达式"></el-input>
      </el-form-item>
      <el-form-item label="任务参数" prop="params">
        <el-input v-model="jobForm.params" placeholder="定时任务参数"></el-input>
      </el-form-item>
      <el-form-item label="任务描述" prop="remark">
        <el-input v-model="jobForm.remark" placeholder="定时任务描述"></el-input>
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
  name: 'addOrUpdateSchedule',
  data () {
    return {
      rules: {
        beanName: [
          { required: true, message: '定时任务名称不能为空', trigger: 'blur' }
        ],
        cronExpression: [
          { required: true, message: '定时任务表达式不能为空', trigger: 'blur' }
        ]
      },
      jobForm: {
        id: 0,
        beanName: '',
        params: '',
        cronExpression: '',
        remark: '',
        status: ''
      },
      visible: false
    }
  },
  methods: {
    init: function (id) {
      this.jobForm.id = id || 0
      this.visible = true
      if (this.jobForm.id) {
        this.$api.get(`/job/schedule/info/${this.jobForm.id}`, null)
          .then(res => {
            this.jobForm.id = res.job.jobId
            this.jobForm.beanName = res.job.beanName
            this.jobForm.cronExpression = res.job.cronExpression
            this.jobForm.params = res.job.params
            this.jobForm.remark = res.job.remark
            this.jobForm.status =  res.job.status
          })
      }
    },
    saveOrUpdate: function () {
      let data = {
        jobId: this.jobForm.id || undefined,
        beanName: this.jobForm.beanName,
        cronExpression: this.jobForm.cronExpression,
        params: this.jobForm.params,
        remark: this.jobForm.remark,
        status: this.jobForm.status
      }
      this.$api.post(this.jobForm.id ? '/job/schedule/update' : '/job/schedule/save', data)
        .then(res => {
          if (Object.is(res.code, 0)) {
            this.$message({
              type: 'success',
              message: (this.jobForm.id ? '更新' : '添加') + '成功!',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          } else {
            this.$message({
              type: 'error',
              message: (this.jobForm.id ? '更新' : '添加') + '失败!',
              duration: 1500,
              onClose: () => {
                this.visible = false
                this.$emit('refreshDataList')
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
