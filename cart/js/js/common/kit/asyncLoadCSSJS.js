;(function(exports){
	function documentHead(){
        return document.getElementsByTagName("head")[0];
    }
	function loadCss(src,fn){
        var node=document.createElement('link');
        node.rel='stylesheet';
        node.href=src;
        documentHead().insertBefore(node,documentHead().firstChild);
        if(node.attachEvent){
            node.attachEvent('onload', function(){fn(null,node)});
        }else{
           setTimeout(function() {
             poll(node, fn);
           }, 0); // for cache
        }
        function poll(node,callback){
            var isLoaded = false;
            if(/webkit/i.test(navigator.userAgent)) {//webkit
                if (node['sheet']) {
                    isLoaded = true;
                  }
            }else if(node['sheet']){// for Firefox
                try{
                    if (node['sheet'].cssRules) {
                          isLoaded = true;
                    }
                  }catch(ex){
                    // NS_ERROR_DOM_SECURITY_ERR
                    if (ex.code === 1000) {
                         isLoaded = true;
                    }
                }
            }
            if(isLoaded){
                setTimeout(function(){
                    callback(null,node);
                },1);
            }else{
                setTimeout(function(){
                    poll(node,callback);
                },10);
            }
        }
        node.onLoad=function(){
            fn(null,node);
        }
    }
    function loadScript(src,fn){
        var node = document.createElement("script");
        node.setAttribute('async','async');
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
                fn(null,node);
            }
        }
        documentHead().insertBefore(node, documentHead().firstChild);
        node.src=src;
        node.onerror=function(e){
            fn(e);
        }
    }
	exports.asyncLoadCSSJS={
		loadCSS:loadCss,
		loadJS:loadScript
	}
}(this));