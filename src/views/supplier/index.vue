<template>
  <div>
    <el-form
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      ref="searchForm"
    >
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item prop="linkname">
        <el-input v-model="searchMap.linkname" placeholder="联系人" v-if="!isDialog"></el-input>
      </el-form-item>
      <el-form-item prop="mobile">
        <el-input v-model="searchMap.mobile" placeholder="联系电话" v-if="!isDialog"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd" v-if="!isDialog">增加</el-button>
        <el-button type="primary" @click="resetForm('searchForm')" v-if="!isDialog"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="list" height="400" border style="width: 100%" highlight-current-row
        @current-change="clickCurrentChange">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="name" label="供应商名称"> </el-table-column>
      <el-table-column prop="linkname" label="联系人"> </el-table-column>
      <el-table-column prop="mobile" label="联系电话" v-if="!isDialog"> </el-table-column>
      <el-table-column prop="remark" label="备注" v-if="!isDialog"> </el-table-column>
      <el-table-column label="操作" v-if="!isDialog">
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
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :layout=" isDialog ? ' prev, pager, next': 'total, sizes, prev, pager, next, jumper'"
      :total="total"
    >
    </el-pagination>

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible" width="500px">
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
        <el-form-item prop="linkname" label="联系人">
          <el-input v-model="pojo.linkname"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="联系电话">
          <el-input v-model="pojo.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="pojo.remark" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            pojo.id === null ? addData('pojoForm') : updateData('pojoForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierApi from "@/api/supplier";
export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize:10,
      searchMap: {
        name: "",
        linkname: "",
        mobile: ""
      },
      total: 0,
      dialogFormVisible: false,
      pojo: {
        id: null,
        name: "",
        linkname: "",
        mobile: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        linkname: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  props:{
    isDialog:Boolean
  },
  //钩子函数获取数据
  created() {
    //刷新数据
    this.fetchData();
  },

  components: {},

  methods: {
    clickCurrentChange(currentRow){
         this.$emit('option-supplier',currentRow)
      },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //验证成功
          supplierApi.add(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "wraning"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    fetchData() {
      //   supplierApi.getList().then(response => {
      //     const resp = response.data;
      //     this.list = resp.data;
      //   });
      supplierApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          this.list = resp.data.rows;
          this.total = resp.data.total;
        });
    },
    //编辑弹窗 获取该ID与其内容
    handleEdit(id) {
      //   console.log("handleEdit", id);
      this.handleAdd();
      supplierApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojo = resp.data;
        } else {
          this.$message({
            message: resp.message,
            type: "wraning"
          });
        }
      });
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          supplierApi.update(this.pojo).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.dialogFormVisible = false;
              this.fetchData();
            } else {
              this.$message({
                message: resp.message,
                type: "wraning"
              });
            }
            this.pojo.id=null
          });
        } else {
          return false;
        }
      });
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          supplierApi.deleteById(id).then(response => {
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped>
</style>