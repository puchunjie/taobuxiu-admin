<template>
    <Tabs @on-click="reset">
        <Tab-pane :label="'所有订单('+ maxCount +')'">
            <div class="table-content">
                <order-listtable :dataList="orderData"></order-listtable>
                <Page :total="maxCount" show-total v-show="maxCount>0" @on-change="pageChange" :current="currentPage+1"></Page>
            </div>
        </Tab-pane>
        <Tab-pane :label="'等卖家确认('+ waitForConfirm +')'">
            <div class="table-content">
                <order-listtable :dataList="waitForConfirmData"></order-listtable>
                <Page :total="waitForConfirm" show-total v-show="waitForConfirm>0" @on-change="pageChange" :current="currentPage+1"></Page>
            </div>
        </Tab-pane>
        <Tab-pane :label="'待评价('+ waitForVote +')'">
            <div class="table-content">
                <order-listtable :dataList="waitForVoteData"></order-listtable>
                <Page :total="waitForVote" show-total v-show="waitForVote>0" @on-change="pageChange" :current="currentPage+1"></Page>
            </div>
        </Tab-pane>
    </Tabs>
</template>


<script>
import { myOrders } from '@/utils/http'
import orderListtable from './orderListTable'

export default {
    components: {
        orderListtable
    },
    data(){
        return{
            tableHeight:0,
            orderData:[],
            waitForConfirmData:[],
            waitForVoteData:[],
            waitForConfirm:0,
            waitForVote:0,
            maxCount:0,
            currentPage:0
        }
    },
    created () {
        this.getOrderData();
    },
    mounted () {
        this.tableHeight = document.getElementById("rightLayout").clientHeight - 160;
        //删除订单后重置列表数据
        this.$root.eventHub.$on('initList', ()=>{
            this.getOrderData();
        })
    },
    methods: {
        getOrderData(){
            // 获取订单数据
            this.$http.get(myOrders,{
                params:{
                    currentPage: this.currentPage,
                    pageCount:10
                }
            }).then(res => {
                if(res.data.status === 0){
                    let data = res.data.data;
                    this.orderData = data.orders;
                    this.waitForVoteData = data.orders.filter(el => {
                        return el.status === 1
                    });
                    this.waitForConfirmData = data.orders.filter(el => {
                        return el.status === 0
                    });
                    this.waitForVote = data.waitForVote;
                    this.waitForConfirm = data.waitForConfirm;
                    this.maxCount = data.maxCount;
                }else{
                    this.$Message.error(res.data.errorMsg)
                }
                
            });
        },
        // 分页获取数据
        pageChange(page){
            this.currentPage = page - 1;
            this.getOrderData();
        },
        reset(){
            this.currentPage = 0;
            this.getOrderData();
        }
    }
}
</script>

<style scoped>
    .table-content{
        width: 100%;
    }
</style>
