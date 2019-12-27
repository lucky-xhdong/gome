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
            <!--退款进度 start-->
            <!--只有退货或者换转退才有退款进度 start-->
            <el-row v-if="returnExchangeDetail.returnRequestBaseInfoDto.returnType &&
              (returnExchangeDetail.returnRequestBaseInfoDto.returnType == 1 ||
              returnExchangeDetail.returnRequestBaseInfoDto.returnType == 3)">
              <el-row class="sl__refund-progress" v-if="returnExchangeDetail.queryRefundInfo">
                <el-row class="sl__refund__title">
                  <span>退款进度</span>&nbsp;
                </el-row>
                <el-row class="sl__promotions_table">
                  <table class="_table">
                    <thead>
                    <tr>
                      <th>退款单号</th>
                      <th>退款方式</th>
                      <th>支付方式</th>
                      <th>退款金额</th>
                      <th>退款状态</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>
                        {{returnExchangeDetail.queryRefundInfo.returnRequestId}}
                      </td>
                      <td>
                        {{returnExchangeDetail.queryRefundInfo.refundMethod}}
                      </td>
                      <td>
                        {{returnExchangeDetail.queryRefundInfo.paymethod}}
                      </td>
                      <td>
                        {{returnExchangeDetail.queryRefundInfo.refundAmount | formatMoney}}
                      </td>
                      <td>
                        {{returnExchangeDetail.queryRefundInfo.refundState}}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </el-row>
              </el-row>
            </el-row>
            <!--只有退货或者换转退才有退款进度 end-->
            <!--退款进度 end-->
            <!--退换货记录 start-->
            <commonServiceListRecord :returnExchangeDetail="returnExchangeDetail"></commonServiceListRecord>
            <!--退换货记录 end-->
            <!--温馨提示 start-->
            <el-row class="sl-success-tip" v-show="showProcessTip">
                <p class="txt">温馨提示：退换货申请正在服务台处理或店长审核阶段，请及时提醒服务台/店长处理，处理审核成功后才可以进行商品退货/换货。</p>
            </el-row>
            <!--温馨提示 end-->
        </el-main>
        <!--左侧退换货信息 end-->
        <!--右侧商品信息 start-->
        <commonApplyServiceAside :asideData="asideData"></commonApplyServiceAside>
        <!--右侧商品信息 end-->
    </el-container>
</template>

<style lang="scss">
    @import '@/assets/styles/order-service/variable.scss';
    @import '@/assets/styles/order-service/serviceList.scss';
    @import '@/assets/styles/order-service/common.scss';
</style>
<script>
    import API from '@/api/order-service/applyService';
    import Utils from '@/api/order-service/utils';
    import commonApplyServiceAside from '@/components/order-service/common/commonApplyServiceAside.vue'
    import commonServiceListSteps from '@/components/order-service/common/commonServiceListSteps.vue';
    import commonServiceListInfo from '@/components/order-service/common/commonServiceListInfo.vue';
    import commonServiceListRecord from '@/components/order-service/common/commonServiceListRecord.vue';
    import commonApplyServicePrice from '@/components/order-service/common/commonApplyServicePrice.vue';
    export default {
        data () {
            return {
                defaultSelected: '',
                expressCompanyList:[], //快递公司列表
                mainheader:{
                    "content":"退换货详情"// tit名字
                },
                asideheader:{
                    "content":"配送单信息"// tit名字
                },
                showProcessTip: true,
                form: {
                    expressNo: '',
                    expressCompanyName: '',
                    expressCompanyCode: ''
                },
                deductGomeBeanAmount: 0,                        //美豆还需要扣的金额
                deductCouponAmount: 0,                          //美券还需要扣的金额
                realDeductAmount: 0,                            //实扣总金额
                suggestRefundAmount: 0,                         //实退款总金额,
                configItmes: [
                    {label:"赠品名称", prop: "freeGiftName"},
                    {label:"赠品价值", prop: "freeGiftPrice"},
                    {label:"本单分摊总额", prop: "freeGiftShareAmount"}
                ],
                returnExchangeDetail: {
                    isArriveCurrentNode: '',
                    returnRequestBaseInfoDto: {},
                    returnRequestNodeInfoList: [],
                    userInfo: {},
                    addressInfo: {},
                    returnRefundAgent: {
                        returnCoupons: [],              //美券
                        returnGomeBeanAgentDto: {},     //美豆
                        shareFreeGifts: [],             //赠品分摊
                    }
                },
                loading: false,
                btnExpressDisabled: false,
                asideData: {} //右侧数据
            }
        },
        components: {
            commonApplyServiceAside,
            commonServiceListSteps,
            commonServiceListInfo,
            commonServiceListRecord,
            commonApplyServicePrice
        },
        created () {
            this.queryReturnRequestDetailInfo()
//            this.queryExpressCompanyList(); //
        },
        //vuex取值
        computed: {
            //既没有美豆，没有美券(没有促销信息)，不展示实扣总金额
            showAccount () {
                let agent = this.returnExchangeDetail.returnRefundAgent;
                if (agent && agent.returnGomeBeanAgentDto) {
                    return agent.returnGomeBeanAgentDto && agent.returnGomeBeanAgentDto != null;
                }
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
            //查询退换货详情页
            queryReturnRequestDetailInfo () {
                const params = {
                    returnRequestId: this.$route.query.returnRequestId
                };
                let _this =  this;
                this.loading = true;
                API.queryReturnRequestDetailInfo(params).then(response => {
                    if (response.success) {
                        if (response.response) {
                            _this.loading = false;
                            _this.returnExchangeDetail = response.response;
                            if (_this.returnExchangeDetail.returnRequestNodeInfoList && _this.returnExchangeDetail.returnRequestNodeInfoList.length > 0) {
                                _this.returnExchangeDetail.returnRequestNodeInfoList.forEach((item, index) => {
                                  if (item.isArriveCurrentNode == "Y") {
                                    _this.returnExchangeDetail._steps = index + 1;
                                  }
                                });
                            }
                            if (_this.returnExchangeDetail.returnRequestHistoryList && _this.returnExchangeDetail.returnRequestHistoryList.length > 2) {
                                _this.showProcessTip = false;
                            }

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
                        }else {
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
                let _this =  this;
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
            //获取下拉框选中的label和value值
            changeValue(value) {
                this.form.expressCompanyCode = value;
            },
            //提交补充物流信息
            submitReturnRequestExpressInfo () {
                let _this =  this;
                const params = {
                    returnRequestId: this.$route.query.returnRequestId,                       //退换货单号
                    expressNo: this.form.expressNo,                                                 //快递单号
                    expressCompanyCode: this.form.expressCompanyCode,                               //快递公司编码
                    expressCompanyName: this.form.expressCompanyName                                //快递公司名称
                };
                API.submitReturnRequestExpressInfo(params).then(response => {
                    if (response.success) {
                        if (response.response) {

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
            cancelSubmitReturnRequestExpressInfo (formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>
