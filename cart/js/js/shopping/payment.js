/**支付方式*/
!function(exports,req,u,ui,uw,tpl,gstore,validate){
	var TYPE="7payment7";
	var emit=uw.emit(TYPE);
	function div(im){
		return im("div");
	}
	function datfn(im){
		return im('data');
	}
	var set=u.curry(function(im,data){
		im(null,data);
		return im;
	});
	
	function init(im){
		var el=div(im);
		var data=datfn(im);
		el.html(tpl.payment_main(data));
		alternation(im);
	}

	
	function transData(data){
		var labelMap={
			mailRemittance:{
				label:"邮局汇款",
				desc:"支持线下邮局汇款（上海地区除外）<br/>",
				name:"查看邮局汇款帮助",
				href:"//help.gome.com.cn/article/236-0-0.html"
			},
			storesPayment:{
				label:"门店付款",
				desc:"门店支持现金、POS机刷卡&nbsp;&nbsp;",
				name:"查看门店付款帮助",
				href:"//help.gome.com.cn/article/235-0-0.html"
			},
			onlinePayment:{
				label:"在线支付",
				desc:"支持大部分储蓄卡、信用卡及第三方平台支付 <br/>",
				name:"查看全部银行及限额",
				href:"//help.gome.com.cn/article/233-0-0.html"
			},
			installment:{
				label:"信用卡分期",
				desc:"支持大部分信用卡分期支付&nbsp;&nbsp;",
				name:"查看分期付款帮助",
				href:"//help.gome.com.cn/article/234-0-0.html"
			},
			companyTransfer:{
				label:"公司转账",
				desc:"支持银行柜台、企业银行转账&nbsp;&nbsp;",
				name:"查看公司转账帮助",
				href:"//help.gome.com.cn/article/237-0-0.html"
			},
			cashOnDelivery:{
				label:"货到付款",
				desc:"支持现金、POS机刷卡&nbsp;&nbsp;",
				name:" 查看运费及配送范围",
				href:"//help.gome.com.cn/article/232-0-0.html"
			},
            accountPeriod:{
                label:"账期支付",
                desc:"仅具备账期支付资质，且订单金额在账期支付可使用额度范围内的用户可选择此支付方式 账期支付周期：收到货物后30个工作日内需还款&nbsp;&nbsp;",
                name:" 查看账期支付帮助",
                href:"https://help.gome.com.cn/article/440-0-0.html"//todo 账期支付帮助地址
			}
        }
		return {
			list:u.map(function(item){
				return u.assoc("tip",labelMap[item.c],item);
			},data),
			presellModifyStatus:"done"
		};
	}
	function alternation(im){
		var el=div(im);
		var data=datfn(im);
		//鼠标划过弹出
		div(im).find("[hoverup]").each(ui.jq(ui.hoverUpBySelector(u.__,"[hover]")));
		//鼠标划过问号弹出提示
		div(im).find("[g-hoverup-tip]").each(ui.jq(function(el){
			var tip=el.attr("g-hoverup-tip");
			var selector="[g-hover-tip="+tip+"]";
			ui.hoverUp(el.add(selector))(div(im).find(selector));
		}));
		//点击门店付款
		div(im).find("[code=storesPayment]").on("click",function(){
			var storeitem = u.find(u.pipe(u.prop("c"),u.eq("storesPayment")),datfn(im).list);
			gstore.make(el.find("#mendianfukuan_store"),{
				provice:storeitem.a.provinceCode//2018-1-17 统一从一级取
				//,city:storeitem.a.cityCode
				//,area:storeitem.a.countyCode
				//,store:storeitem.ps&&storeitem.ps.code
				,current:0
				,selectfn:function(store){
					store.code="storesPayment";
					emit("savePaymentStore",store);
				}
			});
            el.find("#mendianfukuan_tip").show();
			return false;
		});
		//隐藏门店付款框
		div(im).find("[g-close]").on("click",u.partial(ui.hide,[el.find("#mendianfukuan_tip")]));
		//选中操作
		el.find("[g-path]").on("click",ui.jqpipe(
			ui.attr("g-path"),
			u.split(","),
			u.path(u.__,data.list),
			function(sitem){
				emit("savePayment",sitem);
				return u.map(function(item){
					if(sitem==item)return u.assoc("selected",true,item);
					return u.assoc("selected",false,item);
				},datfn(im).list);
			},
			transData,
			set(im),
			init));
		div(im).find("[no-modify]").one("mousedown",function(){
			$(this).removeAttr("no-modify").val('');
			div(im).find("[presell-btn-phone]").removeClass("btn-primary").addClass("btn-disabled");
		})
		//修改尾款手机号码
		div(im).find("[presell-modify-phone]").on("click",function(){
			set(im,u.assoc("presellModifyTextNull",false,datfn(im)));
			set(im,u.assoc("presellModifyStatus","modify",datfn(im)));
			init(im);
		});
		//取消尾款手机号码
		div(im).find("[presell-canel-phone]").on("click",function(){
			set(im,u.assoc("presellModifyStatus","done",datfn(im)));
			init(im);
		});
		function errcbk(a){
			div(im).find("[presell-error-phone]").html(a);
		}
		//尾款手机号码验证
		div(im).find("[presell-text-phone]").on("focus",function(){
			set(im,u.assoc("presellModifyTextNull",true,datfn(im)));
			div(im).find("[presell-text-phone]").trigger('keyup')
		})
		div(im).find("[presell-text-phone]").on("keyup",function(){
			var val=$(this).val();
			if(validate.validateItem("presell-phone",val,errcbk)){
				div(im).find("[presell-btn-phone]").removeClass("btn-disabled").addClass("btn-primary");
			}else{
				div(im).find("[presell-btn-phone]").removeClass("btn-primary").addClass("btn-disabled");
			}
		});
		//保存尾款手机号
		div(im).find("[presell-btn-phone]").on("click",function(){
			var phone=div(im).find("[presell-text-phone]").val();
			if(div(im).find('[presell-text-phone]').attr("no-modify")=="y" || validate.validateItem("presell-phone",phone,errcbk)){
				emit("saveTailPhone",{
					phone:phone,
					shopNo:$config.shoppingAtom.deliveryPreSell.shopNo,
					shippingGroupId:$config.shoppingAtom.deliveryPreSell.shippingGroupId
				});
			}
		});
	}
	//判断预售手机号是否是不在修改状态
	function isTailPhoneStatusDone(im){
		return datfn(im).presellModifyStatus=="done";
	}
	//是否使用在线支付
	function isUseOnline(im){
		var data=datfn(im);
		//onlinePayment
		return u.find(function(item){
			return item.c=="onlinePayment"&&item.selected;
		},data.list);
	}
	function make(div,data){
		function r(flg,data1){
			if(data1)data=data1;
			return {
				div:div,
				data:data
			}[flg];
		}

		init(r);
		return r;
	}
	exports.payment={
		make:u.curry(make),
		isTailPhoneStatusDone:isTailPhoneStatusDone,
		transData:transData,
		isUseOnline:isUseOnline,
		TYPE:TYPE
	};
}(this,request,util,util_ui,util_watch,GTPL,gstore,validate);