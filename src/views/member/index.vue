<template>
  <div>
    <el-form :inline="true" :model="searchMap" ref="searchForm">
      <!-- 绑定重置属性 -->
      <el-form-item prop="cardNum">
        <el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="会员名称"></el-input>
      </el-form-item>
      <el-form-item prop="payType">
        <el-select v-model="searchMap.payType" placeholder="支付类型">
          <el-option
            v-for="option in payTypeOptions"
            :key="option.type"
            :value="option.name"
            :lable="option.type"
          ></el-option>
        </el-select>
        <el-form-item prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="会员生日"
            v-model="searchMap.birthday"
          ></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button @click="resetForm('searchForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list" height="400" border style="width: 100%">
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="cardNum" label="会员序号"> </el-table-column>
      <el-table-column prop="name" label="会员名字"> </el-table-column>
      <el-table-column prop="birthday" label="会员生日"> </el-table-column>
      <el-table-column prop="phone" label="手机号码"> </el-table-column>
      <el-table-column prop="integral" label="可用积分"> </el-table-column>
      <el-table-column prop="money" label="开卡金额"> </el-table-column>
      <el-table-column prop="payType" label="支付类型">
        <template slot-scope="scope">
          <span>{{ scope.row.payType | payTypeFilter }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="会员地址"> </el-table-column>
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
    <!-- 弹窗 -->
    <el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :model="pojoForm"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width:400px;"
        :rules="rules"
      >
        <el-form-item label="会员卡号" prop="cardNum">
          <el-input v-model="pojoForm.cardNum"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名" prop="name">
          <el-input v-model="pojoForm.name"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="会员生日"
            v-model="pojoForm.birthday"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="pojoForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额" prop="money">
          <el-input v-model="pojoForm.money"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="integral">
          <el-input v-model="pojoForm.integral"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="payType">
          <el-select v-model="pojoForm.payType" placeholder="支付类型">
            <el-option
              v-for="option in payTypeOptions"
              :key="option.type"
              :value="option.name"
              :lable="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="address">
          <el-input type="textarea" v-model="pojoForm.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            pojoForm.id === null ? addData('pojoForm') : updateData('pojoForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入一个默认对象
import memberApi from "@/api/member";
//支付类型
const payTypeOptions = [
  { type: "1", name: "现金" },
  { type: "2", name: "微信" },
  { type: "3", name: "支付宝" },
  { type: "4", name: "银行卡" }
];
export default {
  data() {
    return {
      list: [],
      total: 0, //默认为0条
      currentPage: 1, //当前页,默认为第一页
      pageSize: 10, //每页多少条,10条
      searchMap: {
        cadrNum: "",
        name: "",
        payType: "",
        birthday: ""
      }, //查询绑定条件值
      payTypeOptions,
      dialogFormVisible: false,
      pojoForm: {
        id: null,
        cardNum: "",
        name: "",
        birthday: "",
        phone: "",
        money: 0,
        integral: 0,
        payType: "",
        address: ""
      },
      rules: {
        cardNum: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        payType: [
          { required: true, message: "请选择支付类型", trigger: "change" }
        ]
      }
    };
  },
  filters: {
    payTypeFilter(type) {
      const obj = payTypeOptions.find(item => item.type == type);
      return obj ? obj.name : null;
    }
  },
  //钩子函数获取数据
  created() {
    //刷新数据
    this.fetchData();
  },

  components: {},

  methods: {
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["pojoForm"].resetFields();
      });
    },
    //表单验证
    addData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //验证通过,提交添加
          memberApi.add(this.pojoForm).then(response => {
            const resp = response.data;
            console.log(resp);
            if (resp.flag) {
              //成功之后,需要刷新数据
              this.fetchData();
              console.log("addData");
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.message,
                type: "warning"
              });
            }
          });
          // 验证通过，提交添加
          alert("Add submit!");
        } else {
          // 验证不通过
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    handleSizeChange(val) {
      //每页显示多少条发生改变
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      //页码发生改变
      this.currentPage = val;
      this.fetchData();
    },
    //刷新数据列表
    fetchData() {
      //   memberApi.getList().then(response => {
      //     const resp = response.data;
      //     this.list = resp.data;
      //   });
      memberApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then(response => {
          const resp = response.data;
          //   console.log(resp);
          this.list = resp.data.rows;
          this.total = resp.data.total;
        });
    },
    handleEdit(id) {
      //打开弹窗并清空原有数据
      this.handleAdd();
      //通过id查询数据,显示到弹窗中
      memberApi.getById(id).then(response => {
        const resp = response.data;
        if (resp.flag) {
          this.pojoForm = resp.data;
        } else {
          this.$message({
            type: "wraning",
            message: resp.message
          });
        }
      });
    },
    handleDelete(id) {
      //   console.log("删除", id);
      this.$confirm("是否删除该会员 ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          memberApi.deleteById(id).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              //成功之后,刷新列表
              this.fetchData()
            } else {
              this.$message({
                type: "error",
                message: "删除失败"
              });
            }
          });
        })
        .catch(() => {});
    },
    updateData(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          //验证通过 提交
          memberApi.update(this.pojoForm).then(response => {
            const resp = response.data;
            if (resp.flag) {
              this.fetchData(); //刷新数据列表
              this.pojoForm.id = null;
              console.log("updateData");
              this.dialogFormVisible = false; //关闭窗口
            } else {
              this.$message({
                type: "wraning",
                message: resp.message
              });
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
</style>