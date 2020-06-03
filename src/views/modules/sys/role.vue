<template>
  <div>
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
      :data="roleList"
      v-loading="userListLoading"
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
        label="描述">
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
          <el-button v-if="isAuth('sys:user:update')" @click="addOrUpdateUser(scope.row.userId)" type="primary" icon="el-icon-edit" size="small"></el-button>
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
export default {
  data () {
    return {
      dataForm: {
        roleName: ''
      },
      selectList: [], // 选中数据
      roleList: [],
      totalPage: 0, // 记录总条数
      pageSize: 10, // 每页记录数据
      pageIndex: 1 // 当前页面数
    }
  },
  activated () {
    this.getRoleList()
  },
  methods: {
    // 获取所有角色列表
    getRoleList: function () {
      let dataList = {
        page: this.pageIndex,
        limit: this.pageSize,
        roleName: this.dataForm.roleName ? this.dataForm.roleName : ''
      }
      this.$api.get('/sys/role/list', dataList)
        .then(res => {
          if (Object.is(res.code, 0)) {
            this.roleList = res.list
          }
        })
    },
    addOrUpdateRole: function () {

    },
    deleteRole: function () {

    },
    handleSelectionChange: function (val) {
      this.selectList = val
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
