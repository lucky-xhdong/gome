/*!
 * 详情大图页JS
 * 针对普通商品,不包含海外购、淘实惠、闪购等商品
 * prdBigImg - v1.0.1 (2016-09-09) WangPingQi
 * //www.gome.com.cn/ | Released under MIT license
 */
 var arr_atgregion = (function () {
     function getCookie(c_name) {
         if (document.cookie.length > 0) {
             c_start = document.cookie.indexOf(c_name + "=")
             if (c_start != -1) {
                 c_start = c_start + c_name.length + 1
                 c_end = document.cookie.indexOf(";", c_start)
                 if (c_end == -1) c_end = document.cookie.length
                 return decodeURIComponent(document.cookie.substring(c_start, c_end))
             }
         }
         return "";
     }
     var arr = (getCookie('atgregion') || "11010200|北京北京市朝阳区|11010000|11000000|110102002").split('|');
     return [arr[1], arr[3], arr[2], arr[0], (arr[4] == undefined ? arr[0] + '1' : arr[4])];
 })();
 

;(function(exports,$,prdInfo){
    var warrantyProId = '';//延保pid
    var warrantySkuId = '';//延保skuid
    var yb_data=exports.yb_data;
    var ybLength=(yb_data===undefined || yb_data==="") ? 0  : yb_data.length;
    if (yb_data!=undefined && ybLength>0) {
        for (var i = 0; i < ybLength; i++) {
            if (yb_data[i].active == true) {
                warrantyProId = yb_data[i].pid;
                warrantySkuId = yb_data[i].sid;
            }
        }
    }
    exports.versionData=versionData;
    exports.bigImgParams={
        productId :  prdInfo.prdId ,
        catalogRefId : prdInfo.sku,
        addItemCount : 1,
        warrantyProId  : warrantyProId,
        warrantySkuId : warrantySkuId,
        warrantyQuantity :  1,   //直接取的购买数量
        quantity  :  1,  //以后直接默大图页购买数量为1,免得单独开发一个接口获取购买数量 ($.cookie("purchaseCounts")
        productType : prdInfo.productType,
        vipShopFlag : prdInfo.vipShopFlag,
        programId :  prdInfo.programId,
        activityId :  prdInfo.programId,
        activityType : prdInfo.vipShopFlag =="true" ? "VipPrice" : "",
        shopFlag :  prdInfo.shopFlag //海外购标示，parseInt(prdInfo.shopFlag)>1
    }
})(window,jQuery,prdInfo)

/* 价格、按钮置灰自动处理对象 */
var prdInfoActions={
    darkStatus : true, //默认true，即应置灰
    init : function(data){
        this.initInfo(data);
        this.doPrdInfo(data);
    },
    initInfo : function(data){
        var self=this;
        //处理价格
        if(!data.userStore.visible){
            prdInfo.price="敬请期待";
        }
        else if(!$.isEmptyObject(data.gomePrice)){
            //判断是否存在直降价
            prdInfo.price = data.gomePrice.salePrice; // 直降价
        }
        else{
            prdInfo.price="";
        }
       


        //按钮置灰处理
        //预售
        if (data.stock && data.stock.presell) {
            self.darkStatus=false;
            return false;
        }
        //下架、无货
        prdInfo.prdType = prdInfo.prdType || prdInfo.stats;
        if (prdInfo.prdType === '2' || (data.stock && !data.stock.status)) {
            if(data.subscriceFlag && (data.subscriceFlag.yuyue || data.subscriceFlag.qianggou)  ){
                self.darkStatus=false;
            }else{
                self.darkStatus=true;
            }
            return false;
        }
        if (data.stock && data.stock.status) {
            self.darkStatus=false;
        }
        //有一些屏蔽的sku需要置灰按钮  
        if(prdInfo.skuBlackList=='true'){
             self.darkStatus=true;
        }
    },
    doPrdInfo : function(data){
        //绑定价格
        $('#price').html("¥ " +prdInfo.price);
        //按钮置灰
        var choosePay=$('#choose-pay');
        if(this.darkStatus)
            choosePay.addClass("disable");
        else
            choosePay.removeClass("disable");
        new prdBigImage(choosePay[0],data).btnInit();
    }
}


/**
 * 焦点图和评价咨询点击效果
 */
var prdUiActions={
    init : function(){

        $(".thumbs-warp").gRoll({movenum:1});

        var imgShow=function(obj){
            var getsrc = obj.find("img").attr("samesrc");
            $("#img").attr("src",getsrc+"_800_pc.jpg");
            $(".thumbs-imgbox li").removeClass("current");
            $(".thumbs-imgbox li").find("b").remove();
            obj.addClass("current");
            obj.append("<b></b>");
            var len=$(".thumbs-imgbox li").length;
            var curnow = $(".thumbs-imgbox li").index(obj);
            if(curnow<=0){
                $("#js-prev").hide();
                $("#js-next").show();
            }else if(curnow>=len){
                $("#js-prev").show();
                $("#js-next").hide();
            }else{
                $("#js-prev").show();
                $("#js-next").show();
            }
        };

        var imgclick=function(obj,opt){
            var n = $(".thumbs-imgbox li").length,
                curn=0;
            $(".thumbs-imgbox li").each(function(i){
                if($(this).hasClass("current")){curn=i;};
            });
            if(opt=="prev"){
                curn--;
                if( curn >= 0){
                    var ob = $(".thumbs-imgbox li").eq(curn);
                    imgShow(ob);
                }else{
                    $("#js-prev").hide();
                    $("#js-next").show();
                }
            }else if(opt=="next"){
                curn++;
                if( curn < n){
                    var ob = $(".thumbs-imgbox li").eq(curn);
                    imgShow(ob);
                }else{
                    $("#js-prev").show();
                    $("#js-next").hide();
                }
            }
        };

        /* 图片左右下一张 */
        $("#js-prev").hover(function(){
            $("#js-prev").css("cursor","url("+imgServer+"/detail/arr_left.cur),auto");
        }, function(){
            $("#js-prev").css("cursor","default");
        });

        $("#js-next").hover(function(){
            $("#js-next").css("cursor","url("+imgServer+"/detail/arr_right.cur),auto");
        },function(){
            $("#js-next").css("cursor","default");
        });

        $(".thumbs-imgbox li").click(function(){
            var o=$(this);
            imgShow(o);
        });

        if($(".thumbs-imgbox li").eq(0).hasClass("current")){
            $("#js-prev").hide();
            $("#js-next").show();
        }

        $("#js-prev").click(function(){
            var o=$(this);
            imgclick(o,"prev");
        });

        $("#js-next").click(function(){
            var o=$(this);
            imgclick(o,"next");
        });

        //最新咨询
        var consultAjaxUrl = "//ss" + cookieDomain + "/item/v1/prdadvice/productAdvice/"+prdInfo.prdId+"/flag/advice/adviceData";
        $.ajax({
            type:"get",
            url:consultAjaxUrl,
            cache:false,
            dataType:"jsonp",
            jsonpName:"adviceData",
            success:function(data){
                if(data && data.adviceList){
                    var prdConsult=new PrdBigImageConsult(
                        $(".items-box .items-hd").eq(1)[0],
                        {data : data.adviceList[0]}
                    );
                    prdConsult.init();
                }

            }
        });

        //最新评价
        var evaluateAjaxUrl = '//ss' + cookieDomain + '/item/v1/prdevajsonp/appraiseModuleAjax/'+prdInfo.prdId+'/'+1+'/'+'all'+'/flag/appraise/'+'evaluateData';
        $.ajax({
            type:"get",
            url:evaluateAjaxUrl,
            cache:false,
            dataType:"jsonp",
            jsonpName:"evaluateData",
            success:function(data){
                if(data && data.evaList && data.evaList.Evalist){
                    new PrdBigImageEvaluate(
                        $(".items-box .items-hd").eq(0)[0],
                        {data : data.evaList.Evalist}
                    ).init();
                }
            }
        });

        /* 最新评价&&咨询 */
        $(".j-new").toggle(function(){
            $(this).attr("title","收起");
            $(this).next(".newbox").show();
            $(this).find("b").remove();
        },function(){
            $(this).attr("title","展开");
            $(this).next(".newbox").hide();
            $(this).find("span").append("<b></b>");
        });
    }
}



$(function(){

    /* 焦点图和评价咨询点击效果 */
    prdUiActions.init();



    var  store_data={},
        allStore={},//新商品接口
        userStore={};//用户相关接口
    $.when(
        $.ajax({
            type: 'get',
            url: "//ss" + cookieDomain + '/item/v1/d/m/store/unite/'+prdInfo.prdId+'/'+ prdInfo.sku+'/N/'+arr_atgregion[3]+'/'+arr_atgregion[4]+'/1/'+$.cookie('SSO_USER_ID')+'/flag/item/allStore',
            dataType: 'jsonp',
            jsonpName :"allStore"

        }).done(function(datas){
            if(datas.success && !$.isEmptyObject(datas.result)){
                allStore=datas.result;
            }
        }),
        $.ajax({
            type: 'get',
            url: '//ss'+cookieDomain+'/item/v1/d/reserve/p/detail/'+prdInfo.prdId+'/'+prdInfo.sku+'/'+ $.cookie('SSO_USER_ID')+'/'+arr_atgregion[2]+'/flag/item/userStore',
            dataType: 'jsonp',
            jsonpName :"userStore"
        }).done(function(datas){
            if(datas.success && !$.isEmptyObject(datas.result) ){
                userStore.userStore=datas.result;
            }
        })
    ).then(function () {
        prdInfo.prdType = allStore.status;
        //合并两个请求的返回对象
        allStore=$.extend(allStore,userStore);
        //allStore：包含获取价格、有无货、预约抢购等数据
        prdInfoActions.init(allStore);
    });
})

/**
 * 详情大图页s_code
 */
/*$(function(){
    s.pageName="商品:查看大图";
    s.channel=s.pageName.split(':')[0];
    s.prop1=s.pageName.split(':')[0]+":"+s.pageName.split(':')[1];
    s.prop4="查看大图";
    var s_code=s.t();
    if(s_code)document.write(s_code);
})*/


/**
 * 大图页商品评论列表
 */
var PrdBigImageEvaluate=function(element,options){
    this._init.apply(this,arguments);
}
PrdBigImageEvaluate.prototype={
    _init:function(element,options){
        this.plugin="gmPrdBigImageEvaluate";
        this.dom=element;
        this.element=$(element);
        this.options=$.extend({}, this.defaults, options);
        this.enabled = true;
        this.data=this.options.data;
        this.prdInfo=window.prdInfo;
    },
    init: function(){
        this.bindTemplate();
        this.slide();
    },
    /**
     * 渲染评论列表数据
     */
    bindTemplate:function(){
        var self=this
            , strLis=""
            , arr=self.data
            , length=arr.length
            , len=length>6 ? 6 : length
            , moreStyle=len>6 ? "" : 'style="display:none"';
        if(len===0) return false;
        for(var i=0;i<len;i++){
            strLis+='<li><b></b>'+
            '<a href="'+'//review'+cookieDomain+'/'+arr[i].appraiseId+'.html'+'" target="_blank">'+arr[i].appraiseElSum+'</a>'+
            '</li>';
        }
        var template=
            '<div class="newbox">'+
            '<ul class="items-cont">'+strLis+'</ul>'+
            '<p><a href="'+'//review'+cookieDomain+'/'+'1-1.html'+'" '+moreStyle+' target="_blank">更多 &gt;</a></p>'+
            '</div>';
        self.element.append(template);
    },
    /**
     * 咨询列表的收起展开效果
     */
    slide : function(){
        var ele=this.element.find(".j-new");
        ele.next(".newbox").hide();
        ele.toggle(
            function(){
                $(this).attr("title","收起").next(".newbox").show().end().find("b").remove();
            },
            function(){
                $(this).attr("title","展开").next(".newbox").hide().end().find("span").append("<b></b>");
            }
        );
    }

}

/**
 * 大图页商品咨询列表
 */
var PrdBigImageConsult=function(element,options){
    this._init.apply(this,arguments);
}
PrdBigImageConsult.prototype={
    _init:function(element,options){
        this.plugin="gmPrdBigImageConsult";
        this.dom=element;
        this.element=$(element);
        this.options=$.extend({}, this.defaults, options);
        this.enabled = true;
        this.data=this.options.data;
        this.prdInfo=window.prdInfo;
    },
    init: function(){
        this.bindTemplate();
        this.slide();
    },
    /**
     * 渲染咨询列表数据
     */
    bindTemplate:function(){
        var self=this
            , strLis=""
            , arr=self.data.listData
            , length=arr.length
            , len=length>6 ? 6 : length
            , moreStyle=len>6 ? "" : 'style="display:none"';
        if(len===0) return false;
        for(var i=0;i<len;i++){
            strLis+='<li><b></b>'+
            '<a href="'+'//zixun'+cookieDomain+'/'+arr[i].quesId+'.html'+'" target="_blank">'+arr[i].fques+'</a>'+
            '</li>';
        }
        var template=
            '<div class="newbox">'+
            '<ul class="items-cont">'+strLis+'</ul>'+
            '<p><a href="'+'//zixun'+cookieDomain+'/'+self.prdInfo.prdId+'-0-1.html'+'" '+moreStyle+'  target="_blank">更多 &gt;</a></p>'+
            '</div>';
        self.element.append(template);
    },
    /**
     * 咨询列表的收起展开效果
     */
    slide : function(){
        var ele=this.element.find(".j-new");
        ele.next(".newbox").hide();
        ele.toggle(
            function(){
                $(this).attr("title","收起").next(".newbox").show().end().find("b").remove();
            },
            function(){
                $(this).attr("title","展开").next(".newbox").hide().end().find("span").append("<b></b>");
            }
        );
    }
}

//一个公共的跳转购物车变量
var createProgress=$.createProgress;

/*!
 * 一个简单的大图详情页按钮处理插件
 * released under the MIT license
 * //www.gome.com.cn/license
 * version:1.0
 * author:WangPingqi
 * QQ:451863231
 * email :wpq163yx@163.com
 * date: 2015-12-15T14:00Z
 */
var prdBigImage=function(element,options){
    this._init.apply(this,arguments);
}
prdBigImage.prototype={
    defaults:{
    },
    _init:function(element,options){
        this.plugin="wpPlugin";
        this.dom=element;
        this.element=$(element);
        this.options=$.extend({}, this.defaults, options);
        this.enabled = true;
        this.bigImgParams=window.bigImgParams;
        this.result=this.options.result;
        this.prdType=window.prdInfo.prdType;
        this.createProgress=createProgress;
    },
    setOptions : function(opts){
        this.options= $.extend({}, this.defaults, opts);
    },
    getOptions : function(){
        return this.options;
    },
    enable: function () {
        this.enabled = true
    },
    disable: function () {
        this.enabled = false
    },
    /**
     * 按钮初始化
     * @method btnInit
     * @return {Null} 无返回值
     */
    btnInit : function(){
        var self=this;
        if (self.options.userStore && self.options.userStore.phase==='1') {
            var yuyue=self.options.userStore;
            self.removeAttrSrc();
            self.btnYuYue(yuyue);
        }
        else if (self.options.userStore && self.options.userStore.phase==='2') {
            var qianggou=self.options.userStore;
            self.removeAttrSrc();
            self.btnQiangGou(qianggou);
        }
        else{
            self.btnAddCart();
        }
    },
    /**
     * 移除按钮原来自带的href
     */
    removeAttrSrc : function(){
        this.element.attr({"href":"","data-href":""});
    },
    /**
     * 预约
     * @method btnQiangGou
     * @param {Object} qianggou 一个预约的json数据
     * @return {Null} 无返回值
     */
    btnYuYue : function(yuyue){
        var self=this;
        switch(yuyue.status) {
            case '0'://立即预约
                /* 预约商品后端直接返回的无货，所以无需判断有无货
                 if(self.result==="N" || self.prdType===2 ){
                 self
                 .element.html('立即预约')
                 .addClass("disable")
                 .click(function (evt) {
                 return false;
                 });
                 return false;
                 }*/
                self.element
                    .html('立即预约')
                    .removeClass("disable")
                    .addClass('bigbtn')
                    .show()
                    .click(function (evt) {
                        evt.preventDefault();
                        g.login(function () {
                            $.ajax({
                                type: 'get',
                                url: '//ss'+cookieDomain+'/item/v1/d/reserve/p/detail/'+prdInfo.prdId+'/'+prdInfo.sku+'/'+ $.cookie('SSO_USER_ID') +'/'+arr_atgregion[2]+'/flag/item/userStore',
                                dataType: 'jsonp',
                                jsonpName :"userStore"
                            }).done(function(datas){
                                if(datas.success && !$.isEmptyObject(datas.result)){
                                    if(datas.result.status === '0'){
                                       window.location.href = '//item'+cookieDomain+'/yuyue/' + prdInfo.prdId + '-' + prdInfo.sku + '.html';
                                    }else if(parseInt(datas.result.status) > 0) {
                                        window.location.reload();
                                    }
                                }else{
                                    alert("立即预约失败");
                                }
                            })
                        });
                    });
                break;
            case '1'://已预约
                self.element
                    .html('已预约')
                    .addClass('disable')
                    .show()
                    .click(function (evt) {
                        return false;
                    });
                break;
            case '2'://已约满
                self.element
                    .html('已结束')
                    .addClass('disable')
                    .show()
                    .click(function (evt) {
                        return false;
                    })
                break;
            case '3'://预热
                self.element
                    .html('即将开始')
                    .addClass("disable")
                    .css({'background':'#5a9b61','cursor':'default'})
                    .show()
                    .click(function (evt) {
                        return false;
                    })
                break;
        }
    },
    /**
     * 抢购
     * @method btnQiangGou
     * @param {Object} qianggou 一个抢购的json数据
     * @return {Null} 无返回值
     */
    btnQiangGou : function(qianggou){
        var self=this;
        switch(qianggou.status) {
            case '0':
                if(!self.options.stock.status || self.prdType==='2' ){
                    self
                        .element.html('立即抢购')
                        .addClass("disable")
                        .click(function (evt) {
                            return false;
                        });
                    return false;
                }
                self.element
                    .html('立即抢购')
                    .show()
                    .click(function (evt) {
                        evt.preventDefault();
                        g.login(function () {
                            $.ajax({
                                type: 'get',
                                url: '//ss'+cookieDomain+'/item/v1/d/reserve/p/detail/'+prdInfo.prdId+'/'+prdInfo.sku+'/'+ $.cookie('SSO_USER_ID')+'/'+arr_atgregion[2]+'/flag/item/userStore',
                                dataType: 'jsonp',
                                jsonpName :"userStore"
                            }).done(function(datas){
                                if(datas.success){
                                    var qianggou = datas.result;
                                    if(qianggou.status === '0'){
                                        //添加购物车
                                        var url='//cart'+cookieDomain+'/home/api/cart/addToCart';
                                        var addCartData = {
                                            type:0,
                                            pid: prdInfo.prdId,
                                            sid: prdInfo.sku,
                                            pcount: bigImgParams.quantity,
                                            _r: new Date().getTime()
                                        }
                                        //添加购物车
                                        self.createProgress({
                                            Jump:false,
                                            url:url,
                                            data:addCartData ,
                                            callback:function(data){
                                                if (data.success) {//添加成功
                                                    window.location.href = '//cart'+cookieDomain;
                                                }else{
                                                    var _dat = data;
                                                    if (_dat.errCode && _dat.errMsg) {
                                                        alert(_dat.errMsg);
                                                    }
                                                }
                                            }
                                        });
                                    }else {
                                        window.location.reload();
                                    }
                                }
                            });

                        });
                    });
                ;
                break;
            case '1':
                self.element
                    .html('未预约')
                    .addClass('disable')
                    .show()
                    .click(function (evt) {
                        return false;
                    });
                break;
            case '2':
                self.element
                    .html('已购买')
                    .addClass('disable')
                    .show()
                    .click(function (evt) {
                        return false;
                    });
                break;
        }
    },
    /**
     * 加入购物车事件处理
     * @method addCart
     * @return {Null} 无返回值
     */
    addCart:function(){
        var self=this;
        //海外购
        if(bigImgParams.productType == 'hwg-prd' || parseInt(bigImgParams.shopFlag)>1 ){
            self.hwgAddCart();
        }
        //普通商品
        else{
            self.normalAddCart();
        }
    },
    /**
     * 加入购物车
     * @method btnAddCart
     * @return {Null} 无返回值
     */
    btnAddCart : function(){
        var self=this;
        self.element.on("click",function(evt){
            evt.preventDefault();
            if($(this).hasClass("disable"))
                return false;
            self.addCart();
        })
    },
    /**
     * 海外购商品加入购物车
     * @method hwgAddCart
     * @return {Null} 无返回值
     */
    hwgAddCart : function(){
        var self=this;
        var data={
            homesite : "haiwaigou",
            type:16,
            sid : prdInfo.sku,
            pid : prdInfo.prdId,
            pcount : bigImgParams.quantity,
            wpid : bigImgParams.warrantyProId ,
            wsid : bigImgParams.warrantyProId,
            cr : 0,
            _r : new Date().getTime()
        };
        self.createProgress({
            Jump:true,
            openJump :false,
            url: "//cart"+cookieDomain+"/addsuccess?"+self.json2Str(data)
        });
        /*神策埋码*/
        window.GomeSa &&  GomeSa.track('AddCart', {
               quantity: 1,
               sku_id: prdInfo.sku
           });
    },
    /**
     * 普通商品加入购物车
     * @method normalAddCart
     * @return {Null} 无返回值
     */
    normalAddCart : function(){
        var self=this;
        var data={
            homesite :"home",
            type:0,
            sid : prdInfo.sku,
            pid : prdInfo.prdId,
            pcount : bigImgParams.quantity,
            wpid : bigImgParams.warrantyProId ,
            wsid : bigImgParams.warrantyProId,
            cr : 0,
            _r : new Date().getTime()
        };
        if(prdInfo.sapSkuType=="ECTZ"){
                    data.type=24;
            };
        var _url="//cart"+cookieDomain+"/addsuccess?"+self.json2Str(data)

        var cardType=prdInfo.sapSkuType;
        

        if(cardType=="ZSTK" || cardType=='ZDZK'){
                 
               g.login(function(){
                   var _url='//card'+cookieDomain+'?skuType='+cardType+'&productId='+data.pid+'&skuId='+data.sid+'&count='+data.pcount;
                   self.createProgress({
                       Jump:true,
                       openJump:false,
                       url:_url
                      
                   })
               });
               
              return  false; 
           }else{
               self.createProgress({
                   Jump:true,
                   openJump :true,
                   url:_url
               });
           }

           /*神策埋码*/
           window.GomeSa &&  GomeSa.track('AddCart', {
               quantity: 1,
               sku_id: prdInfo.sku
           });
    },
    /**
     * 将json对象装换连接为字符串
     * @method json2Str
     * @return {String} 字符串
     */
    json2Str : function(obj){
        if($.isPlainObject(obj)){
            var str="";
            $.each(obj,function(name, value){
                if(value!=="")
                    str+=name+'='+value+"&"
            })
            return str.substring(0,str.length-1);
        }
    }
}

/**
 * 抽象出来的一个公共埋码函数
 * @param options 参数对象
 * @param time 定时器时间
 * @param timer 是否使用定时器，默认不需要
 * @param ele maima对象
 * @param links maima对象内的链接
 * @return {void}
 */
function maiMaRecTrack(options){
    var time=options.time || 100;
    var maimaTimer=options.maimaTimer || false ;
    var maima=function(){
        window.recTrack && recTrack($(options.ele).attr('maima_param'));
        $(options.links).click(function () {
            window.recTrack && recTrack($(this).attr('maima_param'));
        });
    }
    if(maimaTimer){
        window.setTimeout(function () {
            maima();
        },time);
    }else{
        maima();
    }
}

$('#mboxDynamicFoot').gLoad(function () {
    $('#mboxDynamicFoot').hide();
    g.ajax(
        '//bigd'+gomeplusDomain+'/gome/rec',
        {
            boxid: 'box82',
            pid: prdInfo.prdId,
            cid: $.cookie('__clickidc'),//cookie
            uid: loginData.loginId,
            area: g.cityCode(),
            brid: prdInfo.brandID,
            imagesize: 100,
            'c1id': prdInfo.firstCategoryId,
            'c3id': prdInfo.thirdCategoryId,
            'shopid': prdInfo.shopNo,
            sid : prdInfo.sku
        }, {
            site: 'f'
        })
        .done(function (data) {
            if(!data.lst) data.lst=[];

            if(!data.lst || data.lst.length<1){
                $('#mboxDynamicFoot').hide();
                return false;
            }
            var htm = '\
            <div class="pushbox">\
            <h3>\
            <span class="title" style="float:left;">热销排行榜</span>\
			<span id="btn-change" class="btn-refresh" style=""><span class="text">换一组</span><i class="i-refresh"></i></span>\
            </h3>\
            <div class="andBuyOut">\
                <div class="andBuy-cont">\
                <ul class="pushul clearfix" style="position: relative;">\
                    <% for(var i=0,j=lst.length; i<j; i++){ \
                    var prd = lst[i];\
                    var point = i<j-1?",":"";\
                    bigData(prd.productId+point);\
                    %>\
                    <li>\
                    <a track="2:<%= prd.pid %>" href="<%=prd.purl %>"  target="_blank" title="<%= prd.pn %>" maima_param="<%=prd.maima_param%>"><img width="130" height="130" src="<%= prd.iurl %>" alt="<%= prd.pn %>"/></a>\
                    <a track="2:<%= prd.pid %>" href="<%=prd.purl %>"  target="_blank" title="<%= prd.pn %>" maima_param="<%=prd.maima_param%>"><h2><%= prd.pn %></h2></a>\
                    <p class="yuan colprice fb">¥<span><%= prd.price %></span></p>\
                    </li>\
                    <% } %>\
                </ul>\
                <div style="clear:both;"></div><div style="clear:both;"></div><div style="clear:both;"></div>\
                </div>\
            </div>\
            </div>\
            \
            ';
            /*  3个<div style="clear:both;"> 用于处理IE6中出现BUG:多出来的猪 */
            var products = "";
            template.helper('bigData', function (pid) { products += pid; });
            $('#mboxDynamicFoot').attr('maima_param',data.maima_param).html(template.compile(htm)(data)).show();
            $("#btn-change").hide();
            if (typeof trackEvent != "undefined") { trackEvent(2, products); }

            //绑定事件
            var tlscroll = $('body').hasClass('w990') ? 5 : 6;

            if (data.size > tlscroll) {
                $('#mboxDynamicFoot .andBuy-cont').gSlider({
                    isAuto: false,
                    showNum: tlscroll,
                    beforeCallback: function(){
                        $('#mboxDynamicFoot .andBuy-cont').find('li').eq(tlscroll-1).nextAll().remove();
                    }
                });
            }

            //埋码
            maiMaRecTrack({
                ele :'#mboxDynamicFoot',
                links : '#mboxDynamicFoot a'
            });

        });
});

//热词、相关关键词
$('.gm-hotwords').gLoad(function () {
    if(prdInfo.thirdCategoryName==""){
        $('.gm-hotwords').hide();
        return false;
    }
    g.ajax(
        '//nlr'+cookieDomain+'/seoservice/'+encodeURIComponent(prdInfo.thirdCategoryName).toLowerCase(), {
    }, {
        site: 'f'
    })
    .done(function (data) {
        if (!$.isEmptyObject(data) && data.html) {
            var arr=JSON.parse(data.html)
                , len=arr.length;
            if(len>0){
                var htmlTpl='\
                    <h2><%=name%>相关关键词</h2>\
                    <div class="hot-bd clearfix">\
                        <% for(var i=0,len=hotwords.length; i<len; i++){\
                            var hotword = hotwords[i];%>\
                            <a href="<%=hotwords[i].hotwordsUrl%>" target="_blank" title="<%=hotwords[i].title%> "><%=hotwords[i].title%></a>\
                        <% } %>\
                    </div>';
                $('.gm-hotwords').html(template.compile(htmlTpl)( {
                    hotwords : arr,
                    name : prdInfo.prdName
                }))
            }else{
                $('.gm-hotwords').hide();
            }
        }else{
            $('.gm-hotwords').hide();
        }
    });
});

//一句话介绍
$('.gm-helper').gLoad(function () {
    // {品牌}{型号}{三级品类}
    var seoKeyWord=prdInfo.brand+prdInfo.thirdCategoryName; //没有型号字段,暂不取值
    if(seoKeyWord!==""){
        $('.gm-helper').html(
            '<div class="gm-helper">国美为您找到<h1>'+prdInfo.prdName+seoKeyWord+'</h1>图片，国美的'+seoKeyWord+
            '图片大全拥有海量精选高清图片，大量的细节图，多解度拍摄，全方位真人展示，为您购买'+seoKeyWord+
            '相关产品提供全方位的图片参考。</div>'
        );
    }else{
        $('.gm-helper').hide();
    }
});