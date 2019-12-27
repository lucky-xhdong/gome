<#if page?? && page.merchantInfo??><#-- 联营 -->
    <#assign merchantInfo=page.merchantInfo!>
</#if>
<#if merchantInfo??><#-- 联营 -->
    <#if merchantInfo.shopStatus?? && (merchantInfo.shopStatus != "0")>
        <#assign shopStatus="disabled">
    </#if>
    <#if !(merchantInfo.goodsMatch ?exists) && !(merchantInfo.deliverySpeed ?exists)&& !(merchantInfo.serviceScore ?exists)>
        <#assign gmh = '4.5'>
        <#assign spd = '4.5'>
        <#assign sce = '4.5'>
    <#else>
        <#if merchantInfo.goodsMatch=="">
            <#assign gmh ='4.5'>
        <#else>
            <#assign gmh = merchantInfo.goodsMatch>
        </#if>
        <#if merchantInfo.deliverySpeed=="">
            <#assign spd ='4.5'>
        <#else>
            <#assign spd = merchantInfo.deliverySpeed>
        </#if>
        <#if merchantInfo.serviceScore=="">
            <#assign sce ='4.5'>
        <#else>
            <#assign sce = merchantInfo.serviceScore>
        </#if>
    </#if>
    <#assign score = ((gmh)?number+(spd)?number+(sce)?number)/3>
    <#assign wth =score/5*100>
    <#-- 同行比分 -->
    <#macro walkScore score>
        <#if (!score??) || (score = 0)>
        <small class="xiangdeng">-&nbsp;&nbsp;&nbsp;—</small>
        <#else>
            <#if (score>0) >
            <small title="计算规则：（商家得分-同行业平均分）/（同行业商家最高得分-同行业平均分）" class="gaoyu_text">${score?number?string("0.00")}%</small><i  class="gaoyu">箭头</i>
            <#else>
            <small title="计算规则：（商家得分-同行业平均分）/（同行业商家最高得分-同行业平均分）" class="diyu_text">${(-score)?number?string("0.00")}%</small><i class="diyu">箭头</i>
            </#if>
        </#if>
    </#macro>
    <#-- 比分min -->
    <#macro walkScoreMin score>
        <#if (!score??) || (score = 0)>
        <i class="xiangdeng">--</i>
        <#else>
            <#if (score>0) >
            <i class="gaoyu">箭头</i>
            <#else>
            <i class="diyu">箭头</i>
            </#if>
        </#if>
    </#macro>
    <div class="stores-infos">
        <div class="ly-stores">
            <h2 class="fix-storesname shops-name" id="store_live800_wrap">
                <a class="name" title="${merchantInfo.merchantName!}" href="${storeConfiguration.mallSite!}/${merchantInfo.merchantId!}/" target="_blank">${merchantInfo.merchantName!}</a>
                <a href="javascript:;" class="icon-service hide" data-customer_service_id="${merchantInfo.merchantId!}" data-showstyle="customerService_show" data-hidestyle="customerService_show" ><i></i>在线客服</a>
            </h2>
            <#if prdInfo.sapSkuType ?? && prdInfo.sapSkuType=="Z3PP">
                <#if merchantInfo.merchantId?? &&  merchantInfo.merchantId=="80011770">
                    <div class="store-logo">
                        <a href="${storeConfiguration.mallSite!}/${merchantInfo.merchantId!}/" target="_blank"><img gome-src="${storeConfiguration.imageserver!}/yGsx.png" alt="国美生鲜"></a>
                    </div>
                <#else>
                    <div class="store-logo">
                        <a href="${storeConfiguration.mallSite!}/${merchantInfo.merchantId!}/" target="_blank"><img gome-src="${storeConfiguration.imageserver!}/flycow.png" alt="飞牛网"></a>
                    </div>
                </#if>
            </#if>
            <div class="services-wrapper">
                <div class="services-stars">
                    服务评分：
                    <span class="star"><i style="width:${score/5*100}%">星星</i></span>
                    <span class="score">${(score)?number?string("#.00")?substring(0,3)}</span>分
                </div>
                <div class="services-score-detail">
                    <p><span class="detail">评分明细</span><span class="contrast">与行业对比</span></p>
                    <div class="describe ">
                        <p>商品描述：<span>${gmh?number?string("0.00")}</span><@walkScore score=(merchantInfo.goodsMatchCmp?default(0))/></p>
                    </div>
                    <div class="logistics">
                        <p>发货速度：<span>${spd?number?string("0.00")}</span><@walkScore score=(merchantInfo.deliverySpeedCmp?default(0))/></p>
                    </div>
                    <div class="services">
                        <p>服务质量：<span>${sce?number?string("0.00")}</span><@walkScore score=(merchantInfo.serviceScoreCmp?default(0))/></p>
                    </div>
                </div>
            </div>
            <div class="btn-group">
                <a href="${storeConfiguration.mallSite!}/${merchantInfo.merchantId!}/" class="btn-product btn-enter" target="_blank">进入店铺</a>
                <a href="javascript:;" class="btn-collect ${shopStatus!}" id="collect_shop">收藏店铺</a>
            </div>
        </div>
    </div>
<#else><#-- 自营 -->
    <#if page.flagshipShop??>
        <#assign shopinfo=page.flagshipShop!>
        <#if (shopinfo.brandLogo?? && shopinfo.brandLogo != "") && (shopinfo.indexUrl?? && shopinfo.indexUrl != "")>
        <div class="stores-infos">
            <div class="zy-stores">
                <h2 class="fix-storesname" id="store_live800_wrap">
                    <#if shopinfo.storeName?? && shopinfo.storeName != "">
                        <a class="name" title="${shopinfo.storeName!}" href="${shopinfo.indexUrl!}" target="_blank">${shopinfo.storeName!}</a>
                    </#if>
                        <a href="javascript:;" class="icon-service hide" data-customer_service_id="" data-showstyle="customerService_show" data-hidestyle="customerService_show" data-otherstyle="customerService_show" ><i></i>联系供应商</a>
                </h2>
                <div class="store-logo">
                    <a href="${shopinfo.indexUrl!}" target="_blank">
                        <img gome-src="${shopinfo.brandLogo!}" alt="${shopinfo.storeName!}">
                    </a>
                </div>
                <#--自营旗舰店进入/收藏店铺按钮-->
                <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
                    <div class="btn-group">
                        <#if page.flagshipShop??>
                            <#assign shopinfo=page.flagshipShop!>
                            <a href="${shopinfo.indexUrl!}" class="btn-product btn-enter" target="_blank">进入店铺</a>
                            <#if shopinfo.shopId?? && shopinfo.shopId != "">
                            <a href="javascript:;" class="btn-product btn-collect" data-shopid="${shopinfo.shopId!}" id="zy_collect_shop">收藏店铺</a>
                            </#if>
                        </#if>
                    </div>
                </#if>
            </div>
        </div>
        </#if>
    </#if>
</#if>
<#--关于手机(不区分自营联营) -->
<#if page.thirdCategoryId ?exists && page.thirdCategoryId == 'cat10000070'>
<div class="dt-sortbox" id="about-mb">
    <h2 class="dt-tit">关于手机，你可能在找</h2>
    <div class="dt-rcbox clearfix">
    </div>
</div>
</#if>

<#--联营：店内搜索 + 自营：相关分类-->
<#--联营：店内搜索 -->
<#if (prdInfo.shopNo )?has_content >
<div class="dn-search-box">
    <h3 class="dt-tit">店内搜索</h3>
    <div class="bd">
        <div class="p">
            <label for="keyword">关键字：</label>
            <input type="text" id="dn-keyword" class="dn-keyword" name="dn-keyword" value="搜本店">
        </div>
        <div class="p">
            <label for="dn-price">&nbsp;&nbsp;&nbsp;&nbsp;价格：</label>
            <div class="price-area">
                <div class="w w-1">
                    <span>¥</span>
                    <input type="text" class="dn-price-prev" name="sh-keyword">
                </div>
                <div class="w w-2">--</div>
                <div class="w w-3">
                    <span>¥</span>
                    <input type="text" class="dn-price-next" name="sh-keyword">
                </div>
            </div>
        </div>
        <div class="p p3">
            <a href="javascript:;" class="btn-sure">确定</a>
        </div>
        <div class="error"></div>
    </div>
</div>
<#--自营：相关分类 -->
<#else>
<div class="dt-sortbox">
    <h2 class="dt-tit">相关分类</h2>
    <div class="dt-rcbox clearfix">
        <#if page.prdClass?exists && (page.prdClass?size>0)>
            <#assign prdClass=page.prdClass!>
            <#list prdClass as rc>
                <#if rc.text?? && rc.text=="true">
                    <a href="${rc.href!}" title="${rc.title!}" target="_blank" class="cur">${rc.title!}</a>
                <#else>
                    <a href="${rc.href!}" title="${rc.title!}" target="_blank">${rc.title!}</a>
                </#if>
            </#list>
        </#if>
    </div>
</div>

</#if>


<#------------------------------------------------------------------->
<#--联营:店铺商品分类 + 自营：同类其他品牌-->
<#--联营:店铺商品分类-->
<#if (prdInfo.shopNo)?has_content >  <#-- (product.color)?has_content  prdInfo.goodsColor?size &gt; 0 -->
<div class="dt-sortbox">
    <p class="dt-tit">店铺商品分类</p>
    <div class="dt-rcbox clearfix">
        <div class="menu_list" id="secondpane">
            <#if page.shopCategory??> <#--?has_content-->   <#--&& (ShopCategroy?size>0)-->
            <#assign shopCategory=page.shopCategory!>
                <a class="allgoodstitle" href= "${shopCategory[0].categoryHref!}" >${shopCategory[0].categoryName!}</a>
                <#list shopCategory[0].lstSubCat as hw> <#--ProductItemPage-->
                    <#if hw.categoryHref?? && hw.categoryName?? && hw.lstSubCat?? >
                        <dl>
                            <dt>
                                <b class="hwgplus"></b><h4><a href="${hw.categoryHref!}" class="menu_head">${hw.categoryName!}</a></h4>
                            </dt>
                            <dd class="menu_body">
                                <#list hw.lstSubCat as haiwaigou>
                                    <a class="hwghref" style="padding-left:35px;" href="${haiwaigou.categoryHref}">${haiwaigou.categoryName}</a>
                                </#list>
                            </dd>
                        </dl>
                    </#if>
                </#list>
            </#if>
        </div>
    </div>
</div>
<#--自营：同类其他品牌-->
<#else>
    <#if page.relatedBrands?exists && (page.relatedBrands?size>0)>
    <#assign relatedBrands=page.relatedBrands!>
    <div id ="tonglei_wrap" class ="tonglei_wrap">
        <h2 class="tonglei_wrap_title">同类其他品牌</h2>
        <div class ="brand_list">
            <#list relatedBrands as rb><#if (rb_index>19)><#break></#if><a href="${rb.href!}" title='${(rb.title)!}'>${(rb.title)!}</a></#list>
        </div>
    </div>
    </#if>
</#if>
<#------------------------------------------------------------------->
<#--浏览该商品的用户最终购买-->
<#include "product_mboxLookBuy.ftl" />
<#------------------------------------------------------------------->
<#if (prdInfo.shopNo )?has_content >   <#--联营-->
<#-- 购买该商品的用户还浏览了 -->
    <#include "product_mboxBuyLook.ftl" />
<#else>  <#--自营-->
    <#-- 购买该商品的用户还浏览了 -->
    <#include "product_mboxBuyLook.ftl" />
</#if>
<#------------------------------------------------------------------->
<#-- 浏览该商品的用户还浏览了 -->
<div id="mboxDynamic" ></div>




