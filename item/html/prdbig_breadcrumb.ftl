<#-- 面包屑 -->
<#macro prdBread breadData homePage>
    <#if breadData??>
        <#list breadData as item>
            <#assign linkstyle = "">
            <#if item_index == 2 && homePage==false>
                <#assign linkstyle = "class='linkBold'">
                <a ${linkstyle} title="${item.title!}">${item.title!}</a>
                <b></b>
            </#if>
            <#if !item_has_next &&  item_index gt 2  && homePage==false>
                <#assign linkstyle = "class='curprd'">
                <a href="${item.href!}" ${linkstyle} title="${item.title!}">${item.title!}</a>
            </#if>
        </#list>
    </#if>
</#macro>