/**身份授权*/
!function(exports,u,ui,uw,tpl){
	var TYPE="7authorization7";
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
	function notAuthorization(im){
		return !datfn(im).authorized;
	}
	function notAuth(im){
		return datfn(im).idCardNumber==null||datfn(im).idCardNumber=="";
	}
	function render(im){
		if(notAuth(im)){
			return modifyIdentity(im);
		}
		div(im).html(tpl.authorization_main(datfn(im)));
		div(im).find("#modify").on("click",u.partial(modifyIdentity,[im]));
	}
	function modifyIdentity(im){
		var dialog = $.gDialog({
			html: tpl.authorization_modify(u.assoc("notAuth",notAuth,{im:im,data:datfn(im)})),
			modal:{}
		});
		dialog.show();
		function errStylefn(tipel,textel){
			return function(err){
				function fn1(){
					tipel.hide();
					textel.removeClass("error");
				}
				function fn2(err){
					textel.addClass("error");
					tipel.html('<span style="color:#f00;">'+err+"</span>");
					tipel.show();
				}
				return u.ifn(u.isEmpty,fn1,fn2)(err);
			}
		}
		//身份证号码加星前端策略
		dialog.$dialog.find("[no-modify]").one("mousedown",function(){
			$(this).removeAttr("no-modify").val('')
		})
		//失去焦点校验
		dialog.$dialog.find("[g-validate]").blur(function(){
			var vval=$(this).attr("g-validate");
			var fillel=dialog.$dialog.find("[g-tip-validate="+vval+"]");
			var textel=dialog.$dialog.find("[g-validate="+vval+"]");
			var vals=$(this).val()||$(this).attr("value");
			var vas=[[vals,vval,errStylefn(fillel,textel)]];
			validate.validate(vas);
		});
		function dialogHide(){
			dialog.hide();
		}
		function saveAction(){
			var velkeys=[];
			dialog.$dialog.find("[g-validate]").each(function(){
				var vval=$(this).attr("g-validate");
				var fillel=dialog.$dialog.find("[g-tip-validate="+vval+"]");
				var textel=dialog.$dialog.find("[g-validate="+vval+"]");
				var vals=$(this).val()||$(this).attr("value");
				if($(this).attr("no-modify")!="y"){
					velkeys.push([vals,vval,errStylefn(fillel,textel)]);
				}
			});
			if(validate.validate(velkeys)){
				emit("saveAction",{
					name:dialog.$dialog.find("[g-validate=hwg-name]").val(),
					card:dialog.$dialog.find("[g-validate=hwg-card]").val()
				})
				dialogHide();
			}
		}
		ui.gpipes(dialog.$dialog,{
			dialogHide:dialogHide,
			saveAction:saveAction
		})
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
	exports.authorization={
		make:u.curry(make),
		notAuth:notAuth,
		notAuthorization:notAuthorization,
		TYPE:TYPE
	};
}(this,util,util_ui,util_watch,GTPL);