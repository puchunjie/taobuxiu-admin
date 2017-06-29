<template>
    <div>
        <Alert>
            <span slot="desc">
                <div class="info clearfix">
                    <img class="user-head" :src="'http://www.itaobuxiu.com'+pic">
                    <p class="hello">您好，<b style="color:#f50">{{ name }} </b>,欢迎来到淘不锈</p>
                    <router-link  class="show-info" 
                    :to="{ name: 'userInfo', params: { identity: identity }}">查看个人资料</router-link>
                </div>
            </span>
        </Alert>
        <Alert>
            <span slot="desc">
                <Row>
                    <Col span="1"><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></Col>
                    <Col span="7" class="item">
                        <h3>{{ isBuyer ? '我的积分' : '卖家积分' }}</h3>
                        <p class="rog">{{ isBuyer ? buyer.integral : seller.integral }}</p>
                        <router-link :to="{ name: 'integral', params: { identity: identity }}">查看明细</router-link>
                    </Col>
                    <Col span="1"><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></Col>
                    <Col span="7" class="item">
                        <h3>{{ isBuyer ? '待处理订单' : '待确认订单' }}</h3>
                        <p class="rog">{{ isBuyer ? buyer.orders : seller.orders }}</p>
                        <router-link :to="{ name: isBuyer ? 'bOrders' : 'sOrders', params: { identity: identity }}">查看明细</router-link>
                    </Col>
                    <Col span="1"><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></Col>
                    <Col span="7" >
                        <h3>{{ isBuyer ? '待处理求购' : '已上架现货' }}</h3>
                        <p class="rog">{{ isBuyer ? buyer.buys : seller.irons }}</p>
                        <router-link :to="{ name: isBuyer ? 'bProduct' : 'shopProduct', params: { identity: identity }}">查看明细</router-link>
                    </Col>
                </Row>
            </span>
        </Alert>
        <Alert v-if="!isBuyer">
            <span slot="desc">
                <Row>
                    <Col span="1"><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></Col>
                    <Col span="7" class="item">
                        <h3>求购（待报价）</h3>
                        <p class="rog">{{ seller.supplyPendingCount }}</p>
                        <router-link :to="{ name: 'sProduct', params: { identity: identity }}">查看明细</router-link>
                    </Col>
                    <Col span="1"><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></Col>
                    <Col span="7" class="item">
                        <h3>求购（竞标中）</h3>
                        <p class="rog">{{ seller.biddingSupplyCount }}</p>
                        <router-link :to="{ name: 'sProduct', params: { identity: identity }}">查看明细</router-link>
                    </Col>
                    <Col span="1"><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></Col>
                    <Col span="7" >
                        <h3>求购（抢单成功）</h3>
                        <p class="rog">{{ seller.supplySuccessCount }}</p>
                        <router-link :to="{ name: 'sProduct', params: { identity: identity }}">查看明细</router-link>
                    </Col>
                </Row>
            </span>
        </Alert>
        <Alert>
            <span slot="desc">
                <Row class="rz-item" style="border-bottom: 1px dashed #ccc;"  v-if="isBuyer && becomeStatus != 2">
                    <Col span="20"><p>您还没有认证企业账号？</p></Col>
                    <Col span="4">
                        <template v-if="becomeStatus === 0">
                            <router-link :to="{ name: 'beSeller', params: { identity: 'buyer' }}">立即认证</router-link>
                        </template>
                        <template v-if="becomeStatus === 1">
                            <span style="color:red">资质审核中,请耐心等待</span>
                        </template>
                    </Col>
                </Row>
                <Row class="rz-item">
                    <Col span="20">
                        <p>
                            您的专属平台服务专员：
                            <template v-if="salesMan.name != ''">{{ salesMan.name }}  {{  salesMan.tel }}</template>
                            <template v-else>
                                <Input v-model="salesmanId" placeholder="请输入平台专员编号后，点击右侧 ‘确认选择’" style="width: 300px"></Input>
                            </template>
                        </p>
                    </Col>
                    <Col span="4" v-if="salesMan.name === ''">
                        <Button type="primary" :loading="ajaxLoading" @click="bindingOfficer">确认选择</Button>
                    </Col>
                </Row>
            </span>
        </Alert>
    </div>
</template>

<script>
    import { profile,myIronBuys,bindSalesman } from '@/utils/http'
    export default {
        data(){
            return {
                ajaxLoading:false,
                becomeStatus: 0,//是否认证卖家资格
                salesmanId: '',//专员编号
                isBuyer: true,
                pic: '',
                name: '',
                buyer:{
                    irons:0,
                    buys: 0,
                    integral: 0,
                    orders: 0,
                    biddingSupplyCount:0,
                    supplyPendingCount:0,
                    supplySuccessCount:0
                },
                seller: {
                    irons:0,
                    buys: 0,
                    integral: 0,
                    orders: 0,
                    biddingSupplyCount:0,
                    supplyPendingCount:0,
                    supplySuccessCount:0
                },
                salesMan:{}
            }
        },
        computed: {
            identity(){
                return this.$route.params.identity
            }
        },
        methods: {
            init(){
                this.isBuyer = this.identity === 'buyer';
                // 获取个人信息
                this.$http.get(profile).then(res => {
                    if(res.data.status ===0){
                        let data = res.data.data;
                        this.name = data.name;
                        this.pic = data.avator;
                        this.buyer = data.userData;
                        this.seller = data.sellerData;
                        this.salesMan = data.salesMan;
                        this.becomeStatus = data.becomeStatus;
                        if(!this.isBuyer && data.becomeStatus === 0){
                            this.$router.push('/nadmin/account/buyer/beSeller')
                        }
                    }
                });
            },  
            bindingOfficer(){
                if(this.salesmanId != ''){
                    this.ajaxLoading = true;
                    this.$http.post(bindSalesman,{
                        salesmanId: this.salesmanId
                    }).then(res => {
                        if(res.data.status === 0){
                            this.$Message.success('绑定成功！');
                            this.init();
                        }else{
                            this.$Message.error(res.data.errorMsg);
                        }
                        this.ajaxLoading = false
                    })
                }else{
                    this.$Message.error('请输入专员编号');
                }
            }
        },
        created () {
            this.init();
        },
        watch: {
            'identity':function(){
                this.init();
            }
        }
    }
</script>

<style scoped>
    .user-head{
        display: block;
        width: 80px;
        height: 80px;
        float: left;
    }

    .hello{
        width: 600px;
        margin: 10px 0 0 20px;
        float: left;
    }
    .show-info{
        float: left;
        width: 300px;
        margin: 10px 0 0 20px;
    }
    .item{
        border-right:1px solid #ccc
    }
    .rog{
        color:#ed3f14;
    }
    .rz-item{
        height: 50px;
        line-height: 50px;
    }
</style>
