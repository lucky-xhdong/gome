<#-- 购买该商品的用户还浏览了 -->
<#if prdInfo.shopFlag ?? && (prdInfo.shopFlag=='2' || prdInfo.shopFlag=='3')>
<div id="buyAndLook"></div>
<#else>
	<#if merchantInfo??>
	<div id="buyAndLook"></div>
	<#else>
	<div id="paihangbang" class="tonglei_wrap">
	    <h2 class="tonglei_wrap_title">热销排行榜</h2>
	    <div class="margin010">
		  	<div class="tonglei_product_wrap"> </div>
		</div>
	</div>
	</#if>
</#if>