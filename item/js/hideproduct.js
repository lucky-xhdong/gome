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

/*统计*/
/*function statistics(){
    s.pageName="商品归档";
    s.channel="商品归档";
    s.prop1="商品归档";
    s.prop2="商品归档";
    s.prop3="商品归档";
    s.prop4="商品归档";
    var s_code=s.t();
    if(s_code)document.write(s_code);
};*/

function backDetail(){
    if ($('#fixtabox').hasClass("fixedtop")) {
        $("html,body").animate({ scrollTop: $("#gfixed").offset().top }, 100);
    }
    $("#prd_tbox").find("li.cur").each(function () {
        $('.delivers_process').loadsrc();
        // if ($(this).find('a').html().indexOf("售后服务") >= 0) {
        // $('.ziyingshouhou,.lianyingshouhou').loadsrc();
        // }
        if($("#prd_tbox li").eq(2).hasClass("cur")){
            $(".common-approbated").css({
                "display":"none"
            })
        }else {
            $(".common-approbated").css({
                "display":"block"
            })
        }
        if($("#prd_tbox li").eq(0).hasClass("cur") || $("#prd_tbox li").eq(1).hasClass("cur") || $("#prd_tbox li").eq(4).hasClass("cur")) {
            $(".approbated-label").css({
                "display":"block"
            })
        }else {
            $(".approbated-label").css({
                "display":"none"
            })
        }
        if($("#prd_tbox li").eq(2).hasClass("cur")) {
            $(".pdtl-shmn").css({
                "display":"none"
            })
        }else {
            $(".pdtl-shmn").css({
                "display":"block"
            })
        }
        // if ($(this).find('a').html().indexOf("包装与配送")>=0) {
        //     $('.baozhuangyupeisong').loadsrc();
        // }
        // if ($(this).find('a').html().indexOf("售后服务") >= 0) {
        //     $('.ziyingshouhou,.lianyingshouhou').loadsrc();
        // }
    });
};

;(function(){

	//是不是店铺商品
	prdInfo.isStore = (prdInfo.shopNo.length == 0 ? false : true);
	//3d商品
	prdInfo.isprd3d = (window.isprd3d ? true : false);
	//详情页属性
	var my = window.my || {};
	//金象网
	my.jxw = (g.url.g.indexOf('atguat') >= 0 && prdInfo.shopNo == '80000615')
		|| (g.url.g.indexOf('prelive') >= 0 && prdInfo.shopNo == '80006091')
		|| (g.url.g.indexOf('gome') >= 0 && prdInfo.shopNo == '80007081') //生产
		? true : false;

    //统计
 /*   statistics();*/

    // loadsrc (否者未调用的盒子中的图无法渲染)
    $(".pic-small,.jqzoom").loadsrc('gome-src');
    $('.opt-box img').each(function () {
        $(this).attr('src', $(this).attr('_src'));
    });

    /** 放大镜开始 **/
    $(".j-listroll").gRoll({ movenum: 4 });
    $(".jqzoom").gMagnifier();
    $(".jqzoom").click(function () {
        if (my.jxw) {//恶心的金象网
            return false;
        }
        //要传输的参数
        window.open($(".pic-l-b").attr("href") );
    });
    /** 放大镜结束 **/

    $("#prd_tbox li").eq(0).addClass("cur")
    $("#fixtabox").gfixed({ star: "#gfixed", target: "#fixtabox", fixed: "fixedtop" });
    $('#prdDesc').gTabs({ btnID: "#prd_tbox", boxID: "#prd_data", bind: 'click', hEven: backDetail, hide: 1, gomesrc: 0 });

   

    //推广商品(广告)
    $('.prd-main').gLoad(function () {
        var _this = $(this);
        $.ajax({
            type : "get",
            url : '//dsp.gome.com.cn/decision/cat/',
            dataType : "jsonp",
            data : {
                p : 125,
                catid :  prdInfo.catId,
                width_height: '210-210', //无160大小数据
                c : "gmAdBox"
            },
            jsonpName : "gmAdBox"
        }).done(function(data){
            if(data && data.length>0){
                var res={};
                res.lst=data;
                var htmlTpl = '\
				    <div class="pushbox gm-ad-box">\
						<h4 class="info">该商品已下柜，非常抱歉！</h4>\
						<h3 class="title">商品相关</h3>\
						<div class="andBuyOut">\
							<div class="andBuy-btnout">\
								<a data-btn="toRight" href="javascript:;"><b></b></a>\
								<a data-btn="toLeft" href="javascript:;"><s></s></a>\
							</div>\
							<div class="andBuy-cont">\
								<ul class="pushul clearfix">\
								<% for(var i=0,j=lst.length; i<j; i++){ %>\
									<li>\
										<a href="<%= lst[i].ldp %>"  target="_blank" title="<%= lst[i].ds %>" >\
											<img gome-src="<%= lst[i].src %>"  alt="<%= lst[i].ds %>" height="130" width="130">\
										</a>\
										<a href="<%= lst[i].ldp %>"  target="_blank" title="<%= lst[i].ds %>">\
										   <h2><%= lst[i].ds %></h2>\
										</a>\
										<p class="yuan colprice fb">¥<span><%= lst[i].pr %></span></p>\
									</li>\
								<% } %>\
								</ul>\
								<div style="clear:both;"></div>\
							</div>\
						</div>\
					</div>\
				';
                /* <div style="clear:both;"></div>去IE6里多出来的猪*/
                var products = "";
                var tlscroll = $('body').hasClass('w990') ? 5:6 ;
                $(".prd-main")
                    .append(template.compile(htmlTpl)(res))
                    .gLoad({
                        df:200,
                        e:function(){
                            if(typeof trackEvent!="undefined"){
                                trackEvent(5,products);
                            }
                        }
                    });
                if(data.length>tlscroll){
                    $('.gm-ad-box .andBuy-cont').gSlider({
                        isAuto:false,
                        isImgLoad:true,
                        dataOriginal:"gome-src",
                        showNum:tlscroll,
                        stepLen:tlscroll,
                        time:3000,
                        btnGo:{left:'[data-btn="toLeft"]',right:'[data-btn="toRight"]'}
                    });
                }else{
                    $(".gm-ad-box").loadsrc('gome-src');
                    $(".gm-ad-box .andBuy-btnout").children().addClass("disable");
                }
            }

        });
    });

	//规格参数添加品牌链接
	new function () {
		$('.guigecanshu').each(function () {
			if ($(this).html().indexOf('品牌：') === 0) {
				$(this).html('品牌：<a target="_blank" style="color:#069;" href="' + $('.local li').eq(4).find('a').attr('href') + '">' + $(this).attr('title') + '</a>');
			}
			if ($(this).html().indexOf('店铺名称') >= 0) {
				$(this).html('店铺名称：<a target="_blank" style="color:#069;" href="' + shopUrl + '">' + $(this).attr('title') + '</a>');
			}
		});
	}

    //排行榜: 同价位 同品牌 同类别
    $('#paihangbang').gLoad(function () {
        var _this = $(this), thirdCategoryName = $('.local li').eq(3).find('a').html();
        g.ajax(
            '//bigd'+gomeplusDomain+'/gome/rec',
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
                _this.find(".tonglei_wrap_title").html( thirdCategoryName + '热销排行榜');
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

    //浏览该商品的用户最终购买
    $('#mboxDynamicLeft').gLoad(function () {
        var _this = $(this);
        var boxid='box80';
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
                    html +=
                        '<a href="' + data.lst[i].purl + '"  target="_blank" title="' + data.lst[i].pn + '">\
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

    //浏览该商品的用户还浏览了
    $('#mboxDynamic').gLoad(function () {
        var _this = $(this);
        var boxid='box81';
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
                    html +=
                        '<a href="' + data.lst[i].purl + '"  target="_blank" title="' + data.lst[i].pn + '">\
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
                maiMaRecTrack({
                    ele : '#mboxDynamic',
                    links : '#mboxDynamic a'
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
            }
        ).done(function (data) {
            if (!(data.isSuccess=="Y" && data.size>0)){
                $('#mboxDynamicFoot').hide();
                return;
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

    //热词、相关关键词
    $('.hotwords').gLoad(function () {
        if(prdInfo.thirdCategoryName==""){
            $('.hotwords').hide();
            return false;
        }
        g.ajax(
           '//nlr'+cookieDomain+'/seoservice/'+ encodeURIComponent(prdInfo.thirdCategoryName).toLowerCase(), {
        }, {
            site: 'f'
        })
        .done(function (data) {
            if (!$.isEmptyObject(data) && data.html) {
                var arr=JSON.parse(data.html)
                  , len=arr.length;
                if(len>0){
                    //无热门链接，展示热词(相关关键词)模块标题
                    var showHead= $(".seohotlinks_wrap").length>0 ? "none" :"block";
                    var htmlTpl='\
                        <h2 class="hd" style="display:<%=showHead%>;">相关关键词:</h2>\
                        <div class="bd clearfix">\
                            <% for(var i=0,len=hotwords.length; i<len; i++){\
                                var hotword = hotwords[i];%>\
                                <a href="<%=hotwords[i].hotwordsUrl%>" target="_blank" title="<%=hotwords[i].title%> "><%=hotwords[i].title%></a>\
                            <% } %>\
                        </div>';
                    $('.hotwords').html(template.compile(htmlTpl)( {
                        hotwords : arr,
                        name : prdInfo.prdName,
                        showHead : showHead
                    }))
                    if(!$(".seohotlinks_wrap").length>0 ){
                        $('.hotwords').css("margin-top","10px")
                    }
                }else{
                    $('.hotwords').hide();
                }
            }else{
                $('.hotwords').hide();
            }
        });
    });

    $.ajax(stageJsServer + '/??/f2ejs/common/jfnend.min.js'+'?v='+the_Version, {
        dataType: "script",
        cache: true
    })
}
)()



