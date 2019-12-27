<#-- 主信息：售后服务模板   -->
<#if prdInfo.shopFlag ?? && (prdInfo.shopFlag=='2' || prdInfo.shopFlag=='3')>

<#elseif prdInfo.shopNo??>
    <#--<#if prdInfo.shopNo?has_content>-->
    <#--<div class ="lianyingshouhou">-->
        <#--<img _src="${imgsbmg!}/detail/shouhoufuwulianying.png" src="${imgslod!}" />-->
        <#--<a target="_blank" href="//help.gome.com.cn/html/shfw/thh-ly.html"></a>-->
    <#--</div>-->
    <#--<#else>-->
    <#--<div class="ziyingshouhou">-->
        <#--<img _src="${imgsbmg!}/detail/shouhoufuwziying.png" src="${imgslod!}" />-->
        <#--<a target="_blank" href="//help.gome.com.cn/html/shfw/thh-zy.html"></a>-->
    <#--</div>-->
    <#--</#if>-->
</#if>