var GTPL={}
$.extend({
	encode: function( text ) {
		return ("" + text).split("<").join("&lt;").split(">").join("&gt;").split('"').join("&#34;").split("'").join("&#39;");
	}
})

GTPL.box1=function(data){ var $fn=function (jQuery,$item
/**/) {
var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('');if((typeof(list.length)!=='undefined' && (list.length)!=null) && (typeof(list.length)==='function'?(list.length).call($item):(list.length))){__.push('   <div class="box-header clearfix">          <h3>');if(typeof(title)!=='undefined' && (title)!=null){__.push($.encode((typeof(title)==='function'?(title).call($item):(title))));}__.push('</h3>          <div class="box-jindu">              <div class="jd" idx="1"></div>              <div class="jd select" idx="2"></div>              <div class="jd" idx="3"></div>          </div>      </div>      <div class="box-body clearfix">       ');if(typeof(list)!=='undefined' && (list)!=null){$.each((typeof(list)==='function'?(list).call($item):(list)),function($index, $value){with(this){__.push('     <div class="item fl item-');if(typeof($index)!=='undefined' && ($index)!=null){__.push($.encode((typeof($index)==='function'?($index).call($item):($index))));}__.push('">      <div class="img">       <a href="');if(typeof(purl)!=='undefined' && (purl)!=null){__.push($.encode((typeof(purl)==='function'?(purl).call($item):(purl))));}__.push('" class="pr">        <img src="');if(typeof(iurl)!=='undefined' && (iurl)!=null){__.push($.encode((typeof(iurl)==='function'?(iurl).call($item):(iurl))));}__.push('" alt="');if(typeof(pn)!=='undefined' && (pn)!=null){__.push($.encode((typeof(pn)==='function'?(pn).call($item):(pn))));}__.push('" class="animated fadeIn">        <p class="overlayer"></p>       </a>      </div>      <div class="title">       <a href="');if(typeof(purl)!=='undefined' && (purl)!=null){__.push($.encode((typeof(purl)==='function'?(purl).call($item):(purl))));}__.push('">');if(typeof(pn)!=='undefined' && (pn)!=null){__.push($.encode((typeof(pn)==='function'?(pn).call($item):(pn))));}__.push('</a>      </div>      <div class="price">       ¥');if(typeof(price)!=='undefined' && (price)!=null){__.push($.encode((typeof(price)==='function'?(price).call($item):(price))));}__.push('      </div>      <div class="bottom">       <a href="javascript:void 0"       class="btn btn-default"       sid="');if(typeof(sid)!=='undefined' && (sid)!=null){__.push($.encode((typeof(sid)==='function'?(sid).call($item):(sid))));}__.push('"       pid="');if(typeof(pid)!=='undefined' && (pid)!=null){__.push($.encode((typeof(pid)==='function'?(pid).call($item):(pid))));}__.push('"       skuMappingSuit = "');if(typeof(skuMappingSuit)!=='undefined' && (skuMappingSuit)!=null){__.push($.encode((typeof(skuMappingSuit)==='function'?(skuMappingSuit).call($item):(skuMappingSuit))));}__.push('"       add-cart="');if(typeof($index)!=='undefined' && ($index)!=null){__.push($.encode((typeof($index)==='function'?($index).call($item):($index))));}__.push('"        maima_param="');if(typeof(maima_param)!=='undefined' && (maima_param)!=null){__.push($.encode((typeof(maima_param)==='function'?(maima_param).call($item):(maima_param))));}__.push('">        <i class="c-i cartsuc_gray"></i>        <i class="c-i cartsuc_white"></i>        <span>         加入购物车        </span>       </a>      </div>     </div>    ');}});}__.push('    <div class="left-action" left>     &lt;    </div>    <div class="right-action" right>     &gt;    </div>      </div>  ');}__.push('');}return __;
};return $fn($,{data:data||{}}).join('')};

GTPL.iteninfo=function(data){ var $fn=function (jQuery,$item
/**/) {
var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('<div class="item-info-body clearfix">   <div class="msg">    <i class="c-i add-cart-success"></i>商品已成功加入购物车！   </div>    <div class="fl">    <div class="clearfix">     <a href="');if(typeof(item.itemURL)!=='undefined' && (item.itemURL)!=null){__.push($.encode((typeof(item.itemURL)==='function'?(item.itemURL).call($item):(item.itemURL))));}__.push('" class="imgLink fl">      <img width="50" height="50" src="');if(typeof(item.itemImageURL)!=='undefined' && (item.itemImageURL)!=null){__.push($.encode((typeof(item.itemImageURL)==='function'?(item.itemImageURL).call($item):(item.itemImageURL))));}__.push('">     </a>     <div class="imgContent fl">      <p><a href="');if(typeof(item.itemURL)!=='undefined' && (item.itemURL)!=null){__.push($.encode((typeof(item.itemURL)==='function'?(item.itemURL).call($item):(item.itemURL))));}__.push('" class="title text-overflow" title="');if(typeof(item.itemName)!=='undefined' && (item.itemName)!=null){__.push($.encode((typeof(item.itemName)==='function'?(item.itemName).call($item):(item.itemName))));}__.push('" target="_blank">');if(typeof(item.itemName)!=='undefined' && (item.itemName)!=null){__.push($.encode((typeof(item.itemName)==='function'?(item.itemName).call($item):(item.itemName))));}__.push('</a></p>      <p>       ');if((typeof(item.salesPropertyVOs && item.salesPropertyVOs.length)!=='undefined' && (item.salesPropertyVOs && item.salesPropertyVOs.length)!=null) && (typeof(item.salesPropertyVOs && item.salesPropertyVOs.length)==='function'?(item.salesPropertyVOs && item.salesPropertyVOs.length).call($item):(item.salesPropertyVOs && item.salesPropertyVOs.length))){__.push('       ');if(typeof(item.salesPropertyVOs)!=='undefined' && (item.salesPropertyVOs)!=null){$.each((typeof(item.salesPropertyVOs)==='function'?(item.salesPropertyVOs).call($item):(item.salesPropertyVOs)),function(i, salesProperty){with(this){__.push('        ');if((typeof(i<2)!=='undefined' && (i<2)!=null) && (typeof(i<2)==='function'?(i<2).call($item):(i<2))){__.push('         <span>');if(typeof(salesProperty.labelKey)!=='undefined' && (salesProperty.labelKey)!=null){__.push($.encode((typeof(salesProperty.labelKey)==='function'?(salesProperty.labelKey).call($item):(salesProperty.labelKey))));}__.push('：');if(typeof(salesProperty.labelVal)!=='undefined' && (salesProperty.labelVal)!=null){__.push($.encode((typeof(salesProperty.labelVal)==='function'?(salesProperty.labelVal).call($item):(salesProperty.labelVal))));}__.push('</span>        ');}__.push('       ');}});}__.push('       ');}__.push('       <span>数量：');if(typeof(item.quantity)!=='undefined' && (item.quantity)!=null){__.push($.encode((typeof(item.quantity)==='function'?(item.quantity).call($item):(item.quantity))));}__.push('</span>      </p>     </div>    </div>   </div>   <div class="mt15 fr">    <a defurl="');if(typeof(item.itemURL)!=='undefined' && (item.itemURL)!=null){__.push($.encode((typeof(item.itemURL)==='function'?(item.itemURL).call($item):(item.itemURL))));}__.push('" id="idGoBack" class="cart-success-btn btn-default40" style="margin-right:7px;">返回</a>    <a href="//cart');if(typeof(cookieDomain)!=='undefined' && (cookieDomain)!=null){__.push($.encode((typeof(cookieDomain)==='function'?(cookieDomain).call($item):(cookieDomain))));}__.push('/home/cart" class="cart-success-btn btn-primary40">我的购物车<em class="c-i arrowRight-white"></em></a>   </div>  </div>');}return __;
};return $fn($,{data:data||{}}).join('')};

GTPL.comp_alert=function(data){ var $fn=function (jQuery,$item
/**/) {
var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('<div class="g-panel box-sd2">   ');if((typeof(close)!=='undefined' && (close)!=null) && (typeof(close)==='function'?(close).call($item):(close))){__.push('   <i class="c-i closebtn-new fr" g-panel-close></i>   ');}__.push('   <div class="body">    <div class="icon i-block">     <i class="c-i panel-');if(typeof(type)!=='undefined' && (type)!=null){__.push($.encode((typeof(type)==='function'?(type).call($item):(type))));}__.push('"></i>    </div>    <div class="content i-block">     ');if(typeof(body)!=='undefined' && (body)!=null){__.push((typeof(body)==='function'?(body).call($item):(body)));}__.push('    </div>    ');if((typeof($data.code)!=='undefined' && ($data.code)!=null) && (typeof($data.code)==='function'?($data.code).call($item):($data.code))){__.push('         <div class="errorCode">[');if(typeof($data.code)!=='undefined' && ($data.code)!=null){__.push($.encode((typeof($data.code)==='function'?($data.code).call($item):($data.code))));}__.push(']</div>    ');}__.push('    <div class="i-block" style="vertical-align: middle;width:1px;min-height:1px;"></div>   </div>  </div>');}return __;
};return $fn($,{data:data||{}}).join('')};

GTPL.comp_alertWar=function(data){ var $fn=function (jQuery,$item
/**/) {
var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('<div class="g-panel box-sd2">   ');if((typeof(close)!=='undefined' && (close)!=null) && (typeof(close)==='function'?(close).call($item):(close))){__.push('   <i class="c-i closebtn-new fr" g-panel-close></i>   ');}__.push('   <div class="body">    <div class="icon i-block" style="vertical-align: top;">     <i class="c-i panel-');if(typeof(type)!=='undefined' && (type)!=null){__.push($.encode((typeof(type)==='function'?(type).call($item):(type))));}__.push('"></i>    </div>    <div class="content i-block">     ');if(typeof(body)!=='undefined' && (body)!=null){__.push((typeof(body)==='function'?(body).call($item):(body)));}__.push('    </div>    ');if((typeof($data.code)!=='undefined' && ($data.code)!=null) && (typeof($data.code)==='function'?($data.code).call($item):($data.code))){__.push('         <div class="errorCode">[');if(typeof($data.code)!=='undefined' && ($data.code)!=null){__.push($.encode((typeof($data.code)==='function'?($data.code).call($item):($data.code))));}__.push(']</div>    ');}__.push('    <div class="i-block" style="vertical-align: middle;width:1px;min-height:1px;"></div>   </div>  </div>');}return __;
};return $fn($,{data:data||{}}).join('')};

GTPL.comp_biz001=function(data){ var $fn=function (jQuery,$item
/**/) {
var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('<div class="g-panel box-sd2 gpanel-biz001">   <div class="body">    <div class="icon i-block">     <i class="c-i order_waring"></i>    </div>    <div class="content i-block">     <h4>所有说您订单异常要退款的都是大骗子！！！</h4>     <p>当有人以订单异常为由通知您需要退款，就算他有您的各类相关信息，无论他是以电话、短信、QQ、微信、邮件等任何形式通知您，他都是骗子、骗子、大骗子......</p>     <div class="btns">      <a      g-panel-close      href="javascript:void(0)"       class="btn btn-disabled">       知道了，我不会理骗子的！      </a>     </div>    </div>        <div class="foolter">     <b>特别提醒！！！</b>国美不会通过电话、短信、QQ、微信、邮件等各类形式以订单异常为由通知您需要退款。此类行为均为诈骗！请认准官方电话 4008-708-708（或010-58851777）    </div>   </div>  </div>');}return __;
};return $fn($,{data:data||{}}).join('')};

GTPL.comp_confirm=function(data){ var $fn=function (jQuery,$item
/**/) {
var $=jQuery,call,__=[],$data=$item.data;with($data){__.push('<div class="g-panel box-sd2 confirm">   ');if((typeof(util.is)!=='undefined' && (util.is)!=null) && util.is(Function,close)){__.push('    <i class="c-i closebtn-new fr" g-panel-close></i>   ');}__.push('   <div class="body">    ');if((typeof(util.is)!=='undefined' && (util.is)!=null) && util.is(Function,body)){__.push('     ');if(typeof(body)!=='undefined' && (body)!=null){__.push((body).call($item));}__.push('    ');}else if((true) && true){__.push('    <div class="icon i-block">     <i class="c-i panel-');if(typeof(type)!=='undefined' && (type)!=null){__.push((typeof(type)==='function'?(type).call($item):(type)));}__.push('"></i>    </div>    <div class="content i-block">     ');if((typeof(title)!=='undefined' && (title)!=null) && (typeof(title)==='function'?(title).call($item):(title))){__.push('     <h1>');if(typeof(title)!=='undefined' && (title)!=null){__.push((typeof(title)==='function'?(title).call($item):(title)));}__.push('</h1>     ');}__.push('     ');if(typeof(body)!=='undefined' && (body)!=null){__.push((typeof(body)==='function'?(body).call($item):(body)));}__.push('    </div>    <div class="i-block" style="vertical-align: middle;width:1px;min-height:1px;"></div>    ');}__.push('   </div>   ');if((typeof(btns.length>0)!=='undefined' && (btns.length>0)!=null) && (typeof(btns.length>0)==='function'?(btns.length>0).call($item):(btns.length>0))){__.push('   <div class="btns">    ');if(typeof(btns)!=='undefined' && (btns)!=null){$.each((typeof(btns)==='function'?(btns).call($item):(btns)),function($index, $value){with(this){__.push('     <a     g-btn-path="btns,');if(typeof($index)!=='undefined' && ($index)!=null){__.push($.encode((typeof($index)==='function'?($index).call($item):($index))));}__.push('"      href="javascript:void(0)"      class="');if(typeof(clazz)!=='undefined' && (clazz)!=null){__.push($.encode((typeof(clazz)==='function'?(clazz).call($item):(clazz))));}__.push('">      ');if(typeof(btnName)!=='undefined' && (btnName)!=null){__.push((typeof(btnName)==='function'?(btnName).call($item):(btnName)));}__.push('     </a>    ');}});}__.push('   </div>   ');}__.push('  </div>');}return __;
};return $fn($,{data:data||{}}).join('')};