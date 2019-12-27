!function(exports,u,ui,uw,req,panel,tpl,validate){
	var decodeURIFn=function(item){
		var itemArr=item.split('=')
		itemArr[1]=decodeURI(u.last(itemArr))
		return itemArr
	}
	function isfromMember (data) {
		if(data.processType){
			if(data.processType=='memberCenter'){
				return true
			}
		}
		return false
	}
	var querystring=u.pipe(u.split("?"),u.last,u.split("&"),u.map(decodeURIFn),u.fromPairs);
	//全局变量
	var ATOM={
		query:querystring(exports.location.href)
	}
	//来源是会员还是商品详情页
	if(ATOM.query.processType=="memberCenter"){
		init($('#jixintong'),u.assoc('isfromMember',true,ATOM.query))
	}else{
		init($('#jixintong'),{'isfromMember':false})
	}
	function upfail($parent,errmsg){
		var  errmsg = errmsg ? errmsg : "请上传格式为 jpg/jpeg/bmp/png 的图片！"
		if($parent.find('.modify-con a').is(':visible')){
    		$parent.find('.upload-btn').show();
			$parent.find('.upload-pic').hide().find('img').attr({'src':"",'value':""})
	    	$parent.find('.modify-con a').hide();
	    	isRemoveDisable(ui.searForm($('#jxForm')),$('#gotosubmit'))
    	}

    	$parent.find('.upload-err-msg').addClass('error').html('<i class="c-i jx-add-err"></i>'+errmsg);
		
	}
    function uploadImg(data){
    	var url='/jixin/api/gfs/fileUp'
    	$.fn.ajaxUpload=function(options){
    		return this.each(function(i){
    			var $this=$(this),$parent=$this.parents('.upload-col');
    			var settings={
    				action: url,
		            name: 'file',
		            hoverClass:'hover',
		            responseType: 'json',
		            onSubmit : function(file , ext){
		            	var thiz=this;
						//判断IE
						var isIE = window.navigator.userAgent.toLowerCase().indexOf("msie")>0 ? true : false;
		            	if(!isIE && thiz._input.files && thiz._input.files[0].size/(1024 * 1024) > 2){
		                	upfail($parent,"请上传文件大小不超过2M的图片！")
		                	return false
		                }else if(ext && /^(jpg|jpeg|png|bmp)$/.test(ext.toLowerCase())){
							thiz.setData({ 'file': file});
		                }else{
		                	upfail($parent)
		                	return false
		                }
		                $parent.find('.upload-loading').show();
		            },
		            onComplete:function(file,response){
		            	$parent.find('.upload-loading').hide();
		            	if(response.success){
		            		$parent.find('.upload-btn').hide();
                            var waterPath = response.data.waterPath;
                            var waterPathSrc = waterPath.substring(0,waterPath.indexOf(".jpg")) + "-dh300.jpg";
		            		$parent.find('.upload-pic').show().find('img').attr({'src':waterPathSrc,'value':response.data.path})
			            	$parent.find('.modify-con a').show();
			            	isRemoveDisable(ui.searForm($('#jxForm')),$('#gotosubmit'))
		            	}else{
		            		upfail($parent,response.errMsg)
		            	}
		            }
    			}
    			op=$.extend(settings,options)
    			new AjaxUpload($this,op)
    		})
    	}
    	$('#identityCard0up,#identityCard1up,#identityCard2up,.modify-con a').ajaxUpload({})
    }
    function validateText(obj){
    	var vval=obj.attr("g-validate");
		var fillel=$("[g-tip-validate="+vval+"]");
		var textel=$("[g-validate="+vval+"]");
		function errcbk(msg){
			if(u.isEmpty(msg)){
				textel.removeClass("error");
			}else{
				textel.addClass("error");
			}
			fillel.html(msg);
		}
		var vals=obj.val()||obj.attr("value");
		return [vals,vval,errcbk]
    }
    function renderTpl(div,data){
    	div.html(tpl.authentication(data))
    }
    function isRemoveDisable(vals,obj){
    	obj.addClass('disable')
    	var idx=$('[g-click].btn-checked').index();
    	if($('[name="isAgreeprotocol"]').prop('checked')){
    		if(idx==0){
	    		var k=u.find(u.pipe(u.last,u.eq("")),u.toPairs(vals))
				if(!k){obj.removeClass('disable')}
			}else{
				if(vals.idCardRealName && vals.idCardNumber){
					obj.removeClass('disable')
				}
			}
    	}
    }
	function init(div,data){
		renderTpl(div,data);
		var el=$('#jxForm'),$gotosubmit=$('#gotosubmit'),dialog=null,$check=$('[name="isAgreeprotocol"]');

		uploadImg(data)

		//入网协议取消,上传置灰
		$check.on("change",function(){
			if($check.prop('checked')){
				isRemoveDisable(ui.searForm(el),$gotosubmit)
				$check.nextAll('span').hide()
			}else{
				$gotosubmit.addClass('disable');
				$check.nextAll('span').show()
			}
		})
		//文本输入框失去焦点验证
		el.find("[g-validate]").blur(function(){
			validate.validate([validateText($(this))])
			isRemoveDisable(ui.searForm(el),$gotosubmit)
		});

		//页卡切换
		el.find("[g-click]").on("click",function(){
			var $this=$(this),idx=$this.index()
			if($this.hasClass('btn-checked')){
				return
			}else{
				el.find("[g-click]").removeClass('btn-checked');
				$this.addClass('btn-checked');
				el.find("[g-value-click]").hide();
				el.find("[g-value-click="+idx+"]").show();
			}
			isRemoveDisable(ui.searForm($('#jxForm')),$('#gotosubmit'))
		})

		//入网协议点击出弹框
		$('#jx-protocol').on('click',function(e){
			dialog = $.gDialog({
				html: tpl.jx_protocol({}),
				zIndex:10000,
				modal:{zIndex:1000}
			});
			dialog.show();
			return false
		})
		$(document).on("click",function(e){
			if(dialog){dialog.hide()}
		});

		//提交
		$gotosubmit.off('click').on("click",function(){
			el.find("[g-validate]").blur()
			if($gotosubmit.hasClass('disable'))return;
			var params=ui.searForm(el);
            params.choiceType = 0;//默认电脑提交

			if(data.isfromMember){
				req.reqp("//order"+cookieDomain+"/orderlist/updateJixintongOrderIdentityInfo",{
					orderId:data.orderId
					,idCardFrontImageUrl:params.idCardFrontImageUrl
					,idCardBackImageUrl:params.idCardBackImageUrl
					,holdIdCardImageUrl:params.holdIdCardImageUrl
				}).then(function(data){
					if(data.success){
						var msg=data.result.jixintongResult?{TYPE:"success",errMsg:"提交成功",errCode:''} :{TYPE:"error",errMsg:"提交失败",errCode:''}
						var panelObj=panel.errorWithObjClose(msg,function(dialog){
                            ui.hide(dialog);
                            location.href=ATOM.query.refer
                        })
                        if(data.result.jixintongResult){
                        	setTimeout(function(){
                        		panelObj.$dialog.hide()
                        		location.href=ATOM.query.refer
                        	},2000)
                        }
					}else{
						panel.error(data.message || '提交失败')
					}
				})
			}else{
				$('[g-click].btn-checked').index() == 1 ? params = {idCardRealName:params.idCardRealName ,idCardNumber:params.idCardNumber,choiceType:1} : params
				req.postApi('jixin','saveJixinIdenInfo',params).then(function(data){
					if(data.success){
						req.postApi('jixin','checkout/checkout').then(function(checkdata){
							checkdata.success ? location.href = '/jixin' + $config.URL.shopping : panel.alert(checkdata.errMsg || '结算失败，请重试')
						})
					}else{
						panel.alert(data.errMsg || '您输入的姓名和身份证不匹配，请重新输入')
					}
				})
			}	
		});
	}
}(this,util,util_ui,util_watch,request,panel,GTPL,validate)