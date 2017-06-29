<template>
    <div class="item-container" v-if="itemData.buy">
        <div class="item-info">
            <Spin fix v-if="!ajaxLoad">加载中...</Spin>
            <div class="tit">
                求购细节
                <span v-if="itemData.buy.status === 0">报价期限： 
                    <count-down :style="{color:'red'}" 
                    :endTime="itemData.buy.pushTime+itemData.buy.timeLimit" 
                    :callback="endCallback" 
                    endText="已经结束了"></count-down>
                </span>
                <span v-if="itemData.buy.status === 1">
                    成交时间：
                    {{ new Date(itemData.buy.supplyWinTime) | moment("YYYY年MM月DD日 HH:mm") }}
                </span>
                <span v-if="itemData.buy.status === 2">
                    过期时间：
                    {{ new Date(itemData.buy.pushTime + itemData.buy.timeLimit) | moment("YYYY年MM月DD日 HH:mm") }}
                </span>
            </div>
            <h3 class="elli">
                {{ itemData.buy.handingType }}
            </h3>
            <p class="note">
                 备注：{{ itemData.buy.message }}
            </p>
            <p class="state">
                {{ itemData.buy.sourceCity }}
            </p>
        </div>
        <div class="item-list-content">
            <div class="table-header clearfix">
                <div class="table-header-item" 
                v-for="(item,index) in headList" 
                :style="{width:item.width+'px',textAlign:item.algin}"
                >{{ item.title }}</div>
            </div>
            <div class="table-content">
                <Spin fix v-if="!ajaxLoad">加载中...</Spin>
                <div class="no-data" v-if="itemData.supplies.length === 0">暂时没有数据</div>
                <table v-else>
                    <tr v-for="item in itemData.supplies">
                        <td class="date" :style="{width:headList[0].width+'px'}">
                            <div>{{ new Date(item.offerTime) | moment("YYYY年MM月DD日 HH:mm") }}</div>
                        </td>
                        <td class="company" :style="{width:headList[1].width+'px'}">
                            <div>
                                <p>{{ item.companyName }}</p>
                                <p>{{ item.contact }}: {{ item.mobile }}</p>
                                <!--<p>综合评分：{{ item.score }}</p>-->
                                <p>抢单成功次数：{{ item.winningTimes }}</p>
                            </div>
                        </td>
                        <td class="font-red" :style="{width:headList[2].width+'px'}">
                            &yen;{{ item.supplyPrice }}/{{ item.unit }}
                        </td>
                        <td class="desc" :style="{width:headList[3].width+'px'}">
                            <Tooltip :content="item.supplyMsg === '' ? '这家伙很懒，什么都没留下' : item.supplyMsg" placement="left">
                                查看备注
                            </Tooltip>
                        </td>
                        <td :style="{width:headList[4].width+'px'}">
                            <a v-if="itemData.buy.status === 0" class="action-btn status0" @click="choise(itemData.buy.id,item.sellerId)">选他中标</a>
                            <a v-if="itemData.buy.status === 1 && item.isWinner" class="action-btn status1">已中标</a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>


<script>
import countDown from '@/components/com/countDown'
import { hselectSupply } from '@/utils/http'
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
            headList:[{
                title:'时间',
                width:120,
                algin:'center'
            },
            {
                title:'供应商',
                width:168,
                algin:'left'
            },
            {
                title:'报价',
                width:170,
                algin:'center'
            },
            {
                title:'备注',
                width:80,
                algin:'center'
            },
            {
                title:'操作',
                width:120,
                algin:'center'
            }]
        }
    },
    methods: {
        choise(handingBuyId,supplyId){
            let _this = this;
            this.$http.post(hselectSupply,{
                handingBuyId:handingBuyId,
                supplyId:supplyId
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
        },
        endCallback(){

        }
    }
}
</script>

<style scoped>
    .item-container{
        width:100%;
    }

    .item-info{
        width: 100%;
        border:1px solid #e6e6e6;
        padding: 0 10px 10px;
        line-height: 24px;
        font-size: 14px;
        height: 134px;
        position: relative;
    }

    .item-info .tit{
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        border-bottom: 1px dashed #ccc;
        margin-bottom: 10px;
    }

    .item-info .tit span{
        float: right;
    }

    .item-info .tit span p{
        display: inline-block;
    }

    .item-list-content{
        width: 100%;
        border:1px solid #e6e6e6;
        margin-top:10px;
    }
    .item-list-content .table-header{
        width: 100%;
        height: 30px;
        line-height: 30px;
        background-color: #f1f1f1;
    }
    .table-header-item{
        float: left;
        text-align: center;
    }

    .table-content{
        width: 100%;
        position: relative;
        overflow-x: hidden;
        max-height: 428px;
    }

    .table-content table{
        text-align: center;
        line-height: 80px;
    }

    .table-content table tr{
        border-bottom: 1px dashed #ccc;
    }

    .table-content table tr:last-child{
        border:0;
    }

    .table-content table td{
        position: relative;
    }

    .company{
        text-align: left;
    }

    .company p,.desc p{
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }

    .company>div{
        position: absolute;
        width: 100%;
        line-height: 24px;
        top:5px;
    }

    .date>div{
        position: absolute;
        width: 100%;
        line-height: 24px;
        top: 20px;
    }

    .no-data{
        text-align: center;
        line-height: 24px;
        padding: 10px 0;
    }
    .font-red{
        color:#f12e0f;
        font-weight: bold;
    }
    .action-btn{
        position: absolute;
        display: inline-block;
        width: 70px;
        height: 24px;
        line-height: 24px;
        text-align: center;
        left: 30px;
        color: #fff;
        top: 28px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 3px;
    }

    .action-btn.status0{
        background-color: #f57c00;
    }

    .action-btn.status1{
        background-color: #f12e0f;
    }
</style>