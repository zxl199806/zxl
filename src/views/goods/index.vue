<template>
  <div>
      <!-- 编辑 查询栏 -->
    <el-form
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      ref="searchForm"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="searchMap.code" placeholder="编码"></el-input>
      </el-form-item>
      <el-form-item prop="supplierName">
        <el-input
          readonly
          v-model="searchMap.supplierName"
          placeholder="供应商"
          @click.native="dialogSupplierVisible = true"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">增加</el-button>
        <el-button type="primary" @click="resetForm('searchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="list" height="400" border style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="name" label="商品名称"> </el-table-column>
      <el-table-column prop="code" label="商品编码"> </el-table-column>
      <el-table-column prop="spec" label="商品规格"> </el-table-column>
      <el-table-column prop="retailPrice" label="零售价"> </el-table-column>
      <el-table-column prop="purchasePrice" label="进货价"> </el-table-column>
      <el-table-column prop="storageNum" label="库存数量"> </el-table-column>
      <el-table-column prop="supplierName" label="供应商"> </el-table-column>
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
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 弹窗 父组件向子组件传值 -->
    <el-dialog
      title="选择供应商"
      :visible.sync="dialogSupplierVisible"
      width="500px"
    >
      <supplier :isDialog="true" @option-supplier="optionSupplier"></supplier>
    </el-dialog>
    <!-- 弹窗 -->
    <el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojo"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :rules="rules"
      >
        <el-form-item prop="name" label="供应商名称">
          <el-input v-model="pojo.name"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="商品编码">
          <el-input v-model="pojo.code"></el-input>
        </el-form-item>
        <el-form-item prop="spec" label="商品规格">
          <el-input v-model="pojo.spec"></el-input>
        </el-form-item>
        <el-form-item prop="retailPrice" label="零售价">
          <el-input v-model="pojo.retailPrice"></el-input>
        </el-form-item>
        <el-form-item prop="purchasePrice" label="进货价">
          <el-input v-model="pojo.purchasePrice"></el-input>
        </el-form-item>
        <el-form-item prop="storageNum" label="库存数量">
          <el-input v-model="pojo.storageNum"></el-input>
        </el-form-item>
        <el-form-item prop="supplierName" label="供应商">
          <el-input
            readonly
            v-model="pojo.supplierName"
            placeholder="供应商"
            @click.native="editOptionSupplier"
          ></el-input>
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
import goodsApi from "@/api/goods";
import Supplier from "@/views/supplier";
export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchMap: {
        name: "",
        code: "",
        supplierName: "",
        supplierId: 1
      },
      dialogSupplierVisible: false,
      pojo: {
        name: "",
        code: "",
        spec: "",
        retailPrice: "",
        purchasePrice: "",
        storageNum: "",
        supplierName: "",
        id: null
      },
      rules: {
        name: [
          { required: true, message: "供应商名字不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "商品编码不能为空", trigger: "blur" }
        ],
        purchasePrice: [
          { required: true, message: "进货价不能为空", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      isEdit: false
    };
  },
  created() {
    this.fetchData();
  },
  components: {
    Supplier
  },

  methods: {
    editOptionSupplier() {
      this.isEdit = true;
      this.dialogSupplierVisible = true;
    },
    optionSupplier(currentRow) {
      //   console.log(currentRow);
      if (currentRow) {
        if (this.isEdit) {
          this.pojo.supplierName = currentRow.name;
          this.pojo.supplierId = currentRow.id;
        } else {
          this.searchMap.supplierName = currentRow.name;
          this.searchMap.supplierId = currentRow.id;
        }
      }
      this.isEdit = false;
      this.dialogSupplierVisible = false;
    },
    fetchData() {
      //   goodsApi.getList().then(response => {
      //     const resp = response.data;
      //     this.list = resp.data;
      //   });
      goodsApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
        });
    },
    handleEdit(id) {
      this.handleAdd();
      goodsApi.getById(id).then(response =>{
          const resp = response.data
          if(resp.flag){
              this.pojo = resp.data
          }
      })
    },
    handleDelete(id) {
       this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          goodsApi.deleteById(id).then(response => {
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchData();
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addData(formName) {
        //表单校验
        this.$refs[formName].validate(valid =>{
            if(valid){
                goodsApi.add(this.pojo).then(response =>{
                    const resp = response.data
                    if(resp.flag){
                        this.fetchData()
                        this.dialogFormVisible=false
                    }else{
                        this.$message({
                            message:resp.message,
                            type:"wraning"
                        })
                    }
                })
            }else{
                return false
            }
        })
    },
    updateData(formName) {
        this.$refs[formName].validate(valid =>{
            if(valid){
                goodsApi.update(this.pojo).then(response =>{
                    const resp = response.data
                    if(resp.flag){
                        this.dialogFormVisible = false;
                        this.fetchData()
                    }else{
                        this.$message({
                            message:resp.message,
                            type:'wraning'
                        })
                    }
                    this.pojo.id=null
                })
            }else{
                return false
            }
        })
    },
  }
};
</script>

<style scoped>
</style>