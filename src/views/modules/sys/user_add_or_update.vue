<template>
  <el-dialog
    :title="!userForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="570px">
    <el-form :model="userForm" :rules="rules" ref="userForm" @keyup.enter.native="saveOrUpdate()" label-width="67px" size="small" :inline="true">
      <el-form-item label="用户名" >
        <el-input v-model="userForm.userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" >
        <el-input v-model="userForm.password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" >
        <el-input v-model="userForm.confirmPassWord"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" >
        <el-input v-model="userForm.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" >
        <el-input v-model="userForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="状态" >
        <el-input v-model="userForm.status"></el-input>
      </el-form-item>
      <el-form-item label="角色" >
        <el-select v-model="userForm.roleIdList"
           multiple
           collapse-tags
           style="margin-left: 20px;"
           placeholder="请选择" >
          <el-option v-for="role in roleList"
          :key="role.roleId"
          :label="role.roleName"
          :value="role.roleId">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="saveOrUpdate()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { isEmail, isMobile } from '@/utils/validate'
export default{
  data () {
    var validatePassWord = (rule, value, callback) => {
      if (!this.userForm.id && /\S/.test(value)) {
        callback(new Error('密码不能为空!'))
      } else {
        callback()
      }
    }
    var validateConfirm = (rule, value, callback) => {
      if (!Object.is(value, this.userForm.password)) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      userForm: {
        id: 0,
        userName: '',
        password: '',
        confirmPassWord: '',
        email: '',
        mobile: '',
        status: 1,
        roleIdList: []
      },
      rules: {
        userName: [
          {require: true, message: '请输入用户名', trigger: 'blur'},
          {max: 15, message: '用户名长度不可大于15', trigger: 'blur'}
        ],
        password: [
          {validator: validatePassWord, trigger: 'blur'}
        ],
        confirmPassWord: [
          {validator: validateConfirm, trigger: 'blur'}
        ],
        email: [
          {validator: validateEmail, trigger: 'blur'}
        ],
        mobile: [
          {validator: validateMobile, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init: function (userId) {
      this.userForm.id = userId || 0
      let data = {
        'userId': userId
      }
      this.$api.get('/sys/role/queryByUserId', data)
        .then(res => {
          if (Object.is(res.code, 0)) {
            this.roleList = res.list
          }
        }).then(res => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['userForm'].resetFields()
          })
        }).then(res => {
          if (this.userForm.id) {
            this.$api.get('/sys/user/info?userId=' + this.userForm.id, null)
              .then(res => {
                if (Object.is(res.code, 0)) {
                  this.userForm.userName = res.user.username
                  this.userForm.salt = res.user.salt
                  this.userForm.email = res.user.email
                  this.userForm.mobile = res.user.mobile
                  this.userForm.roleIdList = res.user.roleIdList
                  this.userForm.status = res.user.status
                }
              })
          }
        })
    },
    saveOrUpdate: function () {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {
          let data = {
            'id': this.userForm.id || undefined,
            'username': this.userForm.userName,
            'password': this.userForm.password,
            'email': this.userForm.email,
            'status': this.userForm.status,
            'mobile': this.userForm.mobile,
            'roleIdList': this.userForm.roleIdList
          }
          this.$api.post(this.userForm.id ? '/sys/user/update' : '/sys/user/save', data)
            .then(res => {
              if (Object.is(res.code, 0)) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 2000,
                  onClose: () => {
                    this.$emit('refreshDataList')
                  }
                })
              }
            })
        }
      })
    }
  }
}
</script>
