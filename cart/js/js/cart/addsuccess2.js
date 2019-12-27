(function(exports,tpl,u,req,panel){
	var box1biz=u.pipe(renderbox1,setJIndu($(".box1")),boxevent,setATOM("box1data"));
	var box2biz=u.pipe(renderbox2,setJIndu($(".box2")),boxevent,setATOM("box2data"));
	var querystring=u.pipe(u.split("?"),u.last,u.split("&"),u.map(u.split("=")),u.fromPairs);
	//全局变量
	var ATOM={
		query:querystring(exports.location.href),
		area:$.cookie("atgregion")||"11010200|北京市朝阳区(五环里)全部区域|11010000|11000000|110102001",
		cid:$.cookie("__clickidc"),
	  	uid:$.cookie("DYN_USER_ID") ? $.cookie("DYN_USER_ID") : "",
	  	box1data:{},
	  	box2data:{}
	}
	function createPackage(div,data){
		return {
			div:div,
			data:data
		}
	}
	function renderItemInfo(data){
		return createPackage($("#item-info-body").html(tpl.iteninfo(data)),data);
	}
	function renderbox1(data){
		data.title="购买了该商品的用户还购买了";
		return createPackage($(".box1").html(tpl.box1(data)),data);
	}
	function renderbox2(data){
		data.title="您可能还需要";
		return createPackage($(".box2").html(tpl.box1(data)),data);
	}
	function logerr(a){
		if(exports&&exports.console){
			console.log("调用接口失败",a);
		}
	}

	//设置进度条
	function setJIndu(div){
		return function(pkg){
			var jd=div.find(".box-header .box-jindu .jd");
			jd.removeClass("select");
			jd.eq(pkg.data.current-1).addClass("select");
			return pkg;
		}
	}
	//在商品上显示 加入购物车成功提示
	function itemTip(obj,str){
		var overlayer=obj.parents('.item').find('.img .overlayer')
		overlayer.html(str).fadeIn(function(){
        	 setTimeout(function(){overlayer.hide()},2000)
      	});
	}
	//添加商品至购物车
	function addCartFn(param,obj){
        if(param && param.k && param.k.length>100)param.k = '';
		req.reqp("//cart"+cookieDomain+"/home/api/cart/addToCart",param)
		.then(function(data){
	    	if(data.success){
	    		if(obj){
	    			itemTip(obj,"<i class='c-i add-cart-correct'></i>添加成功")
	    		}
	    		renderItemInfo(data.data)
	    	}else{
	    		if(obj){
	    			if(data.status == "MTK_V"){//虚拟卡
	                   window.location.href='//card'+cookieDomain+"?productId="+param.pid+"&skuId="+param.sid+"&count="+1+"&skuType=ZDZK";           
	                   return;
	                }else if(data.status == "MTK_E"){//实体卡
	                	window.location.href='//card'+cookieDomain+"?productId="+param.pid+"&skuId="+param.sid+"&count="+1+"&skuType=ZSTK";           
	                	return;
	                }else{
	                		itemTip(obj,"<i class='c-i add-cart-error'></i>添加失败");
	                }   
	    		}
	    		if(data.errCode != "003001038"){
                  panel.error(data.errMsg)
            	}
	    	}
		})
		.then(function(){
			$("#idGoBack").on('click',function(){
				var url = $page.referer;
				if(url && url.length > 0){
					location.href = url;
				}else{
					url = $(this).attr('defurl');
					location.href = url;
				}
			});
		})
	}
	function boxevent(pkg){
		var div=pkg.div;
		var data=pkg.data;
		var boxbiz=null;
		if(data.size==5){
			boxbiz=box2biz;
		}else{
			boxbiz=box1biz;
		}
		$(".box1 .box-header .box-jindu .jd").hover(function(){
			var jd=$(this);
			if(jd.is(".select"))return ;
			var idx=jd.attr("idx")-0;
			var dofn=u.pipe(jump(idx,10),box1biz);
			dofn(ATOM.box1data);
		});
		$(".box2 .box-header .box-jindu .jd").hover(function(){
			var jd=$(this);
			if(jd.is(".select"))return ;
			var idx=jd.attr("idx")-0;
			var dofn=u.pipe(jump(idx,5),box2biz);
			dofn(ATOM.box2data);
		});
		//点击加入购物车
		div.find("[add-cart]").on("click",function(){
			var btn=$(this);
			var idx=btn.attr("add-cart");
			var item = data.list[idx];
			var skuMappingSuit = btn.attr('skuMappingSuit');
			var param = {
		      "type":(skuMappingSuit?24:"0"),
		      "sid":(skuMappingSuit?skuMappingSuit:btn.attr("sid")),
		      "pid":btn.attr("pid"),
		      "pcount":1,
		      "cr":0,
		      "_r":new Date().getTime()
		    }
			addCartFn(param,btn)
		})
		div.find("[right]").on("click",function(){
			var current=data.current;
			if(current==3)current=1;
			else current++;
			var dofn=u.pipe(jump(current,data.size),boxbiz);
			dofn(data.origin);
		});
		div.find("[left]").on("click",function(){
			var current=pkg.data.current;
			if(current==1)current=3;
			else current--;
			var dofn=u.pipe(jump(current,data.size),boxbiz);
			dofn(data.origin);
		});
		return pkg;
	}
	//第几页 每页多少个
	function jump(n,size){
		return function(data){
			var listfn=u.pipe(u.drop((n-1)*size),u.take(size));
			return{
				current:n,
				size:size,
				list:listfn(data),
				origin:data
			}
		}
	}
	function setATOM(attr){
		return function(pkg){
			ATOM[attr]=pkg.data.origin;
			return pkg;
		}
	}
	//商品信息
	function doItemInfo(){
		var query=ATOM.query;
		query.cr=0
		addCartFn(query)
	}

	function dobox1(boxid){
		var pid=ATOM.query.pid;
		var sid=ATOM.query.sid;
		var area=ATOM.area.split("|")[0];
		var cid=ATOM.cid;
		req.reqp("//bigd.gome.com.cn/gome/rec",{
			boxid:boxid,
			pid:pid,
			cid:cid,
			area:area,
			brid:"",
			imagesize:160,
			shopid:"",
			c1id:"",
			c3id:"",
			sid:sid
		},"rec001")
		.fail(logerr)
		.then(u.pipe(u.prop("lst"),jump(1,10),box1biz));
	}
	//box2
	function dobox2(){
		var pid=ATOM.query.pid;
		var sid=ATOM.query.sid;
		var area=ATOM.area.split("|")[0];
		var cid=ATOM.cid;
		var uid=ATOM.uid;
		req.reqp("//bigd.gome.com.cn/gome/rec",{
			boxid: 'box17',
            area: area,
            cid: cid,
            uid:uid,
            imagesize: 160,
            sid:sid,
            pid:pid
		},"rec002")
		.fail(logerr)
		.then(u.pipe(u.prop("lst"),jump(1,5),box2biz));
	}
	function dofn(){
		if($(window).innerWidth()<1300)$("body").addClass("w990");
		else $("body").removeClass("w990");
	}
	;(function(){
		$(window).on("resize",dofn);
		dofn();
		
		doItemInfo();
		if(ATOM.query.homesite=="haiwaigou"){
			dobox1("box19");
		}else{
			dobox1("box18");
		}
		dobox2();

		//动画css引入
		if($.browser.mozilla||$.browser.webkit){
			asyncLoadCSSJS.loadCSS(stageCssServer+"/gmpro/1.0.0/cart/1.0.0/css/animate.min.css",function(err,node){
			});
		}
		window.mCart.lazyCart(true);
	})();
})(this,GTPL,util,request,panel);