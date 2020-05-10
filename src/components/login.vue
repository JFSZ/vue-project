<template>
  <el-form :rules="rules" class="login-container" label-position="left"
           label-width="0px" v-loading="loading">
    <h3 class="login_title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitClick" style="width: 100%">登录</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import SHA256 from 'js-sha256'
export default{
  data () {
    return {
      rules: {
        account: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        checkPass: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
      checked: true,
      loginForm: {
        username: 'sang',
        password: '123'
      },
      loading: false
    }
  },
  methods: {
    submitClick: function () {
      var _this = this
      this.loading = true
      let param = {
        username: _this.loginForm.username,
        password: SHA256(_this.loginForm.password)
      }
      this.$api.post('login', param, result => {
        if (result != null) {
          let code = result.code
          let token = result.data.token
          let userInfo = result.data.userInfo
          _this.$store.dispatch('getToken', token)
          _this.$store.dispatch('getUserInfo', userInfo)
          if (Object.is(code, 0)) {
            this.$confirm('欢迎登录博客系统!', '温馨提示', {
              confirmButtonText: '确定',
              type: 'success',
              callback: action => {
              }
            })
            _this.$router.push({path: '/home'})
          } else {
            _this.$message({type: 'error', message: result.message})
          }
        } else {
          _this.$message({type: 'error', message: '服务器繁忙,请稍后重试!'})
        }
      }, err => {
        if (err != null) {
          let code = err.code
          if (Object.is(code, 1)) {
            _this.$confirm(err.message, '提示', {
              confirmButtonText: '确定',
              type: 'warning'
            }).then(function () {
              location.reload()
            }, function () {
              location.reload()
            })
          }
        }
      })
    }
  }
}
</script>
<style>
  .login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
