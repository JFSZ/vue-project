<template>
  <el-dialog>
    <el-form :model="userForm" :rules="rules" ref="userForm" @keyup.enter.native="saveOrUpdate()" label-width="80px">
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
        <el-input v-model="userForm.roleList"></el-input>
      </el-form-item>
    </el-form>
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
      userForm: {
        id: 0,
        userName: '',
        password: '',
        confirmPassWord: '',
        email: '',
        mobile: '',
        status: 1,
        roleList: []
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
            'userRole': this.userForm.roleList
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
