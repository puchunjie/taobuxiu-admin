<template>
    <Form ref="formValidate" :model="formValidate" :label-width="100">
        <Form-item label="加工种类" class="ivu-form-item-required">
            <Select v-model="formValidate.handingType" placeholder="请选择不锈钢品类" size="small">
                <Option v-for="item in machiningTypes" :value="item">{{ item }}</Option>
            </Select>
        </Form-item>
        <Form-item label="加工地点" class="ivu-form-item-required">
            <Cascader :data="citys" v-model="formValidate.souCityIds" size="small"
            :placeholder="isEdit? locationStr : '请选择'" style="margin-top:5px"></Cascader>
        </Form-item>
        <Form-item label="发布标题">
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
    import { machiningTypes, citys } from '@/utils/data'
    import { publishHanding, bmyHandingBuyDetail, editMaching } from '@/utils/http'
    export default {
        data () {
            return {
                handingId: '',
                ajaxLoading:false,
                machiningTypes: machiningTypes,
                citys:citys,
                formValidate: {
                    handingType:'整卷油磨',
                    souCityIds: [],
                    souCityId: '',
                    message:'',
                    timeLimit: 0,//报价期限
                    day: 1,
                    hour: 0,
                    minute: 0
                },
                locationStr: ''
            }
        },
        computed: {
            checkForm(){
                return this.formValidate.souCityId != undefined
            },
            isEdit(){
                return this.handingId != '' && this.handingId != undefined
            }  
        },
        methods: {
            // 提交表单
            handleSubmit () {
                if(!this.isEdit)
                    this.formValidate.souCityId = this.formValidate.souCityIds[this.formValidate.souCityIds.length - 1];
                if(this.checkForm){
                    this.ajaxLoading = true;
                    let apiUrl = this.isEdit ? editMaching : publishHanding;
                    this.$http.post(apiUrl,this.formValidate,{
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }).then(res => {
                        if(res.data.status === 0){
                            this.$Message.success('提交成功！');
                            this.$router.push('/nadmin/account/buyer/bMachining')
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
            //获取资源详情
            getDetial(id){
                this.handingId = id;
                this.activeItemajaxLoad = false;
                // 拿到详情数据id
                this.$http.get(bmyHandingBuyDetail,{
                    params:{
                         handingId: id
                    }
                }).then(res => {
                    let data = res.data.data.buy;
                    if(res.data.status === 0){
                        // 同步时间
                        let allTime = data.timeLimit/86400000; 
                        let day = parseInt(allTime);
                        let hour = parseInt(data.timeLimit%86400000/1000/3600);
                        let minute = data.timeLimit%86400000%3600000/1000/60;
                        this.formValidate.day = day;
                        this.formValidate.hour = hour;
                        this.formValidate.minute = minute;
                        this.formValidate.handingType = data.handingType;
                        this.formValidate.message = data.message;
                        this.formValidate.souCityId = data.souCityId;
                        this.locationStr = data.sourceCity;
                        
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            },
            // 执行编辑
            doEdit(){
                this.$set(this.formValidate,'handingId',this.handingId);
                this.handleSubmit();
            },
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
