import request from "@/utils/request.js"
import { get } from "core-js/fn/dict";

//因为引入以下数据 并不能直接引用到,
//当前响应的数据只是在test.js中打印而已，
//但是应该将数据响应到对应的组件当中进行渲染，
//也就是HelloWorld.vue

// request ({
//     method:"get",
//     url:"db.json"
// }).then (response =>{
//     console.log(response.data);
// })

//导出一个默认对象
export default {
    getList(){
        const req = request({
            method:'get',
            url:'/db.json'
        });
        return req
    }
}