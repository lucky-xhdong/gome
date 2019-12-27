/**
 * 详情页初始化
 * @author guotingjie
 */
//给附近门店使用
var localStorage1="";
try{
    localStorage1 = window.localStorage;
}catch(e){

}
var showStoreStorage = {
    set: function (key, value, days) {
        // 如果localStorage1没有值，清除这条记录
        if (!value) {
            localStorage1.removeItem(key);
        } else {
            var Days = days || 1; // 默认保留1天
            var exp = new Date();
            localStorage1[key] = JSON.stringify({ value: value, expires: exp.getTime() + Days * 24 * 60 * 60 * 1000})
        }
    },
    get: function (name) {
        try {
            var o = JSON.parse(localStorage1[name]);
            if (!o || o.expires < Date.now()) {
                return null;
            } else {
                return o.value;
            }
        } catch (e) {
            return localStorage1[name];
        } finally {
        }
    },
    del: function (key) {
        if(localStorage1[key]) localStorage1.removeItem(key);
    }
};

var EventManager = new Gome.prd.Observer();



//价格
EventManager.on('SHOW_PRICE', function (data) {

    if (data.userStores && !data.userStores.visible) {
        prdInfo.price = "敬请期待";
    } else if (!$.isEmptyObject(data.gomePrice)) {
        //判断是否存在直降价
        prdInfo.price = data.gomePrice.salePrice; // 直降价
    } else {
        prdInfo.price = "暂无售价";
    }
    $('#prdPrice').html('<em>¥</em>' + prdInfo.price);
});


//发货地+自营服务
EventManager.on('SHOW_FAHOUDI', function (data) {

        if( prdInfo.sapSkuType=='ECTZ' || (data.stock && data.stock.deliveryServiceTag && data.stock.deliveryServiceTag=='0')){
            $('#service_bable').html('由<b class="fwline">国美</b>配送并提供保障监管。');
        }else if(data.stock && data.stock.deliveryServiceTag && data.stock.deliveryServiceTag=='1'){
            $('#service_bable').html('由<b class="fwline">国美</b>安排厂商配送并提供保障监管。');
        }else{
            if((!prdInfo.shopNo)){
                $('.fuwu').addClass('dn');
            }
        }



    if (data.stock && data.stock.deliverable && prdInfo.shopFlag === 1 && data.stock.shipingAddr) {
        //显示哪里发货
        $('#shipingAddr').html(",从" + data.stock.shipingAddr);
    } else {
        $('#shipingAddr').html("");
    }



});


EventManager.on('CUXIAO_INFO', function () {

    window.showMore = false;// 是否显示更多优惠按钮.
    TemplateEngine.helper('displayShortProm', function (promList) {

        var str = '', promList = promList || [], _maxLen = $('body').hasClass('w990') ? 20 : 40;

        for (var k = 0; k < promList.length; k++) {
            var p = promList[k] || {};

            str += p.desc.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#039;/g, "'");
            if (k != (promList.length - 1)) {
                str += '；';
            }

            // if (str.replace(/<[^>]+>/g, "").length > _maxLen) {
            //     str = str.replace(/<[^>]+>/g, "").substr(0, _maxLen) + '...';
            //     window.showMore = true;
            //     break;
            // }

          /*  if (p.type == "LYMANZENG") { // 联营满赠
                window.showMore = true;
            }*/
        }
        if (promList[0].swapbuyUrl && promList[0].swapbuyUrl != "null") {

            str += "<a href='" + promList[0].swapbuyUrl + "' target='_blank'>　详情 <i class='s-arrow'>></i></a>"
        }
        return str;
    });

    TemplateEngine.helper('displayLongProm', function (promList) {
        var str = '';
        for (var k = 0; k < promList.length; k++) {
            var p = promList[k] || {};

            str += p.desc;
            if (k != (promList.length - 1)) {
                str += '；';
            }

        }
        if (promList[0].swapbuyUrl && promList[0].swapbuyUrl != "null") {

            str += "<a href='" + promList[0].swapbuyUrl + "' target='_blank'>　详情 <i class='s-arrow'>></i></a>"
        }
        return str;
    });

});




EventManager.on('CUXIAO_INFO', function (data) {

    var _tpl = ' <div class="prd-promotions-red J-prom-bvalue" id="shoujizhuanxiang_box" style="display:none">\
                    <label>手机专享</label><span class="h1_red"><em class="h1_red_price" id="savemoney"></em><a href="javascript:void(0);" id="shoujizhuanxiang_saosao" class="link-scan-firstscreen">扫一扫 <i class="s-arrow">&gt;</i></a></span>\
                </div>\
                <div id="tuan_prom" class="prd-promotions-red" style="display:none;">\
                    <label class="hl_red_bg">团购</label><em class="h1_red_price">¥3699.00，</em><a href="#" target="_blank">立刻参加 <i class="s-arrow">&gt;</i></a>\
                </div>\
                <div class="promotions-collapse-wrapper">\
                    <div class="promotions-collapse">\
                    <% if(this.promArray && this.promArray.length > 0) {%>\
                        <%for (var i = 0 ; i < this.promArray.length; i++) { var promObj = this.promArray[i] || {};%>\
                            <% if(promObj.promType == "ZENGPIN") {%>\
                               <div class="prd-promotions-red J-prom-gift dn" >\
                                    <label>赠品</label>\
                                    <%if(promObj.promList[i].titleList && promObj.promList[i].titleList != "") {%>\
										<div class="prom-gift-list">\
											<div class="prom-gift-item" data-count="true">\
												<%for(var k=0;k<promObj.promList.length;k++) {%>\
													<% var titleList = promObj.promList[k].titleList;%>\
													<%for (var j = 0 ; j < titleList.length; j++) {%>\
														<a <% if(titleList[j].imghref != "") {%>  href="javascript:void(0) " <%} else {%> href="javascript:void(0);" <% } %> title="<%=titleList[j].title %> ">\
														   <img src="<%=titleList[j].image||\"\" %> " width="20" height="20" class="gift-img">\
														</a>\
														<em class="gift-number">× <%= promObj.promList[k].giftNumber %> </em>\
													<% }%>\
												<%}%>\
											</div>\
										</div>\
									<% } else {%>\
										<% if( displayShortProm(promObj.promList) ) {%>\
											<span class="hl_red" text="<%= displayShortProm(promObj.promList) %> ">\
												<%= displayShortProm(promObj.promList) %>\
											</span>\
										<% } %>\
									<% }%>\
                                </div>\
                            <% } else {%>\
                                <% if(promObj.promType == "LYMANZENG") {%>\
                                    <%for(var k=0;k<promObj.promList.length;k++) {%>\
                                        <% if (promObj.promList[k].zengType == 0) {%>\
                                            <div class="prd-promotions-red dn">\
                                                <label><%=promObj.promList[k].iconText || "" %> </label>\
                                                <span class="hl_red" text="<%=promObj.promList[k].desc%> ">\
                                                    <%=promObj.promList[k].desc%>\
                                                </span>\
                                                <div class="prom-gift-list" style="margin-left: 42px;">\
                                                    <div class="prom-gift-item" data-count="true">\
                                                        <% var titleList = promObj.promList[k].titleList || [];%>\
                                                        <%for (var j = 0 ; j < titleList.length; j++) {%>\
                                                            <a <% if(titleList[j].imghref != "") {%> target="_blank"  href="<%=titleList[j].imghref %> " <%} else {%> href="javascript:void(0);" <% } %> title="<%=titleList[j].title %> ">\
                                                               <img src="<%=titleList[j].image %> " width="20" height="20" class="gift-img">\
                                                            </a>\
                                                            <em class="gift-number">× <%= titleList[j].giftNum ? titleList[j].giftNum : 1 %> </em>\
                                                        <% }%>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        <% } else {%>\
                                            <div class="prd-promotions-red dn">\
                                                <label><%=promObj.promList[k].iconText || "" %> </label>\
                                                <span class="hl_red" text="<%=promObj.promList[k].desc%> ">\
                                                    <%=promObj.promList[k].desc%>\
                                                </span>\
                                                <div class="prom-gift-list" style="margin-left: 42px;">\
                                                    <div class="prom-gift-item" data-count="true">\
                                                        <% var titleList = promObj.promList[k].titleList || [];%>\
                                                        <%for (var j = 0 ; j < titleList.length; j++) {%>\
                                                            <a <% if(titleList[j].imghref != "") {%> target="_blank"  href="<%=titleList[j].imghref %> " <%} else {%> href="javascript:void(0);" <% } %> title="<%=titleList[j].title %> ">\
                                                                <img src="<%=titleList[j].image %> " width="20" height="20" class="gift-img">\
                                                            </a>\
                                                            <em class="gift-number">× <%= titleList[j].giftNum ? titleList[j].giftNum : 1 %> </em>\
                                                        <% }%>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        <%}%>\
                                    <%}%>\
                                <% } else {%>\
									<% if((prdInfo.shopNo && prdInfo.shopNo != "") && prdInfo.prdType != 2) {%>\
										<div class="prd-promotions-red dn">\
											<label><%=promObj.promName || "" %> </label><span class="hl_red" text="<%=displayLongProm(promObj.promList)%> "><%=displayShortProm(promObj.promList)%> </span>\
										</div>\
									<% } else {%>\
										<%for(var k=0;k<promObj.promList.length;k++) {%>\
											<div class="prd-promotions-red dn">\
												<label><%=promObj.promName || "" %> </label><span class="hl_red" text="<%=promObj.promList[k].desc %> "><%=promObj.promList[k].desc %> </span>\
												<% if(promObj.promList[k].swapbuyUrl && promObj.promList[k].swapbuyUrl != undefined) {%>\
													<a href="<%=promObj.promList[k].swapbuyUrl %> " target="_blank">　详情 <i class="s-arrow">></i></a>\
												<%}%>\
											</div>\
										<%}%>\
									<%}%>\
                                <% } %>\
                            <% } %>\
                        <% } %>\
                    <% } %>\
                </div>\
            </div>';

    var _html = TemplateEngine(_tpl, data);

    $('.prd-promotions').html("").html(_html);
});

//手机专享价
EventManager.on('MobilePrice', function (data) {
   var price = prdInfo.price;
   var preHeatSlogan=data.preHeatSlogan;
   if(preHeatSlogan && preHeatSlogan.status==1 && preHeatSlogan.price){
       price=preHeatSlogan.price;
   }
    if (parseInt(price) * 1 < 1 || prdInfo.prdType == 2) {
        return false;
    }
    $.ajax({
        type: 'get',
        url: '//ss' + cookieDomain + '/item/v1/prdetail/mobile/price/' + prdInfo.prdId + '/' + prdInfo.sku + '/' + g.cityCode(2) + '/flag/item/mobilePrice',
        dataType: 'jsonp',
        jsonpName: 'mobilePrice',
        success: function (data) {
             /*data.result={
                     endtime: 1490926371000,
                     price: 288,
                     exclusive: true,
                     current: 1489980495047
                        }*/
            if (data && data.result && data.result.exclusive && data.result.price && data.result.price < price && data.result.endtime) {
                var strbox='<div class="pop-scancode hide" id="shoujizhuanxiang_wrap">\
                        <i class="btn-arrow-left">左箭头</i>\
                        <div class="pop-inner">\
                            <img _src="//ss'+cookieDomain+'/item/v1/qr/verify/'+prdInfo.prdId+'/'+prdInfo.sku+'/flag/item"  alt="二维码">\
                            <div class="pop-tips">\
                                <span id="saoyisao_text">扫一扫立即购买</span>\
                                <p>手机专享价：<a id="app_price"></a></p>\
                                <p>距离结束还有<em id="less_day"></em>天<em id="less_hour"></em>时<em id="less_minute"></em>分</p>\
                            </div>\
                        </div>\
                    </div>';
                    $('.prd-promotions').append($(strbox));
                prdInfo.cnumber++;
                $('.prd-cuxiao-other').removeClass('dn');
                $('#shoujizhuanxiang_box').show();
                var prdDetailMobilePrice = data.result.price;
                $('#app_price').html('¥' + parseFloat(prdDetailMobilePrice).toFixed(2));
                $('#savemoney').html('立省¥' + (price - prdDetailMobilePrice).toFixed(2) + '，');

                $.gTimer({
                    ct: data.result.current,
                    et: data.result.endtime,
                    iEven: function () {
                        if (this.ct - this.et >= 0) {
                            prdInfo.cnumber--;
                            $("#shoujizhuanxiang_box").hide();
                            return false;
                        }
                    },
                    aEven: function () {
                        if (this.ct >= this.et) {
                             prdInfo.cnumber--;
                            $("#shoujizhuanxiang_box").hide();
                            return false;
                        }
                        var dd = Number(this.dt.format('$dd'));
                        var hh = Number(this.dt.format('$hh'));
                        var mm = Number(this.dt.format('$mm'));
                        var ss = Number(this.dt.format('$s'));

                        $('#less_day').html(dd);
                        $('#less_hour').html(hh);
                        $('#less_minute').html(mm);

                    },
                    lEven: function () {
                        prdInfo.cnumber--;
                        $('#shoujizhuanxiang_wrap').hide();
                    }
                });
            }else{
                $('#shoujizhuanxiang_box').hide();
            };

            /*促销展示*/
            function showcuxiao(n){

                if(n==0){
                    $('.promotions-collapse .prd-promotions-red').eq(0).removeClass('dn');
                    $('.promotions-collapse .prd-promotions-red').eq(1).removeClass('dn');
                }else if(n==1){
                    $('.promotions-collapse .prd-promotions-red').eq(0).removeClass('dn');
                }
                if($('.promotions-collapse-wrapper').find('div.prd-promotions-red').length>0){
                     $('.prd-cuxiao-other').removeClass('dn');
                }
                if($('.promotions-collapse-wrapper').find('div.prd-promotions-red').hasClass('dn')){
                    if($('.promotions-collapse .dn').length==1){
                        $('.promotions-collapse .dn').removeClass('dn');
                        return false;
                    }
                    var html='<div class="prd-promotions-red prd-promotions-globel">';
                    $('.promotions-collapse .dn').each(function(k,v){
                            html+='<label>'+$(this).find('label').html()+'</label>'
                    });
                     html+='<div class="more">更多优惠<i></i></div></div>'
                    $('.promotions-collapse').append(html);
                }
            }


            //会员价    
                if (!$.cookie('SSO_USER_ID')) {//未登录
                    $.ajax({
                        type: 'get',
                        url: "//ss" + cookieDomain + '/item/v1/d/m/memberInfo/' + prdInfo.prdId + '/' + prdInfo.sku + '/flag/item/getMemberPriceState',
                        dataType: 'jsonp',
                        jsonpName: "getMemberPriceState"
                    }).done(function (data) {
                        var html="";
                        var loginDataResult = data.result;

                    /*    loginDataResult.memberPrice={
                            state:true
                        }*/
                        if (loginDataResult && loginDataResult.memberPrice && loginDataResult.memberPrice.state && loginDataResult.memberPrice.state == true) {
                            html='<div class="prd-promotions-red dn"><label>会员价</label><span class="hl_red" id="isPreferential"><a href="javascript:;" class="loginToShowVipPrice">请登录</a>&nbsp;确认是否能享受优惠</span></div>';
                            $('.promotions-collapse').append(html);

                        };
                        showcuxiao(prdInfo.cnumber);
                    })
                    $("body").on('click','#isPreferential',function () {
                        g.login(function () {
                            window.location.reload();
                            return;
                        });
                    })
                } else {//已登录
                    $.ajax({
                        type: 'get',
                        url: "//ss" + cookieDomain + '/item/v1/d/m/memberInfo/' + prdInfo.prdId + '/' + prdInfo.sku + '/' + $.cookie('SSO_USER_ID') + '/' + price + '/flag/item/memberPrice',
                        dataType: 'jsonp',
                        jsonpName: "memberPrice"
                    }).done(function (data) {
                        var memberPriceResult = data.result;
                     /* memberPriceResult.memberPrice={
                            price:'12',
                            grade:'2'
                        }*/
                       /* memberPriceResult.internalPrice={
                            price:'12'
                        }*/
                        if (data.success && memberPriceResult && memberPriceResult.memberPrice && memberPriceResult.memberPrice.price && !(preHeatSlogan && preHeatSlogan.status==1 && memberPriceResult.memberPrice.price*1>prdInfo.price)) {//会员价如果比团抢价高就不展示 同理如下
                            var html='<div class="prd-promotions-red dn"><label>会员价</label><span id="showVipPrice"><span id="huiYuanDJ">您享受' + memberPriceResult.memberPrice.grade + '会员价</span>&ensp;' +
                                '<em class="huiYuanTeJia_text">¥' + memberPriceResult.memberPrice.price + '&emsp;</em>' +
                                '<a href="//club'+cookieDomain+'/">更多&nbsp;<i class="s-arrow">></i></a></span></div>';
                             $('.promotions-collapse').append(html);

                        }
                        if (data.success && memberPriceResult && memberPriceResult.internalPrice && memberPriceResult.internalPrice.price && !(preHeatSlogan && preHeatSlogan.status==1 && memberPriceResult.internalPrice.price*1>prdInfo.price)) {
                            var html='<div class="prd-promotions-red dn"><label>内购价</label><span>¥' + memberPriceResult.internalPrice.price + '</span></div>';
                            $('.promotions-collapse').append(html);

                        }
                        showcuxiao(prdInfo.cnumber);
                    })
                }
        }
    });
});

EventManager.on('delivery', function (data) {
    prdInfo.isStore = (prdInfo.shopNo.length == 0 ? false : true);
    var html="";
    $('.zhichi').html("支持");
    if (data.tips) {
        var preHeatSlogan=data.preHeatSlogan;
        var tiptit="支付金额79元以上免运费，偏远地区支付金额99元以上免运费，大家电部分偏远区域收取少量远程费及过桥过路费";
         /*团抢免邮*/
        if(preHeatSlogan && preHeatSlogan.ship=='freePost' && preHeatSlogan.status==1){
            preHeatSlogan.saleType == "RUSHBUYPRICE"?tiptit="该商品正在参加抢购活动，免运费":tiptit="该商品正在参加团购活动，免运费"
        }
        // 运费说明
        if(data.tips.isFreeShipping && prdInfo.prdType!=2 && prdInfo.departmentStoreSkuType!="gome-departmentStore-sku"){
            $('.zhichi').removeClass('dn').append('<a href="javascript:;" class="freightnote"><i class="line"></i>运费说明</a>')
        }

        //免运费
        if (data.tips.isFreeShippingFee) {
            if (prdInfo.isStore) {
               $('.zhichi').removeClass('dn').append('<a href="javascript:;"><i class="line"></i>免运费</a>')
            }else{
                $('.zhichi').removeClass('dn').append('<a href="//help'+cookieDomain+'/question/9.html" target="_blank" title="'+tiptit+'"><i class="line"></i>免运费</a>')
            }
        }
        //百货商品的免运费 非团抢商品
        if(prdInfo.departmentStoreSkuType=="gome-departmentStore-sku" && !(preHeatSlogan && preHeatSlogan.ship=='freePost' && preHeatSlogan.status==1)){
            $('.zhichi').removeClass('dn').html("");
            $.ajax({
                url: '//ss' + cookieDomain + '/item/v1/d/shippingfee/baihuocheng/' + prdInfo.prdId + '/' + prdInfo.sku + '/' + g.cityCode(2) + '/flag/item/depfreight',
                type: "get",
                dataType: 'jsonp',
                jsonpName: "depfreight"
            }).done(function(data){
                var data=data.result;


                if(data && data.rst && data.rst.freightType=="2"){
                    var dataTxt=data.rst.freightText;
                    var depData=data.rst.freightInfo;
                    var depfreightfree="";
        /*
        当freightText为1的时候则显示文案：满baseOrderAmountStart 元免运费（baseWeightEndkg内）。
        当freightText 为2的时候则显示文案：满baseOrderAmountStart 元运费baseShipFee元（baseWeightEndkg内）。
        当freightText为3的时候则显示文案：付费邮寄.
    
        */
                    if(dataTxt && dataTxt === 1 && depData){

                        depfreightfree = '满'+depData.baseOrderAmountStart+'元免运费('+depData.baseWeightEnd+'kg内)';

                    }else if(dataTxt && dataTxt === 2 && depData){

                        depfreightfree = '满'+depData.baseOrderAmountStart+'元运费'+depData.baseShipFee+'元('+depData.baseWeightEnd+'kg内)';

                    }else if(dataTxt && dataTxt === 3){

                        depfreightfree = '付费邮寄';

                    }
                    $('.zhichi').html('支持<a href="//help.gome.com.cn/question/9.html" target="_blank" title="详细运费规则请见购物车中商品运费说明">'+depfreightfree+'</a>');
                }else if(data && data.rst && data.rst.freightType=="1"){
                    var tiptit = "详细运费规则请见购物车中商品运费说明";
                    $('.zhichi').removeClass('dn').html('支持<a href="//help'+cookieDomain+'/question/9.html" target="_blank" title="'+tiptit+'">免运费</a>')
                }
            })

        }
        /*服务支持新接口：目前只支持门店自提, 及时达西限时达先屏蔽*/
        if (data.tips.pickupSelf && prdInfo.departmentStoreSkuType!="gome-departmentStore-sku") {
            $('.zhichi').removeClass('dn').append('<a href="//help'+cookieDomain+'/question/37.html" target="_blank" title="可就近选择国美门店，自行提取"><i class="line"></i>自提</a>')
        }

        //货到付款
        if (data.tips.iscod && prdInfo.departmentStoreSkuType!="gome-departmentStore-sku") {
           $('.zhichi').removeClass('dn').append('<a href="//help'+cookieDomain+'/article/232-0-0.html" target="_blank" title="送货上门后再收款，支持现金、POS机刷卡"><i class="line"></i>货到付款</a>')
        }
       $('.zhichi a').eq(0).find('i').remove();
    }
});

//库存
EventManager.on('KU_CUN', function (data) {
    var $stockTxt = $('.hasstock');
    if (data.stock && data.stock.presell) {//预售
        $stockTxt.html('');
        return false;
    }

    if (prdInfo.prdType == 2) {
        $stockTxt.html('下架');
        return false;
    }
    if (data.stock && data.stock.status) {
        $stockTxt.html('有货');
    }
    if (data.stock && !data.stock.status) {
        $stockTxt.html('无货');
    }
});
//对比
EventManager.on('DUI_bi', function (data) {
    if (prdInfo.prdType == 2) {
        $('#shareChk').addClass('dn');
    }
});
/*
 arrival	Y	String	预计到达时间
 delivery	jsdFlag	Y	boolean	计时达
 xsdFlag	Y	boolean	限时达
 */
EventManager.on('ARRIVAL', function (data) {
    if (data.delivery && data.delivery.arrival && data.delivery.arrival.length != 0 && !(data.isTransit)) {
        data.delivery.arrival = data.delivery.arrival.replace(/&lt;/g, "<");
        data.delivery.arrival = data.delivery.arrival.replace(/&gt;/g, ">");
        data.delivery.arrival = data.delivery.arrival.replace(/&#039;/g, "'");
        //$(".arrival").html(data.arrival.replace("20:00</span>","22:00</span>").replace("14:00</span>",'20:00</span>'));
        $(".arrival").html(data.delivery.arrival);
        $(".arrival").parent().removeClass('dn');
    } else {
        $(".arrival").html("");
    }
});


//增值服务：延保、屏碎保、意外保
EventManager.on('ADDED_SERVICE', function (data) {
    if(!data.warranty || data.warranty.length<1){
        return false;
    };


        var ybtpl="<%for(var i=0,len=this.length; i<len; i++){\
            var ybyears='',\
                ybtype='',\
                ybprice='',\
                ybox='';\
            switch(this[i].warrantyitem[0].productWarrantyType){\
                case 0: \
                   ybox='yb';\
                   ybtype=this[i].warrantyitem[0].name;\
                   ybyears=this[i].warrantyitem[0].name+this[i].warrantyitem[0].years;\
                   ybprice=this[i].warrantyitem[0].price;\
                    break;\
                case 1: \
                   ybox='ps';\
                   ybtype=this[i].warrantyitem[0].name;\
                   ybyears=this[i].warrantyitem[0].name+this[i].warrantyitem[0].years;\
                   ybprice=this[i].warrantyitem[0].price;\
                    break;\
                case 2: \
                    ybox='yw';\
                    ybtype=this[i].warrantyitem[0].name;\
                    ybyears=this[i].warrantyitem[0].name+this[i].warrantyitem[0].years;\
                    ybprice=this[i].warrantyitem[0].price;\
                    break;\
                default:\
        };%> \
            <div class='prdmod <%= ybox %> -bao<% if(this[i].warrantyitem.length>1){ %>  prdmodLists <% } %> '  type='<%= this[i].warrantyitem[0].warrantyType %> ' title='<%= ybyears %> 年&nbsp;¥<%= ybprice %> ' pid='<%= this[i].warrantyitem[0].productId %> '  sid='<%= this[i].warrantyitem[0].skuId %> ' skuno='<%= this[i].warrantyitem[0].skuNo %> ' cartype='<%= this[i].groupId %> '>\
                <a class='mod-link' href='javascript:void(0);'>\
                    <b class='icon-<%= ybox %> ' ><img src='<%= this[i].icon %> ' ></b>\
                    <span class='years'><%= ybyears %> 年</span>\
                    <span class='price'>¥<%= ybprice %> </span>\
                    <% if(this[i].warrantyitem.length>1){ %> \
                    <span class='i-arrow'></span><i>对勾</i>\
                    <% }else{ %> <i>对勾</i> <% } %>\
                </a>\
                <% if(this[i].warrantyitem.length>1){ %> \
                    <div class='drop-list'>\
                    <%for(var j=0,yblen=this[i].warrantyitem.length; j<yblen; j++){ %>\
                        <div class='li clearfix' year='<%= this[i].warrantyitem[j].years %> ' price='<%= this[i].warrantyitem[j].price %> 'pid='<%= this[i].warrantyitem[j].productId %> 'sid='<%= this[i].warrantyitem[j].skuId %> ' skuno='<%= this[i].warrantyitem[0].skuNo %> '>  \
                           <b class='checkbox'></b> \
                           <%if(this[i].warrantyitem[j].warrantyType == 1){%> \
                               <span class='tips'>优惠</span> \
                           <%}%>\
                           <span class='name' title=' <%= this[i].warrantyitem[j].name + this[i].warrantyitem[j].years %> 年&nbsp;¥<%= this[i].warrantyitem[j].price %> '> <%= this[i].warrantyitem[j].name + this[i].warrantyitem[j].years %> 年</span> \
                           <span class='price'>¥<%= this[i].warrantyitem[j].price %> </span>\
                           <a class='xq' href=' <%= this[i].warrantyitem[j].warrantyUrl %> ' target='_blank' style='display:none'>详情<b>></b></a>\
                       </div> \
                    <% } %>\
                    </div>\
                <% } %>\
            </div> \
        <%}%>"

    $('.added-service').removeClass('hide');
    var _html = TemplateEngine(ybtpl,data.warranty);
    $('#addedService').prepend(_html).find('.prdmod').show();



});

// 剩余库存和限购数量
EventManager.on('REMAIN', function (data) {
    /*团抢限购*/
    var preHeatSlogan={};
    var tiptit="";
       data.preHeatSlogan?preHeatSlogan=data.preHeatSlogan:""
    var html="";
            
    if (data.stock) {
        prdInfo.result = data.stock.status; //prdInfo.result 给节能减排(节能补贴)使用
        if (data.stock.status && prdInfo.prdType !== 2) {// 无货商品不显示剩余库存和限购数量
            //preHeatSlogan.limitNum=1
            /*抢购（团购）商品限购2件，超出将全部以￥10000.00/件结算*/
            if(preHeatSlogan && preHeatSlogan.status==1 && preHeatSlogan.limitNum>0){
                preHeatSlogan.saleType == "RUSHBUYPRICE"?tiptit="抢购":tiptit="团购"
               var html='<div class="remaindiv"><i class="remainicon"></i><i class="tanhao"></i>'+tiptit+'商品限购<span>'+preHeatSlogan.limitNum+'</span>件，超出将全部以￥'+preHeatSlogan.price+'/件结算</div>'
                   $('.remainbox').html(html); 
            }
            if (data.stock.amount <= 3 && !data.stock.presell) {//仅剩
                if(!(preHeatSlogan.limitNum && preHeatSlogan.limitNum<data.stock.amount && preHeatSlogan.limitNum>=allStore.enterQty && preHeatSlogan.status==1)){//大于团抢限购时
                   var html='<div class="remaindiv"><i class="remainicon"></i><i class="tanhao"></i>仅剩<span>'+data.stock.amount+'</span>件</div>';
                   if (data.others && data.others.merchantLimit && data.others.merchantLimit<data.stock.amount){//如果限购比数量小的话
                      html='<div class="remaindiv"><i class="remainicon"></i><i class="tanhao"></i>限购<span>'+data.others.merchantLimit+'</span>件</div>';
                   }
                   $('.remainbox').html(html);  
                }
                if (data.others && data.others.merchantLimit && data.others.merchantLimit<data.stock.amount){
                    window.cartMax = data.others.merchantLimit;
                }else{
                    window.cartMax = data.stock.amount;
                }
                //解决剩余库存小于3时购买数量控件无法增量的BUG
                //原来控件gAddCut不好用，换成了自己的gAutoNum控件
                $("#btnCount").gAutoNum({
                    numMin: allStore.enterQty, numMax: window.cartMax, maxCtl: true, btnfn: function (s) {
                        allStore.enterQty = s.value;
                        flysky();
                    }
                });
                return false;
            }
        }
        
    }
    /*限购*/
    if (data.others && data.others.merchantLimit && data.others.merchantLimit > 0) {//限购
        window.cartMax = data.others.merchantLimit;/*<i class="remainicon"></i>仅剩<span></span>件*/
        if(!(preHeatSlogan.limitNum && preHeatSlogan.limitNum<cartMax && preHeatSlogan.limitNum>=allStore.enterQty && preHeatSlogan.status==1)){
          var html='<div class="remaindiv"><i class="remainicon"></i><i class="tanhao"></i>限购<span>'+data.others.merchantLimit+'</span>件</div>'
              $('.remainbox').html(html); 
        }   
    }
     /* 加减事件 */
    if (prdInfo.skuDat != "0元购机" && prdInfo.prdType != 2) {
        $("#btnCount").gAutoNum({
            numMin: allStore.enterQty, numMax: window.cartMax, maxCtl: true, btnfn: function (s) {
                allStore.enterQty = s.value;
                flysky();
            }
        });
    }

});

/*飞天运能、库存等相关*/
TemplateEngine.helper('flysky', function () {
    var flysky = {};
    var snum = new Date().getTime();
    var arr_atgregion = (function () {
        var arr = ($.cookie('atgregion') || "11010200|北京北京市朝阳区|11010000|11000000|110102002").split('|');
        return [arr[1], arr[3], arr[2], arr[0], (arr[4] == undefined ? arr[0] + '1' : arr[4])];
    })();
    $.ajax({
        url: '//ss' + cookieDomain + '/item/v1/d/m/store/unite/' + prdInfo.prdId + '/' + prdInfo.sku + '/N/' + g.cityCode(3) + '/' + arr_atgregion[4] + '/' + allStore.enterQty + '/' + $.cookie('SSO_USER_ID') +'/flag/item/b' + snum,
        type: "get",
        dataType: 'jsonp',
        jsonpName: "b" + snum
    }).done(function (data) {
        if (data.success) {
            flysky = data.result;
        }
        ;
        $.extend(allStore, flysky);
        var diefn = ["SHOW_PRICE","KU_CUN", "REMAIN", "ARRIVAL", "delivery", "SHOW_FAHOUDI", "FU_MAI", "BUTTON_NORMAL_INFO"];  //涉及飞天项目的各个库存运能等接口
        for (var i = 0, k = diefn.length; i < k; i++) {
            EventManager.fireEvent(diefn[i], allStore);
        }
    });
});


// 负卖商品   负卖的有货才展示负卖，  正常有货还展示有货
EventManager.on('FU_MAI', function (data) {
    if (data.stock && data.stock.fmActiveFlag == 'Y') {
        if (data.stock && !data.stock.status) {
            $('#stockTxt').html("无货");
        } else {
            $('#stockTxt').html("预订");
            $(".fumai").html("正在向供应商采购中，现在可下单。").parent().removeClass('dn');

        }
    } else {
        $(".fumai").html("");
    }
});


//聪明购  暂时去掉



// 按钮操作区  分期购 快速购展示
//飞牛网、国美生鲜分期购不显示
EventManager.on("BUTTON_HIDE", function (data) {
    if (prdInfo.prdType == 1) {
        if (data.stock && data.stock.status && $.cookie('SSO_USER_ID')) {
            if(prdInfo.shopNo == ""){ //联营屏蔽快速购按钮
                $('#easyShopping').removeClass('dn');
            };
            if (data.gomePrice && data.gomePrice.salePrice >= 100 && data.gomePrice.salePrice <= 50000 && prdInfo.skuDat != "0元购机" && parseInt(prdInfo.shopFlag) <= 1) {
                //飞牛网、国美生鲜分期购不显示
                prdInfo.sapSkuType === "Z3PP" ? $("#pay_fenQi").addClass('dn') : $("#pay_fenQi").removeClass('dn');

            };
        }
    }
});

// prdType == 1正常商品 //
EventManager.on("BUTTON_NORMAL_INFO", function (data) {
    if (prdInfo.prdType == 1) {
        /*有货*/
        if (data.stock && data.stock.status) {
            //避免预约抢购商品购买数量置灰失效
            if (prdInfo.skuDat != "0元购机") {
                if (data.userStore && (data.userStore.phase === '1' || data.userStore.phase === '2')) {
                    $("#enterQty").attr("disabled", false);
                    $("#btnCount").children().removeClass("disab");
                    return false;
                }
            }

        }
    };
/*在途*/
    if (prdInfo.prdType == 1 && data.stock && data.stock.presell && data.stock.abActiveFlag == 'Y') {
            $('#stockTxt').html("预订");
            if(!data.isTransit){
            var d = new Date();
            d.setDate(d.getDate() + 9);
            $('.fumai').html("商品下单后预计" + d.getFullYear() + "年" + (d.getMonth() + 1) + '月' + d.getDate() + '日' + "到货").parent().removeClass('dn');
            }
    } else {
        if(data.stock && data.stock.fmActiveFlag && data.stock.fmActiveFlag == 'Y'){}else{$('.fumai').html("");}
    }

});

EventManager.on('BUTTON_INFO', function (data) {
    if (data.stock && !data.stock.status) {
        $('#arrival').show(); //显示到货通知
        $("#btnLink,#addCart,#applebtn,#pay_fenQi,#easyShopping,#telecom_buy").addClass('disabled');
        $('#addCartLink').addClass("nostock");//悬浮小购物车
        $('#mobtn,.mobile-orders-wrapper,.fuwu').addClass('dn');
        //服务隐藏

    } else {
        $('#btnLink,#telecom_buy').removeClass('disabled');
        $('#addCartLink').removeClass("nostock");//悬浮小购物车
    }
    //有一些屏蔽的sku  和 赠品详情页 需要置灰按钮
    if(prdInfo.skuBlackList=='true' || prdInfo.sapSkuType =="ZZP"){
        $("#btnLink,#addCart,#pay_fenQi,#easyShopping,#telecom_buy").addClass('disabled');
        $('#addCartLink').addClass("nostock");//悬浮小购物车
    }

});


// prdType == 2下架商品 //
EventManager.on('BUTTON_OFF_INFO', function (data) {
    if (prdInfo.prdType != 2) {
        return false;
    }

    if (typeof(data) != "undefined" && data.stock && data.stock.amount && data.stock.amount === 0) {//无货
        $("#arrival").show();//显示无货时：到货通知、无货说明
    } else {
        $("#arrival").hide();// 隐藏无货时：到货通知、无货说明
    }
    $('.btn-off-loading').removeClass('hide');
    $('#mobtn,.mobile-orders-wrapper').addClass('dn');
    $("#btnLink,#easyShopping,#enterQty,#addCart,#applebtn").addClass("disabled");
    $("#btnCount").children().addClass("disab");
    $("#pedAssort,#pay_fenQi,.shareDB").hide();
    $("#enterQty").attr("disabled", true);
    $("#addCart,#addCartLink,#stages").unbind("click");
    $("#addCartLink").addClass("nostock");
    $("#similarDom,#addCart,#countLock").show();

});


//其他相关商品推荐(其他类似商品)+搭配购
EventManager.on('otherGoodsRecommend', function (data) {
    //prdInfo.prdType==1 上架,prdInfo.prdType == 2下架,data.result == "N"无货,data.result == "Y"有货
    prdInfo.hasGoods = (data.stock && data.stock.status) ? 'Y' : 'N';
    prdInfo.masLocType=(data.stock && data.stock.masLocType)? data.stock.masLocType :"";
    //由于项目中store.js先执行，prdServer.js(其他类似商品)后执行，rltprd.js(搭配购)最后执行,
    //所以对“其他类似商品”和搭配购显示的判断放在了搭配购（rltprd.js）的js中进行。
});

/*详情页门店信息*/
EventManager.on('otherStore', function (data) {
    if($.cookie('showStore')) $.cookie('showStore', null);
    $('#showStore').gLoad(function(){
        var thirdCategoryName = $(".breadcrumbs-container .left ul li").eq(3).find('a').html();
        var _html = '', showStore = '', objStorage = {};
        var Storetpl=' \
            <div class="showStoretit showStoretitfir">\
                <p class="showStorefirst"><i></i>附近门店</p>\
                <p>去门店体验，预约专业导购</p>\
            </div>\
            <div class="showStoretit showStoreCenter">\
            <% for(var i=0,len=this.length; i<len; i++){ %>\
                <% if(this[i].guideName) { %>\
                    <div class="showStoretit StoreName">\
                        <div class="showStorelogo"><img src="<%= this[i].guidePhoto %> "></div>\
                        <div class="Storeinfo"  title="<%= this[i].name %> " >\
                            <h4><%= this[i].name %> </h4>\
                            <p class="p1">\
                                <span class="store-user"><%= this[i].guideName %> </span>\
                                <a href="//www<%= cookieDomain %> /vbuyshop/index.html?storeId=<%= this[i].gomeStoreId %> &storeCode=<%= this[i].storeCode %> &staffCode=<%= this[i].staffCode %> &thirdCategoryName='+encodeURI(thirdCategoryName)+' " class="store-link" target="_blank">去门店去找TA</a>\
                             </p>\
                            <p class="p2">\
                                <span class="store-service">已服务<em><%= this[i].guideServiceCount %> </em>人</span>\
                                <span class="store-stars"><i style="width: <%= this[i].guideStarLevel*20 %>"%">星星</i></span>\
                            </p>\
                        </div>\
                    </div>\
                <% }  %> \
            <% }  %> \
            </div>\
            <div class="showStoretit showmorestore">\
                <a href="//www<%= cookieDomain %>/vbuycity/index.html?thirdCategoryName='+encodeURI(thirdCategoryName)+'" target="_blank"> 查看更多门店</a>\
            </div>';
        if(prdInfo.hasGoods=='Y' && (prdInfo.masLocType=='G' || prdInfo.masLocType=='C' || prdInfo.masLocType=='G3PP_L' || prdInfo.masLocType=='G3PP_SPU' || prdInfo.masLocType=='G3PP_D' || prdInfo.masLocType=='H' )){
            if(!localStorage1){
                //这个是为了给低版本浏览器使用
                $.ajax({
                    type: 'get',
                    url: '//ss'+cookieDomain+'/item/v1/d/extends/regionable/'+g.cityCode(3)+'/2/flag/item/showStore',
                    //url: 'http://10.58.57.78:8080/mockjsdata/41/item/v1/d/extends/regionable/11010300/2/flag/item/showStore',
                    dataType: 'jsonp',
                    jsonpName: 'showStore',
                    success:function(data){
                        if(data.success && data.result && data.result.length>0){
                            for(var i = 0; i < data.result.length; i++) {
                                if(data.result[i].guideName && data.result[i].guideName != undefined) {
                                    $('#showStore').removeClass('dn');
                                }
                            }
                            var _html = TemplateEngine(Storetpl,data.result);
                            $('#showStore').html(_html);
                        }else{
                            $('#showStore').addClass('dn');
                        }
                    }
                });
            }else{
                if(!showStoreStorage.get("showStore")) {
                    $.ajax({
                        type: 'get',
                        url: '//ss'+cookieDomain+'/item/v1/d/extends/regionable/'+g.cityCode(3)+'/2/flag/item/showStore',
                        //url: 'http://10.58.57.78:8080/mockjsdata/41/item/v1/d/extends/regionable/11010300/2/flag/item/showStore',
                        dataType: 'jsonp',
                        jsonpName: 'showStore',
                        success:function(data){
                            if(data.success && data.result && data.result.length>0){
                                for(var i = 0; i < data.result.length; i++) {
                                    if(data.result[i].guideName && data.result[i].guideName != undefined) {
                                        $('#showStore').removeClass('dn');
                                    }
                                }
                                _html = TemplateEngine(Storetpl,data.result);
                                showStoreStorage.set("showStore", data.result, 1);
                                $('#showStore').html(_html);
                            }else{
                                $('#showStore').addClass('dn');
                            }
                        }
                    });
                }else {
                    objStorage = showStoreStorage.get("showStore");
                    if(objStorage) {
                        for(var i = 0; i < objStorage.length; i++) {
                            if(objStorage[i].guideName && objStorage[i].guideName != undefined) {
                                $('#showStore').removeClass('dn');
                            }else {
                                $('#showStore').addClass('dn');
                            }
                        }
                        _html = TemplateEngine(Storetpl,objStorage);
                        $('#showStore').html(_html);
                    }
                }
            }
        }
    })
});



//增加蓝劵
EventManager.on('CU_XIAO_LANJUAN', function (data) {
    if (data.userStores && data.userStores.promotionResult && data.userStores.promotionResult.length > 0) {

        var r = data.userStores.promotionResult;
        var str = '';
        var yljuan='';
        $('.lanjuan-top').removeClass('dn');
        for (var i = 0, k = r.length; i < k; i++) {
            switch(r[i].type){
                case 0:
                yljuan ='店铺劵 | '
                break;
                case 2:
                yljuan ='购物劵 | '
                break;
                case 3:
                
                if(prdInfo.shopNo != ""){ //区分联营自营

                    yljuan ='店铺劵 | '
                }
                break;
            }
            if(r[i].fullAmount){
              str += '<b class="blue-label"><i class="left">左边</i>'+yljuan+'满' + r[i].fullAmount + '减' + r[i].ticketAmount + '<i class="right">右边</i></b>'
          }else{
              str +='<b class="blue-label"><i class="left">左边</i>立减' + r[i].ticketAmount + '<i class="right">右边</i></b>'
          }

        }
        $('#lanjuan').html(str);
    }else{
        $('.lanjuan-top').remove();
    }
    if(data.userStores && data.userStores.rebate && data.userStores.rebate>0){
        var fl=data.userStores.rebate;
        html='<div class="prd-promotions-red dn"><label>返利</label><span class="hl_red">买后最高返¥'+fl+'<span class="rebateWen"></span></span><span class="rebateCont hide"><i class="saojiao"></i>返利指用户通过购买、推荐国美平台内的返利商品或邀请好友在国美购买产品等行为可以获得的收益，目前返利的形式为国美币，国美币是国美平台内的虚拟货币名称，1国美币等价于1元人民币，国美币可以直接提现。（10元起提，详情请见个人中心国美币页面）。</span></div>';
        $('.promotions-collapse').append(html);
    }
})

//温馨提示(增加了自营商品的节能减排)+联营特例品不可使用店铺券(2016-03-07)
EventManager.on('CU_XIAO_INFO', function (data) {
    // 如果支持回收
    var merchantSpecialText = "本商品为特例品，不支持使用店铺优惠券和购物券";//联营特例品
    if (data.special && prdInfo.isStore) {//特例品
        $(".wenxintishi_wrap").show().end().find(".wenxinti").append('<li>' + merchantSpecialText + '</li>');
    }
    if (data.recycling && data.recycling.url) {
        $('.yijiuhuanxin').removeClass('dn'); //支持以旧换新显示图标
        $(".yijiuhuanxin a").html(data.recycling.description).attr("href", data.recycling.url);
    }
    //支持企业采购
    if(data.others) {
        if(data.others.isBusFlag && data.others.isBusFlag == true) {
            if(data.others.qygUrl && data.others.qygUrl != '') {
                $(".wenxintishi_wrap").show().end().find(".wenxinti").append('<li>支持&nbsp;<a href="'+data.others.qygUrl+'" target="_blank">企业采购</a> </li>');
            }
        }
    }
});

/**
 如果支持回收
 如果是特例品
 1、点击参与以旧换新
 如果 联营
 2、本商品为特例品，不支持使用店铺优惠券和购物券
 否者
 2、特例商品不支持蓝券
 否者
 如果支持节能
 1、本商品参加北京市节能减排政策，补贴标准为13%查看详情
 2、点击参与以旧换新
 否者
 1、点击参与以旧换新
 如果不支持回收
 如果支持节能
 1、本商品参加北京市节能减排政策，补贴标准为13%查看详情
 如果特例
 2、特例商品不支持蓝券
 否者
 如果特例
 1、特例商品不支持蓝券
 */


//在线客服传值prdInfo.shopNo
EventManager.on('ZAIXIAN_KEFU', function (data) {
    if (!prdInfo.shopNo) {
        $('[data-customer_service_id]').each(function () {
            $(this).attr('data-customer_service_id', prdInfo.live800Provider_flag + '_' +
                g.cityCode(1));
        });
    }
});

//首屏大数据推荐看了又看
EventManager.on('KANLEYOUKAN', function (data) {
    var productTmpl, $this = $('.bigdata-reskim'), flag = true, productData = {};
    productTmpl = {
        lists: '\
                    {{if tempArr[0] && tempArr[0].length > 0}}\
                    <h2>看了又看</h2>\
                    <div class="reskim-carousel" id="reskim-carousel">\
                        <ul>\
                            {{each tempArr[0] as list index}}\
                            <li>\
                                <a href="{{list.purl}}" target="_blank" title="" class="product-imgs">\
                                    <img width="160" height="160" gome-src="{{list.iurl}}" alt="{{list.pn}}">\
                                </a>\
                                 <p><span>¥{{list.price}}</span></p>\
                            </li>\
                            {{/each}}\
                        </ul>\
                    </div>\
                    {{/if}}\
                    '
    };
    $.when($.ajax({
        url: '//bigd'+gomeplusDomain+'/gome/rec',
        type: 'get',
        dataType: 'jsonp',
        data: {
            "pid": prdInfo.prdId,
            "size": 9,
            "boxid": 'box74',
            "area": g.cityCode(),
            "cid": $.cookie('__clickidc'),
            "uid": loginData.loginId ? loginData.loginId : '',
            "brid": prdInfo.brandID ? prdInfo.brandID : '',
            "shopid": prdInfo.shopNo ? prdInfo.shopNo : '',
            "c1id": prdInfo.firstCategoryId ? prdInfo.firstCategoryId : '',
            "c3id": prdInfo.thirdCategoryId ? prdInfo.thirdCategoryId : '',
            "sid": prdInfo.sku,
            "imagesize": 160,
            "callbackparam": 'jsonpname_reskim'
        }, success: function (data) {
            productData.tempArr = [];
            var sliceArr = [];
            if (!(data.lst || data.lst.length > 0)) {
                return;
            }
            if (data.lst && data.lst.length > 0) {
                for (var i = 0; i < data.lst.length; i++) {
                    if (data.lst.length > 3 && data.lst.length < 6) {
                        sliceArr = data.lst.slice(0, 3);
                    } else if (data.lst.length > 6 && data.lst.length < 9) {
                        sliceArr = data.lst.slice(0, 6);
                    } else {
                        sliceArr = data.lst;
                    }
                }
                productData.tempArr.push(sliceArr);
                $this.html(templateSimple.compile(productTmpl.lists)(productData));
                $this.find("li").slice(0, 3).loadsrc('gome-src');
                new Carousel('#reskim-carousel',
                    {
                        elementNum: 3,
                        margin: 20,
                        pager: true
                    }
                );
            }
        }
    })).done(function (data) {
        $(".reskim-carousel .pager li").hover(function () {
            if (flag == true) {
                $this.find("li").slice(3).loadsrc('gome-src');
                flag = false;
            }
        });
        return false;
    })
});

//厂家安装
EventManager.on('CHANGJIA_ANZHUANG', function (data) {
    if(data.install) {
        if(data.install.phone) {
            $(".factory-installation").removeClass("dn").find(".factory-phone").html("安装电话："+data.install.phone);
        }
        if(data.install.instructions) {
            $(".factory-installation .more").removeClass("dn").find(".factory-infos").html(data.install.instructions);
        }
    }
});

//国美易卡
EventManager.on('MEIYIFEN', function (data){
    var url,//get请求url
        userId = $.cookie('SSO_USER_ID') ? $.cookie('SSO_USER_ID') : 'N',//用户ID{没有时传N}
        zy_shopNo = prdInfo.shopNo_zy ? prdInfo.shopNo_zy : 'N',//店铺编码{没有店铺编码时传递N}
        price = prdInfo.price;
    //以下情况不支持国美易卡：1.价格小于等于100 2.联营商品不支持国美易卡 3.商品无货或者下架 4.预约/抢购商品
    if (parseInt(price) * 1 <= 100 || prdInfo.shopNo != '' || prdInfo.hasGoods=='N' || prdInfo.prdType == 2 || (data.userStores && (data.userStores.phase === '1' || data.userStores.phase === '2'))) {
        return false;
    }
    var list_html = {}, productData = {}, loanInfoArr = [];
    productData.myfArr = [];
    list_html = {
        lists: '\
			{{if myfArr[0] && myfArr[0].length > 0}}\
			<label class="prdLeft">国美易卡</label>\
			<div class="prdRight">\
				{{each myfArr[0] as list index}}\
                    {{if list.loanTerm == 1}}\
						<div class="prdmyf prdmyfLists prdmyfHover"><a class="mod-link" href="javascript:void(0);">不分期</a><div class="drop-down"><span class="dd-detail">含手续费：费率{{list.loanSumRate}}%，¥ {{list.loanSumFee}} x {{list.loanTerm}}期</span></div></div>\
					{{ else }}\
						<div class="prdmyf prdmyfLists prdmyfHover"><a class="mod-link" href="javascript:void(0);">¥ {{list.repaymentSingleAmount}} x {{list.loanTerm}}期</a><div class="drop-down"><span class="dd-detail">含手续费：费率{{list.loanSumRate}}%，¥ {{list.loanSumFee}} x {{list.loanTerm}}期</span></div></div>\
					{{/if}}\
				{{/each}}\
				<div class="promotion dn"><a href="javascript:void(0);">促销</a><div class="tips"><div class="sanjiao"></div><div class="tip-body"><p></p></div></div></div>\
				<div class="more"><a href="javascript:void(0);">产品说明</a><div class="tips"><div class="sanjiao"></div><div class="tip-body"><p>国美易卡是国美为您提供的集聚消费、现金功能于一体的信用额度产品，当您使用国美易卡进行消费时，可选择延期付款或分期付款。</p></div></div></div>\
			</div>\
			{{/if}}\
			'
    };
    /* 传入参数
     * @param productId
     * @param skuId
     * @param userId
     * @param price:商品售价
     * @param categoryId:三级分类
     * @param brandId:品牌ID
     * @param shopType:联营/自营
     * @param shopCode:店铺编码
     * */
    url = '//ss'+cookieDomain+'/item/v1/bt/info/getBtInfo/' + prdInfo.prdId + '/' + prdInfo.sku + '/' + userId + '/' + price + '/' + prdInfo.catId + '/' + prdInfo.brandID + '/N/' + zy_shopNo + '/flag/item/getBtInfo';
    //用户登录之后才请求国美易卡信息
    if ($.cookie('SSO_USER_ID')) {
        $.ajax({
            type: 'get',
            url: url,
            dataType: 'jsonp',
            jsonpName: 'getBtInfo',
            success: function (data) {
                if (!data) return false;
                var loanData = data.body;
                if (loanData) {
                    //该商品是否支持国美易卡
                    //1.支持-isDisplayBt
                    //2.不支持：显示普通商品信息，走普通加入购物车流程
                    if (loanData.isDisplayBt && loanData.isDisplayBt == 'Y') {
                        //如果商品支持国美易卡，不显示分期购按钮-国美易卡替换分期购
                        $("#pay_fenQi").css({'display': 'none'});
                        if(typeof loanData.loanInfoList != "undefined" && loanData.loanInfoList !="" && loanData.loanInfoList.length > 0) {
                            loanInfoArr = loanData.loanInfoList;
                            for(var i = 0; i < loanInfoArr.length; i++) {
                                loanInfoArr[i].loanSumRate = loanInfoArr[i].loanSumRate.replace('%', '');
                            }
                            productData.myfArr.push(loanInfoArr);
                            $('.meiyifen').removeClass('dn').html(templateSimple.compile(list_html.lists)(productData));
                            $(".pop-meiyifen img").loadsrc('_src');//国美易卡二维码
                            //列表选项选中/取消
                            $(".meiyifen .prdmyfLists").on('click', function () {
                                $(this).toggleClass('select').siblings().removeClass('select');
                            }).hover(function () {
                                var dropdown = $(this).find('.drop-down'), meiyifen = $(".meiyifen");
                                if(dropdown && dropdown.length > 0) {
                                    //如果下拉框的宽度超出网站主体宽度，让下拉框居右对齐
                                    if((dropdown.offset().left + dropdown.outerWidth()) > (meiyifen.offset().left + meiyifen.outerWidth())) {
                                        dropdown.css({
                                            right: 0,
                                            left: 'auto'
                                        })
                                    }else {
                                        dropdown.css({
                                            right: 'auto',
                                            left: 0
                                        })
                                    }
                                }
                            });
                            //促销信息默认隐藏，如果有促销信息则显示，没有不展示
                            if(loanData.marketInfo && loanData.marketInfo != '') {
                                $(".meiyifen .promotion").removeClass('dn').find('p').html(loanData.marketInfo);
                            }
                            //国美易卡-点击国美易卡按钮弹出扫码浮层
                            $(".btn-meiyifen").removeClass('dn').on('click', function () {
                                $('.pop-meiyifen, .mask-meiyifen').removeClass('dn');
                            });
                            //关闭弹窗和二维码
                            $(".pop-meiyifen .close").on('click', function () {
                                $('.pop-meiyifen, .mask-meiyifen').addClass('dn');
                            });
                        }
                    }
                }
            }
        });
    }
});