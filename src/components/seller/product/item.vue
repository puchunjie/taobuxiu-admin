<template>
    <div class="item-container" v-if="itemData.buy">
        <div class="item-info">
            <div class="tit">
                <Row>
                    <Col span="6">求购详情</Col>
                    <Col span="7" class="qg-count">
                    求购总数<span style="color:#39f">{{ itemData.userBuyInfo.buyTimes }}次 </span>
                    求购成功率<span style="color:#39f">{{ accMul(itemData.userBuyInfo.buySuccessRate,100) }}%</span>
                    </Col>
                    <Col span="11" class="qg-time">
                        <template v-if="itemData.buy.status === 4">
                            成交时间：{{ new Date(itemData.buy.lastGetDetailTime) | moment("YYYY年MM月DD日 HH:mm") }}
                        </template>
                        <template v-else>
                            距离关闭时间:
                            <count-down :style="{color:'red'}" 
                            :endTime="itemData.buy.pushTime+itemData.buy.timeLimit" 
                            :callback="endCallback" 
                            endText="已经结束了"></count-down>
                        </template>
                        
                    </Col>
                </Row>
            </div>
            <div class="info-content">
                <Row>
                    <Col span="4" class="item">品名</Col>
                    <Col span="6" class="item">材质/表面</Col>
                    <Col span="4" class="item">规格</Col>
                    <Col span="4" class="item">公差范围</Col>
                    <Col span="3" class="item">数量</Col>
                    <Col span="3" class="item">钢厂</Col>
                </Row>
                <Row>
                    <Col span="4" class="item">{{ itemData.buy.ironType }}</Col>
                    <Col span="6" class="item">{{ `${ itemData.buy.material }/${ itemData.buy.surface }` }}</Col>
                    <Col span="4" class="item">{{ `${ itemData.buy.height }*${ itemData.buy.width }*${ itemData.buy.length }` }}</Col>
                    <Col span="4" class="item">{{ itemData.buy.tolerance }}</Col>
                    <Col span="3" class="item">{{ `${ itemData.buy.numbers }${ itemData.buy.unit }` }}</Col>
                    <Col span="3" class="item">{{ itemData.buy.proPlace }}</Col>
                </Row>
                <Row>
                    <Col span="24" class="item" style="text-align:left;">
                         收货地址：{{ itemData.buy.sourceCity }}
                    </Col>
                </Row>
                <Row>
                    <Col span="16" class="item message">
                        备注：{{ itemData.buy.message }}
                    </Col>
                    <Col span="8" class="item">
                        发起时间：{{ new Date(itemData.buy.pushTime) | moment("YYYY年MM月DD日 HH:mm") }}
                    </Col>
                </Row>
            </div>
        </div>
        <div class="item-tips" :class="'status'+itemData.buy.status">
            <template v-if="itemData.buy.status === 0">
                抓住机会，报最低价给采购客户吧！
            </template>
            <template v-else-if="itemData.buy.status === 3">
                买家还没有选择任何报价，请耐心等待
            </template>
            <template v-else-if="itemData.buy.status === 4">
                恭喜您的报价已中标，请立即联系买家吧
            </template>
            <template v-else-if="itemData.buy.status === 6">
                您的报价未中标
            </template>
        </div>
        <div class="item-content">
            <Row>
                <Col span="6" class="tit">我的报价：</Col>
                <Col span="18" v-if="itemData.buy.status === 4" style="font-size:12px;text-align:right;line-height:40px;color:green">
                    买方联系方式：{{ itemData.buyerMobile }}
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <Form :model="fromData" label-position="right" :label-width="100" ref="fromData" v-if="itemData.buy.status === 0">
                        <Form-item label="价格：">
                            <Row>
                                <Col span="8"><Input v-model="fromData.price"></Input></Col>
                                <Col span="6" style="text-indent:5px">元/{{ itemData.buy.unit }}</Col>
                            </Row>
                        </Form-item>
                        <Form-item label="备注：">
                            <Row>
                                <Col span="24"><Input v-model="fromData.message" placeholder="请填写备注，如现货情况或开平计划等" type="textarea"></Input></Col>
                            </Row>
                        </Form-item>
                        <Form-item>
                            <Button type="primary" @click="handleSubmit">立即报价</Button>
                            <Button type="warning" @click="setMissing" style="margin-left: 8px">遗憾错过</Button>
                        </Form-item>
                    </Form>

                    <div class="waiting"  v-else-if="itemData.buy.status === 3 || itemData.buy.status === 6">
                        <Row>
                            <Col span="6" class="item">价格</Col>
                            <Col span="18" class="item" style="text-align:left;color:red">{{ `${ itemData.myOffer.price } (元/${ itemData.myOffer.unit })` }}</Col>
                        </Row>
                        <Row>
                            <Col span="6" class="item">备注</Col>
                            <Col span="18" class="item" style="text-align:left">{{ itemData.myOffer.supplyMsg }}</Col>
                        </Row>
                    </div>

                    <div class="success"  v-else-if="itemData.buy.status === 4">
                        <Row>
                            <Col span="8" class="item">价格</Col>
                            <Col span="8" class="item">数量</Col>
                            <Col span="8" class="item">总额</Col>
                        </Row>
                        <Row>
                            <Col span="8" class="item" style="color:red">{{ `${ itemData.myOffer.price } (元/${ itemData.myOffer.unit })` }}</Col>
                            <Col span="8" class="item">{{ `${ itemData.buy.numbers }${ itemData.buy.unit }` }}</Col>
                            <Col span="8" class="item" style="color:red">&yen;{{ accMul(itemData.buy.numbers,itemData.myOffer.price) }}</Col>
                        </Row>
                        <Row>
                            <Col span="24" class="item" style="text-align:left">
                                备注：{{ itemData.myOffer.supplyMsg }}
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>


<script>
import countDown from '@/components/com/countDown'
import { offerIronBuy,missIronBuyOffer } from '@/utils/http'

export default {
    components: {
        countDown
    },
    props:{
        itemData:{
            type:Object,
            default:function(){
                return {}
            }
        },
        ajaxLoad:{
            type:Boolean
        }
    },
    data(){
        return {
            fromData:{
                price:'',
                message:''
            }
        }
    },
    methods: {
        handleSubmit (name) {
            if(this.fromData.price === '' ||this.fromData.message === '' ){
                this.$Message.warning('请填写完报价信息！');
            }else{
                let _this = this;
                this.$http.post(offerIronBuy,{
                    ironId: this.itemData.buy.id,
                    price: this.fromData.price,
                    unit: this.itemData.buy.unit,
                    msg: this.fromData.message
                }).then(res => {
                    if(res.data.status === 0){
                        this.$Message.success('报价成功！');
                        setTimeout(function(){
                            _this.$parent.init();
                        },1000)
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                });
            }
        },
        setMissing () {
            let _this = this;
            this.$http.post(missIronBuyOffer,{
                ironId: this.itemData.buy.id
            }).then(res =>{
                if(res.data.status === 0){
                    this.$Message.success('忽略成功');
                    setTimeout(function(){
                        _this.$parent.init();
                    },1000)
                }else{
                    this.$Message.error(res.data.errorMsg);
                }
            })
        },
        // js浮点运算乘法
        accMul(arg1,arg2) { 
            let m=0; 
            let s1=arg1.toString();
            let s2=arg2.toString();
            try{
                m+=s1.split(".")[1].length
            }catch(e){} 
            try{
                m+=s2.split(".")[1].length
            }catch(e){} 

            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
        },
        endCallback(){

        },
        resetForm(){
            this.fromData.price = "";
            this.fromData.message = "";
        }
    },
    watch: {
        'itemData':function(){
            this.resetForm()
        }
    }

}
</script>


<style scoped>
    .item-container{
        width:100%;
    }
    .item-info,.item-content{
        width: 100%;
        border:1px solid #e6e6e6;
        padding: 0 10px 10px;
        line-height: 24px;
        font-size: 14px;
        position: relative;
    }
    .item-info .tit{
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        margin-bottom: 10px;
    }

    .tit .qg-count,.tit .qg-time{
        font-size: 12px;
    }
    .tit .qg-time{
        text-align: right;
    }

    .item-info .info-content{
        border-top: 1px solid #e6e6e6;
        border-left: 1px solid #e6e6e6;
    }

    .info-content .item{
        padding: 10px;
        font-size: 12px;
        text-align: center;
        border-bottom: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
    }
    .info-content .item.message{
        text-align: left;
        border-right: 0;
        color: red;
    }

    .item-tips{
        width: 100%;
        line-height: 20px;
        text-align: center;
        padding: 10px;
    }

    .item-tips.status0,.item-tips.status3 {
        color: #39f;
    }
    .item-tips.status4 {
        color: green;
    }

    .item-content .tit{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        margin-bottom: 10px
    }

    .item-content .waiting,.item-content .success{
        width: 100%;
        border-top: 1px solid #e6e6e6;
        border-left: 1px solid #e6e6e6;
    }

    .waiting .item,.success .item{
        padding: 10px;
        font-size: 12px;
        text-align: center;
        border-bottom: 1px solid #e6e6e6;
        border-right: 1px solid #e6e6e6;
    }
</style>
