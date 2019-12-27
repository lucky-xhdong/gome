/**
*核对订单页入口
*authorization 只有海外购才会引入js auhorization.js
*此模块 维护 各个小模块之间的关系 和 接口交互
*各站点名称
	home    主站
    secondHand  残次品（二手）站点
    warranty    延保站点
    contractPhone   合约机站点
    groupOn 团购站点
    rushBuy 抢购站点
    haiwaigou   海外购站点
    presell 预售站点
    directionalCoupon   定向券站点
	allowance  节能补贴
	applePc  苹果特惠
	实体卡站点: gomeEntityCard
	电子卡站点：gomeVirtualCard
*/
!function(
	exports,
	u,
	ui,
	uw,
	req,
	address,
	payment,
	listOfItem,
	commitOrder,
	preferential,
	invoice,
	intor,
	listOfItemMethod){
	var TYPE="shopping";
	var isNotLoadAll = false;//_reloadAll 方法专用，【异常后，需不需要刷新页面】
	//是否实体卡站点
	function isGomeEntityCardSite(){
		return  $page.site=="gomeEntityCard";
	}
	//是否电子卡
	function isGomeVirtualCardSite(){
		return $page.site=="gomeVirtualCard";
	}
	//是否是海外购
	function isHwg(){
		return $page.site=="haiwaigou";
	}
	//是否节能补贴
	function isAllowance(){
		return $page.site=="allowance";
	}
	function isApplePc(){
		return $page.site=="applePc";
	}
	//是否二手
	function isSecondHand(){
		return $page.site=="secondHand";
	}

	function isPresell(){
		return $page.site=="presell";
	}

	function isHome(){
		return $page.site=="home";
	}

	//购物车URL
	function cartUrl(){
		if($page.site=="home")return "/";
		if($page.site=="haiwaigou")return "/";
		if($page.site=="allowance") return "/";
		if($page.site=="gomeEntityCard") return "//card"+cookieDomain;
		if($page.site=="gomeVirtualCard") return "//card"+cookieDomain;
		if($page.site=="operator") return '//myhome'+cookieDomain+'/member/myOrder';
		if($page.site=="warranty") {
			var str=window.location.href.split("?")[1];
            var strOid = null,strSid = null,strCid = null;
			if(str!= null){
                strOid = str.split("&")[0];
                strSid = str.split("&")[1];
                strCid = str.split("&")[2];
			}
			return "/warranty/cart?" + strOid + "&" + strSid + "&" + strCid;
		}
		return "/"+$page.site+"/cart";
	}
	//分支函数
	function branch(fn1,fn2){
		return function(data){
			return [fn1(data),fn2(data)];
		}
	}
	//带错误处理的分支
	function branchErrorWarp(errfn,successfn){
		return branch(whenErrorWarp(errfn),intor.unlessError(successfn));
	}
	//不带错误处理的分支处理
	function branchWarp(errfn,successfn){
		return branch(intor.whenError(errfn),intor.unlessError(successfn));
	}
	function postapi(path,params){
		panel.mask();
		return onlyPostapi(path,params).always(panel.maskHide);
	}
	function onlyPostapi(path,params){
		setOfflineStatus(path);
		if(isHwg()){
			return req.postApi("home",path,params);
		}
		if($page.site=="allowance") return req.postApi("home",path,params);
		return req.postApi($page.site,path,params);
	}

	function setOfflineStatus(path){
		if(!isHome()) return;
		//是否是地址或者提交订单相关操作
		function hasAddrpath(url){
			var paths = [commitOrderUrl,addAddressUrl,updateAddressUrl,selectAddressUrl,removeAddressUrl,setDefaultAddressUrl,
						addZtAddressUrl,updateZtAddressUrl,selectZtAddressUrl,removeZtAddressUrl];
			return u.isEmpty(u.filter(function(item){
				return url == item;
			},paths)) ? false : true;
		}

		//返回是否弹处线下转线上状态值
	    var status= u.cond([
			[hasAddrpath,u.always(1)],
			[u.eq(initOrderUrl),u.always()],
			[u.T,u.always(2)]
		])(path);

		if(!u.isNil(status)) $config.shoppingAddressAtom.offlineStatus = status;
	}

	//返回购物车写区域cookie
	function writeAreaCookie(){
		if($config.shoppingInstenceAtom.address==null)return false;
		var item=address.selectedAddress($config.shoppingInstenceAtom.address);
		if(item==null || item.ismdzt)return false;
		$.cookie('atgregion', [
			item.origin.address.countyCode,
			item.origin.address.provinceName+item.origin.address.cityName+item.origin.address.countyName+item.origin.address.townName,
			item.origin.address.cityCode,
			item.origin.address.provinceCode,
			item.origin.address.townCode
		].join("|"), {expires:30,path:'/',domain:cookieDomain});
		return true;
	}
	function gotoCart(){
		ui.redir(cartUrl());
	}

	function gotoHome(){
        ui.redir('//www' + cookieDomain);
	}

	//返回购物车修改
	function modifycart(){
		if ($page.site=="applePc") {
			var href = $('._apple_pc').attr('href');
			ui.redir(href);
		}
		else {
			writeAreaCookie();
			ui.redir(cartUrl());
		}
	}

	//更换收货地址
	function modifyAddress(dialog){
		address.modify($config.shoppingInstenceAtom.address);
		dialog.hide();
	}

	//初始化页面 收获地址变更 提交订单 无货不支持配送 下架校验弹窗
    //(2018年2月28日14:38:57) 无货、区域无货、下架、不支持配送几种状态前端不再做提前拦截，提交订单时统一跳到是否移除的弹窗
	function notStockNotSupportTip(im){
		if($config.shoppingAddressAtom.offlineToOnline) return false;
		$config.shoppingAddressAtom.errorStatus = -1;
		//延保和电子卡站点忽略验证
		if($page.site=="warranty" || isGomeVirtualCardSite())return false;
		if(im==null){
			panel.alert("商品清单异常");
			return true;
		}
		//无货
		var noinventory=u.pipe(u.prop("state"),u.eq("NO_GOODS"));
		//不支持配送
		var nosupport=u.pipe(u.prop("state"),u.eq("DELIVERY_NOT_SUPPORTED"));
		//下架状态
		var itemoff=u.pipe(u.prop("state"),u.eq("OFF"));
		var items=listOfItem.filterAllItems(u.anyPass([noinventory,nosupport,itemoff]),im);

		if(!u.isEmpty(items)) {
			items=listOfItem.filterMainItem(items);
		}
		if(u.isEmpty(items)){
			return false;
		}

		var tipfn=u.cond([
				[isGomeEntityCardSite,u.always({title:"无货",type:3})],
				[nosupport,u.always({title:"该区域暂不支持配送",type:3})],
				[noinventory,u.always({title:"以下商品此区域无货",type:3})],
				[itemoff,u.always({title:"已下架",type:3})]
			]);

		function btnfn(){
			var closeBtn={
				clazz:"btn btn-default btn-w83",
				btnName:"关闭",
				click:function(){
					$(".g-panel.confirm .closebtn-new").click();
				}
			}

			if(isGomeEntityCardSite()){
				return [closeBtn,{
					clazz:"btn btn-primary btn-w83 mr50",
					btnName:"去逛逛",
					click:modifycart
				}];
			}
			/*电信运营商站点和极信通站点不能用返回购物车按钮，所以单独处理*/
			if($config.isDxSite() || $config.isJixinSite()){
				return [closeBtn,{
					clazz:"btn btn-primary btn-w83 mr50",
					btnName:"更换收货地址",
					click:modifyAddress
				}];
			}
            /*二手残次品不能用返回购物车按钮，所以单独处理*/
            if(isSecondHand()){
                return [{
                    clazz:"btn btn-primary btn-w83 mr50",
                    btnName:"更换收货地址",
                    click:modifyAddress
                }];
            }

			return [{
				clazz:"btn btn-default btn-w83 mr50",
				btnName:"返回修改",
				click:modifycart
			},{
				clazz:"btn btn-primary",
				btnName:"更换收货地址",
				click:modifyAddress
			}];
		}

		panel.confirm({
            body: function(){
				var opt = tipfn(items[0]);
	            return GTPL.commitOrder_offlineTip({
					items:u.map(function(item){
						item.picUrl=item.itemImageURL
						item.displayName=item.itemName
						return item
					},items),
					title:opt.title || "",
					type:opt.type || 0
				})
	        },
            btns: btnfn(),
            close: ui.hide
        });
		return true;
	}
	//通用错误提示,所有接口请求错误走这里
    function errfn(data){
		$config.shoppingAddressAtom.errorStatus = 1;
        function alertBackHome(){
        	var btnName = '逛逛商城';
                data.errMsg="抱歉，您还不是企业用户，无权提交订单，去挑选其他商品吧!";

            return panel.confirm({
                type:panel.TYPE.WARN,
                body:data.errMsg,
                btns:[{
                    clazz:"btn btn-primary",
                    btnName:btnName,
                    click:u.pipe(gotoHome)
                }],
                close:false
            })
        }
		function alertBackCart(){
			var btnName="返回购物车修改";
			if(isGomeEntityCardSite() || isGomeVirtualCardSite()){
				btnName="去逛逛"
			}
			if($config.isQygSite() && data.status === 'COMMIT_ILLEGAL'){
                data.errMsg="抱歉，您目前还没有购买工程机商品权限，请重新挑选商品。"
			}
			return panel.confirm({
				type:panel.TYPE.WARN,
				body:data.errMsg,
				btns:[{
					clazz:"btn btn-primary",
					btnName:btnName,
					click:u.pipe(writeAreaCookie,gotoCart)
				}],
				close:false
			})
		}
		//活動太火爆，只可以抢购X件 或者 限制数量为0 不可以抢购
		function alertLimitCart(btnName,ifGoback){
			var dialog = panel.confirm({
				type:panel.TYPE.WARN,
				body:data.errMsg,
				btns:[{
					clazz:"btn btn-primary",
					btnName:btnName,
					click:ifGoback ? u.pipe(writeAreaCookie,gotoCart) : function(){
						dialog.hide()
					}
				}],
				close: function () {
					dialog.hide()
				}
			});
		}

		function dxerrAction(dialog){
			if(data.errCode=='0010010070'){
				ui.redir('//myhome'+cookieDomain+'/member/myOrder')
			}else{
				dialog.hide()
			}
		}
		function alertOfflineTip(){
			$config.shoppingAddressAtom.errorStatus = 2;
			if($config.shoppingAddressAtom.offlineStatus < 2 && $config.shoppingAddressAtom.offlineToOnline) return;
			if(data.success || data.data.length == 0) return;
            var sType = null;
            if(data.status == "NE_P"){
                sType = 0;
            }else if(data.status == "NE_G"){
                sType = 1;
			}else if(data.status == "NE_I"){
                sType = 6;
            }else{
                sType = 4;
            }
			commitOrder.offlineTip({
				callbacks:[modifycart,modifyAddress],
				data: data.data,
				type: sType  //0 库存不足  1 赠品不足  4运能不足
			});
		}
		function alertApplePcTip(data){
			$config.shoppingAddressAtom.errorStatus = 2;
			var dataTemp= {
				title:'',
				flag:0,
				data:[]
			};
			if (data.errCode=="0010600007") {
				dataTemp.flag=3;//商品已结束苹果特惠
				dataTemp.title = data.errMsg;
				dataTemp.data=[];
			}
			else {
				if (data.errCode=="0010600000") {
					dataTemp.flag = 1;//主品
				}
				if (data.errCode=="0010600001") {
					dataTemp.flag =0;//赠品
				}
				
				dataTemp.title = JSON.parse(data.errMsg).errMessage;
				dataTemp.data = JSON.parse(data.errMsg).inventoryInfoRDTOs;
			}
			commitOrder.offlineTip({
				callbacks:[modifycart,modifyAddress],
				data: dataTemp,
				type: 5  //自定义的提示语
			});
		}
        //预约抢购错误返回状态 弹窗移除
        function alertReMoveYyqg(data){
            var arr = [],arrHG = [];
            for(var i=0; i<data.length; i++){
                var items = data[i].items;
                for(var j=0 ;j<items.length; j++){
                    if(arr.indexOf(items[j]) == -1 && items[j].itemId !== null){
                        if(items[j].type !== "HG"){
                            arr.push(items[j].itemId);
                        }
                        if(items[j].type == "HG"){
                            arrHG.push(items[j].itemId);
						}
						
                    }
                }
            }
            var commerceItemIds = arr.join(",")
                ,commerceItemIdHGs = arrHG.join(",");
            function batchRemove(){
                onlyPostapi(batchRemoveItemUrl,{cids:commerceItemIdHGs}).then(reloadAll);
            }
            panel.confirm({
                body: function(){
                    return GTPL.commitOrder_yyqgTip({
                        items:data,
						title:"以下商品暂不支持购买，是否从商品清单中移除继续购买其它商品？"
                    })
                },
                btns: [{
                    clazz:"btn btn-default btn-w83 mr50",
                    btnName:"返回修改",
                    click:modifycart
                },{
                    clazz:"btn btn-primary btn-w83",
                    btnName:"移除商品",
                    click:function(dialog){
                        if(arr.length){
                            onlyPostapi(cancelItemsUrl,{cids:commerceItemIds}).then(function(){
                                arrHG.length ? batchRemove() : reloadAll()
                            });
                        }else{
                            if(arrHG.length) batchRemove()
						}
                        dialog.hide();
                    }
                }],
                close: false
            });
            return true;
        }
		function defaultTip(data){
			if(data.status ==="COMMIT_ILLEGAL" || data.status ==='USER_CLICK_GOTO_CART'){
                var btnName = "返回购物车修改";
                return alertBackCart(data);
			}else if(data.status === 'QYG_P'){
                // var html = '抱歉，您还不是企业用户，无权提交订单，去挑选其他商品吧! <br /><a class="alertatag" href="//www' + cookieDomain + '"> 逛逛商城</a>';
                return alertBackHome()
			} else if(data.errCode=="0010580003"){
                isNotLoadAll = true;
                return alertBackCart();
			}else if(data.errCode=="0010470005"){
				return alertBackCart()
			}else if(data.errCode == "0010080121"){
                $(".deli_time").find(".deli_time_tip_warn").hide();
                $(".deli_time").find(".deli_time_tip_warn1").show();
                return;//预约时间约满
            }else if(data.errCode == "0019990010" || data.errCode == "0019990011"){
                $(".deli_time").find(".deli_time_tip_warn").hide();
                $(".deli_time").find(".deli_time_tip_warn2").show();
                return;//出问题啦，请稍后重新选择
            }else if(data.errCode == "0010430021" || data.errCode == "0010430019"){
                var dialog = panel.fail2s('该卡信息已发生变化，请重新选择其它卡支付');
                return dialog;
            }else if(data.errCode=="0010090112"){
				//线下商品只考虑主站,点击确定继续调用commit接口，关闭弹窗
                var dialog=panel.confirmOk({title: "", body: "商品中含不支持电子发票商品，已帮您修改成普通纸质发票，是否继续提交订单?"}, function () {
                    dialog.hide();
                    postapi(commitOrderUrl).then(branchErrorWarp(reloadAll,gotoPay));
                })
				return dialog
            }else if(data.errCode=="0010270030"){
				var btnName = "返回购物车修改";
				return alertLimitCart(btnName,true)
			}else if(data.errCode=="0010270031" || data.status=="USER_CLICK_GOTO_CART"){
				var btnName = "我知道了";
				return alertLimitCart(btnName,false)
			}else if(data.status=="NE_P" || data.status=="NE_G" || data.status=="NE_T" || data.status=="NE_I"){
				return alertOfflineTip()
			}else if(data.status=="GO_CART"){
				return gotoCart()
			}else if(data.status=="CLICK_GO_CART" || data.status=="USER_CLICK_GOTO_CART"){
				return alertBackCart()
			}else if(data.status=="GO_LOGIN"){
				return ui.redir("//login"+cookieDomain+"/login")
			}else if(data.status=="BLACKLIST"){
				var html = '系统暂无响应，请稍后重试 <br>你可以返回 <a class="alertatag" href="//www' + cookieDomain + '"> 国美在线首页</a> 继续购物';
				return panel.alertClose(html,ui.hide)
			}else if(data.errCode=="007006005"){
				var dialog = panel.fail2s($config.errorText.f1);
				return dialog;
			}else if(data.errCode=="0010222222"){//预约抢购提示错误 是否移除相关商品
                return alertReMoveYyqg(data.data);
			}else if(data.errCode=="0010600000" || data.errCode=="0010600001" || data.errCode=="0010600007"){//苹果特惠商品、赠品无货
                return alertApplePcTip(data);
			}else{
				return panel.errorWithObj(data)
			}
		}
		//国美币错误码使用同一提示
		var gmbErrCode=['0010010900','0010010910','0010010941']
		function gmb_panel(){
			var html='<div class="g-panel box-sd2 gpanel-biz001">\
					<i class="c-i closebtn-new fr" g-panel-close></i>\
				<div class="body">\
					<div class="icon i-block"><i class="c-i order_waring"></i></div>\
					<div class="content i-block">\
						<p style="font-family:microsoft yahei;margin-top:0;line-height:40px;color:#333;">因公司业务调整，国美币停止使用，订单金额可能发生变化</p>\
					</div>\
				</div>\
			</div>'
			var dialog = $.gDialog({
				html: html,
				zIndex:10000,
				modal:{zIndex:1000}
			});
			dialog.show();
			dialog.$dialog.find("[g-panel-close]").on("click",function(){
				dialog.hide();
			});
			setTimeout(function(){
				dialog.hide();
			},2000)
		}
		if($.inArray(data.errCode, gmbErrCode)>-1){
			return gmb_panel()
		}
		return $config.isDxSite()       ? panel.alertClose({type:panel.TYPE.ERROR,content:data.errMsg},dxerrAction)
		:  $config.istqSite()           ? defaultTip(data)
		:  $config.isJixinSite()		? panel.errorWithObj(data)
		:  defaultTip(data)
	}

	//遇到错误 弹出提示 不执行回调
	var commonErrorWarp=u.pipe(intor.unlessError,intor.commonerror(errfn));
	//遇到错误 弹出提示 执行回调
	var whenErrorWarp=u.pipe(intor.whenError,intor.commonerror(errfn));
	//遇到错误 弹出提示 永远执行回调
	var alwayErrorWarp=u.pipe(intor.commonerror(errfn));

	//渲染收获地址
	var addressWarp=u.pipe(intor.setInstanceAtom("address"),intor.addressTransData,commonErrorWarp);
	var renderAddress=addressWarp(address.make($("#address")));

	//渲染支付方式
	var paymentWarp=u.pipe(intor.setInstanceAtom("payment"),intor.paymentTransData,commonErrorWarp);
	var renderPayment=paymentWarp(payment.make($("#payment")));

	//渲染发票
	var invoiceWarp=u.pipe(intor.setInstanceAtom("invoice"),intor.invoiceTransData,commonErrorWarp);
	var renderInvoice=invoiceWarp(invoice.make($("#invoice")));

	//配送方式
	var listOfItemWarp=u.pipe(intor.setInstanceAtom("listOfItem"),intor.listOfItemTransData,commonErrorWarp);
	var renderListOfItem=listOfItemWarp(listOfItem.make($("#listOfItem")));

	//优惠券
	var preferentialWarp=u.pipe(intor.setInstanceAtom("preferential"),intor.preferentialTransData,commonErrorWarp);
	var renderPreferential=preferentialWarp(preferential.make($("#preferential")));

	//价格展示
	var commitOrderWarp=u.pipe(intor.setInstanceAtom("commitOrder"),intor.transData,commonErrorWarp);
	var renderCommitOrder=commitOrderWarp(commitOrder.make($("#commitOrder")));


	//保存收货地址
	var addAddressUrl="consignee/addAddress"
		,updateAddressUrl="consignee/updateAddress"
		,selectAddressUrl="consignee/selectAddress"
		,removeAddressUrl="consignee/removeAddress"
		,setDefaultAddressUrl="consignee/setDefaultAddress"
		,addZtAddressUrl="gomeStoreStock/addStore"
		,updateZtAddressUrl="gomeStoreStock/updateStore"
		,selectZtAddressUrl="gomeStoreStock/saveStore"
		,removeZtAddressUrl="gomeStoreStock/removeStore"
		,initOrderUrl='order/initOrder'
        ,cancelItemsUrl='cart/cancelItems'
        ,batchRemoveItemUrl='cart/batchRemoveItem'
		,commitOrderUrl="checkout/commit";
	if(isAllowance()){
		addAddressUrl="consignee/saveAllowanceAddress";
		updateAddressUrl="consignee/saveAllowanceAddress";
	}
	function hwgBiz(){
		var	renderAuthorization=commonErrorWarp(intor.transData(authorization.make($("#hwg-auth"))));
		var	loadAuth=function(data){
			if(data.success) uw.emit(TYPE,"loadAuth",{});
			postapi("haiwaigou/getIdentification").then(renderAuthorization);
		};
		uw.watch(authorization.TYPE,"saveAction",function(data){
			postapi("haiwaigou/saveIdentification",{
				idCardNumber:data.card,
				idCardRealName:data.name
			}).then(alwayErrorWarp(loadAuth));
		});
		return {
			renderAuthorization:renderAuthorization
		}
	}
	function virtualCardBiz(){
		//渲染商品清单
		var warp=u.pipe(intor.setInstanceAtom("listOfItem"),intor.transData,commonErrorWarp);
		var renderListOfItemShopping=warp(listOfItem.makeShopping($("#listOfItem")));
		//渲染身份认证
		var renderEntityCard=u.pipe(intor.setInstanceAtom("entityCard"),intor.transData,commonErrorWarp)(entityCard.make($("#entityCard")));
		function savePhone(data){
			postapi("transport/saveVirtualCardSMSMobile",{"mobile":data.mobile,"code":data.code}).then(branchWarp(data.errorfn,data.sucfn));
		}
		function sendSMS(data){
			postapi("sm/sendSMS.do",{"mobile":data.mobile}).then(branchWarp(data.errorfn,data.sucfn))
		}
		uw.watch(entityCard.TYPE,"savePhone",savePhone);
		uw.watch(entityCard.TYPE,"sendSMS",sendSMS);
		return {
			renderListOfItemShopping:renderListOfItemShopping,
			renderEntityCard:renderEntityCard
		}
	}
	var reloadAll=u.cond([
		[isGomeVirtualCardSite,u.pipe(u.once(virtualCardBiz),reloadVirtualCardSite)],
		[isHwg,u.pipe(u.once(hwgBiz),reloadHwg)],
		[u.T,reloadPrimary]
	]);
	reloadAll();

	function reloadHwg(biz){
		return req.parall(
				postapi("order/initHWGOrder")
				,postapi("haiwaigou/getIdentification")
				)
		.then(req.res(function(alldata,identityData){
			var autho=biz.renderAuthorization(identityData);
			//没有授权
			if(authorization.notAuthorization(autho)){
				ui.redir($config.URL.authorization);
				return;
			}
			//没有进行过身份认证
			if(authorization.notAuth(autho)){
				uw.watchOnce(TYPE,"loadAuth",function(data){
					reloadAll();
				})
				return;
			}
			commonErrorWarp(function(data){
				renderAddress({success:true,data:data.data.consig});
				renderPayment({success:true,data:data.data.pg});
				renderListOfItem({success:true,data:data.data.shops});
				renderPreferential({success:true,data:data.data.coupons});
				renderCommitOrder({success:true,data:data.data.cProfile });

				//如果地址不是是展开情况 渲染发票
				if(address.notPupup($config.shoppingInstenceAtom.address)){
					renderInvoice({success:true,data:data.data.invoices });
				}
			})(alldata);
		}));
	}
	function reloadVirtualCardSite(biz){
		//初始化订单
		return postapi(initOrderUrl).then(commonErrorWarp(function initorderApiCallback(data){
			$("#address").hide();
			biz.renderEntityCard({success:true,data:data.data.smnpc});
			renderPayment({success:true,data:data.data.pg});
			biz.renderListOfItemShopping({success:true,data:data.data.gProfile});
			renderPreferential({success:true,data:data.data.coupons });
			renderCommitOrder({success:true,data:data.data.cProfile });
			renderInvoice({success:true,data:data.data.invoices});
		}));
	}

	//线下转线上提示方法
	function alertPanelTip(data){
		if(data.markedWords && data.markedWords == "SCX"){
			$config.shoppingAddressAtom.markedStatus = true;
		}else{
			$config.shoppingAddressAtom.markedStatus = false;
		}

		if($config.shoppingAddressAtom.errorStatus == 1) {
			$config.shoppingAddressAtom.errorStatus = -1;
			return;
		}
		var ifvs =data.inventoryInfoVOs;
		if(!ifvs || ifvs.length == 0) {
			$config.shoppingAddressAtom.offlineToOnline = false;
		}else{
			$config.shoppingAddressAtom.errorStatus = 0;
			$config.shoppingAddressAtom.offlineToOnline = true;
		}
		//商品转为国美在线渲染
		if($config.shoppingAddressAtom.offlineToOnline && $config.shoppingAddressAtom.offlineStatus < 2){
			commitOrder.offlineTip({
				callbacks:[modifycart],
				data:ifvs,
				type:2
			});
		}
	};

	function reloadPrimary(){
		//初始化订单
		return postapi(initOrderUrl).then(commonErrorWarp(function initorderApiCallback(data){
			if(data.data.oProfile){
				alertPanelTip(data.data.oProfile);
			}else{
				$config.shoppingAddressAtom.markedStatus = false;
			}
			renderAddress({success:true,data:data.data.consig});
			if($page.site=="presell"){//如果是预售站点
				$config.shoppingAtom.deliveryPreSell=data.data.preSell;
			}
			renderPayment({success:true,data:data.data.pg});
			renderListOfItem({success:true,data:data.data.shops});
			if(!isSecondHand()){
                renderPreferential({success:true,data:data.data.coupons});
			}else {
                $('#preferential').hide();
                $('#back-cart').hide();//隐藏返回购物车按钮
			}
			renderCommitOrder({success:true,data:data.data.cProfile });

			//如果地址不是是展开情况 渲染发票
			if(address.notPupup($config.shoppingInstenceAtom.address)){
				renderInvoice({success:true,data:data.data.invoices });
			}

		}));
	}

	//*********************收获地址交互***********************************
	//UI上面的数据 转换为接口数据
	function addressUiDataToParams(data){
		var areas=data.address.split(".");
		return param={
			name:data.consignee,//收货人
			address:data.detailAddress,
			mobile:data.phone,
			phone:data.call,
			province:areas[0],
			city:areas[1],
			county:areas[2],
			town:areas[3],
			email:data.email,
			type:data.defaultAddress
		};
	}
	//UI上面的数据 转换为接口数据 携带ID
	function addressUiDataToParamsWithId(data){
		return u.pipe(addressUiDataToParams,u.assoc("id",data.id))(data);
	}
	//修改收获地址
	function apiUpdateAddress(data){
		onlyPostapi(updateAddressUrl,ui.filterNullOrEmptyObj(data)).then(reloadAll);
	}
	//新增收获地址
	function apiNewAddress(data){
		onlyPostapi(addAddressUrl,ui.filterNullOrEmptyObj(data)).then(reloadAll);
	}

	//新增自提收获地址
    function apiNewGomeStore(data){
        onlyPostapi(addZtAddressUrl,{storeCode:data.storeCode}).then(reloadAll);
    }
    //删除自提收获地址
    function apiRemoveGomeStore(data){
        onlyPostapi(removeZtAddressUrl,{storeAddressId:data.id}).then(reloadAll);
    }
    //修改自提收获地址
    function apiUpdateGomeStore(data){
        onlyPostapi(updateZtAddressUrl,{id:data.id,storeCode:data.storeCode}).then(reloadAll);
    }
	//选中自提收获地址
	function apiSelectedGomeStore(data) {
		onlyPostapi(selectZtAddressUrl,{storeAddressId:data.storeAddressId}).then(reloadAll);
	}

	//默认收获地址
	function apiSetDefaultAddress(item){
		postapi(setDefaultAddressUrl,{id:item.origin.owerId}).then(reloadAll);
	}
	//删除收获地址
	function apiRemoveAddress(item){
		onlyPostapi(removeAddressUrl,{id:item.origin.owerId}).then(reloadAll);
	}
	//选中收获地址
	function apiSelectedAddress(owerId) {
		onlyPostapi(selectAddressUrl,{id:owerId})
		.then(reloadAll);
	}
    //获取可用和不可用收获地址数量
    function apiGetAddressSummary(data){
        onlyPostapi('consignee/getAddressSummary').then(branchWarp(data.errorfn,data.successFn));
    }
	//ui接口之间关系描述
	uw.watchDSL(address.TYPE,{
		selected:u.pipe(u.path(["origin","owerId"]),apiSelectedAddress),
		updateAddress:u.pipe(addressUiDataToParamsWithId,apiUpdateAddress),
		newAddress:u.pipe(addressUiDataToParams,apiNewAddress),
		setDefaultAddress:apiSetDefaultAddress,
		removeAddress:apiRemoveAddress,
        newGomeStore:apiNewGomeStore,
        removeGomeStore:apiRemoveGomeStore,
        updateGomeStore:apiUpdateGomeStore,
        selectedGomeStore:apiSelectedGomeStore,
        getAddressSummary:apiGetAddressSummary
	});

	//**************支付方式交互****************************

	//保存支付方式 出错情况下 刷新自己 不出错情况下刷新 配送方式 用户资产 价格展示 支付方式
	function apiSavePayment(code){
		onlyPostapi('payment/savePayment',{pm:code}).then(alwayErrorWarp(reloadAll));
	}
	//保存门店支付方式
	function apiSavePaymentStore(data){
		onlyPostapi('payment/savePayment',{pm:data.code,storeid:data.id,storename:data.name}).then(alwayErrorWarp(reloadAll));
	}
	//保存尾款手机号
	function saveTailPhone(data){
		onlyPostapi("transport/savePreSellSMSMobile",{
			mobile:data.phone,
			sno:data.shopNo,
			sgid:data.shippingGroupId
		}).then(alwayErrorWarp(reloadAll));
	}
	uw.watchDSL(payment.TYPE,{
		savePayment:u.pipe(u.prop("c"),apiSavePayment),
		saveTailPhone:saveTailPhone,
		savePaymentStore:apiSavePaymentStore
	});

	//*************配送方式********************
	//保存快递
	function apiSelectExpress(data){
		onlyPostapi("transport/saveShippingMethod",{
			sm:data.selectedExpress.code,
			shopno:data.shop.shopId,
			sgid:data.shop.shippingGroupId
		}).then(alwayErrorWarp(reloadAll));
	}
	//保存门店自提
	function selectPickingUp(data){
		onlyPostapi("transport/saveGomeStore",{
			shopno:data.shop.shopId,
			sm:data.selectedExpress.code,
			sgid:data.shop.shippingGroupId,
			storeid:data.selectedExpress.storeId
		}).then(alwayErrorWarp(reloadAll));
	}
	//保存配送清单上的支付方式
	function apiSaveShipPayment(data){
		onlyPostapi("payment/savePayment",{t:data.code,pm:data.parentCode}).then(alwayErrorWarp(reloadAll));
	}
	function apiSaveComments(data){
		onlyPostapi("transport/saveComments",{cm:data.cm,shopno:data.shop.shopId,sgid:data.shop.shippingGroupId})
		.then(whenErrorWarp(reloadAll));
	}
    //保存配送时间
    function apiSelectDayTime(data){
        var param=null;
        param={
            udt: data.selectItems.code,
            fdt: data.selectItems.type,
            ft: data.selectItems.fixedTime,
			udtl: data.selectItems.selectSlot,
			masloc: data.masLoc,
            shopno: data.shop.shopId,
			sgid: data.shop.shippingGroupId,
			cids: data.cids
        }
        postapi("transport/saveDeliveryTime",ui.filterNullOrEmptyObj(param)).then(alwayErrorWarp(reloadAll));
    }
    //保存有运能的配送时间
    function apiSelectSlotTime(data){
        var param=null;
        param={
            udt:'SLOT',
            fdt:data.times.type,
            eft:data.selectBody.endTime,
            sft:data.selectBody.startTime,
            udtl:data.selectBody.code,
            shopno: data.shop.shopId,
			sgid: data.shop.shippingGroupId,
			cids: data.cids
        }
        postapi("transport/saveDeliveryTime",ui.filterNullOrEmptyObj(param)).then(commonErrorWarp(reloadAll));
    }
	//保存预约安装时间
	function saveTransportInstall(data){
		var param=null;
		param={
			site:data.site,
            itemId:data.itemId,
			selectedTime:data.selectedTime,
			selectedWaveNum:data.selectedWaveNum
		}
		postapi("transport/saveTransportInstall",ui.filterNullOrEmptyObj(param)).then(commonErrorWarp(reloadAll));
	}
	//保存挂架安装
	function apiGJAZ(a){
		postapi("transport/saveRackInstall",{racktype:a}).then(whenErrorWarp(reloadAll));
	}
	//保存电信运营商信息
	function saveOperatorInfo(data){
		postapi("operator/saveOperatorIdenInfo",data).then(whenErrorWarp(reloadAll));
	}
	uw.watchDSL(listOfItem.TYPE,{
		selectExpress:apiSelectExpress
		,selectPickingUp:selectPickingUp
		,savePayment:apiSaveShipPayment
		,saveComments:apiSaveComments
		,selectDayTime:apiSelectDayTime
		,selectSlotTime:apiSelectSlotTime
		,saveTransportInstall:saveTransportInstall
		,gjaz:apiGJAZ
		,backCart:u.pipe(writeAreaCookie,gotoCart)
		,saveOperatorInfo:saveOperatorInfo
	})
	//*************发票交互*********************
	//刷新发票模块
	function apiGetInvoice(){
		postapi("invoice/getInvoice").then(renderInvoice).then(reloadAll);
	}
	//保存不开发票
	function apiNoSaveInvoice(flag){
		onlyPostapi("invoice/saveInvoice",{need:false}).then(whenErrorWarp(apiGetInvoice));
	}
	//保存开发票
	function apiSaveInvoice(data){
		var param={
			need:true,
			typeCode:data.selectedInvoce.invoiceType.code
		},headCode=(data.selectedHead||{}).code;
		if(headCode=='2'){
			param.headCode=1;
			param.taxpayerNo=''
		}else{
			param.headCode=headCode;
			param.taxpayerNo=data.selectedInvoce.taxPayerNo;
		}
		param.head=(data.selectedHead||{}).content;
		param.details=data.selectedContentType.code;
		param.elecMobile=data.selectedInvoce.mobilePhone;
		param.elecMail=data.selectedInvoce.email;
		param.VATName=data.selectedInvoce.consigneeName;
		param.VATAddress=data.selectedInvoce.registeredAddress;
		param.VATPhone=data.selectedInvoce.consigneePhone;
		if(data.selectedInvoce.consigneeInfo){
			param.name=data.selectedInvoce.consigneeInfo.name;
			param.province=data.selectedInvoce.consigneeInfo.address.provinceCode;
			param.city=data.selectedInvoce.consigneeInfo.address.cityCode;
			param.county=data.selectedInvoce.consigneeInfo.address.countyCode;
			param.town=data.selectedInvoce.consigneeInfo.address.townCode;
			param.address=data.selectedInvoce.consigneeInfo.address.detailedAddress;
			param.mobile=data.selectedInvoce.consigneeInfo.mobileNumber;
			param.phone=data.selectedInvoce.consigneeInfo.phoneNumber;
			param.email=data.selectedInvoce.consigneeInfo.email
		}
		if(data.address){
			param.vStateName = data.address.vStateName;
			param.vStateCode = data.address.vStateCode;
			param.vCityCode = data.address.vCityCode;
            param.vCityName = data.address.vCityName;
            param.vCountyCode = data.address.vCountyCode;
            param.vCountyName = data.address.vCountyName;
            param.vTownCode = data.address.vTownCode;
            param.vTownName = data.address.vTownName;
        }
		postapi("invoice/saveInvoice",ui.filterNullOrEmptyObj(param)).then(alwayErrorWarp(apiGetInvoice));
	}

	uw.watchDSL(invoice.TYPE,{
		noSaveInvoice:apiNoSaveInvoice,
		saveInvoice:apiSaveInvoice,
		closeInvoice:apiGetInvoice
	});

	//***************各种券*********************
	//查询推荐人员工号
	function renderRefP(){
		onlyPostapi("coupon/getRef").then(intor.unlessError(function(data){
			$config.shoppingAtom.referrerInfo=data.data;
            $config.shoppingAtom.renderRefPFlag = true;
            var im = $config.shoppingInstenceAtom.preferential;
            preferential.render(im);
		}));
	}
    //删除使用最优组合的cookie
    function apiDelC(){
        $.cookie('yhj_com','N', {expires:-30,path:'/',domain:cookieDomain});
        $config.shoppingAtom.yhj_com = "N";
        reloadAll();
	}
	//勾选运费券
	function apiSelectYf(data){
		onlyPostapi('coupon/selectFeeCoupon',{cid:data.id}).then(branchWarp(reloadAll,apiDelC));
	}
	//取消运费券
	function apiCancelSelectYf(data){  
		onlyPostapi("coupon/cancelFeeCoupon",{cid:data.id}).then(branchWarp(reloadAll,apiDelC));
	}
    //勾选蓝券
    function apiSelectB(data){
        onlyPostapi("coupon/selectBlueCoupon",{tid:data.id}).then(branchWarp(reloadAll,apiDelC));
    }
    //取消勾选蓝券
    function apiCanelSelectB(data){
        onlyPostapi("coupon/cancelBlueCoupon",{tid:data.id}).then(branchWarp(reloadAll,apiDelC));
    }
    //勾选红券
    function apiSelectR(data){
        onlyPostapi("coupon/selectRedCoupon",{tids:data.id}).then(branchWarp(reloadAll,apiDelC));
    }
    //取消勾选红券
    function apiCalenSelectR(data){
        onlyPostapi("coupon/cancelRedCoupon",{tids:data.id}).then(branchWarp(reloadAll,apiDelC))
    }
    //勾选店铺券
    function apiSelectD(data){//selectOfflineStoreCoupon
        onlyPostapi("coupon/selectShopCoupon"
            ,{tid:data.couponNO,shopno:data.shopNo,sgid:data.sgid,couponType:data.type })
            .then(branchWarp(reloadAll,apiDelC));
    }
    //取消勾选店铺券
    function apiCanelSelectD(data){
        onlyPostapi("coupon/cancelShopCoupon"
            ,{tid:data.couponNO,shopno:data.shopNo,sgid:data.sgid })
            .then(branchWarp(reloadAll,apiDelC));
    }
    //勾选美券
    function apiSelectO(data){
        onlyPostapi("coupon/selectOfflineStoreCoupon"
            ,{tid:data.couponNO,gcType:data.gomeCouponType})
            .then(branchWarp(reloadAll,apiDelC));
    }
    //取消勾选美券
    function apiCanelSelectO(data){
        onlyPostapi("coupon/cancelOfflineStoreCoupon"
            ,{tid:data.couponNO,gcType:data.gomeCouponType})
            .then(branchWarp(reloadAll,apiDelC));
    }
    //勾选电子券
    function apiSelectDZ(data){
        onlyPostapi("payment/selectECoupon"
            ,{eno:data.ecouponCode})
            .then(branchWarp(reloadAll,apiDelC));
    }
    //取消勾选电子券
    function apiCanelSelectDZ(data){
        onlyPostapi("payment/cancelECoupon"
            ,{eno:data.ecouponCode})
            .then(branchWarp(reloadAll,apiDelC));
    }
	//勾选国美在线积分
	function apiSelectZXJF(data){
		onlyPostapi("payment/useIntegral").then(alwayErrorWarp(reloadAll));
	}
	//取消勾选国美在线积分
	function apiCanelselectZXJF(data){
		onlyPostapi("payment/cancleIntegral").then(alwayErrorWarp(reloadAll));
	}
	//勾选账户余额
	function apiSelectZHYE(data){
		onlyPostapi("payment/useVirtualAccount").then(alwayErrorWarp(reloadAll));
	}
	//取消勾选账户余额
	function apiCanelselectZHYE(data){
		onlyPostapi("payment/cancelVirtualAccount").then(alwayErrorWarp(reloadAll));
	}
	//门店积分兑换
	function changeInto(data){
		onlyPostapi("payment/pointExchange",{pa:data.text}).then(branchWarp(data.errorfn,u.pipe(u.tap(data.okfn),reloadAll)));
	}
	//激活优惠券
	function activeYCode(data){
        function reloadAll2s(){
            panel.success2s('兑换成功，请到商品优惠券里查看并使用');
            setTimeout(function(){
                $config.shoppingAtom.yhj_jh = "N";
                reloadAll();
            },2000);
        }
		onlyPostapi("coupon/activateCoupon",{
			cpno:data.cpno,
			acode:data.acode,
			captcha:data.c,
			capcd:data.capCd
		}).then(branchWarp(data.errorfn,reloadAll2s));
	}
	//使用电子券
	function dzqAction(data){
		onlyPostapi("payment/verifyECoupon",{eno:data.txt}).then(alwayErrorWarp(reloadAll));
	}
	//推荐人员工号
	function ryghAction(data){
		onlyPostapi("payment/applyStoreSeller",{sellerid:data.txt}).then(branchWarp(data.errfn,renderRefP));
	}
    //美口令
    function mklAction(data){
        onlyPostapi("payment/useKeyt",{ks:data.key}).then(branchWarp(data.errfn,reloadAll));
    }
	//支付密码
	function payRegAction(data){
		function doErr(rdata){
			//如果密码被锁定
			/*if(rdata.errCode=="0010330040"){
				return reloadAll();
			}*/
			return data.errorfn(rdata);
		}
		onlyPostapi("payment/validatePayPwd",{
            payPasswd:data.payPasswd,
            timeStamp:data.timeStamp,
            siteId:data.siteId
		}).then(branchWarp(doErr,reloadAll));
	}
    //优惠券使用最优组合
    function useBestCom(data){
        onlyPostapi("coupon/recommendCoupons").then(branchWarp(data.errorfn,u.pipe(reloadAll,data.successfn)));
    }
    //优惠券取消使用最优组合
    function useBestComCanel(data){
        onlyPostapi("coupon/cancelAllCoupons").then(branchWarp(data.errorfn,u.pipe(reloadAll,data.successfn)));
    }
	//取消推荐人员工
	function ryghCanel(data){
		onlyPostapi("payment/cancelStoreSeller").then(alwayErrorWarp(renderRefP));
	}
	//勾选国美E卡支付
	function apiSelectEC(data){
		onlyPostapi("card/selectECard",{
			cno:data.cardCode
		}).then(alwayErrorWarp(reloadAll));
	}
	//取消勾选国美E卡支付
	function apicanelselectEC(data){
		onlyPostapi("card/cancelECard",{
			cno:data.cardCode
		}).then(alwayErrorWarp(reloadAll));
	}
	//绑定国美E卡
	function bindECard(data1){
        function reloadAll2s(){
            panel.success2s('美通卡绑定成功！');
            setTimeout(function(){
                $config.shoppingAtom.ecard_4="";
                $config.shoppingAtom.ecard_3="";
                $config.shoppingAtom.ecard_2="";
                $config.shoppingAtom.ecard_1="";
                $config.shoppingAtom.ecard_yzm="";
                $config.shoppingAtom.ecard_jh = "N";
                reloadAll();
            },2000);
        }
		req.reqp("//safe"+cookieDomain+"/myaccount/prepaidCard/fingerPrint"
			,{}
			,'ckdata001')
		.then(function(){
			req.reqp("//safe"+cookieDomain+"/myaccount/prepaidCard/bindCard"
				,{
					"prepaidCardNo": data1.ecartNumber
					,"imageCode":data1.imageCode
					,"capCd":data1.capcd
				},"ckdata002")
			.then(function(data){
				if(data.error){
					//panel.error(data.error.message);
                    $config.shoppingAtom.dzqma_tip = data.error.message;
					$config.shoppingAtom.ecard_yzm="";
                    data1.errfn(data);
					//reloadAll()
				}else{
					//panel.success2s("美通卡绑定成功！");
                    //$config.shoppingAtom.dzqma_tip = "美通卡绑定成功！";
                    //$config.shoppingAtom.ecard_4="";
                    //$config.shoppingAtom.ecard_3="";
                    //$config.shoppingAtom.ecard_2="";
                    //$config.shoppingAtom.ecard_1="";
                    //$config.shoppingAtom.ecard_yzm="";
                    reloadAll2s()
				}
			})
		});
	}
	//未开启支付密码弹窗提示；开启走请求接口
	function checkPaymentPassword(fn){
		return function(data){
			if(preferential.isNotUnsealPwd($config.shoppingInstenceAtom.preferential)){
				panel.alert($config.renderError({errCode:"f1"}));
				//onlyPostapi("coupon/getUserAllAssets").then(reloadAll);
				return;
			}
			return fn(data);
		}
	}
	//选中在线美豆
	function selectZXMD(a){
		onlyPostapi("payment/useGomedo").then(alwayErrorWarp(reloadAll));
	}
	//取消选中在线美豆
	function canelselectZXMD(a){
		onlyPostapi("payment/cancelGomedo").then(alwayErrorWarp(reloadAll));
	}
	uw.watchDSL(preferential.TYPE,{
		selectYf:apiSelectYf
		,cancelselectYf:apiCancelSelectYf
		,selectB:apiSelectB
		,canelselectB:apiCanelSelectB
		,selectR:checkPaymentPassword(apiSelectR)
		,canelselectR:apiCalenSelectR
		,selectZXMD:selectZXMD
		,canelselectZXMD:canelselectZXMD
		,selectD:apiSelectD
		,canelselectD:apiCanelSelectD
		,selectO:apiSelectO
		,canelselectO:apiCanelSelectO
		,selectDZ:apiSelectDZ
		,selectEC:apiSelectEC
		,canelselectEC:apicanelselectEC
		,canelselectDZ:apiCanelSelectDZ
		,selectZXJF:checkPaymentPassword(apiSelectZXJF)
		,canelselectZXJF:apiCanelselectZXJF
		,selectZHYE:checkPaymentPassword(apiSelectZHYE)
		,canelselectZHYE:apiCanelselectZHYE
		,changeInto:changeInto
		,activeYCode:activeYCode
		,dzqAction:dzqAction
		,ryghAction:ryghAction
		,mklAction:mklAction
		,payRegAction:payRegAction
		,ryghCanel:ryghCanel
		,bindECard:bindECard
		,renderRefP:renderRefP
		,useBestCom:useBestCom
		,useBestComCanel:useBestComCanel
	});

	//***************价格展示*******************
	function gotoPay(data){
		var p = window.location.protocol.replace(":","");
		$track('SubmitOrder',{
			order_id: data.data.cartId
		})
		if(data.data.jumpPage=="cashier"){
			ui.redir("//success"+cookieDomain+"/order/paymentInfo?orderIdsStr="+data.data.cartId+"&protocol="+p+"&userId="+$.cookie("sid")+"&isCommittedPage=true");
		}else{
			ui.redir("/order-success?o="+data.data.cartId);
		}
	}
	//提交订单  成功跳转至提交订单成功页面  遇到错误弹出错误提示并刷新价格
	function apiCommit(yzmdata){
		//var r=notStockNotSupportTip($config.shoppingInstenceAtom.listOfItem);
		//if(r)return reloadAll();
		if($config.isDxSite()){
			var listOfItemIm=$config.shoppingInstenceAtom.listOfItem
			window.location.hash="";
			if(listOfItem.validateDx(listOfItemIm) == false){
				window.location.hash="#dx-from-hash";
				commitOrder.render($config.shoppingInstenceAtom.commitOrder);
				return;
			}
		}
		if(isGomeVirtualCardSite()){
			if(entityCard.validatefn($config.shoppingInstenceAtom.entityCard)==false){
				window.scrollTo(0,0);
				commitOrder.render($config.shoppingInstenceAtom.commitOrder);
				return false;
			}else{
				var info = entityCard.getInfo($config.shoppingInstenceAtom.entityCard);
				postapi("transport/saveVirtualCardSMSMobile",info).then(function(data){
					if(data.success){
						postapi(commitOrderUrl).then(branchErrorWarp(reloadAll,gotoPay));
					}else{
						entityCard.haveError($config.shoppingInstenceAtom.entityCard,data.errMsg)
						window.scrollTo(0,0);
						commitOrder.render($config.shoppingInstenceAtom.commitOrder);
					}
				});
			}
		}else{
			if($config.tqAtom.tqneedYzm=="Y" && $config.istqSite()){
				onlyPostapi(commitOrderUrl,{st:yzmdata.st,soft:yzmdata.soft,captcha:yzmdata.captcha,cpcd:yzmdata.cpcd}).then(branchErrorWarp(reloadAll,gotoPay));
			}else{
				if($config.istqSite()){
					onlyPostapi(commitOrderUrl,{st:yzmdata.st,soft:yzmdata.soft}).then(branchErrorWarp(function(data){
							if(data.status=='COMMIT_NEED_CAPTCHA'){$config.tqAtom.tqneedYzm="Y"}
							$config.tqAtom.tqyzm_tip='请输入订单提交验证码'
							reloadAll(data)
					},gotoPay));
				}else{
					//跳转至提交订单成功页
					postapi(commitOrderUrl).then(branchErrorWarp(_reloadAll,gotoPay));
				}
			}
		}
	}

    /**
	 * 部分异常，不能刷新页面
     * @private
     */
	function _reloadAll(){
        if(!isNotLoadAll){
            reloadAll();
		}
	}

	uw.watchDSL(commitOrder.TYPE,{
		commit:apiCommit
	});


	//配置配送清单
	function getPickingUpStores(citycode,shopno){
		return postapi("transport/getGomeStores",{citycode:citycode,shopNo:shopno});
	}
	function getStoresByAddress(citycode){
		return postapi("transport/getGomeStoreCity",{cc:citycode});
	}
	//线下商品无货且线上有货飞线上
	function apiUpdateOfflineCommerceItem(){
	   postapi("cart/updateOfflineCommerceItem").then(alwayErrorWarp(reloadAll));
	}
	listOfItemMethod.$$.getPickingUpStores=getPickingUpStores;
	address.$$.getPickingUpStores = getStoresByAddress;
	commitOrder.$$.updateOfflineCommerceItem = apiUpdateOfflineCommerceItem;
}(
	this,
	util,
	util_ui,
	util_watch,
	request,
	address,
	payment,
	listOfItem,
	commitOrder,
	preferential,
	invoice,
	interceptor,
	listOfItemMethod);
