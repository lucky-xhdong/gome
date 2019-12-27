<#-- 主信息：具体参数模板   -->
<ul class="specbox">
	<li class="corr">如果您发现商品信息不准确，<a href="${storeConfiguration.staSite?replace('www','jiucuo')}/${(prdInfo.productId)!}-${(prdInfo.sku)!}.html"  target="_blank" class="j-corr">欢迎纠错</a></li>
<#if page.prdSpec?exists && (page.prdSpec?size>0)>
<#list page.prdSpec as spec>
	<li class="spectit">${spec.modeTit!}</li>
    <#list spec.modeData as spinfo>
    <li>
    	<span class="specinfo">${spinfo.modeTxt!}<#if spinfo.knowledgeClub?? && spinfo.knowledgeClub !=""><i knowledgeClub="${spinfo.knowledgeClub!}"></i></#if></span>
        <span>${spinfo.modeInfo!}</span>
    </li>
    </#list>
</#list>
</#if>
</ul>
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
<#-- 主信息：售后保障模板   -->