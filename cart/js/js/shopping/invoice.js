/**发票信息*/
!function(exports,req,u,ui,uw,tpl,panel,validate){
	var TYPE="7invoice7";
	var emit=uw.emit(TYPE);
	function div(im){
		return im('div');
	}
	function dfn(im){
		return im('data');
	}
	function clone(obj){
		function copyArray(arr){
			var r=[];
			for(var i=0;i<arr.length;i++)r.push(clone(arr[i]));
			return r;
		}
		function copyObj(a){
			var r={};
			for(var key in a)r[key]=clone(a[key]);
			return r;
		}
		return u.cond([
			[u.is(Array),copyArray],
			[u.is(Object),copyObj],
			[u.T,u.identity]
		])(obj);
	}
	function cloneim(im){

	}
	function setPath(path,val,im){
		im('data',transData(u.assocPath(path,val,dfn(im))));
		return im;
	}
	function render(im){
		var data=dfn(im);
		if(data.open){
			renderModify(im,false);
		}else{
			div(im).html(tpl.invoice_main(dfn(im)));
		}
		alternation(im);
	}
	function setDefaultConsigneeInfo(data){
		//获取纸质发票
		var zzfp=u.find(function(a){return a.invoiceType.code==0},data.invoices);
		if(zzfp.consigneeInfo==null){
			zzfp.consigneeInfo={
				address:{
				}
			}
		}
	}
	function initTransData(data){
		//是增值税发票，直接u.identity 否则走电子发票和纸质发票查找单位流程
		function isDZ(item){
			return item.invoiceType.code=='2'
		}
		function findCompanyData(item){
			//headTypes ==1为单位
			var fn=function(h){return h.code=="1"}
			var id=u.findIdx(fn,item.headTypes),
				dwItem=u.find(fn,item.headTypes),
				dwSelected = !item.taxPayerNo && dwItem.selected,
				headTypesDw=item["headTypes"];
			if(id){
				if(!(item.taxPayerNo && dwItem.selected)){
					headTypesDw[id]['selected']=false
				}else{
					headTypesDw[id]['selected']=true
				}
				headTypesDw[id]['label']="企业单位"
				headTypesDw[++id] = {
					available:true,
					code:"2",
					content:dwItem.content,
					label:"非企业单位",
					selected:dwSelected?true:false,
					visible:true
				}
			}
			return item
		}
		u.map(u.pipe(
				u.ifn(u.pipe(isDZ),
					u.identity,
					findCompanyData
				)
			),data.invoices
		)
		return data
	}

	function transData(data){
		if(data.invoices.length==0)return data;
        //前端对美通卡站点的校验放开
		/*if($config.isGomeVirtualCardSite()){
			setDefaultConsigneeInfo(data)
		}*/
		var selectedInvoce=u.find(u.path(["invoiceType","selected"]),data.invoices);
        if(selectedInvoce.invoiceType.code==2 && !data.address){
            data.address={
                "vStateCode": selectedInvoce.vStateCode,
                "vStateName": selectedInvoce.vStateName,
                "vCityCode": selectedInvoce.vCityCode,
                "vCityName": selectedInvoce.vCityName,
                "vCountyCode": selectedInvoce.vCountyCode,
                "vCountyName": selectedInvoce.vCountyName,
                "vTownCode": selectedInvoce.vTownCode,
                "vTownName": selectedInvoce.vTownName,
                "registeredAddress": selectedInvoce.registeredAddress
            }
        }
		var selectedHead=u.find(u.path(["selected"]),selectedInvoce.headTypes||[]);
		var selectedContentType=u.find(u.path(["selected"]),selectedInvoce.invoiceContentTypes)||{};

		data.selectedInvoce=selectedInvoce;
		data.selectedInvoce.path="invoices,"+u.findIdx(u.path(["invoiceType","selected"]),data.invoices);
		data.selectedHead=selectedHead||{};
		data.selectedHead.path=selectedInvoce.path
		+",headTypes,"
		+u.findIdx(u.path(["selected"]),selectedInvoce.headTypes||[]);

		data.selectedContentType=selectedContentType;
		data.selectedContentType.path=data.selectedInvoce.path
		+",invoiceContentTypes,"
		+u.findIdx(u.path(["selected"]),selectedInvoce.invoiceContentTypes);
		return data;
	}
	function alternation(im){
		//修改操作
        div(im).find("[g-modify-path]").on("click",function(){$.cookie("invoiceMore","Y",{expires: -1,path:"/",domain:cookieDomain});});
        div(im).find("[g-modify-path]").on("click",u.partial(renderModify,[im,true]));
	}
	var selectedfn=u.curry(function(arr,sitem){
		return u.map(function(item){
			if(item==sitem)return u.assoc("selected",true,item);
			return u.assoc("selected",false,item);
		},arr);
	});
    //更多发票类型埋cookie
    $.cookie("invoiceMore","Y",{expires: 30,path:"/",domain:cookieDomain});
	function renderModify(im,haveClose){
		var dialog = $.gDialog({
			html: tpl.invoice_modify(u.assoc("haveClose",haveClose,dfn(im)))
			,modal:{
			}
		});
		dialog.show();
		var $gDialog=dialog.$dialog;

        var valueBox = $gDialog.find(".value-box");
        var ivm = $gDialog.find(".invoice-more");
        var invoiceMore = $.cookie("invoiceMore");
        if(ivm.attr("data-selected") == "false" && invoiceMore == null){
            valueBox.css("width","750px");
            ivm.hide();
        }else{
            if(ivm.attr("data-selected") == "true" && invoiceMore == null){
                valueBox.css("width","100px");
            }else{
                valueBox.css("width","750px");
                ivm.hide();
            }
        }

		
		//鼠标划过弹出
		$gDialog.find("[hoverup]").each(ui.jq(ui.hoverUpBySelector(u.__,"[g-hoverup-tip]")));
		$gDialog.find("[g-hoverup-tip]").each(ui.jq(function(obj){
			var tip=obj.attr("g-hoverup-tip");
			var selector="[g-hover-tip="+tip+"]";
			ui.hoverUp(obj.add(selector))($gDialog.find(selector));
		}));
		
		//解决部分浏览器高度小于发票弹框的高度时,fixe定位不能关闭框
		if($(window).height()<dialog.$dialog.height()){
			window.scrollTo(0,0);
			dialog.$dialog.eq(0).css({position:'absolute',top:'0'})
		}
		function renderModifyIn(im1){
			return renderModify(im1,haveClose);
		}
		//选择地区
		var gcdat=(function(data){
			if(data.selectedInvoce.consigneeInfo){
				var consigneeInfo=data.selectedInvoce.consigneeInfo
				return [
					consigneeInfo.address.countyCode,
					consigneeInfo.address.provinceName+consigneeInfo.address.cityName+consigneeInfo.address.countyName+consigneeInfo.address.townName,
					consigneeInfo.address.cityCode,
					consigneeInfo.address.provinceCode,
					consigneeInfo.address.townCode
				].join("|");
			}
		}(dfn(im)));
		gcity.make($("#id_address_select"),gcdat,{
			selectfn:function(data){
				var value=data.sid+"."+data.cid+"."+data.xid+"."+data.zid;
				$("#id_address_select").find("[name=address]").attr("value",value);
				$("#id_address_select").find("[show-label]").html(data.chtm);
				$("#id_address_select").find(".add_out,.gCity").hide();
				dialog.$dialog.find("[g-tip-validate=address]").html("");
				var div=dialog.$dialog.find("#id_address_select");
				var path=div.attr("value-path").split(",");
				div.find("[name='address']").removeClass('error')
				setPath(path,{
					"provinceCode": data.sid,
					"provinceName":data.snam,
					"cityCode": data.cid,
					"cityName": data.cnam,
					"countyCode": data.xid,
					"countyName": data.xnam,
					"townCode": data.zid,
					"townName": data.znam,
					"detailedAddress":dialog.$dialog.find("[name='detailedAddress']").val()
				},im);
			},
	        closefn:function(){
				dialog.$dialog.find(".add_out,.gCity").hide();
			}
		})
        //增票认证 选择地区
        var zpaddress=(function(data){
            if(data.selectedInvoce){
                var selectedInvoce=data.selectedInvoce;
                return [
                    selectedInvoce.vCountyCode,
                    selectedInvoce.vStateName+selectedInvoce.vCityName+selectedInvoce.vCountyName+selectedInvoce.vTownName,
                    selectedInvoce.vCityCode,
                    selectedInvoce.vStateCode,
                    selectedInvoce.vTownCode
                ].join("|");
            }
        }(dfn(im)));
        gcity.make($("#zp_address_select"),zpaddress,{
        	selectfn:function(data){
				var value=data.sid+"."+data.cid+"."+data.xid+"."+data.zid;
	            $("#zp_address_select").find("[name=address]").attr("value",value);
	            $("#zp_address_select").find("[show-label]").html(data.chtm);
	            $("#zp_address_select").find(".add_out,.gCity").hide();
	            dialog.$dialog.find("[g-tip-validate=address]").html("");
	            var div=dialog.$dialog.find("#zp_address_select");
	            var path=div.attr("value-path").split(",");
	            div.find("[name='address']").removeClass('error')
	            setPath(path,{
	             "vStateCode": data.sid,
	             "vStateName":data.snam,
	             "vCityCode": data.cid,
	             "vCityName": data.cnam,
	             "vCountyCode": data.xid,
	             "vCountyName": data.xnam,
	             "vTownCode": data.zid,
	             "vTownName": data.znam,
	             "registeredAddress":dialog.$dialog.find("[name='zpdetailAddress']").val()
	             },im);
	        },
	        closefn:function(){
				dialog.$dialog.find(".add_out,.gCity").hide();
			}
		})

		dialog.$dialog.find('[name="address"]').toggle(function(){
			dialog.$dialog.find('.add_out,.gCity').show()
		},function(){
			dialog.$dialog.find('.add_out,.gCity').hide()
		})

		//关闭操作
		dialog.$dialog.find("[g-close]").on("click",function(){
			ui.hide(dialog);
			emit("closeInvoice",null);
		});

		//开具发票
		dialog.$dialog.find("[g-value-path]").on("click",function(){
			var el=$(this);
			var path=ui.gvaluePath(el);
			var value=ui.gvalue(el);
			dialog.hide();
			renderModifyIn(setPath(path,value,im));
		});
		//发票类型
        dialog.$dialog.find("[g-i-path]").on("click",function(){
            var valueBox = dialog.$dialog.find(".value-box");
            $.cookie("invoiceMore","Y",{expires: 30,path:"/",domain:cookieDomain});
            valueBox.css({"width":"750px"});
        });
		dialog.$dialog.find("[g-i-path]").on("click",ui.jqpipe(
			ui.attr("g-i-path"),
			u.split(","),
			u.path(u.__,dfn(im)),
			function(sitem){
				dialog.hide();
				return setPath(["invoices"],u.map(function(invoice){
					if(sitem==invoice)return u.assocPath(["invoiceType","selected"],true,invoice);
					return u.assocPath(["invoiceType","selected"],false,invoice);
				},dfn(im).invoices),im);
			},
			renderModifyIn));
		//发票类型展开更多
        dialog.$dialog.find(".invoice-more").on("click",function(){
            var valueBox = dialog.$dialog.find(".value-box");

            $.cookie("invoiceMore","Y",{expires: -1,path:"/",domain:cookieDomain});
            valueBox.css({"width":"750px"});
            $(this).hide();
        });
		//发票抬头
		dialog.$dialog.find("[g-h-path]").on("click",ui.jqpipe(
			ui.attr("g-h-path"),
			u.split(","),
			u.path(u.__,dfn(im)),
			function(sitem){
				dialog.hide();
				var path=dfn(im).selectedInvoce.path.split(",").concat(["headTypes"]);
				return setPath(path,selectedfn(u.path(path,dfn(im)),sitem),im);
			},
			renderModifyIn));

		//发票内容
		dialog.$dialog.find("[g-c-path]").on("click",ui.jqpipe(
			ui.attr("g-c-path"),
			u.split(","),
			u.path(u.__,dfn(im)),
			function(sitem){
				dialog.hide();
				var path=dfn(im).selectedInvoce.path.split(",").concat(["invoiceContentTypes"]);
				return setPath(path,selectedfn(u.path(path,dfn(im)),sitem),im);
			},
			renderModifyIn));
		//输入框和数据映射
		dialog.$dialog.find("[value-path]").on("keyup",function(){
			var el=$(this);
			var path=u.pipe(ui.attr("value-path"),u.split(","))(el);

			var value=el.val();
            //将抬头内容同步
            if(el.hasClass('value-up-path')){
                if(dfn(im).selectedInvoce && dfn(im).selectedInvoce.headTypes){
                    var headTypes = dfn(im).selectedInvoce.headTypes;
                    for(var i=0;i<headTypes.length; i++){
                        if(headTypes[i].code == "1" || headTypes[i].code == "2"){
                            headTypes[i].content = value;
                        }
                    }
                }
            }
			if(el.attr('placeholder')== value){
				value = "";
			}
			setPath(path,value,im);
		});

		//tip提示
		ui.hoverUp(dialog.$dialog.find("[g-tip=dzfp],[g-tip-for=dzfp]"))(dialog.$dialog.find("[g-tip-for=dzfp]"));
		//手机号加星前端策略
		dialog.$dialog.find("[no-modify]").one("mousedown",function(){
			$(this)
			.removeAttr("no-modify")
			.val('')
			.trigger("keyup");
		})
		//失去焦点验证
		dialog.$dialog.find("[g-validate]").blur(function(){
			var vval=$(this).attr("g-validate");
			var path=u.pipe(ui.attr("value-path"),u.split(","))($(this));
			var fillel=dialog.$dialog.find("[g-tip-validate="+vval+"]");
				var textel=dialog.$dialog.find("[g-validate="+vval+"]");
			function errcbk(msg){
				if(u.isEmpty(msg)){
					textel.removeClass("error");
				}else{
					textel.addClass("error");
				}
				fillel.html(msg);
				setPath(u.concat(u.init(path),[vval]),msg,im);
			}

			var vals=$(this).val()||$(this).attr("value");
			if (vval == "gfsh" && vals == $(this).attr('placeholder')) vals = '';
			var vas=[[vals,vval,errcbk]];
			validate.validate(vas);
		});
		dialog.$dialog.find("#saveInvoice").on("click",function(){
			dialog.$dialog.find("input").trigger("keyup");
			var data=transData(dfn(im));
			if(data.invoiceNeedType=="N"){
				emit("noSaveInvoice",false);
				dialog.hide();
				render(im);
				return;
			}
			var velkeys=[];
			dialog.$dialog.find("[g-validate]").each(function(){
				var vval=$(this).attr("g-validate");
				var path=u.pipe(ui.attr("value-path"),u.split(","))($(this));
				var fillel=dialog.$dialog.find("[g-tip-validate="+vval+"]");
				var textel=dialog.$dialog.find("[g-validate="+vval+"]");
				function errcbk(msg){
					if(u.isEmpty(msg)){
						textel.removeClass("error");
					}else{
						textel.addClass("error");
					}
					fillel.html(msg);
					setPath(u.concat(u.init(path),[vval]),msg,im);
				}
				
				var vals=$(this).val()||$(this).attr("value");
				
				if (vval == "gfsh" && vals == $(this).attr('placeholder')) vals = '';

				if($(this).attr("no-modify")!="y"){
					velkeys.push([vals,vval,errcbk]);
				}

			});
			if(validate.validate(velkeys)){
				emit("saveInvoice",data);
				dialog.hide();
				render(setPath(["open"],false,im));
			}
		});
	}

	function make(div,data){
		function r(a,data1){
			if(a=="div")return div;//操作范围
			if(data1!=null){
				data=data1;
				return r;
			}
			if(a=="data")return data;//最新数据
		}
		render(r);
		return r;
	}
	exports.invoice={
		make:u.curry(make),
		initTransData:initTransData,
		transData:transData,
		TYPE:TYPE
	};
}(this,request,util,util_ui,util_watch,GTPL,panel,validate);