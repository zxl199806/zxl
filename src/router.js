import Vue from "vue";
import Router from "vue-router";
import Login from "./views/login"
import Layout from "./components/Layout"
import Home from "./views/home"
import Member from "./views/member"
import Staff from "./views/staff"
import Supplier from "./views/supplier"
import Goods from "./views/goods"
Vue.use(Router);

export default new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      //登陆页面
      path: '/login',
      component: Login
    },
    {
      //基础布局
      path: '/',
      component: Layout,
      redirect:'/home',
      children: [
        {
          path: '/home',
          component: Home,
          meta:{title:'首页'}
        },
      ]
    },
    {
      //会员管理
      path: '/member',
      component: Layout,
      children:[
        {
          path:'/member/',
          component: Member,
          meta:{title:'会员管理'}
        }
      ]
    },
    {
      //员工管理
      path: '/staff',
      component: Layout,
      children:[
        {
          path:'/',
          component:Staff,
          meta:{title:'员工管理'}
        }
      ]
    },
    {
      //供应商管理
      path: '/supplier',
      component: Layout,
      children:[
        {
          path:'/',
          component:Supplier,
          meta:{title:'供应商管理'}
        }
      ]
    },
    {
      //商品管理
      path: '/goods',
      component: Layout,
      children:[
        {
          path:'/',
          component:Goods,
          meta:{title:'商品管理'}
        }
      ]
    },
  ]
});
