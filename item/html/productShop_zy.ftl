<!DOCTYPE html>
<html lang="zh-CN">
<head>
<#if page?? && page.prdInfo??>
    <#assign prdInfo=page.prdInfo!>
    <#assign fmtPrice=page.fmtPrice!>
    <#if !(page?? && page.merchantInfo??)>
        <#assign iSupport='true'>  
    </#if>
{%widget name="global_head"%}
<@global_head title="${page.title!}" keyword="${page.keywords!}" description="${page.description!}" applicable="pc" canonical="//item${storeConfiguration.cookieDomain!}/${(prdInfo.productId)!}-${(prdInfo.skuId)!}.html" alternate="//item.m${storeConfiguration.cookieDomain!}/product-${(prdInfo.productId)!}-${(prdInfo.skuId)!}.html" dns=['img','img1','img3','img4','gfs2','gfs3','gfs13','css','js','app'] prop="${prdInfo.goodsImgs[0].src}"/>
<!--# include virtual="/n/common/global/global.html"-->
<link rel="stylesheet" href="<!--#include virtual='/n/common/a05/style.html'-->">
<link rel="stylesheet" href="/css/common.css">
<link rel="stylesheet" href="/css/breadcrumb.css">
<link rel="stylesheet" href="/css/gcity.css">
<link rel="stylesheet" href="/css/product.css">
<link rel="stylesheet" href="/css/prd-praise-goods.css">
<link rel="stylesheet" href="/css/prd-firstscreen-right.css">
<link rel="stylesheet" href="/css/dialogBox.css">
<link rel="stylesheet" href="/css/gmagnifier.css">
<link rel="stylesheet" type="text/css" href="/css/telecom.css">
<link rel="stylesheet" type="text/css" href="gmlib/ui/gphotoviewer/1.0.0/gphotoviewer.min.css">
<link rel="stylesheet" type="text/css" href="/css/prd_appraise5.css">
<link rel="stylesheet" type="text/css" href="/css/prd_bottm_details.css">
<link rel="stylesheet" type="text/css" href="/css/prd_center1_matchCompare.css">
<link rel="stylesheet" type="text/css" href="/css/prd_down_right.css">
<link rel="stylesheet" href="/css/suits.css">
<#include "prdInfo.ftl" />
<script src="<!--#include virtual='/n/common/a05/script.html'-->"></script>
<script src="gmlib/unit/observer/observer.min.js"></script>
<script src="gmlib/unit/gtime/1.0.0/gtime.min.js"></script>
<script src="gmlib/ui/gautonum/1.0.0/gautonum.min.js"></script>
<script src="gmlib/ui/gslider/1.0.5/gslider.min.js"></script>
<script src="gmlib/ui/gloadsrc/jquery.loadsrc.min.js"></script>
<script src="gmlib/ui/gload/1.0.0/gload.min.js"></script>
<script src="gmlib/ui/tabs/1.0.0/tabs.min.js"></script>
<script src="gmlib/ui/gtabs/1.0.0/gtabs.min.js"></script>
<script src="gmlib/unit/live800/3.0.0/live800.min.js"></script>
<script src="/js/item/sea.js"></script>
<script src="gmlib/unit/g/1.0.0/g.min.js"></script>
<script src="/js/item/base.js"></script>
<script src="gmlib/ui/gfixscroll/1.0.0/gfixscroll.min.js"></script>
<script src="gmlib/ui/groate/1.0.0/groate.min.js"></script>
<script src="/js/prd_shop.js"></script>
<script src="/js/jquery.gCarousel.js"></script>
<script src="/js/store_p.js"></script>
<script src="/js/store_yq.js"></script>
<script src="/js/changgood.js"></script>
<script src="/js/prdinit.js"></script>
<script src="/js/item/gmenergy.js"></script>
<script src="/js/item/rltprd.js"></script>
<script src="/js/prdJsLoad.js"></script>
<script src="gmlib/unit/gcontrast/1.0.0/gcontrast.min.js"></script>
<script src="gmlib/unit/scodecommon/1.0.0/scodecommon.min.js"></script>
<script src="/js/item/maima.js"></script>
</head>
<body class="de">
 <!--#include virtual="/n/common/a05/head.html"-->
     <#if page?? && page.flagshipShop?? && page.flagshipShop.shopId??>
        <!--#include virtual="/n/common/bfs/${(page.flagshipShop.shopId)!}/header.html"-->
     </#if>
 <#include "product_main.ftl" />
 <#include "product_info/product_infoMain.ftl" />
 <!--#include virtual="/n/common/a05/foot.html"-->
 <!--#include virtual="/n/common/a05/aside.html"-->
 <#else>
 	数据有问题， 找袁野
 </#if>
<script type="text/javascript">
var winWidth = window.screen.width,objb = document.body;if (winWidth<=1024) {objb.className += " " +"w990"; }else {objb.className=objb.className.replace("w990", '');}; 
/*推送页面给百度！*/
setTimeout(function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }else {
        bp.src = '//push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
},6000);
</script>
 </body>
 </html>