<template>
    <div class="container">
        <div class="mian-header">
            <div class="status-bar">
                <div class="in-contnet">
                    <Row style="font-family: 'Microsoft Yahei', 微软雅黑, Tahoma, Arial, Helvetica, STHeiti;line-height:30px">
                        <Col span="2" style="text-align:right;" class="links">
                            <Icon style="font-size:18px;color:#007de4;margin:5px 5px 0 0" type="home"></Icon><a style="color: #9a9a9a;" href="http://www.itaobuxiu.com">淘不锈首页</a>
                        </Col>
                        <Col span="8" style="text-align:right;" class="links">客服热线:0510-81812186 | 工作时间:8:30-17:30(周一至周六)</Col>
                        <Col span="4" style="text-align:right"></Col>
                        <Col span="14" style="text-align:right" class="links">
                            <a>您好，{{ mobile }}</a>&nbsp;&nbsp;
                            <a @click="loginout" style="color:blue">退出</a>&nbsp;|&nbsp; 
                            <router-link :to="{ name: 'main', params: { identity: 'buyer' }}">我的淘不锈</router-link>
                            &nbsp;| &nbsp;
                            <router-link :to="{ name: 'bOrders', params: { identity: 'buyer' }}">我的订单</router-link>
                            &nbsp;|&nbsp;
                            <router-link :to="{ name: 'mycart', params: { identity: 'buyer' }}">购物车</router-link>
                            &nbsp;|&nbsp;
                            <a href="/html/view/common/news/news.html#!/problem">帮助中心</a>&nbsp;|&nbsp; 
                            <a href="/html/view/common/news/news.html#!/about">关于我站</a>
                        </Col>
                    </Row>
                </div>
            </div>
            <div class="status-info">
                <div class="in-contnet">
                    <Row>
                        <Col span="5">
                            <img class="logo" src="http://www.itaobuxiu.com/resource/image/register/logo-1.png">
                        </Col>
                        <Col span="1" class="logo-title">
                            &nbsp;
                        </Col>
                        <Col span="3" class="logo-title">
                            <h1 style="margin-top:24px;font-size:20px;border-right:1px solid #fff;font-weight:400">会员中心</h1>
                        </Col>
                        <Col span="1" class="logo-title">
                            &nbsp;
                        </Col>
                        <Col span="3" class="d">
                            <a :class="identity === 'buyer' ? 'active' : ''" @click="jump('buyer')">买家中心</a>
                        </Col>
                        <Col span="3" class="d">
                            <a v-if="becomeStatus === 2" :class="identity === 'seller' ? 'active' : ''" @click="jump('seller')">卖家中心</a>
                            <template v-else>&nbsp;</template>
                        </Col>
                         <Col span="8">
                            <h1 class="hello-cpmpany">您好，{{ name }}</h1>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
        <div class="layout in-contnet" :class="{'layout-hide-text': spanLeft < 5}">
            <Row type="flex">
                <i-col :span="spanLeft" class="layout-menu-left">
                    <Menu :active-name="setActive" theme="light" width="auto" @on-select="routeTo">
                        <Menu-group :title="item.itemTitle" v-for="item in menu">
                            <Menu-item :name="subItem.name" v-for="subItem in item.itemMenus">
                                <Icon :type="subItem.icon"></Icon>
                                {{ subItem.title }}
                            </Menu-item>
                        </Menu-group>
                    </Menu>
                </i-col>
                <i-col :span="spanRight" id="rightConetnt">
                    <div class="layout-content" id="rightLayout">
                        <div class="layout-content-main">
                            <transition mode="out-in">
                                <router-view></router-view>
                            </transition>
                        </div>
                    </div>
                </i-col>
            </Row>
        </div>
        <audio src="http://www.itaobuxiu.com/resource/voice/notification.wav" ref="notify" style="display:none">
            您的浏览器不支持 audio 标签。
        </audio>
    </div>
    

</template>

<script>
import memus from '@/assets/menus.js'
import { loginOut, profile, sprofile, ws } from '@/utils/http'

export default {
    data() {
            return {
                userId: '',
                name: '',//公司名
                mobile:'',
                becomeStatus: 0,//是否认证卖家资格
                rightHeight:0,
                //layou栅格
                spanLeft: 4,
                spanRight: 20,
            }
        },
        computed: {
            iconSize() {
                return this.spanLeft === 4 ? 14 : 24;
            },
            setActive() {
              return this.$route.name;
            },
            // 登录身份
            accountIdentity(){
                let id = '';
                if(this.identity === 'buyer'){
                    id = '买家中心'
                }else{
                    id = '卖家中心'
                }
                return id
            },
            //身份
            identity(){
                return this.$route.params.identity
            },
            //菜单数据
            menu(){
                return memus[this.$route.params.identity];
            }
        },
        methods: {
            routeTo(e) {
                this.$router.push({ 
                    name: e
                });
            },
            jump(params){
                this.$router.push({ 
                    name: 'main',
                    params: { 
                        identity: params
                    }
                });
            },
            initScoket(){
                let _this = this;
                let socket = new WebSocket(ws);
                console.log(socket)
                // 打开Socket
                socket.onopen = function(event) {
                    let data = {
                        url : "user",
                        data : {
                            userId: _this.userId
                        }
                    }
                    // 发送一个初始化消息
                    socket.send(JSON.stringify(data));
                };
                
                // 监听消息
                socket.onmessage = function(event) {
                    let data = JSON.parse(event.data);
                    let notify = _this.$refs.notify;
                    notify.pause();
                    notify.currentTime = 0;
                    notify.play();
                    _this.$Notice.success({
                        title: '您有新的消息，请注意',
                        desc: data.message,
                        duration: 5
                    });
                };

                // 监听Socket的关闭
                socket.onerror = function(event) {
                    console.log('Client notified socket has closed',event);
                };
            },
            loginout(){
                this.$http.post(loginOut).then(res =>{
                    if(res.data.status === 0){
                        // this.$router.push('/nadmin/login');
                        location.href = '/html/view/common/login.html';
                    }
                });
            }
        },
        created () {
            this.$http.get(profile).then(res => {
                if(res.data.status ===0){
                    this.becomeStatus = res.data.data.becomeStatus;
                    this.userId = res.data.data.userId;
                    this.name = res.data.data.name;
                    this.mobile = res.data.data.mobile;
                    this.initScoket();
                }
            });
            
        }
}

</script>


<style scoped>
.container{
    width:100%;
}

.mian-header{
    width: 100%;
}

.status-bar{
    width: 100%;
    height: 30px;
    background-color: #f5f5f5;
    line-height: 30px;
}

.status-info{
    width: 100%;
    height: 80px;
    background-color: #007de4;
}

.in-contnet{
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;
}

.logo{
    display: block;
    width: 234px;
    margin: 10px 10px 0 20px;
}
.logo-title{
    color: #fff;
    font-weight: 250;
}
.logo-title h1{
    font-size: 36px;
    margin-top: 10px;
    font-weight: 200;
}

.d a{
    display: block;
    color: #fff;
    margin-top:24px;
    font-size:20px;
    font-weight: bold;
}
.d .active{
    color: #f50;
}

.layout {
    position: relative;
    overflow: hidden;
    height: 100%;
}

.layout > .ivu-row-flex{
    height: 100%;
}


.layout-content {
    min-height: 600px;
    background: #fff;
    border-radius: 4px;
}

.layout-content-main {
    padding: 20px 10px;
}

.layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
}

.layout-menu-left {
    background: #fff;
    /*min-width: 100px;*/
}

.layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.layout-logo-left {
    width: 90%;
    height: 30px;
    background: #fff;
    border-radius: 3px;
    margin: 15px auto;
    line-height: 30px;
    text-align: center;
    vertical-align: middle;
    overflow: hidden;
}

.layout-ceiling-main a {
    color: #9ba7b5;
}

.layout-hide-text .layout-text {
    display: none;
}

.ivu-col {
    transition: width .2s ease-in-out;
}

.links a,.links{
    color: #9a9a9a;
    font-size: 12px;
    font-weight: bold;
}

.hello-cpmpany{
    width: 100%;
    color:#fff;
    line-height: 80px;
    text-align: right;
    margin-right: 20px;
    font-size: 16px;
}
</style>