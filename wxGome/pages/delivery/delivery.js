var app = getApp();
var goHeader = app.goHeader;
var websiteUrl = ''; //不同站点请求的接口地址，有一个字段不一样，用以拼接地址
Page({
    data: {
        theData:{},//点确认发送的数据U
        initData:{},//出事数据，包括shopid,shippingGroupId
        shopsLength:1,//判断是否为多个
        day:{},//单个商品json
        jsd:{},
        xsd:{},
        express:{},
        timeMask: false,
        mask: false,
        information:{},
        deliveryWay: {},
        index: 2,
        loadingInit: true,//初始化的loding
        comments:''
    },

    _ourHost: app.ourHostCart,
    _scn: '',

    // _scn: '',
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
            //information:that.data.information,
            loadingInit: false
        });

        that.initDeal();//设置数据处理页面
    },

    /**
     * @description 初事化数据后的处理页面结构<br />
     * @method init
     * @since 2017-01-20
     */
    initDeal: function() {
        var that = this;
        that._goodOrDeliveryList();
    },

    /**
     * @description 配送方式信息的展示和逻辑处理<br />
     * @method _goodOrDeliveryList
     * @since 2017-02-08
     * @author yeyang
     */
    _goodOrDeliveryList: function() {

        //参考购物车代码cart-node\cart\js\template\shopping\listOfItem的listOfItem_method.tpl
        //1.赋值
        var that = this,
            shopsAll = that.data.information.data.shops;
        if(shopsAll.length == 0){
            //没有商品
        }else if(shopsAll.length == 1 && shopsAll[0].groups.length == 1 && shopsAll[0].groups[0].commerceItemsGroup.length == 1){//如果length为1的话说明只有一件产品
            that.setData({
                shopsLength:1
            });

            var shops = shopsAll[0],//获取信息
                shopId = shops.shopId,
                shippingGroupId = shops.shippingGroupId,
                shippinginfo = shops.shippinginfo;//配送方式信息
            that._deliveryMethod(shippinginfo,{shopId:shopId,shippingGroupId:shippingGroupId});
            that._shopInfo(shops);

        }else{//多件产品 -> 提交购物车（多件商品）
            that.setData({
                shopsLength:2
            });
            wx.setNavigationBarTitle({
                title: '配送方式'
            });
            var information = that.data.information;
            var num = 0;
            var numTotalArr = [];
            var numTotal = 0;
            var groupArr =[];
            for(var i=0 ;i<shopsAll.length; i++){

                var shopId = shopsAll[i].shopId;
                var shopsItem = information.data.shops;

                if(shopId == "GOME"){
                    shopsItem[i].shopMName = "国美自营";
                    for(var j = 0; j<shopsAll[i].groups.length; j++){
                        shopsAll[i].groups[j].shopMName = "国美自营";
                    }
                }else{
                    shopsItem[i].shopMName = shopsAll[i].shopName;
                    for(var j = 0; j<shopsAll[i].groups.length; j++){
                        shopsAll[i].groups[j].shopMName = shopsAll[i].shopName;
                    }
                }

                var shippinginfo = shopsItem[i].shippinginfo;
                for(var j =0; j<shippinginfo.length; j++){
                    for(var k =0; k<shippinginfo[j].express.length; k++){
                        var expressCode = shopsAll[i].shippinginfo[j].express[k].code;
                        if(expressCode == "Gome Express" && that.isbrand(shopId)){
                            shippinginfo[j].express[k].codeName = "普通快递";
                        }else if(expressCode == "Store Picking Up"){
                            shippinginfo[j].express[k].codeName = "门店自提";
                        }else if(expressCode == "EMS"){
                            shippinginfo[j].express[k].codeName = "EMS快递";
                        }else if(expressCode == "Express Picking Up"){
                            shippinginfo[j].express[k].codeName = "配送自提";
                        }else if(expressCode == "Express"){
                            shippinginfo[j].express[k].codeName = "普通快递";
                        }else{
                            shippinginfo[j].express[k].codeName = "国美快递";
                        }

                        if(shopsItem[i].shippinginfo[j].express[k].shippingFee == 0){
                            shippinginfo[j].express[k].shipPrice="免运费";
                        } else{
                            shippinginfo[j].express[k].shipPrice ='¥'+that.formatAmount(information.data.shops[i].shippinginfo[0].express[0].shippingFee);
                        }
                    }
                }
                //将shippinginfo中部分信息复制到groups中一份 便于循环
                num = 0;//初始化num
                numTotalArr = [];//初始化
                numTotal = 0;
                groupArr =[];
                for(var j =0; j<shopsItem[i].groups.length; j++){
                    shopsItem[i].groups[j].shippinginfo = shopsItem[i].shippinginfo;

                    var shippinginfo = shopsItem[i].groups[j].shippinginfo;

                    //商品种类
                    var commerceItemsGroupLength = shopsItem[i].groups[j].commerceItemsGroup.length;
                    num += commerceItemsGroupLength;

                    var commerceItemsGroup = shopsItem[i].groups[j].commerceItemsGroup;
                    for(var l =0; l<commerceItemsGroup.length; l++){
                        numTotalArr.push(commerceItemsGroup[l].quantity);
                        groupArr.push(commerceItemsGroup[l]);
                    }
                    numTotal = 0;//初始化
                    for(var r =0; r<numTotalArr.length; r++){
                        numTotal += numTotalArr[r]
                    }
                    //console.log(numTotal)
                    //console.log(numTotalArr)

                    shopsItem[i].num = num;
                    shopsItem[i].numTotal = numTotal;
                    shopsItem[i].groupArr = groupArr;

                    for(var k =0; k<shippinginfo.length; k++){
                        if(shippinginfo[k].times[0].code == "DAY"){
                            for(var h =0; h<shippinginfo[k].times[0].items.length; h++){
                                if(shippinginfo[k].times[0].items[h].selected == true && shippinginfo[k].times[0].items[h].code == "ALL"){
                                    shippinginfo[k].timeSelected = 0;
                                }else if(shippinginfo[k].times[0].items[h].selected == true && shippinginfo[k].times[0].items[h].code == "WEEKDAY"){
                                    shippinginfo[k].timeSelected = 1;
                                }else{
                                    shippinginfo[k].timeSelected = 2;
                                }
                            }
                            shippinginfo[k].dayShow = 0;
                        }else if(shippinginfo[k].times[0].code == "JSD"){
                            shippinginfo[k].dayShow = 1;
                        }else{
                            shippinginfo[k].dayShow = 2;
                            for(var h =0 ; h<shippinginfo[k].times[1].concrete.length; h++){
                                if(shippinginfo[k].times[1].concrete[h].items[0].selected == true && shippinginfo[k].times[1].concrete[h].items[0].available == true){
                                    shippinginfo[k].startTime = shippinginfo[k].times[1].concrete[h].items[0].startTime;
                                    shippinginfo[k].endTime = shippinginfo[k].times[1].concrete[h].items[0].endTime;
                                    shippinginfo[k].yd = shippinginfo[k].times[1].concrete[h].yd;
                                    shippinginfo[k].label = shippinginfo[k].times[1].concrete[h].label;
                                    shippinginfo[k].dateTime = app.formatmmdd(shippinginfo[k].yd) + " " +shippinginfo[k].label + " " + app.formathhmm(shippinginfo[k].startTime) + '-' + app.formathhmm(shippinginfo[k].endTime);
                                }
                            }
                            shippinginfo[k].timeSelected = 3;
                        }
                    }
                }
            }
            this.setData({
                information: information
            });
        }
    },
    //comments信息等
    _shopInfo:function(shops){
        var info = {};
        var comments = shops.comments;
        if (comments == null || comments == 'null'){
            comments='';
        }
        if(shops.shopId == "GOME"){
            info.name = "国美自营";
        } else{
            info.name = shops.shopName;
        }
        info.shopId = shops.shopId;
        info.num = shops.groups[0].commerceItemsGroup[0].quantity;
        info.itemImageURL = shops.groups[0].commerceItemsGroup[0].itemImageURL;
        this.setData({
            deliveryWay: info,
            comments:comments
        })
    },

    /**
     * @description 备注
     */
    //3期备注接口缺省 不做了
    bindKeyInput:function(e){
        var comments = e.detail.value;
        this.setData({
            comments:comments
        })
    },
    /**
     * @description 格式化价格
     */
    formatAmount: function(amount){
        if(amount===null)return "";
        if(amount==="")return "";
        return Number(amount).toFixed(2);
    },

    /**
     * @description 配送方式展示和逻辑处理<br />
     * @method _deliveryMethod
     * @since 2017-02-08
     * @author yeyang
     */
    _deliveryMethod: function(shippinginfo,opt) {
        var that = this;
        var theData = {};
        //theData.scn = that._scn;
        theData.shopno = opt.shopId;
        theData.sgid = opt.shippingGroupId;

        that._express(shippinginfo);
        var periodTime = {};

      var times = that.data.information.data.shops[0].groups[0].commerceItemsGroup[0].times; //配送时间
        var time = '';
        var isSelected = false;

        //获取配送时间
        // for(var i=0; i<times.length; i++) {
        times.selected = false;
        var timesItem = times;
        if(timesItem){
            timesItem.has = true;
        }else{
            timesItem.has = false;
        }
        if(timesItem.code == "DAY"){
            var items = timesItem.items;
            for(var j = 0; j<items.length; j++) {
                if(items[j].selected) {
                    // timesItem.has = true;
                    timesItem.selected = true;
                    theData.udt = items[j].code;
                }
            }
            that.setData({
                day: timesItem
            });
        }

        if(timesItem.code == "SLOT") {//运能
            var concrete = timesItem.concrete;
            /*//后期产品提出做的话，再打开使用
            // var items1 = concrete[0].items;
            // var periodTime = [];

            // for(var i=0;i<items1.length;i++){
            //     periodTime.push(app.formathhmm(items1[i].startTime)+'-'+app.formathhmm(items1[i].endTime));
            // }*/
            for(var j=0; j<concrete.length; j++) {
                concrete[j].labels = app.formatmmdd(concrete[j].yd)+' '+ concrete[j].label;
                for(var m=0; m<concrete[j].items.length; m++) {
                    var item = concrete[j].items[m];
                    item.index = j*concrete[j].items.length+m;
                    if(item.selected) {
                        // theData.udt = timesItem.postBackCode;//后期产品提出做的话，再打开使用
                        theData.udt = 'noSlot';
                        theData.fdt=timesItem.type;
                        theData.ft = item.endTime;
                        // timesItem.has = true;
                        timesItem.selected = true;
                        time = app.formatmmdd(concrete[j].yd)+' '+ concrete[j].label + ' ' + app.formathhmm(item.startTime)+'-'+app.formathhmm(item.endTime);
                    }
                }
            }
        
            timesItem.periodTime = periodTime;
            timesItem.time = time;

            that.setData({
                xsd: timesItem
            })
        }

        that.setData({
            initData:opt,
            theData: theData
        });

    },

    /**
     * 判断是否七大品牌
     * @param code
     * @returns {boolean}
     */
    isbrand:function(code){
        var brand=["guomeidianqi","dazhongdianqi","beifangdianqi","yongledianqi","heitianedianqi","tengdadianqi","fengxingdianqi","sanxingdianqi"]

        if( brand.indexOf(code)>-1){
            return true
        }
        return false
    },
    /**
     * @description 配送方式的一些信息
     * @return {[type]} [description]
     */
    _express:function(shippinginfo){
        var that = this;
        var shopId = that.data.initData.shopId;
        var expressLabels = {
            "Gome Express":"国美快递",
            "Store Picking Up":"门店自提",
            "EMS":"EMS快递",
            "Express Picking Up":"配送自提",
            "Express":"普通快递"
        };
        var express = shippinginfo[0].express; //配送方式

        //获取配送方式
        for(var i=0; i<express.length; i++) {
            if(express[i].code == "Gome Express" && that.isbrand(shopId)){
                express[i].name = "普通快递";

            } else{
                express[i].name = expressLabels[express[i].code]||"其他";
            }

            if(express[i].shippingFee==0){
                express[i].shipPrice="免运费";
            } else{
                express[i].shipPrice ='¥'+that.formatAmount(express[i].shippingFee);
            }

        }
        that.setData({
            express: express
        })

    },


    bindTest:function(e){
        var that = this;
        var index = Number(e.target.dataset.index);
        var target = e.currentTarget.id
        var day = that.data.day;
        var jsd = that.data.jsd;
        var xsd = that.data.xsd;
        var theData = {};
        theData.shopno = that.data.initData.shopId;
        theData.sgid = that.data.initData.shippingGroupId;
        if(target == 'day'){
            if(jsd.has){
                that.cancelselect('jsd');
            }
            if(xsd.has){
                that.cancelselect('xsd');
            }
            day.selected = true;
            if(!index&&index!=0){
                //如果是只有day的话，则为必选
                return;
            }
            for(var i=0; i<day.items.length; i++) {
                if(i == index) {
                    day.items[i].selected = true;
                    theData.udt = day.items[i].code;
                }else {

                    day.items[i].selected = false;
                }
            }

        } else if(target == 'jsd'){
            if(day.has){
                that.cancelselect('day');
            }
            if(xsd.has){
                that.cancelselect('xsd');
            }

            jsd.selected = true;

        } else if(target == 'xsd'){
            if(!xsd.selected){

                xsd.concrete[0].items[0].selected = true;
                xsd.time = app.formatmmdd(xsd.concrete[0].yd)+' '+ xsd.concrete[0].label + ' ' + app.formathhmm(xsd.concrete[0].items[0].startTime)+'-'+app.formathhmm(xsd.concrete[0].items[0].endTime);
            }
            if(day.has){
                that.cancelselect('day');
            }
            if(jsd.has){
                that.cancelselect('jsd');
            }
            xsd.selected = true;
            theData.udt = xsd.postBackCode;
            that.bindTimeChange();

        }
        that.setData({
            day: day,
            jsd: jsd,
            xsd: xsd,
            theData:theData
        })

    },

    cancelselect:function(option){
        var that = this;
        var day = that.data.day;
        var jsd = that.data.jsd;
        var xsd = that.data.xsd;
        var dataValue;
        if(option == 'day'){
            day.selected = false;
            for(var i=0; i<day.items.length; i++) {
                day.items[i].selected = false;
            }
            dataValue=day;
        }

        if(option == 'jsd'){
            jsd.selected = false;
            dataValue=day;
        }

        if(option == 'xsd'){
            var that = this;
            var xsd = that.data.xsd;
            var concrete = xsd.concrete;
            xsd.selected = false;
            for(var i=0; i<concrete.length; i++) {
                for(var m=0; m<concrete[i].items.length; m++) {
                    var item = concrete[i].items[m];
                    item.selected = false
                }
            }
            dataValue=day;
        }

        that.setData({
            option: dataValue,
        })

    },


    /**
     * @description 点击配送方式<br />
     * @method bindDeliveryWay
     * @since 2017-01-2
     */
    bindDeliveryWay: function(e) {
        var that = this;
        var index = Number(e.detail.value);
        var theData = that.data.theData;
        var arr = that.data.express;
        var data = {};
        for(var i=0; i<arr.length; i++) {
            if(i == index) {

                arr[i].selected = true;
                data.sm = arr[i].code;
                data.shopno = theData.shopno ;
                data.sgid = theData.sgid;
                //data.scn = theData.scn;
            }else {
                arr[i].selected = false;
            }
        }

        wx.request({
            url: websiteUrl + '/api/transport/saveShippingMethod',
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader,
                'Cookie':'SCN=' + that._scn
            },
            data: data,
            method:'GET',
            success: function(res) {
                if (res.data.success) {
                    that.setData({
                        express: arr
                    })
                } else{
                    wx.showToast({
                        title: res.data.errMsg,
                        icon: 'loading',
                        duration: 2000
                    });
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
    },




    /**
     * @description 备注事件<br />
     * @method bindRemark
     * @since 2017-01-2
     */
    //3期备注接口缺省 不做了
    bindRemark: function(e) {
        var that = this;
        var value = e.detail.value
        var re = /<(.+?)>/gi;

        return value.replace(re,'');
    },

    saveComments:function(){
        var that = this;
        var theData = that.data.theData;
        var comments = that.data.comments;
        wx.request({
            url: websiteUrl + '/api/transport/saveComments',
            header: {
                'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                'gome-header':goHeader,
                'Cookie':'SCN='+that._scn
            },

            data: {cm:comments,shopno:theData.shopno, sgid:theData.sgid},
            method:'GET',
            success: function(res) {
                if (res.data.success) {
                    // wx.redirectTo({url:'../confirmOrder/confirmOrder'});
                    wx.navigateBack();
                } else{
                    wx.showToast({
                        title: res.data.errMsg,
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
    },
    /**
     * @description 确定事件<br />
     * @method bindConfirm
     * @since 2017-01-2
     */
    bindConfirm: function(e) {
        var that = this;
        var theData = that.data.theData;
        if (that.data.theData.udt != 'noSlot') {
            that.setData({
                theData: theData
            });
            wx.request({
                url: websiteUrl +'/api/transport/saveDeliveryTime',
                header: {
                    'content-type':  'application/x-www-form-urlencoded;charset=utf-8',
                    'gome-header':goHeader,
                    'Cookie':'SCN=' + that._scn
                },
                data: that.data.theData,
                method:'GET',
                success: function(res) {
                    if (res.data.success) {
                        that.saveComments();
                        // wx.navigateBack();
                    } else{
                        wx.showToast({
                            title: res.data.errMsg,
                            icon: 'loading',
                            duration: 2000
                        });
                    }
                },
                fail:function(data){
                    wx.showToast({
                        title: '请求失败',
                        icon: 'loading',
                        duration: 2000
                    });
                }
            });
        }
        else {
            wx.navigateBack();
        }
    },

    bindTimeChange: function(e) {
        this.setData({
            timeMask: true,
            mask: true
        })

    },

    bindMaskHide: function(e) {
        var that = this;
        this.setData({
            timeMask: false
        });
    }
    //后期产品需要这个功能的时候，再打开使用
    /*changeTime:function(e){
         var that = this;
         var xsd = that.data.xsd;
         var dataset = e.target.dataset;
         var index = dataset.index;
         var theData = {};
         theData.shopno = that.data.initData.shopId;
         theData.sgid = that.data.initData.shippingGroupId;
         if(index>=0&&index!='unavailable'){
            var concrete = xsd.concrete;
            xsd.selected = true;
            for(var i=0; i<concrete.length; i++) {
                for(var m=0; m<concrete[i].items.length; m++) {
                    var item = concrete[i].items[m];
                     // item.index = j*concrete[j].items.length+m;
                    if(item.index==index){
                        item.selected=true;
                        theData.udt = xsd.postBackCode;
                        theData.fdt=xsd.type;
                        theData.ft = item.endTime;
                        theData.udtl = item.code;
                        xsd.time = app.formatmmdd(concrete[i].yd)+' '+ concrete[i].label + ' ' + app.formathhmm(item.startTime)+'-'+app.formathhmm(item.endTime);
                    } else{
                        item.selected = false;
                    }

                }
            }
         }
        that.setData({
            xsd: xsd,
            theData:theData
        })
    }*/

});