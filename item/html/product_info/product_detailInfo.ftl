<#-- 商品描述、参数、包装配送等 -->
<div id="prdDesc" class="prdDescOut">
    <div id="gfixed"></div>
    <div id="fixtabox" class="pdtl-tab j-fixtg">
        <ul class="prdtitbox" id="prd_tbox">
            <li class="cur"><a href="javascript:;">商品详情</a></li>
            <li><a href="javascript:;">规格与包装</a></li>
        <#--<li><a href="javascript:;" id="dtlReview">商品测评</a></li>-->
            <li><a href="javascript:;" class="pingjia_header">商品评价</a></li>
            <li><a href="javascript:;">售后保障</a></li>
            <li><a href="javascript:;">小助手</a></li>
            <#if merchantInfo??><#-- 联营 -->
            <li class="bendiangood"><a href="javascript:;">本店好评商品</a></li>
            </#if>
        </ul>
    <#-- 小购物车开始 -->
    <#assign prdImg = storeConfiguration.imageserver+"/grey.gif">
    <#--<#assign prdImg = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">-->
    <#if prdInfo.goodsImgs?exists && (prdInfo.goodsImgs?size>0)>
        <#list prdInfo.goodsImgs as img>
            <#if img_index == 0>
                <#assign prdImg = img.src+"_130.jpg">
            </#if>
        </#list>
    </#if>
        <div class="minichart">
            <#if prdInfo.sapSkuType?? &&(prdInfo.sapSkuType =="ZHK" || prdInfo.sapSkuType =="ZLH" ||  prdInfo.sapSkuType =="ZHYJ" || prdInfo.sapSkuType =="ZJXK" || prdInfo.sapSkuType =="ZJXJ")><#-- 电信卡合约机等不展示快速购,加入购物车以及分期购 -->
            <#else>
                <a href="javascript:;" class="redlink" id="addCartLink">加入购物车</a>
            </#if>
            <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType !="ECTZ">
                <#if merchantInfo??>
                    <a class="online-service" href="javascript:;" title="在线客服"><i class="icon-service"></i>在线客服</a>
                <#else>
                    <a class="online-service zy-online-service" href="javascript:;" title="联系供应商"><i class="icon-service"></i>联系供应商</a>
                </#if>
                <div class="mobile-orders-wrapper">
                    <a href="javascript:;" class="mobile-orders"><i></i>手机下单</a>
                    <img gome-src="${storeConfiguration.staSite?replace('www','ss')}/item/v1/qr/verify/${page.productId!}/${page.skuId!}/flag/item"  alt="二维码">
                </div>
            </#if>
            <div id="floatToCart" class="floatToCart">
                <div class="cartLeft">
                    <img alt="${prdInfo.name!}" width="100" height="100" gome-src="${prdImg}">
                </div>
                <div class="cartRight">
                    <p class="prdname">${prdInfo.name!}</p>
                    <p id="miniPrice">${prdInfo.price!}</p>
                </div>
            </div>
        </div>
    <#-- 小购物车结束 -->
    </div>
    <ul class="pedmainbox" id="prd_data">
        <li class="clearfix ${dteshuwidth!}">
        <div class="sliderleft">
        <#-- 规格参数  加套购逻辑-->
        <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType !="ECTZ">
            <#if page?? && page.merchantInfo??><#--联营商品走老的推荐参数模板-->
                <#if page.prdDescSpec?exists && (page.prdDescSpec?size>0)>
                    <div class="guigecanshu_wrap">
                        <#list page.prdDescSpec as spinfo>
                            <div class="guigecanshu" title="${spinfo.modeInfo!}">${spinfo.modeTxt!}：${spinfo.modeInfo!}</div>
                        </#list>
                        <p id="more-param" class="more-param"><a href="javascript:;">更多参数 ></a></p>
                    </div>
                </#if>
            <#else ><#--自营商品如果属于以下几个分类则展示新的推荐参数模板，否则还展示原来老的推荐参数模板-->
                <#assign Intelligence='cat10000054,cat10000092,cat10000062,cat10000094,cat10000070,cat10000058'>
                <#if page.thirdCategoryId?exists && Intelligence?index_of(page.thirdCategoryId)!=-1 >
                    <#if page.prdDescSpecNew?exists && (page.prdDescSpecNew?size>0)>
                        <#list page.prdDescSpecNew as prdDescSpecNew>
                            <#if page.prdDescSpecNew[0].modeData?exists && (page.prdDescSpecNew[0].modeData?size>0) >
                                <div class="params-wrapper">
                                    <#list prdDescSpecNew.modeData as mainParam>
                                        <#if mainParam.modeData?exists && (mainParam.modeData?size>0) && mainParam.modeInfo?exists && mainParam.modeInfo != ''>
                                            <div class="param-panel">
                                                <div class="param-item">
                                                    <h1>
                                                        <img gome-src="${mainParam.modeInfo!}" alt="${mainParam.modeTxt!}">
                                                        <span>${mainParam.modeTxt!}</span>
                                                        <i class="icon-arrow-down">arrow</i>
                                                    </h1>
                                                    <#if mainParam.modeData?exists && (mainParam.modeData?size>0)>
                                                        <ul>
                                                            <#list mainParam.modeData as subParam>
                                                                <li title="${subParam.modeTxt!}：${subParam.modeInfo!}">
                                                                    <span class="attr">${subParam.modeTxt!}：</span>
                                                                    <span class="value">${subParam.modeInfo!}</span>
                                                                </li>
                                                            </#list>
                                                        </ul>
                                                    </#if>
                                                </div>
                                            </div>
                                        </#if>
                                    </#list>
                                    <#if page.prdDescSpecNew[0].modeData[0].modeData?exists && (page.prdDescSpecNew[0].modeData[0].modeData?size>0) >
                                        <p id="more-param" class="more-param"><a href="javascript:;">更多参数 ></a></p>
                                    </#if>
                                </div>
                            </#if>
                        </#list>
                    </#if>
                <#else >
                    <#if page.prdDescSpec?exists && (page.prdDescSpec?size>0)>
                        <div class="guigecanshu_wrap">
                            <#list page.prdDescSpec as spinfo>
                                <div class="guigecanshu" title="${spinfo.modeInfo!}">${spinfo.modeTxt!}：${spinfo.modeInfo!}</div>
                            </#list>
                            <p id="more-param" class="more-param"><a href="javascript:;">更多参数 ></a></p>
                        </div>
                    </#if>
                </#if>
            </#if>
        </#if>
        <#-- 商品图片广告2015-6-3-->
        <#if prdInfo?? && prdInfo.operADHref?? >
            <div id="productAdtop" style="width: 756px;margin: 20px auto 60px auto;">

            </div>
        </#if>
            <div id="adtop"></div>
        <#-- 乐视视频顶部-->
        <#if isvidoe?? && isvidoe=="1">
            <script type="text/javascript" src="https://js.meixincdn.com/gvs-player/dist/vod/js/meixinplayer-min.js"></script>
            <div id="meixin_tv" style="width:750px;height:422px;margin-right:auto;margin-left:auto" ></div>
        </#if>
            <div id="detailHtml"></div>
       <#-- 乐视视频底部-->
        <#if isvidoe?? && isvidoe=="2">
            <script type="text/javascript" src="https://js.meixincdn.com/gvs-player/dist/vod/js/meixinplayer-min.js"></script>
            <div id="meixin_tv" style="width:750px;height:422px;margin-right:auto;margin-left:auto" ></div>
        </#if>
            <div id="adbottom"></div>
            <div id="endscroll"></div>
            </div>
            <div class="slideright">
                <#include "slider_nav.ftl" />
            </div>
            
        </li>
        <li><#include "include/product_infoSpec.ftl" /></li>
    <#--<li class="prdReview"><div style="display:block;" class="loading pt10" ></div></li>-->
        <li></li>
        <li><#include "include/product_infoService.ftl" /></li>
        <li id="helper"><#include "include/product_infoHelper.ftl" /></li>
    </ul>
</div>