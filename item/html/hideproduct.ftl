<!DOCTYPE html>
<html lang="zh-CN">
<#assign urlSite = storeConfiguration.dynSite+storeConfiguration.storeSite>
<#assign urlStic = storeConfiguration.staSite+storeConfiguration.storeSite>
<#assign imgsbmg = storeConfiguration.imageserver>
<#assign imgslod = imgsbmg+"/grey.gif">
<#if page?? && page.prdInfo??>
    <#assign prdInfo=page.prdInfo!>
    <#assign fmtPrice=page.fmtPrice!>
    {%widget name="global_head"%}
    <@global_head title="${page.title!}" keyword="${page.keywords!}" description="${page.description!}" applicable="pc" canonical="//item${storeConfiguration.cookieDomain!}/${(prdInfo.productId)!}-${(prdInfo.skuId)!}.html" alternate="//m${storeConfiguration.cookieDomain!}/product-${(prdInfo.productId)!}-${(prdInfo.skuId)!}.html" dns=['img','img1','img3','img4','css','js','app'] prop=""/>
    <head>
    <!--# include virtual="/n/common/global/global.html"-->
    <link rel="stylesheet" href="<!--#include virtual='/n/common/a02/style.html'-->">
    <link rel="stylesheet" href="/css/common.css">
    <link rel="stylesheet" href="/css/breadcrumb.css">
    <link rel="stylesheet" href="/css/product.css">
    <link rel="stylesheet" href="/css/product-ie.css">
    <link rel="stylesheet" href="/css/w990-product.css">
    <link rel="stylesheet" href="/css/w990-product-ie.css">
    <link rel="stylesheet" href="/css/dialogBox.css">
    <link rel="stylesheet" href="/css/gmagnifier.css">
    <link rel="stylesheet" type="text/css" href="/css/telecom.css">
    <link rel="stylesheet" type="text/css" href="gmlib/ui/gphotoviewer/1.0.0/gphotoviewer.min.css">
    <link rel="stylesheet" type="text/css" href="/css/prd_appraise5.css">
    <link rel="stylesheet" type="text/css" href="/css/prd_bottm_details.css">
    <link rel="stylesheet" type="text/css" href="/css/prd_bottom_comParison.css">
    <link rel="stylesheet" type="text/css" href="/css/prd_center1_matchCompare.css">
    <link rel="stylesheet" type="text/css" href="/css/prd_down_right.css">
    <link rel="stylesheet" href="/css/hideproduct.css">
    <#include "prdInfo.ftl" />
	<script src="<!--#include virtual='/n/common/a02/script.html'-->"></script>
	<script src="gmlib/unit/g/1.0.0/g.min.js"></script>
	<script src="gmlib/unit/gomelib/1.0.0/gomelib.min.js"></script>
	<script src="gmlib/ui/gload/1.0.0/gload.min.js"></script>
	<script src="gmlib/ui/gclickshow/1.0.0/gclickshow.min.js"></script>
	<script src="gmlib/ui/ghover/1.0.0/ghover.min.js"></script>
	<script src="gmlib/ui/ginputfocus/1.0.0/ginputfocus.min.js"></script>
	<script src="gmlib/ui/groll/1.0.0/groll.min.js"></script>
	<script src="gmlib/ui/gmagnifier/1.0.0/gmagnifier.min.js"></script>
	<script src="gmlib/ui/glaterimg/1.0.0/glaterimg.min.js"></script>
	<script src="gmlib/ui/gbacktop/1.0.0/gbacktop.min.js"></script>
	<script src="gmlib/ui/curnav/1.0.0/curnav.min.js"></script>
	<script src="gmlib/ui/gpop/1.0.0/gpop.min.js"></script>
	<script src="gmlib/ui/gslider/1.0.4/gslider.min.js"></script>
	<script src="gmlib/ui/gtabs/1.0.0/gtabs.min.js"></script>
	<script src="gmlib/ui/tabs/1.0.0/tabs.min.js"></script>
	<script src="gmlib/ui/gloadsrc/jquery.loadsrc.min.js"></script>
	<script src="gmlib/ui/gfixed/1.0.0/gfixed.min.js"></script>
	<script src="gmlib/ui/gpage/1.0.1/gpage.min.js"></script>
    <script src="gmlib/ui/gphotoviewer/1.0.0/gphotoviewer.min.js"></script>
	<script src="gmlib/ui/gmimageviewer/1.0.0/gmimageviewer.min.js"></script>
	<script src="gmpro/1.0.0/item/2.0.0/item/1.0.1/js/productAdvice.min.js"></script>
	<script src="gmpro/1.0.0/item/2.0.0/item/1.0.1/js/dtcommend.min.js"></script>
	<script src="gmpro/1.0.0/item/2.0.0/item/1.0.0/js/appraisal.min.js"></script>
	<script src="gmlib/unit/bigdata/1.0.0/bigdata.min.js"></script>
	<script src="gmlib/unit/scodecommon/1.0.0/scodecommon.min.js"></script>
	<script src="/js/hideproduct.js"></script>
</head>
<body>
<!--#include virtual="/n/common/a02/head.html"-->
<#-- 面包屑 -->
<div class="wbox">
    <div class="local">
        <#if page.bread?? && page.bread?has_content>
            <#import "breadCrumb.ftl" as breadInfo>
            <@breadInfo.prdBread breadData=page.bread homePage=false />
        </#if>
        <span class="ccc fr" style="font-size:13px;display:inline-block;*margin-top:-20px;">商品编号：${prdInfo.skuNo!}</span>
    </div>
</div>

<#-- 大图和主体信息 -->
<div class="wbox" id="prd-main-wrap">
<#include "product_info/include/hideproduct_infoImg.ftl" />
    <div class="prd-main">
        <ul class="prdmain" id="gm-prd-main" style="margin-left: 0;">
            <li class="prdtit" style="width: auto;">
                <h1 style="margin-bottom: 12px;color:#333;">${prdInfo.name!}</h1>
            </li>
        </ul>
    </div>
</div>

<#-- 商品其他模块 -->
<#include "product_info/hide_product_infoMain.ftl" />

 <#-- 根据浏览猜你喜欢 -->
<div class="wbox">
    <div id="mboxDynamicFoot" class="guess-enjoy clearfix">
    </div>
</div>

<script type="text/javascript">
    var the_Version=21;
    //归档隐藏默认排序
    var sort_wrapper=document.getElementById('sort-wrapper');
        sort_wrapper.style.display="none";
    var dspAdv="${storeConfiguration.dspAdv!}";
    var shopUrl = "${storeConfiguration.mallSite!}/${page.merchantInfo.merchantId!}/";
</script>
 <!--#include virtual="/n/common/a02/foot.html"-->
 <!--#include virtual="/n/common/a02/aside.html"-->
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