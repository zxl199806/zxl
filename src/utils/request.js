import axios from 'axios'
import { Loading,Message } from 'element-ui'

const request = axios.create({
    baseURL:process.env.VUE_APP_BASE_API,
    // baseURL:'/',
    timeout:5000//请求超时
})

const loading ={
    loadingInstance:null,
    open(){
        if(this.loadingInstance === null){
            this.loadingInstance = Loading.service({
                target:'.main',
                text:'拼命加载中...',
                background:'rgba(0,0,0,0.5)'
            })
        }
    },
    close(){
        if(this.loadingInstance !== null){
            this.loadingInstance.close()
        }
        this.openloadingInstance = null
    }
}
// axios.get('/db.json').then(response =>{
//     const data = response.data
//     console.log(data);
// })

// request({
//     method:'get',l
//     url:'/db.json'
// }).then(response =>{
//     console.log(response.data);
// })

//请求拦截器
request.interceptors.request.use(config => {
    loading.open()
    return config
},error => {
    loading.close()
    //出现异常 抛出错误对象
    return Promise.reject(error);
});
//响应拦截器
request.interceptors.response.use(response =>{
    loading.close()
    const resp = response.data;
    if(resp.code!==2000){
        Message({
            message:resp.message || '系统异常',
            type:'warning',
            duration:5 * 1000
        })
    }
    return response;
},error =>{
    Message({
        message:error.message || '系统异常',
        type:'error',
        duration:5 * 1000
    })
    loading.close()
    return Promise.reject(error);
})

export default request//导出自定义创建的 axios 对象