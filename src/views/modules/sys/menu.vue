<template>
  <div class="mod-menu">
    <el-form>
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="success" @click="saveOrUpdate()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="menuList"
      v-loading="dataListLoading"
      row-key="menuId"
      :expand-row-keys="menuExpandKey"
      border>
        <el-table-column
        prop="name"
        label="菜单名称"
        header-align="center"
        width="200">
        </el-table-column>
      <el-table-column
        prop="parentName"
        label="上级菜单"
        header-align="center"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        label="图标"
        width="100"
        header-align="center"
        align="center">
          <template slot-scope="scope">
            <icon-svg :name="scope.row.icon || ''"></icon-svg>
          </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        width="120"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small" type="warning">目录</el-tag>
          <el-tag v-if="scope.row.type === 1" size="small">菜单</el-tag>
          <el-tag v-if="scope.row.type === 2" size="small" type="success">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        label="排序号"
        width="100"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="url"
        label="菜单URL"
        :show-overflow-tooltip="true"
        header-align="center"
        align="center"
        width="200">
      </el-table-column>
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        min-width="200"
        :show-overflow-tooltip="true"
        label="授权标识">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:menu:update')" @click="saveOrUpdate(scope.row.menuId)" type="primary" icon="el-icon-edit" size="small"></el-button>
          <el-button v-if="isAuth('sys:menu:delete')" @click="deleteMenu(scope.row.menuId)" type="danger" icon="el-icon-delete" size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update ref="AddOrUpdate" v-if="addOrUpdateVisible" @refreshDataList="getMenuList"></add-or-update>
  </div>
</template>
<script>
import { treeDataTranslate } from '@/utils'
import AddOrUpdate from './menu_add_or_update'
export default {
  data () {
    return {
      menuList: [], // 菜单列表
      selectedList: [], // 选择的Id列表
      menuForm: {},
      dataListLoading: false,
      addOrUpdateVisible: false,
      menuExpandKey: []
    }
  },
  activated () {
    this.getMenuList()
  },
  mounted () {
    // 写死默认展开行数。解决Tab切换时，表格样式错乱
    this.menuExpandKey.push('1')
  },
  components: {
    AddOrUpdate
  },
  methods: {
    getMenuList: function () {
      this.dataListLoading = true
      this.$api.get('/sys/menu/list', null)
        .then(res => {
          if (Object.is(res.code, 0)) {
            this.menuList = treeDataTranslate(res.menuList, 'menuId')
          } else {
            this.menuList = []
          }
          this.dataListLoading = false
        })
    },
    saveOrUpdate: function (val) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.AddOrUpdate.init(val)
      })
    },
    deleteMenu: function (val) {
      let data = val ? [val] : this.selectedList.map(item => {
        return item.menuId
      })
      console.log('===========' + val)
      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.post('/sys/menu/delete', JSON.stringify(data))
          .then(res => {
            if (Object.is(res.code, 0)) {
              this.$message({
                type: 'success',
                message: '删除成功!',
                duration: 1500,
                onClose: () => {
                  this.getMenuList()
                }
              })
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
      })
    }
  }
}
</script>
