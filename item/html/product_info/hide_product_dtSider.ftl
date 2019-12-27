<#-- 同类其他品牌 -->
<#if page.relatedBrands?exists && (page.relatedBrands?size>0)>
<div id ="tonglei_wrap" class ="tonglei_wrap">
    <h2 class="tonglei_wrap_title">同类其他品牌</h2>
    <div class ="brand_list">
        <#list page.relatedBrands as rb><#if (rb_index>19)><#break></#if><a href="${rb.href!}" title='${(rb.title)!}'>${(rb.title)!}</a></#list>
    </div>
</div>
</#if>

<#-- 排行榜 : 同价位 同品牌 同类别-->
<#if (page.rankinglist.boxes)?? >
<div id="paihangbang" class="tonglei_wrap dn">
    <h2 class="tonglei_wrap_title"></h2>
    <div class="margin010">
        <div id="fenlei_title" class="fenlei_title">
            <a href="javascript:;" class="cur">同价位</a><a href="javascript:;">同品牌</a><a href="javascript:;">同类别</a>
            <div class="flag_active"></div>
        </div>
        <div class="temp_1"></div>
        <div class="tonglei_product_wrap">
            <ul class="tonglei_ul">
                <#list page.rankinglist.boxes   as box>
                    <#list box.lst as var>
                        <li>
                            <a title="${var.pn}" href="//item.gome.com.cn/${var.purl}.html">${var.pn}</a>
                        </li>
                    </#list>
                </#list>
            </ul>

        </div>
    </div>
</div>
</#if>

<#--浏览该商品的用户最终购买-->
<#include "product_mboxLookBuy.ftl" />

<#if (prdInfo.shopNo )?has_content >   <#--联营-->
<#-- 热销排行榜 -->
    <#include "product_mboxBuyLook.ftl" />
</#if>

<#-- 浏览该商品的用户还浏览了 -->
<div id="mboxDynamic" ></div>