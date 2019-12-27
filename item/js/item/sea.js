;(function(exports){
	var sea={};
	var dochead = document.head = document.head || document.getElementsByTagName('head')[0];
	//遍历 并列执行 结果反馈给回调
	function map1(arr, fn, call) {
	        if (!arr || arr.length == 0) call();
	        if (Object.prototype.toString.call(arr) === '[object Array]') {
	            var rs = [],
	                rerr = null,
	                num = 1;
	            for (var i = 0, l = arr.length; i < l; i++) {
	                ! function (t, i) {
	                    fn(function (err, res) {
	                        if (err) rerr = err;
	                        else rs[i] = res;
	                        if (num++ == l) call(rerr, rs);
	                    }, t, i);
	                }(arr[i], i)
	            }
	        } else if (Object.prototype.toString.call(arr) === '[object Object]') {
	            var keys = [],
	                num = 1,
	                rs = {},
	                rerr = null;
	            for (var key in arr) keys.push(key);
	            for (var key in arr) {
	                ! function (t, key) {
	                    fn(function (err, res) {
	                        if (err) rerr = err;
	                        else rs[key] = res;
	                        if (num++ == keys.length) call(rerr, rs);
	                    }, t, key);
	                }(arr[key], key)
	            }
	        }
	    };

	    function loadScript(src, fn) {

	    	var node = document.createElement("script");
	    	node.setAttribute('async', 'async');
	    	var timeID
	    	var supportLoad = "onload" in node
	    	var onEvent = supportLoad ? "onload" : "onreadystatechange"
	    	node[onEvent] = function onLoad() {
	    		if (!supportLoad && !timeID && /complete|loaded/.test(node.readyState)) {
	    			timeID = setTimeout(onLoad)
	    			return
	    		}
	    		if (supportLoad || timeID) {
	    			clearTimeout(timeID)
	    			fn(null, node);
	    		}
	    	}
	    	dochead.insertBefore(node, dochead.firstChild);
	    	node.src = src;
	    	node.onerror = function (e) {
	    		fn(e);
	    	}
	    }
	sea.config=function(cookiedomain){
		if(cookiedomain){
			this.cookiedomain=cookiedomain;
		};
	};
	sea.use=function(arr,callback){
		var url="";
		var arr=arr;
		if(this.cookiedomain){
			url=this.cookiedomain;
			for(var i=0,k=arr.length; i<k; i++){
				url+=arr[i]+',';
			};
			arr.length=0;
			arr.push(url.substring(0,url.length-1));
		};
		map1(arr,function(next, t, i){
			loadScript(t,function(){
				callback && callback();
			});
		},function(err, rs){
			console.log(err);
		});
	

	};
	exports.seajs=sea;
})(this);