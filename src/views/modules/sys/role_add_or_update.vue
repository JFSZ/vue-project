<template>
  <el-dialog
  :title="roleForm.id ? '修改' : '新增' "
  :close-on-click-modal="false"
  :visible.sync="visible"
  width="620px">
    <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="85px" size="small" :inline="true" @keyup.enter.native="saveOrUpdate">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="remark">
        <el-input v-model="roleForm.remark" placeholder="角色描述"></el-input>
      </el-form-item>
      <el-form-item label="角色权限">
        <el-tree
        :data="menuList"
        :load="getMenuList"
        :props="menuListProps"
        show-checkbox
        ref="menuListTree"
        accordion
        node-key="menuId"></el-tree>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  name: 'roleAddOrUpdate',
  data () {
    return {
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '角色描述不能为空', trigger: 'blur' }
        ]
      },
      menuList: [],
      visible: false,
      roleForm: {
        id: 0,
        roleName: '',
        remark: '',
        menuIdList: []
      },
      menuListProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  methods: {
    init: function (val) {
      this.$api.get('/sys/menu/queryByRoleId', null)
        .then(res => {
          console.log(res)
          if (Object.is(res.code, 0)) {
            console.log(res.menuList)
            this.menuList = treeDataTranslate(res.menuList, 'menuId')
            console.log(res.menuList)
          }
        }).then(res => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['roleForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([])
          })
        }).then(res => {
          if (this.roleForm.id) {
            this.$api.get('/sys/role/info?roleId=' + val, null)
              .then(res => {
                console.log(res)
                if (Object.is(res.code, 0)) {
                  this.roleForm.roleName = res.role.roleName
                  this.roleForm.remark = res.role.remark
                  this.roleForm.menuIdList = res.role.menuIdList
                }
              })
          }
        })
    },
    // 保存、更新用户角色
    saveOrUpdate: function () {

    },
    // 获取角色权限
    getMenuList: function () {

    }
  }
}
</script>
