<#-- 面包屑 -->
<#macro prdBread breadData homePage>
    <#if breadData??>
    <ul>
        <#list breadData as item>
            <#assign linkstyle = "">
            <#assign tzcursor = "">
            <#assign wrapper = "">
            <#assign hasbread = "">
            <#assign icondown = "">
            <#if item_index == 0 && homePage==false>
                <#assign linkstyle = "style='display:none;'">
            </#if>
            <#if item_index == 1 && homePage==false>
                <#assign linkstyle = "class='linkBold'">
            </#if>
            <#if !item_has_next && homePage==false>
                <#assign linkstyle = "class='active'">
            </#if>
            <#if item_index == 2 && homePage==false && page.prdInfo.sapSkuType?? && page.prdInfo.sapSkuType == "ECTZ">
                <#assign tzcursor = "class='tz-cursor'">
            </#if>
            <#if item_index == 4 && homePage==false && page.thirdCategoryId?? && page.thirdCategoryId == "cat10000070" && item.breadSign?? && item.breadSign == true>
                <#assign wrapper = "class='breadcrumb'">
                <#assign hasbread = "class='has-breads'">
                <#assign icondown = "<i class='icon-crumbs-down'></i>">
            </#if>
            <li ${linkstyle} ${tzcursor} ${wrapper}>
                <#if !item.href??>
                    <a title="${item.title!}">${item.title!}</a>
                <#elseif item.href?? && item.href == "">
                    <a title="${item.title!}">${item.title!}</a>
                <#else>
                    <a ${hasbread} href="${item.href!}" title="${item.title!}">${item.title!}${icondown}</a>
                </#if>
                <#if item_has_next>
                    <#if homePage==true>
                        <i class="icon-crumbs-right"></i>
                    </#if>
                    <#if homePage==false && item_index!=0>
                        <i class="icon-crumbs-right"></i>
                    </#if>
                </#if>
                <#if item_index == 4 && homePage==false && page.thirdCategoryId?exists && page.thirdCategoryId == "cat10000070" && item.breadSign?? && item.breadSign == true>
                    <div class="details-breadcrumbs-dropdown">
                        <div class="product-lists"></div>
                        <div class="bread-lists">
                            <ul>
                                <li>
                                    <a class="brandUrl" href="//search.gome.com.cn/search?question=%E5%8D%8E%E4%B8%BA(HUAWEI)" title="华为(HUAWEI)" target="_blank">华为(HUAWEI)</a>
                                </li>
                                <li>
                                    <a class="brandUrl" href="//search.gome.com.cn/search?question=%E5%B0%8F%E7%B1%B3(MI)" title="小米(MI)" target="_blank">小米(MI)</a>
                                </li>
                                <li>
                                    <a class="brandUrl" href="//search.gome.com.cn/search?question=%E4%B8%89%E6%98%9F(SAMSUNG)" title="三星(SAMSUNG)" target="_blank">三星(SAMSUNG)</a>
                                </li>
                                <li>
                                    <a class="brandUrl" href="//search.gome.com.cn/search?question=OPPO" title="OPPO" target="_blank">OPPO</a>
                                </li>
                                <li>
                                    <a class="brandUrl" href="//search.gome.com.cn/search?question=vivo" title="VIVO" target="_blank">VIVO</a>
                                </li>
                                <li>
                                    <a class="brandUrl" href="//search.gome.com.cn/search?question=Apple" title="Apple" target="_blank">Apple</a>
                                </li>
                                <li>
                                    <a class="brandUrl" href="//search.gome.com.cn/search?question=%E9%AD%85%E6%97%8F(MEIZU)" title="魅族(MEIZU)" target="_blank">魅族(MEIZU)</a>
                                </li>
                                <li>
                                    <a class="brandUrl" href="//search.gome.com.cn/search?question=%E8%8D%A3%E8%80%80" title="荣耀" target="_blank">荣耀</a>
                                </li>
                                <li>
                                    <a class="brandUrl" href="//search.gome.com.cn/search?question=%E4%B9%90%E8%A7%86" title="乐视" target="_blank">乐视</a>
                                </li>
                            </ul>
                            <a href="javascript:;" target="_blank" class="more more-breads">更多&gt;</a>
                        </div>
                    </div>
                </#if>
            </li>
        </#list>
    </ul>
    </#if>
</#macro>