<template>
  <div class="mod-schedule">
    <el-form :inline="true" @keyup.enter.native="getJobList()">
      <el-form-item>
        <el-input v-model="beanName" placeholder="输入定时任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getJobList()" type="primary" icon="el-icon-search">查询</el-button>
        <el-button v-if="isAuth('job:schedule:save')" @click="addOrUpdateJob()" type="success">新增</el-button>
        <el-button v-if="isAuth('job:schedule:delete')" @click="deleteJob()" type="danger"
                   :disabled="selectedList.length <= 0">批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      :data="jobList"
      v-loading="jobListLoading"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="jobId"
        header-align="center"
        align="center"
        width="50"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="beanName"
        header-align="center"
        align="center"
        label="任务名称">
      </el-table-column>
      <el-table-column
        prop="cronExpression"
        header-align="center"
        align="center"
        label="cron达式">
      </el-table-column>
      <el-table-column
        prop="params"
        header-align="center"
        align="center"
        label="参数">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="任务描述">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="任务状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            disabled
            active-value="0"
            inactive-value="1"
            active-color="#F56C6C"
            inactive-color="#409EFF">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('job:schedule:update')" @click="addOrUpdateJob(scope.row.jobId)" type="text"  size="small">新增</el-button>
          <el-button v-if="isAuth('job:schedule:delete')" @click="deleteJob(scope.row.jobId)" type="text"  size="small">删除</el-button>
          <el-button v-if="isAuth('job:schedule:pause')" type="text" size="small" @click="pauseJob(scope.row.jobId)">暂停</el-button>
          <el-button v-if="isAuth('job:schedule:resume')" type="text" size="small" @click="resumeJob(scope.row.jobId)">恢复</el-button>
          <el-button v-if="isAuth('job:schedule:run')" type="text" size="small" @click="runJob(scope.row.jobId)">立即执行</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center;margin-top: 20px"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalPage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'schedule',
  data () {
    return {
      beanName: '',
      selectedList: [],
      jobList: [],
      jobListLoading: false,
      totalPage: 0, // 记录总条数
      pageSize: 10, // 每页记录数据
      pageIndex: 1 // 当前页面数
    }
  },
  activated () {
    this.getJobList()
  },
  methods: {
    getJobList: function () {
      this.jobListLoading = true
      let data = {
        beanName: this.beanName,
        page: this.pageIndex,
        limit: this.pageSizes
      }
      this.$api.get('/job/schedule/list', data)
        .then(res => {
          if (res) {
            console.log(res)
            this.jobList = res.list
            this.totalPage = res.totalPage
          } else {
            this.jobList = []
            this.totalPage = 0
          }
          this.jobListLoading = false
        })
    },
    addOrUpdateJob: function (val) {

    },
    deleteJob: function (val) {

    },
    handleSelectionChange: function (val) {
      this.selectedList = val
    },
    handleSizeChange: function (val) {
      this.pageIndex = 1
      this.pageSizes = val
    },
    handleCurrentChange: function (val) {
      this.pageIndex = val
    },
    // 暂停任务
    pauseJob: function (jobId) {

    },
    // 恢复任务
    resumeJob: function (jobId) {

    },
    // 执行任务
    runJob: function (jobId) {

    }
  }
}
</script>

<style scoped>

</style>
