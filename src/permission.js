import { getUserInfo } from "./api/login"
import router from "./router"

//前置路由设置钩子函数
router.beforeEach((to,from,next)=>{
    //获取token
    const token = localStorage.getItem("mms-token")
    //没有token
    if(!token){
        //如果进入的不是登录页面
        //则进入登录页面
        if(to.path != '/login'){
            next({path:'/login'})
        }else{
            next()
        }
    }else{
        //有token
        const UserInfo = localStorage.getItem("mms-user")
        if(UserInfo){
            //有用户信息
            next()
        }else{
            //没有用户信息
            getUserInfo(token).then(response =>{
                const resp = response.data
                if(resp.flag){
                    //把用户信息存进去
                    localStorage.setItem("mms-user",JSON.stringify(resp.data))
                    next()
                }else{
                    next({path:'/login'})
                }
            })
        }
    }
})