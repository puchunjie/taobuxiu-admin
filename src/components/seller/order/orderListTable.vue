// 订单列表-我的订单定制,在orders.vue中引用

<template>
    <div class="list-table-container">
        <div class="table-header clearfix">
            <table>
                <tr>
                    <td  class="table-header-item" v-for="hItem in headList" :style="{width:hItem.width+'px'}">{{ hItem.title }}</td>
                </tr>
            </table>
        </div>
        <div v-show="dataList.length === 0" style="text-align:center">暂无数据</div>
        <div class="table-content">
            <div class="table-item" v-for="tableItem in dataList">
                <div class="head">
                    下单日期：{{ new Date(tableItem.sellTime) | moment("YYYY年MM月DD日 HH:mm") }}  
                    &nbsp;&nbsp;&nbsp;&nbsp; 订单号：{{ tableItem.id }}
                </div>
                <table class="body">
                    <tr>
                        <td class="item-info" :style="{width:headList[0].width + 'px'}">
                            <img class="item-info-img" :src="'http://www.itaobuxiu.com'+tableItem.cover">
                            <div class="item-info-skus">
                                <p>{{ tableItem.desc }}</p>
                                <span>所在地：{{ tableItem.city }}</span>
                            </div>
                        </td>
                        <td class="item-unit-price" :style="{width:headList[1].width + 'px'}">
                            &yen;{{ tableItem.price }}/{{ tableItem.unit }}
                        </td>
                        <td class="item-count" :style="{width:headList[2].width + 'px'}">
                            {{ tableItem.count + tableItem.unit }}
                        </td>
                        <td class="item-totle-price" :style="{width:headList[3].width + 'px'}">
                            	&yen;{{ tableItem.sellMoney }}
                        </td>
                        <td class="item-status" :style="{width:headList[4].width + 'px'}" >
                            <div class="status-content">
                                <template v-if="tableItem.status === 0">
                                    <p>待确认</p>
                                    <p>
                                        <count-down :style="{color:'red'}" :endTime="computedTime(tableItem.sellTime,tableItem.timeLimit)" :callback="endCallback" endText="已经结束了"></count-down>
                                    </p>
                                </template>
                                <template v-else-if="tableItem.status === 1">
                                    <p :style="{marginTop:tableItem.message?'0':'10px'}"> 交易成功</p>
                                    <p>对方未评价</p>
                                </template>
                                <template v-else-if="tableItem.status === 2">
                                    <p> 交易成功</p>
                                    <p>已评价</p>
                                    <p>
                                        <Tooltip :content="tableItem.score+'分'" placement="top">
                                            查看订单评分
                                        </Tooltip>
                                    </p>
                                </template>
                                <template v-else-if="tableItem.status === 3">
                                    <p style="margin-top: 20px;">已取消</p>
                                </template>
                                <p v-if="tableItem.message">
                                    <Tooltip :content="tableItem.message" placement="top">
                                        查看备注
                                    </Tooltip>
                                </p>
                            </div>
                        </td>
                        <td class="item-action" :style="{width:headList[5].width + 'px'}">
                            <a v-show="tableItem.status === 0" @click="confOrder(tableItem.id)">确认订单</a>
                            <a v-show="tableItem.status === 0" @click="delOrder(tableItem.id,false)">取消订单</a>
                            <a v-show="tableItem.status === 1 || tableItem.status === 2" @click="delOrder(tableItem.id,true)">删除订单</a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <!--确认订单-->
        <Modal v-model="confModel" width="300">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>是否确认接收此订单？</span>
            </p>
            <div style="text-align:center">
                <p>是否继续？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="ajaxLoading" @click="conf">确认订单</Button>
            </div>
        </Modal>
        <!--删除、取消订单-->
        <Modal v-model="delModel" width="300">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>是否{{ typeText }}订单？</span>
            </p>
            <div style="text-align:center">
                <p>是否继续？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="ajaxLoading" @click="del">{{ typeText }}订单</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import countDown from '@/components/com/countDown'
    import { sconfOrder, sdelOrder, scelOrder } from '@/utils/http'

    export default {
        components: {
            countDown
        },
        props:{
            headList:{
                type:Array,
                default:function(){
                    return [{
                        title:'货品详情',
                        width:300
                    },
                    {
                        title:'单价',
                        width:100
                    },
                    {
                        title:'数量',
                        width:100
                    },
                    {
                        title:'总金额(元)',
                        width:100
                    },
                    {
                        title:'交易状态',
                        width:200
                    },
                    {
                        title:'操作',
                        width:200
                    }]
                }
            },
            dataList:{
                type:Array,
                default:function(){
                    return []
                }
            }
        },
        data(){
            return {
                delModel: false,
                confModel: false,
                activeOrder: '',
                ajaxLoading: false,
                typeText: '',
                type: true
            }
        },
        methods: {
            // 计算剩余多少确认时间
            computedTime(startTime,limitTime){
                let endTime = startTime + limitTime;
                return endTime
            },
            endCallback(item){
            },
            confOrder(id){
                this.confModel = true;
                this.activeOrder = id;
            },
            conf(){
                this.ajaxLoading = true;
                this.$http.post(sconfOrder,{
                    orderId: this.activeOrder
                }).then(res => {
                    if(res.data.status === 0){
                        this.confModel = false;
                        this.$root.eventHub.$emit('initList');
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                    this.ajaxLoading = false;
                })
            },
            delOrder(id,type){
                this.delModel = true;
                this.activeOrder = id;
                this.type = type;
                this.typeText = type ? '删除' : '取消';
            },
            del(){
                this.ajaxLoading = true;
                let postType = this.type ? sdelOrder : scelOrder;
                this.$http.post(postType,{
                    orderId: this.activeOrder
                }).then(res => {
                    if(res.data.status === 0){
                        this.ajaxLoading = false;
                        this.delModel = false;
                        this.$root.eventHub.$emit('initList');
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            }
        }
  
    }
</script>


<style scoped>
    .list-table-container{
        width:100%;
        padding-bottom: 10px;
    }

    .table-header{
        margin: 10px 0;
        background-color: #f5f5f5;
        box-sizing: border-box;
        text-align: center;
        width: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        color: #3c3c3c;
        table-layout: fixed;
    }

    .table-header-item{
        height: 40px;
        line-height: 40px;
    }

    .table-content{
        width: 100%;
    }
    .table-content .table-item{
        width: 100%;
        text-align: left;
        margin-bottom: 10px;
        border:1px solid #ececec;
    }

    .table-item .head {
        width: 100%;
        height: 42px;
        line-height: 42px;
        background-color: #f1f1f1;
        text-indent: 10px;
    }
    .table-item .body{
        width: 100%;
        text-align: center;
    }

    .table-item .body td{
        line-height: 110px;
    }

    .item-info,.item-unit-price,.item-count,
    .item-totle-price,.item-status{
        border-right: 1px solid #ececec;
    }

    .item-info,.item-status{
        position: relative;
    }

    .item-info-img{
        position: absolute;
        display: block;
        width: 80px;
        height: 80px;
        left: 10px;
        top:15px;
    }
    .item-info-skus{
        position: absolute;
        width: 180px;
        height:80px;
        top: 15px;
        left: 100px;
        line-height: 20px;
        text-align: left;
        color:#3c3c3c;
    }
    .item-info-skus span{
        line-height: 40px;
        color:#9e9e9e;
    }

    .item-status p{
        line-height: 20px;
    }
    .item-action a{
        line-height: 20px;
    }
    .status-content{
        position: absolute;
        top:25px;
        text-align: center;
        width: 100%;
    }
</style>
