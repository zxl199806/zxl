import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from "./App.vue";
import router from "./router";
import './permission'
// import login from "./views/login"
//使用
Vue.use(ElementUI);
// false 开发环境：Vue会提供很多警告来方便调试代码。
// true 生产环境：警告却没有用，反而会增加应用的体积
Vue.config.productionTip = process.env.NODE_ENV === 'prodution';
// console.log(process.env.VUE_APP_BASE_API);
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
