<template>
    <div class="sp-container">
        <div class="totle-price-content">
            共计：<b style="color:#39f">{{ maxCount }}</b>  个加工项目
        </div>
        <Tabs>
            <Tab-pane label="店铺加工管理">
                <sp-listtable :dataList="listData" @on-reset-list="getPageData"></sp-listtable>
                <Page :total="maxCount" show-total v-show="maxCount>0" :current="currentPage+1" @on-change="changePage"></Page>
            </Tab-pane>
        </Tabs>
    </div>
</template>


<script>
import { shopMachining } from '@/utils/http'
import spListtable from './spListtable'
export default {
    components: {
        spListtable
    },
    data(){
        return {
            listData:[],
            maxCount: 0,
            currentPage: 0
        }
    },
    created () {
        this.getPageData();
    },
    methods: {
        updatePrice(totlePrice){
            this.price = totlePrice;
        },
        getPageData(){
            this.$http.get(shopMachining,{
                params:{
                    currentPage: this.currentPage,
                    pageCount:10
                }
            }).then(res => {
                let data = res.data.data;
                this.listData = data.handings;
                this.maxCount = data.maxCount;
            })
        },
        changePage(page){
            this.currentPage = page - 1;
            this.getPageData()
        }
    }
}
</script>


<style scoped>
    .sp-container{
        width: 100%;
        position: relative;
    }
    .totle-price-content{
        position: absolute;
        height: 36px;
        line-height: 36px;
        right: 0;
        top: 0;
    }
</style>
