var GTPL={}
$.extend({
	encode: function( text ) {
		return ("" + text).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
	}
})

GTPL.cartList=null;

GTPL.emptyCart=function(data){ var $fn=function (jQuery,$item
/**/) {
var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('<div carttype="asidecart"  id="csEmptyMessage" class="noshop">   ');if((typeof(isUpCart)!=='undefined' && (isUpCart)!=null) && (typeof(isUpCart)==='function'?(isUpCart).call($item):(isUpCart))){__.push('          <a data-code="cart01002" href="//cart\'+ cookieDomain + \'/" title="去购物车" style="text-decoration:underline;">购物车</a>      ');}else if((true) && true){__.push('          <a data-code="cart01001" href="//cart\'+ cookieDomain + \'/" title="去购物车" style="text-decoration:underline;">购物车</a>      ');}__.push('      中还没有商品，赶紧选购吧！  </div>');}return __;
};return $fn($,{data:data||{}}).join('')};