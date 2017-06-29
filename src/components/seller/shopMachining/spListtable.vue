<template>
    <div class="list-table-container">
        <div class="table-header clearfix">
            <table>
                <tr>
                    <td  class="table-header-item" v-for="(hItem,index) in headList" :style="{width:hItem.width+'px'}">
                        {{ hItem.title }}
                    </td>
                </tr>
            </table>
        </div>
        <div v-show="dataList.length === 0" style="text-align:center">暂无数据</div>
        <div class="table-content">
            <div class="table-item" v-for="(tableItem,index) in dataList">
                <table class="body">
                    <tr>
                        <td class="img" :style="{width:headList[0].width + 'px'}">
                             <img :src="'http://www.itaobuxiu.com'+tableItem.cover">
                        </td>
                        <td :style="{width:headList[1].width + 'px'}">
                             {{ tableItem.type }}
                        </td>
                        <td :style="{width:headList[2].width + 'px'}">
                            {{ tableItem.title }}
                        </td>
                         <td :style="{width:headList[3].width + 'px'}">
                            {{ tableItem.sourceCity }}
                        </td>
                        <td :style="{width:headList[4].width + 'px'}" class="input">
                             <Input v-model="tableItem.price">
                                <span slot="prepend">&yen;</span>
                                <span slot="append">/{{ tableItem.unit }}</span>
                            </Input>
                        </td>
                        <td :style="{width:headList[5].width + 'px'}">
                            <a @click="update(tableItem)">保存修改</a>
                            <a @click="showDel(tableItem.id)">删除</a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <!--删除弹框-->
        <Modal v-model="deteleModel" width="300">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>确认删除？</span>
            </p>
            <div style="text-align:center">
                <p>删除后，将无法撤回。</p>
                <p>是否继续？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="del">删除</Button>
            </div>
        </Modal>
    </div>
</template>


<script>
    import { updateMachining, deleteMachining } from '@/utils/http'

    export default {
        props:{
            headList:{
                type:Array,
                default:function(){
                    return [{
                        title:'资源封面',
                        width:120
                    },
                    {
                        title:'加工种类',
                        width:120
                    },
                    {
                        title:'资源标题',
                        width:200
                    },
                    {
                        title:'所在地',
                        width:120
                    },
                    {
                        title:'加工单价',
                        width:220
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
                deteleModel:false,
                id:''
            }
        },
        methods: {
            update(item){
                this.$http.post(updateMachining,{
                    handingId: item.id,
                    price: item.price,
                    title: item.title,
                    numbers: item.numbers
                }).then(res => {
                    if(res.data.status === 0){
                        this.$Message.success('修改成功！');
                        this.$emit('on-reset-list')
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            },
            showDel(id){
                this.deteleModel = true;
                this.id = id;
            },
            del(){
                this.$http.post(deleteMachining,{
                    handingId: this.id
                }).then(res => {
                    if(res.data.status === 0){
                        this.$Message.success('删除成功!');
                        this.deteleModel = false;
                        this.$emit('on-reset-list');
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
        height: 80px;
        line-height: 80px;
        border-right: 1px solid #ececec;
    }

    .table-item .body .img{
        position: relative;
    }

    .table-item .body .img img{
        display: block;
        position: absolute;
        width: 60px;
        height: 60px;
        left:30px;
        top:10px;
    }

    .input{
        position: relative;
    }

    .input .ivu-input-wrapper{
        position: absolute;
        width: 180px;
        left: 20px;
        top: 25px;
    }
</style>
