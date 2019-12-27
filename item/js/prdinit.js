;(function(exports,$,prdInfo){
			//w990 下处理大图
			if($('body').hasClass('w990')){
				$('.magnifier,.toolbar').removeClass('isupportpic');  
				prdInfo.iSupport=false;
				$('.magnifier .jqzoom img').width(360).height(360);
			} 
            /*非本地调试环境*/
            if(window.location.href.indexOf("localhost")==-1)
			   seajs.config(stageJsServer+"/??/"); 
			var vison=20161025;
			/*加载点击的事件的js*/
			$('body').on('click','#applebtn,#reduce,#arrival,#showWish,#pdtl-submit,#rendBuy,#collect,#easyShopping,#pay_fenQi,#collect_shop,#zy_collect_shop,.shareGold,#address,#goappr,#showScoreMore,.lanjuan-top .blue-label,#addedService .mod-link,#addCart,#addCartLink,.pic-btn em,#telecom,#telecom_buy,#zi_telecom a,#bargain,.j-corr, .prdTaoGou.different',function(evt){
				evt.preventDefault();
				/*evt.stopPropagation();*/
				var _this=$(this);
				var loadClickJs=$('#loadClickjs').attr('data');
				if(!loadClickJs){
					$.ajax(stageJsServer+'/??/gmlib/unit/gcity/1.0.0/gcity.min.js,/gmlib/unit/cart/1.0.0/addCart.min.js,/gmlib/ui/gmagnifier/1.0.1/gmagnifier.min.js,gmlib/ui/groll/1.0.0/groll.min.js,/gmlib/ui/gpop/1.0.0/gpop.min.js,/gmlib/ui/sharebigdata/1.0.0/sharebigdata.min.js?='+vison,{
							dataType: "script",
							cache: true
						}).then(function(){
							/** 放大镜开始 **/
							$(".j-listroll").gRoll({ movenum: 4 });
							prdInfo.iSupport?$(".jqzoom").gMagnifier({xzoom:448,yzoom:448}):$(".jqzoom").gMagnifier();
							seajs.use(['/js/prdServer.js','/js/item/breadcrumb.js','/js/gSuits.js'],function(){
								 $('#loadClickjs').attr('data',true);
                                    _this.click();					
							});
						});
		         }
			});

		var bigpic=""; //解决向上滑油bug
		/*滑过加载js*/
		$('body').on('mouseenter','#applebtn,#addCart,#mobtn,.ly-stores,.j-corr,.j-gACbtnA,#addCartLink,#easyShopping,#yuye_more,.prd-cuxiao-other,.prd-promotions #shoujizhuanxiang_saosao,.shareGold,.freightnote,#addedService .prdmod,#addedService .more,.pic-small,.jqzoom,.jqzoom1,.has-breads',function(evt){
				evt.stopPropagation();
				var _this=$(this);
				var loadClickJs=$('#loadClickjs').attr('data');
				if(!loadClickJs){
					$.ajax(stageJsServer+'/??/gmlib/unit/gcity/1.0.0/gcity.min.js,/gmlib/unit/cart/1.0.0/addCart.min.js,/gmlib/ui/gmagnifier/1.0.1/gmagnifier.min.js,gmlib/ui/groll/1.0.0/groll.min.js,/gmlib/ui/gpop/1.0.0/gpop.min.js,/gmlib/ui/sharebigdata/1.0.0/sharebigdata.min.js?='+vison,{
						dataType: "script",
						cache: true
					}).then(function(){
						seajs.use(['/js/prdServer.js','/js/item/breadcrumb.js','/js/gSuits.js'],function(){
							/** 放大镜开始 **/
							$(".j-listroll").gRoll({ movenum: 4 });
							prdInfo.iSupport?$(".jqzoom").gMagnifier({xzoom:448,yzoom:448}):$(".jqzoom").gMagnifier();
							if(bigpic==0){
									_this.mouseover();
								};
						});
					});
		         };
		         $('#loadClickjs').attr('data',true);
		}).on('mouseleave','#addCartLink,#easyShopping,#yuye_more,.prd-promotions #shoujizhuanxiang_saosao,.freightnote,#addedService .more,.pic-small,.jqzoom,.jqzoom1,.has-breads',function(){
			bigpic=1;
		});


	$('#prd_data').gLoad(function(){
		if(prdInfo.isvideo){
			var video = new MeixinPlayer();
			//商品简介处视频
			video.init(prdInfo.videoid, "meixin_tv",{"autoplay":0,"env":prdInfo.meixinshiping});
		};
		if(prdInfo.loadbot){
			return false;
		};
		$.ajax(stageJsServer+'/??/gmlib/ui/gphotoviewer/1.0.0/gphotoviewer.min.js,/gmlib/ui/gmimageviewer/1.0.0/gmimageviewer.min.js,/gmpro/1.0.0/item/2.0.0/item/1.0.0/js/appraisal.min.js,/gmlib/ui/gpage/1.0.1/gpage.min.js,/gmlib/ui/gpop/1.0.0/gpop.min.js,/gmpro/1.0.0/item/2.0.0/item/1.0.1/js/productAdvice.min.js,/gmpro/1.0.0/item/2.0.0/item/1.0.1/js/dtcommend.min.js,/gmlib/ui/gfixed/1.0.0/gfixed.min.js?='+vison,{
			dataType: "script",
			cache: true
		}).then(function(){
			seajs.use(['/js/prdParts.js','/js/jquery.gWaterfall.js','/js/prdPraiseGoods.js']);
		});
		prdInfo.loadbot=true;//已经加载无须加载
	});
	


	//大图页旋转

	function imgload(i){
		var i=i;
		if(prdInfo.groatepic[i]){
			
			$('#imgloads').append('<img src="'+prdInfo.groatepic[i]+'"/>');
			$('#imgloads').find('img').load(function(k){
				i++;
				imgload(i)
			});
		}else{
			$('.picloding').remove();
			$(".jqzoom1").roate({
					"mousetip":"<i class='mousetip animated infinite slideInLeft'></i>)",
					"alltatepic":prdInfo.groatepic,
					"clickdownfn":function(){
						/*按下时候的操作*/
						$('.zoomdiv,.jqZoomPup,.mousetip').hide();
					},
					"clickupfn":function(curs){
						/*按上时候的操作*/
						$('.zoomdiv,.jqZoomPup').show();
						$('.zoomdiv img').attr('src',prdInfo.groatepic[curs]);
					},"mousewhel":function(cur){
						/*大图跟着改变*/
						$('.zoomdiv,.jqZoomPup,.mousetip').hide();
					}
				});
		}
	}
	
	if(!$.isEmptyObject(prdInfo.groatepic)){
		imgload(0);
	}
	


	//下面导航栏

	/* 商品详情页：套购、推荐配件*/
	$(".j-dt-tab").gTabs({ btnID: ".j-dtprobit", boxID: ".j-dtabcontent", gomesrc: 1 });
	/* 商品详情页：商品描述绑定 */
	$('#prdDesc').gTabs({ btnID: "#prd_tbox", boxID: "#prd_data", bind: 'click', hEven: backDetail, hide: 1, gomesrc: 0 });
    // 如果详情页hash值包含gm-other-info,则选中"商品评价"
    $('#prdDesc').gLoad(function(){
        if(window.location.hash.indexOf("gm-other-info")>-1){
            $("#prd_tbox li").eq(2).click();
        }
    });
	
	


	/* 商品详情页：小助手 */
	$('#helper').gTabs({ btnID: ".helptit", boxID: ".pedhelptab", hide: 1 });
	/* 商品详情页：回到描述信息*/
	function backDetail() {
	    //if ($("#prd_tbox").find("li").eq(2).hasClass("cur")) {
	    if ($("#prd_tbox").find("li").eq(($('#threeD_show').length==0)?2:3).hasClass("cur")) {//3d商品是3 普通商品是2
	        $(".pdtl-shmn,#prd_data").hide();
	    } else {
	        $(".pdtl-shmn,#prd_data").show();
	    }
	    if ($('#fixtabox').hasClass("fixedtop")) {
	        $("html,body").animate({ scrollTop: $("#gfixed").offset().top }, 100);
	    }
	    if ($('#fix-stores-name').hasClass("fixedtop")) {
	        $("html,body").animate({ scrollTop: $("#gfixed").offset().top }, 100);
	    }

	    $("#prd_tbox").find("li.cur").each(function () {
	    	$(window).scroll();
			$('.delivers_process').loadsrc();
	        // if ($(this).find('a').html().indexOf("售后服务") >= 0) {
	            // $('.ziyingshouhou,.lianyingshouhou').loadsrc();
	        // }
			if($("#prd_tbox li").eq(5).hasClass("cur")){
				$(".bd-praise-goods h2, #j-comment-section").css({
					"display":"none"
				})
				$(".praise-goods-lists").css({
					padding: '12px 0 30px'
				})
			}else {
				$(".bd-praise-goods h2, #j-comment-section").css({
					"display":"block"
				})
				$(".praise-goods-lists").css({
					padding: '30px 0'
				})
			}
			if($("#prd_tbox li").eq(2).hasClass("cur") || $("#prd_tbox li").eq(5).hasClass("cur")){
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
	    });
	};

	 /* 浏览记录操作：读取和写入cookie   pid商品ID broBox浏览记录模型选择器 */
	 function browsedCookie(){
	     var _prs = $.cookie("proid120517atg");
	     var _p_ = []; try { eval('var _p_=' + _prs); } catch (e) { }; if (!_p_) _p_ = [];
	     //使用包含prdInfo.sku的链接，如果拥有prdInfo.sku
	     for(var k=0; k < _p_.length; k++){
	        if(_p_[k].indexOf(prdInfo.prdId)==0){
	            prdInfo.sku ? _p_[k]=prdInfo.prdId+"-"+prdInfo.sku:_p_[k]=prdInfo.prdId;
	        }
	     };
	     _p_.unshift(prdInfo.sku ? prdInfo.prdId+"-"+prdInfo.sku : prdInfo.prdId );
	     //_p_.unshift(prdInfo.prdId );
	     var _z_ = {}; for (var i = 0; i < _p_.length; i++) { _z_[_p_[i]] = _p_[i]; }; _p_ = []; for (var v in _z_) { _p_.push(_z_[v]); };
	     var showCount=$('body').hasClass('w990') ? 8 : 10;
	     if (_p_.length >= showCount) _p_ = _p_.slice(0, showCount);

	     var $domain=cookieDomain;
	     if(location.host.indexOf("hk")!=-1){
	         $domain=location.host.replace("item","");
	     }
	     $.cookie('proid120517atg', '["' + _p_.join('","') + '"]', { expires: 7, path: '/', domain: $domain });
	 }
	if(prdInfo.sapSkuType=="ZHK" || prdInfo.sapSkuType=="ZLH" || prdInfo.sapSkuType=="ZHYJ" || prdInfo.sapSkuType=="ECTZ" || prdInfo.sapSkuType=="ZJXK" || prdInfo.sapSkuType=="ZJXJ"){

	}else{
	 browsedCookie();
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
	exports.maiMaRecTrack=maiMaRecTrack;
})(window,$,prdInfo);