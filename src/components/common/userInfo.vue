<template>
    <Tabs>
        <Tab-pane label="个人资料">
            <Row style="width:900px;margin:0 auto">
                <Col span="2">当前头像:</Col>
                <Col span="3" class="incount">
                    <img class="head-pic" :src="'http://www.itaobuxiu.com'+pic">
                    <input class="file-btn" type="file" @change="showImg" ref="upload">
                </Col>
            </Row>
            <Row style="width:900px;margin:20px auto 0">
                <Col span="2">手机号码:</Col>
                <Col span="22">
                    {{ mobile }} <b style="color:red">(已验证)</b>
                </Col>
            </Row>
            <Row style="width:900px;margin:20px auto 0">
                <Col span="2">真实姓名:</Col>
                <Col span="5">
                    <Input v-model="name" size="small"></Input>
                </Col>
            </Row>
            <Row style="width:900px;margin:20px auto 0">
                <Col span="2">&nbsp;</Col>
                <Col span="5">
                    <Button type="success" @click="upload" :loading="ajaxLoading">修改</Button>
                </Col>
            </Row>
        </Tab-pane>
    </Tabs>
</template>

<script>
    import { profile, updateProfile } from '@/utils/http'
    export default {
        data(){
            return {
                ajaxLoading:false,
                mobile:'',
                pic: '',
                name: '',
                data:{}
            }
        },
        created () {
            this.$http.get(profile).then(res => {
                if(res.data.status ===0){
                    this.mobile = res.data.data.mobile;
                    this.pic = res.data.data.avator;
                    this.name = res.data.data.name;
                }
            })
        },
        methods: {
            showImg(){
                let _this = this;
                let input = this.$refs.upload ;
                let reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                reader.onload=function(e){
                   _this.pic = this.result;  
                }
            },
            upload(){
                let input = this.$refs.upload;  
                // 创建一个空的FormData对象   
                let data = new FormData();
                // 使用FormData.append来添加键/值对到表单里面;
                if(input.files[0])
                    data.append('avator', input.files[0]);
                data.append('name', this.name)
                this.ajaxLoading = true;
                this.$http.post(updateProfile,data,{
                    headers: { 'Content-Type': 'multipart/form-data' },
                    pic: true
                }).then(res => {
                    if(res.data.status === 0){
                        this.$Message.success('修改成功！');
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                    this.ajaxLoading = false;
                })
            }
        }       
    }
</script>

<style scoped>
    .incount{
        position: relative;
    }

    .head-pic{
        width: 80px;
        height: 80px;
        border-radius: 80px;
        cursor: pointer
    }

    .file-btn{
        position: absolute;
        width: 62px;
        left: 9px;
        top: 32px;
        display: none;
        cursor: pointer;
    }

    .incount:hover .file-btn{
        display: block!important;
    }
</style>
