<template>
    <div class="cart-container">
        <div class="totle-price-content">
            已选货品（不含运费）：<b style="color:red">&yen; {{ price }}</b>  元
            <Button style="margin-left:20px" type="warning" size="small" @click="batchOrder">批量下单</Button>
        </div>
        <Tabs>
            <Tab-pane :label="`全部商品（${ maxCount }）`">
                <cart-listtable :dataList="cartListData" :clear="doClear" @on-undate-price="updatePrice" @on-init-list="getCartData"></cart-listtable>
                <Page :total="maxCount" show-total v-show="maxCount>0" @on-change="pageChange" :current="currentPage+1"></Page>
            </Tab-pane>
        </Tabs>
        <Modal v-model="batchOrderShow" width="400">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-list"></Icon>
                <span>批量下单</span>
            </p>
            <div>
                <ul class="batch-list">
                    <li style="height:30px">
                        <div class="desc">商品信息</div>
                        <div class="number">数量</div>
                    </li>
                    <li v-for="cart in getItems(checkList)">
                        <div class="desc">
                            {{ cart.desc }}
                        </div>
                        <div class="number">
                            {{ cart.count }}{{ cart.unit }}
                        </div>
                    </li>
                </ul>
                <Form label-position="left" :label-width="50" style="margin-top:10px">
                    <Form-item label="时间">
                        <Row>
                            <Col span="6">
                                <Form-item>
                                    <Input-number :min="0" v-model="dateTime.day" size="small"></Input-number>
                                </Form-item>
                            </Col>
                            <Col span="2" style="text-align: center">天</Col>
                            <Col span="6">
                                <Form-item>
                                <Input-number :min="0" :max="59" v-model="dateTime.hour" size="small"></Input-number>
                                </Form-item>
                            </Col>
                            <Col span="2" style="text-align: center">时</Col>
                            <Col span="6">
                                <Form-item>
                                <Input-number :min="0" :max="59" v-model="dateTime.minute" size="small"></Input-number>
                                </Form-item>
                            </Col>
                            <Col span="2" style="text-align: center">分</Col>
                        </Row>
                    </Form-item>
                </Form>
                <div style="text-align:right;color:red">总金额：{{ price }}元</div>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="doBatchOrder">下单</Button>
            </div>
        </Modal>
    </div>
</template>


<script>
import { myCarts, translateAllCart } from '@/utils/http'
import cartListtable from './cartListTable'
export default {
    components: {
        cartListtable
    },
    data(){
        return {
            doClear:0,//让子组件执行情况全选操作的标识字段
            cartListData:[],
            maxCount: 0,
            price: 0,
            currentPage:0,
            batchOrderShow: false,
            checkList: [],
            postData:{},
            dateTime:{
                day: 1,
                hour: 0,
                minute: 0
            }
        }
    },
    created () {
        this.getCartData();
    },
    methods: {
        transformDeadline(){
            return (this.dateTime.day * 86400 + this.dateTime.hour * 3600 + this.dateTime.minute * 60) * 1000
        },
        updatePrice(totlePrice,check){
            this.price = totlePrice;
            this.checkList = check;
        },
        getCartData(){
            this.$http.get(myCarts,{
                params:{
                    currentPage: this.currentPage,
                    pageCount:10
                }
            }).then(res => {
                let data = res.data.data;
                // 处理数据，加上数量统计，方便计算
                data.cars.map(el => {
                    el.count = 1;
                });
                this.cartListData = data.cars;
                this.maxCount = data.maxCount;
            })
        },
        // 批量下单
        batchOrder(){
            if(this.checkList.length === 0){
                this.$Message.error('请勾选商品！');
            }else{
                this.batchOrderShow = true;
            }
        },
        doBatchOrder(){
            this.$http.post(translateAllCart,{
                timeLimit: this.transformDeadline(),
                orders: JSON.stringify(this.getItems(this.checkList)),
                isFromCar: true
            }).then(res => {
                if(res.data.status === 0){
                    this.$Message.success('下单成功！');
                    this.batchOrderShow = false;
                    this.doClear = Math.random();
                    this.getCartData();
                }else{
                    this.$Message.error(res.data.errorMsg);
                }
            })
        },
        getItem(carId){
            let item = '';
            this.cartListData.forEach(el =>{
                if(el.carId === carId){
                    item = el;
                    return false
                }
            })
            return item;
        },
        getItems(carIds){
            let arr = [];
            let item = {};
            carIds.forEach(carId => {
                this.cartListData.forEach(el =>{
                    if(el.carId === carId){
                        el.productId = el.proId;
                        item = el;
                        return false
                    }
                });
                arr.push(item);
            });
            return arr;
        },
        pageChange(page){
            this.currentPage = page - 1;
            this.getCartData();
        }
    }
}
</script>


<style scoped>
    .cart-container{
        width: 100%;
        position: relative;
    }
    .totle-price-content{
        position: absolute;
        height: 36px;
        line-height: 36px;
        right: 0;
        top: 0;
        z-index: 2;
    }

    .batch-list{
        width: 100%;
    }

    .batch-list li{
        width: 100%;
        height: 30px;
        border-bottom: 1px solid #ccc;
        line-height: 30px;
    }

    .batch-list li>div{
        float: left;
    }

    .batch-list li .desc {
        width: 70%;
        overflow: hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
    }

    .batch-list li .number{
        width: 30%;
        text-align: center;
    }
</style>
