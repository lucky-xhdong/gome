<template>
  <div> 
      <!-- 搜索条件 -->
      <el-row class="order_search_box">
        <el-form  :inline="true" :model="form" ref="form" :rules="rules" label-width="150px" size="mini" >
            <el-row>
                <el-col :span="24">
                    <el-form-item label="订单号："  prop="orderId">
                        <el-input  v-model.trim="form.orderId" placeholder="请输入订单号" ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" >
                    <el-form-item label="会员卡号或手机号：" v-bind:class="{iserror:cardNumError}" prop="memberCardNo">
                        <el-col :span="14">
                            <el-input v-model.trim="form.memberCardNo"  placeholder="请输入会员卡号或手机号"  @keyup.enter.native="cardNumberEvent"><i slot="suffix" class="el-input__icon icon iconfont" @click="cardNumberEvent">&#xe61c;</i></el-input>
                            <div class="el-form-item__error" v-if="cardNumError">{{errorCardNum}}</div>
                        </el-col>
                        <el-col :span="10">
                            <el-input :value="form.cardName" readonly="true" class="bg"></el-input>
                        </el-col>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="开单时间：" v-bind:class="{iserror:timeError}">
                        <el-date-picker type="date" placeholder="选择日期" :picker-options="pickerStart" v-model="form.beginTime" @change="timeLimit" style="width: 125px;" :editable="false"></el-date-picker>
                        <div class="el-form-item__error" v-if="timeError">{{errorTime}}</div>
                        <span>-</span>
                        <el-date-picker type="date" placeholder="选择日期" :picker-options="pickerEnd" v-model="form.endTime" @change="timeLimit" style="width: 125px;" :editable="false"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="导购员编号：" v-bind:class="{iserror:guiderCodeError}" prop="guiderCode">
                        <el-col :span="14" v-if="LOGINDATA.storeStaffId==null">
                            <el-input v-model.trim="form.guiderCode" placeholder="请输入导购员编号"    @keyup.enter.native="guiderCodeEvent"><i slot="suffix" class="el-input__icon icon iconfont" @click="guiderCodeEvent">&#xe61c;</i></el-input>
                            <div class="el-form-item__error"  v-if="guiderCodeError">{{errorGuiderCode}}</div>
                        </el-col>
                        <el-col :span="14" v-else>
                            <el-input v-model.trim="form.guiderCode" placeholder="请输入导购员编号"  disabled   @keyup.enter.native="guiderCodeEvent"><i slot="suffix" class="el-input__icon icon iconfont">&#xe61c;</i></el-input>
                            <div class="el-form-item__error" v-if="guiderCodeError">{{errorGuiderCode}}</div>
                        </el-col>
                        <el-col :span="10">
                            <el-input :value="form.guiderName" readonly="true" class="bg"></el-input>
                        </el-col>
                    </el-form-item>   
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24" >
                    <el-form-item label="商品编码：" v-bind:class="{iserror:skuNoError}" prop="skuNo">
                        <el-col :span="11">
                            <el-input v-model.trim="form.skuNo" placeholder="请输入商品编码" @keyup.enter.native="skuNoEvent"></el-input>
                            <div class="el-form-item__error" v-if="skuNoError">{{errorSkuNo}}</div>
                        </el-col>
                        <el-col :span="3">
                            <el-button  icon="el-icon-search" @click="dialogsearchFormVisible = true, searchForm.skuNoName=form.skuNo" style="width:100%;background:#DCDFE6;"></el-button>
                        </el-col>
                        <el-col :span="9">
                            <el-input v-model="form.skuNoName"  style="width:235px" readonly="true" class="bg"></el-input>
                        </el-col>
                        
                    </el-form-item>
                    <!-- 商品编码名称搜索框弹窗  开始-->
                    <el-form-item>
                    <el-dialog title="选择商品" :visible.sync="dialogsearchFormVisible" width="750px" top="50px" align="left" @close="close()">
                        <el-form :inline="true" :model="searchForm" size="mini" onsubmit="return false">
                            <el-row>
                                <el-col :span="16">
                                    <el-form-item  label="商品编码/名称：" v-bind:class="{iserror:skuNoNameError}">
                                        <el-input v-model.trim="searchForm.skuNoName" style="width:331px" @keyup.enter.native="querySkuList(false)" placeholder="请输入商品编码/名称"></el-input>
                                        <div class="el-form-item__error" v-if="skuNoNameError">未查询到商品信息</div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    <el-form-item>
                                        <el-button size="mini" type="primary" @click="querySkuList()">查询</el-button>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-table :data="searchData" border style="width: 100%" :show-header="true">
                                    <el-table-column prop="skuNo" label="商品编码" align="center" width="200px"></el-table-column>
                                    <el-table-column prop="skuName" label="商品名称" align="center">
                                        <template slot-scope="scope">
                                            <el-popover trigger="hover" placement="top">
                                                <p style="max-width:520px;word-break: break-all; word-wrap:break-word;">{{scope.row.skuName}}</p>
                                                <div slot="reference" class="name-wrapper">{{scope.row.skuName}}</div>
                                            </el-popover>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  label="操作" align="center" width="80">
                                        <template slot-scope="scope">
                                            <el-button type="text"  @click="handleClick(scope.row)">确定</el-button>    
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-row>
                            <!-- 商品列表 翻页 -->
                                <el-row type="flex"  justify="end" style="margin-top:20px" v-if="searchData.length>0">
                                    <el-col :span="24" style="width:auto">
                                        <div class="block pagebox">
                                            <el-pagination
                                            background
                                            @current-change="handleCurrentChange1"    
                                            :current-page.sync="searchPager.currentPage"
                                            :page-size="searchPager.pageSize"
                                            layout="total,prev, pager, next, jumper"
                                            :total="searchPager.totalSize">
                                            </el-pagination>
                                        </div>
                                    </el-col>
                                </el-row>
                        </el-form>
                    </el-dialog>
                    </el-form-item>
                    <!-- 商品编码搜索框弹窗  结束-->
                </el-col>
            </el-row>
            <el-row class="clearfix controlbox aligncenter">
                <el-col :span="24">
                    <el-form-item>
                        <el-button @click="resetForm('form')" style="margin-right:100px">重置</el-button>
                        <el-button type="primary" @click="searchEvent()">查询</el-button>
                    </el-form-item>
                     
                </el-col>
            </el-row>
              
        </el-form>
        </el-row>
        
        <el-table :data="tableData" border style="width: 100%" :show-header="true">
            <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
            <el-table-column prop="storeName" label="销售部门" align="center" ></el-table-column>
            <el-table-column prop="orderId" label="订单号" align="center" ></el-table-column>
            <el-table-column prop="shippingGroupId" label="配送单号" align="center" ></el-table-column>
            <el-table-column prop="memberCardNo" label="会员卡号" align="center" ></el-table-column>
            <el-table-column prop="memeberName" label="会员姓名" align="center"></el-table-column>
            <el-table-column prop="quantity" label="商品数量" align="center"></el-table-column>
            <el-table-column prop="orderAmount" label="订单金额" align="center" ></el-table-column>
            <el-table-column prop="guiderCode" label="导购员编号" align="center"></el-table-column>
            <el-table-column prop="guiderName" label="导购员姓名" align="center"></el-table-column>
            <el-table-column prop="submittedDate" label="开单时间" align="center">
                <template slot-scope="scope">{{scope.row.submittedDate | formatDate}}</template>
            </el-table-column>
            <el-table-column prop="orderState" label="订单状态" align="center"></el-table-column>
            <el-table-column  label="操作" align="center">
                <template slot-scope="scope">
                        <el-button type="text"   @click="delateReasonlist(scope.row)" v-if="LOGINDATA.orderplatform_orderpurchase_delatelist_confirmation">删单</el-button>

                        <el-dialog title="删单确认" :visible.sync="dialogFormVisible" width="450px" align="left">
                        <el-form :model="delateForm" label-width="90px" size="mini">
                            <el-row>
                            <el-col :span="24">
                            <el-form-item label="删单原因：" left>
                                <el-select v-model="delateForm.deleteReason " placeholder="请选择删单原因"> 
                                    <el-option v-for="(list,index) in delateList" :key="index" :value="list.code" :label="list.name"></el-option>
                                </el-select>
                            </el-form-item>
                             </el-col>
                            </el-row>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false ,delateForm.deleteReason=''"  size="mini">取 消</el-button>
                            <el-button type="primary" @click="delateFormEvent()"  size="mini" v-if="LOGINDATA.orderplatform_orderpurchase_delatelist_confirmation">确 定</el-button>
                        </div>
                        </el-dialog>
                    </template>
            </el-table-column>
        </el-table>
        <el-row  style="margin-top:20px;float:right" v-if="tableData.length>0">
            <el-col :span="8">
                <div class="block pagebox">
                    <el-pagination
                    background
                    @current-change="handleCurrentChange"
                    :current-page="pager.currentPage"
                    :page-size="pager.pageSize"
                    layout="total,prev, pager, next, jumper"
                    :total="pager.totalSize">
                    </el-pagination>
                </div>
            </el-col>
        </el-row>
  </div>
</template>
<script>
  import {mapState,mapActions} from  'vuex';
  import API from '@/api/order-purchase/orderPurchase_delate';
   import { formatDate } from "@/common/time";
   import { Message } from 'element-ui';
  export  default {
    data() {
        var validatorOderid = (rule, value, callback) => {
            var orderRegex = /^[0-9]+$/;
            if(value == ""){
                this.orderIds=false;
            }else if (!orderRegex.test(value)) {
                this.orderIds=true;
                callback(new Error('填写信息错误，请输入数字'))
            } else {
                this.orderIds=false;
            }
        };
        var validateMemberCardNo = (rule, value, callback) => {
            var newRegex = /^[0-9a-zA-Z]*$/g;
            if (!newRegex.test(value)) {
                callback(new Error('会员卡号只能是数字和字母'));
                this.cardNumError=false;
                this.card=true;
            }else if (value ==''){
                this.cardNumError=false;
                this.card=false
            }else{
                if(this.cardEnter){
                    this.cardNumError=true;
                    this.cardEnter=false;
                }else{
                    this.cardNumError=false;
                }
                callback();
                this.card=false
            }
        };
        var validateGuiderCode = (rule, value, callback) => {
            var newRegex = /^[0-9a-zA-Z]*$/g;
            if (!newRegex.test(value)) {
                callback(new Error('导购员编号只能是数字和字母'));
                this.guiderCodeError=false;
                this.guider=true
            }else if (value ==''){
                this.guider=false;
                this.guiderCodeError=false;
            }else{
                if(this.guiderEnter){
                    this.guiderCodeError=true;
                    this.guiderEnter=false;
                }else{
                    this.guiderCodeError=false;
                }
                callback();
                this.guider=false;

            }
        };
        var validateSkuNo = (rule, value, callback) => {
            var newRegex = /^[0-9a-zA-Z]*$/g;
            if (!newRegex.test(value)) {
                callback(new Error('商品编码只能是数字和字母'));
                this.skuNoError=false;
                this.skuNo=true;
            }else if (value ==''){
                this.skuNoError=false;
                this.skuNo=false;
            }else{
                 if(this.skuNoEnter){
                    this.skuNoError=true;
                    this.skuNoEnter=false;
                 }else{
                     this.skuNoError=false;
                 }
                callback();
                this.guider=false;
            }
        };  
      return {
        
        rowsindex:'',
        roworderId:'',
        rowsstroeId:'',
        cardNumError:false,
        errorCardNum:'',
        guiderCodeError:false,
        errorGuiderCode:'',
        skuNoError:false,
        errorSkuNo:'',
        memberCardNoPamas:'',
        orderIds:false,
        card:false,
        cardEnter:false,
        guider:false,
        guiderEnter:false,
        skuNo:false,
        skuNoEnter:false,
        guiderCode2:'',
        skuNo2:'',
        form: {
            orderId:'',
            beginTime:null,//开始时间
            endTime:null, //结束时间
            orderNumber:'',
            memberCardNo: '', //会员卡号
            cardName:'',
            dataTime: '',   //开单时间
            guiderCode:'', //导购编号
            guiderName:'',
            skuNo:'', //商品编号
            skuNoName:'',
        },
        pager:{
            currentPage:1,
            pageSize:15,
        },
        timeError:false,
        errorTime:'',
        tableData: [],
        delateForm:{
            deleteReason:'',
            name:'',
        },
        delateList:[],
        dialogTableVisible: false,
        dialogFormVisible: false,
        dialogsearchVisible: false,
        dialogsearchFormVisible: false,
        searchForm: {
          skuNoName:"",
        },
        searchPager:{
            currentPage:1,
            pageSize:15
        },
        skuNoNameError:false,
        searchData: [],
        rules: {//校验规则
            orderId: [//订单号
                { validator: validatorOderid, trigger: 'change'}
            ],
            memberCardNo:[//会员卡号或手机号
                {validator: validateMemberCardNo, trigger: 'change' }
            ],//sellerNo
            guiderCode:[//导购员编号
                {validator: validateGuiderCode, trigger: 'change' }
            ],
            skuNo:[//商品编号
                { validator: validateSkuNo, trigger: 'change' }
            ]
        },
        data2:{},
        data3:{},
        /** 判断前一个日历的日期不能大于后面的日历日期，且没有到的日期，不能选择 */  
        pickerStart: {
            disabledDate: (time) => {
                if (this.form.endTime !== '' && this.form.endTime !== null) {
                    var d = new Date(this.form.endTime).getTime()
                    return time.getTime() > Date.now() || time.getTime() > d
                }else {
                    return time.getTime() > Date.now()
                    
                }
            }
        },
        /** 今日以前日期，后面日期不可选择 */
        pickerEnd: {
            disabledDate: (time) => {
                if(this.form.beginTime!== ''){
                    var d = new Date(this.form.beginTime).getTime()-86400000;
                    return time.getTime() <= d || time.getTime() > Date.now()
                } else {
                    return time.getTime() > Date.now()
                }
                
            }
        }
      };
    },
    computed:{
        ...mapState({//vuex取值
            LOGINDATA:"LOGINDATA"
        }), 
    },
    created(){
        //如果是导购员，将检索条件中的导购员置灰并获取默认数据
        if(this.LOGINDATA.storeStaffId != null){
            this.form.guiderCode =this.LOGINDATA.storeStaffId;
            this.guiderCode2=this.LOGINDATA.storeStaffId;
        }
    },
    methods:{
        //点击重置按钮
        resetForm(formName) {
            if(this.LOGINDATA.storeStaffId == null){//不是导购员                         
                this.form.guiderCode='' //导购编号
                this.form.guiderName=''            
                this.guiderCode2='';
            };
            this.$refs[formName].resetFields(); 
            this.form.orderId="";
            this.form.beginTime=null;//开始时间
            this.form.endTime=null; //结束时间
            this.form.memberCardNo= ''; //会员卡号
            this.form.cardName='';
            this.form.dataTime= '';   //开单时间
            this.form.skuNo=''; //商品编号
            this.form.skuNoName=''
            this.cardNumError=false
            this.errorCardNum=''
            this.guiderCodeError=false
            this.errorGuiderCode=''
            this.skuNoError=false
            this.errorSkuNo=''
            this.timeError=false
            this.errorTime=''
            this.searchData=[]
            this.skuNoError=false;
            this.searchPager={};
            this.skuNoNameError=false;
            this.searchData=[];
            this.skuNo2='';
            this.memberCardNoPamas='';
        },
        //点击查询按钮
      searchEvent(val){
        
        var that=this;
        var orderId=that.form.orderId;
        var memberCardNo=that.memberCardNoPamas; //传从 查询会员卡号接口 返回的会员卡号
        var guiderCode=that.guiderCode2;
        var skuNo=that.skuNo2;
        var skuNoName=that.form.skuNoName;
        var currentPage=that.pager.currentPage;
        var pageSize=that.pager.pageSize;
        var cardName=that.form.cardName;
        var guiderName=that.form.guiderName;
        var timeError=that.timeError;
        var beginTime=that.form.beginTime;
        var endTime=that.form.endTime;
        var reg=/^[A-Za-z0-9]+$/;
        if(!reg.test(memberCardNo) || cardName==''){
            memberCardNo='';  
        }
        if(!reg.test(guiderCode) ||  guiderName==''){
            if(that.LOGINDATA.storeStaffId == null){//不是导购员
                guiderCode='';  
            }  
        }
        if(!reg.test(skuNo) || skuNoName==''){
            skuNo='';  
        }
        if(beginTime){
            beginTime=beginTime.getTime();
        }else{
            beginTime=null;
        }
        //判断结束时间是否存在
        if(endTime){
            endTime=endTime.getTime()+86399999;
        }else{
            endTime=null;
        }
        if(timeError){
            beginTime=null;
            endTime=null;
        }
          var data={
                "orderId":orderId,     
                "startSubmittedDate":beginTime,
                "endSubmittedDate":endTime,
                "memberCardNo":memberCardNo,
                "guiderCode":guiderCode,
                "skuNo":skuNo,
                "currentPage":currentPage,
                "pageSize":pageSize
              }
            if(val){
                //点击翻页按钮
                that.orderlist(val)
            }else{
                //点击查询按钮
               this.data2=data;
               data.currentPage=1;
               if(!this.orderIds && !this.timeError && !this.card && !this.guider && !this.skuNo && !this.cardNumError && !this.guiderCodeError && !this.skuNoError){
                   if((beginTime!=null && endTime!=null) || orderId!='' || memberCardNo!='' || skuNo!='' || guiderCode!=''){
                         that.orderlist(data)
                    }else{
                        if(this.orderIds  || this.timeError || this.card){
                        }else{
                            Message.warning('请至少输入一个查询条件');
                        }
                        
                    }
               }
               
            }
      },
      orderlist(data){  //查询导购单请求
          var that=this;
          API.queryUnpaidOrderList(data).then(function(data){
            if(data.response){
                that.tableData=data.response.list;
                that.pager=data.response.pager;
            }else{
                if(data.respMsg){
                    Message.warning(data.respMsg);
                }
                that.tableData=[];
            }
        })
      },
      //查询会员卡 手机号
      cardNumberEvent(){
          var that=this;
          var reg=/^[A-Za-z0-9]+$/; //字母数字正则
        if( !reg.test(that.form.memberCardNo)){
            that.form.cardName="";
            return false
        }else{
            var memberCardNo=that.form.memberCardNo;
            API.cardNumber({memberCardNo}).then(function(data){
            if((data.response && that.form.memberCardNo==data.response.memberCardNo) || (data.response && that.form.memberCardNo==data.response.memberPhone)){
                that.memberCardNoPamas=data.response.memberCardNo; //点击查询按钮的时候 需要统一传改接口里面的会员卡号
                if(data.response.memberName){  //如果获取的会员接口 没有会员姓名就取会员卡号
                    that.form.cardName=data.response.memberName;
                }else{
                    that.form.cardName=data.response.memberCardNo;
                }
                that.cardNumError=false;
            }else{
                that.cardEnter=true;
                that.errorCardNum="未查询到会员卡信息";
                that.cardNumError=true;
                that.form.cardName="";
                
            }
        })
        }
      },
      //查询导购员编号
      guiderCodeEvent(){
          var that=this;
          var reg=/^[A-Za-z0-9]+$/;
          if(!reg.test(that.form.guiderCode)){
              that.form.guiderName="";
              return false
          }else{
              var guiderCode=that.form.guiderCode;
              API.queryEmployeeInfoByAccount({"account":guiderCode}).then(function(data){
                    if(data.response && that.form.guiderCode==data.response.userNo){
                        that.guiderCode2=data.response.userNo;
                        if(data.response.name){
                             that.form.guiderName=data.response.name;
                        }else{
                             that.form.guiderName=data.response.userNo;
                        }
                        that.guiderCodeError=false;
                    }else{  
                            that.guiderEnter=true;
                            that.errorGuiderCode="未查询到导购员信息";
                            that.guiderCodeError=true;
                            that.form.guiderName="";
                        
                    }
                })
          }
      },
      close(){
          var that=this;
          that.skuNoNameError=false;
          that.searchData=[];
      },
      //查询商品编号
      skuNoEvent(){
          var that=this;
          var reg=/^[A-Za-z0-9]+$/;
          if(!reg.test(that.form.skuNo)){
              that.form.skuNoName="";
              return false
          }else{
              var skuNo=that.form.skuNo;
              API.querySkuInfo({"skuNo":skuNo}).then(function(data){
                    if(data.response && that.form.skuNo==data.response.skuNo){
                        that.skuNo2=data.response.skuNo;
                        that.form.skuNoName=data.response.skuName;
                        that.skuNoError=false;
                    }else{
                        that.skuNoEnter=true;
                        that.errorSkuNo="未查询到商品信息";
                        that.skuNoError=true;
                        that.form.skuNoName="";
                        
                    }
                })
          }
      },
      //查询商品编号或名称
      querySkuList(val){
          var that=this;
          var data;
          data={
                skuNoOrName:that.searchForm.skuNoName,
                currentPage:that.searchPager.currentPage,
                pageSize:15  //that.searchPager.pageSize
              }
           if(val){
               that.skulist(that.data3);
           }else{
               this.data3=data;
               data.currentPage=1;
               that.skulist(data);
           }   
          
      },
      skulist(data){
          var that=this;
          API.querySkuList(data).then(function(data){
                if(data.response && data.response.list && data.response.list.length>0){
                    that.searchData=data.response.list;
                    that.searchPager=data.response.pager;
                    that.skuNoNameError=false;
                }else{
                    if(data.respMsg){
                        Message.warning(data.respMsg);
                    }else{
                        that.skuNoNameError=true;
                    }
                    that.searchData=[];
                }
                
        });
      },
      //查询商品编码弹层确认按钮
      handleClick(row) {
          var that=this;
          that.skuNo2=row.skuNo;
          that.form.skuNoName=row.skuName;
          that.form.skuNo=row.skuNo;
          that.dialogsearchFormVisible = false;
          that.skuNoError=false;
          that.skuNoNameError=false;
          that.searchData=[];
      },
      //点击查询商品编码弹层翻页
      handleCurrentChange1(val) {
          this.data3.currentPage = val;
          this.querySkuList(this.data3);      
      },
      //时间限制在30天之内  
      timeLimit(){
         var that=this;
         var beginTime=that.form.beginTime;
         var endTime=that.form.endTime;
         //判断开始时间是否存在
         if(beginTime){
              beginTime=beginTime.getTime();
         }else{
             beginTime=null;
         }
         
         //判断结束时间是否存在
         if(endTime){
              endTime=endTime.getTime();
         }else{
             endTime=null;
         }
        //  if(endTime-beginTime>2592000000){
        //      this.timeError=true;
        //      this.errorTime="请选择30天内的时间范围";
        //  }else if(beginTime>endTime){
        //      this.errorTime="结束时间不能小于开始时间";
        //      this.timeError=true;
        //  }else{
        //      this.timeError=false;
        //  }

        if(beginTime==null && endTime){
            this.errorTime="请选择开始时间";
            this.timeError=true;
        }else if(beginTime && endTime==null){
            this.errorTime="请选择结束时间";
            this.timeError=true;
        }else if(beginTime==null && endTime==null){
            // this.errorTime="请选择开单时间范围";
            // this.timeError=true;
             this.timeError=false;
        }else if(endTime-beginTime>2592000000){
            this.errorTime="请选择30天内的时间范围";
            this.timeError=true;
        }else if(beginTime>endTime){
            this.errorTime="结束时间不能小于开始时间";
            this.timeError=true;
        }else{
            this.timeError=false;
        }
      },
      //删单原因列表
      delateReasonlist(row){
          var that=this;
          that.roworderId=row.orderId;
          that.rowsstroeId=row.storeCode;
          that.dialogFormVisible = true;
          API.queryDeleteReasonList().then(function(data){
                if(data.response){
                    that.delateList=data.response;
                }
          });
      },
      //点击删单确认按钮
      delateFormEvent(){
          var that=this;
          if(this.delateForm.deleteReason==''){
              Message.warning('请选择删单原因');
              return false;
          }else{
              var data={
                    orderId:that.roworderId,
                    storeCode:that.rowsstroeId,
                    reason:this.delateForm.deleteReason
                }
                API.deleteOrder(data).then(function(val){
                        if(val.success){
                            Message.success({
                                message: '删除成功',
                                duration:5000,
                                onClose:function(){
                                    that.searchEvent(that.data2);
                                }
                            });
                        }else{
                            Message.error(val.respMsg);
                        }
                        that.delateForm.deleteReason='';
                });
                that.dialogFormVisible = false;
          
          }
          
      },
      
      //查询导购单列表翻页
      handleCurrentChange(val) {
          this.data2.currentPage = val; 
          this.searchEvent(this.data2);
      },
     
    },
     //转换日期格式
        filters: {
            formatDate(time) {
                if(time!=null){
                    let date = new Date(time);
                    return formatDate(date, "yyyy-MM-dd hh:mm:ss");
                }
            }
        },

  }
</script>
<style>

.c_grey{
    color:#909399;
    margin-bottom: 20px;
}
.order_search_box{
    border: 1px solid #E4E7ED;
    padding:20px 10px 5px;
    margin-bottom:20px;
}
.aligncenter{
    text-align: center;
    margin-left: -138px;
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
.el-form-item__content{
    margin-left:0px;
}
thead.has-gutter th{
    background:#eef6ff;
    padding:8px;
}
.el-table__body td{
    padding:5px 0;
    font-size:12px;
}
/*错误提示*/
.errortext{
    position: absolute;
    font-size:12px;
    color:#f56c6c;
    left:125px;
    width:150px;
    top:2px;
}
.el-form-item.iserror .el-input__inner,.el-form-item.iserror .el-input__inner:focus{
    border-color:#f56c6c;
}
.bg .el-input__inner{
    background: #f4f4f5;
}
.name-wrapper{
     white-space:nowrap;          /* 不换行 */
     overflow:hidden;               /* 内容超出宽度时隐藏超出部分的内容 */
     text-overflow:ellipsis;         /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
}
</style>


			
	
			
