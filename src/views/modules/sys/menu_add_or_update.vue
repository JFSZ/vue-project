<template>
    <el-dialog
      :title="!menuForm.id ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible"
    width="620px">
      <el-form ref="menuForm" :model="menuForm" :rules="rules" @keyup.enter.native="saveOrUpdate()" label-width="80px" size="small">
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="menuForm.type">
            <el-radio v-for="(type, item) in menuForm.typeList" :label="item" :key="item">{{type}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuForm.typeList[menuForm.type] + '名称'" prop="name">
          <el-input v-model="menuForm.name" :placeholder="menuForm.typeList[menuForm.type] + '名称'"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
          <el-popover
            width="200"
            ref="menuListPopover"
            placement="bottom-start"
            trigger="click">
              <el-tree
              :data="menuList"
              :props="menuListTreeProps"
              node-key="menuId"
              ref="menuListTree"
              accordion
              @current-change="menuListTreeCurrentChangeHandle"
              :highlight-current="true">
              </el-tree>
          </el-popover>
          <el-input v-model="menuForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
        </el-form-item>
        <el-form-item v-if="menuForm.type === 1" label="菜单URL" prop="url">
          <el-input v-model="menuForm.url" placeholder="菜单路由"></el-input>
        </el-form-item>
        <el-form-item v-if="menuForm.type !== 0" label="授权标识" prop="perms">
          <el-input v-model="menuForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
        </el-form-item>
        <el-form-item v-if="menuForm.type !== 2" label="排序号" prop="orderNum">
          <el-input-number v-model="menuForm.orderNum" controls-position="right" :min="0" label="排序号"></el-input-number>
        </el-form-item>
        <el-form-item v-if="menuForm.type !== 2" label="菜单图标" prop="icon">
          <el-popover
            ref="iconListPopover"
            placement="bottom-start"
            trigger="click"
            popper-class="mod-menu__icon-popover">
            <div class="mod-menu__icon-inner">
              <div class="mod-menu__icon-list">
                <el-button
                  v-for="(item, index) in iconList"
                  :key="index"
                  @click="iconActiveHandle(item)"
                  :class="{ 'is-active': item === menuForm.icon }">
                  <icon-svg :name="item"></icon-svg>
                </el-button>
              </div>
            </div>
          </el-popover>
          <el-input v-model="menuForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称"
                    class="icon-list__input"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确定</el-button>
    </span>
    </el-dialog>
</template>

<script>
import Icon from '@/icons'
import { treeDataTranslate } from '@/utils'
export default {
  name: 'menu_add_or_update',
  data () {
    var validateUrl = (rule, value, callback) => {
      if (this.menuForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      menuForm: {
        typeList: ['目录', '菜单', '按钮'],
        id: 0,
        name: '',
        url: '',
        icon: '',
        perms: '',
        type: 1,
        orderNum: 0,
        parentId: 0,
        parentName: '',
        iconList: []
      },
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      rules: {
        name: [
          {required: true, message: '菜单名称不能为空', trigger: 'blur'}
        ],
        parentName: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
        url: [
          { validator: validateUrl, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.iconList = Icon.getNameList()
  },
  methods: {
    init: function (val) {
      this.menuForm.id = val || 0
      this.$api.get('/sys/menu/select')
        .then(res => {
          if (Object.is(res.code, 0)) {
            this.menuList = treeDataTranslate(res.menuList, 'menuId')
          }
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['menuForm'].resetFields()
          })
        }).then(() => {
          if (!this.menuForm.id) {
            // 新增
            this.menuListTreeSetCurrentNode()
          } else {
            this.$api.get(`/sys/menu/info/${this.menuForm.id}`, null)
              .then(res => {
                console.log(res)
                if (Object.is(res.code, 0)) {
                  this.menuForm.id = res.sysMenu.menuId
                  this.menuForm.name = res.sysMenu.name
                  this.menuForm.type = res.sysMenu.type
                  this.menuForm.url = res.sysMenu.url
                  this.menuForm.parentId = res.sysMenu.parentId
                  this.menuForm.perms = res.sysMenu.perms
                  this.menuForm.icon = res.sysMenu.icon
                  this.menuForm.orderNum = res.sysMenu.orderNum
                  this.menuListTreeSetCurrentNode()
                }
              })
          }
        })
    },
    // 修改/保存
    saveOrUpdate: function () {
      this.$refs['menuForm'].validate(valid => {
        if (valid) {
          let data = {
            menuId: this.menuForm.id ? this.menuForm.id : undefined,
            name: this.menuForm.name,
            url: this.menuForm.url,
            type: this.menuForm.type,
            icon: this.menuForm.icon,
            perms: this.menuForm.perms,
            parentId: this.menuForm.parentId,
            orderNum: this.menuForm.orderNum
          }
          this.$api.post(this.menuForm.id ? '/sys/menu/update' : '/sys/menu/save', data)
            .then(res => {
              if (Object.is(res.code, 0)) {
                this.$message({
                  type: 'success',
                  message: (this.menuForm.id ? '更新' : '添加') + '成功!',
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
    iconActiveHandle: function (iconName) {
      this.menuForm.icon = iconName
    },
    menuListTreeSetCurrentNode: function () {
      this.$refs.menuListTree.setCurrentKey(this.menuForm.parentId)
      this.menuForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
    },
    //
    menuListTreeCurrentChangeHandle: function (data, node) {
      this.menuForm.parentId = data.menuId
      this.menuForm.parentName = data.name
    }
  }
}
</script>
<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
      > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      width: 458px;
      overflow: hidden;
    }
    &__icon-inner {
      width: 478px;
      max-height: 258px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
