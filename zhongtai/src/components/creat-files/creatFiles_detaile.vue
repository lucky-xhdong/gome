<template>
    <div class="creatFile">
        <g-header  v-model="initheader">
        </g-header>
        <el-form  :label-position="labelPosition"  :rules="rulesarchive" ref="rulesmesinfo" label-width="200px" :disabled="disabled" :model="rulesmesinfo"  size="mini">
            <el-form-item label="收货人姓名：" prop="archive.receiverName">
                <el-input v-model="rulesmesinfo.archive.receiverName" placeholder="请输入收货人姓名" :disabled="rulesmesinfo.archive.disabled"  auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="收货人手机号：" prop="archive.receiverPhoneNo">
                <el-input 
                v-model="rulesmesinfo.archive.receiverPhoneNo" 
                type="text" 
                placeholder="请输入手机号"
                maxlength="11"  :disabled="rulesmesinfo.archive.disabled" 
                auto-complete="off" 
                onkeyup="this.value=this.value.replace(/[^\d]/g,'')" 
                onafterpaste="this.value=this.value.replace(/[^\d]/g,'')"
                ></el-input>
            </el-form-item>
            <el-form-item label="其它联系方式：" :inline="true"  prop="archive.receiverOtherNo">
                <el-input 
                v-model="rulesmesinfo.archive.receiverOtherNo" 
                type="text"
                placeholder="请输入其它联系方式"   
                :disabled="rulesmesinfo.archive.disabled"  
                onkeyup="this.value=this.value.replace(/[^\d|-]/g,'')"      
                onafterpaste="this.value=this.value.replace(/[^\d|-]/g,'')" 
                auto-complete="off"
                ></el-input>
            </el-form-item>
             <el-form-item label="会员卡号：" >
                {{rulesmesinfo.archive.memberCardNo}}
            </el-form-item>
            <el-form-item label="收货地址：" v-if="!rulesmesinfo.canChoiceAddress.ishow" class="box-cityinput" prop="archive.address" >
                <g-city v-model="cityobj" @changeend="changeCity"></g-city>
                <el-input 
                v-model="rulesmesinfo.archive.address"
                :disabled="rulesmesinfo.archive.addressdisab"
                placeholder="请输入收货地址" 
                auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="收货地址：" v-if="rulesmesinfo.canChoiceAddress.ishow"  class="zeng-box-cityinput" prop="canChoiceAddress.value" >
                 <el-select v-model="rulesmesinfo.canChoiceAddress.value"
                    @change="canChoiceAddresschange"
                    :disabled="rulesmesinfo.canChoiceAddress.disabled"
                    placeholder="请选择"
                    auto-complete="off">
                    <el-option
                    v-for="item in rulesmesinfo.canChoiceAddress.options"
                    :key="item | object2String"
                    :label="item.stateName+item.cityName+item.countyName+item.townName+item.address"
                    :value="item | object2String"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="送货方式：" prop="delivermode.value" >
                <el-select v-model="rulesmesinfo.delivermode.value"
                    :disabled="rulesmesinfo.delivermode.disabled"
                    @change="delivermodechange"
                    placeholder="请选择"
                    auto-complete="off">
                    <el-option
                    v-for="item in rulesmesinfo.delivermode.options"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="送货时间：" prop="delivertime.dateTime" >
                 <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    :clearable="false"
                    :editable="false"
                    v-model="rulesmesinfo.delivertime.dateTime"
                    :disabled="rulesmesinfo.delivertime.disabled"
                    :picker-options="rulesmesinfo.delivertime.pickerOptions"
                    @change="delivertimeChang"
                    auto-complete="off"
                    >
                 </el-date-picker>
                  <span v-if="rulesmesinfo.archive.deliverySegmentDescBegin">{{rulesmesinfo.archive.deliverySegmentDescBegin}}-{{rulesmesinfo.archive.deliverySegmentDescEnd}}</span> 
                  <span class="delivertipmes" v-if="rulesmesinfo.delivermode.message">{{rulesmesinfo.delivermode.message}}</span>
                  <span class="songtip" v-if="rulesmesinfo.archive.deliveryInstallSyncFlag==1"><img :src="rulesmesinfo.archive.song"></span>
            </el-form-item>
            <el-form-item label="安装方式：" prop="installationmode.value"        
             v-if="rulesmesinfo.delivermode.installShowFlag">
                <el-select v-model="rulesmesinfo.installationmode.value"
                    :disabled="rulesmesinfo.installationmode.disabled"
                    @change="installationmodechange"
                    placeholder="请选择"
                    auto-complete="off">
                    <el-option
                    v-for="item in rulesmesinfo.installationmode.options"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="安装时间：" class="installation" prop="installationtime.dateTime"             
              v-if="rulesmesinfo.delivermode.installShowFlag" >
                    <el-date-picker
                        type="date"
                        placeholder="选择日期"
                        :clearable="false"
                        :editable="false"
                        v-model="rulesmesinfo.installationtime.dateTime"
                        :disabled="rulesmesinfo.installationtime.disabled"
                        :picker-options="rulesmesinfo.installationtime.pickerOptions"
                         @change="installationChang"
                         auto-complete="off"
                        >
                    </el-date-picker>
                    <span v-if="rulesmesinfo.archive.installSegmentDescBegin">{{rulesmesinfo.archive.installSegmentDescBegin}}-{{rulesmesinfo.archive.installSegmentDescEnd}}</span> 
                    <span class="songtip" v-if="rulesmesinfo.archive.deliveryInstallSyncFlag==1"><img :src="rulesmesinfo.archive.song"></span>
            </el-form-item>
            <el-form-item label="不安装原因：" class="installation"   prop="notInstallReasonList.value"      
             v-if="rulesmesinfo.delivermode.installShowFlag">
                    <el-select 
                    v-model="rulesmesinfo.notInstallReasonList.value" 
                    :disabled="rulesmesinfo.notInstallReasonList.disabled"
                    @change="notInstallReasonchange" 
                    placeholder="请选择"
                    auto-complete="off">
                        <el-option
                        v-for="item in rulesmesinfo.notInstallReasonList.options"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
            </el-form-item>
        </el-form>
        <g-header v-model="initinfo"></g-header> 
        <el-table
            :data="itemData"
            border
            :header-row-class-name="headerName"
            :header-cell-style="headerstyle"
            style="width: 100%;text-align:center;color:#606266">
            <el-table-column
            prop="orderId"
            label="订单号">
            </el-table-column>
            <el-table-column
            prop="shippingGroupId"
            label="配送单号">
            </el-table-column>
            <el-table-column
            prop="skuNo"
            label="商品编码">
            </el-table-column>
            <el-table-column
            prop="skuName"
            label="商品名称">
            </el-table-column>
            <el-table-column
            prop="storageName"
            label="仓库">
            </el-table-column>
             <el-table-column
            prop="inventoryStateDesc"
            label="库存状态">
            </el-table-column>
            <el-table-column
            prop="quantity"
            label="商品数量">
            </el-table-column>
            <el-table-column
            prop="price"
            label="商品价格">
            </el-table-column>
        </el-table>

        <div class="creatFileBtn" v-if="!disabled">

            <el-button v-if="LOGINDATA.orderplatform_creatfiles_bao" type="primary" size="small" @click.stop="submitForm('rulesmesinfo')">保存</el-button>
            <el-button size="small" @click.stop="jumpto()">取消</el-button>

        </div>

        <el-dialog
            title="提示"
            :visible.sync="dialogevent.dialogVisible"
            width="30%">
            <span>{{dialogevent.dialoginfo}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogeventfn">确 定</el-button>
            </span>
        </el-dialog>
        <g-delivery v-model="superability" @changed="changedability"></g-delivery>
    </div>
</template>
<style>
input[type=number] {  
    -moz-appearance:textfield;  
}  
input[type=number]::-webkit-inner-spin-button,  
input[type=number]::-webkit-outer-spin-button {  
    -webkit-appearance: none;  
    margin: 0;  
}  
.songtip{
    display: inline-block;
    width: 120px;
}
.songtip img{
    width: 100%;
    height: 100%;
}
.creatFile{
    border:1px solid #e4e7ed ;
    padding-bottom: 30px;
}
.creatFile .creatFileBtn {
    display: block;
    margin: 0 auto;
    width: 200px;
    margin-top: 20px;
    
}
.creatFile .el-input__inner{
    width: 200px;
}
.creatFile .delivertipmes{
    margin-left: 10px;
}
.creatFile .installation .notInstallReasonList{
    margin-top:20px;
}
.creatFile .installation .notInstallReasonList .el-input__inner{
    width:242px;
}
.creatFile .box-cityinput .el-input__inner{
    width: 453px;
    margin-top: 20px;
}
.creatFile .zeng-box-cityinput .el-input__inner{
     width: 453px;
}
.creatFile .cityinput .citytext{
    display: inline-block;
    width:100px;
    border:1px solid #ccc;
    height: 26px;
    text-align: center;
    line-height: 26px;
    border:1px solid #dcdfe6;

}

.headerName div{
    text-align: center;
    font-size:14px;
    color:  #909399;
}
</style>


<script>
  import {mapState,mapActions} from  'vuex';
  import API from '@/api/creatFiles/creatFiles_detaile.js';
  import util from '@/common/util.js';
  import env from '@/api/env.js';
  import song from '@/assets/images/song.png'
  export  default {
    data() {
        //that.rulesmesinfo.delivermode.code==1 && that.rulesmesinfo.installationmode.code==2 1自提 2不安装 特殊处理
        var that=this;
        var receiverNamefn=(rule, value, callback) => { //姓名验证
                let  disabled=that.rulesmesinfo.archive.disabled;   
                value?value=value:value=""
                //console.log(value.length);
                let len=value.length;
                //console.log(len)
               if(len > 30 && !disabled){
                    callback(new Error("收货人姓名最多30个字符(英文,数字,汉字各占一个字符)"));
                }else if( len == 0 && !disabled){
                    callback(new Error("请填写收货人姓名"));
                }else if(!/^[0-9a-zA-Z\u4e00-\u9fa5\.()\·\_]+$/.test(value) && !disabled){
                    callback(new Error("不能输入特殊字符"));
                }else  if(len==0 && that.rulesmesinfo.delivermode.code==1 && that.rulesmesinfo.installationmode.code==2){
                    callback();
                }else{  
                    callback();
                }
        };
        var receiverPhoneNofn=(rule, value, callback) => { //手机验证
            //console.log(value)
            let  disabled=that.rulesmesinfo.archive.disabled;
            if(that.rulesmesinfo.archive.receiverPhoneNo){
                that.rulesmesinfo.archive.receiverPhoneNo=that.rulesmesinfo.archive.receiverPhoneNo.replace(/[^\d]/g,'');
            }
            //!/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(value) && !disabled
            if(!value && !disabled){
                callback(new Error('请填写收货人手机号'));
            }else if(!/^(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4})$/.test(value) && !disabled){
                callback(new Error('请填写正确的11位收货人手机号'));
            }else if(!value && that.rulesmesinfo.delivermode.code==1 && that.rulesmesinfo.installationmode.code==2){
               callback(); 
            }else{
                callback();
            }
        };
        var receiverOtherNofn=(rule, value, callback) => {//其他联系方式验证
            //console.log(value)receiverOtherNo
            let  disabled=that.rulesmesinfo.archive.disabled;
            if(that.rulesmesinfo.archive.receiverOtherNo){
                that.rulesmesinfo.archive.receiverOtherNo=that.rulesmesinfo.archive.receiverOtherNo.replace(/[^\d|-]/g,'');
            }
            // console.log(value)
            if(!value){
                callback();
            }else if(value.length > 20 && !disabled){
                callback(new Error('请输入正确的联系方式'));
            }else if(!/^(0?(1[3|5|4|6|7|8|9]\d{1}[*|\d]{4}\d{4}))|(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/.test(value) && !disabled){
                callback(new Error('请输入正确的联系方式'));
            }else{
                callback();
            }
        };
        var addressfn=(rule, value, callback) => { //详细地址验证
            //console.log(value)
            let addressdisable=that.rulesmesinfo.archive.addressdisab;
            value?value=value:value=""
            let len = value.length;
            if(len == 0 && !addressdisable){
                callback(new Error("请填写收货详细地址"));
            }else if(len < 2 && !addressdisable){
                callback(new Error("详细地址最少输入2个字"));
            }else if(len > 80 && !addressdisable){
                callback(new Error("最多80个字符（英语、数字、汉字各占一个字符）"));
            }else if(len == 0 && that.rulesmesinfo.delivermode.code==1 && that.rulesmesinfo.installationmode.code==2){
                callback();
            }else{
                callback();
            }
        };
        var canChoiceAddressfn=(rule, value, callback) =>{
            let addressdisable=that.rulesmesinfo.archive.addressdisab;//详细地址
            let citydisable=that.cityobj.aeracode1.disable; //四级地址
            if(!addressdisable && !citydisable && !value){
                callback(new Error("送货地址不能为空"));
            }else if(!value && that.rulesmesinfo.delivermode.code==1 && that.rulesmesinfo.installationmode.code==2 ){
                callback();
            }else{
                callback();
            }
        }
        var delivermodefn=(rule, value, callback) => { //送货方式验证
            //console.log(value)
                let delivermodedisable=that.rulesmesinfo.delivermode.disabled;
                if(!delivermodedisable && !value){
                callback(new Error("请选择送货方式"));
                }else{
                callback();
                }
        };
        var delivertimefn=(rule, value, callback) => { //送货时间验证
            // console.log(value)
            let delivertime=that.rulesmesinfo.delivermode.operFlag;
            let deliverdisable=that.rulesmesinfo.delivertime.disabled;
            if((delivertime==2 || delivertime==3) && !deliverdisable && !value){
                callback(new Error("请选择送货时间"));
                }else{
                callback();
                }
        };
        var installationmodefn=(rule, value, callback) => { //安装方式验证
            //console.log(value)
            let installationmodedisable=that.rulesmesinfo.installationmode.disabled;
            if(!installationmodedisable && !value){
            
                callback(new Error("请选择安装方式"));
            
            }else{
                callback();
            }
            
        };
        var installationtimefn=(rule, value, callback) => { //安装时间验证
            // console.log(value)
            let installtime=that.rulesmesinfo.installationmode.operFlag; //安装标记012
            let installdisable=that.rulesmesinfo.installationtime.disabled;
            if((installtime == 3 || installtime == 2 ) && !installdisable && !value){
                callback(new Error("请选择安装时间"));
            }else{
                callback(); 
            }
            
        };
        var notInstallReasonListfn=(rule, value, callback) => { //不安装方式验证
            //console.log(this.rulesmesinfo.installationmode.code)
            let noInstalldisable=that.rulesmesinfo.notInstallReasonList.disabled;
            //console.log(value)
            if(that.rulesmesinfo.installationmode.code==2 && !value && !noInstalldisable){ //只有选择的不安装才去校验
                callback(new Error("请选择不安装原因"));
            }else{
                callback();
            }
        };
        return {
            superability:{ //送货能和安装能

            },
            initobject:{},//页面初始化请求参数
            operStatu:"", //0查看 1新增 2修改
            disabled:false, // 全部禁用
            dialogevent:{  //确认框
                dialogVisible:false,
                dialoginfo:""
            },
            cityobj:{   //四级区域
                    "curstyle":{
                        "background":"#f5f7fa",
                        "color":"#ccc"
                    }, //编辑样式
                    "aeracode1":{
                        "label":"",
                        "code":"",
                        "disable":true   
                    },
                    "aeracode2":{
                        "label":"",
                        "code":"",
                        "disable":true
                    },
                    "aeracode3":{
                        "label":"",
                        "code":"",
                        "disable":true
                    },
                    "aeracode4":{
                        "label":"",
                        "code":"",
                        "disable":true
                    }
            }, 
            labelPosition: 'right',  //from表格数据
            
            rulesmesinfo:{
                "archive": {
                    "storeCode":"", //门店代码  不展示 接口用
                    "saleOrgCode":"", //销售组织代码
                    "disabled":true, //姓名 手机号 联系方式 可否修改
                    "addressdisab":true,//详细地址可否
                    "installSite":"",//安装网点
                    "installArea":"",//安装区域
                    "installCompanyCode":"",//售后公司代码
                    "installQueryType":"", //初始化 是否可安  如果改商品默认进入 是选择安装 传1  如果默认进入非安装传0
                    "sayt":"",//区域是否支持
                    "deliveryInstallSyncFlag":"", //是否显示送按一体标识
                    "song":song,  //送按一体标识
                    "SyncFlagtip":""//记录送按一体
                },
                canChoiceAddress:{ //赠品选择多项地址
                    options:[],
                    value: '',
                    disabled:true,
                    ishow:false
                },
                delivermode:{  //送货方式
                        options:[],
                        value: '',
                        code:'',
                        installToDeliveryFlag:'',//是否安装能赋值运能
                        installShowFlag:"",//是否显示安装
                        disabled:true,
                        operFlag:"",//0送货日期不可选 1选日期不调接口 2选日期调接口
                        message:""//针对售后带货安装的特殊情况文字说明
                },
                delivertime:{ //送货时间
                    dateTime:"",  //展示初始化时间
                    disabled:true,          //禁止使用
                    pickerOptions: {        //禁用日期
                        disabledDate(time) {
                            if(that.rulesmesinfo.delivermode.operFlag==2){
                                return time.getTime() < that.rulesmesinfo.archive.deliveryLimitBeginDate  || time.getTime() > that.rulesmesinfo.archive.deliveryLimitEndDate;
                            }else{
                                return time.getTime() < that.rulesmesinfo.archive.deliveryLimitBeginDate
                            }
                            
                        }
                    }
                
                },
                installationmode:{  //安装方式
                    options:[],
                    value: '',
                    deliveryToInstallFlag:'',//是否运能赋值安装能
                    code:'',
                    disabled:true,
                    operFlag:""//0送货日期不可选 1选日期不调接口 2选日期调接口
                },
                installationtime:{ //安装时间
                    dateTime:"",  //展示初始化时间
                    disabled:true,          //禁止使用
                    pickerOptions: {        //禁用日期
                        disabledDate(time) { // 1operFlag==2 选时间和运能 控制选择日期  2如果送货时间选择了 就以送货时间为当前时间
                            //console.log(this)
                            let cur="";
                            that.rulesmesinfo.delivertime.dateTime && that.rulesmesinfo.delivermode.installToDeliveryFlag!=1?cur=that.rulesmesinfo.delivertime.dateTime:cur=that.rulesmesinfo.archive.installLimitBeginDate
                            if(that.rulesmesinfo.installationmode.operFlag==2){
                                return time.getTime() < cur  || time.getTime() > that.rulesmesinfo.archive.installLimitEndDate;
                            }else{
                                return time.getTime() < cur
                            }
                        }
                    }
                },
                notInstallReasonList:{ // 不安装
                    options:[],
                    value: '',
                    code:'',   //不安装原因选中的code码
                    disabled:true
                }
            },
            rulesarchive: { //校验规则
                "archive.receiverName": [
                    { validator: receiverNamefn, trigger: 'blur' }
                ],
                "archive.receiverPhoneNo":[
                    { validator: receiverPhoneNofn, trigger: 'blur' }
                ],
                "archive.receiverOtherNo":[
                    { validator: receiverOtherNofn, trigger: 'blur' }
                ],
                "archive.address":[
                    { validator: addressfn, trigger: 'blur' }
                ],
                "canChoiceAddress.value":[
                    { validator: canChoiceAddressfn, trigger: 'blur' }
                ],
                "delivermode.value":[
                    { validator: delivermodefn, trigger: 'change' }
                ],
                "delivertime.dateTime":[
                    { validator: delivertimefn, trigger: 'blur' }
                ],
                "installationmode.value":[
                    { validator: installationmodefn, trigger: 'change' }
                ],
                "installationtime.dateTime":[
                    { validator: installationtimefn, trigger: 'blur' }
                ],
                "notInstallReasonList.value":[
                    { validator: notInstallReasonListfn, trigger: 'change' }
                ]

            },
            initheader:{ 
                "curstyle":{              //头数据
                    "margin-bottom":"30px"
                },
                "showclose":"",
                "content":"修改建档"
            },
            initinfo:{
                "curstyle":{              //头数据
                    "margin-bottom":"30px"
                },
                "content":"商品信息"
            },
            itemData:[],
            headerName:"headerName",
            headerstyle:{
                "background":"#eef6ff"
            }
        }
    },
    filters: {  //转对象和字符串
        object2String(str) {
          //console.log(this.num)
            return util.object2String(str);
        }
    },
    computed:mapState({ //登录权限vuex变量
      LOGINDATA:"LOGINDATA"
    }),
    mounted(){ //页面初始化
        //console.log(this.$route)
        if(this.$route.params.initCode){
            let initarr=this.$route.params.initCode.split('-'),
                initobject={
                    storeCode:initarr[0],
                    orderId:initarr[1],
                    commerceItemId:initarr[2],
                    shippingGroupId:initarr[3],
                    operFlag:initarr[4]
                };//初始化对象
        this.operStatu=initobject.operFlag;
        for(let i=0; i<initarr.length; i++){ //路由过滤
           if( initarr[i]==""){
                this.jumpto();
                return;
           }
        }
        if(initarr.length<5){    //路由过滤
            this.jumpto();
            return;
        }
            this.initobject = initobject;
            this.initData(initobject);
        }else{
            this.jumpto();
        }
        
    },
    methods:{
        changedability(obj){  //安装能和送货能回调
            
            let  that=this;

            if(obj.type=="delivery"){//送货能返回
                //alert(2)
                if(obj.st=="close"){
                    that.rulesmesinfo.delivertime.dateTime="";
                    that.rulesmesinfo.archive.deliverySegmentDescBegin="";
                    that.rulesmesinfo.archive.deliverySegmentDescEnd="";
                    that.rulesmesinfo.archive.deliverySegmentCode="";
                    return false;
                }
                //alert(2)
                that.rulesmesinfo.archive.deliverySegmentDescBegin=obj.st;
                that.rulesmesinfo.archive.deliverySegmentDescEnd=obj.et;
                that.rulesmesinfo.archive.deliverySegmentCode=obj.code;
                that.rulesmesinfo.delivertime.dateTime=obj.time;
                that.rulesmesinfo.archive.able=obj.able;//0 约满 1可选 2 紧张 3 送按一体
                that.rulesmesinfo.archive.installSite=obj.installSite;
                that.rulesmesinfo.archive.installSitecur=obj.installSite;
                that.rulesmesinfo.archive.installArea=obj.installArea;
                that.rulesmesinfo.archive.installAreacur=obj.installArea;
                that.rulesmesinfo.archive.installCompanyCode=obj.installCompanyCode;
                that.rulesmesinfo.archive.installCompanyCodecur=obj.installCompanyCode;
                that.rulesmesinfo.archive.sayt=obj.sayt;
                that.rulesmesinfo.archive.installSegmentCode=obj.installSegmentCode;
                that.rulesmesinfo.archive.installSegmentCodecur=obj.installSegmentCode;
                //对应的安装能的code
                that.addSeathanger();//增加座装和挂装
            }else{//安装能
                if(obj.st=="close"){
                    that.rulesmesinfo.archive.installSegmentDescBegin="";//安装能重选
                    that.rulesmesinfo.archive.installSegmentDescEnd="";
                    that.rulesmesinfo.archive.installSegmentCode="";
                    that.rulesmesinfo.installationtime.dateTime="";
                    that.rulesmesinfo.archive.installSite="";
                    that.rulesmesinfo.archive.installArea="";
                    that.rulesmesinfo.archive.installCompanyCode="";
                     if(that.rulesmesinfo.delivermode.installToDeliveryFlag==1){// 如果是售后带货安装的话  安装时间要反写到配送时间
                        that.rulesmesinfo.delivertime.dateTime="";
                    }
                    return false;
                }
               
                that.rulesmesinfo.archive.installSegmentDescBegin=obj.st;//安装能重选
                that.rulesmesinfo.archive.installSegmentDescEnd=obj.et;
                that.rulesmesinfo.archive.installSegmentCode=obj.code;
                that.rulesmesinfo.installationtime.dateTime=obj.time;
                that.rulesmesinfo.archive.installSite=obj.installSite;
                that.rulesmesinfo.archive.installArea=obj.installArea;
                that.rulesmesinfo.archive.installCompanyCode=obj.installCompanyCode;
                 if(that.rulesmesinfo.delivermode.installToDeliveryFlag==1){// 如果是售后带货安装的话  安装时间要反写到配送时间
                    that.rulesmesinfo.delivertime.dateTime=that.rulesmesinfo.installationtime.dateTime;
                }


               if(that.rulesmesinfo.archive.SyncFlagtip==1){
                     if(!(that.rulesmesinfo.archive.installSegmentDescBegin == that.rulesmesinfo.archive.deliverySegmentDescBegin && that.rulesmesinfo.archive.installSegmentDescEnd == that.rulesmesinfo.archive.deliverySegmentDescEnd && that.rulesmesinfo.installationtime.dateTime == that.rulesmesinfo.delivertime.dateTime)){

                    that.rulesmesinfo.archive.deliveryInstallSyncFlag=0;
                }else{
                     that.rulesmesinfo.archive.deliveryInstallSyncFlag=1;
                }
               }
               




            }
            
            //   let obj={ //返回的对象
            //   st:st, //开始时间 8：00
            //   et:et, //结束时间 10：00
            //   code:code, //该时段对应的代码
            //   time:that.dayselect.val, //选中的日期
            //   type:that.value.type, //类型 送货能（运能）delivery  安装能 installAbility 区分后续操作
            //   installSite:that.installSite,  //type 为 installAbility时  返回安装网点
            //   installArea:that.installArea, //type 为 installAbility时  返回安装区域
            //   installCompanyCode:that.installCompanyCode  //type 为 installAbility时返回售后公司代码
            // }
            
        },
        submitForm(formName){//表单验证
            let that=this;
            //console.log(this.$refs[formName])
            this.$refs[formName].validate((valid) => {
            //  console.log(valid)
                if(valid){ //提交
                let filesobj={ //提交的信息
                        operType:that.operStatu, //操作类型
                        archive:{  //建档信息
                                storeCode:that.rulesmesinfo.archive.storeCode,  //门店代码
                                saleOrgCode:that.rulesmesinfo.archive.saleOrgCode, //销售组织代码
                                orderId:that.itemData[0].orderId,//订单号
                                shippingGroupId:that.itemData[0].shippingGroupId,//配送单号
                                commerceItemId:that.itemData[0].commerceItemId,//商品唯一号
                                receiverName:that.rulesmesinfo.archive.receiverName,//收货人姓名
                                receiverPhoneNo:that.rulesmesinfo.archive.receiverPhoneNo,//收货人手机号
                                receiverOtherNo:that.rulesmesinfo.archive.receiverOtherNo,//其他人联系方式
                                stateCode:that.cityobj.aeracode1.code,//一级区域
                                stateName:that.cityobj.aeracode1.label,
                                cityCode:that.cityobj.aeracode2.code,//二级区域
                                cityName:that.cityobj.aeracode2.label,
                                countyCode:that.cityobj.aeracode3.code,//三级区域
                                countyName:that.cityobj.aeracode3.label,
                                townCode:that.cityobj.aeracode4.code,//四级区域
                                townName:that.cityobj.aeracode4.label,
                                address:that.rulesmesinfo.archive.address,//详细地址
                                deliveryMethodCode:that.rulesmesinfo.delivermode.code,//送货方式code码
                                deliveryDate:that.rulesmesinfo.delivertime.dateTime*1,//送货时间
                                deliverySegmentCode:that.rulesmesinfo.archive.deliverySegmentCode,//运能对应的code
                                deliverySegmentDescBegin:that.rulesmesinfo.archive.deliverySegmentDescBegin,//运能对应的开始时间
                                deliverySegmentDescEnd:that.rulesmesinfo.archive.deliverySegmentDescEnd,//运能对应的结束时间
                                installMethodCode:that.rulesmesinfo.installationmode.code,//安装方式code码
                                installDate:that.rulesmesinfo.installationtime.dateTime*1,//安装时间
                                installSegmentCode:that.rulesmesinfo.archive.installSegmentCode,//安装能对应的code
                                installSegmentDescBegin:that.rulesmesinfo.archive.installSegmentDescBegin,//安装能对应的开始时间
                                installSegmentDescEnd:that.rulesmesinfo.archive.installSegmentDescEnd,//安装能对应的结束
                                notInstallReasonCode:that.rulesmesinfo.notInstallReasonList.code,//不安装原因的code
                                installSite:that.rulesmesinfo.archive.installSite,//安装网点
                                installArea:that.rulesmesinfo.archive.installArea,//安装区域
                                installCompanyCode:that.rulesmesinfo.archive.installCompanyCode,//售后公司代码
                                shippingMethod:that.rulesmesinfo.archive.shippingMethod,//配送类型
                                deliveryMasLocType:that.itemData[0].deliveryMasLocType, //发货仓库类型
                                installShowFlag:that.rulesmesinfo.delivermode.installShowFlag, //安装信息显示标记
                                sayt:that.rulesmesinfo.archive.sayt//区域是否支持
                    
                        }
                }
                 that.$confirm("您确认修改吗?").then(function(){
                    API.saveGoodsItemArchive(filesobj).then(function(data){
                    //console.log(data)
                    if(data && data.success){
                        that.$message({
                        message: '保存成功',
                        type: 'success',
                        duration:3000,
                        onClose:function(){
                            that.jumpto('/order/creatFileSelect')
                            }
                        });
                    
                    }else{
                        that.$message.error(data.respMsg);
                    }
                });
                 })
                
                } else {
                    //console.log('error submit!!');
                    return false;
                }
            });
        },
        changeCity(val){ //改变城市之后返回的内容
            let that=this;
            let aeracode="aeracode";
            console.log(val);
            for (let i=0; i<val.length; i++){
                that.cityobj[aeracode+(i+1)].label=val[i].label;
                that.cityobj[aeracode+(i+1)].code=val[i].code;
            //   console.log(i)
            }
            // 修改地址后重新请求初始化地址
            that.initobject.townCode = that.cityobj.aeracode4.code;

            that.initData(that.initobject);
        // console.log(that.cityobj)
        },
        canChoiceAddresschange(key){//选择完多个地址
            let that=this;
            //console.log(key)
            let cityobjs=util.string2Object(key);
            that.cityobj.aeracode1.label=cityobjs.stateName;
            that.cityobj.aeracode1.code=cityobjs.stateCode;
            that.cityobj.aeracode2.label=cityobjs.cityName;
            that.cityobj.aeracode2.code=cityobjs.cityCode;
            that.cityobj.aeracode3.label=cityobjs.countyName;
            that.cityobj.aeracode3.code=cityobjs.countyCode;
            that.cityobj.aeracode4.label=cityobjs.townName;
            that.cityobj.aeracode4.code=cityobjs.townCode;
    
        },
        delivermodechange(key){ //选择完送货方式之后
            //console.log(key)
           if(key!=this.rulesmesinfo.delivermode.code){
                this.initDeliver('code',key,this.rulesmesinfo.archive);
           }
        // console.log(this.delivermode)
        },
        installationmodechange(key){ //选择完安装方式之后
        //console.log(key)
             if(key!=this.rulesmesinfo.installationmode.code){
                 this.initInstall('code',key,this.rulesmesinfo.archive);
             }  
        // console.log(this.installationmode)
        },
        notInstallReasonchange(key){//不按装select选中事件
            this.rulesmesinfo.notInstallReasonList.code=key;
        },
        dialogeventfn(){ //弹框点击确定之后的操作
            this.dialogevent.dialogVisible=false;
            this.dialogevent.dialoginfo="";
            this.jumpto();
        },
        jumpto(to){//跳转页面
            this.$router.push(to?to:'/order/creatFileSelect');
        },
        initData(initobject){ //初始化数据
            let that=this;
            //that.itemData[0].orderId=123
            API.queryGoodsItemArchive(initobject).then(function(data){
                //console.dir(data)
                if(data && data.success && data.response){
                    let initdata=data.response;
                    



                    //初始化商品信息展示
                    that.itemData=[];
                    that.itemData.push(initdata.goodsItem);

                   


                //不安装原因
                    that.rulesmesinfo.notInstallReasonList.options=initdata.initResult.notInstallReasonList?initdata.initResult.notInstallReasonList:[]
                //送货方式
                    that.rulesmesinfo.delivermode.options=initdata.initResult.canChoiceDeliveryMethodList?initdata.initResult.canChoiceDeliveryMethodList:[]
                // 处理送货方式和安装方式的联动
                 //初始化页面信息展示
                    
                    //1 送货时间
                    that.initDeliver('isSelected',1,initdata.archive);
                    that.rulesmesinfo.delivertime.dateTime=initdata.archive.deliveryDate;
                    that.rulesmesinfo.delivermode.disabled=that.initFlag(initdata.archive.deliveryFlag);//禁止送货方式
                   
                    
                    //2 安装时间
                    that.initInstall('isSelected',1,initdata.archive);
                    that.rulesmesinfo.installationtime.dateTime=initdata.archive.installDate;
                    that.rulesmesinfo.installationmode.disabled=that.initFlag(initdata.archive.installFlag);//禁止安装方式
                    //处理 首次填写地址的时候需要不清除的内容
                    that.rulesmesinfo.archive.receiverName?initdata.archive.receiverName=that.rulesmesinfo.archive.receiverName:"" //收货人姓名
                    that.rulesmesinfo.archive.receiverPhoneNo?initdata.archive.receiverPhoneNo=that.rulesmesinfo.archive.receiverPhoneNo:"" //收货人手机号
                    that.rulesmesinfo.archive.receiverOtherNo?initdata.archive.receiverOtherNo=that.rulesmesinfo.archive.receiverOtherNo:"" //其他联系方式
                    that.rulesmesinfo.archive.address?initdata.archive.address=that.rulesmesinfo.archive.address:""//详细地址
                    that.rulesmesinfo.archive=initdata.archive;
                    that.rulesmesinfo.archive.installQueryType=that.rulesmesinfo.installationmode.code==1?1:0;

                //初始化时间展示  
                
               
                    //console.log(that.rulesmesinfo.archive.address)
                // 城市组建初始化
                if(that.rulesmesinfo.archive.stateCode){
                     that.cityobj.aeracode1.label=that.rulesmesinfo.archive.stateName;    //一级
                    that.cityobj.aeracode1.code=that.rulesmesinfo.archive.stateCode;
                    that.cityobj.aeracode2.label=that.rulesmesinfo.archive.cityName;    //二级
                    that.cityobj.aeracode2.code=that.rulesmesinfo.archive.cityCode;
                    that.cityobj.aeracode3.label=that.rulesmesinfo.archive.countyName; //三级
                    that.cityobj.aeracode3.code=that.rulesmesinfo.archive.countyCode;
                    that.cityobj.aeracode4.label=that.rulesmesinfo.archive.townName;   //四级
                    that.cityobj.aeracode4.code=that.rulesmesinfo.archive.townCode;
                }
                   
                //初始化范围(收货人姓名、手机、联系方式)置灰不让点击
                //initdata.archive.receiveFlag=0
                    that.rulesmesinfo.archive.disabled=that.initFlag(initdata.archive.receiveFlag);
                //详细人地址可否修改
                // console.log(initdata.archive.addressFlag)
                    that.rulesmesinfo.archive.addressdisab=that.initFlag(initdata.archive.addressFlag);
                //console.log(initdata.archive.addressFlag)

                    if(!(that.initFlag(initdata.archive.cityAddressFlag)  || that.disabled)){ // 据说这个页面要修该 也只能修改三级
                    // 允许修改四级区域地质
                        that.cityobj.curstyle="";
                        that.cityobj.aeracode1.disable=false;
                        that.cityobj.aeracode2.disable=false;
                        that.cityobj.aeracode3.disable=false;
                        that.cityobj.aeracode4.disable=false;
                    }
                

                    //赠品
                    if(initdata.archive.canChoiceAddressList && initdata.archive.canChoiceAddressList.length>=1){
                        that.rulesmesinfo.canChoiceAddress.ishow=true;
                        that.rulesmesinfo.canChoiceAddress.options=initdata.archive.canChoiceAddressList;
                    //console.log(initdata)
                    if(initdata.archive.cityAddressFlag==1 && initdata.archive.addressFlag==1){ //支持修改四级区域和详细地址
                            that.rulesmesinfo.canChoiceAddress.disabled=false;
                        }
                    }
                    
                     //图标赋值
                    that.rulesmesinfo.archive.song=song;
                     //区域是否支持送按一体
                    that.rulesmesinfo.archive.sayt=initdata.archive.deliveryInstallAreaSyncFlag;

                    //记录song按一体
                    if(that.rulesmesinfo.archive.deliveryInstallAreaSyncFlag==1){
                        that.rulesmesinfo.archive.SyncFlagtip=1;
                    }
                    //处理查看
                    if(that.operStatu==0){
                        that.disabled=true;
                        that.initheader.content="查看建档";
                    }else{
                        //售后带货安装特殊文字提示“修改安装时间后自动生成送货时间”
                        if(that.rulesmesinfo.delivermode.installToDeliveryFlag==1  && that.rulesmesinfo.delivermode.installShowFlag!=0 && !that.rulesmesinfo.installationtime.disabled){
                            that.rulesmesinfo.delivermode.message="修改安装时间后自动生成送货时间";
                        };
                        if(that.rulesmesinfo.installationmode.code==2){//不安装
                            that.rulesmesinfo.notInstallReasonList.disabled=false;
                            //that.rulesmesinfo.installationtime.disabled=that.initFlag(0);//禁止安装时间
                        }
                    }
            
                }else{
                    //弹框 接口错误
                that.dialogevent.dialogVisible=true;
                that.dialogevent.dialoginfo="服务器忙.....";
                }
            })
        },
        initFlag(val){
            return val?false:true
        },
        initDeliver(isSelected,code,archive){ //取对应的送货参数
            let that=this;
            for(let i=0; i<that.rulesmesinfo.delivermode.options.length;i++){
                if(that.rulesmesinfo.delivermode.options[i][isSelected]==code){

                    that.rulesmesinfo.delivermode.value=that.rulesmesinfo.delivermode.options[i].name; //送货当前展示
                    that.rulesmesinfo.delivermode.code=that.rulesmesinfo.delivermode.options[i].code;  //送货当前code
                    that.rulesmesinfo.delivermode.operFlag=that.rulesmesinfo.delivermode.options[i].operFlag; //送货运能调用
                    that.rulesmesinfo.delivermode.installToDeliveryFlag=that.rulesmesinfo.delivermode.options[i].installToDeliveryFlag;// 是否安装能赋值运能 
                    that.rulesmesinfo.installationmode.options=that.rulesmesinfo.delivermode.options[i].canChoiceInstallMethodList?that.rulesmesinfo.delivermode.options[i].canChoiceInstallMethodList:[]
                    that.resetinstall(1);
                    that.rulesmesinfo.delivermode.installShowFlag=that.rulesmesinfo.delivermode.options[i].installShowFlag;//是否显示安装
                    //console.log(that.rulesmesinfo.delivermode.operFlag)
                    if( that.rulesmesinfo.delivermode.operFlag==0 || archive.deliveryDateFlag==0){//0送货日期不可选 1选日期不调接口 2选日期调接口
                    //alert(2)
                        that.rulesmesinfo.delivertime.disabled=true; //一次禁止选择时间
                    }else{
                        that.rulesmesinfo.delivertime.disabled=false;
                        that.rulesmesinfo.delivertime.dateTime=""; //送货时间重选
                    }
                    
                  that.rulesmesinfo.archive.deliveryInstallSyncFlag=0;
                  that.rulesmesinfo.archive.able="";
                    
                    if(that.rulesmesinfo.delivermode.installToDeliveryFlag==1 && that.rulesmesinfo.delivermode.installShowFlag!=0 && !that.rulesmesinfo.installationtime.disabled){ //如果售后带货安装提示
                        that.rulesmesinfo.delivermode.message="修改安装时间后自动生成送货时间";
                    }else{
                        that.rulesmesinfo.delivermode.message="";
                    }   
                }
            }

            that.$refs['rulesmesinfo'].validate();
        },
        resetinstall(s,isSelected){// 修改送货方式以及送货时间的处理
            let that=this;

            if(!that.rulesmesinfo.delivertime.disabled){ //时间禁止选择的时候不变
                that.rulesmesinfo.archive.deliverySegmentDescBegin="";//送货能重选
                that.rulesmesinfo.archive.deliverySegmentDescEnd="";
                that.rulesmesinfo.archive.deliverySegmentCode="";
                if(s){
                    that.rulesmesinfo.delivertime.dateTime=""; //送货时间重选

                }
                
            }
            
                that.rulesmesinfo.archive.deliveryInstallSyncFlag=0; //隐藏送按一体标识
                that.rulesmesinfo.installationmode.value="";
                that.rulesmesinfo.installationmode.code="";
                that.rulesmesinfo.notInstallReasonList.disabled=true;
                that.rulesmesinfo.installationtime.disabled=false;
                that.rulesmesinfo.notInstallReasonList.value="";
            

            if(!that.rulesmesinfo.installationtime.disabled){
                that.cancleInstall();
            }
            
                   

        },
        cancleInstall(able){ // 取消安装时间和安装能
            let that=this;
            if(able!=3){
                that.rulesmesinfo.installationtime.dateTime=""; //安装时间重选
                that.rulesmesinfo.archive.installSegmentDescBegin="";//安装能重选
                that.rulesmesinfo.archive.installSegmentDescEnd="";
                that.rulesmesinfo.archive.installSegmentCode="";  
                that.rulesmesinfo.archive.installSite="";
                that.rulesmesinfo.archive.installArea="";
                that.rulesmesinfo.archive.installCompanyCode=""; 
            }
                
        },
        initInstall(isSelected,code,archive){

            let that=this;

            for(let i=0; i<that.rulesmesinfo.installationmode.options.length;i++){

                if(that.rulesmesinfo.installationmode.options[i][isSelected]==code){
                
                    that.rulesmesinfo.installationmode.value=that.rulesmesinfo.installationmode.options[i].name; //安装当前展示
                    that.rulesmesinfo.installationmode.code=that.rulesmesinfo.installationmode.options[i].code;  //安装当前code
                    that.rulesmesinfo.installationmode.operFlag=that.rulesmesinfo.installationmode.options[i].operFlag; //安装运能调用
                    that.rulesmesinfo.installationmode.deliveryToInstallFlag=that.rulesmesinfo.installationmode.options[i].deliveryToInstallFlag;
                    //是否运能赋值安装能
                    if(that.rulesmesinfo.installationmode.operFlag==0 || archive.installDateFlag==0){

                        that.rulesmesinfo.installationtime.disabled=true; //一次重选安装时间

                    }else{

                        that.rulesmesinfo.installationtime.disabled=false;
                        that.cancleInstall(that.rulesmesinfo.archive.able);
                    }
                    
                    that.rulesmesinfo.notInstallReasonList.disabled=true; //不安装
                    that.rulesmesinfo.notInstallReasonList.value="";//不安装
                    
                }
            };


           that.songan(isSelected);

           // console.log(that.rulesmesinfo.installationmode.code);
           
            //不安装
            if(that.rulesmesinfo.installationmode.code==2){
            // alert(2)
                that.cancleInstall();
                that.rulesmesinfo.notInstallReasonList.disabled=false;
                that.rulesmesinfo.installationtime.disabled=that.initFlag(0);//禁止安装时间
                that.rulesmesinfo.delivermode.message="";
                that.initunInstall();

            }else{
                if(that.rulesmesinfo.delivertime.dateTime>0){ // 增加座装和挂装
                    that.addSeathanger();
                }
                that.rulesmesinfo.notInstallReasonList.disabled=true;
                
            }

                that.$refs['rulesmesinfo'].validate();

        },
        songan(isSelected){ //送按一体函数做处理
            let that=this;
            //送按同步展示  that.rulesmesinfo.archive.able==3  &&   that.rulesmesinfo.installationmode.code==1
            if(that.rulesmesinfo.archive.able==3  &&   that.rulesmesinfo.installationmode.code==1){
                that.rulesmesinfo.archive.deliveryInstallSyncFlag=1; //展示标识
                that.rulesmesinfo.archive.SyncFlagtip = 1;//记录送按一体状态
                //时间以及运能赋值安装能（时间段）赋值
                that.rulesmesinfo.installationtime.dateTime=that.rulesmesinfo.delivertime.dateTime;

                 that.rulesmesinfo.archive.installSegmentDescBegin=that.rulesmesinfo.archive.deliverySegmentDescBegin;//安装能重选
                that.rulesmesinfo.archive.installSegmentDescEnd=that.rulesmesinfo.archive.deliverySegmentDescEnd;
                that.rulesmesinfo.archive.installSegmentCode = that.rulesmesinfo.archive.installSegmentCodecur;
                that.rulesmesinfo.archive.installSite=that.rulesmesinfo.archive.installSitecur;
                that.rulesmesinfo.archive.installArea=that.rulesmesinfo.archive.installAreacur;
                that.rulesmesinfo.archive.installCompanyCode=that.rulesmesinfo.archive.installCompanyCodecur; 
               

            }else{
                 if(isSelected=='code'){
                  that.rulesmesinfo.archive.deliveryInstallSyncFlag=0;
                  that.rulesmesinfo.installationtime.dateTime= "";
                  that.rulesmesinfo.archive.installSegmentDescBegin="";
                  that.rulesmesinfo.archive.installSegmentDescEnd="";
                  that.rulesmesinfo.archive.installSegmentCode="";
                  that.rulesmesinfo.archive.installSite="";
                  that.rulesmesinfo.archive.installArea="";
                  that.rulesmesinfo.archive.installCompanyCode="";

                            
                }
              
            }
        },
        initunInstall(){//不安装渲染
            let  that=this;

            for(let i=0; i<that.rulesmesinfo.notInstallReasonList.options.length;i++){

                if(that.rulesmesinfo.notInstallReasonList.options[i].isSelected==1){
                    that.rulesmesinfo.notInstallReasonList.options[i].isSelected=0;
                        that.rulesmesinfo.notInstallReasonList.value=that.rulesmesinfo.notInstallReasonList.options[i].name; //安装当前展示
                        that.rulesmesinfo.notInstallReasonList.code=that.rulesmesinfo.notInstallReasonList.options[i].code;  //安装当前code
                
                }

            }
        },
        delivertimeChang(s){  //送货时间选择
            let  that=this;
            if(that.rulesmesinfo.installationtime.dateTime*1 &&  that.rulesmesinfo.delivertime.dateTime*1>=that.rulesmesinfo.installationtime.dateTime*1){
                that.rulesmesinfo.installationtime.dateTime="";
            };
            that.resetinstall(); //重新选择安装相关信息
            that.addSeathanger();//增加座装和挂装
            if(that.rulesmesinfo.delivermode.operFlag==2){
            // 这段代码需要在选择完对应的时间之后
            if(!that.cityobj.aeracode4.code){
                    that.$message.error('请选择四级区域！');
                    return false;
                }
            let superability={ 
                "val":{
                    "storeCode":that.rulesmesinfo.archive.storeCode, //门店代码
                    "saleOrgCode":that.rulesmesinfo.archive.saleOrgCode, //销售组织代码
                    "commerceItemId":that.itemData[0].commerceItemId, //商品唯一号
                    "skuNo":that.itemData[0].skuNo,//商品编码
                    "categoryCode":that.itemData[0].categoryCode,    // 线下四级品类代码
                    "brandCode":that.itemData[0].brandCode, //brandCode
                    "deliveryMethod":that.rulesmesinfo.delivermode.code,
                    "storageCode":that.itemData[0].storageCode, //仓库代码
                    "deliveryCount":that.itemData[0].quantity,//送货数量
                    "deliveryDate":that.rulesmesinfo.delivertime.dateTime*1,//送货日期
                    "townCode":that.cityobj.aeracode4.code,    // 四级区域码  
                    "isBD":1
                    },
                "type":"delivery"       // 必填 送货能（运能）delivery  安装能 installAbility
            }
                that.superability=superability;  //重新赋值 触发组件的watch
            }
        },
        installationChang(s){//安装时间选择
            let  that=this;
            that.rulesmesinfo.archive.installSegmentDescBegin="";//安装能重选
            that.rulesmesinfo.archive.installSegmentDescEnd="";
            that.rulesmesinfo.archive.installSegmentCode="";   
            //console.log(s*1)
            //console.log(this.rulesmesinfo.delivertime.dateTime*1)
            if(s*1<that.rulesmesinfo.delivertime.dateTime*1 && that.rulesmesinfo.delivermode.installToDeliveryFlag!=1){
                that.$message.error('请重新选择,时间必须大于送货时间');
                that.rulesmesinfo.installationtime.dateTime=""
            }else{
                if(that.rulesmesinfo.installationmode.operFlag==2){
                    //console.log(that.rulesmesinfo.archive.deliverySegmentDescBegin)
                    //console.log(that.rulesmesinfo.archive.deliverySegmentDescEnd)
                    //console.log(that.rulesmesinfo.installationtime.dateTime)
                //console.log(that.cityobj.aeracode4.code)
                if(!that.cityobj.aeracode4.code){
                    that.$message.error('请选择四级区域！');
                    return false;
                }
                // 这段代码需要在选择完对应的时间之后
                let superability2={ 
                    "val":{
                    "deliveryMethod":that.rulesmesinfo.delivermode.code==3? 3 : "",//售后带货安装的传3，不是的不传 暂时写死
                    "saleOrgCode":that.rulesmesinfo.archive.saleOrgCode, //销售组织代码
                    "commerceItemId":that.itemData[0].commerceItemId, //商品唯一号
                    "installCount":that.itemData[0].quantity,//安装数量
                    "skuNo":that.itemData[0].skuNo,//商品编码
                    "installDate":that.rulesmesinfo.installationtime.dateTime*1,//安装日期
                    "categoryCode":that.itemData[0].categoryCode,    // 线下四级品类代码
                    "brandCode":that.itemData[0].brandCode, //brandCode
                    "townCode":that.cityobj.aeracode4.code,
                    "queryType":that.rulesmesinfo.archive.installQueryType,//0：首次查询  1：修改查询    当修改建档查询返回的安装方式为安装时，传1，其余时候传0
                    "isBD":1
                    },
                    "type":"installAbility"       // 必填 送货能（运能）delivery  安装能 installAbility
                  
                }
                that.superability=superability2;  //重新赋值 触发组件的watch
            }

            if(that.rulesmesinfo.archive.SyncFlagtip==1){ //送按一体选择时间改变
                that.rulesmesinfo.archive.deliveryInstallSyncFlag=0;
            }

            if(that.rulesmesinfo.delivermode.installToDeliveryFlag==1){// 如果是售后带货安装的话  安装时间要反写到配送时间
                that.rulesmesinfo.delivertime.dateTime=that.rulesmesinfo.installationtime.dateTime;
            }

            }
        },
        addSeathanger(){
            let  that=this;
            if(that.rulesmesinfo.delivermode.code == 2 && that.rulesmesinfo.installationmode.deliveryToInstallFlag == 1){
               that.rulesmesinfo.installationtime.dateTime= that.rulesmesinfo.delivertime.dateTime;
            }
        }
      
    }
}
</script>

