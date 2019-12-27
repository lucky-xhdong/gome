<template>
    <el-container class="serviceList" v-loading.fullscreen.lock="loading">
        <!--左侧退换货信息 start-->
        <el-main class="sl-main">
            <g-header v-model="mainheader"></g-header>
            <!--步骤条 start-->
            <commonServiceListSteps :returnExchangeDetail="returnExchangeDetail"></commonServiceListSteps>
            <!--步骤条 end-->
            <!--退换货信息 start-->
            <commonServiceListInfo :returnExchangeDetail="returnExchangeDetail"></commonServiceListInfo>
            <!--退换货信息 end-->
            <!--促销优惠抵扣明细 start-->
            <commonApplyServicePrice :returnExchangeDetail="returnExchangeDetail"></commonApplyServicePrice>
            <!--促销优惠抵扣明细 end-->
            <!--审核 start-->
            <el-row class="sl-main__check" data-before="审核">
                <el-form class="sl-main__form" ref="formAudit" :rules="rules" :model="form" size="mini">
                    <el-form-item label="是否同意退换货：">
                        <el-radio-group v-model="form.auditState" @change="handleFormReset('formAudit')">
                            <el-radio :label="3">同意</el-radio>
                            <el-radio :label="2">不同意</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="审核理由：" prop="auditReasonDesc">
                        <el-input type="textarea" v-model="form.auditReasonDesc"></el-input>
                    </el-form-item>
                    <el-form-item class="btn-group" size="mini">
                        <el-button size="mini" type="primary" @click="showDialog">提交审核</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <!--审核 end-->
            <!--退换货记录 start-->
            <commonServiceListRecord :returnExchangeDetail="returnExchangeDetail"></commonServiceListRecord>
            <!--退换货记录 end-->
            <!--温馨提示 start-->
            <el-row class="sl-success-tip">
                <p class="txt">温馨提示：退换货申请正在店长审核中，请店长尽快审核，店长审核后，才可以进行商品退货/换货。</p>
            </el-row>
            <!--温馨提示 end-->
        </el-main>
        <!--左侧退换货信息 end-->
        <!--右侧商品信息 start-->
        <commonApplyServiceAside :asideData="asideData"></commonApplyServiceAside>
        <!--右侧商品信息 end-->
        <!--是否确认提交审核 start-->
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <span>您确定要提交审核吗？</span>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="submitReturnRequestAuditInfo" v-if="LOGINDATA.orderplatform_serviceListCheck_submit">确 定</el-button>
        </span>
        </el-dialog>
        <!--是否确认提交审核 end-->
        <!--换货预留失败 start-->
        <el-dialog
                title="审核失败，此单将取消换货申请"
                :visible.sync="dialogFailVisible"
                width="30%"
                class="el-dialog__exchange-fail">
            <p><b>失败原因：此商品目前对应条件无可卖数，库存为0，无法进行换货，如需更换此商品，请按退货流程办理</b></p>
            <br>
            <p>换货条件：需同时满足，同型号、同库区、同供应商、同业务机型，可卖数大于1台的条件，方可支持换货处理。</p>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="handleFailClose">知道了</el-button>
        </span>
        </el-dialog>
        <!--换货预留失败 end-->
    </el-container>
</template>

<style lang="scss">
    @import '@/assets/styles/order-service/variable.scss';
    @import '@/assets/styles/order-service/serviceList.scss';
    @import '@/assets/styles/order-service/common.scss';
</style>
<script>
    import {mapState} from "vuex";
    import API from '@/api/order-service/applyService';
    import Utils from '@/api/order-service/utils';
    import commonServiceListSteps from '@/components/order-service/common/commonServiceListSteps';
    import commonServiceListInfo from '@/components/order-service/common/commonServiceListInfo';
    import commonServiceListRecord from '@/components/order-service/common/commonServiceListRecord';
    import commonApplyServiceAside from '@/components/order-service/common/commonApplyServiceAside';
    import commonApplyServicePrice from '@/components/order-service/common/commonApplyServicePrice';
    export default {
        data () {
            var checkAuditReasonDesc = (rule, value, callback) => {
                  if (this.form.auditState == 2) {
                    if (!value || value.length <= 0) {
                        callback(new Error("审核理由不能为空"));
                    }
                }
                let len = 0;
                for (var i = 0; i < value.length; i++) {
                    let a = value.charAt(i);
                    if (a.match(/[^\x00-\xff]/ig) != null) {
                        len += 2;
                    } else {
                        len += 1;
                    }
                }
                if (len > 300) {
                    callback(new Error("审核理由最多300个字符(英文,数字各占一个字符,汉字占两个字符)"));
                } else {
                    callback();
                }
            };
            return {
                mainheader: {
                    "content": "退换货审核"// tit名字
                },
                asideheader: {
                    "content": "配送单信息"// tit名字
                },
                mobilePhone: '',
                showAuditTip: false,
                dialogVisible: false,
                dialogFailVisible: false,
                form: {
                    expressNo: '',
                    expressCompaneyCode: '',
                    expressCompaneyName: '',
                    auditState: 3,          //审核结果
                    auditReasonDesc: ''     //审核理由
                },
                rules: {
                    auditReasonDesc: [
                        {validator: checkAuditReasonDesc}
                    ]
                },
                auditState: '',
                loading: false,
                returnExchangeDetail: {
                    returnRequestBaseInfoDto: {},
                    returnRequestNodeInfoList: [],
                    userInfo: {},
                    addressInfo: {},
                    returnRefundAgent: {
                        returnCoupons: [],
                        returnGomeBeanAgentDto: {}
                    }
                },
                expressCompanyList: [], //快递公司列表
                asideData: {} //右侧数据
            }
        },
        components: {
            commonApplyServiceAside,
            commonServiceListSteps,
            commonServiceListInfo,
            commonApplyServicePrice,
            commonServiceListRecord
        },
        created () {
        },
        mounted () {
            this.queryReturnRequestDetailInfo()
        },
        //vuex取值
        computed: {
            ...mapState(['LOGINDATA']),
            //没有美豆，没有美券(没有促销信息)，不展示实扣总金额
            showAccount () {
                let agent = this.returnExchangeDetail.returnRefundAgent;
                return agent.returnGomeBeanAgentDto && agent.returnGomeBeanAgentDto != null;
            }
        },
        //局部过滤器，格式化金额
        filters: {
            formatMoney (value) {
                "use strict";
                return '￥' + Number(value).toFixed(2);
            }
        },
        methods: {
            commonAudit(response) {
                if (response.success) {
                    this.$router.push('/order/serviceList_detail?returnRequestId=' + this.$route.query.returnRequestId);
                } else {
                    this.dialogVisible = false;
                    if (response.respCode && (response.respCode == '501' || response.respCode == 'logic.submitReturnAudit.fail')) {
                        this.dialogFailVisible = true;
                    } else {
                        if (response.respMsg) {
                            this.$message.error(response.respMsg);
                        }
                    }
                }
            },
            handleFormReset (formName) {
                this.$refs[formName].resetFields();
            },
            //查询退换货详情页
            queryReturnRequestDetailInfo () {
                let _this = this;
                const params = {
                    returnRequestId: Utils.getQueryString('returnRequestId')
                };
                this.loading = true;
                API.queryReturnRequestDetailInfo(params).then(response => {
                    if (response.success) {
                        if (response.response) {
                            _this.loading = false;
                            _this.returnExchangeDetail = response.response;
                            _this.mobilePhone = _this.returnExchangeDetail.userInfo.mobilePhone;
                            if (_this.returnExchangeDetail.returnRequestNodeInfoList && _this.returnExchangeDetail.returnRequestNodeInfoList.length > 0) {
                                _this.returnExchangeDetail.returnRequestNodeInfoList.forEach((item, index) => {
                                  if (item.isArriveCurrentNode == "Y") {
                                    _this.returnExchangeDetail._steps = index + 1;
                                  }
                                });
                            }

                            let baseInfo = _this.returnExchangeDetail.returnRequestBaseInfoDto;

                            //submitRoStoreDto是自己拼的对象，用来在侧边栏做判断，如果对象里的各项都没有值，展示来源的整个模块不展示
                            _this.asideData = Object.assign({},
                                    {shippingGroupId: _this.returnExchangeDetail.returnRequestBaseInfoDto.shipId},//配送单号
                                    {productDto: _this.returnExchangeDetail.productDto},//商品信息
                                    {userInfoDto: _this.returnExchangeDetail.userInfo},//顾客信息
                                    {submitRoStoreDto: {
                                        invokeFrom: _this.returnExchangeDetail.returnRequestBaseInfoDto.invokeFrom,//申请终端
                                        submitRoStoreStaffId: _this.returnExchangeDetail.submitRoStoreStaffId,//申请人编号
                                        submitRoStoreStaffName: _this.returnExchangeDetail.submitRoStoreStaffName,//申请人信息
                                        submitRoStoreStaffRole: _this.returnExchangeDetail.submitRoStoreStaffRole,//申请人角色
                                      }
                                    });
                        } else {
                            _this.loading = false;
                        }
                    } else {
                        if (response.respMsg) {
                            _this.loading = false;
                            _this.$message.error(response.respMsg);
                        }
                    }
                })
            },
            //查询快递公司列表
            queryExpressCompanyList () {
                API.queryExpressCompanyList().then(response => {
                    if (response.success) {
                        if (response.response) {
                            _this.expressCompanyList = response.response;
                            if (_this.expressCompanyList && _this.expressCompanyList.length > 0) {
                                _this.defaultSelected = _this.expressCompanyList[0].expressCompaneyName;
                            }
                        }
                    } else {
                        if (response.respMsg) {
                            _this.loading = false;
                            _this.$message.error(response.respMsg);
                        }
                    }
                })
            },
            //取消输入物流信息
            cancelSubmitReturnRequestExpressInfo () {
                this.form.expressNo = '';
            },
            //提交退换货审核
            submitReturnRequestAuditInfo () {
                let _this = this;
                const params = {
                    returnRequestId: Utils.getQueryString('returnRequestId'),   //退换货单号
                    auditState: this.form.auditState,                //审核结果
                    auditReasonDesc: this.form.auditReasonDesc                  //审核理由
                };
                API.submitReturnRequestAuditInfo(params).then(response => {
                    _this.commonAudit(response);
                })
            },
            //查看完整手机号
            queryRefundFullPhoneNo () {
                let _this = this, queryType = '';
                let _addressInfo = this.returnExchangeDetail.addressInfo;
//                let _baseInfo = this.returnExchangeDetail.returnRequestBaseInfoDto;
//                if (_baseInfo.returnType == 1) {
//                    queryType = 1;
//                }else {
//                    queryType = 2;
//                }
                //queryType原本是按取货人和换货人的电话号来区分，取货人传1，换货人传2
                //但是因为现在展示的都是取货人的信息，所以不管是退换还是换货，不管是取货人还是换货人都传1
                let params = {
                    returnRequestId: this.$route.query.returnRequestId,
                    queryType: 1
                };
                API.queryRefundFullPhoneNo(params).then(response => {
                    if (response.success) {
                        if (response.response) {
                            _addressInfo.customerPhone = response.response;
                            _this.showButton = false;
                        }
                    } else {
                        if (response.respMsg) {
                            _this.$message.error(response.respMsg);
                        }
                    }
                })
            },
            showDialog() {
                this.$refs['formAudit'].validate((valid) => {
                    if (valid) {
                        this.dialogVisible = true;
                    }
                })
            },
            handleClose() {
                this.dialogVisible = false;
            },
            handleFailClose() {
                this.dialogFailVisible = false;
                this.$router.push('/order/serviceList_detail?returnRequestId=' + this.$route.query.returnRequestId);
            },
        }
    }
</script>
