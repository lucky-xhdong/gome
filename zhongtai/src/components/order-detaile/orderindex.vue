<template>
  <div>    
      <!-- 检索条件 -->
        <div class="order_search_box clearfix"> 
            <!-- <div class="c_grey mb20">注：带<span class="red">*</span>号的查询条件，必须填写一项</div>       -->
            <el-form :inline="true" ref="form" :rules="rules" :model="form" label-width="150px" size="mini">
                <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
                        <el-form-item label="订单号：" prop="orderId">
                            <el-input v-model.trim="form.orderId" placeholder="请输入订单号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="12">
                        <el-form-item label="配送单号：" prop="shippingGroupId">
                            <el-input placeholder="请输入配送单号" v-model.trim="form.shippingGroupId"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>                                                  
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12" class="ctrolbox">
                        <el-form-item label="会员卡或手机号：" prop="memberCarandTeldNo" v-bind:class="{iserror:memberisError}">
                            <el-col>
                                <el-input placeholder="请输入会员卡或手机号：" style="width:176px;float:left;" v-model.trim="form.memberCarandTeldNo" size="mini" @keyup.enter.native="memberCarandTeldNofn" class="memberCar_input"><i slot="suffix" class="el-input__icon icon iconfont" @click="memberCarandTeldNofn">&#xe61c;</i></el-input>
                                <el-input v-model="form.membername" disabled  style="width:120px;float:left"></el-input>
                            </el-col>
                            <div class="el-form-item__error" v-if="memberisError">未查询到会员信息</div>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="12">
                        <el-form-item label="收货人手机号：" prop="consigneePhone">
                            <el-input placeholder="请输入手机号"  v-model.trim="form.consigneePhone"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="12">
                        <el-form-item label="开单时间：" v-bind:class="{iserror:dateerror}">
                                <el-date-picker placeholder="开始日期" value-format="timestamp" :picker-options="pickerStart" v-model="form.startTime" style="width: 142px;" @change="endtimeblur" class="memberCar_input" :editable="false"></el-date-picker>                    
                                <span>-</span>
                                <el-date-picker type="date" placeholder="结束日期" value-format="timestamp" :picker-options="pickerEnd" v-model="form.endTime" style="width: 142px;" @change="endtimeblur" class="memberCar_input" :editable="false"></el-date-picker> 
                                <div class="el-form-item__error" v-if="dateerrorMesg !=''">{{dateerrorMesg}}</div>
                        </el-form-item>
                    </el-col> 
                    <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="12">
                        <el-form-item label="订单状态：">
                            <el-select v-model="form.orderState" style="width:179px">
                            <el-option v-for="stateItem in orderStateList" :key="stateItem.orderStateCode"  :label="stateItem.orderStateName" :value="stateItem.orderStateCode" ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>                        
                </el-row>  
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="导购员编号：" prop="sellerNo" v-bind:class="{iserror:sellerNoisError}" v-if="LOGINDATA.storeStaffId==null">
                            <el-col :span="24">
                                <el-input placeholder="请输入导购员编号" style="width:176px;float:left;" v-model.trim="form.sellerNo" size="mini" @keyup.enter.native="sellerNofn" class="memberCar_input"><i slot="suffix" class="el-input__icon icon iconfont"  @click="sellerNofn">&#xe61c;</i></el-input>
                                <el-input v-model="form.sellername" disabled style="width:120px;float:left;"></el-input>
                            </el-col>
                            <div class="el-form-item__error" v-if="sellerNoisError">未查询到导购员信息</div>
                        </el-form-item>
                        <el-form-item label="导购员编号：" v-else>
                            <el-col :span="24">
                                <el-input placeholder="请输入导购员编号" disabled style="width:176px;float:left;" v-model.trim="form.sellerNo" size="mini"  class="memberCar_input"><i slot="suffix" class="el-input__icon icon iconfont">&#xe61c;</i></el-input>
                                <el-input v-model="form.sellername" disabled style="width:120px;float:left;"></el-input>
                            </el-col>
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="button-box">                   
                    <el-button size="mini" class="button" @click="onReset('form')">重置</el-button>
                    <el-button type="primary" size="mini" class="button right" @click="onSubmit">查询</el-button>
                </div>
            </el-form>
            
        </div>
    <!-- 搜索结果 -->
        <div>
            <el-table :data="response.list" border style="width: 100%" :show-header="true">
                <el-table-column type="index" label="序号" width="100" align="center"></el-table-column>
                <el-table-column prop="storeName" label="销售部门" align="center"></el-table-column>
                <el-table-column prop="orderId" label="订单号" align="center"></el-table-column>
                <el-table-column prop="state" label="订单状态" align="center"></el-table-column>
                <el-table-column prop="shippingGroupId" label="配送单号" align="center"></el-table-column>
                <el-table-column prop="shippingGroupState" label="配送单状态" align="center"></el-table-column>
                <el-table-column prop="memberCardNo" label="会员卡号" align="center"></el-table-column>
                <el-table-column prop="splitType" label="订单金额" align="center">orderAmount
                    <template slot-scope="scope">
                        <div v-if="scope.row.splitType == 0">
                            {{scope.row.orderAmount}}
                        </div>
                        <div v-else-if="scope.row.splitType == 1">
                            {{scope.row.shipPayAmount}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="splitType" label="操作" align="center" fixed="right">                   
                    <template slot-scope="scope">
                        <div v-if="scope.row.splitType == 0">
                            <router-link  :to="{path:'/order/orderdetailsbeforesplit',query:{orderId:scope.row.orderId,storeCode:scope.row.storeCode}}" target="_blank"><el-button v-if="LOGINDATA.orderplatform_orderList_check || LOGINDATA.orderplatform_orderList_checkbefore" type="text" size="small">查看详情</el-button></router-link>
                        </div>
                        <div v-else-if="scope.row.splitType == 1">
                            <router-link :to="{path:'/order/orderdetails',query:{orderId:scope.row.orderId,storeCode:scope.row.storeCode,shippingGroupId:scope.row.shippingGroupId}}" target="_blank"><el-button type="text" size="small" v-if="LOGINDATA.orderplatform_orderList_check || LOGINDATA.orderplatform_orderList_checkafter">查看详情</el-button></router-link>
                        </div>
                    </template>
                    <!-- <template slot-scope="scope">
                        <div v-if="scope.row.splitType == 0">
                            <router-link  :to="{path:'/order/orderdetailsbeforesplit',query:{orderId:scope.row.orderId,storeCode:scope.row.storeCode}}"><el-button type="text" size="small">查看详情</el-button></router-link>
                        </div>
                        <div v-else-if="scope.row.splitType == 1">
                            <router-link :to="{path:'/order/orderdetails',query:{orderId:scope.row.orderId,storeCode:scope.row.storeCode}}"><el-button type="text" size="small">查看详情</el-button></router-link>
                        </div>
                    </template> -->
                </el-table-column>
            </el-table>
            <div class="block pagebox" v-if="response.list.length!=0">
                <el-pagination
                background 
                @current-change="handleCurrentChange"
                :current-page="response.pager.currentPage"          
                :page-size="response.pager.pageSize"
                layout="total,prev, pager, next, jumper"
                :total="response.pager.totalSize">
                </el-pagination>
            </div>
        </div>
  </div>
</template>
<script>
    import {mapState,mapActions} from  'vuex';
    import API from '@/api/orderDetail/order_list';
    export default {
        data() {
            var validatePhoneNofn = (rule, value, callback) => {
                if(value == ""){
                    this.consigneePhone=true;
                //}else if(!/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(value)){
                }else if(!/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(value)){
                    callback(new Error('请输入正确的11位手机号码'));
                    this.consigneePhone=false;
                }else{
                    callback();
                    this.consigneePhone=true;
                }
            };
             var validateNumber = (rule, value, callback) => {
                var orderRegex = /^[0-9]+$/;
                if (!orderRegex.test(value)) {
                    callback(new Error('填写信息错误，请输入数字'));
                     this.consigneePhone=false;
                } else {
                    callback();
                    this.consigneePhone=true;
                }
            };
            var validatemember = (rule, value, callback) => {
                //this.memberisError=false;
                var newRegex = /^[0-9a-zA-Z]*$/g;
                if (!newRegex.test(value)) {
                    this.memberError=false;//会员卡活手机号格式错误
                    this.memberisError=false;
                    callback(new Error('填写信息错误，请输入数字或字母'));
                } else if (value ==''){
                    this.memberisError=false;
                    this.memberError=true;
                }else{    
                    this.memberError=true;
                    if(this.ismember){
                        this.memberisError=true;
                        this.ismember =false;
                    }else{
                        this.memberisError=false;
                    }
                    callback();

                }
            };
            var validatesellerNo = (rule, value, callback) => {
               // this.sellerNoisError=false;
                var newRegex = /^[0-9a-zA-Z]*$/g;
                if (!newRegex.test(value)) {                   
                    this.sellerNoError=false;//导购员编号格式错误
                    callback(new Error('填写信息错误，请输入数字或字母'));
                } else if (value ==''){
                    this.sellerNoError=true;
                }else{
                    if(this.isseller){
                        this.sellerNoisError=true;
                        this.isseller =false;
                    }else{
                        this.sellerNoisError=false;
                    }
                    this.sellerNoError=true;
                    callback();
                }
            };
            var validateorderId = (rule, value, callback) => {
                var orderRegex = /^[0-9]+$/;
                if(value == ""){
                    this.orderId=true;
                }else if (!orderRegex.test(value)) {
                    callback(new Error('填写信息错误，请输入数字'))
                    this.orderId=false;
                } else {
                    callback();
                    this.orderId=true;
                }
            };
            var validateshippingGroupId = (rule, value, callback) => {
                var orderRegex = /^[0-9]+$/;
                if(value == ""){
                    this.shippingGroupId=true;
                }else if (!orderRegex.test(value)) {
                    callback(new Error('填写信息错误，请输入数字'))
                    this.shippingGroupId=false;
                } else {
                    callback();
                    this.shippingGroupId=true;
                }
            };
            return {
                //isErrorTxt:false,
                ismember:false,
                isseller:false,
                dateerror:false,//开单时间是不是再30天范围内
                dateerrorMesg:"",//结束时间不能大于开始时间
                title:{ // 
                    "showclose":"",  //右面的关闭
                    "content":"单据查询-订单查询" 
                },
                value4: [,],
                memberisError:false,//会员卡活手机号查询结果错误
                sellerNoisError:false,//导购员编号查询结果错误
                memberError:true,//会员卡活手机号格式
                sellerNoError:true,//导购员编号格式
                orderId:true,//订单号
                shippingGroupId:true,//配送单号
                consigneePhone:true,//收货人手机号
                aaaa:true,
                form: {
                    orderId:"",//订单号
                    shippingGroupId:"",//配送单号
                    orderState:"",//订单状态
                    memberCarandTeldNo:"",//会员卡号
                    consigneePhone:"",//收货人手机号
                    sellerNo:"",//导购员编号
                    startTime:"",//开始的日期
                    endTime:"",//结束日期    
                    membername:"",//会员名称
                    sellername:"",//导购员名称
                    startDate:"",
                    startEnd:"",
                    memberCardNo:"",//会员卡号
                    guiderCode:""//请求成功的导购员编号
                },
                formsubmitdata:{},
                rules: {//校验规则
                    orderId: [//订单号
                        { validator: validateorderId, trigger: 'change'}
                    ],
                    shippingGroupId:[//配送单号
                        {validator: validateshippingGroupId, trigger: 'change'}
                    ],
                    consigneePhone:[//手机号
                        { validator: validatePhoneNofn, trigger: 'blur' },
                        { validator: validateNumber, trigger: 'change' }
                    ],
                    memberCarandTeldNo:[//会员卡或手机号
                        { validator: validatemember, trigger: 'change' }
                    ],//sellerNo
                    sellerNo:[//导购员编号
                        { validator: validatesellerNo, trigger: 'change' }
                    ]
                },
                /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */  
                pickerStart: {
                    // startTime1:"",
                   // endTime1:""
                    disabledDate: (time) => {
                        //alert(time)
                        if (this.form.endTime !== '' && this.form.endTime !== null) {
                            var d = new Date(this.form.endTime).getTime()
                           // return time.getTime() > Date.now() || time.getTime() > d
                            return time.getTime() > Date.now() || time.getTime() > d
                        } else {
                            return time.getTime() > Date.now()
                            
                        }
                    }
                },
                /** 今日以前日期，后面日期不可选择 */
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.form.startTime !== '') {
                            
                            var d = new Date(this.form.startTime).getTime()-86400000;

                            return time.getTime() <= d || time.getTime() > Date.now()
                           //   return time.getTime() > d + 86400000*30 || time.getTime() > Date.now()
                        } else {
                            return time.getTime() > Date.now()
                        }
                    }
                },
                response:{
                    pager:{},
                    list:[]
                },
                orderStateList:[]
            }
        }, 
        methods: {
            onSubmit(){
                //this.formsubmit = this.form;
                this.gettableData();
            },
            handleCurrentChange(currentPage){//orderindexpage
                //this.response.pager.currentPage = currentPage;
                let formData= this.formsubmitdata;
                formData.currentPage= currentPage;
                this.manageInit(formData);               
            },
            onReset(formName){//重置
                this.$refs[formName].resetFields();
                this.form.orderState="";
                this.form.startTime="";
                this.form.endTime="";
                this.dateerror =false;
                this.dateerrorMesg ='';
                this.memberisError=false;
                this.sellerNoisError=false;
                this.form.membername="";//会员名称
                this.form.sellername="";//导购员名称
                this.form.memberCardNo="";//会员编码
                if(this.LOGINDATA.storeStaffId == null){//不是导购员
                    this.form.sellerNo = "";
                    this.form.guiderCode="";//导购员编号
                }
                
            },
            gettableData(){//查询  memberisError:false, sellerNoisError:false,
                var _this = this;
                //alert(_this.memberisError)
                if(_this.orderId && _this.shippingGroupId && _this.consigneePhone && !_this.dateerror && !_this.memberisError && !_this.sellerNoisError && _this.memberError && _this.sellerNoError){//有报错信息不能查询
                    if (this.form.orderId || this.form.shippingGroupId || (this.form.startTime && this.form.endTime) || this.form.consigneePhone || this.form.memberCardNo || this.form.guiderCode || this.form.orderState) {    
                        //alert('you')               
                        var formData={
                            orderId:this.form.orderId,
                            shippingGroupId:this.form.shippingGroupId,
                            orderState:this.form.orderState,
                            memberCardNo:this.form.memberCardNo,
                            consigneePhone:this.form.consigneePhone,
                            guiderCode:this.form.guiderCode,
                            startSubmittedDate:this.form.startTime,
                            endSubmittedDate:this.form.endTime+86400000-1,//结束时间默认加24小时
                            currentPage:1,
                            pageSize:15
                        }
                        _this.formsubmitdata =formData;
                        _this.manageInit(formData);
                    
                    } else {
                        //alert('meiyou')
                        this.$message({
                            message: '请至少输入一个查询条件',
                            type: 'warning'
                        });
                    }
                } 
            },
            manageInit(data){//数据请求
                var _this = this;
                if(_this.form.memberCarandTeldNo =="" || _this.memberisError==true){
                    _this.form.memberCarandTeldNo = "";
                };
                if(_this.form.sellername =="" || _this.sellerNoisError==true){
                    if(_this.LOGINDATA.storeStaffId == null){//不是导购员
                        _this.form.sellerNo = "";
                    }
                };
                API.queryOrderList(data).then(function(data){
                    if(data.success && data.response !=null){
                        _this.response = data.response;
                    }else{      
                                        
                        _this.response.list=[];
                        if(data.respMsg!=null){
                            _this.$message({
                                message: data.respMsg,
                                type: 'error'
                            });
                        }
                        
                    }                       
                })
            },
            memberCarandTeldNofn:function(){//会员卡或手机号
                let _this =this;
                var newRegex = /^[0-9a-zA-Z]*$/g;
                //alert(newRegex.test(value))
                if (!newRegex.test(this.form.memberCarandTeldNo) || this.form.memberCarandTeldNo =="") {
                    _this.form.memberCardNo='';
                    _this.form.membername='';
                    return false;
                } else{
                    API.orderMemberInfo({
                        memberCardNo:this.form.memberCarandTeldNo
                    }).then(function(data){
                        if(data.success==false){
                            _this.ismember=true;
                            _this.memberisError=true;
                            _this.form.membername='';   
                           // alert(_this.memberisError)                        
                        }else{
                            _this.memberisError=false;
                            if(data.response.memberName=='' || data.response.memberName==null){
                                _this.form.membername=data.response.memberCardNo;
                            }else{
                                _this.form.membername=data.response.memberName;
                            }                            
                            _this.form.memberCardNo=data.response.memberCardNo; //点击查询按钮的时候 需要统一传改接口里面的会员卡号
                        }
                    });
                }               
            },
            sellerNofn:function(){//导购员编号
                let _this =this;
                var newRegex = /^[0-9a-zA-Z]*$/g;
                //alert(newRegex.test(value))
                if (!newRegex.test(this.form.sellerNo) || this.form.sellerNo =="") {
                    _this.form.sellername='';
                    _this.form.sellerNo = "";
                    _this.form.guiderCode="";//导购员编号
                    return false;

                } else{
                   // alert(this.form.sellerNo)
                    API.ordersellerInfo({
                        account:this.form.sellerNo
                    }).then(function(data){
                        if(data.success==false){
                             _this.isseller=true;
                            _this.sellerNoisError=true;
                            _this.form.sellername='';
                        }else{
                            _this.sellerNoisError=false;
                            if(data.response.name=='' || data.response.name==null){
                                _this.form.sellername=data.response.userNo;
                            }else{
                                _this.form.sellername=data.response.name;
                            }  
                            _this.form.guiderCode=data.response.userNo;//点击查询按钮的时候 需要统一传改接口里面的导购员便号
                        }
                    });
                }
            },
            endtimeblur(){//时间校验 不能超过30天 // startTime1:"",
                   // endTime1:""
                let _this =this;
                 if (this.form.endTime !== '' && this.form.endTime !== null && this.form.startTime !== '' && this.form.endTime !== null) {
                   // if (this.form.startTime !== '' && this.form.endTime !== null) {
                    let endDay = new Date(this.form.endTime).getTime();
                    let startDay = new Date(this.form.startTime).getTime();
                    if((endDay - startDay)<0){
                        _this.dateerror =true;
                        _this.dateerrorMesg ='结束时间不能小于开始时间';
                    }else{
                        if(startDay == 0){
                            _this.dateerror =true;
                            _this.dateerrorMesg ='请输入开始时间';
                        }else{
                            let chaday= (endDay - startDay)/86400000;
                            if(chaday>30){
                                _this.dateerror =true;
                                _this.dateerrorMesg ='请选择30天内的时间范围';
                            }else{
                                _this.dateerror =false;
                                _this.dateerrorMesg ='';
                            }
                        }   
                    }
                }else{
                    if (this.form.startTime == '' || this.form.startTime == null || new Date(this.form.startTime).getTime()==0) {
                        
                        _this.dateerror =true;
                        _this.dateerrorMesg ='请输入开始时间';
                    };
                    if (this.form.endTime == '' || this.form.endTime == null || new Date(this.form.endTime).getTime()==0) {
                        
                        _this.dateerror =true;
                        _this.dateerrorMesg ='请输入结束时间';
                    };
                    if((this.form.startTime == '' || this.form.startTime == null || new Date(this.form.startTime).getTime()==0) && (this.form.endTime == '' || this.form.endTime == null || new Date(this.form.endTime).getTime()==0)){
                        _this.dateerror =false;
                        _this.dateerrorMesg ='';
                    }
                }
            },
            orderState(){//订单状态数据请求
                var _this = this;
                API.queryOrderStateList().then(function(data){
                    _this.orderStateList = data.response;
                });
                //如果是导购员，将检索条件中的导购员置灰并获取默认数据
                if(_this.LOGINDATA.storeStaffId != null){
                    _this.form.sellerNo =_this.LOGINDATA.storeStaffId;
                    _this.form.guiderCode=_this.LOGINDATA.storeStaffId;
                }
            }
        },
        mounted(){
            this.orderState();
        },
        computed:{
            ...mapState({//vuex取值
            LOGINDATA:"LOGINDATA"
            }),
            startSubmittedDate:function(){
                let date = new Date(this.form.startDate);//日期框
                let time = new Date(this.form.startTime);//时间框     
                let Y = date.getFullYear();
                let M = date.getMonth()+1;
                let D = date.getDate();
                let H = time.getHours();
                let m = time.getMinutes();
                let s = time.getSeconds();


                let newtime = Y+"-"+M+"-"+D+" "+H+":"+m+":"+s
                return newtime;               //return 
            },
            endSubmittedTime:function(){//结束时间
                let time =  this.form.endDate+" "+this.form.endTime;//结束时间
                return time;     
            },
            time1:function(){
                return new Date().getTime();  
            }
        }
    }
</script>
<style>
.red{
    color:#F56C6C;
}
.mb20{
    margin-bottom:20px;
}
.c_grey{
    color:#909399;
}
.order_search_box{
    border: 1px solid #E4E7ED;
    padding:20px 10px 5px;
    margin-bottom:20px;
}
.order_search_box .order_title{
    height: 36px;
    border-bottom:1px solid #DCDFE6;
    background:#409EFF;
    color:#fff;
    font:15px/36px 'Microsoft YaHei';
    padding-left:15px;
}
.el-form-item.is-required .el-form-item__label:before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
}
.aligncenter{
    text-align: center;
}
.alignleft{
    text-align: left;
}
.controlbox .el-form-item__content{
    margin-left:0px;
}
.button-box{
width: 100%;
padding: 20px 0;
text-align: center;
}
.button.right{
margin-left: 100px;
}
thead.has-gutter th,.el-table th.is-leaf{
    background:#eef6ff;
    padding:8px;
}
.el-table__body td{
    padding:5px 0;
    font-size:12px;
}
/* 翻页 */
.pagebox{
    text-align:right;
    margin-top:20px;
}
/*错误提示*/
.errortext{
    position:absolute;
    font-size:12px;
    color:#f56c6c;
    left:125px;
    width:150px;
    top:5px;
}
.el-form-item.iserror .memberCar_input .el-input__inner{
    border-color:#f56c6c;
}
</style>
