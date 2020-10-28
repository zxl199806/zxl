<template>
  <div class="header">
    <img class="logo" src="../../assets/logo.png" width="50px" />
    <span class="company">会员管理系统</span>

    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        用户名<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item icon="el-icon-edit-outline" command="a"
          >修改密码</el-dropdown-item
        >
        <el-dropdown-item icon="el-icon-caret-left" command="b"
          >退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync='dialogFormVisible' width='500px'>
      <el-form
      style='width:400px'
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input
            type="password"
            v-model="ruleForm.oldPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
       
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { logout } from "@/api/login";
import passwordApi from '@/api/password'
export default {
  data() {
    const validateOldPass = (rule,value,callback) =>{
      passwordApi.checkPwd(this.user.id,value).then(response =>{
        const resp =response.data
        if(resp.flag){
          callback()
        }else{
          callback(new Error(resp.message))
        }
      })
    };
    const validatePass = (rule,value,callback) =>{
      // passwordApi.updatePwd(this.user.id,value).then(response =>{
      //   const resp = response.data
      // })
      if(value !== this.ruleForm.pass){
        callback(new Error('两次密码不一致'))
      }else{
        callback()
      }
    }
    return {
      user: JSON.parse(localStorage.getItem('mms-user')) ,
      dialogFormVisible:false,
      rules:{
        oldPass:[
          {required:true,message:'原始密码不能为空',trigger:'blur'},
          {validator:validateOldPass,trigger:'blur'}
        ],
        checkPass:[
          {required:true,message:'原始密码不能为空',trigger:'blur'},
          {validator:validatePass,trigger:'change'}
        ]
      },
      ruleForm:{
        oldPass:'',
        pass:'',
        checkPass:''
      }
    };
  },

  components: {},

  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          this.handlePwd()
          break;
        case "b":
          break;
      }
    },
    handleLogout(){
      logout(localStorage.getItem("mms-token")).then(response => {
            const resp = response.data;
            if (resp.flag) {
              localStorage.removeItem("mms-token");
              localStorage.removeItem("mms-user");
              this.$router.push("/login");
            } else {
              this.$notify.error({
                title: "错误",
                message: "退出失败"
              });
            }
          });
    },
    handlePwd(){
      this.dialogFormVisible = true;
      this.$nextTick(()=>{
        this.$refs['ruleForm'].resetFields()
      })
      
    },
    submitForm(formName){
      this.$refs[formName].validate(valid =>{
        if(valid){
          passwordApi.updatePwd(this.user.id,this.checkPass).then(response =>{
            const resp =response.data
            this.$message({
              message:resp.message,
              type:resp.flag ? 'success' : 'wraning'
            })
            if(resp.flag){
              this.handleLogout();
              this.dialogFormVisible = false
            }
          })
        }
      })
    }
  }
};
</script>

<style scoped>
.logo {
  vertical-align: middle;
  padding: 0 10px 0 40px;
}
.company {
  position: absolute;
  color: white;
}
.el-dropdown {
  float: right;
  right: 40px;
}
.el-dropdown-link {
  color: white;
  cursor: pointer;
}
</style>