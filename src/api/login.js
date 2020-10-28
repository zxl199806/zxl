import request from "@/utils/request"

//导出两个函数
export function login(username,password){
    return request({
        method: 'post',
        url:'/user/login',
        data() {
            return {
                username,//username:username
                password
            }
        },
    })
}
//获取用户信息
export function getUserInfo(token){
    return request({
        method:'get',
        url:`/user/login/${token}`
    })
}
//退出登录
export function logout(token){
    return request({
        method:'post',
        url:'/user/logout',
        //传入token
        data:{
            token
        }
    })
}