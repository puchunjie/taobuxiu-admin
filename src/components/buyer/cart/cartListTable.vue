// 购物车列表,在mycart.vue中引用
<template>
    <div class="list-table-container">
        <div class="table-header clearfix">
            <table>
                <tr>
                    <td  class="table-header-item" v-for="(hItem,index) in headList" :style="{width:hItem.width+'px'}">
                        <template v-if="index === 0">
                            <Checkbox 
                            :value="checkAll" 
                            :indeterminate="indeterminate"
                            @click.prevent.native="handleCheckAll">全选</Checkbox>
                        </template>
                        <template v-else>
                            {{ hItem.title }}
                        </template>
                    </td>
                </tr>
            </table>
        </div>
        <div v-show="dataList.length === 0" style="text-align:center">暂无数据</div>
        <div class="table-content">
            <Checkbox-group v-model="checkAllGroup" @on-change="checkAllGroupChange">
            <div class="table-item" v-for="(tableItem,index) in dataList">
                <table class="body">
                    <tr>
                        <td class="item-check" :style="{width:headList[0].width + 'px'}">
                             <Checkbox :label="tableItem.carId"></Checkbox>
                             <div class="covered"></div>
                        </td>
                        <td class="item-info" :style="{width:headList[1].width + 'px'}">
                            <img class="item-info-img" :src="'http://www.itaobuxiu.com'+tableItem.cover">
                            <div class="item-info-skus">
                                <p>{{ tableItem.desc }}</p>
                                <span>所在地：{{ tableItem.sourceCity }}</span>
                            </div>
                        </td>
                        <td class="item-unit-price" :style="{width:headList[2].width + 'px'}">
                            &yen;{{ tableItem.price }}/{{ tableItem.unit }}
                        </td>
                        <td class="item-count" :style="{width:headList[3].width + 'px'}">
                            <Input-number :min="1" v-model="tableItem.count" size="small" @on-change="updateTotlePrice"></Input-number>{{ tableItem.unit }}
                        </td>
                        <td class="item-totle-price" :style="{width:headList[4].width + 'px'}">
                            	&yen;{{ tableItem.price * tableItem.count }}
                        </td>
                        <td class="item-action" :style="{width:headList[5].width + 'px'}">
                            <a @click="translateShow(tableItem)">立即下单</a>
                            <a @click="delShow(tableItem.carId)">删除</a>
                        </td>
                    </tr>
                </table>
            </div>
            </Checkbox-group>
        </div>
        <!--下单填写资料-->
        <Modal v-model="translateFormState" width="400" @on-cancel="resetForm">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>填写下单数据</span>
            </p>
            <div style="text-align:center">
                <Form :model="translateForm" label-position="right" :label-width="50">
                    <Form-item label="商品名">
                       <Row><Col style="text-align:left"> {{ translateForm.desc }} </Col></Row>
                    </Form-item>
                    <Form-item label="数量">
                        <Row>
                            <Col span="3">
                                <Form-item>
                                    <Input-number :min="0" v-model="translateForm.count" size="small"></Input-number>
                                </Form-item>
                            </Col>
                            <Col span="3" style="margin-left:30px">{{ translateForm.unit }}</Col>
                        </Row>
                    </Form-item>
                    <Form-item label="备注">
                        <Input size="small" v-model="translateForm.message"></Input>
                    </Form-item>
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
                    <div style="text-align:right;color:red">金额：{{ translateForm.price * translateForm.count }}元</div>
                </Form>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long  @click="translate">确认下单</Button>
            </div>
        </Modal>

        <!--删除弹框-->
        <Modal v-model="deteleModel" width="300">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>此宝贝删除后，将无法撤回。</p>
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="del">删除</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import { deleteCart, translateCart } from '@/utils/http'
    export default {
        props:{
            headList:{
                type:Array,
                default:function(){
                    return [{
                        title:'全选',
                        width:80
                    },
                    {
                        title:'货品详情',
                        width:284
                    },
                    {
                        title:'单价',
                        width:170
                    },
                    {
                        title:'数量',
                        width:130
                    },
                    {
                        title:'金额(元)',
                        width:100
                    },
                    {
                        title:'操作',
                        width:210
                    }]
                }
            },
            dataList:{
                type:Array,
                default:function(){
                    return []
                }
            },
            clear:{
                type:Number
            }
        },
        data(){
            return {
                translateForm:{
                    timeLimit: 0 ,//下单持续时间
                    message: '',  //下单留言
                    productType: 0,
                    productId: '',
                    count: 1,
                    isFromCar:true,
                    carId: '',
                    desc: '',
                    price: '',
                    unit: ''
                },
                dateTime:{
                    day: 1,
                    hour: 0,
                    minute: 0
                },
                deteleModel:false,
                translateFormState:false,
                totlePrice:0,
                indeterminate: false,
                checkAll: false,
                checkAllGroup: []
            }
        },
        created () {
            this.dataList.forEach(el =>{
                this.checkAllGroup.push(el.carId);
            });
        },
        methods: {
            // 全选
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;
                if (this.checkAll) {
                    this.checkAllGroup = [];
                    this.dataList.forEach(el => {
                        this.checkAllGroup.push(el.carId);
                    });
                } else {
                    this.checkAllGroup = [];
                }
                this.updateTotlePrice();
            },
            checkAllGroupChange(){
                if (this.checkAllGroup.length === this.dataList.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (this.checkAllGroup.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
                this.updateTotlePrice();
            },
            // 计算总价并更新总价
            updateTotlePrice(){
                this.totlePrice = 0;
                // 计算所有选中的商品的总价
                this.checkAllGroup.forEach(el => {
                    let checkItem = {};
                    this.dataList.forEach(subEl => {
                        if(subEl.carId === el){
                            checkItem = subEl;
                            return false
                        }
                    });
                    this.totlePrice += checkItem.price * checkItem.count;
                });
                this.$emit('on-undate-price',this.totlePrice,this.checkAllGroup);
            },
            // 下单
            translateShow(item){
                this.translateFormState = true;
                this.translateForm.productType= 0;
                this.translateForm.isFromCar= true;
                this.translateForm.productId = item.proId;
                this.translateForm.carId = item.carId;
                this.translateForm.count = item.count;
                this.translateForm.desc = item.desc;
                this.translateForm.price = item.price;
                this.translateForm.unit = item.unit;
            },
            translate(){
                this.$http.post(translateCart,this.translateForm).then(res => {
                    if(res.data.status === 0){
                        this.$Message.success('下单成功！');
                        this.translateFormState = false;
                        this.resetForm();
                        this.$emit('on-init-list');
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            },
            // 删除
            del(){
                this.$http.post(deleteCart,{
                    carId: this.translateForm.carId
                }).then(res => {
                    if(res.data.status === 0){
                        this.$Message.success('删除完毕');
                        this.deteleModel = false;
                        this.resetForm();
                        this.$emit('on-init-list');
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            },
            // 转换过期时间
            transformDeadline(){
                this.translateForm.timeLimit = (this.dateTime.day * 86400 + this.dateTime.hour * 3600 + this.dateTime.minute * 60) * 1000
            },
            resetForm(){
                this.translateForm.timeLimit = 0;
                this.translateForm.message = '';
                this.translateForm.productType= 0;
                this.translateForm.count= 1;
                this.translateForm.isFromCar= true;
                this.translateForm.productId= '';
                this.dateTime.day = 1;
                this.dateTime.hour = 0;
                this.dateTime.minute = 0;
            },
            delShow(id){
                this.translateForm.carId = id;
                this.deteleModel = true;
            }
        },
        mounted () {
            this.transformDeadline();
            this.$watch('dateTime.day', function (newVal, oldVal) {
                this.transformDeadline();
            });
            this.$watch('dateTime.hour', function (newVal, oldVal) {
                this.transformDeadline();
            });
            this.$watch('dateTime.minute', function (newVal, oldVal) {
                this.transformDeadline();
            });
        },
        watch: {
            'clear':function(){
                this.indeterminate = false,
                this.checkAll = false,
                this.checkAllGroup = [];
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
    .item-check{
        position: relative;
    }
    .covered{
        position: absolute;
        width: 50px;
        height: 20px;
        background: #fff;
        top: 45px;
        left:32px
    }
</style>
