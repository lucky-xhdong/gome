var app = getApp();
var goHeader = app.goHeader;
var websiteUrl = ''; //不同站点请求的接口地址，有一个字段不一样，用以拼接地址
Page({
    data: {
        theData:{
            // need:"",          //是否需要发票
            // typeCode:"",         //密码
            // headCode :"",           //个人0；单位1
            // head:"",            //开头
            // details:"",         //发票内容明细
            // elecMobile :""         //手机号码
        },
        focus:"",
        pTypeLabels:"",
        invoices:{},
        selectedInvoice:{},//选中的
        headTypes:{},//选中的发票抬头
        invoiceContent:{},//选中的发票内容
        information:{},
        invoiceNeed:[
            // {   
            //     isneed:true,
            //     name: '需要发票',
            //     isChecked: true
            // },
            // {
            //     isneed:false,
            //     name: '暂不需要发票',
            //     isChecked: false
            // }
        ],
        // lyIvoiceContent:'由店铺决定，发票由店铺开具并寄出',
       
        // statement:'声明：建议您发票的内容开为产品明细，否则您将无法正常享受厂商或国美的正常质保。店铺发票由店铺决定，并由店铺开具和寄出。',
        statementDz:'电子发票可作为用户报销、维权、保修的有效凭据。如您本次购买的商品暂未实现电子发票开具，我们将自助更换为纸质普通发票。',
        invoicesType:"",
        loadingInit: true//初始化的loding
    },
    
  
    _ourHost: app.ourHostCart,
    _scn: '',

    onLoad: function (options) {
        var that = this;
        websiteUrl = app.getCartWebsite(this._ourHost);
        that.init();
    },


   /**
     * @description 初事化数据<br />
     * @method init
     * @since 2017-01-20
     */
    init: function() {
        var that = this;
       that._scn = app.getScn();
        var para = {
            url: websiteUrl,
            scn: that._scn
        };
        //2.调用初始化ajax，获取数据，执行回调函数
       app.initConfirmOrder(para,that._resetConfirmOrderData);
    },

    /**
     * @description 初事化<br />
     * @method _resetConfirmOrderData
     * @param {Object} opt 参数集 (必传)，后台传递确认订单页的数据
     * @since 2017-01-20
     */
    _resetConfirmOrderData: function(opt) {
        var that = this;
        that.setData({
            information: opt,
            // information:that.data.information,
            loadingInit: false
        })
         that._invoice();
    },
   
    
    /**
     * @description 发票信息的展示和逻辑处理<br /
     * @method _invoice
     */
    _invoice:function() {
        //参考购物车代码cart-node\cart\js\template\shopping\invoice的invoice_main.tpl和invoice_modify.tpl
        //1.配置参数
        var that = this,
            theData={},
            ivh = that.data.information.data.invoices,//获取发票信息
            invoiceNeedType = ivh.invoiceNeedType,
            pType = ivh.pType,
            invoices = ivh.invoices,
            invoiceNeed=[],
            invoicesType=[],
            selectedInvoice={},
            isInvoiceNeed=true, //是否需要发票
            headTypes=[],//选中发票抬头
            invoiceContent=[],//发票的内容
            
             pTypeLabels = {"G":"温馨提示：建议发票内容选择明细，以保证您可以享受厂商或国美提供的质保服务。",
            "GO":"温馨提示：建议发票内容选择明细，以保证您可以享受厂商或国美提供的质保服务。 非自营商品发票的开具和邮寄等情况，由店铺商家自行决定。如有任何疑问，可联系商家确认。",
            "O":"温馨提示：非自营商品发票的开具和邮寄等情况，由店铺商家自行决定。如有任何疑问，可联系商家确认。"};
            // pTypeLabels = {"G":"温馨提示：建议发票内容选择明细，以保证您可以享受厂商或国美提供的质保服务。",
            // "GO":"温馨提示：建议发票内容选择明细，以保证您可以享受厂商或国美提供的质保服务。 非自营商品发票的开具和邮寄等情况，由店铺商家自行决定。如有任何疑问，可联系商家确认。"};
            theData.need = true; 
            theData.scn = that._scn;   
        if(invoiceNeedType=="N"){
            theData.need = isInvoiceNeed=false;
            invoiceNeed[0]={
                isneed:true,
                name: '需要发票',
                isChecked: false
            }
            invoiceNeed[1]={
                isneed:false,
                name: '暂不需要发票',
                isChecked: true
            }

        }else if(invoiceNeedType=="Y"){
            invoiceNeed[0]={
                isneed:true,
                name: '需要发票',
                isChecked: true
            }
            invoiceNeed[1]={
                isneed:false,
                name: '暂不需要发票',
                isChecked: false
            }

        }else if(invoiceNeedType=="YD"){
            invoiceNeed[0]={
                isneed:true,
                name: '需要发票',
                isChecked: true
            }
        }

        for(var i=0;i<invoices.length;i++){
            //0纸质发票 1电子发票
            if(invoices[i].invoiceType.code!="2"){
                invoicesType[i] = invoices[i].invoiceType;
                if(invoicesType[i].selected){
                    selectedInvoice=invoices[i];
                    headTypes = invoices[i].headTypes;
                    invoiceContent = invoices[i].invoiceContentTypes;
                    theData.typeCode = invoices[i].invoiceType.code;
                    theData.elecMobile = selectedInvoice.mobilePhone 
                } 
            } 
        }

        for(var i=0;i<headTypes.length;i++){
            if(headTypes[i].selected){
                theData.headCode = headTypes[i].code;
                theData.head = headTypes[i].content;
            }
        }
        for(var i=0;i<invoiceContent.length;i++){
            if(invoiceContent[i].selected){
                theData.details = invoiceContent[i].code;
            }
        }
     

        // console.log('pTypeLabels:'+pTypeLabels[pType]);


        that.setData({
            theData:theData,
            invoices:invoices,
            invoicesType:invoicesType,//发票类型：纸质发票，电子发票。 增值税发票暂时不做
            invoiceNeed:invoiceNeed, //是否需要发票
            isInvoiceNeed:isInvoiceNeed,//是否需要发票
            pTypeLabels:pTypeLabels[pType],
            selectedInvoice:selectedInvoice,
            headTypes:headTypes,
            invoiceContent:invoiceContent

        }) 
    },

    /**
     * @description 获取抬头内容 bindinput
     * @method ttContent
     */
    ttContent:function(e){
        var that = this;
        var theData = that.data.theData;
        var arr = that.data.headTypes;
        var value = e.detail.value;
        var code = e.currentTarget.dataset.index;
        arr[code].content = value;
        theData.head = value;
        that.setData({
            theData: theData,
            headTypes: arr
        })
    },
    /**
     * @description 获取电话号码 bindinput
     */
     phoneContent:function(e){
        var that = this;
        var theData = that.data.theData;
        var value = e.detail.value;
        theData.elecMobile = value;
        that.setData({
            theData: theData
        })
    },
    /**
     * @description 电话号码获取焦点清空
     */
    phonefocus:function(){
        var selectedInvoice = this.data.selectedInvoice,
            theData = this.data.theData;
        selectedInvoice.mobilePhone = '';
        theData.elecMobile =''
        this.setData({
            focus:true,
            theData:theData,
            selectedInvoice: selectedInvoice
        })
    },


    /**
    * @description 是否需要发票
    * @method bindInvoiceIsNeed
    * @since 2017-01-24
    */
    bindInvoiceIsNeed: function(e) {
        var that = this,
            index = Number(e.detail.value),
            theData = {},
            arr = that.data.invoiceNeed,
            invoicesType = that.data.invoicesType,
            selectedInvoice = that.data.selectedInvoice,
            headTypes = that.data.headTypes,
            invoiceContent = that.data.invoiceContent,
            isneed = that.data.isInvoiceNeed;
        for(var i=0; i<arr.length; i++) {
            if(i == index) {
                arr[i].isChecked = true;
                arr[i].isneed? isneed=true: isneed=false
            }else {
                arr[i].isChecked = false;
            }
        }
        theData.need = isneed;
        if (isneed) {
            for(var i = 0;i<invoicesType.length;i++){
                if(invoicesType[i].selected){
                    theData.typeCode = invoicesType[i].code;
                } 
            }
            for(var i = 0;i<headTypes.length;i++){
                if(headTypes[i].selected){
                    theData.headCode = headTypes[i].code;
                    theData.head = headTypes[i].content;
                } 
            }
            if(theData.typeCode==1){
               theData.elecMobile = selectedInvoice.mobilePhone? selectedInvoice.mobilePhone:'';
            }
            // theData.details = invoiceContent?invoiceContent.code:'';
            for(var i=0;i<invoiceContent.length;i++){
                if(invoiceContent[i].selected){
                    theData.details = invoiceContent[i].code;
                }
            }
            theData.scn = that._scn;

        }
        that.setData({
            invoiceNeed: arr,
            isInvoiceNeed:isneed,
            theData:theData
        })


    }, 

    /**
     * @description 发票类型改变时触发  （纸质发票，电子发票，增值税发票暂时不做）
     */
    bindInvoiceType: function(e) {
        var that = this,
            theData = that.data.theData,
            index = Number(e.detail.value),
            invoices = that.data.invoices,
            arr=that.data.invoicesType,
            selectedInvoice=that.data.selectedInvoice,
            headTypes='',
            invoiceContent='',
            code='';
        for(var i=0; i<arr.length; i++) {
            if(i == index) {
                arr[i].selected = true;
                code = arr[i].code;
                theData.typeCode = code;
            }else {
                arr[i].selected = false;
            }
        }
        // if (code == 1) {//电子发票
        //     theData.elecMobile=selectedInvoice.mobilePhone
        // } else{
        //     //if(theData.elecMobile) theData.elecMobile=''
        // }
        for(var i=0;i<invoices.length;i++){
            if(invoices[i].invoiceType.code==code){
                selectedInvoice=invoices[i];
                headTypes=invoices[i].headTypes;//选中的发票抬头
                invoiceContent=invoices[i].invoiceContentTypes;//选中的发票内容
                theData.elecMobile = invoices[i].mobilePhone;//手机号
            }
        }

        that.setData({
            theData:theData,
            invoicesType: arr,
            selectedInvoice:selectedInvoice,
            headTypes:headTypes,
            invoiceContent:invoiceContent
        })
        
    },

    /**
     * @description 发票抬头改变时触发 
     */
    bindInvoiceTt: function(e) {
        var that = this;
        var theData = that.data.theData;
        var index = Number(e.detail.value);
        var arr = that.data.headTypes;
        for(var i=0; i<arr.length; i++) {
            if(i == index) {
                arr[i].selected = true;
                theData.headCode = arr[i].code;
                theData.head = arr[i].content;
            }else {
                arr[i].selected = false;
            }
        }
        that.setData({
            theData:theData,
            headTypes: arr
        })
    },

    /**
     * @description 发票内容改变时触发 
     */
    bindInvoiceContent: function(e) {
        var that = this;
        var theData = that.data.theData;
        var index = Number(e.detail.value);
        var arr = that.data.invoiceContent;
        for(var i=0; i<arr.length; i++) {
            if(i == index) {
                arr[i].selected = true;
                theData.details = arr[i].code;
            }else {
                arr[i].selected = false;
            }
        }
        that.setData({
            theData:theData,
            invoiceContent: arr
        })
    },

    isBlank:function(str){
        if(!str)return true;
        return false;
    },
    NotZhSign:function(str){
        return !(/^[^（）]+$/.test(str));
    },
    notSpecialChat:function(str){
        return !(/^[\u4E00-\u9FFF0-9a-zA-Z\s]+$/.test(str));
    },
    notRightFormat:function (str){
        return !(/^[\u4E00-\u9FFF|\u300a|\u300b|0-9|a-z|A-Z|\(|\)|（|）|\-|【|】|{|}|\[|\]|,|.|，|。|\s]+$/.test(str));
    },

    /**
     * @description 点击确认时校验必要字段，并提交
     */
    bindConfirm: function(e) {
        var re =true,
            that = this,
            theData = that.data.theData,
            need = theData.need,
            headCode = theData.headCode, //发票抬头 0个人，1单位
            head = theData.head, //抬头内容
            typeCode = theData.typeCode,//发票类型 1电子发票 0纸质发票 电子发票显示手机号，纸质不显示
            elecMobile = theData.elecMobile;//手机号码
            // re = that.valida(theData.elecMobile);
        //验证抬头信息
        if(need==false){
            var noNeed ={}
            noNeed.need = false;
            noNeed.scn = that._scn
            that.setData({
                theData:noNeed
            })
        } else{
            if(headCode==0){
                if(that.isBlank(head)){
                    wx.showToast({
                      title: "请输入发票抬头，如：个人",
                      icon: 'loading',
                      duration: 2000
                    })
                    return false;
                } else if(that.NotZhSign(head)||that.notSpecialChat(head)){
                    wx.showToast({
                      title: "输入格式不正确",
                      icon: 'loading',
                      duration: 2000
                    })
                    return false;
                }
            } else if(headCode==1){
                if(that.isBlank(head)){
                    wx.showToast({
                      title: "请输入单位名称",
                      icon: 'loading',
                      duration: 2000
                    })
                    return false;
                } else if(that.notRightFormat(head)){
                    wx.showToast({
                      title: "输入格式不正确",
                      icon: 'loading',
                      duration: 2000
                    })
                    return false;
                }
            } 
            //验证手机号
            if(typeCode==1){
                var vali=/^1[3456789]\d{1}\*{4}\d{4}$/.test(elecMobile);
                var vali1 = /^1[3456789]\d{9}$/.test(elecMobile);
                if(!elecMobile){
                    wx.showToast({
                      title: '请输入手机号码',
                      icon: 'loading',
                      duration: 2000
                    })
                    return false;
                } else if(!(vali||vali1)){
                    wx.showToast({
                      title: '请输入正确手机号码',
                      icon: 'loading',
                      duration: 2000
                    })
                    return false;
                }
            }
            
        }

        wx.request({
            url: websiteUrl + '/api/invoice/saveInvoice',
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader,
                'Cookie':'SCN='+that._scn
            },
            data: that.data.theData,
            method:'get',
            success: function(res) {
                if (res.data.success) {
                    wx.navigateBack();
                   // wx.redirectTo({url:'../confirmOrder/confirmOrder'}); 
                } else{
                    wx.showToast({
                      title: res.data.errMsg||'保存出错',
                      icon: 'loading',
                      duration: 2000
                    })
                }
            },
            fail:function(data){
                wx.showToast({
                  title: '请求失败',
                  icon: 'loading',
                  duration: 2000
                })
            }
        })
        
    }
})


