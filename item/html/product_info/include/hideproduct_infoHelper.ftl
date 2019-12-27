<#-- 主信息：具体参数模板   -->

<#assign cat_cid = "">
<#assign cat_pid = "">
<#assign cat_nam = "">
<#if page.breadName??>
	<#assign cat_cid = page.breadName.title!>
	<#if page.breadName.target?? && page.breadName.target!="">
		<#assign cat_pid = "-"+page.breadName.target!>
	</#if>
	<#assign cat_nam = page.breadName.text!>
</#if>
<#assign cls_nam = "">
<#if page.breadName??>
	<#assign cls_nam = page.breadName.href!>
</#if>
<ul class="pedhelptop">
	<li><b>【报价】</b>查看<a href="//offer${storeConfiguration.cookieDomain}/price-${cat_cid}${cat_pid}.html" target="_blank">${cat_nam!}${cls_nam!}相关价格表</a></li>
    <li><b>【评价】</b>查看<a href="//comment${storeConfiguration.cookieDomain}/comment-${cat_cid}${cat_pid}.html" target="_blank">${cat_nam!}${cls_nam!}怎么样？</a></li>
    <#--<li><b>【排行】</b>查看<a href="javascript:;">${cat_title!}销售排行榜</a></li>-->
</ul>

<#if page.prdHelper?exists && (page.prdHelper?size>0)>
        <#list page.prdHelper as help>
        <div class="helptit">
            <a href="javascript:;">${help.modeTit!}</a>
        </div>
        <ul class="pedhelptab">
                <li>
                    ${help.modeInfo!}
                </li>
        </ul>
        </#list>
</#if>

