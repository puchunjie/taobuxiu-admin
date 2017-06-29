<template>
    <Tabs>
        <Tab-pane label="申请成为商家">
            <div class="content">
                <Steps :current="current">
                    <Step title="阅读条款" icon="ios-book"></Step>
                    <Step title="填写入驻资料" icon="clipboard"></Step>
                    <Step title="平台审核" icon="clock"></Step>
                    <Step title="入驻成功" icon="ios-checkmark"></Step>
                </Steps>

                <div v-show="current === 0" class="tabs clause">
                    <h2 class="block fs-20" style="text-align:center;font-size:16px;">淘不锈商户入驻协议</h2>
                    <label class="block">第1条</label>
                    <p>
                        为享有包括采购等更多的服务和平台操作功能，用户可以申请企业账号，首先需具备注册资格，您必须确保系依照中华人民共和国法律法规设立的合法组织，具有在中华人民共和国境内取得工商经营主体资格，并按商户企业账号要求提示上传相应证件。如您没有前述主体资格，本站有权拒绝用户注册或认证，据此造成的损失由您自行承担。
                    </p>
                    <br>

                    <label class="block">第2条</label>
                    <p>
                        在您阅读并同意本协议,按照本站申请成为商家页面提示填写完整企业信息上传符合要求的资料信息并经过本站审核通过后，您即为本站企业账号 。 
                    </p>
                    <br>

                    <label class="block">第3条</label>
                    <p>
                        您在成功完成企业账号申请并审核通过后，即成为企业账号管理员并享有挂货以及售卖行为的权利，您可以通过本站平台在线交易、发布现货库存资源信息、发布求购信息、发布特价资源信息等企业会员服务。 
                    </p>
                    <br>

                    <label class="block">第4条</label>
                    <p>
                        您申请或认证企业账号时，您设置的企业信息不得侵犯或涉嫌侵犯他人合法权益。如您连续12个月未有使用手机号和密码登录本站及信息更新记录或实际使用本站服务的行为，本站保留对您中止或终止提供服务并注销账户的权利。
                    </p>
                    <br>

                    <label class="block">第5条</label>
                    <p>
                        您注册为企业账号后，如注册登记信息发生变更，您须及时、主动联系本站进行更新。因您未及时更新，造成您不能享受相关服务的、或造成账号及密码泄露及一切影响正常交易等所有责任由您自行承担。 
                    </p>
                    <br>


                    <label class="block">第6条</label>
                    <p>
                    您应对您的手机号和密码的安全，以及对通过其手机号和密码实施的行为负责。您在本站注册的手机号和密码仅限于您自己或您所授权的企业内部人员进行使用，不得给予任何第三方使用，否则由此造成的损失由您自行承担，且本站保留暂停或终止服务的权利（参见本协议3.4项条款）。
                    </p>
                    <br>

                    <label class="block">第7条</label>
                    <p>
                    除非有法律规定或司法裁定，且征得本站的同意，否则，手机号和密码不能以任何方式转让、赠与或继承。 
                    </p>
                    <br>

                    <label class="block">第8条</label>
                    <p>
                    您遗忘或丢失在本站注册的密码及无法找回时，可与本站客户服务人员取得联系，在提供相关证明资料并经本站审核确认后，可找回密码。
                    </p>
                    <br>

                    <label class="block">第9条</label>
                    <p>
                    您注册为企业账号后，在本站进行挂货销售活动期间，请按时更新您所售卖产品的最新价格，真实库存等产品信息，如因您的挂货信息不准确，恶意或虚假挂货，一经本站核实，本站保留对您中止或终止提供服务并注销账户的权利，并且一切法律后果由您自行承担。
                    </p>
                    <br>

                    <label class="block">第10条</label>
                    <p>
                    您注册为企业账号后，在本站进行发布求购的行为，需真实可靠，不得进行任何形式的恶意以及虚假发布，一经核实为违反本平台规范或法律条款的行为后，本站保留对您中止或终止提供服务并注销账户的权利，并且一切法律后果由您自行承担 。
                    </p>
                    <br>


                    <label class="block">第11条</label>
                    <p>
                    本站提供的试点地区免费上门质检服务仅在征得买卖双方均同意认可的情况下方可进行。该项服务可以提供现场视频通讯服务，并于质检现场按照买卖双方均协商同意的事项进行现场质检，本站不参与买卖双方关于是否允许质检的协商讨论。在整个质检过程中，买卖双方均表示同意完成后则质检完成，本站不对质检完成后的任何资金交易，物流运输及收货等进一步交易行为进行负责，一切法律后果由买卖双方自行承担。
                    </p>
                    <br>
                </div>

                <div class="tabs" v-show="current === 1">
                    <Form :model="formData" ref="formValidate" :rules="ruleValidate" label-position="right" :label-width="110">
                        <h2 class="group-title">商家基本信息</h2>
                        <Form-item label="公司名称" prop="companyName">
                            <Input v-model="formData.companyName"></Input>
                        </Form-item>
                        <Form-item label="注册资金" prop="regMoney">
                            <Row>
                                <Col span="21"><Input v-model="formData.regMoney"></Input></Col>
                                <Col span="1">&nbsp;</Col>
                                <Col span="2">万元</Col>
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
                        <Form-item label="办公地址" class="ivu-form-item-required">
                            <Row>
                                <Col span="8"><Cascader :data="citys" v-model="formData.souCityIds"></Cascader></Col>
                                <Col span="1">&nbsp;</Col>
                                <Col span="3">详细地址：</Col>
                                <Col span="1">&nbsp;</Col>
                                <Col span="11"><Input v-model="formData.officeAddress"></Input></Col>
                            </Row>
                        </Form-item>
                        <Form-item label="QQ">
                            <Input v-model="formData.qq"></Input>
                        </Form-item>
                         <Form-item label="店铺封面">
                            <Row>
                                <Col span="4" class="img">
                                    <img :src="headImg">
                                </Col>
                                <Col span="1">&nbsp;</Col>
                                <Col span="3" class="select">
                                    <a>上传图片</a>
                                    <input type="file" ref="cover" @change="showImg('cover')">
                                </Col>
                                <Col span="16">
                                    <b style="color:red;font-size:12px;">如未上传则使用系统默认封面图片</b>
                                </Col>
                            </Row>
                        </Form-item>
                        <Form-item label="店铺简介">
                            <Input v-model="formData.shopProfile" type="textarea" :rows="4"></Input>
                        </Form-item>
                        <h2 class="group-title">
                            上传证件&nbsp;&nbsp;<span style="color:red;font-size:12px;">(营业执照、组织机构代码证,税务登记证) 注:请上传1M以内的JPG或者PNG格式的图片)</span>
                            </h2>
                        <Form-item label="是否三证合一">
                            <Checkbox v-model="formData.isThreeInOne" @on-change="resetPic"></Checkbox>
                        </Form-item>
                        <Form-item label="营业执照" v-show="!formData.isThreeInOne" class="ivu-form-item-required">
                            <Row>
                                <Col span="10">
                                    <Input v-model="formData.businessLic"></Input>
                                </Col>
                                <Col span="1">&nbsp;</Col>
                                <Col span="3" class="select">
                                    <a>上传图片</a>
                                    <input type="file" ref="businessLic" @change="showImg('businessLic')">
                                </Col>
                            </Row>
                        </Form-item>
                        <Form-item label="组织机构代码证" v-show="!formData.isThreeInOne" class="ivu-form-item-required">
                            <Row>
                                <Col span="10">
                                    <Input v-model="formData.codeLic"></Input>
                                </Col>
                                <Col span="1">&nbsp;</Col>
                                <Col span="3" class="select">
                                    <a>上传图片</a>
                                    <input type="file" ref="codeLic" @change="showImg('codeLic')">
                                </Col>
                            </Row>
                        </Form-item>
                        <Form-item label="税务登记证" v-show="!formData.isThreeInOne" class="ivu-form-item-required">
                            <Row>
                                <Col span="10">
                                    <Input v-model="formData.financeLic"></Input>
                                </Col>
                                <Col span="1">&nbsp;</Col>
                                <Col span="3" class="select">
                                    <a>上传图片</a>
                                    <input type="file" ref="financeLic" @change="showImg('financeLic')">
                                </Col>
                            </Row>
                        </Form-item>
                        <Form-item label="三证合一" v-show="formData.isThreeInOne" class="ivu-form-item-required">
                            <Row>
                                <Col span="10">
                                    <Input v-model="formData.allCer"></Input>
                                </Col>
                                <Col span="1">&nbsp;</Col>
                                <Col span="3" class="select">
                                    <a>上传图片</a>
                                    <input type="file" ref="allCer" @change="showImg('allCer')">
                                </Col>
                            </Row>
                        </Form-item>
                    </Form>
                </div>

                <div class="footer">
                    <Checkbox v-model="isRead" v-show="current === 0">已阅读并同意《淘不锈商户入驻协议》</Checkbox>
                    <Button type="primary" @click="before" v-show="current > 0">上一步</Button>
                    <Button type="primary" @click="next" v-show="isRead && current < 1">下一步</Button>
                    <Button type="primary" @click="publish" v-show="current === 1">提交</Button>
                </div>
            </div>
        </Tab-pane>
    </Tabs>
</template>


<script>
    import { citys } from '@/utils/data'
    import { beSeller } from '@/utils/http'
    export default {
        data () {
            return {
                headImg:'http://www.itaobuxiu.com/resource/image/manage/seller/become/default.png',
                citys: [],
                current: 0,
                isRead: true,
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
                    isThreeInOne:false,//是否三证合一
                    businessLic:'',//营业执照
                    codeLic:'',//组织机构代码
                    financeLic: '',//税务登记
                    allCer:'',// 合一证
                    souCityIds:[]
                },
                ruleValidate:{
                    companyName: [
                        { required: true, message: '公司名称不能为空', trigger: 'blur' }
                    ],
                    regMoney: [
                        { required: true, message: '注册资金不能为空', trigger: 'blur' }
                    ],
                    contact: [
                        { required: true, message: '联系人不能为空', trigger: 'blur' }
                    ],
                    cantactTel: [
                        { required: true, message: '联系人电话不能为空', trigger: 'blur' }
                    ],
                    fax: [
                        { required: true, message: '传真不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            next () {
                this.current += 1;
            },
            before(){
                this.current -= 1;
            },
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
            resetPic(){
                this.formData.allCer = '';
                this.$refs.allCer.value = '';
                this.formData.businessLic = '';
                this.$refs.businessLic.value = '';
                this.formData.codeLic = '';
                this.$refs.codeLic.value = '';
                this.formData.financeLic = '';
                this.$refs.financeLic.value = '';
            },
            publish(){
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.formData.cityId = this.formData.souCityIds[this.formData.souCityIds.length - 1];
                        let formData = this.createFormData();
                        if(this.$refs.cover.files[0]){
                            formData.append('cover',this.$refs.cover.files[0]);
                        }
                         // 检查信息是否完整
                        if(this.checkForm()){
                            if(this.formData.isThreeInOne){
                                formData.append('allCer',this.$refs.allCer.files[0]);
                            }else{
                                formData.append('businessLic',this.$refs.businessLic.files[0]);
                                formData.append('codeLic',this.$refs.codeLic.files[0]);
                                formData.append('financeLic',this.$refs.financeLic.files[0]);
                            }
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
                let allCer = this.formData.allCer != '' && this.formData.isThreeInOne === true;
                let three = this.formData.businessLic != '' && this.formData.codeLic != '' && this.formData.financeLic != ''&& this.formData.isThreeInOne === false;
                let picOk = allCer || three;
                return isOk && picOk
            },
            createFormData(){
                let data = new FormData();
                for (var key in this.formData) {
                    data.append(key, this.formData[key])
                }
                return data
            },
            postData(data){
                this.$http.post(beSeller,data,{
                    headers: { 'Content-Type': 'multipart/form-data' },
                    pic: true
                }).then(res => {
                    if(res.data.status === 0){
                        this.$Message.success('提交成功');
                        this.$router.push('/nadmin/account/buyer/main')
                    }else{
                        this.$Message.error(res.data.errorMsg);
                    }
                })
            }
        },
        created () {
            this.citys = citys;
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
        margin: 50px 0 0 50px;
    }
    .clause{
        height: 600px;
        overflow-x: hidden;
        border: 1px solid #39f;
        padding: 10px;
        border-radius: 10px;
    }
    .footer{
        width: 400px;
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

