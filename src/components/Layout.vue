<template>
    <div>
        <app-header></app-header>
        <app-navbar></app-navbar>
        <app-main></app-main>
    </div>
</template>
<script>
//导入子组件
import AppHeader from "./AppHeader"
import AppNavbar from "./AppNavbar"
import AppMain from "./AppMain"
export default {
    components:{
        //注册子组件
        AppHeader,
        AppNavbar,
        AppMain
    }
}
</script>

<style scoped>
    .header{
        position: absolute;
        padding: 0;
        top:0;
        left: 0;
        right: 0;
        line-height: 50px;
        background-color: #2d3a4b;
    }
    .navbar{
        position: absolute;
        padding: 0;
        top:51px;
        left: 0;
        bottom: 0;
        width: 230px;
        background-color:#545c64 ;
        overflow-y: auto;
    }
    .main{
        position: absolute;
        padding: 0;
        top: 51px;
        right:0;
        left: 230px;
        bottom: 0;
        overflow-y: auto;
    }

</style>