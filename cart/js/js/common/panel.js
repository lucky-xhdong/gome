!function(exports,u,ui,tpl){

	function confirm(data){
		data.title=data.title||false;
		var dialog = $.gDialog({
			html: tpl.comp_confirm(data),
			zIndex:10000,
			modal:{
				zIndex:1000
			}
		});
		dialog.show();
		var div=dialog.$dialog;

		//点击按钮
		div
		.find("[g-btn-path]")
		.on("click",function(){
			var path=$(this).attr("g-btn-path");
			var fnfn=u.pipe(u.split(","),u.concat(u.__,["click"]),u.path(u.__,data));
			var fn=fnfn(path);
			return fn(dialog);
		});

		//点击关闭
		div
		.find("[g-panel-close]")
		.on("click",function(){
			data.close(dialog);
		});
		return dialog;
	}

    function alertClose(html,fn){
        var body=u.ifn(u.is(Object),u.identity,u.always({
            type:TYPE.WARN,
            content:html
        }))(html);

        var dialog = $.gDialog({
            html: tpl.comp_alert({
                close:true,
                type:body.type,
                body:body.content,
                code:body.code
            }),
            zIndex:10000,
            modal:{
                zIndex:1000
            }
        });
        dialog.show();
        dialog.$dialog.find("[g-panel-close]").on("click",function(){
            return fn(dialog);
        });
        return dialog
    }

	function alert(html){
		return alertClose(html,ui.hide);
	}

	function error(html){
		return alert({type:TYPE.ERROR,content:html});
	}
    function errorWithObj(obj){
        return errorWithObjClose(obj,ui.hide);
    }
    function errorWithObjClose(obj,fn){
        obj.errMsg=$config.renderError(obj);
        obj.type=obj.TYPE||TYPE.ERROR;
        obj.content=obj.errMsg;
        var errfix=u.take(6,obj.errCode);
        if(errfix=="001999"
        ||errfix=="002999"){
            obj.code=u.take(3,obj.errCode) + u.drop(6,obj.errCode);
        }

        return alertClose(obj,fn);
    }

	function success(html){
		return alert({type:TYPE.SUCCESS,content:html});
	}
    function success2s(html){
        var body=u.ifn(u.is(Object),u.identity,u.always({
            type:TYPE.SUCCESS,
            content:html
        }))(html);

        var dialog = $.gDialog({
            html: tpl.comp_alert({
                close:true,
                type:body.type,
                body:body.content,
                code:body.code
            }),
            zIndex:10000,
            modal:{
                zIndex:1000
            }
        });
        dialog.show();
        dialog.$dialog.find("[g-panel-close]").removeClass('btn-disabled').addClass('btn-primary').on("click",function(){
            dialog.hide();
        });
        //2S后隐藏
        setTimeout(function(){
            dialog.hide();
        },2000);
        return dialog
    }
	function fail2s(html){
		var body=u.ifn(u.is(Object),u.identity,u.always({
			type:TYPE.WARN,
			content:html
		}))(html);

		var dialog = $.gDialog({
			html: tpl.comp_alert({
				close:true,
				type:body.type,
				body:body.content,
				code:body.code
			}),
			zIndex:10000,
			modal:{
				zIndex:1000
			}
		});
		dialog.show();
		dialog.$dialog.find("[g-panel-close]").removeClass('btn-disabled').addClass('btn-primary').on("click",function(){
			dialog.hide();
		});
		//2S后隐藏
		setTimeout(function(){
			dialog.hide();
		},2000);
		return dialog
	}
	function confirmOKCanel(type,html,okfn,canelfn){
		var title=false;
		if(u.is(Object,html)){
			title=html.title;
			html=html.body;
		}
		return confirm({
			type:type,
			title:title,
			body:html,
			btns:[{
				clazz:"btn btn-default",
				btnName:"取消",
				click:canelfn
			},{
				clazz:"btn btn-primary",
				btnName:"确定",
				click:okfn
			}],
			close:canelfn
		})
	}
	var c_confirmOkCanel=u.curry(confirmOKCanel);

	var dialog=null;
	var dialog_show=false;
	var dialog_time=null;
	var dialog_num=0;
	var dialog_delay=200;
	function maskHide(){
		// if(dialog_num>0)dialog_num--;
		// if(dialog_num>1)return;
		// clearTimeout(dialog_time);
		// if(dialog&&dialog_show)dialog.hide();
		// dialog_show=false;
	}
	function mask(){
		// dialog_num++;
		// if(dialog_show)return;
		// function show(){
		// 	dialog = $.gDialog({
		// 		html: '<div class="loading animated flipInX" style="width:100px;height:100px;"></div>',
		// 		zIndex:10000,
		// 		modal:{
		// 			opacity:0.2,
		// 			backgroundColor:"#FFFFCC"
		// 		}
		// 	});
		// 	dialog.show();
		// }
		// dialog_time=ui.delay(dialog_delay,show,null,dialog_time);
		// dialog_show=true;

	}
	/*购物车不让有叉叉ERROR:error改成warn*/
	var TYPE={
		ERROR:"warn",
		WARN:"warn",
		SUCCESS:"success"
	}
	//防诈骗说明
	function biz001(){
		var dialog = $.gDialog({
			html: tpl.comp_biz001({}),
			zIndex:10000,
			modal:{
				zIndex:1000
			}
		});
		dialog.show();

		//5S后隐藏
		setTimeout(function(){
			dialog.$dialog.find("[g-panel-close]").removeClass('btn-disabled').addClass('btn-primary').on("click",function(){
				dialog.hide();
			});
		},5000)
	}
	//延保和主品解绑后弹窗
    function alertWarrantyHas(fn){
        var html = '<div style="font: 16px/32px microsoft yahei; text-align: center;">来晚啦！延保商品已抢光~~</div><br><div style="margin: 10px 0 18px 26px;"><button g-panel-close class="btn btn-primary" style="font-size: 14px;">知道啦</button></div>';
        var body = u.ifn(u.is(Object),u.identity,u.always({
            type:TYPE.WARN,
            content:html
        }))(html);

        var dialog = $.gDialog({
            html: tpl.comp_alertWar({
                close:true,
                type:body.type,
                body:body.content,
                code:body.code
            }),
            zIndex:10000,
            modal:{
                zIndex:1000
            }
        });
        dialog.show();
        dialog.$dialog.find("[g-panel-close]").on("click",function(){
            dialog.hide();
            fn && fn();
        });
    }
	exports.panel={
		confirm:confirm,
		alertClose:alertClose,
		TYPE:TYPE,
		alert:alert,
		error:error,
		success:success,
		success2s:success2s,
		fail2s:fail2s,
		mask:mask,
		maskHide:maskHide,
		confirmOKCanelType:c_confirmOkCanel,
		confirmOKCanel:c_confirmOkCanel(TYPE.WARN),
		confirmOk:c_confirmOkCanel(TYPE.WARN,u.__,u.__,ui.hide),
		biz001:biz001,
        errorWithObjClose:errorWithObjClose,
        errorWithObj:errorWithObj,
		alertWarrantyHas:alertWarrantyHas
	}
}(this,util,util_ui,GTPL);