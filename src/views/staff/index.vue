<template>
  <div>
      <!-- 查询 编辑栏 -->
      <el-form
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      ref="searchForm"
    >
      <el-form-item prop="username">
        <el-input v-model="searchMap.username" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
    
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">增加</el-button>
        <el-button type="primary" @click="resetForm('searchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
      <!-- 主内容 表格 -->
      <el-table :data="list" height="400" border style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="username" label="账号"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="age" label="年龄"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="salary" label="工资"> </el-table-column>
      <el-table-column prop="entryDate" label="入职时间"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 增加 编辑弹窗 -->
    <el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :rules="rules"
      >
        <el-form-item prop="username" label="账号">
          <el-input v-model="pojo.username"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item prop="age" label="年龄">
          <el-input v-model="pojo.age"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="电话">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="salary" label="工资">
          <el-input v-model="pojo.salary"></el-input>
        </el-form-item>
        <el-form-item prop="entryDate" label="入职时间">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="入职时间"
            v-model="pojo.entryDate"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="pojo.id == null ? addData('pojoForm'): updateData('pojoForm') ">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import staffApi from '@/api/staff'
export default {
  data() {
    return {
      list: [],
      currentPage:1,
      pageSize:10,
      total:0,
      searchMap:{
          uesrname:'',
          name:''
      },
      pojo:{
          id:null,
          username:'',
          name:'',
          age:'',
          mobile:'',
          salary:'',
          entryDate:''
      },
      dialogFormVisible:false,
      rules:{
          username:[{required:true,message:'账号不能为空',trigger: "blur"}],
          name:[{required:true,message:'姓名不能为空',trigger: "blur"}],
          entryDate:[{required:true,message:'姓名不能为空',trigger: "blur"}],
      }
    };
  },

  components: {},
  created(){
      this.fetchData()
  },
  methods: {
      fetchData(){
          staffApi.search(this.currentPage,this.pageSize,this.searchMap).then(response =>{
              const resp = response.data
            //   console.log(resp);
              this.list = resp.data.rows
              this.total = resp.data.total
          })
      },
      handleEdit(id){
          this.handleAdd()
          staffApi.getById(id).then(response =>{
              const resp = response.data
              if(resp.flag){
                  this.pojo = resp.data
              }
          })
      },
      handleDelete(id){
          this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          staffApi.deleteById(id).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.fetchData()
            } else {
                this.$message({
                    type:'error',
                    message:'删除失败'
                })
            }
          });
        })
        .catch(() => {});
      },
      handleSizeChange(val){
          this.pageSize = val
          this.fetchData()
      },
      handleCurrentChange(val){
          this.currentPage = val
          this.fetchData()
      },
      handleAdd(){
          this.dialogFormVisible = true
          this.$nextTick(()=>{
              this.$refs['pojoForm'].resetFields()
          })
      },
      resetForm(formName){
          this.$refs[formName].resetFields()
      },
      addData(formName){
          this.$refs[formName].validate(valid =>{
              if(valid){
                  staffApi.add(this.pojo).then(response =>{
                      const resp = response.data
                      console.log(resp);
                      if(resp.flag){
                          this.fetchData();
                            this.dialogFormVisible = false 
                      }else{
                          this.$message({
                              message:resp.message,
                              type:'wraning'
                          })
                      }
                  })
              }else{
                  return false
              }
          })
      },
      updateData(formName){
          this.$refs[formName].validate(valid =>{
              if(valid){
                  staffApi.update(this.pojo).then(response =>{
                      const resp = response.data
                      if(resp.flag){
                          this.fetchData(),
                          this.dialogFormVisible = false
                      }else{
                          this.$message({
                              message:resp.message,
                                type:'wraning'
                          })
                      }
                      this.pojo.id = null
                  })
              }else{
                  return false
              }
          })
      }
  }
};
</script>

<style scoped>
</style>