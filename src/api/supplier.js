import request from '@/utils/request'

export default{
    //获取列表
    getList(){
        return request ({
            url:'/supplier/list',
            method:'get'
        })
    },
    //当前页码page,size每页显示的条数,searchMap请求的数据
    search(page,size,searchMap){
        return request({
            url:`/supplier/list/search/${page}/${size}`,
            method:'post',
            data:{
                searchMap
            }
        })
    },
    add(pojo){
        return request({
            url:'/supplier',
            method:'post',
            data:pojo
        })
    },
    getById(id){
        return request({
            url:`/supplier/${id}`,
            method:'get'
        })
    },
    update(pojo) {
        return request({
            url:`/supplier/${pojo.id}`,
            method:'put',
            data:pojo
        })
    },
    deleteById(id){
        return request({
            url:`/supplier/${id}`,
            method:'delete'
        })
    }
}