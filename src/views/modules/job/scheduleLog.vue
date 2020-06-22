<template>
  <el-dialog
    title="定时任务日志"
    width="70%"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form v-model="scheduleLogForm" @keyup.enter.native="getScheduleLogList()" :inline="true">
      <el-form-item>
        <el-input v-model="scheduleLogForm.queryKey" placeholder="输入任务名称/任务ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="scheduleLogForm.selectData"
          :editable="false"
          type="daterange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getScheduleLogList" icon="el-icon-search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      :data="scheduleLogList"
      v-loading="loadVisible"
      tooltip-effect="dark"
      height="460"
      style="width: 100%;">
      <el-table-column
        prop="logId"
        header-align="center"
        align="center"
        width="100"
        label="日志ID">
      </el-table-column>
      <el-table-column
        prop="jobId"
        header-align="center"
        align="center"
        width="100"
        label="任务ID">
      </el-table-column>
      <el-table-column
        prop="beanName"
        header-align="center"
        width="200"
        align="center"
        label="任务Bean名称">
      </el-table-column>
      <el-table-column
        prop="params"
        header-align="center"
        width="200"
        align="center"
        label="任务参数">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="任务状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" size="small">成功</el-tag>
          <el-tag v-else @click.native="showErrorInfo(scope.row.logId)" type="danger" size="small" style="cursor: pointer;">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="times"
        header-align="center"
        align="center"
        label="耗时(单位: 毫秒)">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="200"
        label="执行时间">
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
  </el-dialog>
</template>

<script>
export default {
  name: 'scheduleLog',
  data () {
    return {
      scheduleLogForm: {
        queryKey: '',
        selectData: []
      },
      scheduleLogList: [],
      loadVisible: false,
      visible: false,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0
    }
  },
  activated () {
    this.getScheduleLogList()
  },
  methods: {
    init: function () {
      this.visible = true
      this.scheduleLogForm.selectData = []
      this.getScheduleLogList()
    },
    getScheduleLogList: function () {
      this.loadVisible = true
      let data = {
        queryKey: this.scheduleLogForm.queryKey,
        limit: this.pageSize,
        page: this.pageIndex,
        selectDate: (this.scheduleLogForm.selectData && this.scheduleLogForm.selectData.length > 0) ? this.scheduleLogForm.selectData.join(',') : undefined
      }
      this.$api.get('/job/scheduleLog/list', data)
        .then(res => {
          if (res) {
            console.log(res)
            this.scheduleLogList = res.list
            this.totalPage = res.totalCount
          } else {
            this.scheduleLogList = []
            this.totalPage = 0
          }
          this.loadVisible = false
        }).catch((err) => {
          this.$message.error(err)
        })
    },
    handleSizeChange: function (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getScheduleLogList()
    },
    handleCurrentChange: function (val) {
      this.pageIndex = val
      this.getScheduleLogList()
    },
    showErrorInfo: function (logId) {
      this.$api.get(`/job/scheduleJob/info/${logId}`, null)
        .then(res => {
          if (Object.is(res.code, 0)) {
            this.$alert(res.log.err)
          } else {
            this.$message.error(res.log.err)
          }
        })
    }
  }
}
</script>

<style scoped>

</style>
