<template>
    <div class="want-container">
        <div class="want-header">
            <div class="status-tab clearfix">
                <div class="item" v-for="(item,index) in tabList" 
                :class="index === activeTab ? 'active' : ''"
                @click="changeDate(item.status,index)">
                    <p>{{ item.title }}</p>
                    <p>({{ item.count }})</p>
                </div>
                <div class="guwen">服务顾问：{{ salesManPhone }}</div>
            </div>
        </div>
        <div class="want-content clearfix">
            <div class="item-list">
                <div class="item-content">
                    <div class="item" v-for="(item,index) in itemList" 
                    :class="activeItemIndex === index ? 'active' : ''"
                    @click="switchItme(item.id,index)">
                        <h3 class="elli">{{ `${ item.ironType } | ${ item.material }| ${ item.surface }| ${ item.proPlace }` }}</h3>
                        <p class="state">{{ `${ item.height }*${ item.width }*${ item.length } | 公差 ${ item.tolerance }` }}</p>
                        <p class="note">备注：{{ item.message }}</p>
                        <p class="date">
                            {{ new Date(item.pushTime) | moment("YYYY年MM月DD日 HH:mm") }}
                            <span :class="'status' + item.status">{{ `${ itemStatus(item.status) }(${ item.supplyCount })` }}</span>
                        </p>
                        <div class="active-show">
                            <span class="right-arrow"></span>
                        </div>
                    </div>
                    <div v-if="itemList.length === 0" style="text-align:center">
                        暂无数据
                    </div>
                    <Spin fix v-if="!itemListLoad">加载中...</Spin>
                </div>
                <Page :total="maxCount" 
                @on-change="getPageDate"
                :page-size="pageCount" 
                :current="currentPage+1"
                size="small" v-show="maxCount>0"></Page>
            </div>
            <div class="item-detail" v-show="itemList[0]">
                <w-item :itemData="activeItem" :ajaxLoad="activeItemajaxLoad"></w-item>
            </div>
        </div>
    </div>
</template>


<script>
    import { myBuyList , myBuyDetail } from '@/utils/http'
    import wItem from './item.vue'

    export default {
        components: {
            wItem
        },
        data(){
            return{
                tabList:[{
                        title:'所有求购',
                        count: 0,
                        status: -1
                    },
                    {
                        title:'正在进行',
                        count: 0,
                        status: 0
                    },
                    {
                        title:'已成交',
                        count: 0,
                        status: 1
                    },
                    {
                        title:'已失效',
                        count: 0,
                        status: 2
                    }],
                salesManPhone:'',//服务顾问电话    
                activeTab:0,  //选中TAB选项下标
                itemList:[], //列表数据
                activeItem:{},//选中数据详情
                activeItemIndex:0,
                activeItemajaxLoad:false,//详情是否完成异步请求
                currentPage:0,//当前页码
                pageCount: 5, //每页个数
                maxCount:0,  //当前数据总条数
                itemListLoad:false  //itemList是否完成服务器请求
            }
        },
        created () {
            this.init();
        },
        methods: {
            init(){
                this.activeTab = 0
                this.itemList = []
                this.activeItem = {}
                this.activeItemIndex = 0,
                this.activeItemajaxLoad = false
                this.currentPage = 0
                this.maxCount = 0
                this.itemListLoad = false  
                // 获取所有状态数据的条数，接口设计不合理所以只能走4次接口来获取这些数据
                this.tabList.map(el => {
                    if(el.status === -1){
                        this.getBuyData(el.status)
                    }else{
                        this.getBuyData(el.status,0)
                    }
                })
            },
            //获取列表数据
            getBuyData(status,pageCount){
                this.itemListLoad = false;
                this.$http.get(myBuyList,{
                    params:{
                        currentPage : this.currentPage,
                        pageCount : pageCount || this.pageCount,
                        status: status
                    }
                }).then(res => {
                    let data = res.data.data;
                    //如果传入pageCount 说明是用来获取条数不做任何处理
                    if(pageCount === undefined){
                        this.itemList = data.buys;
                        this.maxCount = data.maxCount;
                        this.itemListLoad = true;
                        if(this.itemList[0]){
                            this.getDetial(this.itemList[0].id)
                        }else{
                            this.activeItem = {};
                            this.activeItemajaxLoad = true;
                            this.salesManPhone = '';
                        }    
                    }
                    this.tabList[status+1].count = data.maxCount;
                })
            },
            //获取资源详情
            getDetial(id){
                this.activeItemajaxLoad = false;
                // 拿到详情数据id
                this.$http.get(myBuyDetail,{
                    params:{
                         ironId: id
                    }
                }).then(res => {
                    this.activeItem = res.data.data;
                    this.salesManPhone = res.data.data.salesManPhone;
                    this.activeItemajaxLoad = true;
                })
            },
            // 分页获取数据
            getPageDate(page){
                this.activeItemIndex = 0;
                this.currentPage = page - 1;
                this.getBuyData(this.tabList[this.activeTab].status);
            },
            itemStatus(status){
                let ststusStr = '';
                switch (status) {
                    case 0:
                        ststusStr = '进行中'
                        break;
                    case 1:
                        ststusStr = '已确认'
                        break;
                    case 2:
                        ststusStr = '已取消'
                        break;       
                    default:
                        break;
                }
                return ststusStr;
            },
            // tab数据切换
            changeDate(status,index){
                this.activeItemajaxLoad = false;
                this.activeTab = index;
                this.currentPage = 0;
                this.activeItemIndex = 0;
                this.getBuyData(status);
            },
            //详情数据切换
            switchItme(id,index){
                if(this.activeItemIndex != index){
                    this.getDetial(id);
                    this.activeItemIndex = index;
                }
            }
        }
    }
</script>


<style scoped>
    .guwen{
        float:right;
        line-height:90px;
        font-size:13px;
        color:#007de4;
    }

    .want-container{
        width: 100%;
    }

    .want-header{
        width: 100%;
        height: 60px;
        border-bottom: 1px solid #e6e6e6;
    }

    .want-header .status-tab .item{
        width: 100px;
        height: 58px;
        float: left;
        text-align: center;
        font-size: 16px;
        color:#333;
        border-bottom: 3px solid transparent;
        box-sizing: content-box;
        cursor: pointer;
    }
    .status-tab .item p{
        line-height: 24px;
    }

    .want-header .status-tab .item.active{
        border-bottom: 3px solid #39f;
        color: #39f;
    }

    .want-content{
        width: 100%;
        position: relative;
    }
    .item-list{
        width: 300px;
        margin-top: 10px;
    }

    .item-content{
        width: 100%;
        height: 620px;
        position: relative;
    }

    .item-content .item{
        width: 100%;
        padding: 7.5px 10px;
        border:1px solid #e6e6e6;
        margin-bottom: 10px;
        color: #333;
        font-size: 14px;
        line-height: 24px;
        cursor: pointer;
        position: relative;
    }

    .active-show{
        position: absolute;
        width: 300px;
        height: 110px;
        left: 0;
        top: 0;
        border:4px solid #39f;
        display: none;
    }

    .right-arrow{
        display: block;
        width: 100%;
        height:100%;
        position: relative;
    }

    .right-arrow:after{
        position: absolute;
        content:'';
        right:-18px;
        top: 34px;
        width:0; 
        height:0; 
        border-top:15px solid transparent;
        border-bottom: 15px solid transparent;
        border-left: 15px solid #39f;
    }

    .item-content .item.active{
        border-color: transparent;
        background-color: #dce9f5;
    }

    .item-content .item.active .active-show{
        display: block;
    }
    .item .state {
        color: #000;
    }

    .item .note{
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }

    .item .date{
        color: #999;
    }

    .item .date span{
        float: right;
    }

    .item .date span.status1{
        color:green;
    }

    .item .date span.status0{
        color: #f57c00;
    }

    .item-detail{
        width:660px;
        position: absolute;
        right:0;
        top:0;
    }

</style>
