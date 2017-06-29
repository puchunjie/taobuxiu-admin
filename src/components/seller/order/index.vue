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
                <order-listtable :dataList="waitForConfirmData"></order-listtable>
                <Page :total="waitForConfirm" show-total v-show="waitForConfirm>0" @on-change="pageChange" :current="currentPage+1"></Page>
            </div>
        </Tab-pane>
        <Tab-pane :label="'待评价('+ waitForEvaluate +')'">
            <div class="table-content">
                <order-listtable :dataList="waitForEvaluateData"></order-listtable>
                <Page :total="waitForEvaluate" show-total v-show="waitForEvaluate>0" @on-change="pageChange" :current="currentPage+1"></Page>
            </div>
        </Tab-pane>
        <Tab-pane :label="'已评价('+ evaluate +')'">
            <div class="table-content">
                <order-listtable :dataList="evaluateData"></order-listtable>
                <Page :total="evaluate" show-total v-show="evaluate>0"></Page>
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
            waitForConfirmData:[],//待确认
            waitForEvaluateData:[],//待评价
            evaluateData:[],//已评价
            waitForConfirm:0,
            waitForEvaluate:0,
            evaluate:0,
            maxCount:0,
            currentPage: 0
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
                    pageCount:10
                }
            }).then(res => {
                let Data = res.data.data;
                this.orderData = Data.orders;
                // 待确认列表
                this.waitForConfirmData = Data.orders.filter(el => {
                    return el.status === 0
                });
                // 待评价列表
                this.waitForEvaluateData = Data.orders.filter(el => {
                    return el.status === 1
                });
                // 已评价列表
                this.evaluateData = Data.orders.filter(el => {
                    return el.status === 2
                });
                this.waitForConfirm = this.waitForConfirmData.length;
                this.waitForEvaluate = this.waitForEvaluateData.length;
                this.evaluate = this.evaluateData.length;
                this.maxCount = Data.maxCount;
            });
        },
        pageChange(page){
            this.currentPage = page - 1;
            this.getCartData();
        },
        reset(){
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
