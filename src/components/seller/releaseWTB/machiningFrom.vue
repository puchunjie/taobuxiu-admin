<template>
    <Form ref="formValidate" :model="formValidate" :label-width="100">
        <Form-item label="加工种类" class="ivu-form-item-required">
            <Select v-model="formValidate.type" placeholder="请选择不锈钢品类" size="small">
                <Option v-for="item in machiningTypes" :value="item">{{ item }}</Option>
            </Select>
        </Form-item>
        <Form-item label="加工地点" class="ivu-form-item-required">
            <Cascader :data="citys" v-model="formValidate.souCityIds" size="small" style="margin-top:5px"></Cascader>
        </Form-item>
        <Form-item label="发布标题" class="ivu-form-item-required">
            <Input v-model="formValidate.title" placeholder="请输入标题" size="small"></Input>
        </Form-item>
        <Form-item label="发布价格" class="ivu-form-item-required">
            <Row>
                <Col span="4">
                    <Form-item>
                        <Input-number :min="0" v-model="formValidate.price" size="small"></Input-number>
                    </Form-item>
                </Col>
                <Col span="2" style="text-align: center">&nbsp;&nbsp;元/&nbsp;&nbsp;</Col>
                <Col span="4">
                    <Form-item>
                        <Select v-model="formValidate.unit" size="small">
                            <Option v-for="item in units" :value="item">{{ item }}</Option>
                        </Select>
                    </Form-item>
                </Col>
            </Row>
        </Form-item>
        <Form-item label="资源封面" class="ivu-form-item-required">
            <Row>
                <Col span="19">
                    <Input v-model="formValidate.cover" size="small"></Input>
                </Col>
                <Col span="1">&nbsp;</Col>
                <Col span="4" class="select">
                    <a>上传图片</a>
                    <input type="file" ref="cover" @change="showImg('cover')">
                </Col>
            </Row>
        </Form-item>
        <Form-item label="图片1">
            <Row>
                <Col span="19">
                    <Input v-model="formValidate.image1" size="small"></Input>
                </Col>
                <Col span="1">&nbsp;</Col>
                <Col span="4" class="select">
                    <a>上传图片</a>
                    <input type="file" ref="image1" @change="showImg('image1')">
                </Col>
            </Row>
        </Form-item>
        <Form-item label="图片2">
            <Row>
                <Col span="19">
                    <Input v-model="formValidate.image2" size="small"></Input>
                </Col>
                <Col span="1">&nbsp;</Col>
                <Col span="4" class="select">
                    <a>上传图片</a>
                    <input type="file" ref="image2" @change="showImg('image2')">
                </Col>
            </Row>
        </Form-item>
        <Form-item label="图片3">
            <Row>
                <Col span="19">
                    <Input v-model="formValidate.image3" size="small"></Input>
                </Col>
                <Col span="1">&nbsp;</Col>
                <Col span="4" class="select">
                    <a>上传图片</a>
                    <input type="file" ref="image3" @change="showImg('image3')">
                </Col>
            </Row>
        </Form-item>
        <Form-item>
            <Button type="primary" @click="handleSubmit('formValidate')" :loading="ajaxLoading">提交</Button>
        </Form-item>
    </Form>
</template>

<script>
    import { machiningTypes, citys } from '@/utils/data'
    import { handingPush } from '@/utils/http'
    export default {
        created () {
            let _this = this;
            this.machiningTypes = machiningTypes;
            setTimeout(function(){
                _this.citys = citys;
            },500)
        },
        data () {
            return {
                ajaxLoading:false,
                machiningTypes: [],
                citys:[],
                units:['吨','平方米','米'],
                formValidate: {
                    type:'整卷油磨',
                    title:'',
                    price: 0,
                    unit: '吨',
                    cover: '',
                    image1: '',
                    image2: '',
                    image3: '',
                    souCityIds: [],
                    souCityId:''
                }
            }
        },
        methods: {
            // 提交表单
            handleSubmit (name) {
                this.formValidate.souCityId = this.formValidate.souCityIds[this.formValidate.souCityIds.length - 1];
                if(this.checkFrom()){
                    this.ajaxLoading = true;
                    let formData = this.createFormData();
                    if(this.$refs.cover.files[0]){
                        formData.append('cover',this.$refs.cover.files[0]);
                    }
                    if(this.$refs.image1.files[0]){
                        formData.append('image1',this.$refs.image1.files[0]);
                    }
                    if(this.$refs.image2.files[0]){
                        formData.append('image2',this.$refs.image2.files[0]);
                    }
                    if(this.$refs.image3.files[0]){
                        formData.append('image3',this.$refs.image3.files[0]);
                    }
                    this.$http.post(handingPush,formData,{
                        headers: { 'Content-Type': 'multipart/form-data' },
                        pic: true
                    }).then(res => {
                        if(res.data.status === 0){
                            this.$Message.success('提交成功！');
                            this.$router.push('/nadmin/account/seller/shopMachining');
                        }else{
                            this.$Message.error(res.data.errorMsg);
                        }
                        this.ajaxLoading = false;
                    })
                }else{
                    this.$Message.error('请将信息填写完整!');
                }
            },
            showImg(ref){
                let _this = this;
                let input = this.$refs[ref] ;
                let reader = new FileReader();
                reader.readAsDataURL(input.files[0]);
                reader.onload=function(e){
                    _this.formValidate[ref] = input.value;
                }
            },
            createFormData(){
                let data = new FormData();
                for (var key in this.formValidate) {
                    if(this.formValidate[key] != '')
                        data.append(key, this.formValidate[key])
                }
                return data
            },
            checkFrom(){
                return this.formValidate.souCityId != undefined && this.formValidate.title != '' && this.formValidate.cover !='' 
            }
        }
    }
</script>

<style scoped>
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
</style>