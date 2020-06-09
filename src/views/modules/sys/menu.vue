<template>
  <div class="mod-user">
    <el-form>
      <el-form-item>
        <el-button v-if="isAuth('sys:menu:save')" type="success" @click="saveOrUpdate()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="meunList"
      row-key="menuId"
      border
      :tree-props="treeProps">
        <el-table-column
        prop="name"
        label="菜单名称"
        header-align="center"
        min-width="100">
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
        width="80"
        header-align="center"
        align="center">
          <template slot-scope="scope">
            <icon-svg :name="scope.row.icon"></icon-svg>
          </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
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
        width="80"
        header-align="center"
        align="center">
      </el-table-column>
      <el-table-column
        prop="url"
        label="菜单URL"
        :show-overflow-tooltip="true"
        header-align="center"
        align="center"
        width="150">
      </el-table-column>
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        width="200"
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
          <el-button v-if="isAuth('sys:menu:update')" type="text" size="small" @click="saveOrUpdate(scope.row.menuId)">修改</el-button>
          <el-button v-if="isAuth('sys:menu:delete')" type="text" size="small" @click="delete(scope.row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      meunList: [], // 菜单列表
      selectedList: [], // 选择的Id列表
      menuForm: {},
      treeProps: {
        children: 'children',
        hasChildren: 'hasChildren'
      }
    }
  },
  activated () {
    this.getMenuList()
  },
  methods: {
    getMenuList: function () {
      this.$api.get('/sys/menu/list', null)
        .then(res => {
          if (Object.is(res.code, 0)) {
            this.meunList = treeDataTranslate(res.menuList, 'menuId')
          } else {
            this.meunList = []
          }
        })
    },
    saveOrUpdate: function (val) {

    },
    delete: function () {

    }
  }
}
</script>
