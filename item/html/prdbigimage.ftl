<!DOCTYPE html>
<html lang="zh-CN">
<head>
<#if page?? && page.prdInfo??>
    <#assign prdInfo=page.prdInfo!>
    <#assign fmtPrice=page.fmtPrice!>
	{%widget name="global_head"%}
	<@global_head title="${page.title!}" keyword="${page.keywords!}" description="${page.description!}" applicable="pc" canonical="//item${storeConfiguration.cookieDomain!}/bigimage/${(prdInfo.productId)!}-${(prdInfo.skuId)!}.html" alternate="//item.m${storeConfiguration.cookieDomain!}/viewimage-${(prdInfo.productId)!}-${(prdInfo.skuId)!}.html" dns=['img','img1','img3','img4','gfs2','gfs3','gfs13','css','js','app'] prop=""/>
	<!--# include virtual="/n/common/global/global.html"-->
	<link rel="stylesheet" href="<!--#include virtual='/n/common/a02/style.html'-->">
	<link rel="stylesheet" type="text/css" href="/css/prdbigimg.css">
	<#include "prdInfo.ftl" />
	<script src="<!--#include virtual='/n/common/a02/script.html'-->"></script>
	<script src="gmlib/unit/g/1.0.0/g.min.js"></script>
	<script src="/js/item/base.js"></script>
	<script src="gmlib/ui/gloadsrc/jquery.loadsrc.min.js"></script>
	<script src="gmlib/ui/gload/1.0.0/gload.min.js"></script>
	<script src="gmlib/ui/gslider/1.0.4/gslider.min.js"></script>
	<script src="gmlib/ui/groll/1.0.0/groll.min.js"></script>
	<script src="gmlib/unit/cart/1.0.0/addCart.min.js"></script>
	<script src="gmlib/unit/bigdata/1.0.0/bigdata.min.js"></script>
	<script src="gmlib/unit/scodecommon/1.0.0/scodecommon.min.js"></script>
	<script src="/js/prdbigimg.js"></script>
</head>
<body class="w990 prdbigimg">
	<!--#include virtual="/n/common/a02/head.html"-->
	<#include "prdbig_main.ftl" />
<#else>
	数据有问题， 找袁野
</#if>
<script>
    (function(){
        var bp = document.createElement('script');
        var curProtocol = window.location.protocol.split(':')[0];
        if (curProtocol === 'https') {
            bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
        }
        else {
            bp.src = 'http://push.zhanzhang.baidu.com/push.js';
        }
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(bp, s);
    })();
</script>
</body>
</html>