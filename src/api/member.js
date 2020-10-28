import request from '@/utils/request'

export default{
    getList(){
        return request({
            method:'get',
            url:'/member/list'
        })
    },
    //当前页码page,size每页显示的条数,searchMap请求的数据
    search(page,size,searchMap){
        return request({
            url:`/member/list/search/${page}/${size}`,
            method:'post',
            data:{
                searchMap
            }
        })
    },
    //新增会员
    add(pojo){
        return request({
            url:'/member',
            method:'post',
            data:pojo
        })
    },
    //查询
    getById(id){
        return request({
            url:`/member/${id}`,
            method:"get",
        })
    },
    //更新数据
    update(pojo){
        return request({
            url:`/member/${pojo.id}`,
            method:"put",
            data:pojo
        })
    },
    //删除数据
    deleteById(id){
        return request({
            url:`/member/${id}`,
            method:'delete'
        })
    }
}