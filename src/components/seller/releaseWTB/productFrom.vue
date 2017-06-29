<template>
    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="不锈钢品类" class="ivu-form-item-required">
            <Select v-model="formValidate.ironType" placeholder="请选择不锈钢品类" size="small">
                <Option v-for="item in ironTypes" :value="item">{{ item }}</Option>
            </Select>
        </Form-item>
        <Form-item label="表面种类" class="ivu-form-item-required">
            <Select v-model="formValidate.surface" placeholder="请选择表面种类" size="small">
                <Option v-for="item in surfaces" :value="item">{{ item }}</Option>
            </Select>
        </Form-item>
        <Form-item label="材质种类" class="ivu-form-item-required">
            <Select v-model="formValidate.material" placeholder="请选择材质种类" size="small">
                <Option v-for="item in materials" :value="item">{{ item }}</Option>
            </Select>
        </Form-item>
        <Form-item label="不锈钢产地" class="ivu-form-item-required">
            <Select v-model="formValidate.proPlace" placeholder="请选择不锈钢产地" size="small">
                <Option v-for="item in proPlaces" :value="item">{{ item }}</Option>
            </Select>
        </Form-item>
        <Form-item label="货源所在地" class="ivu-form-item-required">
            <Cascader :data="citys" v-model="formValidate.locationCityIds" size="small" placeholder="请选择货源所在地" style="margin-top:5px"></Cascader>
        </Form-item>
        <Form-item label="发布规格" class="ivu-form-item-required"  prop="title">
            <Input v-model="formValidate.title" size="small" placeholder="请输入规格及公差等参数，如12*1500*6000，11.45-11.5"></Input>
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
        <Form-item label="库存量" class="ivu-form-item-required">
            <Row>
                <Col span="5">
                    <Form-item>
                        <Input-number :min="0" v-model="formValidate.numbers" size="small"></Input-number>
                    </Form-item>
                </Col>
                <Col span="6">
                    kg(公斤)
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
        <Form-item label="是否低价" style="position:relative;">
            <Row>
                <Col span="5">
                    <Checkbox v-model="formValidate.isSpec">{{ formValidate.isSpec ? '是' : '否' }}</Checkbox>
                </Col>
                <Col span="19"><b style="color:red;">低于市场价的急售/特价货源淘不锈将根据市场价进行仔细审核</b></Col>
            </Row>
        </Form-item>
        <Form-item>
            <Button style="margin-top:20px" type="primary" @click="handleSubmit('formValidate')" :loading="ajaxLoading">提交</Button>
        </Form-item>
    </Form>
</template>

<script>
    import { ironTypes, surfaces, materials, proPlaces, units, citys } from '@/utils/data'
    import { ironPush } from '@/utils/http'
    export default {
        created () {
            let _this = this;
            setTimeout(function(){
                _this.citys = citys;
            },500)
            this.ironTypes = ironTypes;
            this.surfaces = surfaces;
            this.materials = materials;
            this.proPlaces = proPlaces;
            this.units = units;
        },
        data () {
            return {
                ajaxLoading:false,
                citys: [],
                ironTypes: [],
                surfaces: [],
                materials: [],
                proPlaces: [],
                units: [],
                formValidate: {
                    ironType: '不锈钢卷',//品类
                    surface: 'No.1',//表面
                    material: '201(L1,L2)',//材质
                    proPlace: '太钢',//产地
                    numbers: 0,//数量
                    locationCityIds: [],//交货地点
                    sourceCityId: '',
                    unit: 'kg',//单位
                    price: 0,//价格
                    title: '',//规格
                    cover: '',//封面
                    image1: '',
                    image2: '',
                    image3: '',
                    isSpec:false //是否是低价资源
                },
                ruleValidate:{
                    title: [
                        { required: true, message: '规格不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // 提交表单
            handleSubmit (name) {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.formValidate.sourceCityId = this.formValidate.locationCityIds[this.formValidate.locationCityIds.length - 1];
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
                            this.$http.post(ironPush,formData,{
                                headers: { 'Content-Type': 'multipart/form-data' },
                                pic: true
                            }).then(res => {
                                if(res.data.status === 0){
                                    this.$Message.success('提交成功！');
                                    this.$router.push('/nadmin/account/seller/shopProduct');
                                }else{
                                    this.$Message.error(res.data.errorMsg);
                                }
                                this.ajaxLoading = false;
                            })
                        }else{
                            this.$Message.error('请将信息填写完整!');
                        }
                    } else {
                        this.$Message.error('请将信息填写完整!');
                    }
                });
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
                return this.formValidate.sourceCityId != undefined && this.formValidate.title != '' && this.formValidate.cover !='' 
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

