<#-- 主信息：包装与配送模板   -->
<ul class="pedtextbox pedspaile ped-baozhuangqingdan">
<#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ" && page.prdPack??>
	<#assign prdPack=page.prdPack!>
    <li>
        <h2>包装清单</h2>
        <p class="pedtextbox_cont">${prdPack.modeInfo!}</p>
    </li>
    <li class="pedtext_tit">
        <h2>签收与验货流程</h2>
	<#--<img class="delivers_process" src="/css/i/process.jpg" alt="签收与验货流程">-->
        <img class="delivers_process" _src="${storeConfiguration.imageserver!}/detail/process.jpg" alt="签收与验货流程">
        <a href="//help.gome.com.cn/article/229-0-0.html" target="_blank">详情请见签收与验货</a>
    </li>
<#else>
    <li class="pedtext_tit tg-baozhuangqingdan">
        <h2>包装清单</h2>
		<#if page.prdPacks?? && page.prdPacks?size &gt; 0>
			<#assign prdPacks=page.prdPacks!>
			<#list prdPacks as Sku>
                <b class="pedtextbox_caption">${Sku.modeTit!}</b>
                <p class="pedtextbox_cont">${Sku.modeInfo!}</p>
			</#list>
		</#if>
    </li>
    <li class="pedtext_tit">
        <h2>签收与验货流程</h2>
	<#--<img class="delivers_process" src="/css/i/process.jpg" alt="签收与验货流程">-->
        <img class="delivers_process" _src="${storeConfiguration.imageserver!}/detail/process.jpg" alt="签收与验货流程">
        <a href="//help.gome.com.cn/article/229-0-0.html" target="_blank">详情请见签收与验货</a>
    </li>
</#if>
</ul>