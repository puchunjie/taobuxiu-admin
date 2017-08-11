<template>
    <Form ref="formValidate" :model="formValidate" :label-width="100">
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
        <Form-item label="厚度" class="ivu-form-item-required">
            <Input v-model="formValidate.height" size="small" style="width:100px"></Input> mm
        </Form-item>
        <Form-item label="宽度" class="ivu-form-item-required">
            <Input v-model="formValidate.width" size="small" style="width:100px"></Input> mm
        </Form-item>
        <Form-item label="长度" class="ivu-form-item-required">
            <Input v-model="formValidate.length" size="small" style="width:100px"></Input> mm
        </Form-item>
        <Form-item label="公差" class="ivu-form-item-required">
            <Row>
                <Col span="6">
                    <Form-item>
                        <Input-number :min="0" v-model="formValidate.toleranceFrom" size="small"></Input-number>
                    </Form-item>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="6">
                    <Form-item>
                        <Input-number :min="0" v-model="formValidate.toleranceTo" size="small"></Input-number>
                    </Form-item>
                </Col>
                <Col span="4" style="text-align: center">mm</Col>
            </Row>
        </Form-item>
        <Form-item label="数量" class="ivu-form-item-required">
            <Row>
                <Col span="6">
                    <Form-item>
                        <Input-number :min="0" v-model="formValidate.numbers" size="small"></Input-number>
                    </Form-item>
                </Col>
                <Col span="2" style="text-align: center">-</Col>
                <Col span="6">
                    <Form-item>
                        <Select v-model="formValidate.unit" size="small">
                            <Option v-for="item in units" :value="item">{{ item }}</Option>
                        </Select>
                    </Form-item>
                </Col>
            </Row>
        </Form-item>
        <Form-item label="交货地点" class="ivu-form-item-required">
            <Cascader :data="citys" :placeholder="isEdit? locationStr : '请选择交货地点'" v-model="formValidate.locationCityIds" size="small" style="margin-top:5px"></Cascader>
        </Form-item>
        <Form-item label="备注内容">
            <Input v-model="formValidate.message" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注内容"></Input>
        </Form-item>
        <Form-item label="报价期限" class="ivu-form-item-required">
            <Row>
                <Col span="6">
                    <Form-item>
                        <Input-number :min="0" v-model="formValidate.day" size="small"></Input-number>
                    </Form-item>
                </Col>
                <Col span="2" style="text-align: center">天</Col>
                <Col span="6">
                    <Form-item>
                       <Input-number :min="0" :max="59" v-model="formValidate.hour" size="small"></Input-number>
                    </Form-item>
                </Col>
                <Col span="2" style="text-align: center">时</Col>
                <Col span="6">
                    <Form-item>
                       <Input-number :min="0" :max="59" v-model="formValidate.minute" size="small"></Input-number>
                    </Form-item>
                </Col>
                <Col span="2" style="text-align: center">分</Col>
            </Row>
        </Form-item>
        <Form-item v-if="!isEdit">
            <Button type="primary" @click="handleSubmit('formValidate')" :loading="ajaxLoading">提交</Button>
        </Form-item>
    </Form>
</template>

<script>
    import { ironTypes, surfaces, materials, proPlaces, units, citys } from '@/utils/data'
    import { publishIron, myBuyDetail, editPublish } from '@/utils/http'
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
        computed: {
            checkForm(){
                return this.formValidate.height !='' && this.formValidate.width!='' && this.formValidate.length!='' && this.formValidate.locationCityId != undefined
            },
            isEdit(){
                return this.ironId != '' && this.ironId != undefined
            }  
        },
        data () {
            return {
                ironId:'',
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
                    height: "0",//厚度
                    width: "0",//宽度
                    length: "0",//长度
                    toleranceFrom: 0,//公差1
                    toleranceTo: 0,//公差2
                    numbers: 0,//数量
                    unit: 'kg',//单位
                    locationCityIds: [],//交货地点
                    locationCityId:'',
                    message: '',//备注
                    timeLimit: 0,//报价期限
                    day: 1,
                    hour: 0,
                    minute: 0
                },
                locationStr: ''
            }
        },
        methods: {
            // 提交表单
            handleSubmit () {
                if(!this.isEdit)
                    this.formValidate.locationCityId = this.formValidate.locationCityIds[this.formValidate.locationCityIds.length - 1];
                if(this.checkForm){
                    this.ajaxLoading = true;
                    let apiUrl = this.isEdit ? editPublish : publishIron;
                    this.$http.post(apiUrl,this.formValidate,{
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }).then(res => {
                        if(res.data.status === 0){
                            this.$Message.success('提交成功！');
                            this.$router.push('/nadmin/account/buyer/bProduct')
                        }else{
                            this.$Message.error(res.data.errorMsg);
                        }
                        this.ajaxLoading = false;
                    })
                }else{
                    this.$Message.error('请将信息填写完整！');
                } 
            },
            // 转换过期时间
            transformDeadline(){
                this.formValidate.timeLimit = (this.formValidate.day * 86400 + this.formValidate.hour * 3600 + this.formValidate.minute * 60) * 1000
            },
            // 获取求购数据
            getDetial(id){
                this.ironId = id;
                this.activeItemajaxLoad = false;
                // 拿到详情数据id
                this.$http.get(myBuyDetail,{
                    params:{
                         ironId: id
                    }
                }).then(res => {
                    let data = res.data.data.buy;
                    // 把获取到的数据填充
                    if(res.data.status === 0){
                        // 同步时间
                        let allTime = data.timeLimit/86400000; 
                        let day = parseInt(allTime);
                        let hour = parseInt(data.timeLimit%86400000/1000/3600);
                        let minute = data.timeLimit%86400000%3600000/1000/60;
                        this.formValidate.ironType = data.ironType;
                        this.formValidate.surface = data.surface;
                        this.formValidate.material = data.material;
                        this.formValidate.proPlace = data.proPlace;
                        this.formValidate.height = data.height;
                        this.formValidate.width = data.width;
                        this.formValidate.length = data.length;
                        this.formValidate.toleranceFrom = Number(data.tolerance.split("-")[0]);
                        this.formValidate.toleranceTo = Number(data.tolerance.split("-")[1]);
                        this.formValidate.numbers = data.numbers;
                        this.formValidate.unit = data.unit;
                        this.formValidate.locationCityId = data.locationCityId;
                        this.formValidate.message = data.message;
                        this.formValidate.timeLimit = data.timeLimit;
                        this.formValidate.day = day;
                        this.formValidate.hour = hour;
                        this.formValidate.minute = minute;
                        this.locationStr = data.sourceCity;
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            },
            // 执行编辑
            doEdit(){
                this.$set(this.formValidate,'ironId',this.ironId);
                this.handleSubmit();
            }
        },
        watch: {
            'formValidate.day'(){
                this.transformDeadline();
            },
            'formValidate.hour'(){
                this.transformDeadline();
            },
            'formValidate.minute'(){
                this.transformDeadline();
            }
        },
        mounted () {
            this.transformDeadline();
        }
    }
</script>
