    <#-- 销售属性 -->
    <#if iSupport??>
	    <#assign iSupportwidth = '450'>
    <#else>
	    <#assign iSupportwidth = '360'>
    </#if>
	<#assign prdProperties="">
	<#if prdInfo.affixAttr?? && prdInfo.affixAttr?keys?size &gt; 0 >
		<#list prdInfo.affixAttr?keys as itemKey>
			<#if prdProperties?length = 0>
				<#assign prdProperties='"${itemKey!}"'+':'+'"${(prdInfo.affixAttr[itemKey])!}"'>
			<#else>
				<#assign prdProperties=prdProperties+','+'"${itemKey!}"'+':'+'"${(prdInfo.affixAttr[itemKey])!}"'>
			</#if>
		</#list>
	</#if>
	<#assign prdProperties='{'+prdProperties+'}'>

	    <#-- 大图旋转 -->
		<#assign prdgroatepic="">
		<#if prdInfo.groatepic?? && prdInfo.groatepic?keys?size &gt; 0 >
			<#list prdInfo.groatepic?keys as grokey>
				<#if prdgroatepic?length = 0>
					<#assign prdgroatepic='"${grokey!}"'+':'+'"${(prdInfo.groatepic[grokey])!}_${iSupportwidth!}.jpg"'>
				<#else>
					<#assign prdgroatepic=prdgroatepic+','+'"${grokey!}"'+':'+'"${(prdInfo.groatepic[grokey])!}_${iSupportwidth!}.jpg"'>
				</#if>
			</#list>
		</#if>
		<#assign prdgroatepic='{'+prdgroatepic+'}'>


    <#-- 是否支持套购 -->
    <#assign gmTaoGou = "false" >
    <#if page.suitInfo?? && page.suitInfo?size &gt; 0 >
        <#assign gmTaoGou="true">
    </#if>
<script>
<#-- 公共属性 -->
var prdInfo = {
	<#-- 商品productID -->
	prdId:"${(prdInfo.productId)!}",
	<#-- 商品skuID -->
	sku:"${(prdInfo.sku)!}",
	<#-- 商品sku级别的属性 -->
	skuDat:"${(prdInfo.skuVersion)!}",
	<#-- 商品编号 -->
	skuNo:"${(prdInfo.skuNo)!}",
	<#-- 自营店铺编号 -->
    shopNo_zy:"${(page.flagshipShop.shopId)!}",
	<#-- 是否支持个性头部 -->
    isHead:"${(page.flagshipShop.isHead)!}",
	<#-- 店铺编号 -->
	shopNo:"${(prdInfo.shopNo)!}",
	<#-- 销售渠道 -->
	siteId:"${(prdInfo.channel)!}",
	departmentStoreSkuType:"${(prdInfo.departmentStoreSkuType)!}",
	<#-- 商品库区可卖属性 -->
	skuType:"${(prdInfo.skuType)!}",
	<#--商品店铺的类型--> 
	sapSkuType:"${(prdInfo.sapSkuType)!}",
	<#-- 商品的末级分类 -->
	shelf:"${(prdInfo.shelfCtgy)!}",
	<#-- 商品负卖标识  (0=正常品(SMI)，1=3PP商品(3PP,G3PP)，2=负卖商品（FM)，3=团购虚拟商品（TGXN）-->
	selltype:"${(prdInfo.selltype)!}",
	<#-- 商品分类ID -->
	catId:"${(page.thirdCategoryId)!}",
	<#-- 商品价格 -->
	price:"${(prdInfo.price)!?c}",
	<#-- 商品促销语 -->
	promoDesc:"${(page.salesPromotionTitle)!}",
	<#-- 发送给心愿单的名称 -->
	description:"${(prdInfo.description)!}",
	<#-- 商品状态 正常1  | 下架 2 |归档 6 -->
	stats:"${(prdInfo.stats)!}",
	gdstats:"${(prdInfo.stats)!}",
	prdName:'${(prdInfo.name)!}',
	<#-- 供应商 在线客服标识  用下划线分割   构成:一级分类ID_二级分类ID_三类分级ID_品牌ID  purchase.js里调用这个串  -->
	live800Provider_flag:"${(page.firstCategoryId)!}_${(page.secondCategoryId)!}_${(page.thirdCategoryId)!}_${(page.brandId)!}",
	firstCategoryId:"${(page.firstCategoryId)!}",
	thirdCategoryId:"${(page.thirdCategoryId)!}",
	coo8thirdCategoryId:"${(page.coo8thirdCategoryId)!}",
	<#-- 商品简介描述url  htmHref:"${(prdInfo.htmlHref)!}" -->
	vipShopFlag:("${(prdInfo.vipShopFlag)!}"==1 ? true : false),
	programId:"${(prdInfo.programId)!}",	
	<#--品牌ID -->
	brandID:"${(prdInfo.brandId)!}",
	<#--品牌code -->
	brandCode:"${(prdInfo.brandCode)!}",
    <#--品牌 -->
    brand:"${(prdInfo.brand)!}",
    <#-- 商品套购 suitSku:"${(prdInfo.suitSku)!?c}",-->
	gomePrice:"${(prdInfo.gomePrice)!?c}",
	firstCategoryName:"${(page.categoryName.text)!}",
	secondCategoryName:"${(page.secCategoryName.text)!}",
	thirdCategoryName:"${(page.breadName.href)!}",
	htmlHref:"${(prdInfo.htmlHref)!}",
	breadName:"${(page.breadName.text)!}",
    operADHref:"${(prdInfo.operADHref)!}",
    templateId:"${(prdInfo.templateId)!}",
    productType:"prd",
	<#-- 枚举值为1、2、3，分别表示在线、海外购自营、海外购联营-->
    shopFlag:"1",
    decorationFilePath:"0",
    ColorVersion:${prdProperties!},
    gmTaoGou:${gmTaoGou!},      
    energyState:"${prdInfo.energyState!"0"}",
    <#--  energyState节能补贴  -->
    <#--  美信项目环境路径  -->
    gomePlus:"${storeConfiguration.gomePlus!}",
    skuBlackList:"${prdInfo.skuBlackList!}",
    <#-- 控制促销展示-->
    cnumber:0,
    <#-- 自营标示-->
    iSupport:"${iSupport!}",
    <#-- 支持苹果特惠商品的标示-->
    preferential:"${prdInfo.preferential!}",
     <#-- 大图旋转-->
    groatepic:${prdgroatepic!}
};
<#-- 是否支持视频 -->
<#if page.prodVideoInfo?? && page.prodVideoInfo.videoPosition?? && (page.prodVideoInfo.videoPosition=="1" || page.prodVideoInfo.videoPosition=="2")>
	<#assign prodVideoInfo=page.prodVideoInfo!>
	<#if prodVideoInfo.videoType?? && prodVideoInfo.videoType=='meixin'>
	<#assign isvidoe=prodVideoInfo.videoPosition!>
	<#-- 是否支持视频-->
	prdInfo.isvideo='${isvidoe!}';
	<#-- 视频id-->
	prdInfo.videoid='${prodVideoInfo.vu!}';
	<#-- 视频环境-->
	prdInfo.meixinshiping='${storeConfiguration.meixinshiping!}';
	</#if>
</#if>
<#if (page.merchantInfo.decorationFilePath)?? >
	prdInfo.decorationFilePath='${page.merchantInfo.decorationFilePath}';
</#if>
</script>