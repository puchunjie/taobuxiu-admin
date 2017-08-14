<template>
    <Tabs @on-click="reset">
        <Tab-pane :label="'所有订单('+ maxCount +')'">
            <div class="table-content">
                <order-listtable :dataList="orderData"></order-listtable>
                <Page :total="maxCount" show-total v-show="maxCount>0" @on-change="pageChange" :current="currentPage+1"></Page>
            </div>
        </Tab-pane>
        <Tab-pane :label="'待确认('+ waitForConfirm +')'">
            <div class="table-content">
                <order-listtable :dataList="orderData"></order-listtable>
                <Page :total="waitForConfirm" show-total v-show="waitForConfirm>0" @on-change="pageChange" :current="currentPage+1"></Page>
            </div>
        </Tab-pane>
        <Tab-pane :label="'待评价('+ waitForEvaluate +')'">
            <div class="table-content">
                <order-listtable :dataList="orderData"></order-listtable>
                <Page :total="waitForEvaluate" show-total v-show="waitForEvaluate>0" @on-change="pageChange" :current="currentPage+1"></Page>
            </div>
        </Tab-pane>
        <Tab-pane :label="'已评价('+ evaluate +')'">
            <div class="table-content">
                <order-listtable :dataList="orderData"></order-listtable>
                <Page :total="evaluate" show-total v-show="evaluate>0" @on-change="pageChange"></Page>
            </div>
        </Tab-pane>
    </Tabs>
</template>


<script>
import { commingOrders } from '@/utils/http'
import orderListtable from './orderListTable'

export default {
    components: {
        orderListtable
    },
    data(){
        return{
            tableHeight:0,
            orderData:[],
            waitForConfirm:0,
            waitForEvaluate:0,
            evaluate:0,
            maxCount:0,
            currentPage: 0,
            status: -1
        }
    },
    created () {
        this.getCartData();
    },
    mounted () {
        this.tableHeight = document.getElementById("rightLayout").clientHeight - 160;
        //重置列表数据
        this.$root.eventHub.$on('initList', ()=>{
            this.getCartData();
        })
    },
    methods: {
        getCartData(){
            // 获取订单数据
            this.$http.get(commingOrders,{
                params:{
                    currentPage: this.currentPage,
                    pageCount:10,
                    status: this.status
                }
            }).then(res => {
                let data = res.data.data;
                this.orderData = data.orders;
                this.waitForConfirm = data.waitForConfirm;
                this.waitForEvaluate = data.waitEvaluate;
                this.evaluate = data.hasEvaluate;
                this.maxCount = data.allCounts;
            });
        },
        pageChange(page){
            this.currentPage = page - 1;
            this.getCartData();
        },
        reset(name){
            switch (name) {
                case 0:
                    this.status = -1;
                    break;
                case 1:
                    this.status = 0;
                    break;
                case 2:
                    this.status = 1;
                    break;
                case 3:
                    this.status = 2;
                    break;
                default:
                    this.status = -1;
                    break;
            }
            this.currentPage = 0;
            this.getCartData();
        }
    }
}
</script>

<style scoped>
    .table-content{
        width: 100%;
    }
</style>
