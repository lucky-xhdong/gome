!function(exports,prdInfo,$,templateSimple){
	//店内搜索联营
	new function () {
	    var searchkeyword="搜本店";
	    var dnKeyWord=$("#dn-keyword");
	    dnKeyWord.off(".dnssgoods");
	    dnKeyWord.on("focus.dnssgoods",function(){
	        var self=$(this);
	        if($.trim(self.val())==searchkeyword)
	            self.val('');
	    })
	    dnKeyWord.on("blur.dnssgoods",function(){
	        var self=$(this);
	        if($.trim(self.val())=="")
	            self.val(searchkeyword);
	    })
	    $(".dn-search-box .btn-sure").on("click",function(){
	        var dnKeyword=$.trim( dnKeyWord.val());
	        var dnPrevVal=$.trim( $(".dn-price-prev").val());
	        var dnNextVal=$.trim( $(".dn-price-next").val());
	        var errorText= $(".dn-search-box .error");
	        errorText.hide();
	       dnKeyword=='搜本店'?dnKeyword="" : null;
	       
	        if( (!isNaN(dnPrevVal) && dnPrevVal<0) || (!isNaN(dnNextVal) && dnNextVal<0)  ){
	            errorText.show().text('请注意：价格必须大于0 !');
	            return false;
	        }
	        if(isNaN(dnPrevVal) || isNaN(dnNextVal) ){
	            errorText.show().text('请注意：价格必须为数字!');
	            return false;
	        }
	        if( (dnPrevVal==''&& dnNextVal!="") || (dnPrevVal!=''&&dnNextVal=='') ){
	            errorText.show().text('请注意：价格不允许一个为空，一个有值！');
	            return false;
	        }
	        if(parseFloat(dnPrevVal)>=dnNextVal){
	            errorText.show().text('请注意：前面的价格数值必须小于后面的价格数值！');
	            return false;
	        }
	        errorText.hide();
	        var str='1-0-1-1';
	        if(prdInfo.decorationFilePath !='0'){str='4-0-1-0';}
	        var formTpl='<form target="_blank" action="//mall'+cookieDomain+'/'+prdInfo.shopNo+'/'+str+'.html#shop-main" method="get">'+
	                '<input name="question" value="'+dnKeyword+'" type="hidden">'+
	                '<input name="salePriceStart" type="hidden" value="'+dnPrevVal+'">'+
	                '<input name="salePriceEnd" type="hidden" value="'+dnNextVal+'">'+
	            '</form>';
	        $(formTpl).appendTo('body').submit().remove();
	        return false;
	    });
	    /*分类开发显示隐藏*/
	    $("#secondpane .hwgplus").each(function(i){
	          $(this).click(function(){
	              $(this).toggleClass('minus');
	              $(this).parent().next('.menu_body').toggle();
	          });
	       });
	};







	//关于手机，你可能在找
	if(prdInfo.thirdCategoryId==="cat10000070"){
	    $("#about-mb").gLoad(function(){
	        var __ajaxUrl__='//ss'+cookieDomain+'/item/v1/d/extends/'+prdInfo.prdId+'/'+prdInfo.sku+'/'+g.cityCode(3)+'/'+g.cityCode(4)+'/flag/item/aboutMobile';
	        jQuery.ajax({
	            type : "get",
	            url :  __ajaxUrl__,
	            dataType : "jsonp",
	            jsonpName : "aboutMobile"
	        }).done(function(data){
	            if(data.success && !$.isEmptyObject(data.result) && data.result.hotSearch && data.result.hotSearch.keyArray && data.result.hotSearch.keyArray.length>0 ){
	                var html='',search=data.result.hotSearch;
	                $.each(search.keyArray,function(index,dom){
	                    html+='<a href="//search'+cookieDomain+'/search?question='+encodeURIComponent(dom)+'" title="'+dom+'" target="_blank" class="active">'+dom+'</a>'
	                })
	                $("#about-mb .dt-rcbox").html(html);
	            }else{
	                $("#about-mb").hide();
	            }
	        });
	    });
	}


	//排行榜  //同价位 同品牌 同类别
	$('#paihangbang').gLoad(function () {
		
	    g.ajax(
	           '//bigd.gome.com.cn/gome/rec',
	           {
	               boxid: 'box82',
	               pid: prdInfo.prdId,
	               cid: $.cookie('__clickidc'),//cookie
	               uid: loginData.loginId,
	               area: g.cityCode(),
	               c1n: $('.local').find('a').eq(1).attr('title'),
	               c3n: $('.local').find('a').eq(2).attr('title'),
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
	            	$('#paihangbang').hide();
	            	return false;
	            }
	            //$('#paihangbang h2.tonglei_wrap_title').html(data.bn);
	            var tonglei_ul = $('<ul class="tonglei_ul"></ul>');
	            $('.tonglei_product_wrap').append(tonglei_ul);
	            $('.tonglei_ul').show();
	            for (var j = 0, arr = data.lst; j < arr.length; j++) {
	                var li = $('<li></li>');
	                tonglei_ul.append(li);

	                var html = "";

	                html += '<div class="tonglei_sz">' + (j + 1) + '</div>';
	                html += '<div class="tonglei_img">' +
	                        '<a target="_blank" href="' + arr[j].purl.replace("http:","") + '"' + ' title="' + arr[j].pn + '">' +
	                            '<img src="' + arr[j].iurl.replace("http:","") + '" width="50" height="50" />'
	                            + '</a></div>';
	                html += '<div class="tonglei_link">' +
	                        '<p class="tonglei_link_name"><a target="_blank" href="' + arr[j].purl.replace("http:","") + '">' + arr[j].pn + '</a></p>' +
	                        '<p class="tonglei_jg"><span class="tonglei_jg_val">¥' + arr[j].price + '</span></p>' +
	                        '</div>';

	                li.html(html);
	            }
	          
	        }).error(function(){
	        	$('#paihangbang').hide();
	        	return false;
	        });
	});
	//浏览该商品的用户还浏览了
	$('#mboxDynamic').gLoad(function () {
		
	    var _this = $(this);
	    var boxid='box12';
	    if(parseInt(prdInfo.shopFlag)>1){
	        boxid='box41';
	    }
	    g.ajax(
	           '//bigd.gome.com.cn/gome/rec',
	           {
	               boxid: boxid,
	               pid: prdInfo.prdId,
	               cid: $.cookie('__clickidc'),//cookie
	               uid: loginData.loginId,
	               area: g.cityCode(),
	               c1n: $('.local').find('a').eq(1).attr('title'),
	               c3n: $('.local').find('a').eq(2).attr('title'),
	               brid: prdInfo.brandID,
	               imagesize: 160,
	               shopid: prdInfo.shopNo,
	               c1id: prdInfo.firstCategoryId,
	               c3id: prdInfo.thirdCategoryId,
	               sid: prdInfo.sku

	           }, {
	               site: 'f'
	           }).done(function (data) {

	               if (data.lst.length > 0) {
	                   $('#mboxDynamic').show();
	               } else {
	                   $('#mboxDynamic').hide();
	                   return;
	               }

	               $('#mboxDynamic').html('<div class="pushbox-list">' +
	                '<h3>' + data.bn + '</h3>' +
	                '</div>');
	               var pushullist = $('<ul class="pushul-list"></ul>');
	               $('#mboxDynamic .pushbox-list').eq(0).append(pushullist);

	               //html += '<ul class="pushul-list">';
	               for (var i = 0; i < data.lst.length; i++) {
	                   var li = $('<li></li>');
	                   pushullist.append(li);

	                   var html = '';
	                   //html += '<li>';
	                   html += '<a href="' + data.lst[i].purl + '"  target="_blank" title="' + data.lst[i].pn + '">\
	                                            <img width="160" height="160" src="' + data.lst[i].iurl + '" alt="' + data.lst[i].pn + '" /> \
	                                            <p class="yuan colprice fb">¥<span>' + data.lst[i].price + '</span></p>\
	                                            <div>' + data.lst[i].pn + '</div>\
	                             </a>'

	                   li.html(html);

	                   li.find('a').attr({
	                       maima_param: data.lst[i]['maima_param']
	                   });

	               }
	               _this.attr({
	                   maima_param: data['maima_param']
	               });
	               //埋码
	               maiMaRecTrack({
	                   ele : '#mboxDynamic',
	                   links : '#mboxDynamic a'
	               });
	           });
	});



	/*
	    购买该商品的用户还浏览了 or 店铺热销商品推荐 or 店铺内热销推荐
	    后增加了联营
	 */
	$('#buyAndLook').gLoad(function () {
	    var _this = $(this);
	    var boxid='box36';
	    if(parseInt(prdInfo.shopFlag)>1){
	        boxid='box40';
	    }else if(prdInfo.shopNo){
	        boxid='box44';
	    }
	    g.ajax(
	        '//bigd.gome.com.cn/gome/rec',
	        {
	            boxid: boxid,
	            pid: prdInfo.prdId,
	            cid: $.cookie('__clickidc'),//cookie
	            uid: loginData.loginId,
	            area: g.cityCode(),
	            brid: prdInfo.brandID,
	            imagesize: 160,
	            c1id: prdInfo.firstCategoryId,
	            c3id: prdInfo.thirdCategoryId,
	            shopid: prdInfo.shopNo,
	            sid: prdInfo.sku
	        }, {
	            site: 'f'
	        })
	        .done(function (data) {
	            if (data.lst.length > 0) {
	                $('#buyAndLook').show();
	            } else {
	                $('#buyAndLook').hide();
	                return;
	            }

	            $('#buyAndLook').html('<div class="pushbox-list">' +
	            '<h3>' + data.bn + '</h3></div>');

	            var pushullist = $('<ul class="pushul-list"></ul>');
	            $('#buyAndLook .pushbox-list').eq(0).append(pushullist);

	            for (var i = 0; i < data.lst.length; i++) {
	                var li = $('<li></li>');
	                pushullist.append(li);

	                var html = '';
	                html += '<a href="' + data.lst[i].purl + '"  target="_blank" title="' + data.lst[i].pn + '">\
	                                            <img width="160" height="160" src="' + data.lst[i].iurl + '" alt="' + data.lst[i].pn + '" /> \
	                                            <p class="yuan colprice fb">¥<span>' + data.lst[i].price + '</span></p>\
	                                            <div>' + data.lst[i].pn + '</div>\
	                             </a>'

	                li.html(html);

	                li.find('a').attr({
	                    maima_param: data.lst[i]['maima_param']
	                });

	            }

	            _this.attr({
	                maima_param: data['maima_param']
	            });

	            //埋码
	           maiMaRecTrack({
	                ele : '#buyAndLook',
	                links : '#buyAndLook a'
	            });

	        });

	})
	
	    //浏览该商品的用户最终购买了
	    $('#mboxDynamicLeft').gLoad(function () {
	        var _this = $(this);
	        var boxid='box13';
	        if(parseInt(prdInfo.shopFlag)>1){
	            boxid='box39';
	        }
	        g.ajax(
	               '//bigd.gome.com.cn/gome/rec',
	               {
	                   boxid: boxid,
	                   pid: prdInfo.prdId,
	                   cid: $.cookie('__clickidc'),//cookie
	                   uid: loginData.loginId,
	                   area: g.cityCode(),
	                   c1n: $('.local').find('a').eq(1).attr('title'),
	                   c3n: $('.local').find('a').eq(2).attr('title'),
	                   brid: prdInfo.brandID,
	                   imagesize: 160,
	                   c1id: prdInfo.firstCategoryId,
	                   c3id: prdInfo.thirdCategoryId,
	                   shopid: prdInfo.shopNo,
	                   sid: prdInfo.sku
	               }, {
	                   site: 'f'
	               })
	        .done(function (data) {

	            if (data.lst.length > 0) {
	                $('#mboxDynamicLeft').show();
	            } else {
	                $('#mboxDynamicLeft').hide();
	                return;
	            }

	            $('#mboxDynamicLeft').html('<div class="pushbox-list">' +
	                        '<h3>' + data.bn + '</h3></div>');

	            var pushullist = $('<ul class="pushul-list"></ul>');
	            $('#mboxDynamicLeft .pushbox-list').eq(0).append(pushullist);

	            for (var i = 0; i < data.lst.length; i++) {
	                var li = $('<li></li>');
	                pushullist.append(li);

	                var html = '';
	                html += '<a href="' + data.lst[i].purl + '"  target="_blank" title="' + data.lst[i].pn + '">\
	                                                <img width="160" height="160" src="' + data.lst[i].iurl + '" alt="' + data.lst[i].pn + '" /> \
	                                                <p class="yuan colprice fb">¥<span>' + data.lst[i].price + '</span></p>\
		                                            <div>' + data.lst[i].pn + '</div>\
	                                 </a>'

	                li.html(html);

	                li.find('a').attr({
	                    maima_param: data.lst[i]['maima_param']
	                });

	            }

	            _this.attr({
	                maima_param: data['maima_param']
	            });

	           //埋码
	            maiMaRecTrack({
	                ele : '#mboxDynamicLeft',
	                links : '#mboxDynamicLeft a'
	            });
	        });
	    });
	//根据浏览猜你喜欢
	$('#mboxDynamicFoot').gLoad(function () {
	    var _this = $(this);
	    g.ajax(
	        '//bigd.gome.com.cn/gome/rec', {
	            boxid: "box37",
	            pid:  prdInfo.prdId,
	            area: g.cityCode(),
	            cid: $.cookie('__clickidc'),
	            uid: loginData.loginId,
	            imagesize:130,
	            brid: prdInfo.brandID,
	            shopid : prdInfo.shopNo,
	            c1id : prdInfo.firstCategoryId,
	            c3id: prdInfo.thirdCategoryId,
	            sid:prdInfo.sku
	        }, {
	            site: 'f'
	        })
	   .done(function (data) {
	       if (!(data.isSuccess=="Y" && data.size>0)){
	           $('#mboxDynamicFoot').hide();
	           return false;
	       }
	       var htm = '\
	            <div class="pushbox">\
	            <h3>\
	            <span class="title" style="float:left;">根据浏览猜你喜欢</span>\
	            <span id="btn-change" class="btn-refresh" style=""><span class="text">换一组</span><i class="i-refresh"></i></span>\
	            </h3>\
	            <div class="andBuyOut">\
	                <div class="andBuy-cont">\
	                <ul class="pushul clearfix" style="width: 4654px; position: relative;">\
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
	       $('#mboxDynamicFoot').attr('maima_param',data.maima_param).html(template.compile(htm)(data));

	       if (typeof trackEvent != "undefined") { trackEvent(2, products); }

	       //绑定事件
	       var tlscroll = $('body').hasClass('w990') ? 5 : 6;

	       if (data.size > tlscroll) {
	           $('#mboxDynamicFoot .andBuy-cont').gSlider({
	               isAuto: false,
	               isImgLoad: false,
	               showNum: tlscroll,
	               stepLen: tlscroll,
	               time: 3000,
	               btnGo: { left: '#btn-change'}
	           });
	       }else{
	           $("#btn-change").hide();
	       }

	       //埋码
	        maiMaRecTrack({
	            ele :'#mboxDynamicFoot',
	            links : '#mboxDynamicFoot a'
	        });


	   });
	});

	//广告投放
	if(prdInfo.shopFlag==="2" || prdInfo.shopFlag==="3") {
	}else{
	$(".dt-side").append('<div id="gm-ad-box"></div>');
	var gmAdBox=$('#gm-ad-box')
	gmAdBox.gLoad(function () {
	    var _this = $(this);
	    $.ajax({
			type : "get",
			url : '//flight'+cookieDomain+'/flight',
			dataType : "jsonp",
			data : {
				area : g.cityCode(3),
				requestType : 3,
				p : 10046,
				catid :  prdInfo.catId,
				width_height: '210-210', //无160大小数据
				c : "gmAdBox"
			},
			jsonpName : "gmAdBox"
	    }).done(function(data){
	        if(data && data.length>0){
	            var res={};
	            res.lst=data;
	            var htmlTpl='\
	                <div class="pushbox-list">\
	                    <h3>精选商品<span class="gm-ad-mark">广告</span></h3>\
	                    <ul class="pushul-list">\
	                        <% for(var i=0,j=lst.length; i<j; i++){ %>\
	                        <li>\
	                            <a href="<%= lst[i].ldp %>"  target="_blank" title="<%= lst[i].ds %>">\
	                                <img width="160" height="160" src="<%= lst[i].src %>" alt="<%= lst[i].ds %>" /> \
	                                <img src="<%= lst[i].pm %>" style="display: none;">\
	                                <p class="yuan colprice fb">¥<span><%= lst[i].pr %></span></p>\
	                                <div><%= lst[i].ds %></div>\
	                            </a>\
	                        </li>\
	                        <% } %>\
	                    </ul>\
	                </div>\
	            ';
	            gmAdBox.html(template.compile(htmlTpl)(res));
	        }
	    });
	});
	}




	//广告位 先注释掉
	new function () {
	    // 懒加载图片
	    function imgSrc(imgObj){
	        if(imgObj.attr("gome-src"))imgObj.attr("src",imgObj.attr("gome-src")).removeAttr("gome-src");
	    }
	    var  addCartData={
	        "type":"0",
	        "pcount":1,
	        "homesite":"home",
	        "_r":new Date().getTime()
	    }
	    //处理图片和加入购物车
	    function addCartImg(obj,data){
	        var $li=obj.html(data.html).find('img[gome-src]').gLoad({e:function(){imgSrc($(this));}}).end().find(".goods-wrap>li");
	        $li.each(function(){
	            var $ps=$(this).find(".price").attr("_price").split("-");
	            var _url='//cart'+cookieDomain+'/addsuccess?homesite='+addCartData.homesite+'&type='+addCartData.type+'&sid='+$ps[1]+'&pid='+$ps[0]+'&pcount='+addCartData.pcount+'&cr=0&_r='+addCartData._r;
	            $(this).find(".btn>a").attr("href",_url);
	        });
	    }
	    // 图片请求 商品图片广告2015-6-3
	    if ("" != prdInfo.operADHref && undefined != prdInfo.operADHref && prdInfo.gdstats!== '6') {
	        $.ajax({
	            type: 'get',
	            url: prdInfo.operADHref,
	            dataType: "jsonp",
	            jsonpName: 'callback_platform_ad_top',
	            success: function (data) {
	                if ("" != data.imgUrl && undefined != data.imgUrl) {
	                    $('#productAdtop').append('<a  target="_blank" ><img src="' + data.imgUrl + '"/></a>');
	                    if ("" != data.linkUrl && undefined != data.linkUrl) {
	                        $('#productAdtop a').attr("href", data.linkUrl);
	                    }
	                }
	            }
	        });
	    }


	    //#region 预览
	    if (g.url.getParam('review_ad') != "") {//预览
	        var review_ad_url = g.url.desc + "/" + g.url.getParam('review_ad');

	        $('#adtop').gLoad({
	            e: function () {
	                if(prdInfo.gdstats!== '6') {
	                    $.ajax({
	                        type: 'get',
	                        url: review_ad_url,
	                        dataType: "jsonp",
	                        jsonpName: (g.url.getParam('locationbottom') == 'true' ? 'callback_ad_bottom' : 'callback_ad_top'),
	                        success: function (data) {
	                            if (g.url.getParam('locationbottom') == 'true') {
	                                addCartImg($("#adbottom"),data);
	                            } else {
	                                addCartImg($("#adtop"),data);
	                            }
	                        }
	                    });
	                }
	            }
	        });

	        return;
	    }
	    //#endregion
	    if (prdInfo.shopNo == '') {//自营
	        var url_ad = g.url.desc + '/advert/' + prdInfo.catId + '/' + prdInfo.brandID;
	    } else {//联营
	        var url_ad = g.url.desc + '/advert/' + prdInfo.shopNo.substr(0, 5) + '/' + prdInfo.shopNo.substr(5) + '/' + (prdInfo.coo8thirdCategoryId ? prdInfo.coo8thirdCategoryId : prdInfo.thirdCategoryId) + '/' + prdInfo.brandCode;
	    }

	    $('#adtop').gLoad({
	        e: function () {
	            if(prdInfo.gdstats!== '6') {
	                $.ajax({
	                    type: 'get',
	                    url: url_ad + '/top.html',
	                    dataType: "jsonp",
	                    jsonpName: 'callback_ad_top',
	                    success: function (data) {
	                        addCartImg($("#adtop"),data);
	                    }
	                });
	            }
	        }
	    });
	    $('#adbottom').gLoad({
	        e: function () {
	            if(prdInfo.gdstats!== '6') {
	                $.ajax({
	                    type: 'get',
	                    url: url_ad + '/bottom.html',
	                    dataType: "jsonp",
	                    jsonpName: 'callback_ad_bottom',
	                    success: function (data) {
	                        addCartImg($("#adbottom"),data);
	                    }
	                });
	            }
	        }
	    });
	}

	//规格参数添加品牌链接
	new function () {
		$('.guigecanshu').each(function () {
			if ($(this).html().indexOf('品牌：') === 0) {
				$(this).html('品牌：<a target="_blank" style="color:#069;" href="' + $('.breadcrumbs-container .left li').eq(4).find('a').attr('href') + '">' + $(this).attr('title') + '</a>');
			}
			if ($(this).html().indexOf('店铺名称') >= 0) {
				$(this).html('店铺名称：<a target="_blank" style="color:#069;" href="' + $('.breadcrumbs-container .right .ly-stores .name').attr('href') + '">' + $(this).attr('title') + '</a>');
			}
		});
	}


	/* 商品详情页 -- fixed  */
	$("#fixtabox").gfixed({ star: "#gfixed", target: "#fixtabox", fixed: "fixedtop" });
	$(".fix-storesname").gfixed({ star: "#gfixed", target: ".fix-storesname", fixed: "fixedtop" });//店铺名称固定
	$(".mobile-orders-wrapper").find('img').loadsrc('gome-src');//手机下单
    $(".store-logo").find('img').loadsrc('gome-src');//店铺logo
    $(".params-wrapper").find('img').loadsrc('gome-src');//新规格参数图标

	//图片详情
	/*prdInfo.htmlHref='http://desc'+cookieDomain+'/html/prodhtml/productDesc/descHtml/201602/desc0216-222/1122410752.html';*/
	$('#detailHtml').gLoad(function () {
       if (prdInfo.htmlHref && prdInfo.gdstats!=='6') {
        g.ajax(prdInfo.htmlHref, { callback:'jianjie', site: 'f' }).done(function (data) {
            $('#detailHtml').html(data).find('img').each(function(){
                    if((prdInfo.firstCategoryId=='cat10000333' || prdInfo.firstCategoryId=='cat10000018' || prdInfo.firstCategoryId=='cat10000006' || prdInfo.firstCategoryId=='cat21426052') && prdInfo.shopNo){
            		}else{
	            		if(!$(this).attr("width")){
	    				   $(this).attr("width","750px").attr('height',"");
	    				};
            		}
                    if($('body').hasClass("w990")){//兼容990
                    $(this).attr("width","632px").attr('height',"");;
                    }
                    $(this).loadsrc('gome-src');
                    $(this).load(function(){
                  	 /*图片规格右边导航的交互*/
					$(window).scroll();
                
                    });         
                 });
            $('.slider-nav').fixscroll({startnum:0,starttop:20,lefttop:38,curheight:$('.slider-nav').innerHeight(),start:"#gfixed",end:"#endscroll",targetbox:"#detailHtml",curcss:"cur",event:"click"});
        });
      }
    });
      //最近浏览
    $("#rangedBrowsedProd").gLoad(function () {

        	var tpl_1='<% for(var i=0,len=this.length; i<len; i++){ %>\
        		<li>\
        			<div class="img-w">\
        				<a href="//item'+cookieDomain+'/<%=this[i].productId%> -<%=this[i].skuId%> .html" target="_blank" title="<%=this[i].productName%> "><img src="<%=this[i].imgUrl%> " alt=" <%=this[i].productName%> "></a>\
        			</div>\
        			<p class="title">\
        				<a href="//item'+cookieDomain+'/<%=this[i].productId%> -<%=this[i].skuId%> .html" target="_blank" title="<%=this[i].productName %> "><span><%=this[i].productName%> </span></a>\
        				<% if(this[i].areaPrice) { %>\
        					<p class="yuan colprice fb">¥<span><%=this[i].areaPrice%> </span>\
        					<% if(this[i].priceType=="tuan" || this[i].priceType=="qiang") { %>\
        						<i>真划算</i>\
        					<% }  %> \
        					</p>\
        					<% }  %> \
        			</p>\
        		</li>\
        		<% }  %>'


        	var tpl_2='<% for(var i=0,len=this.length; i<len; i++){ %>\
        		<li>\
        			<div class="img-w">\
        				<a href="<%=this[i].url%> " target="_blank" title="<%=this[i].name%> "><img src="<%=this[i].pic%> " alt=" <%=this[i].name%> "></a>\
        			</div>\
        			<p class="title">\
        				<a href="<%=this[i].url%> " target="_blank" title="<%=this[i].name %> "><span><%=this[i].name%> </span></a>\
        				<% if(this[i].price) { %>\
        					<p class="yuan colprice fb">¥<span><%=this[i].price%> </span>\
        					<% if(this[i].isTuanQiang) { %>\
        						<i>真划算</i>\
        					<% }  %> \
        					</p>\
        					<% }  %> \
        			</p>\
        		</li>\
        		<% }  %>'

        		/*最近足迹 登录之后请求会员的接口  不登陆请求之前的接口  这里请求login 是因为详情页取不到用户状态*/
        		//  "//member" + cookieDomain + "/gome/index/loginStyle"

        		$.ajax({
        		    type: 'get',
        		    url: '//member' + cookieDomain + '/gome/index/loginStyle',
        		    dataType: 'jsonp',
        		    jsonpName: 'detaillogin',
        		    success: function (data) {
        		    	if(data && data.loginStatus && data.loginStatus == 3){
        		    				$.ajax({
        		    				    type: 'get',
        		    				    url: '//member' + cookieDomain + '/myaccount/myFootprint/myFootprintList?type=2&pageSize=10&areaCode='+g.cityCode(3),
        		    				    dataType: 'jsonp',
        		    				    jsonpName: 'ckdatarecentViewed',
        		    				    success: function (data){
        		    				    if(data && data.result && data.result.length>0){
        		    				    	var _html = TemplateEngine(tpl_1,data.result);
        		    				    		$("#rangedBrowsedProd").html(_html);

        		    				    }

        		    				    }});
        		    	} else { 

        		    		var _prs = $.cookie("proid120517atg");
			                var $p=[];
			                if(_prs){
			                    $p=eval(_prs);
			                }
			                if($p.length<=0){
			                    
			                }else {

			                	$.ajax({
			                	    type: 'get',
			                	    url: '//ss' + cookieDomain + '/item/v1/browse/prdreturn/' + $p.join(',') + '/100/'+g.cityCode(2)+'/'+g.cityCode(3)+'/flag/item/recentViewed',
			                	    dataType: 'jsonp',
			                	    jsonpName: 'recentViewed',
			                	    success: function (data) {
			                	        if (data.success) {
			                	            if(data && data.result && data.result.length>0){
			                	            	var _html = TemplateEngine(tpl_2,data.result);
			                	            		$("#rangedBrowsedProd").html(_html);
			                	            }
			                	        }
			                	    }
			                	});

			                }
        		    		
        		    	}

        		    }})

                
            });

}(window,prdInfo,$,templateSimple);