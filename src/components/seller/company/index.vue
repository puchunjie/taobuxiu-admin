<template>
    <Tabs>
        <Tab-pane label="企业资料管理">
            <div class="content">
                <div class="tabs">
                    <Form :model="formData" ref="formValidate" label-position="right" :label-width="110">
                        <h2 class="group-title">商家基本信息</h2>
                        <Form-item label="公司名称" prop="companyName">
                            {{ formData.companyName }}
                        </Form-item>
                        <Form-item label="注册资金" prop="regMoney">
                            <Row>
                                <Col span="21">{{ formData.regMoney }}万元</Col>
                            </Row>
                        </Form-item>
                        <h2 class="group-title">商家业务信息</h2>
                        <Form-item label="联系人" prop="contact">
                            <Input v-model="formData.contact"></Input>
                        </Form-item>
                        <Form-item label="联系电话" prop="cantactTel">
                            <Input v-model="formData.cantactTel"></Input>
                        </Form-item>
                        <Form-item label="传真" prop="fax">
                            <Input v-model="formData.fax"></Input>
                        </Form-item>
                        <Form-item label="办公地址">
                            <Row>
                                <!--<Col span="7">
                                    <Cascader :data="citys" v-model="formData.souCityIds"></Cascader>
                                </Col>-->
                                <Col span="24">{{ formData.officeAddress }}</Col>
                            </Row>
                            
                            
                        </Form-item>
                        <Form-item label="QQ">
                            <Input v-model="formData.qq"></Input>
                        </Form-item>
                         <Form-item label="上传头像">
                            <Row>
                                <Col span="4" class="img">
                                    <img :src="'http://www.itaobuxiu.com'+formData.cover">
                                </Col>
                                <Col span="1">&nbsp;</Col>
                                <Col span="4" class="select">
                                    <a>上传图片</a>
                                    <input type="file" ref="cover" @change="showImg('cover')">
                                </Col>
                            </Row>
                        </Form-item>
                        <Form-item label="店铺简介">
                            <Input v-model="formData.shopProfile" type="textarea" :rows="4"></Input>
                        </Form-item>
                    </Form>
                </div>

                <div class="footer">
                    <Button type="primary" @click="publish" :loading="ajaxLoading">确认保存</Button>
                </div>
            </div>
        </Tab-pane>
    </Tabs>
</template>


<script>
    import { citys } from '@/utils/data'
    import { sprofile,updatesProfile } from '@/utils/http'
    export default {
        data () {
            return {
                ajaxLoading:false,
                citys:[],
                formData:{
                    companyName: '',//公司名称
                    regMoney: '',//注册资金
                    contact: '',//联系人
                    cantactTel: '',//联系电话
                    fax: '',//传真
                    cityId:'',//城市id
                    officeAddress:'',//办公地址
                    qq: '',
                    cover:'',//店铺封面
                    shopProfile:'',//店铺简介
                    souCityIds:[]
                }
            }
        },
        methods: {
            showImg(ref){
                let _this = this;
                let input = this.$refs[ref] ;
                let reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                reader.onload=function(e){
                    if(ref === 'cover'){
                        _this.headImg = this.result;
                    }else{
                        _this.formData[ref] = input.value;
                    }
                     
                }
            },
            publish(){
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.formData.cityId = this.formData.souCityIds[this.formData.souCityIds.length - 1];
                        let formData = this.createFormData();
                        console.log(this.$refs.cover.files[0])
                        if(this.$refs.cover.files[0]){
                            formData.append('cover',this.$refs.cover.files[0]);
                        }
                         // 检查信息是否完整
                        if(this.checkForm()){
                            this.postData(formData);
                        }else{
                            this.$Message.error('请将信息填写完整!');
                        }
                        
                    } else {
                        this.$Message.error('请将信息填写完整!');
                    }
                });
            },
            checkForm(){
                let isOk = this.formData.cityId != '' && this.formData.officeAddress != '';
                return isOk
            },
            createFormData(){
                let data = new FormData();
                for (var key in this.formData) {
                    if(this.formData[key] != '' && key != 'cover')
                        data.append(key, this.formData[key])
                }
                return data
            },
            postData(data){
                this.ajaxLoading = true;
                this.$http.post(updatesProfile,data,{
                    headers: { 'Content-Type': 'multipart/form-data' },
                    pic: true
                }).then(res => {
                    if(res.data.status === 0){
                        this.$Message.success('提交成功');
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                    this.ajaxLoading = false;
                })
            }
        },
        created () {
            let _this = this;
            setTimeout(function(){
                _this.citys = citys;
            },500) 
            this.$http.get(sprofile).then(res => {
                if(res.data.status === 0){
                    let data = res.data.data;
                    this.formData.companyName = data.companyName;
                    this.formData.regMoney = data.regMoney;
                    this.formData.contact = data.contact;
                    this.formData.cantactTel = data.cantactTel;
                    this.formData.fax = data.fax;
                    this.formData.cityId = data.cityId;
                    this.formData.officeAddress = data.officeAddress;
                    this.formData.qq = data.qq;
                    this.formData.shopProfile = data.shopProfile;
                    this.formData.cover = data.cover;
                    this.formData.souCityIds.push(this.formData.cityId)
                }else{
                    this.$Message.error(res.data.errorMsg);
                }
            })
        }
    }
</script>

<style scoped>
    .content{
        width: 800px;
        margin: 0 auto;
    }

    .tabs{
        margin-top: 20px;
        width: 600px;
    }
    .clause{
        height: 600px;
        overflow-x: hidden;
        border: 1px solid #39f;
        padding: 10px;
        border-radius: 10px;
    }
    .footer{
        width: 200px;
        margin: 20px auto 0;
    }

    .group-title{
        height: 30px;
        font-size: 16px;
    }
    .select{
        position: relative;
        overflow: hidden;
    }
    .select input{
        position: absolute;
        left: -80px;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }

    .img img{
        width: 80px;
        height: 80px;
    }
</style>

