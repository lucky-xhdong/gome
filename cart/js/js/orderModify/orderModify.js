!function(u,ui,req,tpl,validate){
	//解决跨域问题
	document.domain=cookieDomain.slice(1);
	
	var querystring=u.pipe(u.split("?"),u.last,u.split("&"),u.map(function(item){return item.split("=")}),u.fromPairs),query=querystring(location.href);
	var oid=query.orderId || $.cookie('orderid'),userId=$.cookie('__clickidc');

	//用转换后数据渲染页面,返回r函数给全局调用
	var make= u.curry(function _make(div,data){
		function r(a,data1){
			if(a=="div")return div;
			if(data1!=null){
				data=data1;
				return r;
			}
			if(a=="data")return data;
		}
		render(r)
		return r;
	})
	//主要给保存数据用
	var setInstanceAtom=u.curry(function _setInstanceAtom(name,r){ 
		$config.instenceAtom[name]=r;
		return r;
	})

	var reloadOrderModify=u.pipe(initTransdata,transdata,make($('#orderModifyMain')),setInstanceAtom('invoice'))

	function branchErrorWarp(errfn,successfn){
		return function(data){
			return data.success ? successfn(data) : errfn(data)
		}
	}
	//接口通用错误处理
	function errfn(data){
		var errorHtml = '<div id="comErrBox">'+
						'<div class="errorBoxlh errhide">' +
				            '<div class="errorCont">' +
				            	'<h5 class="errorMessage"></h5>' +
				           		'<a class="errorBtn">确定</a>' +
				            '</div>' +
            			'</div>' +
            			'<div class="mask_lh errhide"></div></div>';
        var domHeight =$('body').height();
        $('body').append(errorHtml);
        $('.errorMessage').text(data.errMsg);//错误提示语
        $('.errorBoxlh').show();
        $('.mask_lh').css('height',domHeight).show();
        $('.errorBtn').click(function(){//点击确定按钮
            $('#comErrBox').remove();
        })
	}
	function div(im){
		return im('div')
	}
	function dfn(im){
		return im('data');
	}

	function getDeliverTimeFn(item){
		return item.available && item.selected
	}
	function contTypesSelectedTrueFn(data){
		return u.find(function(item){return item.available && item.selected},data.contTypes).label	
	}
	function detailTypeFn(data){
		return data.invoiceContClass+','+u.find(function(item){return item.available && item.selected},data.contTypes).code
	}
	//处理发票类型为个人或者单位时抬头问题 (2018-1-16 15:37:04 去掉企业单位、非企业单位的区分，只保留原始的个人和单位)
	function splitCompanyFn(data){
		var fn=function(h){return h.code=="1"}
		var id=u.findIdx(fn,data.headTypes),
			dwItem=u.find(fn,data.headTypes),
			dwSelected = !data.taxpayerNo && dwItem.selected,
			headTypesDw=data["headTypes"];
		if(id){
			if(!(data.taxpayerNo && dwItem.selected)){
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
		return data
		
	}
	function initTransdata(data){
		data.isIe678=false
		if($.browser.msie){ 
			if($.browser.version-0<9){
				data.isIe678 = true
			}
		}
		if(data.showInvoice && !data.elecInvoice){
			if(data.normalInvoice){
				//splitCompanyFn(data.normalInvoice)
				var selectedHead=u.find(function(item){return item.visible && item.selected},data.normalInvoice.headTypes)
				if(selectedHead.code=="0"){
					data.normalInvoice.ghead=data.normalInvoice.head
					data.normalInvoice.dhead=""
				}else{
					data.normalInvoice.ghead=""
					data.normalInvoice.dhead=data.normalInvoice.head
				}
				return data
			}
		}
		return data	
	}
	//转化为模板所需要的数据
	function transdata(data){
		//送货地址数据转化
		if(data.deliverTimeOptions){
			data.showDeliverTime=u.find(getDeliverTimeFn,data.deliverTimeOptions)
		}
		//发票数据转化
		if(data.showInvoice && !data.elecInvoice){
			if(data.normalInvoice){
				data.selectedHead=u.find(function(item){return item.visible && item.selected},data.normalInvoice.headTypes)
				//来源数据做过滤
				if(data.normalInvoice.invoiceContClasses){
					if(data.normalInvoice.invoiceContClasses.length==1){
						var showcontTypesData=data.normalInvoice.invoiceContClasses[0]
					}else{
						var showcontTypesData=u.find(function(item){return item.selected},data.normalInvoice.invoiceContClasses)
					}
					if(showcontTypesData.contTypes){
						data.selectedContentType={
							contTypesLable:contTypesSelectedTrueFn(showcontTypesData),
							detailType:detailTypeFn(showcontTypesData)
						}
					}else{
						data.selectedContentType={
							contTypesLable:'',
							detailType:''
						}
					}
				}else{
					data.selectedContentType={
						contTypesLable:'',
						detailType:''
					}
				}
				return data
			}
		}
		return data
	}
	
	function reloadAll(){
		req.reqp("//success"+cookieDomain+"/order/loadOM",{
			orderId:oid,
			userId:userId
		}).then(branchErrorWarp(errfn,function(data){
			if(data.data.canModifyShippingAddress === false){
				data.data.isNotEditAdd = true;
			}else{
				data.data.isNotEditAdd = false;
			}
		
			reloadOrderModify(data.data)
		})) 
	}
	
	function render(im){
		div(im).html(tpl.order_modify(dfn(im)))
		alternation(im)
	}
	/*输入验证*/
	function errStylefn(err,tipel){
		function fn1(){
			tipel.empty();
		}
		function fn2(err){
			tipel.html('<em class="errIco"></em>'+err);
			tipel.show();
		}
		return u.ifn(u.isEmpty,fn1,fn2)(err);
	}
	function commonvalidate(div){
		$("[g-validate]").blur(function(){
			var vval=$(this).attr("g-validate");
			var fillel=div.find("[g-tip-validate="+vval+"]");
			var vals=$(this).val()||$(this).attr("value");
			function errcbk(err){
				return errStylefn(err,fillel);
			}
			validate.validate([[vals,vval,errcbk]]);
		});
	}
	function beforeSaveValidate(){
		var vas=[],
			getPhoneValidatStr=function(el){
				if(el.attr("m")!="true"){return "17090114267";}
				return el.val();
			},
			getCallValidatStr=function(el){
				if(el.attr("m")!="true"){return "010-45784547";}
				return el.val();
			};
		$("[g-validate]").each(function(){
			var $el=$(this),vval=$el.attr("g-validate"),textel=$("[g-validate="+vval+"]"),fillel=$("[g-tip-validate="+vval+"]"),vals=$el.val()||$el.attr("value");
			function errcbk(err){
				return errStylefn(err,fillel);
			}
			if(vval=="phone"){
				vals=getPhoneValidatStr(textel);
			}else if(vval=="call"){
				vals=getCallValidatStr(textel);
			}	
			vas.push([vals,vval,errcbk]);
		});
		return validate.validate(vas)
	}
	//通用交互函数
	function commonAlternation(){
		var div=$('#orderModifyMain');
		commonvalidate(div)
		/*点击修改*/
		$('.modif').on('click',function(){
			var btn=$(this).parent();
			var info=btn.siblings(".infoBox"),
				edt=btn.siblings(".editBox");
			$(this).remove();
			info.remove();
			edt.show();
		});
		/*点取消关闭弹层*/
		$(".j-close").on('click',function(){
			window.parent.document.getElementById("popup").style.display = "none";
			window.parent.document.getElementById("popup").setAttribute("src","");
		});
		$("#saveModif").off("click").on('click',function(){
			if(beforeSaveValidate()){
				var data=dfn($config.instenceAtom.invoice);
				var params = {
		            orderId:oid,
		            userId:userId,
		            name:$("#userName").val(),
		            mobileNumber:$("#mNumber").val(),
		            phoneNumber:$("#pNumber").val(),
		            address:$("#userAddress").val(),
		            email:$("#userEmail").val(),
		            deliverTimeOption:data.showDeliveryInfo?$('[name="timeChoose"]:checked').val():"SLOT",
		            shippingName:"",
		            shippingPhone:"",
		            needInvoice:data.needInvoice,
		            headTypes:"",
		            invoiceContClasses:"",
		            head:"",
		            //taxpayerNo:data.normalInvoice ? data.normalInvoice.taxpayerNo:''
		            taxpayerNo:data.normalInvoice ? (data.normalInvoice.taxpayerNo == null ? '' : data.normalInvoice.taxpayerNo):''
		        }
		        if(data.showInvoice && !data.elecInvoice ){
			        if(data.vatInvoice){
			        	params.shippingName=data.vatInvoice.shippingName;
			        	params.shippingPhone=data.vatInvoice.shippingPhone
			        }

			        if(data.normalInvoice){
			        	//非企业抬头code==2  提交按单位code=1保存
			        	if(data.selectedHead.code=="2"){
			        		params.headTypes=1
			        		params.taxpayerNo=''
			        	}else{
			        		params.headTypes=data.selectedHead.code;
			        	}
			        	params.invoiceContClasses=data.selectedContentType.detailType
			        	if(data.selectedHead.code=="0"){
			        		params.head=data.normalInvoice.ghead || ""
			        	}else{
			        		params.head=data.normalInvoice.dhead || ""
			        	}
			        }
		        }
				req.reqp("//success"+cookieDomain+"/order/doOM",params).then(branchErrorWarp(errfn,function(data){
					window.parent.document.getElementById("popup").style.display = "none";
					alert("订单修改成功");
					var url=parent.location.href;
					parent.location.href =url.replace("?modify=true","");
				}))
			}
		});
	}
	//收货人信息交互
	function addressAlternation(div){
		//手机已经保存的情况
		div.find("[g-validate=phone]").on("focus",function(){
			$(this)
			.val('')
			.attr("m","true");
		});
		div.find("[g-validate=call]").on("focus",function(){
			$(this)
			.val('')
			.attr("m","true");
		});
	}
	//发票信息交互
	function renderModify(div,im){
		commonvalidate(div)

		function renderModifyIn(im){
			div.html(tpl.invoice_modify(dfn(im)))
			renderModify(div,im)
		}
		function setPath(path,val,im){
			im('data',transdata(u.assocPath(path,val,dfn(im))));
			return im;
		}
	
		div.find("[g-hoverup-tip]").each(ui.jq(function(obj){
			var tip=obj.attr("g-hoverup-tip");
			var selector="[g-hover-tip="+tip+"]";
			ui.hoverUp(obj.add(selector))(div.find(selector));
		}));

		//是否需要发票切换
		div.find("[g-value-path]").on('click',function(){
			var el=$(this),
				path=el.attr('g-value-path').split(","),
				value=el.val()=="true"?true:false;
			renderModifyIn(setPath(path,value,im))
		})
		//发票抬头类型切换
		div.find("[g-fptt-path]").on('click',ui.jqpipe(
			ui.attr("g-fptt-path"),
			u.split(","),
			u.path(u.__,dfn(im)),
			function(sitem){
				return setPath(["normalInvoice","headTypes"],u.map(function(head){
					if(sitem==head)return u.assoc("selected",true,head);
					return u.assoc("selected",false,head);
				},dfn(im).normalInvoice.headTypes),im);
			},
			renderModifyIn)
		)
		div.find("[g-ffnr-path]").on("click",ui.jqpipe(
			ui.attr("g-ffnr-path"),
			u.split(","),
			function(arr){
				var sitem=u.path(arr,dfn(im));
				if(dfn(im).normalInvoice.invoiceContClasses.length==1){
					var showcontTypesData=dfn(im).normalInvoice.invoiceContClasses[0]
				}else{
					var showcontTypesData=u.find(function(item){return item.selected},dfn(im).normalInvoice.invoiceContClasses);
				}
				return setPath(u.take(4,arr),u.map(function(conType){
					if(sitem==conType)return u.assoc("selected",true,conType);
					return u.assoc("selected",false,conType);
				},showcontTypesData.contTypes),im);
			}
		))
		/*发票内容 帮助的hover动作*/
		div.find("#fpHelp").hover(function(){
			div.find(".invoiceHelp").show();
		},
		function(){
			div.find(".invoiceHelp").hide();
		});
		function setStage(name,el){
			im('data',u.assocPath(name.split('.'),el.val(),dfn(im)))
		}
		ui.gpipes(div, {
            setStage:setStage     
        });
	}

	//入口交互
	function alternation(im){
		var $invoice=$('#invoice')
		commonAlternation()
		addressAlternation($('#address'))
		/*发票修改单独处理*/

		$invoice.find('.modif').on('click',function(){
			if(dfn(im).needInvoiceAvailable==false && dfn(im).needInvoice==false){
				dfn(im).needInvoiceAvailable=true
			}
			$invoice.html(tpl.invoice_modify(dfn(im)))
			renderModify($invoice,im)
		})
	}
	//入口
	reloadAll()
}(util,util_ui,request,GTPL,validate)