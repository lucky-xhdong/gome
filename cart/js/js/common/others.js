//提交订单页 提交订单成功页 购物车页
;(function(exports){
    //是否购物车页面
    function isCart(){
    	return $page.name=="cart";
    }
    //是否加入购物车成功页
    function isAddsuccess(){
    	return $page.name=="addsucess";
    }
    //是否提交订单页面
    function isShopping(){
    	return $page.name=="shopping";
    }
    //是否提交订单成功页
    function isOrderSuccess(){
    	return $page.name=="order-success";
    }
    function isAllowance(){
    	return $page.name=="allowance";
    }
    function isjixin(){
    	return $page.name=='jixin';
    }
    //设置标题
    if(isCart())$("#head-title").html("购物车").addClass("head-title-cart");
    if(isShopping())$("#head-title").html("订单信息").addClass("head-title-shopping");
    if(isOrderSuccess())$("#head-title").html("提交成功").addClass("head-title-odersuccess");
    if(isjixin())$("#head-title").html("订单信息").addClass("head-title-shopping");


 
    var codejs=stageJsServer+'/??/gmlib/unit/scode/1.0.0/scode.js,gmlib/unit/scodecommon/1.0.0/scodecommon.js';

    //埋码
    var ucode=util.cond([
    	[isCart,cartCode]
    	,[isShopping,shoppingCode]
    	,[isOrderSuccess,orderSuccessCode]
    	,[isAllowance,allowanceCode]
    	,[isAddsuccess,addsuccessCode]
    	,[isjixin,jixinCode]
    ]);
    ucode(null);
    // //购物车埋码
    // util.when(isCart,cartCode);
    // //提交订单页埋码
    // util.when(isShopping,shoppingCode);
    // //提交订单成功页埋码
    // util.when(isOrderSuccess,orderSuccessCode);
    // //是否节能补贴
    // util.when(isAllowance,allowanceCode);

    //购物车页埋码
    function cartCode(){
    	util_watch.watchOnce($page.name,"renderEnd",function(data){
    		asyncLoadCSSJS.loadJS(codejs,function(node){
    			$("[maima_param").live("click",function(){
    				recTrack($(this).attr("maima_param"));
    			});
				var prds = [];
				$('[bigdata-pid]').each(function () {
					prds.push(';' + this.getAttribute('bigdata-pid'));
				});
				var siteNames        = {};
			    siteNames.home       = '普通';
			    siteNames.groupOn    = '团购';
			    siteNames.rushBuy    = '抢购';
			    siteNames.secondHand = '淘实惠';
			    siteNames.warranty   = '延保';
			    siteNames.presell    = '预售';
			    var currentSite = siteNames[$page.site];
				s.pageName = "购物流程:" + currentSite + "流程:购物车";
				s.channel  = "购物流程";
				s.prop1    = "购物流程:" + currentSite + "流程";
				s.prop2    = "购物流程:" + currentSite + "流程:购物车";
				s.prop3    = "购物流程:" + currentSite + "流程:购物车";
				s.prop4    = "购物流程:" + currentSite + "";
				s.events   = "scView"; 
				s.products = prds.join(',')
				 var s_code=s.t();
				 if(s_code){
				 	document.write(s_code);
				 };
				//购物车页面siteMonitor跟踪代码
				if(cartApp.isCartEmpty(data))return;
				//如果是延保站点
				if(cartApp.isWarrantySite())return;
				var u=util;
	    		var commerceItemsGroupsfn=u.pipe(u.prop("commerceItemsGroups"),u.map(u.prop("commerceItemsGroup")));
	    		var preitmes=u.map(commerceItemsGroupsfn,data.data.siVOs);
	    		var items=u.flatten(preitmes);
	    		function customAction(a){
	    			return $config.renderText(a,"id@{productId}_price@{salePrice}_num@{quantity}");
	    		}
	    		gomeClicki('send', 'event', '购物车页面', '购物车产品', '产品信息', {
				    'customActionId': 55,
				    'customActionLabel1': u.map(customAction,items).join(","),
				    'customActionValue1': 1,
				    'nonInteraction': 1
				});
    		});
    	});
    }
    function tpmmFn(tpmmtag,data){
    	function smAction(a){
			return $config.renderText(a,"id@{pid}_price@{salePrice}_num@{quantity}");
		}
		function omAction(a){
			return $config.renderText(a,";{pid};{quantity};{salePrice}");
		}
		asyncLoadCSSJS.loadJS(codejs,function(){
			var arr=tpmmtag.split('|')
	    	var s=s_gi(s_account);
			s.linkTrackVars="events，products"
			s.linkTrackEvents="event"+arr[1];
			s.events="event"+arr[1];
			s.products = util.map(omAction,data).join(",");
			s.tl(this,'o',arr[0]);

			gomeClicki('send', 'event', '购物流程', '填写订单',  arr[0], "productId", {
		    	'customActionId':arr[1],
		    	'customActionLabel1':util.map(smAction,data).join(",")
		  	});
		})
    }
    //提交订单页埋码
    function shoppingCode(){
    	//提交订单页分模块埋码
    	util_watch.watch($page.name,"rendertpmmEnd",function(data){
			$('[tpmmtag]').on('click',function(){
				tpmmFn($(this).attr('tpmmtag'),listOfItem.filterAllItems(util.T,data))
			})
    	})
    	util_watch.watchOnce(listOfItem.TYPE,"renderEnd",function(im){
    		if($page.site=="haiwaigou"){
    			window.s_account = "gome-prd,gome-higo-prd";
    		}
	        asyncLoadCSSJS.loadJS(codejs,function(){
	            var allItems=listOfItem.filterAllItems(util.T,im);
	            var siteName={
	                "haiwaigou":"海外购",
	                "home":"普通",
	                "groupOn":"团购",
	                "rushBuy":"抢购",
	                "secondHand":"淘实惠",
	                "warranty":"延保",
	                "presell":"预售",
	                "gomeEntityCard":"普通"
	            }[$page.site];
	            function productstr(item){
	            	var warryPrice="";//延保价格
	            	var ptype="";//产品归类（自营命名为“gome”联营命名为“coo8”）|
	            	var shopId="";//自营为空
	            	var itemType="普通";//商品类型
	            	if(item.incre)warryPrice=item.incre.price;
	            	var gome=listOfItem.isGome(item,im);
	            	if(gome)ptype="gome";
	            	else ptype="coo8";
	            	if(!gome){
	            		var shop=listOfItem.getShopByItem(item,im);
	            		shopId=shop.shopId;
	            	}
	            	itemType=siteName;
	            	return [
	            		";"
	            		,item.productId
	            		,";;;event13="
	            		,warryPrice
	            		,";eVar23="
	            		,ptype
	            		,"|eVar24="
	            		,shopId
	            		,"|eVar29="
	            		,itemType
	            	].join("");
	            }
	            function isGomeVirtualCard(){
	            	return $page.site=="gomeVirtualCard";
	            }
	            //电子卡pids
	            function virtualProductstr(item){
	            	return [
	            		";"
	            		,item.productId
	            		,";;;event13="
	            		,""
	            		,";eVar23="
	            		,"gome"
	            		,"|eVar24="
	            		,""
	            		,"|eVar29="
	            		,"普通"
	            	].join("");
	            }
	            var pids=util.map(util.ifn(isGomeVirtualCard,virtualProductstr,productstr),allItems);
	            siteName=siteName||"普通";
	            s.pageName = "购物流程:"+siteName+"流程:填写订单";
	            s.channel  = "购物流程";
	            s.prop1    = "购物流程:"+siteName+"流程";
	            s.prop2    = "购物流程:"+siteName+"流程:填写订单";
	            s.prop3    = "购物流程:"+siteName+"流程:填写订单";
	            s.prop4    = "购物流程:"+siteName+"";
	            if($page.site=="gomeEntityCard"){
	            	s.prop4    = "购物流程:"+siteName+":实体卡";
	            }
	            if($page.site=="gomeVirtualCard"){
	            	s.prop4    = "购物流程:"+siteName+":电子卡";
	            }
	            s.events   = "scCheckout"; 
	            s.products = pids.join(",")
	            var s_code=s.t();
	            if(s_code){
	                document.write(s_code);
	            };
	        });
	    });
    }
    
    //提交订单成功页埋码
    function orderSuccessCode(){
    	util_watch.watchOnce($page.name,"renderEnd",function(data){
    		asyncLoadCSSJS.loadJS(codejs,function(){codefn(data)});
    	});
    	function codefn(data){
			s.pageName = "购物流程:"+data.trackData.siteName+"流程:订单成功页";
		    s.channel = "购物流程";
		    s.prop1 = "购物流程:"+data.trackData.siteName+"流程";
		    s.prop2 = "购物流程:"+data.trackData.siteName+"流程:订单成功页";
		    s.prop3 = "购物流程:"+data.trackData.siteName+"流程:订单成功页";
		    s.prop4 = "购物流程:"+data.trackData.siteName;
		    s.events = "purchase"
		    s.products = data.trackData.products;
		    s.eVar11 = data.trackData.eVar11;
		    s.transactionID = data.trackData.transactionID;
		    s.purchaseID = data.trackData.purchaseID;
		    s.eVar5 = data.eVar5;
		    s.eVar6 = data.eVar6;

		    var s_code = s.t();
		    if (s_code)document.write(s_code);

		    //我也不知道啥玩意非得让我埋码！
			gomeClicki('send', 'event', '订单', '订单监测', data.trackData.purchaseID, {
				'customActionId': 52,
				'customActionLabel1': data.trackData.purchaseID, // 订单ID - orderid
				'customActionLabel2': data.payAmount,     // 订单总金额
				'customActionLabel3': data.trackData.siteName,       // 站点名称
				'customActionValue1': '1'
			});
			var pdts=data.trackData.products.split(",");
			function fn1(a){
				var xs=a.split(";");
				return $config.renderText({
					productId:xs[1],
					salePrice:xs[3],
					quantity:xs[2]
				},"id@{productId}_price@{salePrice}_num@{quantity}");
			}
			gomeClicki('send', 'event', '订单', '订单产品', data.trackData.purchaseID, {
			    'customActionId': 54,
			    'customActionLabel1': data.trackData.purchaseID, 
			    'customActionLabel2': util.map(fn1,pdts), 
			    'customActionValue1': '1'
		  });
    	}
    }


    //节能补贴页面埋码
    function allowanceCode(){
    	util_watch.watchOnce($page.name,"renderEnd",function(data){
    		asyncLoadCSSJS.loadJS(codejs,function(){codefn(data)});
    	});
    	function codefn(data){
			if(typeof s !== 'undefined'){
				s.pageName='购物流程:节能补贴身份认证信息填写页';
				s.channel='购物流程';
				s.prop1='购物流程:节能补贴身份认证信息填写页';
				s.prop2='购物流程:节能补贴身份认证信息填写页';
				s.prop3='购物流程:节能补贴';
				s.prop4='购物流程:普通';
				var s_code=s.t();
				if(s_code)document.write(s_code);
			}
    	}
    }
    //极信站点埋码
    function jixinCode(){
    	util_watch.watchOnce($page.name,"renderEnd",function(data){
    		asyncLoadCSSJS.loadJS(codejs,function(){codefn(data)});
    	});
    	function codefn(data){
			s.pageName='购物流程:极信通身份认证信息页';
			s.channel='购物流程';
			s.prop1='购物流程:极信通身份认证信息页';
			s.prop2='购物流程:极信通身份认证信息页';
			s.prop3='购物流程:极信通';
			s.prop4='购物流程:普通';
			var s_code=s.t();
			if(s_code)document.write(s_code);
    	}
    }
    //加入购物车成功页埋码
    function addsuccessCode(){
    	asyncLoadCSSJS.loadJS(codejs,function(){codefn()});
    	function codefn(){
			s.pageName = "购物流程:加入购物车成功页";
            s.channel = "购物流程";
            s.prop1 = "购物流程:加入购物车成功页";
            s.prop2 = "购物流程:加入购物车成功页";
            s.prop3 = "购物流程:加入购物车成功页";
            s.prop4 = "购物流程:"+(window.location.href.indexOf("haiwaigou") != -1)?"海外购商品":"普通";

            var s_code = s.t();
            if (s_code)document.write(s_code);

            $("[maima_param").live("click",function(){
				recTrack($(this).attr("maima_param"));
			});
    	}
    }
    //前端购物车信息输出
    var dlog=function(){

    }
    var em2=["font-size:2em"];
    var nomarlFont=[
            ["color:#CC0066"]
            ,["color:#CC9966"]
            ,["color:#FF99FF"]
            ,["color:#006600"]
            ,["color:#0099CC"]
            ,["color:#330066"]
            ,["color:#333300"]
            ,["color:#336633"]
            ,["color:#999900"]

    ];
    var bigFont=util.map(util.concat(em2),nomarlFont);
    if(window.console&&window.console.log.apply){
        function getItems(num,items){
            if(num==0)return [];
            var idx=num%items.length;
            return util.concat([items[idx]],getItems(num-1,items));
        }
        dlog=function(info,styles){
            styles.sort(function(a,b){return Math.random()>0.5});
            var astyles=getItems(info.length,util.map(function(a){return a.join(";")},styles));
            console.log.apply(console,["%c"+info.split("").join("%c")].concat(astyles));
        };
        dlog("gome-cart-front-0-2-2",bigFont);
        dlog("..........",nomarlFont);
        Object.defineProperty(exports,"招聘前端",{
        	set:function(x){},
        	get:function(){
        		return info();
        	}
        });
      
    }
    function info(){
    	try{
	    	var qqinfo='\
	    	<div style="padding-top:33px;">\
		    	<a \
		    	target="_blank" \
		    	href="http://wpa.qq.com/msgrd?v=3&uin=262666212&site=qq&menu=yes">\
		    		<img \
		    		border="0" \
		    		src="http://wpa.qq.com/pa?p=2:262666212:51" \
		    		alt="招聘前端" \
		    		title="点击这里给我发消息"/>\
		    	</a>\
		    </div>\
	    	';
	    	return $("#head-box")
	    	.html(qqinfo)
	    	.find("img");
    	}catch(e){

    	}
    }

    //暴力删除360浏览器 比价插件
    function remove360bijia(){
	    $("body").on("DOMNodeInserted",function(e){
		   if($(e.target).is(".mmz_float_curve")) $(e.target).remove();
		});
    }


    exports.others={
    	dlog:dlog,
    	info:info,
    	nomarlFont:nomarlFont,
    	bigFont:bigFont
    };

}(this));