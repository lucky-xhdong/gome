;(function($){

	//ie678 hack
	if($.browser.msie){ 
		if($.browser.version-0<9){
			$("body").addClass("ie678");
		}
	}
	var doc=$(document);
	//白色按钮
	doc.on("mousedown",function(e){
		var btn=$(e.target);
		if(btn.is(".btn.btn-default")){
			btn.removeClass("mousedown").addClass("mousedown");
		}
	})
	.on("mouseup",function(e){
		var btn=$(e.target);
		if(btn.is(".btn.btn-default")){
			btn.removeClass("mousedown");
		}
	});
	function domOrParentHasAttr(dom,attr){
		var attrv=dom.getAttribute(attr);
		if(attrv!==null)return true;
		if(dom.parentElement==null){
			return false;
		}
		return domOrParentHasAttr(dom.parentElement,attr);
	}
	//点击其它隐藏 
	doc.on("click",function(e){
		if(domOrParentHasAttr(e.target,"click-document-pre"))return;
		if(domOrParentHasAttr(e.target,"click-document-hide"))return;
		$("[click-document-hide]").hide();
	});

	//关闭按钮
	$(".c-i.closebtn-new").live("mousemove",function(){
		var a=$(this);
		a.removeClass("closebtn-new").addClass("closebtn-hover");
	});
	$(".c-i.closebtn-hover").live("mouseout",function(){
		var a=$(this);
		a.removeClass("closebtn-hover").addClass("closebtn-new");
	});
	//问号 tips_icon
	$(".c-i.tips_icon").live("mousemove",function(){
		var a=$(this);
		a.removeClass("tips_icon").addClass("tips_icon-hover");
	});
	$(".c-i.tips_icon-hover").live("mouseout",function(){
		var a=$(this);
		a.removeClass("tips_icon-hover").addClass("tips_icon");
	});

	$(".sup-body .l-btn").live("mousemove",function(){
		var a=$(this).find('.c-i');
		a.removeClass("arrow-left").addClass("bottom-good-l-hover");
	}).live("mouseout",function(){
		var a=$(this).find('.c-i');
		a.removeClass("bottom-good-l-hover").addClass("arrow-left");
	});
	$(".sup-body .r-btn").live("mousemove",function(){
		var a=$(this).find('.c-i');
		a.removeClass("arrow-right").addClass("bottom-good-r-hover");
	}).live("mouseout",function(){
		var a=$(this).find('.c-i');
		a.removeClass("bottom-good-r-hover").addClass("arrow-right");
	});

	//左右滚动交互
	$(".scroll-container .scroll-left-btn").live("mousemove",function(){
		var a=$(this);
		a.removeClass("arrow-left").addClass("arrow-left-over");
	}).live("mouseout",function(){
		var a=$(this);
		a.removeClass("arrow-left-over").addClass("arrow-left");
	});
	$(".scroll-container .scroll-right-btn").live("mousemove",function(){
		var a=$(this);
		a.removeClass("arrow-right").addClass("arrow-right-over");
	}).live("mouseout",function(){
		var a=$(this);
		a.removeClass("arrow-right-over").addClass("arrow-right");
	});
	//底部商品选择区
	$(".bottom-goods-body .left-btn").live("mousemove",function(){
		var a=$(this).find('.c-i');
		a.removeClass("bottom-good-l").addClass("bottom-good-l-hover");
	}).live("mouseout",function(){
		var a=$(this).find('.c-i');
		a.removeClass("bottom-good-l-hover").addClass("bottom-good-l");
	});
	$(".bottom-goods-body .right-btn").live("mousemove",function(){
		var a=$(this).find('.c-i');
		a.removeClass("bottom-good-r").addClass("bottom-good-r-hover");
	}).live("mouseout",function(){
		var a=$(this).find('.c-i');
		a.removeClass("bottom-good-r-hover").addClass("bottom-good-r");
	});
}($));