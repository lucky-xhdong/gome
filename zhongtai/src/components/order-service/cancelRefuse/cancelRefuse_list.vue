<template>
    <el-container class="cancelDelivery_list">
        <el-form class="cd-list__form" ref="cd-list__form" :rules="rules" :inline="true" :model="form" size="mini">
            <el-row class="input-group">
                <el-form-item label="配送单号：" prop="shippingGroupId">
                    <el-input v-model="form.shippingGroupId" placeholder="请输入配送单号"></el-input>
                </el-form-item>
                <el-form-item label="订单编号：" prop="orderId">
                    <el-input v-model="form.orderId" placeholder="请输入订单编号"></el-input>
                </el-form-item>
                <!--<el-form-item label="商品编码：" prop="skuNo">-->
                <!--<el-input v-model="form.skuNo" placeholder="请输入商品编码"></el-input>-->
                <!--</el-form-item>-->
                <el-form-item label="会员卡号：" prop="memberCardId">
                    <el-input v-model="form.memberCardId" placeholder="请输入会员卡号"></el-input>
                </el-form-item>
                <el-form-item label="下单时间：">
                    <el-form-item prop="startSubmittedDate">
                        <el-date-picker
                                class="input-mini"
                                v-model="form.startSubmittedDate"
                                type="date"
                                placeholder="请输入开始日期"
                                @blur="pickerTime"
                                :picker-options="pickerStart">
                        </el-date-picker>
                    </el-form-item>
                    -
                    <el-form-item prop="endSubmittedDate">
                        <el-date-picker
                                class="input-mini"
                                v-model="form.endSubmittedDate"
                                type="date"
                                placeholder="请输入结束日期"
                                @blur="pickerTime"
                                :picker-options="pickerEnd">
                        </el-date-picker>
                    </el-form-item>
                    <div class="el-form__time_error" v-show="showTimeError">请选择30天内的时间范围！</div>
                </el-form-item>
            </el-row>
            <el-row class="btn-group">
                <el-form-item>
                    <el-button @click="resetForm('cd-list__form')">重置</el-button>
                    <el-button type="primary" @click="queryDeliveryOrderList(form, currentPage)">查询</el-button>
                </el-form-item>
            </el-row>
        </el-form>
        <el-row class="cd-list__table" v-loading="loading">
            <el-table
                    :data="deliveryOrderInfo.list">
                <el-table-column
                        v-for="(item, index) in configItmes"
                        :type="item.type"
                        :key="item.id"
                        :prop=item.prop
                        :label=item.label>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template slot-scope="scope">
                        <span v-if="LOGINDATA.orderplatform_cancelRefuseList_cancel">
                            <router-link v-if="pageStatus == 'cancel'"
                                         tag="a"
                                         target="_blank"
                                         :to="{path: '/order/cancelDelivery_detail',
                                             query: {
                                             cancel: 1,
                                             orderId: scope.row.orderId,
                                             shippingGroupId: scope.row.shippingGroupId,
                                             storeCode: scope.row.storeCode}
                                         }"
                                         class="btn-normal">去审核
                            </router-link>
                            <router-link v-else tag="a" target="_blank"
                                         :to="{path: '/order/refuseDelivery_detail',
                                             query: {
                                             orderId: scope.row.orderId,
                                             shippingGroupId: scope.row.shippingGroupId,
                                             storeCode: scope.row.storeCode}
                                         }"
                                         class="btn-normal">去审核
                            </router-link>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    v-if="deliveryOrderInfo.list && deliveryOrderInfo.list.legnth > 0 && deliveryOrderInfo.pager"
                    @current-change="handleCurrentChange"
                    :current-page="deliveryOrderInfo.pager.currentPage"
                    :page-size="deliveryOrderInfo.pager.pageSize"
                    layout="total, prev, pager, next"
                    :total="deliveryOrderInfo.pager.totalSize">
            </el-pagination>
        </el-row>
    </el-container>
</template>
<style lang="scss">
    @import "@/assets/styles/order-service/variable.scss";
    @import "@/assets/styles/order-service/cancelRefuse_list.scss";
</style>
<script>
    import {mapState} from "vuex";
    import API from "@/api/order-service/cancelRefuse";
    import Utils from "@/api/order-service/utils";

    export default {
        data() {
            var shippingGroupId = (rule, value, callback) => {
                if (value) {
                    let reg = /^[\d]+$/g;
                    setTimeout(() => {
                        if (value != "" && !reg.test(value)) {
                            callback(new Error("配送单号只能是数字！"));
                            return;
                        } else {
                            callback();
                        }
                    }, 200);
                }
            };
            var orderId = (rule, value, callback) => {
                if (value) {
                    let reg = /^[\d]+$/g;
                    setTimeout(() => {
                        if (value != "" && !reg.test(value)) {
                            callback(new Error("订单号只能是数字！"));
                            return;
                        } else {
                            callback();
                        }
                    }, 200);
                }
            };
//    var skuNo = (rule, value, callback) => {
//      if (value) {
//          let reg = /^[\d]+$/g;
//        setTimeout(() => {
//            if(value != "" && !reg.test(value)){
//            callback(new Error("商品编码只能是数字！"));
//          } else {
//            callback();
//          }
//        }, 200);
//      }
//    };
            var memberCardId = (rule, value, callback) => {
                if (value) {
                    let reg = /^[\d]+$/g;
                    setTimeout(() => {
                        if (value != "" && !reg.test(value)) {
                            callback(new Error("会员卡号只能是数字！"));
                            return;
                        } else {
                            callback();
                        }
                    }, 200);
                }
            };
            return {
                header: {
                    content: "查询条件" // tit名字
                },
                showTimeError: false,
                historyFlag: false,
                isEmpty: true, //是否为空
                pageStatus: "", //保存当前页面路由是取消待审核列表还是拒收待审核列表
                currentPage: 1, //当前页
                pageSize: 10, //每页显示条数
                totalSize: 0, //总条目数
                totalPage: 0, //总页数
                deliveryOrderInfo: {}, //查询待审核订单列表
                loading: false,
                configItmes: [],
                form: {
                    shippingGroupId: "", //配送单号
                    orderId: "", //订单号
          //        skuNo: "", //商品编码
                    memberCardId: "", //会员卡号
                    startSubmittedDate: "", //开始时间
                    endSubmittedDate: "" //结束时间
                },
                formParams: {},
                //判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择
                pickerStart: {
                    disabledDate: time => {
                        if (
                                this.form.endSubmittedDate !== "" &&
                                this.form.endSubmittedDate !== null
                        ) {
                            let date = new Date(this.form.endSubmittedDate).getTime();
                            return time.getTime() > Date.now() || time.getTime() > date;
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
                //今日以前日期，后面日期不可选择
                pickerEnd: {
                    disabledDate: time => {
                        if (this.form.startSubmittedDate !== "") {
                            let date = new Date(this.form.startSubmittedDate).getTime();
                            return time.getTime() < date || time.getTime() > Date.now();
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
                rules: {
                    shippingGroupId: [{validator: shippingGroupId, trigger: "blur"}],
                    orderId: [{validator: orderId, trigger: "blur"}],
//        skuNo: [{ validator: skuNo, trigger: "blur" }],
                    memberCardId: [{validator: memberCardId, trigger: "blur"}]
                }
            };
        },
        /*
         * 记住用户输入的查询数据，从下一个页面退回来保留这些数据
         * */
        beforeRouteEnter(to, from, next) {
            next(vm => {
                let fromPath = from.path.split("/");
                vm.beforeRoute = fromPath[fromPath.length - 1];
                if (Utils.isStorage(vm.getPageStatus(vm.$route.path), vm.beforeRoute)) {
                    vm.form = JSON.parse(window.sessionStorage.getItem("serviceData"));
                    vm.queryDeliveryOrderList(vm.form, vm.currentPage,1);
                    vm.form.historyFlag = true;
                }
            });
        },

        created() {
            this.getPageStatus(this.$route.path);
          this.__setConfigItems();
        },
        //vuex取值
        computed: mapState({
            LOGINDATA: "LOGINDATA"
        }),
        watch: {
            $route(to, from) {
                this.getPageStatus(this.$route.path);
            }
        },
        methods: {
            pickerTime() {
                if (
                        this.form.endSubmittedDate !== "" &&
                        this.form.endSubmittedDate !== null
                ) {
                    this.form.historyFlag = false;
                    if (this.form.startSubmittedDate !== "") {
                        let endTime = new Date(this.form.endSubmittedDate).getTime();
                        let startTime = new Date(this.form.startSubmittedDate).getTime();
                        let time = (endTime - startTime) / 86400000;
                        if (time > 30) {
                            this.showTimeError = true;
                        } else {
                            this.showTimeError = false;
                        }
                    }
                }
            },
            __setConfigItems () {
              if (this.pageStatus == 'cancel') {
                this.configItmes = [
                  {label: "序号", type: "index"},
                  {label: "订单号", prop: "orderId"},
                  {label: "配送单号", prop: "shippingGroupId"},
                  {label: "会员卡号", prop: "memberCardId"},
                  {label: "配送单金额", prop: "realPayAmount"},
                  {label: "商品配送方式", prop: "shippingMethodDesc"},
                  {label: "申请人编号", prop: "applicantId"},
                  {label: "申请人姓名", prop: "applicantName"},
                  {label: "申请人岗位", prop: "applicantPosition"},
                  {label: "申请终端", prop: "invokeFrom"},
                  {label: "申请时间", prop: "applyDate"},
                  {label: "下单时间", prop: "submittedDate"}
                ]
              } else {
                this.configItmes = [
                  {label: "序号", type: "index"},
                  {label: "订单号", prop: "orderId"},
                  {label: "配送单号", prop: "shippingGroupId"},
                  {label: "会员卡号", prop: "memberCardId"},
                  {label: "配送单金额", prop: "realPayAmount"},
                  {label: "商品配送方式", prop: "shippingMethodDesc"},
                  {label: "下单时间", prop: "submittedDate"}
                ]
              }
            },
            commonInit(response, params) {
                this.deliveryOrderInfo.list = [];
                delete this.deliveryOrderInfo.pager;
                if (response.success) {
                    if (response.response) {
                        this.isEmpty = true;
                        this.loading = false;
                        this.deliveryOrderInfo = response.response;
                        if (this.deliveryOrderInfo && this.deliveryOrderInfo.list && this.deliveryOrderInfo.list.length > 0) {
                            this.deliveryOrderInfo.list = this.deliveryOrderInfo.list.map((item, index) => {
                                return Object.assign({}, item, {
                                    realPayAmount: "￥" + item.realPayAmount,
                                    applicantId: item.applicantId ? item.applicantId : '--',
                                    submittedDate: Utils.formatDateTime(item.submittedDate),
                                    applyDate: Utils.formatDateTime(item.applyDate),
                                });
                            })
                        } else {
                            this.deliveryOrderInfo.list = [];
                            this.deliveryOrderInfo.pager = {};
                        }
                        window.sessionStorage.setItem("serviceData", JSON.stringify(params));
                    } else {
                        this.loading = false;
                        this.deliveryOrderInfo.list = [];
                        this.deliveryOrderInfo.pager = {};
                    }
                } else {
                    this.loading = false;
                    this.$message.error(response.respMsg || '服务异常：' + response);
                }
            },
            //获取路由状态
            getPageStatus(url) {
                const urlArr = url.split("/");
                this.pageStatus = urlArr[urlArr.length - 1];
                return this.pageStatus;
            },
            //查询取消待审核列表
            queryDeliveryOrderList(form, currentPage,timeLimit) {
                let _startSubmittedDate = this.form.startSubmittedDate ? this.form.startSubmittedDate * 1 : null;
                let _endTimeLimit = '';
                if (this.form.endSubmittedDate && this.form.endSubmittedDate != '') {
                    if(timeLimit) {
                        _endTimeLimit = this.form.endSubmittedDate * 1;
                    }else {
                        if (this.form.historyFlag == true) {
                            _endTimeLimit = this.form.endSubmittedDate * 1;
                        } else {
                            _endTimeLimit = this.form.endSubmittedDate * 1 + 24 * 60 * 60 * 1000 - 1;
                        }
                    }
                }
                let _endSubmittedDate = _endTimeLimit ? _endTimeLimit : null;
                form = {
                    shippingGroupId: this.form.shippingGroupId
                            ? this.form.shippingGroupId
                            : null, //配送单号
                    orderId: this.form.orderId ? this.form.orderId : null, //订单号
//        skuNo: this.form.skuNo ? this.form.skuNo : null, //商品编码
                    memberCardId: this.form.memberCardId ? this.form.memberCardId : null, //会员卡号
                    startSubmittedDate: _startSubmittedDate, //开始时间
                    endSubmittedDate: _endSubmittedDate //结束时间
                };

                this.formParams = JSON.parse(JSON.stringify(form));
                this.queryOrderListByForm(form, currentPage);
            },
            queryOrderListByForm(form, currentPage){
                const params = Object.assign({}, form, {
                    currentPage: currentPage || this.currentPage,
                    pageSize: this.pageSize
                });
                let _this = this;
                //如果输入框为空，展示提示信息
                for (let value of Object.values(form)) {
                    if (value) {
                        this.isEmpty = false;
                        break;
                    }
                }
                function _isNotDateGroups (start, end) {
                    if ((start && !end) || (!start && end)) {
                        return true;
                    }
                    return false;
                }

                if (this.isEmpty) {
                    this.$message.warning("请至少输入一个查询条件!");
                    return false;
                } else if (_isNotDateGroups(form.startSubmittedDate, form.endSubmittedDate)) {
                    this.$message.warning("下单时间开始与结束时间必须都选");
                    return false;
                } else {
                    this.isEmpty = true;
                    this.loading = true;
                    if (this.$route.params.id == "cancel") {
                        API.queryCancelDeliveryOrderList(params).then(response => {
                            _this.commonInit(response, params);
                        });
                    } else if (this.$route.params.id == "refuse") {
                        API.queryRefusedDeliveryOrderList(params).then(response => {
                            _this.commonInit(response, params);
                        });
                    }
                }
            },
            //重置输入框
            resetForm(formName) {
                this.isEmpty = true;
                this.showTimeError = false;
                this.$refs[formName].resetFields();
            },
            //当前页点击操作
            handleCurrentChange(val) {
                this.isEmpty = false;
                let form = this.formParams;
                this.queryOrderListByForm(form, val);
            }
        }
    };
</script>
