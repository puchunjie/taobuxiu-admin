<template>
    <Tabs>
        <Tab-pane :label="`我的站内信(${ allCount })`">
            <Row class="head">
                <Col span="2">&nbsp;</Col>
                <Col span="3">发件人</Col>
                <Col span="8">邮件主题</Col>
                <Col span="6">时间</Col>
                <Col span="5">操作</Col>
            </Row>
            <Row class="item" v-for="item in dataList">
                <Col span="2" class="icon" :class="item.reviewed ? 'read' : 'unread'">
                    <Icon :type="item.reviewed ? 'email' : 'email-unread'"></Icon>
                </Col>
                <Col span="3">系统管理员</Col>
                <Col span="8">{{ item.title }}</Col>
                <Col span="6">{{ new Date(item.pushTime) | moment("YYYY年MM月DD日 HH:mm") }} </Col>
                <Col span="5">
                    <a @click="show(item.id,item.reviewed)">查看详情</a>
                    <a @click="showDel(item.id)">删除</a>
                </Col>
            </Row>
            <Page style="margin-top:30px" :page-size="pageCount" :total="allCount" show-total v-show="allCount>0" @on-change="pageChange" :current="currentPage+1"></Page>
        </Tab-pane>

        <!--详情弹框-->
        <Modal v-model="infoShow" width="400">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>消息详情</span>
            </p>
            <div style="text-align:center">
                <Row class="info-item">
                    <Col span="4">标题</Col>
                    <Col span="20" style="text-align:left">{{ activeData.title }}</Col>
                </Row>
                <Row class="info-item">
                    <Col span="4">时间</Col>
                    <Col span="20" style="text-align:left">{{ new Date(activeData.pushTime) | moment("YYYY年MM月DD日 HH:mm") }}</Col>
                </Row>
                <Row class="info-item">
                    <Col span="4">内容</Col>
                    <Col span="20" style="text-align:left">{{ activeData.message }}</Col>
                </Row>
            </div>
            <div slot="footer"></div>
        </Modal>
        <!--删除弹框-->
        <Modal v-model="delShow" width="300">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>此订邮件删除后，将无法撤回。</p>
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long @click="del">删除</Button>
            </div>
        </Modal>
    </Tabs>
</template>


<script>
    import { myInnerMessage, myInnerMessageDetail, deleteInnerMessage } from '@/utils/http'
    export default {
        created () {
            this.getMails()
        },
        data(){
            return {
                currentPage: 0,
                pageCount: 15,
                allCount: 0,
                dataList:[],
                infoShow: false,
                delShow: false,
                delId: '',
                activeData:{
                    message:"",
                    pushTime:0,
                    title:""
                }
            }
        },
        methods: {
            getMails(){
                this.$http.get(myInnerMessage,{
                    params:{
                        currentPage: this.currentPage,
                        pageCount: this.pageCount
                    }
                }).then(res => {
                    if(res.data.status === 0){
                        this.allCount = res.data.data.maxCount;
                        this.dataList = res.data.data.messages;
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            },
            pageChange(page){
                this.currentPage = page - 1;
                this.getMails();
            },
            show(id,isread){
                this.infoShow = true;
                this.$http.get(myInnerMessageDetail,{
                    params: {
                        messageId: id
                    }
                }).then(res => {
                    if(res.data.status === 0){
                        this.activeData.title = res.data.data.title;
                        this.activeData.pushTime = res.data.data.pushTime;
                        this.activeData.message = res.data.data.message;
                        if(!isread){
                            this.getMails();
                        } 
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            },
            showDel(id){
                this.delId = id;
                this.delShow = true;
            },
            del(){
                this.$http.post(deleteInnerMessage,{
                    messageId: this.delId
                }).then(res => {
                    if(res.data.status === 0){
                        this.$Message.success('已删除！');
                        this.delShow = false;
                        this.getMails();
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            }
        }
    }
</script>


<style scoped>
    .head{
        border-bottom:1px solid #ccc;
        line-height: 20px;
        padding-bottom: 10px;
    }
    .item{
        margin-top:10px;
    }
    .item > div,.head > div{
        line-height: 26px;
        text-align: center;
    }

    .item .icon{
        text-align: center;
        font-size: 24px;
        line-height: 20px;
    }

    .icon.read{
        color: #ccc;
    }
    .icon.unread{
        color: #f50;
    }

    .info-item{
        line-height: 30px;
    }
</style>
