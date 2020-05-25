<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.username" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()" type="primary" icon="el-icon-search">查询</el-button>
        <el-button v-if="isAuth('sys:user:add')" @click="addUser()" type="success">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" @click="delUser()" type="danger"
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
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
        <template slot-scope="scope">{{scope.row.createTime | dataFormat}}</template>
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" @click="editUser(scope.row.userId)" type="text" size="small">编辑</el-button>
          <el-button v-if="isAuth('sys:user:delete')" @click="deleteUser(scope.row.userId)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
    this.getDataList()
  },
  methods: {
    // 获取用户列表
    getDataList () {
      this.userListLoading = true
      let dataList = {
        page: this.pageIndex,
        limit: this.pageSize,
        username: this.dataForm.userName
      }
      this.$api.get('/sys/user/list', dataList)
        .then(res => {
          console.log(res)
          if (res) {
            this.userList = res.list
            this.totalPage = res.totalPage
          }
          this.userListLoading = false
        }).catch()
    },
    // 新增用户
    addUser () {

    },
    // 批量删除用户
    delUser () {

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
    }
  }
}
</script>
