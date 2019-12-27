/**
 * @name request.js
*/
!function(exports,$){
	var jsonpcallbackgen=700,
        deferredFlag=true;//请求接口开关 默认打开
	function curry(fn){
		var args = [].slice.call(arguments, 1);
		return function(){
			var newArgs = args.concat([].slice.call(arguments));
			return fn.apply(this, newArgs);
		}
	}
	function timefn(method,name){
		// if(exports.console&&exports.console[method]){
		// 	console[method](name);
		// }
	}
	//公共的error
	function errfn(obj){
		var msg={
			"404":"您请求的资源找不到 状态码404",
			"0":"网络请求失败，请检查您的网络设置",
			"200":"json数据格式有误，请校验"
		};
		// if(obj.status==200)
		if(typeof panel =="object"){
			// panel.error(msg[obj.status]||("请求资源错误-请求状态"+obj.status));
		}else{
			// alert(msg[obj.status]||("请求资源错误-请求状态"+obj.status));
		}
	}
	function _req(type,datatype,url,params){
		if(params){
            params._= new Date() -0;
		}else{
			var params={
                _: new Date() -0
			}
		}
		return $.ajax({
			type:type,
			url:url,
			datatype:datatype,
			data:params
		});
	}
	function _reqp(url,params,jsonpname,jsonp,timeout){
		if(jsonpname==null)jsonpname='dbk'+(jsonpcallbackgen++);
		if(jsonp==null)jsonp="callback";
		return $.ajax({
			url:url,
			dataType:"jsonp",
			type:"get",
			jsonp:jsonp,
			jsonpName:jsonpname,
			data:params,
			timeout:5000
		});
	}

	function req(type,datatype,url,params){
		timefn("time",url);
		return _req(type,datatype,url,params).fail(errfn).always(function(){
			timefn("timeEnd",url);
		});
	}
	function reqp(url,params,jsonpname,jsonp){
		timefn("time",url);
		return _reqp(url,params,jsonpname,jsonp).fail(errfn).always(function(){
			timefn("timeEnd",url);
		});
	}
	var getJson=curry(req,'get','json');
	var postJson=curry(req,'post','json');

	var getApi=function(site,method,params){
		params=params||{};
		return getJson('/'+site+'/api/'+method,params);
	}
	var postApi=function(site,method,params){
		return postJson('/'+site+'/api/'+method,params);
	}

	function res(fn){
		return function(){
			var args=[];
			for(var i=0;i<arguments.length;i++)args.push(arguments[i][0]);
			fn.apply(this,args);	
		}
	}
	function cachePromise(fn){
		var innerargs=[null,null,null];
		var args=[];
		for(var i=1;i<arguments.length;i++){
			args.push(arguments[i]);
		}
		return function(){
			if(innerargs[0]==null){
				return fn.apply(null,args).then(function(a0,a1,a2){
					innerargs[0]=a0;
					innerargs[1]=a1;
					innerargs[2]=a2;
				});
			}else{
				var d=$.Deferred();
				d.resolve(innerargs[0],innerargs[1],innerargs[2]);
				return d.promise();
			}
		}
	}
    //延迟执行api
    function deferredReq(cbfn,delay){
        if(!cbfn || !$.isFunction(cbfn)) return;
        var timer;
        if(deferredFlag){
            deferredFlag = false;
            clearTimeout(timer);
            timer = setTimeout(function(){
                deferredFlag = true;
            },delay || 1500);
            cbfn();
        }
    }
	
	exports.request={
		parall:$.when,
		req:req,
		cachePromise:cachePromise,
        deferredReq:deferredReq,
		reqp:reqp,
		_req:_req,
		_reqp:_reqp,
		getJson:getJson,
		postJson:postJson,
		getApi:getApi,
		postApi:postApi,
		curry:curry,
		res:res
	};
}(this,$);