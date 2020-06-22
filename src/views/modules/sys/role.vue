<template>
  <div class="mod-role">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getRoleList()">
      <el-form-item>
        <el-input v-model="dataForm.roleName" placeholder="角色名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getRoleList()" type="primary" icon="el-icon-search">查询</el-button>
        <el-button v-if="isAuth('sys:role:save')" @click="addOrUpdateRole()" type="success">新增</el-button>
        <el-button v-if="isAuth('sys:role:delete')" @click="deleteRole()" type="danger"
                   :disabled="selectedList.length <= 0">批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      v-loading="dataListLoading"
      :data="roleList"
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
        prop="roleId"
        header-align="center"
        align="center"
        width="50"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="roleName"
        header-align="center"
        align="center"
        label="角色">
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="角色描述">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | formatDateTime}}</template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:role:update')" @click="addOrUpdateRole(scope.row.roleId)" type="primary" icon="el-icon-edit" size="small"></el-button>
          <el-button v-if="isAuth('sys:role:delete')" @click="deleteRole(scope.row.roleId)" type="danger" icon="el-icon-delete" size="small"></el-button>
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
    <role-add-or-update v-if="addOrUpdateVisible" ref="roleAddOrUpdate" @refreshDataList="getRoleList"></role-add-or-update>
  </div>
</template>
<script>
import roleAddOrUpdate from './role_add_or_update'
export default {
  data () {
    return {
      dataForm: {
        roleName: ''
      },
      selectedList: [], // 选中数据
      roleList: [], // 角色列表
      totalPage: 0, // 记录总条数
      pageSize: 10, // 每页记录数据
      pageIndex: 1, // 当前页面数
      addOrUpdateVisible: false,
      dataListLoading: false
    }
  },
  components: {
    roleAddOrUpdate
  },
  activated () {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色列表
    getRoleList: function () {
      this.dataListLoading = true
      let dataList = {
        page: this.pageIndex,
        limit: this.pageSize,
        roleName: this.dataForm.roleName ? this.dataForm.roleName : ''
      }
      this.$api.get('/sys/role/list', dataList)
        .then(res => {
          if (res) {
            this.roleList = res.list
            this.totalPage = res.totalCount
          } else {
            this.roleList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
    },
    // 新增/编辑
    addOrUpdateRole: function (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.roleAddOrUpdate.init(val)
      })
    },
    // 删除
    deleteRole: function (val) {
      let data = val ? [val] : this.selectedList.map(item => {
        return item.roleId
      })
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.post('/sys/role/delete', JSON.stringify(data))
          .then(res => {
            if (Object.is(res.code, 0)) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 1500,
                onClose: () => {
                  this.getRoleList()
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    handleSelectionChange: function (val) {
      this.selectedList = val
    },
    // 更改每页数目
    handleSizeChange: function (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getRoleList()
    },
    // 翻页
    handleCurrentChange: function (val) {
      this.pageIndex = val
      this.getRoleList()
    }
  }
}
</script>
