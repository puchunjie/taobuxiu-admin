import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import '../static/css/reset.css'
import 'iview/dist/styles/iview.css'
import VueQuillEditor from 'vue-quill-editor'
import IEcharts from 'vue-echarts-v3';
import axios from 'axios'
import qs from 'qs'
import moment from 'vue-moment-jalaali'

Vue.use(iView)
Vue.use(IEcharts)
Vue.use(moment)

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    next();
});

router.afterEach((to, from, next) => {
    setTimeout(function() {
        iView.LoadingBar.finish();
    }, 500);
});


axios.defaults.timeout = 5000; //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'; //配置请求头
// axios.defaults.baseURL = '/'; //配置接口地址
// axios.defaults.baseURL = 'http://192.168.0.251:9090'; //配置接口地址
axios.defaults.baseURL = 'http://118.178.17.15:9090'; //配置接口地址
// axios.defaults.baseURL = 'http://www.itaobuxiu.com'; //配置接口地址
axios.defaults.withCredentials = true;
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    if (config.method === 'post' && !config.pic) {
        config.data = qs.stringify(config.data);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
    return response;
}, function(error) {
    Vue.$Message.error('服务器异常');
    return Promise.reject(error);
});

Vue.prototype.$http = axios;

Vue.config.productionTip = false

Vue.config.debug = false;

new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App },
    data: {
        eventHub: new Vue()
    }
})