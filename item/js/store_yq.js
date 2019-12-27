/**
 * 预约抢购详情页初始化
 */
EventManager.on('yuyue', function(data) { // 预约商品

    //将里面频繁的操作抽象成一个对象使用
    var yqDetailActions={
        autoStockTxt : function(){
            (data.stock && !data.stock.status) ? $("#stockTxt").text("无货").show() : null; //无货
        },
        yqBtnDisable : function(selector,text){
            this.yqBtnEnable(selector,text);
            $(selector).click(function () {
                return false;
            });
            //悬浮小购物车特殊处理
            $("#addCartLink")
                .html(text)
                .addClass("nostock")
                .click(function(){
                    return false;
                });
            return false;
        },
        yqBtnEnable : function(selector,text){
            $(selector)
                .html(text)
                .addClass('disabled')
                .show();
        },
        addCarActions : function(text,callback,css){
            $("#addCartLink")
                .html(text)
                .removeClass("nostock")
                .css( css ? css: {"cursor":"default","color":"#ccc","background":"#f8f8f8"} )
                .click(callback);
        },
        removeClassBtn : function(clsname,addclsname){
            $('#yuyue').removeClass(clsname).addClass(addclsname);
        }
    }

    //输入毫秒 输出
    window.dateInfo=function(milliseconds) {
        var days = 0,
            hours = 0,
            minutes = 0,
            second = 0,
            millisecond = 0;

        if (milliseconds > 0) {
            days = parseInt(milliseconds / (1000 * 60 * 60 * 24))
            hours = parseInt(milliseconds / (1000 * 60 * 60) % 24)
            minutes = parseInt(milliseconds / (1000 * 60) % 60)
            second = parseInt(milliseconds / 1000 % 60);
            millisecond = milliseconds % 1000;
        }
        return {
            days: days < 10 ? "0" + days : days,
            hours: hours < 10 ? "0" + hours: hours,
            minutes: minutes < 10 ? "0" + minutes: minutes,
            second: second < 10 ? "0" + second: second,
            millisecond: millisecond < 10 ? "0" + millisecond: millisecond
        }
    }

    window.Timer=function(params) {
        this._init(params);
        this._runningflag;
        this.timer=null;
    }
    Timer.prototype = {
        _init: function (params) {
            this.params = params;
        },
        run: function () {
            var _this = this;
            _this.params.immediately && _this.params.callback(_this.params.milliseconds)
            _this.timer = setInterval(function () {
                _this.params.milliseconds -= _this.params.interval;

                if (_this.params.milliseconds < 0) {
                    clearInterval(_this.timer);
                    _this.params.callback(0);
                    _this.end();
                    return;
                }
                _this.params.callback(_this.params.milliseconds);

            }, this.params.interval)
        },
        end: function () {
            this.params.fnEnd && this.params.fnEnd();
        },
        stop :function(){
            window.clearInterval(this.timer);
        }
    }
    //测试时候用的
    // data.userStores.phase=1;
    if (data.userStores && (data.userStores.phase=='1' || data.userStores.phase=='2') ) {
        $("#stockTxt").text("").hide();
        $("#reduce").hide();
        window.yuyuegoumai_maima = true;
        $('.prd-buttons .btn-product,.mobile-orders-wrapper').hide();//隐藏加入购物车 分期付款
        $(".prd-price-1").remove();
        $('.fumai,.arrival').remove();
        //禁用数量选择框
        $("#enterQty").attr("disabled", true);
        $("#btnCount").children().addClass("disab");

        $("#yuye_more").show();


        var yuyue_warp = $('.yuyue_price_info'),
            daojishi_warp = $('#yuyue_daojishi');
        //测试时候用的
        //data.result = "N";
        // data.userStores.phase=1;
        if (data.userStores.phase==='1' ) {
            $("#addCartLink").addClass("btnYuQiang");
            var yuyue = data.userStores;
           // data.userStores.status='3'
            //prdInfo.price="敬请期待";
            //预约后端默认返回无货状态，所以不用进行有无货显示
            //yqDetailActions.autoStockTxt();//无货或下架
            yuyue_warp.show();
            yuyue_warp.find('#promoPrice').html("¥"+prdInfo.price);
            yuyue_warp.find('#priceLable').html("预约中");
            yuyue.phasesatue?$("#priceLable").remove():""

            var t1 = new Timer({
                milliseconds: yuyue.endTime-yuyue.current,
                interval: 500,
                immediately: true,
                callback: function (milliseconds) {
                    var $subscrice = $('#yuyue_daojishi');
                    var time = dateInfo(milliseconds);
                    $subscrice.find('em.d').html(time.days);
                    $subscrice.find('em.h').html(time.hours);
                    $subscrice.find('em.m').html(time.minutes);
                    $subscrice.find('em.s').html(time.second);
                    $subscrice.find('#yushouCount').html('<span>已有</span><strong>'+ (yuyue.number || '0') +'</strong><span>人成功预约</span>');
                    $subscrice.show();
                    yuyue.phasesatue?$("#yushouCount").hide():""
                },
                fnEnd: function () {
                    window.location.href = window.location.href;
                }
            });

            t1.run();

            //yuyue.subcrice 0立即预约 1已预约 2 已约满   3.预热
            switch(yuyue.status) {
                case '0'://立即预约
                    //预约后端默认返回无货状态，所以不用进行有无货判断
                    $('#yuyue_daojishi').find('.prdLeft').html('距&nbsp;&nbsp;开&nbsp;&nbsp;抢');
                    $('#yuyue')
                        .html('立即预约')
                        .removeClass("bigbtn disabled")
                        .addClass('bigbtn')
                        .show()
                        .click(function () {

                            g.login(function () {

                                $.ajax({
                                    type: 'get',
                                    url: '//ss'+cookieDomain+'/item/v1/d/reserve/p/detail/'+prdInfo.prdId+'/'+prdInfo.sku+'/'+ $.cookie('SSO_USER_ID')+'/'+g.cityCode(2)+'/flag/item/userStores',
                                    dataType: 'jsonp',
                                    jsonpName :"userStores"
                                }).done(function(datas){
                                    if(datas.success){
                                        var $yuyue = datas.result;
                                        if($yuyue.status == '0'){
                                            window.location.href = '//item'+cookieDomain+'/yuyue/' + prdInfo.prdId + '-' + prdInfo.sku + '.html';
                                        }else if(parseInt($yuyue.status) > 0) {
                                            window.location.reload();
                                        }
                                    }
                                });
                            });
                        });
                    //悬浮小购物车特殊处理
                    yqDetailActions.addCarActions("立即预约",function(){$('#yuyue').click();},{"color":"#fff","background":"#c00"});
                    break;
                case '1'://已预约
                    $('#yuyue_daojishi').find('.prdLeft').html('距&nbsp;&nbsp;开&nbsp;&nbsp;抢');
                    yqDetailActions.yqBtnEnable('#yuyue','已预约');
                    //悬浮小购物车特殊处理
                    yqDetailActions.addCarActions("已预约",function(){ return false;});
                    //预约按钮处理
                    yqDetailActions.removeClassBtn('btn-appointment','btn-unappointment');
                    break;
                case '2'://已约满
                    var btnstr="";
                    yuyue.phasesatue ? btnstr="未预约" : btnstr="已约满"
                    yqDetailActions.yqBtnEnable('#yuyue','<p class="btn-ptit">'+btnstr+'</p><p class="btn-pwen">(限预约用户抢购)</p>');
                    yuyue_warp.css({'background':'#ccc'});
                    yuyue_warp.find('#priceLable').html(btnstr);
                    $('#yuyue_daojishi').find('.prdLeft').html('距&nbsp;&nbsp;结&nbsp;&nbsp;束');
                    yqDetailActions.removeClassBtn('btn-appointment','btn-unappointment');
                    var $subscrice = $('#yuyue_daojishi');
                    $subscrice.find('#yushouCount').html('<span>已有</span><strong>'+ (yuyue.number || '0') +'</strong><span>人成功预约</span>');
                    $subscrice.show();
                    yuyue.phasesatue?$("#yushouCount").hide():""
                    //悬浮小购物车特殊处理
                    yqDetailActions.addCarActions(btnstr,function(){ return false;});
                    break;
                case '3'://预热
                   $('#yuyue_daojishi').find('.prdLeft').html('距&nbsp;&nbsp;结&nbsp;&nbsp;束');
                    yqDetailActions.yqBtnEnable('#yuyue','<p class="btn-ptit">未预约</p><p class="btn-pwen">(限预约用户抢购)</p>');
                    yuyue_warp.css({'background':'#ccc'});
                    yuyue_warp.find('#priceLable').html('未预约');
                    yqDetailActions.removeClassBtn('btn-appointment','btn-unappointment');
                    var $subscrice = $('#yuyue_daojishi');
                        $subscrice.find('#yushouCount').html('<span>已有</span><strong>'+ (yuyue.number || '0') +'</strong><span>人成功预约</span>');
                        $subscrice.show();
                    yuyue.phasesatue?$("#yushouCount").hide():""
                    //悬浮小购物车特殊处理
                    yqDetailActions.addCarActions("未预约",function(){ return false;});
                   /* $('#yuyue')
                        .html('即将开始')
                        .removeClass("bigbtn disabled")
                        .addClass('yuyue_pre_start').css({'background':'#5a9b61','cursor':'default'})
                        .show();
                    $("#yushouCount").hide();
                    if(prdInfo.price == "敬请期待") {
                        yuyue_warp.find('.prdLeft').css({'font-size':'18px','font-family':'微软雅黑'}).html('敬请期待');
                        yuyue_warp.find('.prdRight').css({'width':'500px'});
                        yuyue_warp.find('#promoPrice').remove();
                    }

                    yuyue_warp.css({'background':'#5a9b61'}).find('#priceLable').html('即将开始');
                    yuyue_warp.find('#priceLable').css({'color':'#5a9b61'});
                    daojishi_warp.find('.prdLeft').html('即将开始：').end().find('em').css({'background':'#abccae'}).end().find('strong').css({'color':'#5a9b61'});
                    //悬浮小购物车特殊处理
                    yqDetailActions.addCarActions("即将开始",function(){ return false;},{"cursor":"default","color":"#fff","background":"rgb(90, 155, 97)"});*/
                    break;
                    case '4'://立即预约
                        //预约后端默认返回无货状态，所以不用进行有无货判断

                        if(yuyue.phasesatue){ //未登录预约结束，抢购未开始展示立即抢购
                            $('#yuyue').html('立即抢购');
                            $('#yuyue_daojishi').find('.prdLeft').html('距&nbsp;&nbsp;结&nbsp;&nbsp;束');
                            yuyue_warp.find('#priceLable').html('抢购中');
                            $("#yushouCount").hide();
                        }else{
                            $('#yuyue').html('立即预约');
                            $('#yuyue_daojishi').find('.prdLeft').html('距&nbsp;&nbsp;开&nbsp;&nbsp;抢');
                        }
                            $('#yuyue')
                            .removeClass("bigbtn disabled")
                            .addClass('bigbtn')
                            .show()
                            .click(function () {

                                g.login(function () {

                                    $.ajax({
                                        type: 'get',
                                        url: '//ss'+cookieDomain+'/item/v1/d/reserve/p/detail/'+prdInfo.prdId+'/'+prdInfo.sku+'/'+ $.cookie('SSO_USER_ID')+'/'+g.cityCode(2)+'/flag/item/userStores',
                                        dataType: 'jsonp',
                                        jsonpName :"userStores"
                                    }).done(function(datas){
                                        if(datas.success){
                                            var $yuyue = datas.result;
                                            if($yuyue.status == '0'){
                                                window.location.href = '//item'+cookieDomain+'/yuyue/' + prdInfo.prdId + '-' + prdInfo.sku + '.html';
                                            }else if(parseInt($yuyue.status) > 0) {
                                                window.location.reload();
                                            }
                                        }
                                    });
                                });
                            });
                        //悬浮小购物车特殊处理
                        yqDetailActions.addCarActions("立即预约",function(){$('#yuyue').click();},{"color":"#fff","background":"#c00"});
                        yuyue.phasesatue?$("#addCartLink").html("立即抢购"):""
                        break;
            }
        } else {
            //测试时候用的
            //data.userStores.phase='2';
            if (data.userStores.phase==='2') {
                $("#addCartLink").addClass("btnYuQiang");
                var qianggou = data.userStores;
                //无货或下架
                $('#yuyue_daojishi').find('.prdLeft').html('距&nbsp;&nbsp;结&nbsp;&nbsp;束');
                //yqDetailActions.autoStockTxt();
                yuyue_warp.find('#priceLable').html('抢购中');
                if(prdInfo.price) {
                    yuyue_warp.find('#promoPrice').html("¥" + prdInfo.price);
                }
                yuyue_warp.find('.prdLeft').html('抢购价').end().show();
                var t1 = new Timer({
                    milliseconds: qianggou.endTime-qianggou.current,
                    interval: 500,
                    immediately: true,
                    callback: function (milliseconds) {
                        var $subscrice = $('#yuyue_daojishi');
                        $subscrice.find('em.d').html(dateInfo(milliseconds).days);
                        $subscrice.find('em.h').html(dateInfo(milliseconds).hours);
                        $subscrice.find('em.m').html(dateInfo(milliseconds).minutes);
                        $subscrice.find('em.s').html(dateInfo(milliseconds).second);
                        $subscrice.find('#yushouCount').html('<span>已有</span><strong>'+ (qianggou.number || '0') +'</strong><span>人成功预约</span>').hide();
                        $subscrice.show();
                        if(parseInt(milliseconds)<=0){
                            $("#qianggou").text("已结束");
                            $("#priceLable").text("已结束");
                            yuyue_warp.css({'background':'#ccc'}).find('.priceLable').html('已结束');
                            //悬浮小购物车特殊处理
                            yqDetailActions.addCarActions("已结束",function(){ return false;});
                        }
                    },
                    fnEnd: function () {
                        window.location.href = window.location.href;
                    }
                });

                t1.run();

                switch(qianggou.status) {
                    case '0':
                        if (data.stock && !data.stock.status){
                            yqDetailActions.yqBtnEnable('#qianggou','立即抢购');
                            //悬浮小购物车特殊处理
                            yqDetailActions.addCarActions("立即抢购",function(){ return false;});
                            return false;
                        }
                        $('#qianggou')
                            .html('立即抢购')
                            .show()
                            .click(function () {
                                $('#qianggou').attr('running', true);
                                g.login(function () {
                                    $.ajax({
                                        type: 'get',
                                        url: '//ss'+cookieDomain+'/item/v1/d/reserve/p/detail/'+prdInfo.prdId+'/'+prdInfo.sku+'/'+ $.cookie('SSO_USER_ID')+'/'+g.cityCode(2)+'/flag/item/userStores',
                                        dataType: 'jsonp',
                                        jsonpName :"userStores"
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
                                                    pcount: $("#enterQty").val(),
                                                    _r: new Date().getTime()
                                                }
                                                //添加购物车
                                                $.createProgress({
                                                    Jump:false,
                                                    url:url,
                                                    data:addCartData ,
                                                    callback:function(data){
                                                        $('#easyShopping').data('running', false);
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
                        //悬浮小购物车特殊处理
                        yqDetailActions.addCarActions("立即抢购",function(){ $('#qianggou').click(); },{"color":"#fff","background":"#c00"});
                        break;
                    case '1':
                        yqDetailActions.yqBtnEnable('#qianggou','<p class="btn-ptit">未预约</p><p class="btn-pwen">(限预约用户抢购)</p>');
                        //悬浮小购物车特殊处理
                        yqDetailActions.addCarActions("未预约",function(){ return false;});
                        break;
                    case '2':
                        yqDetailActions.yqBtnEnable('#qianggou','已购买');
                        $("#yushouCount").hide();
                        //悬浮小购物车特殊处理
                        yqDetailActions.addCarActions("已购买",function(){ return false;});
                        break;
                    case '4':
                        if (data.stock && !data.stock.status){
                            yqDetailActions.yqBtnEnable('#qianggou','立即抢购');
                            //悬浮小购物车特殊处理
                            yqDetailActions.addCarActions("立即抢购",function(){ return false;});
                            return false;
                        }
                        $('#qianggou')
                            .html('立即抢购')
                            .show()
                            .click(function () {
                                $('#qianggou').attr('running', true);
                                g.login(function () {
                                    $.ajax({
                                        type: 'get',
                                        url: '//ss'+cookieDomain+'/item/v1/d/reserve/p/detail/'+prdInfo.prdId+'/'+prdInfo.sku+'/'+ $.cookie('SSO_USER_ID')+'/'+g.cityCode(2)+'/flag/item/userStores',
                                        dataType: 'jsonp',
                                        jsonpName :"userStores"
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
                                                    pcount: $("#enterQty").val(),
                                                    _r: new Date().getTime()
                                                }
                                                //添加购物车
                                                $.createProgress({
                                                    Jump:false,
                                                    url:url,
                                                    data:addCartData ,
                                                    callback:function(data){
                                                        $('#easyShopping').data('running', false);
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
                        //悬浮小购物车特殊处理
                        yqDetailActions.addCarActions("立即抢购",function(){ $('#qianggou').click(); },{"color":"#fff","background":"#c00"});
                        break;
                }
            }
        }
        $("#reduce").hide();
    }
});

//部分促销信息

EventManager.on('CU_XIAO_YU', function (data) {
    /* 显示促销语 */
    if (data.desc && prdInfo.stats!=='6') {//3d详情页 不显示
        /* 替换促销语中的链接 */
        var _str = { lt: '<', gt: '>', a034: '"', amp: '&', nbsp: '' }, _de = data.desc.replace(/#/g, 'a');
        var _tx = _de.replace(/&(.*?);/g, function (_e, _e1) { return _str[_e1] ? _str[_e1] : _e; });
        $("#prdtitcx").html(_tx);
    }

});

EventManager.on('HAO_PING_DU', function (data){
    /* 好评度 好评人数 */
    if (data.appraise && data.appraise.comments) {
        $("#pincnt").html(data.appraise.comments);
        $('.pingjia_header').html('商品评价 <span class="c00">（' + data.appraise.comments + '）</span>');
        if(data.appraise.goodCommentPercent) $("#haocnt").html(data.appraise.goodCommentPercent + "%");
        setTimeout(function(){
            /* 同步用户评价条数 开始 */

                g.ajax("//apis"+cookieDomain+"/p/pls?from=callback_pls&module=infPLS&productId=" + prdInfo.prdId + "&pls=" + data.appraise.commentsOld,
                    {
                        site: 'f'
                    });

            /* 同步用户评价条数 结束 */
        },5000);
    }else {
        $('.pingjia_header').html('商品评价 <span class="c00">（0）</span>');
    }
});





/*美通卡购物车那块显示规则*/


EventManager.on('CARDTYPE', function () {
   var cardType=prdInfo.sapSkuType;
   if(cardType=='ZSTK' || cardType=='ZDZK'){
        $('#btnLink a,.shareGold').addClass('dn');   //美通卡不支持分享拿提成
        $('#addCart').removeClass('dn');
        $('#pay_fenQi').css('display','none');
   }
});


//增加白拿的展示
EventManager.on('CU_XIAO_BAI_NA', function (data) {
    var baiNa='//baina'+cookieDomain+'/MainController/productInfo.dhtml?pps='+prdInfo.prdId+'_'+prdInfo.sku;

    if(data.baina && data.baina.advertisement && data.baina.textLink){
       $('.tese,.baina').removeClass('dn');
       $(".baina a").html(data.baina.advertisement).attr("href", baiNa);
    }

});



/*电信卡合约机等*/
EventManager.on('HE_YUE_JI', function (data) {
    if(prdInfo.sapSkuType=="ZHK" || prdInfo.sapSkuType=="ZLH" || prdInfo.sapSkuType=="ZHYJ"){
        //电信合约机的套餐
        var saleId="";
        $('#salesProperty .prdLeft').each(function(){ //非常坑的操作  因为无法区分销售属性的
         if($(this).html() == "合约套餐"){
                  saleId=$(this).next().find('a.select').attr('saleid');
            }
        })

        $.ajax({
            url:"//ss"+cookieDomain+"/item/v1/d/telcomnumber/desc/"+saleId+"/"+g.cityCode(2)+"/flag/item/telecom_info",
            type:'get',
            dataType:'jsonp',
            jsonpName:'telecom_info',
            success:function(data){
                if(data.success && data.result && data.result.desc){
                    $('#telecom_info').html(data.result.desc);
                    $('.heyuetaocan').removeClass('hide');
                }
            }
        })
    }

})


//极性卡验证库存
EventManager.on('ZI_TELECOM_JI', function (data) {
    if(prdInfo.sapSkuType=="ZJXK" ){
        //http://ss.atguat.com.cn/item/v1/teleStock/validate/whiteCard/sku26170018/11010000/flag/item
        var snum=new Date().getTime();
        var jixin={};
        var diefn = ["KU_CUN", "BUTTON_INFO","otherGoodsRecommend"];
        $.ajax({
            url:"//ss"+cookieDomain+"/item/v1/teleStock/validate/whiteCard/"+prdInfo.sku+"/"+g.cityCode(2)+"/flag/item/z"+snum,
            type:'get',
            dataType:'jsonp',
            jsonpName:'z'+snum,
            success:function(data){
                if(data.success && data.result){
                    jixin=data.result;
                    for (var i = 0, k = diefn.length; i < k; i++) {
                        EventManager.fireEvent(diefn[i], jixin);
                    }
                };

            }
        });

    }
    if(prdInfo.sapSkuType=="ZJXK" || prdInfo.sapSkuType=="ZJXJ"){
        /*温馨提示加提示语*/
        $('.wenxinti').append('<li><a href="//help.gome.com.cn/article/387-409-0.html" target="_blank">请阅读极信产品购买说明</a></li>');
     }

});

/*自营的合约机*/

EventManager.on('ZI_TELECOM_PLAN', function (data) {

    /*自营的合约机*/
    if(prdInfo.sapSkuType=="ZJXJ" ){  //合约机套餐
        var ziurl="";
        var snum=new Date().getTime();
        $('#zi_telecom .prdLeft').each(function(){ //非常坑的操作  因为无法区分销售属性的
         if($(this).html() == "套餐计划"){
                  ziurl=$(this).next().find('a.select').attr('Tskuid');
             };
        });

        /*请求渲染合约套餐*/
        $.ajax({
            url:"//ss"+cookieDomain+"/item/v1/d/telcomnumber/packages/"+ziurl+"/flag/item/z"+snum,
            type:'get',
            dataType:'jsonp',
            jsonpName:'z'+snum,
            success:function(data){
                if(data.success && data.result && data.result.packages && data.result.packages.length>0){
                    var packages=data.result.packages;
                    var str="";

                    $.each(packages,function(k,v){
                        if(k==0){
                           str+= '<div class="prdmod"><a href="javascript:void(0);" class="select" title="'+v.packageName+'" data-alt="'+v.packageName+'" saleId="'+v.imPackageId+'" >'+v.packageName+'<i></i></a></div>'
                       }else{
                            str+='<div class="prdmod"><a href="javascript:void(0);"  title="'+v.packageName+'" data-alt="'+v.packageName+'" saleId="'+v.imPackageId+'" >'+v.packageName+'<i></i></a></div>'
                       }

                    })
                    $('#zi_telecom_plan').html(str).parent().removeClass('hide');

                }
            }
        })

    }
});
  /*美信接口data.userStores && data.userStores.rebate*/

EventManager.on('MEIXIN_JIEKOU', function (data) {
    var str_mei='';
    if(prdInfo.prdType == 2 || data.userStores.phase==='1' || data.userStores.phase==='2'){
        $('.shareGold').html("<i></i>分享");
        return false;
    }
    if(data.userStores && data.userStores.sharerebate && data.userStores.sharerebate>0){
        str_mei='<div class="mfprice_box hide">\
            <i class="mfprice_box_arror"></i>\
            <p class="mfprice_box_backbox"></p>\
            <p class="mfprice_box_tit">返利说明</p>\
            <p>分享且被购买预计最高可得'+data.userStores.sharerebate+'国美币，请在国美APP查看。<br><span id="mfprice_box_url" class="mfprice_box_url">帮助</span></p>\
            </div>\
            <i></i>分享赚¥'+data.userStores.sharerebate;
        $('.prd-firstscreen-left .toolbar a').css('margin-left','6px');
        prdInfo.meixinp='1';
    }else{
        str_mei="<i></i>分享";
    };
    $('.shareGold').html(str_mei);
});
EventManager.on('MEIXIN_DIANPU', function (data) {
  var mid=getQueryString('mid');//美店id
  var stid=getQueryString('stid');//美店shopid
  if(mid && !prdInfo.ispecial && !(data.userStores.phase==='1' || data.userStores.phase==='2')){//套装 美通卡 电信卡不做处理 预约

        $.ajax({
            type: 'get',
            url: '//ss' + cookieDomain + '/item/v1/d/mshop/info/'+mid+'/flag/item/mdInfo',
            dataType: 'jsonp',
            jsonpName: 'mdInfo'
        }).done(function(data){
            if(!data.success || $.isEmptyObject(data.result)){
                return false;
            };
            var data=data.result;
            $('.services-score,.services-stars,.store-logo,.btn-collect,.phone-wrapper,.company-wrapper').remove();//服务评分模块删除
            if($('.stores-infos').length==0){  //纯自营
               $('.shops-name').append($('<a class="name" target="_blank"></a>'));
               $('.dt-side').prepend($('<div class="stores-infos">\
                <div class="zy-stores">\
                    <h2 class="fix-storesname" id="store_live800_wrap">\
                            <a class="name"  target="_blank"></a>\
                            <a href="javascript:;" class="online-service icon-service"  ><i></i></a>\
                    </h2>\
                </div>\
            </div>'));
            };
            $('a.name').html(data.vshopName).attr('href',"//meidian"+cookieDomain+"/shop-"+mid+".html").attr('title',data.vshopName);//美店店铺名字以及url
            $('.btn-group a').attr('href',"//meidian"+cookieDomain+"/shop-"+mid+".html");
            $('#pay_fenQi,#easyShopping,#mobtn,#btnJoinEnergy,.mobile-orders-wrapper').hide(); //该隐藏的都隐藏
            /*评分部分*/
               data.descriptionScore?data.descriptionScore=Number(data.descriptionScore).toFixed(2):data.descriptionScore=4.5
               data.deliveryScore?data.deliveryScore=Number(data.deliveryScore).toFixed(2):data.deliveryScore=4.5
               data.seviceScore?data.seviceScore=Number(data.seviceScore).toFixed(2):data.seviceScore=4.5
               TemplateEngine.helper('scorearrow',function(score){
                if(!score || score==0){
                    return '<small class="xiangdeng">-&nbsp;&nbsp;&nbsp;—</small>';
                }else{
                    if(score>0){
                    return '<small title="计算规则：（商家得分-同行业平均分）/（同行业商家最高得分-同行业平均分）" class="gaoyu_text">'+Number(score).toFixed(2)+'%</small><i  class="gaoyu">箭头</i>';
                    }else{
                        return '<small title="计算规则：（商家得分-同行业平均分）/（同行业商家最高得分-同行业平均分）" class="diyu_text">'+(Number(-score).toFixed(2))+'%</small><i class="diyu">箭头</i>';
                        }
                }
               })
            var scoretpl=' <p><span class="detail">评分明细</span><span class="contrast">与行业对比</span></p>\
                                    <div class="describe ">\
                                        <p>商品描述：<span><%=this.descriptionScore %> </span> <%= scorearrow(this.descriptionCompareRate) %> </p>\
                                    </div>\
                                    <div class="logistics">\
                                        <p>发货速度：<span><%=this.deliveryScore %> </span> <%= scorearrow(this.deliveryCompareRate) %> </p>\
                                    </div>\
                                    <div class="services">\
                                        <p>服务质量：<span><%=this.seviceScore %> </span> <%= scorearrow(this.seviceCompareRate) %> </p>\
                                    </div>';
               var scoretplhtml = TemplateEngine(scoretpl, data);
               $('.services-score-detail').html(scoretplhtml);
        });
  };

});
//国美秒杀，促销氛围图
EventManager.on('SHOW_ATMOSPHERE', function (data) {
    /*if(!prdInfo.shopNo || prdInfo.shopNo == '') {*/
        var figure = '';//图片html
        if (data.userStores && data.userStores.atmosphereResult) {
            var atmosphereResult = data.userStores.atmosphereResult;
            var preHeatSlogan=data.preHeatSlogan;
            if(preHeatSlogan && (preHeatSlogan.status==0 || preHeatSlogan.status==1)){
                return false;
            }
            //后台允许不配置链接，如果配置链接添加a标签，不配置链接直接展示图片
            if(atmosphereResult.imgHref && atmosphereResult.imgHref != '') {
                figure = '<a href="' + atmosphereResult.imgHref + '" target="_blank"><img gome-src="' + atmosphereResult.imgUrl + '"></a>';
            }else {
                figure = '<img gome-src="' + atmosphereResult.imgUrl + '">';
            };
            var t1 = new Timer({
                milliseconds: atmosphereResult.endTime - atmosphereResult.currentTime,
                interval: 500,
                immediately: true,
                callback: function (milliseconds) {
                    if (atmosphereResult.startTime && atmosphereResult.startTime != '') {
                        if (milliseconds > 0) {
                            if(atmosphereResult.imgUrl && atmosphereResult.imgUrl != '') {
                                //预约和抢购的商品屏蔽氛围图
                                if(data.userStores.phase && (data.userStores.phase === '1' || data.userStores.phase === '2')) {
                                    $(".prd-atmosphere-wrapper").hide();
                                }else {
                                    $(".prd-atmosphere-wrapper").show();
                                    $(".pa-figure").html(figure).loadsrc('gome-src');
                                }
                            }
                            var time = dateInfo(milliseconds);
                            //如果天数小于10，天数前面添加0
                            time.days = time.days < 10 ? time.days.replace(0, '') : time.days;
                            var html = '';//倒计时html
                            //小于2天展示倒计时
                            if (time.days < 2) {
                                //还剩1天时间显示距离结束还有1天
                                if(time.days == 1) {
                                    $(".endtime-tip").html('距离结束还有' + "&nbsp;<b>" + time.days + "</b>&nbsp;" + '天');
                                }
                                //剩于0天展示距离活动结束
                                else if (time.days == 0) {
                                    $(".endtime-tip").html('距离活动结束');
                                }
                                time.hours ? html += '<span class="cd-hours">' + time.hours + '</span><em>:</em>' : ""
                                time.minutes ? html += '<span class="cd-minutes">' + time.minutes + '</span><em>:</em>' : ""
                                time.second ? html += '<span class="cd-second">' + time.second + '</span>' : ""
                                $(".count-down").html(html);
                            }
                        }
                    } else {
                        $(".prd-atmosphere-wrapper").hide();
                        return false;
                    }
                },
                fnEnd: function () {
                    window.location.href = window.location.href;
                }
            });
            t1.run();
        }
   /* }*/
});
function tqallstore(arr){
    $.when($.ajax({
        type: 'get', /*ceshi 869473036  $.cookie('SSO_USER_ID')*/
        url: '//ss' + cookieDomain + '/item/v1/d/m/store/unite/' + prdInfo.prdId + '/' + prdInfo.sku + '/N/' + g.cityCode(3) + '/' + g.cityCode(4) + '/1/'  + $.cookie('SSO_USER_ID') + '/flag/item/tqstore',
        dataType: 'jsonp',
        jsonpName: "tqstore"
    }).done(function(data){
        if (data.success && !$.isEmptyObject(data.result)) {
            $.extend(allStore, data.result);
        }
    }),
    $.ajax({
        type: 'get',
        url: '//ss' + cookieDomain + '/item/v1/d/reserve/p/detail/' + prdInfo.prdId + '/' + prdInfo.sku + '/' + $.cookie('SSO_USER_ID') + '/' + g.cityCode(2) + '/flag/item/tquser',
        dataType: 'jsonp',
        jsonpName: "tquser"
     }).done(function (data) {
        if (data.success && !$.isEmptyObject(data.result)) {
           allStore.userStores=data.result;
        }
    })).then(function(){
        var tqinfo = arr;  //涉及团抢促销免运费等的操作开始的模块
         for (var i = 0, k = tqinfo.length; i < k; i++) {
             EventManager.fireEvent(tqinfo[i], allStore);
         }
    })
}
//国美团抢合并
EventManager.on('GOME_TQ', function (data) {
    var preHeatSlogan=data.preHeatSlogan;
        var tq_str=' <div class="zBargain">\
            <i class="ztime"></i>\
             <span>国美<% if(this.saleType == "RUSHBUYPRICE") {%> 抢购<% }else{%> 团购<%}%> </span>\
             <% if(this.status == 0) {%> \
                <p>此商品预计<%= this.preinfo %> 参加<% if(this.saleType == "RUSHBUYPRICE") {%> 抢购<% }else{%> 团购<%}%>\
                <p><% if(this.saleType == "RUSHBUYPRICE") {%> 抢购<% }else{%> 团购<%}%> 价&nbsp;:&nbsp;¥<%= this.preheatPrice%> </p>\
             <% }else{%> \
                <p><b><%= this.buyerCount%> </b>人已购，距离结束还有<% if(this.ismore) {%> <em><%= this.days%> </em>天<em><%= this.hours%> </em>时  <% }else{%>  <em><%= this.hours%> </em>:<em><%= this.minutes%> </em>:<em><%= this.second%> </em> <%}%> </p>\
             <%}%>\
        </div>\
        <img src="<% if(this.status == 0) {%> //gfs10.gomein.net.cn/T11_YvBmA_1RCvBVdK.png<% }else{%> //gfs10.gomein.net.cn/T11hZvBvbj1RCvBVdK.png<%}%> ">';



        if(preHeatSlogan && preHeatSlogan.status==0){
            /*团抢预热*/
            var pretime=dateInfo(preHeatSlogan.realStartTime-preHeatSlogan.currentTime);
            var preinfo="";
            /*中间值*/
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            today.setMilliseconds(0);
            var oneday = 1000 * 60 * 60 * 24,
                cur12=today*1+oneday, /*取今天晚上12点整的时间戳*/
                endTime= new Date(preHeatSlogan.realStartTime),
                tommorow=endTime-cur12,
                endTimeM="",   /*处理今天  明天的逻辑*/
                endTimeD="",
                endTimeMS="",
                endTimeS="";
                endTime.getMonth()+1<10?endTimeM="0"+(endTime.getMonth()+1):endTimeM=endTime.getMonth()+1
                endTime.getDate()<10?endTimeD="0"+endTime.getDate():endTimeD=endTime.getDate()
                endTime.getHours()<10?endTimeMS="0"+endTime.getHours():endTimeMS=endTime.getHours()
                endTime.getMinutes()<10?endTimeS="0"+endTime.getMinutes():endTimeS=endTime.getMinutes()
            if(pretime.days*1>=2 || (pretime.days>=1  && tommorow>0 && tommorow-oneday>=0)){
                 preinfo=endTimeM+'月'+endTimeD+'日'+endTimeMS+':'+endTimeS;

            }else if((pretime.days*1>=1 && pretime.days<2) || (pretime.days>=0 && tommorow>=0 && tommorow-oneday<=0)){
                 preinfo='明日'+endTimeMS+':'+endTimeS;

            }else if(pretime.days*1==0 && tommorow<0){
                preinfo='今日'+endTimeMS+':'+endTimeS;
            }
            preHeatSlogan.preinfo=preinfo;
            var _html = TemplateEngine(tq_str, preHeatSlogan);
            $('.pa-figure').html(_html);
            data.stock && data.stock.status && prdInfo.prdType != 2?$('.prd-atmosphere-wrapper').show():""
                var t2 = new Timer({
                    milliseconds: preHeatSlogan.realStartTime-preHeatSlogan.currentTime,
                    interval: 500,
                    immediately: true,
                    callback: function (milliseconds) {

                    },
                    fnEnd: function () {/*倒计时结束再次回调  询问产品说预热中的价格肯定是抢购中的抢购价*/
                        allStore= data;
                        allStore.preHeatSlogan.currentTime=preHeatSlogan.realStartTime;
                        allStore.preHeatSlogan.status=1;
                        allStore.gomePrice.salePrice=preHeatSlogan.preheatPrice;
                       var diefn = ["SHOW_PRICE","GOME_TQ"];  //涉及团抢开始的模块
                       prdInfo.cnumber=0;
                        for (var i = 0, k = diefn.length; i < k; i++) {
                            EventManager.fireEvent(diefn[i], allStore);
                        }
                        /*请求最新数据*/
                        tqallstore(["delivery","CUXIAO_INFO","MobilePrice","REMAIN","CU_XIAO_LANJUAN"])
                        $('.prd-cuxiao-other').removeAttr("style");

                }});

            t2.run();

         }else if(preHeatSlogan && preHeatSlogan.status==1){
                data.stock && data.stock.status && prdInfo.prdType != 2?$('.prd-atmosphere-wrapper').show():""
                /*操作价格展示*/
                var str="";
                preHeatSlogan.saleType == "RUSHBUYPRICE"?str="抢&nbsp;&nbsp;购&nbsp;&nbsp;价":str="团&nbsp;&nbsp;购&nbsp;&nbsp;价"
                $('.Crossedprice').remove();
                $('#prdPrice').after('<del class="Crossedprice">¥'+preHeatSlogan.lineation+'</del>').parent().prev().html(str);
                if(!(preHeatSlogan.lineation) || preHeatSlogan.lineation==prdInfo.price){
                    $('.Crossedprice').hide();
                }
            /*团抢开始*/
                var t1 = new Timer({
                    milliseconds: preHeatSlogan.realEndTime-preHeatSlogan.currentTime,
                    interval: 500,
                    immediately: true,
                    callback: function (milliseconds) {
                        var cuxiaolen=$('.promotions-collapse').find('.prd-promotions-red').length;
                        if(prdInfo.cnumber==0 && cuxiaolen==0){
                            $('.prd-cuxiao-other').addClass('dn');
                        }
                        var time = dateInfo(milliseconds);
                        if(milliseconds>172800000){
                            preHeatSlogan.ismore=true;
                            preHeatSlogan.days=time.days;
                            preHeatSlogan.hours=time.hours;
                        }else{
                            preHeatSlogan.ismore=false;
                            preHeatSlogan.hours=(time.days*24)+time.hours*1;
                            preHeatSlogan.hours<10?preHeatSlogan.hours='0'+preHeatSlogan.hours:""
                            preHeatSlogan.minutes=time.minutes;
                            preHeatSlogan.second=time.second;
                        }
                        var _html = TemplateEngine(tq_str, preHeatSlogan);
                        $('.pa-figure').html(_html);
                    },
                    fnEnd: function () {
                      window.location.reload();
                }});
            t1.run();

         }


});

//普通商品详情页增加预售入口
// {
//     "status":"预售状态",//预售中:buying ，当且仅当status存在且值为buying时代表商品预售中，之后的属性才存在
//     "deposit":"定金",
//     "price":"预售价",
//     "endTime":"预售结束时间",//时间戳，long类型
//     "currentTime":"系统当前时间",//时间戳，long类型
//     "isNormalSell":"是否允许主站同时售卖",// true正常售卖   false 不允许售卖
//     "presaleUrl":"预售详情页地址"
// }

EventManager.on('PRESALE_ENTRANCE', function (data) {
    var time = new Date().getTime();//设置时间戳，实时调用接口，避免倒计时当前时间有缓存
    var data=data;
    $.ajax({
        type: 'get',
        url: "//ss" + cookieDomain + '/item/v1/d/presale/getByProductSku/'+ prdInfo.prdId +'/' + prdInfo.sku+ '/' + g.cityCode(3) + '/' + g.cityCode(4) +'/flag/item/presale' + time,
        dataType: 'jsonp',
        jsonpName: "presale" + time
    }).done(function (res) {
        if (res && res.result) {
            var _res = res.result;
            if (_res.status && _res.status == "buying") {
                $(".yushou-entrance").removeClass('hide');
                if (_res.deposit) {
                    $(".yushou-entrance .deposit").removeClass('hide');
                    $(".yushou-entrance .deposit .txt").html(_res.deposit);
                }
                if (_res.price) {
                    $(".yushou-entrance .presale-price").removeClass('hide');
                    $(".yushou-entrance .presale-price .txt").html(_res.price);
                }
                $(".yushou-entrance .goToYushou").attr('href', _res.presaleUrl);
                if (!_res.isNormalSell) {
                    $(".btn-yushou").removeClass('hide').attr('href', _res.presaleUrl);
                    //预售阶段：加入购物车，节能补贴，快速购，美易分，分期购，手机下单不展示
                    $("#addCart, #btnJoinEnergy, #telecom_buy, #mobtn").addClass('hide');
                    $("#easyShopping, #pay_fenQi, .btn-meiyifen").addClass('dn');
                }
                if (_res.endTime && _res.currentTime) {
                    $(".yushou-entrance .countdown").removeClass('hide');
                    var t1 = new Timer({
                        milliseconds: _res.endTime - _res.currentTime,
                        interval: 500,
                        immediately: true,
                        callback: function (milliseconds) {
                            if (milliseconds > 0) {
                                var time = dateInfo(milliseconds);
                                time.days = time.days < 10 ? time.days.replace(0, '') : time.days;
                                var html = '';//倒计时html
                                if (time.days >= 1) {
                                    time.days ? html += '<span class="cd-txt cd-days">' + time.days + '</span><em class="cd-em">天</em>' : ""
                                }
                                time.hours ? html += '<span class="cd-txt cd-hours">' + time.hours + '</span><em class="cd-em">:</em>' : ""
                                time.minutes ? html += '<span class="cd-txt cd-minutes">' + time.minutes + '</span><em class="cd-em">:</em>' : ""
                                time.second ? html += '<span class="cd-txt cd-second">' + time.second + '</span>' : ""
                                $(".yushou-entrance .countdown").html(html);
                            }
                        },
                        fnEnd: function () {
                            window.location.href = window.location.href;
                        }
                    });
                    t1.run();
                }
            }else{

                if(prdInfo.preferential=="1" && !(data.userStores.phase && (data.userStores.phase === '1' || data.userStores.phase === '2'))){ // 预约 预售>苹果特惠》团抢

                    //请求苹果特惠https://ss.atguat.com.cn/item/v1/price/promogen/iphoneSale/%7bskuNo%7d
                    var time = new Date().getTime();//设置时间戳，实时调用接口，避免倒计时当前时间有缓存
                    $.ajax({
                        type: 'get',
                        url: "//ss" + cookieDomain + '/item/v1/price/promogen/iphoneSale/' + prdInfo.skuNo + '/flag/item/apple' + time,
                        dataType: 'jsonp',
                        jsonpName: "apple" + time
                    }).done(function(resData){

                        if (resData && resData.result){ // 有信息

                            var appleData=resData.result;
                            if(appleData.state=="onSale"){
                                   
                                $('#applePrice').html('<em>¥</em>'+appleData.promPrice);
                                $('#applebtn')
                                .attr('promId',appleData.promId)
                                .attr('threeActivityId',appleData.threeActivityId)
                                .attr('threeProductId',appleData.threeProductId);

                                $('.applePricecon,.appletip').removeClass('dn');
                                if(prdInfo.prdType != 2 && prdInfo.hasGoods != 'N')
                                $('#applebtn').removeClass('dn'); 

                            }


                        }
                    })
                }
            }
        }
    });
});

EventManager.on('SHENCE_MAIMA', function (data) {
 
    var is_goods=false;

    if(data.stock && data.stock.status){

      is_goods = true;
    
    }

    window.GomeSa &&  GomeSa.track('PageviewGood', {
        sku_id: prdInfo.sku,
        is_goods: is_goods,
        sale_price: prdInfo.price*1
    });

});