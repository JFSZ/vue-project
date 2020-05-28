<template>
  <el-dialog>
    <el-form :model="userForm" :rules="rules" ref="userForm" @keyup.enter.native="saveOrUpdate()" label-width="80px">
      <el-form-item label="用户名" >
        <el-input v-model="userName"></el-input>
      </el-form-item>
      <el-form-item label="密码" >
        <el-input v-model="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" >
        <el-input v-model="userFrom.confirmPassWord"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" >
        <el-input v-model="userFrom.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" >
        <el-input v-model="userFrom.mobile"></el-input>
      </el-form-item>
      <el-form-item label="状态" >
        <el-input v-model="userFrom.status"></el-input>
      </el-form-item>
      <el-form-item label="角色" >
        <el-input v-model="userFrom.roleList"></el-input>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default{
  data () {
    var validatePassWord = (rule, value, callback) => {
      if (this.userForm.id && /\S/.test(value)) {
        callback(new Error('密码不能为空!'))
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
        ]
      }
    }
  },
  methods: {
    saveOrUpdate: function () {
      this.$api.
    }
  }
}
</script>
