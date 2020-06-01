<template>
  <el-dialog
    :title="!userForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="620px"
    append-to-body>
    <el-form :model="userForm" :rules="rules" ref="userForm" @keyup.enter.native="saveOrUpdate()" label-width="85px" size="small" :inline="true" >
      <el-form-item label="用户名" prop="userName">
        <el-input class="textarea" v-model="userForm.userName" placeholder="登录帐号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="userForm.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassWord">
        <el-input v-model="userForm.confirmPassWord" type="password" placeholder="确认密码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="userForm.email" placeholder="邮箱"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="userForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="状态" >
        <el-radio-group v-model="userForm.status">
          <el-radio :label="true">正常</el-radio>
          <el-radio :label="false">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色" prop="roleIdList" style="margin-bottom: 0;">
        <el-select v-model="userForm.roleIdList"
           multiple
           style="width: 450px"
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
    var validatePassword = (rule, value, callback) => {
      if (!this.userForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateConfirm = (rule, value, callback) => {
      if (!this.userForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.userForm.password !== value) {
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
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 15, message: '用户名长度不可大于15', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassWord: [
          { validator: validateConfirm, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {validator: validateEmail, trigger: 'blur'}
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {validator: validateMobile, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    init: function (userId) {
      this.userForm.id = userId || 0
      this.$api.get('/sys/role/queryByUserId', null)
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
            'userId': this.userForm.id || undefined,
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
    }
  }
}
</script>
