<#-- 主信息-->
<div class="breadcrumbs-wrapper">
    <div class="breadcrumbs-container">
        <div class="left">
            <#if page.bread?? && page.bread?has_content>
                <#import "breadCrumb.ftl" as breadInfo>
                <@breadInfo.prdBread breadData=page.bread homePage=false />
            </#if>
        </div>
        <div class="right">
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
                <div class="ly-stores shops-name">
                    <a href="javascript:;" class="btn-collect ${shopStatus!}" id="collect_shop">
                        <i class="icon-collect"></i>
                        <span>收藏店铺</span>
                        <i class="icon-arrow"></i>
                    </a>
                    <a href="javascript:;" class="btn-service hide" data-customer_service_id="${merchantInfo.merchantId!}" data-showstyle="customerService_show" data-hidestyle="customerService_show"><i></i>在线客服</a>
                    <#if prdInfo.sapSkuType ?? && prdInfo.sapSkuType=="Z3PP">
                        <span class="identify">国美自营</span>
                    </#if>
                    <span class="services-score"><b class="star-gray"><i class="star-red" style="width:${score/5*100}%"></i></b><em class="score">${(score)?number?string("#.00")?substring(0,3)}</em>分</span>
                    <a class="name" title="${merchantInfo.merchantName!}" href="${storeConfiguration.mallSite!}/${merchantInfo.merchantId!}/" target="_blank">${merchantInfo.merchantName!}</a>
                    <div class="pop-stores-others">
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
                        <div class="phone-wrapper" id="store_live800_wrap">
                            <a href="javascript:;" class="link-service hide" data-customer_service_id="${merchantInfo.merchantId!}" data-showstyle="customerService_show" data-hidestyle="customerService_show" ><i></i>在线客服</a>
                            <span class="txt-phone"><i></i>${merchantInfo.shopHotLine!}</span>
                        </div>
                        <#if merchantInfo??>
                            <#assign store_name="">
                            <#if merchantInfo.companyName??>
                                <#assign store_name = merchantInfo.companyName>
                            <#else>
                                <#if merchantInfo.merchantName??>
                                    <#assign store_name = merchantInfo.merchantName>
                                </#if>
                            </#if>
                        </#if>
                        <div class="company-wrapper">
                            <p>公司名称：${store_name!}
                                <a href="//mall${storeConfiguration.cookieDomain!}/storelisence/${merchantInfo.merchantId!}.html" target="_blank">
                                    <img gome-src="//app.gomein.net.cn/coo8images/coo8/shop/ic.jpg" width="19" height="20" alt="icon">
                                </a>
                            </p>
                            <p>所在地：${merchantInfo.province!}&nbsp;&nbsp;${merchantInfo.city!}</p>
                        <#if merchantInfo.contractEnd?? >
                            <p>网店有效期至：${merchantInfo.contractEnd?substring(0,10)}</p>
                        </#if>
                            <input id="province_name" type="hidden" value="${merchantInfo.province!}"/>
                            <input id="city_name" type="hidden" value="${merchantInfo.city!}"/>
                        </div>
                    </div>
                </div>
            <#else><#-- 自营 -->
                <div class="zy-stores shops-name">
                    <#if page.flagshipShop??>
                        <#assign shopinfo=page.flagshipShop!>
                        <#if (shopinfo.brandLogo?? && shopinfo.brandLogo != "") && (shopinfo.indexUrl?? && shopinfo.indexUrl != "")>
                            <#if shopinfo.shopId?? && shopinfo.shopId != "">
                                <a href="javascript:;" class="btn-collect" data-shopid="${shopinfo.shopId!}" id="zy_collect_shop"><i class="icon-collect"></i>
                                    <span>收藏店铺</span>
                                </a>
                            </#if>
                        </#if>
                    </#if>
                    <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
                        <a href="javascript:;" class="btn-service  hide" data-customer_service_id=""
                           data-showstyle="customerService_show" data-hidestyle="customerService_show"
                           data-otherstyle="customerService_show"><i></i>联系供应商</a>
                    </#if>
                    <span class="identify">国美自营</span>
                    <#if page.flagshipShop??>
                        <#assign shopinfo=page.flagshipShop!>
                        <#if (shopinfo.brandLogo?? && shopinfo.brandLogo != "") && (shopinfo.indexUrl?? && shopinfo.indexUrl != "")>
                            <#if shopinfo.storeName?? && shopinfo.storeName != "">
                                <a class="name" title="${shopinfo.storeName!}" href="${shopinfo.indexUrl!}" target="_blank">${shopinfo.storeName!}</a>
                            </#if>
                        </#if>
                    </#if>
                </div>
            </#if>
        </div>
    </div>
</div>
<div class="gome-container" id="gm-main-info">
<#if prdInfo??>
    <#assign info = prdInfo>
    <#include "product_main_left.ftl" />
    <#include "product_main_center.ftl" />
    <#if !(iSupport??)>
        <#include "product_main_right.ftl" />
    </#if>
</#if>
</div>
<!--美易分二维码弹窗 start-->
<div class="pop-meiyifen dn">
    <a href="javascript:;" class="close">&times;</a>
    <div class="pop-body"><h2>国美易卡&ensp;分期</h2>
        <img _src="${storeConfiguration.staSite?replace('www','ss')}/item/v1/bt/info/qrcode/${page.productId!}/${page.skuId!}/180/180/flag/item/" alt="美易分二维码">
        <p class="p2">扫一扫，开启美好之旅</p>
    </div>
</div>
<div class="mask-meiyifen dn"></div>
<!--美易分二维码弹窗 end-->
<#--dialog -->
<div class="dialog">
    <div id="dialogBox" class="dialogBox">
        <div class="close"><a href="javascript:;" id="close">╳</a></div>
        <div id="innerBox"></div>
    </div>
</div>
<#-- 回复模板 -->
<div class="reply_wrap dn">
    <!-- <div class="reply_wrap_close">╳</div>
    <div class="reply_wrap_sanjiao"></div> -->
    <p class="reply_title">
        回复<span class="replay_user"> summer：</span>
    </p>
    <p class="reply_input_box"><textarea class="reply_input"></textarea></p>
    <p style="margin-top:10px; text-align: right; margin-bottom: 5px;">
        <span class="reply_shengyuzishu">您还可以输入400字</span> <span class="reply_submit">提交</span>
    </p>
</div>


<#if prdInfo.sapSkuType?? && (prdInfo.sapSkuType =="ZHK" || prdInfo.sapSkuType =="ZLH" ||  prdInfo.sapSkuType =="ZHYJ" || prdInfo.sapSkuType =="ZJXK" || prdInfo.sapSkuType =="ZJXJ")>
<div id="telecom_CPM_box" style="display:none;">
    <div class="telecom_CPM clearfix">
        <h2 class="telecom_tit" id="telecom_tit">请选择你要的号卡</h2>
        <div class="telecom_tool  clearfix">
            <#if (prdInfo.sapSkuType == "ZJXK" || prdInfo.sapSkuType == "ZJXJ")>
                <div class="city telecom_city">
                    <span class="telecom_city_tit">入网地区:</span>
                    <span id="address_dian" class="regon clearfix" data-open="false">
                    <a id="stockaddress_dian" href="javascript:;">请选择<b id="telecom_city_arrow"></b></a>
                </span>
                    <div class="gCitys clearfix">
                        <div class="gCitysarrow"></div>
                        <div id="citySelect_dian" class="gctSelect clearfix"></div>
                        <div id="cityMBox_dian">
                            <div class="gctBox" id="ctbox_1_dian" style="display: block;"></div>
                        </div>
                    </div>
                </div>
            </#if>
            <div class="telecom_box telecom_box1 clearfix">
                <a href="javascript:;" class="telecom_group" id="telecom_group"><b></b>换一组</a>
                <a class="shuxian" href="javascript:;">|</a>
                <a href="javascript:;" class="telecom_seach" id="telecom_seach"><b></b>搜索</a>
            </div>
            <div class="telecom_box telecom_box2 dn">
                <input type="text" class="telecom_tool_input" maxlength="11" value="建议输入2-11位数字">
                <a href="javascript:;" class="telecom_tool_search">搜索</a>
                <span>|</span>
                <a href="javascript:;" class="telecom_tool_close">╳</a>
            </div>
        </div>
        <div class="telecom_cont clearfix">
            <ul id="telecom_table" class="telecom_table"></ul>
        </div>
        <div class="telecom_no dn"><img _src="${storeConfiguration.imageserver!}/telecom_img.png">好可惜，没有您要找的号码，建议尝试其他号码</div>
        <div class="telecom_btn"><a href="javascript:;">确定</a></div>
    </div>
</div>
</#if>

<input type="hidden" id="loadClickjs"/>