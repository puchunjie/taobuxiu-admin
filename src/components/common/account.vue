<template>
    <Tabs>
        <Tab-pane label="账户安全">
            <Alert type="success" show-icon>
                <template slot="desc">
                    <div class="item clearfix">
                        <div class="tit">登录密码</div>
                        <div class="info">建议修改</div>
                        <div class="dec">为了确保账户安全，建议经常修改密码</div>
                        <div class="action">
                            <Button type="info" size="small" @click="hide = true">修改密码</Button>
                        </div>
                    </div>
                </template>
            </Alert>
            <Alert type="success" show-icon>
                <template slot="desc">
                    <div class="item clearfix">
                        <div class="tit">验证手机</div>
                        <div class="info">已绑定</div>
                        <div class="dec">您的手机：（{{ this.hideMobile }}）已成功验证</div>
                    </div>
                </template>
            </Alert>
        </Tab-pane>
        <!--修改密码弹框-->
        <Modal v-model="hide" width="360" @on-cancel="reset">
            <p slot="header" style="color:#0c6;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>修改密码</span>
            </p>
            <div style="text-align:center">
                <Form :model="passWord" label-position="left">
                    <Form-item label="旧密码">
                        <Input v-model="passWord.oldPassword" type="password" size="small" @on-blur="checkLength(passWord.oldPassword),isOldTure = true"></Input>
                    </Form-item>
                    <Form-item label="新密码">
                        <Input v-model="passWord.newPassword" type="password" size="small" @on-blur="checkLength(passWord.newPassword,isOld)"></Input>
                    </Form-item>
                    <Form-item label="再次确认">
                        <Input v-model="passWord.newPasswordConfirm" @on-blur="checkLength(passWord.newPasswordConfirm,checkSame)" type="password" size="small"></Input>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="success" size="large" long @click="modifyPassword">修改</Button>
            </div>
        </Modal>
    </Tabs>
</template>


<script>
    import { profile, mPassword } from '@/utils/http'
    export default {
        data(){
            return {
                mobile:'',
                hide: false,
                passWord:{
                    oldPassword: '',
                    newPassword: '',
                    newPasswordConfirm: ''
                },
                isOldTure:false,
                isNewTrue:false,
                isConfTrue:false
            }
        },
        computed: {
            hideMobile(){
                return this.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
            }
        },
        created () {
            this.$http.get(profile).then(res => {
                if(res.data.status ===0){
                    this.mobile = res.data.data.mobile;
                }
            })
        },
        methods: {
            reset(){
                this.passWord.newPassword = '';
                this.passWord.newPasswordConfirm = '';
                this.passWord.oldPassword = '';
            },
            modifyPassword(){
                if(this.isOldTure && this.isNewTrue && this.isConfTrue){
                    this.$http.post(mPassword,this.passWord).then(res => {
                        if(res.data.status === 0){
                            this.$Message.success('修改成功！');
                            this.hide = false;
                        }else{
                            this.$Message.error(res.data.errorMsg);
                        }
                    })
                }else{
                    this.$Message.error('请检查是否有误!')
                } 
            },
            checkSame(){
                if(this.passWord.newPassword != this.passWord.newPasswordConfirm){
                    if(this.passWord.newPassword === ''){
                        this.$Message.error('请输入新密码!')
                    }else{
                        this.$Message.error('重复输入有误，请重新输入!')
                        this.passWord.newPasswordConfirm = '';
                    }
                }else{
                    this.isConfTrue = true
                }
            },
            isOld(){
                if(this.passWord.oldPassword === this.passWord.newPassword){
                    this.$Message.error('新密码不能和旧密码相同!')
                    this.passWord.newPassword = '';
                }else{
                    this.isNewTrue = true
                }
            },
            checkLength(str,callback){
                if(str.length<6){
                    this.$Message.error('密码长度不小于6位!')
                }else{
                    if(callback)
                        callback()
                }
            }
        }
    }
</script>

<style scoped>
    .item{
        width: 100%;
        text-align: center;
        font-size: 14px;
    }
    .item>div{
        float: left;
    }

    .tit{
        width: 20%;
        font-weight: bold;
    }

    .info{
        width: 20%;
        font-size: 12px;
    }

    .dec{
        width: 40%;
        font-size: 12px;
        color: #f57c00;
    }
    .action{
        width: 20%;
    }
</style>
