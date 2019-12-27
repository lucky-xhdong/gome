<#-- 商品其他模块 -->
<div class="wbox" id="gm-other-info">
    <#--G3pp  显示门店 -->
    <div class="showStore clearfix dn" id="showStore"></div>
    <#--商品无货或下架时，只显示“其他类似商品” -->
    <#include "product_similar.ftl" />
    <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
    <#-- 搭配购 -->
    <div class="wbox prd_rend" id="pedAssort"></div>
    </#if>
    <#if page.skuAnchorPoint?? && page.skuAnchorPoint.skuAnchorPointInfo?? && page.skuAnchorPoint.skuAnchorPointInfo?size gt 1>
         <#assign skuAnchorPoint=page.skuAnchorPoint>
         <#assign dteshu='dt-teshu'>
         <#assign dteshuwidth='dtwhidth'>
    </#if>
    <div class="dt-main ${dteshu!}">

    <#-- 优惠套装、推荐配件 -->
		 <#include "product_recommFittings.ftl" />

		<#-- 商品描述、参数、包装配送等 -->
		 <#include "product_detailInfo.ftl" />

		<#-- 售后保障 -->
		 <#include "product_seven/product_seven.ftl" />

		<#-- 商品评价、晒单 -->
 	    <#include "product_appraise.ftl" />

        <#if merchantInfo??><#-- 联营 -->
		<#-- 本店好评商品 -->
 	    <#include "product_praise_goods.ftl" />
        </#if>

		<#-- 商品咨询 -->
	    <#include "product_consult.ftl" />

    </div>
    <div class="dt-side">
        <#-- 左侧栏推荐项目 -->
	    <#include "product_dtSider.ftl" />
    </div>

</div>



<div class="wbox">

    <#--八叉乐-购买该商品还购买  NEW:根据浏览猜你喜欢-->
    <#include "product_mboxLookbrowsed.ftl" />

    <#-- 最近浏览 -->
    <#include "product_mboxBrowsed.ftl" />

</div>



<div class="mbox">
<#-- 对比栏 -->
	<#--  <#include "compareBar.ftl" />  -->
</div>



<div id="productmbox"></div>
﻿