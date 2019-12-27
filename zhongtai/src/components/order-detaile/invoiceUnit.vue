<template>
<div class="invoice">
    <el-form :model="invoiceInfo" :rules="rules" ref="invoiceInfo" label-width="100px" >
        <el-form-item label="抬头内容：" prop="invoiceHead" class="mt15">
            <el-input v-model="invoiceInfo.invoiceHead" placeholder="请输入单位名称" style="width:400px;" @blur="getData" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="单位税号："  prop="taxpayerNo" class="mt15">
            <el-input v-model="invoiceInfo.taxpayerNo" placeholder="请输入单位税号" style="width:400px;" @blur="getData"></el-input>
        </el-form-item>
        <el-form-item label="收票手机：" prop="elecMobile" class="mt15">
            <el-input v-model="invoiceInfo.elecMobile" placeholder="请输入手机号码" style="width:400px;" @blur="getData"></el-input>
        </el-form-item>
        <el-form-item label="收票邮箱：" prop="elecMail" class="mt15">
            <el-input v-model="invoiceInfo.elecMail" placeholder="用于接受电子发票邮件及延保协议" style="width:400px;" @blur="getData"></el-input>
        </el-form-item>
    </el-form>
</div>
</template>
<script>
export default {
    props: {
        invoiceInfo: {},
        originaltel:'',
        invoiceInfo2: {},
    },
    data() {
        //检查抬头内容
        var checkHead = (rule, value, callback) => {
            var that = this;
            //var NotZhSign = /^[^（）]+$/;
            //var notSpecialChat = /^[\u4E00-\u9FFF0-9a-zA-Z\s]+$/;
            if (value == "" || value ==null) {
                if(that.invoicePersoneloriginal.invoiceHead=='' || that.invoicePersoneloriginal.invoiceHead==undefined){//如果有默认数据取默认数据
               
                    that.invoicePersonel.isHeadNull = false;
                    return callback(new Error("请输入单位名称"));
                }else{
                    that.invoicePersonel.isHeadNull = true;
                    that.invoiceInfo.invoiceHead =that.invoicePersoneloriginal.invoiceHead;
                }       
            } else if (value == "个人") {
                that.invoicePersonel.isHeadNull = false;
                return callback(new Error("发票抬头不能是个人"));
            } else {
                if (value.indexOf(" ")!=-1) {
                    that.invoicePersonel.isHeadNull = false;
                    return callback(new Error("请输入正确的抬头内容"));
                } else {
                    that.invoicePersonel.isHeadNull = true;
                    return callback();
                }
            }
        };
        var checkHead2 = (rule, value, callback) => {
            var that = this;
            if (value != "" && value !=null) {
                if (value.indexOf(" ")!=-1) {
                    callback(new Error("请输入正确的抬头内容"));
                    that.invoicePersonel.isHeadNull = false;
                } else {
                    that.invoicePersonel.isHeadNull = true;
                    callback();
                }
            }
        };
        //检查单位税号
        var checkTaxpayerNo = (rule, value, callback) => {
            var that = this;
            //非数字大写英文字母
            var notUpenNum = /^[0-9|A-Z]+$/;
            var checkTax = /^[A-Z0-9]{15}$|^[A-Z0-9]{18}$|^[A-Z0-9]{20}$/; //验证税号* 15或者18或者20位大写字母、数字组成
            if (value == "" || value ==null) {
                if(that.invoicePersoneloriginal.taxpayerNo=='' || that.invoicePersoneloriginal.taxpayerNo==undefined){//如果有默认数据取默认数据
                    that.invoicePersonel.isTaxpayerNoNull = false;
                    callback(new Error("请输入单位税号"));
                }else{
                    that.invoicePersonel.isTaxpayerNoNull = true;
                    that.invoiceInfo.taxpayerNo =that.invoicePersoneloriginal.taxpayerNo;
                }           
            } else {
                if (!notUpenNum.test(value)) {
                    that.invoicePersonel.isTaxpayerNoNull = false;
                    callback(new Error("单位税号为数字和大写英文字母"));
                } else if (!checkTax.test(value)) {
                    that.invoicePersonel.isTaxpayerNoNull = false;
                    callback(new Error("单位税号为15位、18位、20位数字和大写英文字母"));
                } else {
                    that.invoicePersonel.isTaxpayerNoNull = true;
                    callback();
                }
            }
        };
        var checkTaxpayerNo2 = (rule, value, callback) => {
            var that = this;
            if (value != "" && value !=null) {
                if (value.indexOf(" ")!=-1) {
                    callback(new Error("单位税号为数字和大写英文字母"));
                    that.invoicePersonel.isTaxpayerNoNull = false;
                } else {
                    that.invoicePersonel.isTaxpayerNoNull = true;
                    callback();
                }
            }
        };
        //检查手机号
        var checkmMobile = (rule, value, callback) => {
            var that = this;
            if (value == "" || value ==null) {
                if(that.invoicePersoneloriginal.elecMobile=='' || that.invoicePersoneloriginal.elecMobile==undefined){//如果有默认数据取默认数据
                    that.invoicePersonel.isMobileNull = false;
                    callback(new Error("请输入手机号码"));
                }else{
                    that.invoicePersonel.isMobileNull = true;
                    that.invoiceInfo.elecMobile =that.invoicePersoneloriginal.elecMobile;
                }        
            }else if(value != that.originaltel){//手机号码没改
                var reg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                if (!reg.test(value)) {
                    that.invoicePersonel.isMobileNull = false;
                    callback(new Error("请输入正确的手机号码"));
                } else {
                    that.invoicePersonel.isMobileNull = true;
                    callback();
                }
            }else if(value == that.originaltel){
                    that.invoicePersonel.isMobileNull = true;
                    callback();
            }
        };
        var validateNumber = (rule, value, callback) => {
            var that = this;
            var orderRegex = /^[0-9]+$/;
            if(value!='' && value != that.originaltel && value !=null){
                if (!orderRegex.test(value) || value.indexOf(" ")!=-1) {
                    callback(new Error("填写信息错误，请输入数字"));
                    that.invoicePersonel.isMobileNull = false;
                } else {
                    callback();
                    that.invoicePersonel.isMobileNull = true;
                }
            }else if(value == that.originaltel){
                    that.invoicePersonel.isMobileNull = true;
                    callback();
            }
        };
        //检查邮箱
        var checkEmail = (rule, value, callback) => {
            var that = this;
            if(value=='' || value ==null){
                if(that.invoicePersoneloriginal.elecMail==''){//如果有默认数据取默认数据
                    that.invoicePersonel.isEmailNull = false;
                    callback(new Error("请输入正确的邮箱地址"));
                }else{
                    that.invoicePersonel.isEmailNull = true;
                    that.invoiceInfo.elecMail =that.invoicePersoneloriginal.elecMail;
                }  
            }else if (value != "" && value !=null){
            var reg = /^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+$|^[a-zA-Z0-9_]+[a-zA-Z0-9_\-\.]+[a-zA-Z0-9_]+@[\w-]+\.[\w-]+\.[\w-]+$/;
            if (!reg.test(value)) {
                that.invoicePersonel.isEmailNull = false;
                callback(new Error("请输入正确的邮箱地址"));
            } else {
                that.invoicePersonel.isEmailNull = true;
                callback();
            }
            }
        };
        var checkEmail2 = (rule, value, callback) => {
            var that = this;
            if (value != "" && value !=null) {
                if (value.indexOf(" ")!=-1) {
                    callback(new Error("请输入正确的邮箱地址"));
                    that.invoicePersonel.isEmailNull = false;
                } else {
                    that.invoicePersonel.isEmailNull = true;
                    callback();
                }
            }
        };
        return {
            rules: {
                invoiceHead: [
                    { required: true, validator: checkHead, trigger: "blur" },
                    { validator: checkHead2, trigger: "change" }
                ],
                taxpayerNo: [
                    { required: true, validator: checkTaxpayerNo, trigger: "blur" },
                    { validator: checkTaxpayerNo2, trigger: "change" }
                ],
                elecMobile: [
                    { required: true, validator: checkmMobile, trigger: "blur" },
                    { validator: validateNumber, trigger: "change" }
                ],
                elecMail: [
                    { validator: checkEmail, trigger: "blur" },
                    { validator: checkEmail2, trigger: "change" }
                ]
            },
            //invoiceInfo: JSON.parse(JSON.stringify(this.invoiceInfoP)),
            //invoiceInfo: this.invoiceInfoP,
            invoicePersonel: {
                invoice: {},
                headType: "1",
                isHeadNull: true,
                isTaxpayerNoNull: true,
                isMobileNull: true,
                isEmailNull: true
            },
           invoicePersoneloriginal:JSON.parse(JSON.stringify(this.invoiceInfo2)),
        };
    },
    methods: {
        getData() {
            this.invoicePersonel.invoice = this.invoiceInfo;
            this.$emit("getInvoice", this.invoicePersonel);
        },
        childMethod() {
            this.$refs['invoiceInfo'].resetFields();
            this.invoicePersonel.isHeadNull= true;
            this.invoicePersonel.isTaxpayerNoNull= true;
            this.invoicePersonel.isMobileNull= true;
            this.invoicePersonel.isEmailNull= true;
        }
    },
    watch:{
        invoiceInfo2:{
            handler:function(){
             this.invoicePersoneloriginal=JSON.parse(JSON.stringify(this.invoiceInfo2))
            },
            deep: true
        },
        invoicePersonel:{
            handler:function(){
                this.getData()
            }
        }
    },
};
</script>

