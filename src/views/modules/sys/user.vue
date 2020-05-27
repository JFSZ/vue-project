<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getUserList()">
      <el-form-item>
        <el-input v-model="dataForm.username" placeholder="用户名/手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getUserList()" type="primary" icon="el-icon-search">查询</el-button>
        <el-button v-if="isAuth('sys:user:save')" @click="addUser()" type="success">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" @click="batchDelUser()" type="danger"
                   :disabled="selectedList.length <= 0">批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="selectedList"
      border
      :data="userList"
      v-loading="userListLoading"
      tooltip-effect="dark"
      @select-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="userId"
        header-align="center"
        align="center"
        width="50"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱">
      </el-table-column>
      <el-table-column
        prop="mobile"
        header-align="center"
        align="center"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#00A854"
            active-value="0"
            active-text="启用"
            inactive-color="#ff4949"
            inactive-text="禁用"
            inactive-value="1"
            @change="editUser()">
          </el-switch>
        </template>
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
          <el-button v-if="isAuth('sys:user:update')" @click="editUser(scope.row.userId)" type="primary" icon="el-icon-edit" size="small"></el-button>
          <el-button v-if="isAuth('sys:user:delete')" @click="deleteUser(scope.row.userId)" type="danger" icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
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
export default{
  data () {
    return {
      dataForm: {
        username: ''
      },
      userList: [], // 用户列表
      selectedList: [], // 选中的数据
      userListLoading: false,
      totalPage: 0, // 记录总条数
      pageSize: 10, // 每页记录数据
      pageIndex: 1 // 当前页面数
    }
  },
  // 在vue对象存活的情况下，进入当前存在activated()函数的页面时，
  // 一进入页面就触发；可用于初始化页面数据等。这个用于每次只要进入这个组件页面就初始化页面，可以用于列表数据等的刷新
  activated () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    getUserList () {
      this.userListLoading = true
      let dataList = {
        page: this.pageIndex,
        limit: this.pageSize,
        username: this.dataForm.username ? this.dataForm.username : ''
      }
      this.$api.get('/sys/user/list', dataList)
        .then(res => {
          if (res) {
            this.userList = res.list
            this.totalPage = res.totalPage
          } else {
            this.userList = []
            this.totalPage = 0
          }
          this.userListLoading = false
        }).catch()
    },
    // 新增用户
    addUser () {

    },
    // 批量删除用户
    batchDelUser () {

    },
    // 选中事件
    handleSelectionChange: function (val) {
      this.selectedList = val
    },
    // 编辑用户信息
    editUser: function (userId) {
    },
    // 删除单个用户
    deleteUser: function (userId) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = [userId]
        this.$api.post('/sys/user/delete', data)
          .then(res => {
            if (Object.is(res.code, 0)) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          }).catch(
            this.$message({
              type: 'error',
              message: '系统异常!'
            })
          )
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange: function (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getUserList()
    },
    handleCurrentChange: function (val) {
      this.pageIndex = val
      this.getUserList()
    }
  }
}
</script>
