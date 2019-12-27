/**身份验证 美通卡站点*/
!function(exports,u,ui,uw,req,tpl,validate){
	var TYPE="7entityCard7";
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
	
	function validatefn(im){
		div(im).find("#mtk-phone").trigger("blur");
		div(im).find("#mtk-yzm").trigger("blur");
		return validate.validateItem("mtk-phone",div(im).find("#mtk-phone").val(),function(){}) &&
			   validate.validateItem("mtk-yzm",div(im).find("#mtk-yzm").val(),function(){});
	}
	function render(im){
		var el=div(im);
		el.html(tpl.entity_card_main({sm:datfn(im)}));
		function errfn(div){
			return function(err){
				if(err){
					div.addClass("error");
					div.find(".errfix").html(err);
				}else{
					div.removeClass("error");
				}
			}
		}
		el.find("#mtk-phone").on("blur",function(){
			var val=$(this).val();
			var div=$(this).parent("div");
			if(!validate.validateItem("mtk-phone",val,errfn(div))){
				return false;
			}else{
				$config.shoppingAtom.mtksfyz.mobile=val;
			}
		});
		el.find("#mtk-yzm").on("blur",function(){
			var val=$(this).val();
			var div=$(this).parent("div");
			if(!validate.validateItem("mtk-yzm",val,errfn(div))){
				return false;
			}else{
				$config.shoppingAtom.mtksfyz.code=val;
			}
		});
		function reflashBtn(btn,startTime){
			var ctime=new Date()-0;
			var difftime=ctime-startTime;
			if(difftime > 60*1000){
				btn
				.html("获取验证码")
				.removeClass("btn-disabled");
			}else{
				btn
				.html("请"+parseInt(60-difftime/1000)+"秒之后再试")
				.addClass("btn-disabled");
				setTimeout(function(){
					reflashBtn(btn,startTime);
				},500);
			}
		}
		div(im).find('#get-mtk-yzm').on('click',function(){
			if($(this).is(".btn-disabled"))return
			reflashBtn($(this),new Date()-0);
			var $divObj=div(im).find("#mtk-yzm").parent('div');
			emit("sendSMS",{mobile:$('#mtk-phone').val(),errorfn:function(data){
				$divObj.addClass("error");
				$divObj.find(".errfix").html(data.errMsg);
			},sucfn:function(){
				$divObj.removeClass("error");
			}});
		});
	}
	function getInfo(im){
		return {mobile:div(im).find('#mtk-phone').val(),code:div(im).find('#mtk-yzm').val()}
	}
	function haveError(im,errmsg){
		div(im)
		.find("#mtk-yzm")
		.parent('div')
		.addClass("error")
		.find(".errfix")
		.html(errmsg);
	}
	function make(div,data){
		function r(flg,data1){
			if(data1)data=data1;
			return {
				div:div,
				data:data
			}[flg];
		}
		render(r);
		return r;
	}
	exports.entityCard={
		make:u.curry(make),
		TYPE:TYPE,
		validatefn:validatefn,
		getInfo:getInfo,
		haveError:haveError
	};
}(this,util,util_ui,util_watch,request,GTPL,validate);