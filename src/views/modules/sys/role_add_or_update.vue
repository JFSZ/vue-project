<template>
  <el-dialog
    :title="roleForm.id ? '修改' : '新增' "
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="620px">
    <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="85px" size="small" :inline="true"
             @keyup.enter.native="saveOrUpdate">
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="remark">
        <el-input v-model="roleForm.remark" placeholder="角色描述"></el-input>
      </el-form-item>
      <el-form-item label="角色权限">
        <el-tree
          ref="menuListTree"
          :data="menuList"
          :default-checked-keys="roleForm.menuIdList"
          :load="getMenuList"
          :props="menuListProps"
          accordion
          show-checkbox
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
      this.roleForm.id = val || 0
      this.$api.get('/sys/menu/list', null)
        .then(res => {
          if (Object.is(res.code, 0)) {
            this.menuList = treeDataTranslate(res.menuList, 'menuId')
          }
        }).then(res => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['roleForm'].resetFields()
            this.$refs.menuListTree.setCheckedKeys([])
          })
        }).then(res => {
          if (this.roleForm.id) {
            this.$api.get('/sys/role/info?roleId=' + this.roleForm.id, null)
              .then(res => {
                if (Object.is(res.code, 0)) {
                  this.roleForm.roleName = res.role.roleName
                  this.roleForm.remark = res.role.remark
                  let newArr = []
                  res.role.menuIdList.forEach(item => {
                    this.checked(item, this.menuList, newArr)
                  })
                  this.roleForm.menuIdList = newArr
                }
              })
          }
        })
    },
    // 去除父节点半选中状态导致的回显问题。(导致全部选中)
    checked: function (id, data, newArr) {
      data.forEach(item => {
        if (item.menuId === id) {
          if (!item.children || item.children.length === 0) {
            newArr.push(item.menuId)
          }
        } else {
          if (item.children && item.children.length !== 0) {
            this.checked(id, item.children, newArr)
          }
        }
      })
    },
    // 保存、更新用户角色
    saveOrUpdate: function () {
      this.$refs['roleForm'].validate(valid => {
        if (valid) {
          let data = {
            roleId: this.roleForm.id || undefined,
            roleName: this.roleForm.roleName,
            remark: this.roleForm.remark,
            menuIdList: this.$refs.menuListTree.getCheckedKeys().concat(this.$refs.menuListTree.getHalfCheckedKeys())
          }
          this.$api.post(this.roleForm.id ? '/sys/role/update' : '/sys/role/save', data)
            .then(res => {
              if (Object.is(res.code, 0)) {
                this.$message({
                  type: 'success',
                  message: (this.roleForm.id ? '更新' : '添加') + '成功!',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              }
            })
        }
      })
    },
    // 获取角色权限
    getMenuList: function () {

    }
  }
}
</script>
