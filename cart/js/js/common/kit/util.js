function $track(type,obj){
	function _isTrack(){
		var URLParams = [];  
		var params = document.location.search.substr(1).split('&');   
		for (i=0; i < params.length ; i++){  
			var aParam = params[i].split('=');   
			URLParams[aParam[0]] = aParam[1];   
		}
		if(  URLParams.track){
			return true;
		}
			return false;
	   
	}
	if(_isTrack()) console.warn('==========>>>>>>>>>>>>>>>>>>',type,obj);
	try {
		GomeSa.track(type, obj);
	}catch(e){
		console.warn('埋码'+type,'e:'+e);
	}
}
/**
*提交订单页专用 辅助函数
*/
!function(exports){

/**************基础部分***********************/
	var __={util:"placeholder"};

	//{}->[]
	function toArray(o){
		var a=[];
		for(var i=0;i<o.length;i++)a.push(o[i]);
		return a;
	}
	//改变function的length
	function arity(n,fn){
		switch (n) {
		    case 0: return function() {return fn.apply(this, arguments);};
		    case 1: return function(a0) {void a0; return fn.apply(this, arguments);};
		    case 2: return function(a0, a1) {void a1; return fn.apply(this, arguments);};
		    case 3: return function(a0, a1, a2) {void a2; return fn.apply(this, arguments);};
		    case 4: return function(a0, a1, a2, a3) {void a3; return fn.apply(this, arguments);};
		    case 5: return function(a0, a1, a2, a3, a4) {void a4; return fn.apply(this, arguments);};
		    case 6: return function(a0, a1, a2, a3, a4, a5) {void a5; return fn.apply(this, arguments);};
		    case 7: return function(a0, a1, a2, a3, a4, a5, a6) {void a6; return fn.apply(this, arguments);};
		    case 8: return function(a0, a1, a2, a3, a4, a5, a6, a7) {void a7; return fn.apply(this, arguments);};
		    case 9: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {void a8; return fn.apply(this, arguments);};
		    case 10: return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {void a9; return fn.apply(this, arguments);};
		    default: throw new Error('First argument to arity must be a non-negative integer no greater than ten');
		  }
	}

	//固定科里化
	//，柯里化（英语：Currying），又译为卡瑞化或加里化，是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数
	//https://zh.wikipedia.org/wiki/%E6%9F%AF%E9%87%8C%E5%8C%96
	function curryN(length,fn){
		return arity(length, function() {
		    var n = arguments.length;
		    var shortfall = length - n;
		    var idx = n;
		    while (--idx >= 0) {
		      if (arguments[idx] === __) {
		        shortfall += 1;
		      }
		    }
		    if (shortfall <= 0) {
		      return fn.apply(this, arguments);
		    } else {
		      var initialArgs = toArray(arguments);
		      return curryN(shortfall, function() {
		        var currentArgs = toArray(arguments);
		        var combinedArgs = [];
		        var idx = -1;
		        while (++idx < n) {
		          var val = initialArgs[idx];
		          combinedArgs[idx] = (val === __ ? currentArgs.shift() : val);
		        }
		        return fn.apply(this, combinedArgs.concat(currentArgs));
		      });
		    }
		  });
	}
	/*
	* 自动科里化
	*(*->a)->(*->a)
	*/
	function curry(fn){
		return curryN(fn.length,fn);
	}

	//(a->b)->f a->f b
	var map=curry(function _map(fn,list){
		var r=[];
		for(var i=0;i<list.length;i++)r.push(fn(list[i]));
		return r;
	});

	//(a,b->a)->a->[b]->a
	var reduce=curry(function _reduce(fn,start,list){
		var r=start;
		for(var i=0;i<list.length;i++){
			r=fn(r,list[i]);
		}
		return r;
	});
	//(a,b->c)->[a]->[b]->[c]
	var zipWith=curry(function _zipWith(fn,arr1,arr2){
		var r=[];
		for (var i = 0; i < arr1.length; i++) {
			r.push(fn(arr1[i],arr2[i]));
		};
		return r;
	});
	//[a]->a
	function head(arr){
		return arr==null?null:arr[0];
	}
	//[a]->[a]
	function tail(arr){
		if(is(String,arr))return tail(arr.split("")).join("");
		var r=[];
		for(var i=1;i<arr.length;i++)r.push(arr[i]);
		return r;
	}
	function last(arr){
		if(arr==null)return null;
		return arr[arr.length-1];
	}
	var take=curry(function _take(n,arr){
		if(is(String,arr)) return take(n,arr.split("")).join("");
		var r=[];
		n=n<arr.length?n:arr.length;
		for(var i=0;i<n;i++){
			r.push(arr[i]);
		}
		return r;
	});
	var drop=curry(function _drop(n,arr){
		if(is(String,arr))return _drop(n,arr.split("")).join("");
		if(n<=0)return arr;
		return _drop(n-1,tail(arr));
	});
	var init=function(arr){
		return take(arr.length-1,arr);
	}
	var is = curry(function _is(Ctor, val) {
	  return val != null && val.constructor === Ctor || val instanceof Ctor;
	});
	var ifn = curry(function _ifn(test,truefn,falsfn){
		return function(a){
			if(test(a))return truefn(a);
			else return falsfn(a);
		}
	})
	var _isNumber = function _isNumber(x) {
        return Object.prototype.toString.call(x) === '[object Number]';
    };
	var range = function _range(from,to) {
        if (!(_isNumber(from) && _isNumber(to))) {
            throw new TypeError('Both arguments to range must be numbers');
        }
        var result = [];
        var n = from;
        while (n < to) {
            result.push(n);
            n += 1;
        }
        return result;
	}
	var isNil =function _isNil(a){
		return a===null||a===undefined;
	};
	var eq =curry(function _eq(a,b){
		return a===b;
	});
	function noteq(a,b){
		return a!==b;
	}
	function reverse(arr){
		if(is(String,arr)){
			return reverse(arr.split("")).join("");
		}
		var r=[];
		for(var i=arr.length-1;i>=0;i--)r.push(arr[i]);
		return r;
	}
	function pipe(){
		var args=arguments;
		return function(){
			var newargs=toArray(arguments);
			var first ={diqye:"first"};
			return reduce(function(acc,a){
				return a.apply(null,acc===first?newargs:[acc]);
			},first,args);
		}
	}
	function always(a){
		return function(){
			return a;
		}
	}
	var assoc=curry(function _assoc(prop, val, obj) {
		if (eq(obj[prop], val)) {
			return obj;
		}
		var result = ifn(is(Array),always([]),always({}))(obj);
		for (var p in obj) {
			result[p] = obj[p];
		}
		result[prop] = val;
		return result;
	});
	var path=curry(function _path(paths, obj) {
	  if (obj == null) {
	    return;
	  } else {
	    var val = obj;
	    for (var idx = 0, len = paths.length; idx < len && val != null; idx += 1) {
	      val = val[paths[idx]];
	    }
	    return val;
	  }
	});
	var assocPath=curry(function _assocPath(path, val, obj) {
	  switch (path.length) {
	    case 0:
	      return obj;
	    case 1:
	      return assoc(path[0], val, obj);
	    default:
	      return assoc(path[0], assocPath(tail(path), val, Object(obj[path[0]])), obj);
	  }
	});
	function cond(pairs) {
		return function() {
			var idx = -1;
			while (++idx < pairs.length) {
				if (pairs[idx][0].apply(this, arguments)) {
					return pairs[idx][1].apply(this, arguments);
				}
			}
		};
	}
	var concat=curry(function _concat(set1,set2){
		set1 = set1 || [];
		set2 = set2 || [];
		var idx;
		var len1 = set1.length;
		var len2 = set2.length;
		var result = [];

		idx = -1;
		while (++idx < len1) {
		result[result.length] = set1[idx];
		}
		idx = -1;
		while (++idx < len2) {
		result[result.length] = set2[idx];
		}
		return result;
	});
	function partial(fn,args){
		return function(){
			return fn.apply(null,concat(args,arguments));
		}
	}
	var filter = curry(function _filter(fn, list) {
		var idx = -1, len = list.length, result = [];
		while (++idx < len) {
		if (fn(list[idx])) {
		  result[result.length] = list[idx];
		}
		}
		return result;
	});
	var ufind = curry(function _ufind(fn,list){
		return head(filter(fn,list));
	})
	var findIdx=curry(function _findIdx(fn,list){
		for(var i=0;i<list.length;i++){
			if(fn(list[i]))return i;
		}
		return -1;
	});
	function complemtent(f){
		return function() {
		    return !f.apply(null, toArray(arguments));
		  };
	}
	function reject(fn,list){
		return filter(complemtent(fn),list);
	}
	function split(sep,str){
		return str.split(sep);
	}
	function join(sep,str){
		return str.join(sep);
	}
	var apply=curry(function _apply(fn,args){
		return fn.apply(null,args);
	});
	function ap(fns,datas){
		return reduce(function(acc,fn){
			return concat(acc,map(fn,datas));
		},[],fns);
	}
	function of(a){
		return [a];
	}
	var allPass=curry(function _allPass(cnds,obj){
		if(isEmpty(cnds))return true;
		if(head(cnds)(obj)) return allPass(tail(cnds),obj);
		return false;
	});
	var anyPass=curry(function _anyPass(cnds,obj){
		if(isEmpty(cnds))return false;
		if(head(cnds)(obj)) return true;
		return anyPass(tail(cnds),obj);
	});
	var all=curry(function _all(fn,vtests){
		if(isEmpty(vtests))return true;
		if(fn(head(vtests))) return all(fn,tail(vtests));
		return false;
	});

	function isEmpty(a){
		if(a==null)return false;
		if(a.length==0)return true;
		if(a=="")return true;
		return false;
	}
	function isEmptyObject(e){
		if(e === undefined) return !1;
		var t;  
		for (t in e)  
			return !1;  
		return !0
	}
	
	var trace=curry(function _trace(a,b){
		console.log(a+":"+b);
		return b;
	});

	function isNumber(obj){
		return typeof obj === 'number' && isFinite(obj);
	}

	function concats(arr){
		return reduce(function(acc,a){
			return concat(acc,a);
		},[],arr);
	}
	//快速排序
	function sort(comp,arr){
		if(isEmpty(arr)) return [];
		var headitem=head(arr);
		var tialitems=tail(arr);
		return concats([
			sort(comp,filter(partial(comp,[headitem]),tialitems)),
			headitem,
			sort(comp,reject(partial(comp,[headitem]),tialitems))]);
	}
	//聚合参数
	//(a->b....->c)->[(a1->a),(b1->b)...]
	var converge=curry(function _converge(fn,fns){
		return function(){
			var args=toArray(arguments);
			return apply(fn,map(apply(__,args),fns));
		}
	});
	var tap=curry(function _tap(fn,a){
		fn(a);
		return a;
	});
	function cbkpipe(){
		var oarg=arguments;
		return function(data){
			return apply(pipe,oarg)(data);
		}
	}
	function toPairs(obj){
		var pairs = [];
	  	for (var prop in obj) {
			pairs[pairs.length] = [prop, obj[prop]];
		}
	  return pairs;
	}
	function identity(a){return a}
	function fromPairs(pairs){
		var idx = -1, len = pairs.length, out = {};
		while (++idx < len) {
		  out[pairs[idx][0]] = pairs[idx][1];
		}
		return out;
	}
	var prop=curry(function _prop(name,data){
		return path([name],data);
	});
	var lte=curry(function _lt(a,b){
		return a<=b;
	});
	var gte=curry(function _lt(a,b){
		return a>=b;
	});
	var juxt=curry(function _juxt(fns,a){
		return map(apply(__,[a]),fns);
	});
	//持平数组
	var flatten=curry(function _flatten(list){
			return reduce(concat,[],map(ifn(is(Array),flatten,of),list));
	});
	function once(fn){
		var called=false;
		var result=null;
		return function(){
			if(called)return result;
			var args=toArray(arguments);
			result = apply(fn,args);
			called = true;
			return result;
		}
	}

    var add=curry(function _add(a, b) {
        return Number(a) + Number(b);
    })
    var inc = add(1);

	exports.util={
		__:__,
        add:add,
        inc:inc,
		once:once,
		drop:drop,
		lte:lte,
		juxt:juxt,
		gte:gte,
		toArray:toArray,
		map:map,
		range:range,
		flatten:flatten,
		reduce:reduce,
		pipe:pipe,
		ifn:ifn,
		when:ifn(__,__,always(null)),
		identity:identity,
		is:is,
		curry:curry,
		head:head,
		tail:tail,
		tap:tap,
		isNil:isNil,
		allPass:allPass,
		anyPass:anyPass,
		all:all,
		last:last,
		converge:converge,
		eq:eq,
		prop:prop,
		zipWith:zipWith,
		reverse:reverse,
		path:path,
		assoc:assoc,
		concat:concat,
		isEmpty:isEmpty,
		isEmptyObject:isEmptyObject,
		isNumber:isNumber,
		trace:trace,
		assocPath:assocPath,
		partial:partial,
		always:always,
		split:curry(split),
		join:curry(join),
		filter:filter,
		noteq:curry(noteq),
		apply:apply,
		ap:curry(ap),
		concats:concats,
		reject:curry(reject),
		complemtent:complemtent,
		of:of,
		cbkpipe:cbkpipe,
		fromPairs:fromPairs,
		toPairs:toPairs,
		take:take,
		init:init,
		cond:cond,
		findIdx:findIdx,
		T:always(true),
		F:always(false),
		find:ufind,
		sort:curry(sort)
	};
/**************监控部分************************/

exports.util_watch=(function(){
	var obj={};
	exports.watchobj=obj;
	var watch = curry(function(type,name,fn){
		if(obj[type]==null)obj[type]={};
		var typeobj=obj[type];
		if(typeobj[name]==null)typeobj[name]=[];
		typeobj[name].push(fn);
	});
	var watchOnce = curry(function(type,name,fn){
		fn.__once=true;
		return watch(type,name,fn);
	});
	var watchDSL=curry(function(type,dsl){
		return pipe(map(concat([type])),map(apply(function(a,b,c){
			var namedsl=b.split("$");
			if(namedsl[0]=="once") return watchOnce(a,namedsl[1],c);
			return watch(a,b,c);
		})))(toPairs(dsl));
	});
	var emit = curry(function(type,name,arg){
		if(obj[type]==null)return;
		if(obj[type][name]==null)return;
		obj[type][name]=filter(function(itemfn){
			itemfn(arg);
			if(itemfn.__once)return false;
			return true;
		},obj[type][name]);
	});
	return {
		watch:watch,
		watchOnce:watchOnce,
		emit:emit,
		watchDSL:watchDSL
	}
}());
/**************业务组件部分********************/	
	function hoverUp(div){
		var timer=null;
		return function(div2,fn){
			div.hover(function(){
				clearTimeout(timer);
				div2.show();
				if(fn)fn();
			},function(){
				timer=setTimeout(function(){
					div2.hide();
				},500);
			})
		}
	}

	function hoverUpBy(div,fn){
		hoverUp(div)(fn(div));
	}
	function hoverUpBySelector(div,selector){
		hoverUpBy(div,function(div){return div.find(selector)});
	}
	function setVal(div,val){
		div.attr("value",val);
	}
	function setAttr(name,value,div){
		return div.attr(name,value);
	}
	function addClass(clazz,div){
		return div.addClass(clazz);
	}
	function removeClass(clazz,div){
		return div.removeClass(clazz);
	}
	function jqis(selector,div){
		return div.is(selector);
	}
	function show(div){
		return div.show();
	}
	function hide(div){
		return div.hide();
	}
	function cbk(div,fn){
		return function(){
			fn(div);
		}
	}
	function jq(fn){
		return function(){
			var div=$(this);
			fn(div);
		}
	}
	function find(selector,div){
		return div.find(selector);
	}
	function attr(name,div){
		return div.attr(name);
	}
	function attrs(names,div){
		return map(function(name){
			return div.attr(name);
		},names);
	}
	function checkbox(chosefn,unchosefn,el){
		return el.on("click",function(){
			if(el.find(".checkbox_chose,.checkboxs").is(".checkboxs")){
				el.find(".checkbox_chose,.checkboxs").removeClass("checkboxs").addClass("checkbox_chose");
				chosefn(el);
			}else if(el.find(".checkbox_chose,.checkboxs").is(".checkbox_chose")){
				el.find(".checkbox_chose,.checkboxs").removeClass("checkbox_chose").addClass("checkboxs");
				unchosefn(el);
			}
		});
	}
	function gtip(el){
		var tipval=el.attr("g-tip");
		var tipfor=el.find("[g-tip-for="+tipval+"]");
		if(tipfor.size()==0)tipfor=el.siblings("[g-tip-for="+tipval+"]");
		return el.hover(function(){
			tipfor.show();
		},function(){
			tipfor.hide();
		});
	}
	function gradioGp(fn,el){
		var radios=el.find("[g-radio]");
		radios.each(function(){
			var radio=$(this);
			radio.on("click",function(){
				radios.find(".radio_chose,.radio").removeClass("radio_chose").addClass("radio");
				radio.find(".radio_chose,.radio").removeClass("radio").addClass("radio_chose");
				fn(radio);
			});
		})
	}
	function gbtnGp(fn,el){
		var btns=el.find("[g-btn]");
		btns.on("click",function(){
			var btn=$(this);
			btns.removeClass("bd").addClass("bd1").find(".chose_icon").hide();
			btn.removeClass("bd1").addClass("bd").find(".chose_icon").show();
			fn(btn);
		})
	}
	function jqpipe(){
		return jq(pipe.apply(null,toArray(arguments)));
	}
	function searForm(div){
		var obj={};
		var objs=div.find("[name]");
		objs.each(function(){
			var el=$(this);
			var name=el.attr("name");
			var value;
			if(el.is("input"))value=el.val();
			else value=el.attr("value");
			obj[name]=value;
		});
		return obj
	}
	function toggle(el){
		return el.toggle();
	}
	function toggleClass(clzz,el){
		return el.toggleClass(clzz);
	}
	function gvaluePath(el){
		return el.attr("g-value-path").split(",");
	}
	function gpath(el){
		return el.attr("g-path").split(",");
	}
	function gvalue(el){
		return el.attr("g-value");
	}
	function geval(name,args,scope){
		var fn=scope[name]||exports.util_ui[name];
		return apply(fn,args);
	}

	function documentclickhide(div){
		// $(document).on("click",function(e){
		// 	debugger;
		// });
	}
	function gpipe(div,scope){
		function _geval(self,str){
			var aval=str.split(" ");
			var name=head(aval);
			var args=map(function(a){
				if(/^\[.*\]$/.test(a)) return div.find(a);
				if(a=="this")return self;
				return a;
			},tail(aval));
			geval(name,args,scope);
		}
		function _gevals(str,self){
			map(partial(_geval,[self]),str.split(","));
		}
		div.find("[g-click]").off('click').on("click",function(){
			_gevals($(this).attr("g-click"),$(this));
		});
		div.find("[g-keyup]").on("keyup",function(){
			_gevals($(this).attr("g-keyup"),$(this));
		})
		div.find("[g-blur]").on("blur",function(){
			_gevals($(this).attr("g-blur"),$(this));
		})
		return div;
	}
	function gpipes(div,scope){
		return div.find("[g-pipe]").each(function(){
			gpipe($(this),scope);
		});
	}
	
	//延迟ms毫秒执行函数
	function delay(ms,fn,args,timeid){
		clearTimeout(timeid);
		return setTimeout(function(){
			args=args==null?[]:args;
			fn.apply(null,args);
		},ms);
	}

	var notEqNullorEmptyFilter=filter(function(a){
		return a[1]!=null&&a[1]!="";
	});
	var filterNullOrEmptyObj=pipe(toPairs,notEqNullorEmptyFilter,fromPairs);
	function redir(src){
		window.location.href=src;
	}
	exports.util_ui={
		hoverUp:hoverUp,
		hoverUpBy:hoverUpBy,
		hoverUpBySelector:curry(hoverUpBySelector),
		addClass:curry(addClass),
		removeClass:curry(removeClass),
		show:show,
		hide:hide,
		toggle:toggle,
		attr:curry(attr),
		attrs:curry(attrs),
		setVal:setVal,
		jq:jq,
		is:curry(jqis),
		jqpipe:jqpipe,
		documentclickhide:documentclickhide,
		cbk:cbk,
		gpath:gpath,
		gvaluePath:gvaluePath,
		gvalue:gvalue,
		gtip:gtip,
		toggleClass:curry(toggleClass),
		gpipes:gpipes,
		gradioGp:curry(gradioGp),
		gbtnGp:curry(gbtnGp),
		checkbox:curry(checkbox),
		delay:curry(delay),
		setAttr:curry(setAttr),
		find:curry(find),
		searForm:searForm,
		redir:redir,
		filterNullOrEmptyObj:filterNullOrEmptyObj
	}
}(this);