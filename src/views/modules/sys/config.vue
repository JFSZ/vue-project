<template>
  <div class="mod-config">
    <el-form :model="configForm" :inline="true" @keyup.enter.native="getConfigList()">
      <el-form-item>
        <el-input v-model="configForm.paramKey" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getConfigList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateConfig()">新增</el-button>
        <el-button type="danger" @click="deleteConfig()" :disabled="selectedList.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="configList"
        border
        v-loading="configListLoading"
        @selection-change="handleSelectionChange"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="id"
          header-align="center"
          align="center"
          width="80"
          label="ID">
        </el-table-column>
        <el-table-column
          prop="paramKey"
          header-align="center"
          align="center"
          label="参数名">
        </el-table-column>
        <el-table-column
          prop="paramValue"
          header-align="center"
          align="center"
          label="参数值">
        </el-table-column>
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          label="备注">
        </el-table-column>
        <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateConfig(scope.row.id)">修改</el-button>
            <el-button type="text" size="small" @click="deleteConfig(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getConfigList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './config_add_or_update'
export default {
  name: 'config',
  data () {
    return {
      configForm: {
        paramKey: ''
      },
      configList: [],
      selectedList: [],
      addOrUpdateVisible: false,
      configListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  activated () {
    this.getConfigList()
  },
  components: {
    AddOrUpdate
  },
  methods: {
    getConfigList: function () {
      let param = {
        paramKey: this.configForm.paramKey,
        page: this.pageIndex,
        limit: this.pageSizes
      }
      this.$api.get('/sys/config/list', param)
        .then(res => {
          if (res) {
            this.configList = res.list
            this.totalPage = res.totalCount
          } else {
            this.configList = []
            this.totalPage = 0
          }
          this.configListLoading = false
        })
    },
    sizeChangeHandle: function (val) {
      this.pageSize = val
      this.pageIndex = 1
    },
    currentChangeHandle: function (val) {
      this.pageIndex = val
    },
    handleSelectionChange: function (val) {
      this.selectedList = val
    },
    addOrUpdateConfig: function (ids) {
      this.$nextTick(() => {
        this.addOrUpdateVisible = true
        this.$refs.addOrUpdate.init()
      })
    },
    deleteConfig: function (ids) {
      let data = ids ? [ids] : this.selectedList.map(item => {
        return item.id
      })
      this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.post('/sys/config/delete', JSON.stringify(data))
          .then(res => {
            if (Object.is(res.code, 0)) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 1500,
                onClose: () => {
                  this.getConfigList()
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          }).catch((err) => {
            this.$message.error(err)
          })
      })
    }
  }
}
</script>

<style scoped>

</style>
