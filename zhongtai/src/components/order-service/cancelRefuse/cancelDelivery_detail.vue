<template>
    <el-container class="cancelRefuse_detail" v-loading.fullscreen.lock="loading">
        <el-main class="cr-detail__main">
            <g-header v-model="mainheader"></g-header>
            <commonCancelRefuseTable :orderDetail="orderDetail"></commonCancelRefuseTable>
            <el-form class="cr-detail__form" :model="form" size="mini" data-before="取消订单信息">
                <el-row class="input-group">
                    <!--基本信息 start-->
                    <el-row class="cr-detail__info cr-detail__caption" data-before="基本信息">
                        <el-form-item label="取消原因：">
                            <el-select class="form__input-mini"
                                       v-model="form.reasonCode"
                                       placeholder="请选择">
                                <el-option v-for="(item, index) in orderDetail.reasonList"
                                           :label="item.name"
                                           :value="item.code"
                                           :key=index>{{item.name}}
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="已开凭证：">
                            <el-checkbox-group v-model="form.invoiced">
                                <el-checkbox name="invoice">发票</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-row>
                    <!--基本信息 end-->
                    <!--促销信息(包含赠豆，赠卷，退/扣款金额信息) start-->
                    <commonCancelRefusePrice :orderDetail="orderDetail"
                                             :deductGomeBeanAmount="deductGomeBeanAmount"
                                             :realDeductAmount="realDeductAmount"
                                             :suggestRefundAmount="suggestRefundAmount">
                    </commonCancelRefusePrice>
                    <!--促销信息(包含赠豆，赠卷，退/扣款金额信息) end-->
                </el-row>
                <el-row class="btn-group" v-show="isBtnDisabled">
                    <el-form-item>
                        <el-button
                                v-if="LOGINDATA.orderplatform_refuseDelivery_cancel"
                                @click="handleShowDialog(0)" >不同意取消</el-button>
                        <el-button type="primary"
                                   v-if="LOGINDATA.orderplatform_refuseDelivery_submit"
                                   @click="handleShowDialog(1)">同意取消
                        </el-button>
                    </el-form-item>
                </el-row>
            </el-form>
            <!--温馨提示 start-->
            <el-row class="cr-success-tip">
                <p class="txt">温馨提示：请尽快处理，同意取消成功后，订单将开始进行退款；不同意取消或者同意取消失败时，订单将继续正常流转。取消成功后用户可在国美APP、国美网站端“我的--退换货--退款记录”里查看退款进度。</p>
            </el-row>
            <!--温馨提示 end-->
        </el-main>
        <commonCancelRefuseAside :cancelRefuseAsideData="cancelRefuseAsideData"
                                 v-if="cancelRefuseAsideData">
        </commonCancelRefuseAside>
        <!--是否确认撤消取消申请 start-->
        <el-dialog
                title="提示"
                :visible.sync="dialogNotAgreeVisible"
                width="30%"
                :before-close="handleNotAgreeClose">
            <span>确认不同意取消订单,订单将继续配送？</span>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="dialogNotAgreeVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="commitCancelDeliveryOrder(0)">确 定</el-button>
        </span>
        </el-dialog>
        <!--是否确认撤消取消申请 end-->
        <!--是否确认提交取消申请 start-->
        <el-dialog
                title="提示"
                :visible.sync="dialogAgreeVisible"
                width="30%"
                :before-close="handleAgreeClose">
            <span>确认同意取消订单？</span>
            <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="dialogAgreeVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="commitCancelDeliveryOrder(1)">确 定</el-button>
        </span>
        </el-dialog>
        <!--是否确认提交取消申请 end-->
      <!--需补购美豆 start-->
      <el-dialog
        title="美豆不足"
        width="30%"
        :visible.sync="dialogBeanNumberVisible"
        :before-close="handleBeanNumberClose">
        <el-row class="el-dialog__body_bean">
          <el-row><p class="dialog_p">目前账户美豆余额不足，需补够<b class="dialog_em">{{supplyGomeBeanNum}}</b>美豆后，才可进行取消操作</p></el-row>
        </el-row>
        <span slot="footer" class="dialog-footer">
              <el-button size="mini" @click="handleBeanNumberClose">知道了</el-button>
          </span>
      </el-dialog>
      <!--需补购美豆 end-->
    </el-container>
</template>
<style lang="scss">
    @import '@/assets/styles/order-service/variable.scss';
    @import '@/assets/styles/order-service/cancelRefuse_detail.scss';
    @import '@/assets/styles/order-service/common.scss';
</style>
<script>
    import {mapState} from "vuex";
    import API from '@/api/order-service/cancelRefuse';
    import commonCancelRefuseTable from '@/components/order-service/common/commonCancelRefuseTable.vue'
    import commonCancelRefuseAside from '@/components/order-service/common/commonCancelRefuseAside.vue'
    import commonCancelRefusePrice from '@/components/order-service/common/commonCancelRefusePrice.vue'
    import Utils from "@/api/order-service/utils";
    export default {
        data() {
            return {
                mainheader: {
                    "content": "取消配送单审核"// tit名字
                },
                dialogNotAgreeVisible: false,
                dialogAgreeVisible: false,
                dialogBeanNumberVisible: false,
                form: {
                    reasonCode: '',
                    isDeductGomeBeanPrice: false,
                    isDeductCouponPrice: []
                },
                supplyGomeBeanNum: 0,
                isBtnDisabled: true,
                loading: false,
                deductGomeBeanAmount: 0,                        //美豆还需要扣的金额
                deductCouponAmount: 0,                          //美券还需要扣的金额
                realDeductAmount: 0,                            //实扣总金额
                suggestRefundAmount: 0,                         //实退款总金额
                orderDetail: {
                    shippingGroup: {},
                    giftCouponList: [],
                    giftGomeBean: {},
                    returnRefundSummary: {}
                },
                cancelRefuseAsideData: {}
            }
        },
        mounted () {
            this.queryCancelDeliveryOrderDetail();
        },
        //局部过滤器，格式化金额
        filters: {
            formatMoney (value) {
                "use strict";
                return '￥' + value.toFixed(2);
            }
        },
        //vuex取值
        computed: {
            ...mapState(['LOGINDATA']),
            //没有美豆，没有美券(没有促销信息)，不展示实扣总金额
            showAccount () {
                let agent = this.orderDetail;
                return agent.giftGomeBean && agent.giftGomeBean != null;
            }
        },
        components: {
          commonCancelRefuseTable,
          commonCancelRefuseAside,
          commonCancelRefusePrice
        },
        methods: {
            commonSubmit (response, dialog) {
                let _this = this, timer = null;
                let url = window.location.href.split('?')[1];
                let storeCode = this.orderDetail.storeCode;
                if (response.success) {
                    //从正向订单进来，返回订单页
                    //从取消配送单列表进来，返回取消配送单列表
                    if (url && url.indexOf('cancel') != -1) {
                        this.$router.push('/order/cancelRefuse_list/cancel');
                    } else {
                        this.$router.push('/order/orderdetails?orderId=' + this.$route.query.orderId + '&storeCode=' + storeCode);
                    }
                } else {
                    this.loading = false;
                    dialog = false;
                    if (response.respCode && response.respCode == 'accountAvailableGomeBeanChange') {
                        this.$message.error("由于顾客账户内余额发生变化，页面将进行刷新操作！");
                        clearTimeout(timer);
                        timer = setTimeout(function() {
                            _this.$router.go(0);
                        }, 2000)
                    } else {
                        if (response.respMsg) {
                            this.$message.error(response.respMsg);
                            clearTimeout(timer);
                            timer = setTimeout(function() {
                                if (url && url.indexOf('cancel') != -1) {
                                    _this.$router.push('/order/cancelRefuse_list/cancel');
                                } else {
                                    _this.$router.push('/order/orderdetails?orderId=' + this.$route.query.orderId + '&storeCode=' + storeCode);
                                }
                            }, 2000)
                        }
                    }
                }
            },
            //查询取消审核详情
            queryCancelDeliveryOrderDetail () {
                this.loading = true;
                let _this = this;
                let params = {
                    "orderId": this.$route.query.orderId,
                    "shippingGroupId": this.$route.query.shippingGroupId,
                    "storeCode": this.$route.query.storeCode
                };
                API.queryCancelDeliveryOrderDetail(params).then(response => {
                    if (response.success) {
                        if (response.response) {
                            _this.loading = false;
                            _this.orderDetail = response.response;
                            //会员信息
                            const memberInfo = {
                                memberCardId: _this.orderDetail.memberCardId
                            };
                            _this.orderDetail.reasonList.forEach((item, index) => {
                              if (_this.orderDetail.reasonCode == item.code) {
                                _this.form.reasonCode = _this.orderDetail.reasonCode;
                              }
                            });
                            //格式化申请人时间
                            if (_this.orderDetail.applicantInfo && _this.orderDetail.applicantInfo.applyDate) {
                              _this.orderDetail.applicantInfo.applyDate = Utils.formatDateTime(_this.orderDetail.applicantInfo.applyDate, 'minute');
                              _this.orderDetail.submittedDate = Utils.formatDateTime(_this.orderDetail.submittedDate, 'minute');
                            }
                            if (_this.orderDetail.returnRefundSummary) {
                                _this.deductGomeBeanAmount = _this.orderDetail.returnRefundSummary.deductGomeBeanAmount;        //美豆还需要扣的金额
                                _this.deductCouponAmount = _this.orderDetail.returnRefundSummary.deductCouponAmount;            //美券还需要扣的金额
//                                _this.realDeductAmount = parseFloat(_this.deductGomeBeanAmount) + parseFloat(_this.deductCouponAmount);                 //实扣总金额 = 美豆扣款（未勾选不同意扣款）+美券扣款（未勾选不同意扣款）；(来源PRD)
//                                _this.suggestRefundAmount = parseFloat(_this.orderDetail.realPayAmount) - parseFloat(_this.realDeductAmount);           //实退款总金额 = 商品支付实付款总金额 - 实扣款总金额；(来源PRD)
                                //一期没有促销券信息，计算时去掉券的金额值
                                _this.realDeductAmount = parseFloat(_this.deductGomeBeanAmount);                                                        //实扣总金额 = 美豆扣款（未勾选不同意扣款）+美券扣款（未勾选不同意扣款）；(来源PRD)
                                _this.suggestRefundAmount = parseFloat(_this.orderDetail.realPayAmount) - parseFloat(_this.realDeductAmount);           //实退款总金额 = 商品支付实付款总金额 - 实扣款总金额；(来源PRD)
                            }
                            if (_this.orderDetail.shippingGroup && _this.orderDetail.shippingGroup.commerceItems && _this.orderDetail.shippingGroup.commerceItems.length > 0) {
                                _this.orderDetail.shippingGroup.commerceItems = _this.orderDetail.shippingGroup.commerceItems.map((item, index) => {
                                    return Object.assign({}, item, {
                                        salePrice: "￥" + item.salePrice,
                                    });
                                })
                            }
                            //美易分需求：美豆不足需补购美豆
                            if (_this.orderDetail.giftGomeBean && _this.orderDetail.giftGomeBean.supplyGomeBeanNum) {
                                _this.supplyGomeBeanNum = _this.orderDetail.giftGomeBean.supplyGomeBeanNum
                            }
                            //右侧订单金额信息
                            const orderPriceInfo = {
                                orderAmount: _this.orderDetail.orderAmount,
                                gomeCouponAmount: _this.orderDetail.gomeCouponAmount,
                                gomeBeansAmount: _this.orderDetail.gomeBeansAmount,
                                realPayAmount: _this.orderDetail.realPayAmount
                            };
                            _this.cancelRefuseAsideData = Object.assign({},
                                    memberInfo,
                                    orderPriceInfo,
                                    _this.orderDetail.shippingGroup);
                        } else {
                            _this.loading = false;
                        }
                    } else {
                        if (response.respCode && response.respCode == 1) {
                            this.isBtnDisabled = false;
                        }
                        if (response.respMsg) {
                            _this.loading = false;
                            _this.$message.error(response.respMsg);
                        }
                    }
                })
            },
            //提交取消审核
            commitCancelDeliveryOrder (handleMethod) {
                let _this = this, _giftGomeBean = {}, params = {};
                if (this.orderDetail.giftGomeBean) {
                    _giftGomeBean = {
                        totalGiftGomeBeanNum: this.orderDetail.giftGomeBean.totalGiftGomeBeanNum,
                        accountAvailableGomeBeanNum: this.orderDetail.giftGomeBean.accountAvailableGomeBeanNum,
                        needReturnGomeBeanNum: this.orderDetail.giftGomeBean.needReturnGomeBeanNum,
                        unagreeDeductFlag: this.form.isDeductGomeBeanPrice ? 1 : 0
                    }
                } else {
                  _giftGomeBean = {
                    unagreeDeductFlag: 0
                  }
                }
                //同意取消
                if (handleMethod && handleMethod == 1) {
                    params = {
                        storeCode: this.orderDetail.storeCode,                                  //销售门店代码
                        orderId: this.orderDetail.orderId,                                      //订单号
                        shippingGroupId: this.orderDetail.shippingGroup.shippingGroupId,        //配送单号
                        reasonCode: this.form.reasonCode,                                       //拒收原因代码
                        //赠美豆信息
                        giftGomeBean: _giftGomeBean,
//                    giftCouponList: this.orderDetail.giftCouponList ? this.orderDetail.giftCouponList : null,
                        returnRefundSummary: {
                            deductGomeBeanAmount: this.deductGomeBeanAmount,
                            deductCouponAmount: this.deductCouponAmount,
                            realDeductAmount: this.realDeductAmount,
                            maxRefundAmount: this.orderDetail.returnRefundSummary.realDeductAmount,
                            suggestRefundAmount: this.suggestRefundAmount < 0 ? 0 : this.suggestRefundAmount
                        },
                        handleMethod: handleMethod
                    };
                }
                //撤消取消
                else {
                    params = {
                        storeCode: this.orderDetail.storeCode,                                  //销售门店代码
                        orderId: this.orderDetail.orderId,                                      //订单号
                        shippingGroupId: this.orderDetail.shippingGroup.shippingGroupId,        //配送单号
                        handleMethod: handleMethod
                    };
                }
                API.commitCancelDeliveryOrder(params).then(response => {
                    //同意取消
                    if (handleMethod && handleMethod == 1) {
                        _this.commonSubmit(response, _this.dialogAgreeVisible);
                    }
                    //撤消取消
                    else {
                        _this.commonSubmit(response, _this.dialogNotAgreeVisible);
                    }
                })
            },
            /**
             * 展示弹窗
             * handleMethod:
             * 1同意取消
             *    如果补购美豆数大于0显示补购美豆不足弹窗
             *    否则展示同意取消弹窗
             * 0撤消取消
             */
            handleShowDialog(handleMethod) {
              if (handleMethod && handleMethod == 1) {
                if (this.supplyGomeBeanNum && this.supplyGomeBeanNum > 0) {
                  this.dialogBeanNumberVisible = true;
                } else {
                  this.dialogAgreeVisible = true;
                }
              } else {
                this.dialogNotAgreeVisible = true;
              }
            },
            //关闭撤销取消弹窗
            handleNotAgreeClose() {
                this.dialogNotAgreeVisible = false;
            },
            //关闭同意取消弹窗
            handleAgreeClose() {
                this.dialogAgreeVisible = false;
            },
            //关闭美豆不足弹窗
            handleBeanNumberClose() {
              this.dialogBeanNumberVisible = false;
              this.$router.go(0);//页面刷新
            },
        }
    }
</script>
