<template>
    <div class="login-container">
        <el-form class="login-form" ref="form" :model="form" label-width="80px" :rules="rules">
            <h2 class="login-title">会员管理系统</h2>
            <el-form-item label="账号" prop="username">
                <el-input v-model="form.username" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {login,getUserInfo} from '@/api/login'
  export default {
    data() {
      return {
        form: {
          username:'',
          password:'',
        },
        rules:{
             username: [
            { required: true, message: '账号不能为空', trigger: 'blur' },
          ],
            password:[
              { required: true, message: '密码不能为空', trigger: 'blur' }
            ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
            if(valid){
                //验证成功后,发送ajax请求到后台
               login(this.form.username,this.form.password).then(response =>{
                 const resp = response.data;
                 console.log(resp);
                 if(resp.flag){
                     //通过获取用户信息,异步请求
                     getUserInfo(resp.data.token).then(response =>{
                         //
                         const respUser = response.data
                         //如果获取成功
                         if(respUser.flag){
                            // console.log(respUser.data);
                            localStorage.setItem('mms-user',JSON.stringify(respUser.data))
                            localStorage.setItem('mms-token',JSON.stringify(resp.data.token))
                            this.$router.push('/')//前往当前页面
                         }else{
                            this.$message({
                            message:resp.message,
                            type:"error"
                     })
                         }
                     })
                 } else{
                     this.$message({
                         message:resp.message,
                         type:"error"
                     })
                        
                 }
               })
            }else{
                this.$message({
                showClose: true,
                message: '你的账号不可用',
                type: 'warning'
                });
        }
        //   if (valid) {
        //     alert('submit!');
        //   } else {
        //     console.log('error submit!!');
        //     return false;
        //   }
        });
      },
    }
  }
</script>
<style scoped>
    .login-form{
        width: 350px;
        margin: 300px auto;
        padding: 20px;
        background-color: rgba(10, 120, 194, 0.5);
        border-radius:20px ;
    }
    .login-container{
        position:absolute;
        width: 100%;
        height: 100%;
        background: url('../../assets/login.jpg');
        background-size: 100%;
    }
    .login-title{
        text-align: center;
        color: #303133;
    }

</style>