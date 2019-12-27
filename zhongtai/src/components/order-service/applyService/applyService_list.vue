<template>
    <el-container class="applyService_list">
        <el-form class="as-list__form"
                 ref="as-list__form"
                 :rules="rules"
                 :inline="true"
                 :model="form"
                 size="mini"
                 data-before="查询条件">
            <el-row class="input-group">
                <el-form-item label="退换货单号：" prop="returnRequestId">
                    <el-input v-model="form.returnRequestId" placeholder="请输入退换货单号"></el-input>
                </el-form-item>
                <el-form-item label="订单编号：" prop="orderId">
                    <el-input v-model="form.orderId" placeholder="请输入订单编号"></el-input>
                </el-form-item>
                <el-form-item label="配送单号：" prop="shipId">
                    <el-input v-model="form.shipId" placeholder="请输入配送单号"></el-input>
                </el-form-item>
                <el-form-item label="商品编码：" prop="skuNo">
                    <el-input v-model="form.skuNo" placeholder="请输入商品编码"></el-input>
                </el-form-item>
                <el-form-item label="商品退回方式：" prop="returnShipMethod">
                    <el-select v-model="form.returnShipMethod" placeholder="请选择">
                        <el-option v-for="(item, index) in returnMethodSelectDataList"
                                   :label=item.returnRequestMethodDesc :value=item.returnRequestMethod
                                   :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="退换货状态：" prop="returnRequestState">
                    <el-select v-model="form.returnRequestState" placeholder="请选择">
                        <el-option v-for="(item, index) in returnRequestStateSelectDataList"
                                   :label=item.returnRequestStateDesc :value=item.returnRequestState
                                   :key="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请退换货时间：">
                    <el-form-item class="el-form-item__item" prop="startDateTime">
                        <el-date-picker
                                class="input-mini"
                                v-model="form.startDateTime"
                                type="date"
                                placeholder="请输入开始日期"
                                @blur="pickerTime"
                                :picker-options="pickerStart">
                        </el-date-picker>
                    </el-form-item>
                    -
                    <el-form-item class="el-form-item__item" prop="endDateTime">
                        <el-date-picker
                                class="input-mini"
                                v-model="form.endDateTime"
                                type="date"
                                placeholder="请输入结束日期"
                                @blur="pickerTime"
                                :picker-options="pickerEnd">
                        </el-date-picker>
                    </el-form-item>
                    <div class="el-form__time_error" v-show="showTimeError">请选择30天内的时间范围！</div>
                </el-form-item>
                <el-form-item label="会员卡号：" prop="memberCardNo">
                    <el-input v-model="form.memberCardNo" placeholder="请输入会员卡号"></el-input>
                </el-form-item>
                <el-form-item label="导购员编号：" prop="employeeId" v-show="showEmployeeInfo">
                    <el-row class="input-mini">
                        <el-input v-model.trim="form.employeeId" :class="{error:showEmployeeNameError}"
                                  :disabled="disabledEmployeeId" placeholder=" 请输入导购员编号"
                                  @keyup.enter.native="queryEmployeeInfoByAccount">
                            <i slot="suffix" class="el-input__icon icon iconfont" @click="queryEmployeeInfoByAccount">&#xe61c;</i>
                        </el-input>
                        <el-input v-model="form.employeeName" disabled></el-input>
                    </el-row>
                    <p v-if="showEmployeeNameError" class="employeeNameError">未查询到导购员信息</p>
                </el-form-item>
            </el-row>
            <el-row class="btn-group">
                <el-form-item>
                    <el-button @click="resetForm('as-list__form')">重置</el-button>
                    <el-button type="primary" @click="queryReturnRequestList(currentPage)">查询</el-button>
                </el-form-item>
            </el-row>
        </el-form>
        <commonApplyServiceTable
                :returnExchangeGoodsData="returnExchangeGoodsData"
                v-loading="loading"
                @queryReturnRequestList="queryReturnRequestList"
                @handleSearchByPage="handleSearchByPage"
        ></commonApplyServiceTable>
    </el-container>
</template>
<style lang="scss">
    @import '@/assets/styles/order-service/variable.scss';
    @import '@/assets/styles/order-service/applyService_list.scss';
    @import '@/assets/styles/order-service/common.scss';
</style>
<script>
    import {mapState} from "vuex";
    import API from '@/api/order-service/applyService';
    import Utils from '@/api/order-service/utils';
    import commonApplyServiceTable from '@/components/order-service/common/commonApplyServiceTable.vue';
    export default {
        data() {
            var checkReturnRequestId = (rule, value, callback) => {
                if (value) {
                    let reg = /^[\d]+$/g;
                    setTimeout(() => {
                        if (value != "" && !reg.test(value)) {
                            callback(new Error('退换货单号只能是数字！'));
                            return false;
                        } else {
                            callback();
                        }
                    }, 200);
                }
            };
            var checkOrderId = (rule, value, callback) => {
                if (value) {
                    let reg = /^[\d]+$/g;
                    setTimeout(() => {
                        if (value != "" && !reg.test(value)) {
                            callback(new Error('订单编号只能是数字！'));
                            return false;
                        } else {
                            callback();
                        }
                    }, 200);
                }
            };
            var checkShipId = (rule, value, callback) => {
                if (value) {
                    let reg = /^[\d]+$/g;
                    setTimeout(() => {
                        if (value != "" && !reg.test(value)) {
                            callback(new Error('配送单号只能是数字！'));
                            return false;
                        } else {
                            callback();
                        }
                    }, 200);
                }
            };
            var checkSkuNo = (rule, value, callback) => {
                if (value) {
                    let reg = /^[\d]+$/g;
                    setTimeout(() => {
                        if (value != "" && !reg.test(value)) {
                            callback(new Error('商品编码只能是数字！'));
                            return false;
                        } else {
                            callback();
                        }
                    }, 200);
                }
            };
            var checkMemberCardNo = (rule, value, callback) => {
                if (value) {
                    let reg = /^[\d]+$/g;
                    setTimeout(() => {
                        if (value != "" && !reg.test(value)) {
                            callback(new Error('会员卡号只能是数字！'));
                            return false;
                        } else {
                            callback();
                        }
                    }, 200);
                }
            };
            var checkEmployeeId = (rule, value, callback) => {
                //只有查询和处理有导购员编号 1.查询 2.处理 3.审核
                if (this.$route.params.id == 1) {
                    if (value) {
                        let reg = /^[\w\d]+$/g;
                        if (!reg.test(value)) {
                            this.showEmployeeNameError=false;
                            callback(new Error('填写信息错误，请输入数字或字母'));
                        } else{
                            if(this.isseller){
                                this.showEmployeeNameError=true;
                                this.isseller =false;
                            }else{
                                this.showEmployeeNameError=false;
                            }
                            callback();
                        }
                        //如果输入导购员编号，表单不为空
                        this.isEmpty = false;
                    } else{
                        this.showEmployeeNameError = false;
                        this.isEmpty = true;
                    }
                }
            };
            return {
                header: {
                    "content": "查询条件"                        // tit名字
                },
                queryType: '',                                  //退换货列表查询类型:1：退换货查询列表 2：退换货待处理列表 3：退换货待审核列表
                currentPage: 1,                                 //当前页
                pageSize: 10,                                   //每页显示条数
                returnExchangeGoodsData: {},                    //退换货数据
                returnMethodSelectDataList: '',                 //商品退回方式
                returnRequestStateSelectDataList: [],           //退换货状态
                isEmpty: true,                                  //表单是否为空
                loading: false,
                isEmployee: false,
                showTimeError: false,
                showEmployeeInfo: false,
                disabledEmployeeId: false,
                showEmployeeNameError: false,
                isseller:false,
                beforeRoute: '',
                form: {
                    returnRequestId: '',                        //退换货单号
                    orderId: '',                                //订单编号
                    shipId: '',                                 //配送单号
                    skuNo: '',                                  //商品编码
                    returnShipMethod: '',                       //商品退回方式
                    returnRequestState: '',                     //退换货状态
                    startDateTime: '',                          //申请退换货开始时间
                    endDateTime: '',                            //申请退换货结束时间
                    memberCardNo: '',                           //会员卡号
                    employeeId: '',                             //导购员编号
                    employeeName: '',                           //导购员名称
                    guiderCode: '',                             //导购员名称
                },
                formParams: {},
                rules: {
                    returnRequestId: [
                        {validator: checkReturnRequestId, trigger: 'blur'}
                    ],
                    orderId: [
                        {validator: checkOrderId, trigger: 'blur'}
                    ],
                    shipId: [
                        {validator: checkShipId, trigger: 'blur'}
                    ],
                    skuNo: [
                        {validator: checkSkuNo, trigger: 'blur'}
                    ],
                    memberCardNo: [
                        {validator: checkMemberCardNo, trigger: 'blur'}
                    ],
                    employeeId: [
                        {validator: checkEmployeeId, trigger: 'change'}
                    ]
                },
                //判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.form.endDateTime !== '' && this.form.endDateTime !== null) {
                            let date = new Date(this.form.endDateTime).getTime();
                            return time.getTime() > Date.now() || time.getTime() > date;
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
                //今日以前日期，后面日期不可选择
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.form.startDateTime !== '') {
                            let date = new Date(this.form.startDateTime).getTime();
                            return time.getTime() < date || time.getTime() > Date.now();
                        } else {
                            return time.getTime() > Date.now();
                        }
                    }
                },
            }
        },
        components: {
            commonApplyServiceTable
        },
        /*
         * 记住用户输入的查询数据，从下一个页面退回来保留这些数据
         * */
        beforeRouteEnter (to, from, next) {
            next(vm => {
                let fromPath = from.path.split('/');
                vm.beforeRoute = fromPath[fromPath.length - 1];
                if (Utils.isStorage(vm.$route.params.id, vm.beforeRoute)) {
                    vm.form = JSON.parse(window.sessionStorage.getItem('serviceData'));
                    vm.queryReturnRequestList(vm.form, vm.currentPage);
                }
            })
        },
        //vuex取值
        computed: {
            ...mapState(['LOGINDATA'])
        },
        created () {
            this.getReturnRequestInitList();
            //查询和退换货待处理列表(根据路由判断)，展示导购员搜索条件项
            let _storeStaffId = this.LOGINDATA.storeStaffId;
            if (this.$route.params.id == 1) {
                this.showEmployeeInfo = true;
                //如果返回导购员编号
                if (_storeStaffId && (_storeStaffId != '' || _storeStaffId != null)) {
                    this.form.employeeId = _storeStaffId;
                    this.form.guiderCode = _storeStaffId;
                    this.isEmployee = true;
                    this.disabledEmployeeId = true;
                } else {
                    this.form.employeeId = '';
                    this.form.guiderCode = '';
                    this.isEmployee = false;
                    this.disabledEmployeeId = false;
                }
            } else {
                this.showEmployeeInfo = false;
                this.disabledEmployeeId = false;
            }
        },
        mounted (){
        },
        methods: {
            pickerTime () {
                if (this.form.endDateTime !== '' && this.form.endDateTime !== null) {
                    if (this.form.startDateTime !== '') {
                        let endTime = new Date(this.form.endDateTime).getTime() + 24 * 60 * 60 * 1000 - 1;
                        let startTime = new Date(this.form.startDateTime).getTime();
                        let time = (endTime - startTime) / 86400000;
                        if (time > 30) {
                            this.showTimeError = true
                        } else {
                            this.showTimeError = false
                        }
                    }
                }
            },
            //退换货列表查询初始化
            getReturnRequestInitList () {
                let _this = this;
                let params = {
                    queryType: this.$route.params.id
                };
                API.getReturnRequestInitList(params).then(response => {
                    if (response.success) {
                        if (response.response) {
                            let _res = response.response;
                            _this.returnMethodSelectDataList = _res.returnMethodSelectDataList || [];
                            _this.returnRequestStateSelectDataList = _res.returnRequestStateSelectDataList || [];
                        }
                    } else {
                        if (response.respMsg) {
                            _this.returnMethodSelectDataList = [];
                            _this.returnRequestStateSelectDataList = [];
                            _this.$message.error(response.respMsg);
                        }
                    }
                },reject =>{
                    console.error(reject);
                })
            },
            //查询导购员信息
            queryEmployeeInfoByAccount () {
                const params = {
                    account: this.form.employeeId
                };
                let _this = this;
                //如果导购员编号默认有值，回车键不可点
                if (this.disabledEmployeeId && this.disabledEmployeeId == true) {
                    return false;
                }
                let reg = /^[0-9a-zA-Z]*$/g;
                if (!reg.test(this.form.employeeId) || this.form.employeeId == '') {
                    this.form.employeeName = '';
                    return false;
                } else {
                    API.queryEmployeeInfoByAccount(params).then(response => {
                        if (response.success) {
                            _this.form.employeeName = response.response.name;
                            _this.form.guiderCode = response.response.userNo;
                            _this.showEmployeeNameError = false;
                        }else {
                            _this.isseller=true;
                            _this.showEmployeeNameError = true;
                            _this.form.employeeName = '';
                        }
                    }, reject =>{
                        console.error(reject);
                    })
                }
            },
            //查询服务单列表信息
            queryReturnRequestList (form, currentPage) {
                let _employeeId = '';
                if (this.form.employeeName == '') {
                    this.isEmpty = true;
                }
                //如果是导购员并且有导购员编号，employeeId传值取这个编号
                if (this.isEmployee == true && this.form.employeeId) {
                    _employeeId = this.form.guiderCode;
                }
                //如果不是导购员，那么先根据输入框里输入的信息查询看是否能取到对应的导购员名称，能取到说明是可用的编号，employeeId传值取这个编号
                //如果没有返回导购员名称，则说明不是可用的编号，employeeId传空，即使输入框输入了编号也传空
                else {
                    if (this.form.employeeName && this.form.employeeName != '') {
                        _employeeId = this.form.guiderCode;
                    } else {
                        _employeeId = null;
                    }
                };
                form = {
                    returnRequestId: this.form.returnRequestId ? this.form.returnRequestId : null,                            //退换货单号
                    orderId: this.form.orderId ? this.form.orderId : null,                                                    //订单编号
                    shipId: this.form.shipId ? this.form.shipId : null,                                                       //配送单号
                    skuNo: this.form.skuNo ? this.form.skuNo : null,                                                          //商品编码
                    returnShipMethod: this.form.returnShipMethod ? this.form.returnShipMethod : null,                                                         //商品退回方式
                    returnRequestState: this.form.returnRequestState ? this.form.returnRequestState : null,                                                   //退换货状态
                    startDateTime: this.form.startDateTime ? this.form.startDateTime * 1 : null,                                  //申请退换货开始时间
                    endDateTime: this.form.endDateTime ? this.form.endDateTime * 1 + 24 * 60 * 60 * 1000 : null,                                        //申请退换货结束时间
                    memberCardNo: this.form.memberCardNo ? this.form.memberCardNo : null,                                       //会员卡号
                    employeeId: _employeeId,                                                                                     //导购员编号
                };
                this.formParams = JSON.parse(JSON.stringify(form));
                const params = Object.assign({},
                        form,
                        {
                            queryType: this.$route.params.id,                                                               //列表类型
                            currentPage: currentPage || this.currentPage,                                                   //当前页
                            pageSize: this.pageSize                                                                         //默认显示条数
                        });
                let _this = this;
                //如果输入框为空，展示提示信息
                for (let value of Object.values(form)) {
                    if (value) {
                        this.isEmpty = false;
                    }
                }
                function _isNotDateGroups (start, end) {
                    if ((start && !end) || (!start && end)) {
                        return true;
                    }
                    return false;
                }

                if (this.isEmpty) {
                    this.$message.warning('请至少输入一个查询条件!');
                    return false;
                } else if (this.showEmployeeNameError == true || this.showTimeError == true) {
                    return false;
                } else if (_isNotDateGroups(form.startDateTime, form.endDateTime)) {
                    this.$message.warning("开始与结束时间必须都选");
                    return false;
                } else {
                    this.loading = true;
                    API.getReturnRequestList(params).then(response => {
                        _this.returnExchangeGoodsData.list = [];
                        delete _this.returnExchangeGoodsData.pager;
                        if (response.success) {
                            if (response.response) {
                                _this.isEmpty = true;
                                _this.loading = false;
                                _this.returnExchangeGoodsData = response.response;
                                if (_this.returnExchangeGoodsData && _this.returnExchangeGoodsData.list && _this.returnExchangeGoodsData.list.length > 0) {
                                    _this.returnExchangeGoodsData.list = _this.returnExchangeGoodsData.list.map((item, index) => {
                                        return Object.assign({}, item, {
                                          prodPayAmount: "￥" + item.prodPayAmount,
                                          submitterId: item.submitterId ? item.submitterId : '--',
                                        });
                                    })
                                }
                                window.sessionStorage.setItem('serviceData', JSON.stringify(params));
                            } else {
                                _this.loading = false;
                            }
                        } else {
                            if (response.respMsg) {
                                _this.loading = false;
                                _this.$message.error(response.respMsg);
                            }
                        }
                    });
                }
            },
            //重置输入框
            resetForm (formName) {
                this.isEmpty = true;
                this.showTimeError = false;
                this.showEmployeeNameError = false;
                this.form.employeeName = '';
                this.$refs[formName].resetFields();
            },
            handleSearchByPage (val) {
                this.isEmpty = false;
                let form = this.formParams;
                this.queryReturnRequestList(form, val)
            }
        }
    }
</script>
