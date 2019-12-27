<#-- 面包屑 -->
<div class="item-title clearfix">
    <#if page.bread?? && page.bread?has_content>
        <#import "prdbig_breadcrumb.ftl" as breadInfo>
        <@breadInfo.prdBread breadData=page.bread homePage=false />
    </#if>
    <a rel="nofollow" href="${prdInfo.detailHref!}" class="backtod"><span>返回商品页 ></span></a>
</div>

<div class="main clearfix">
    <#-- 左侧大图 -->
    <div class="tip-L">
        <div class="bigImg-warp">
            <span id="js-prev" class="prev" title="点击查看上一张"></span>
            <span id="js-next" class="next" title="点击查看下一张"></span>
        <#if prdInfo.goodsImgs?? && (prdInfo.goodsImgs?size>0)>
            <#list prdInfo.goodsImgs as img>
                <#if img_index==0>
                    <img id="img" src="${img.src!}_800_pc.jpg" alt="${img.alt!}" width="790" height="790" />
                </#if>
            </#list>
        </#if>
        </div>
        <p class="ntc">请注意：实际产品会因为批次的不同可能与网站的图片不一致，以收到的实物为准。图片仅供参考。</p>
    </div>

    <#-- 右侧小图、价格、购物车、评价咨询等信息 -->
    <div class="tip-R">
        <div class="smallImg-warp">
            <#-- 右侧小图、价格、购物车 -->
            <div class="thumbs-warp">
                <div class="thumbs-inner clearfix j-gRbox" id="js-thumbs">
                    <div class="thumbs-imgbox">
                    <ul class="tip-thumbs">
                    <#if prdInfo.goodsImgs?? && (prdInfo.goodsImgs?size>0)>
                        <#list prdInfo.goodsImgs as img>
                            <#if img_index == 0>
                                <li class="current">
                                    <a href="javascript:;"><img src="${img.src!}_60.jpg" width="80" alt="${prdInfo.name!}${(breadName.href)!}第${img_index+1}张高清大图" title="${prdInfo.name!}${(breadName.href)!}第${img_index+1}张高清大图" height="80" samesrc="${img.src!}" /><b></b></a>
                                </li>
                            <#else>
                                <li>
                                    <a href="javascript:;"><img src="${img.src!}_60.jpg" width="80" alt="${prdInfo.name!}${(breadName.href)!}第${img_index+1}张高清大图" title="${prdInfo.name!}${(breadName.href)!}第${img_index+1}张高清大图" height="80" samesrc="${img.src!}" /></a>
                                </li>
                            </#if>
                            <#if (img_index+1) % 6 == 0 && prdInfo.goodsImgs?size!=(img_index+1)>
                            </ul><ul class="tip-thumbs">
                            </#if>
                        </#list>
                    </#if>
                    </ul>
                    </div>
                </div>

                <div class="thumbPannel clearfix">
                    <a class="tip-thumbPrev j-gRbtnU" href="javascript:void(0);"></a>
                    <div class="thumbs-num"><em class="curnum j-gRnumC" id="js-curPage">1</em>/<em id="js-pages" class="j-gRnumT">3</em></div>
                    <a class="tip-thumbNext j-gRbtnD cur" href="javascript:void(0);"></a>
                </div>

                <div id ="price" class="price-bigimg"></div>
            <#if prdInfo.sapSkuType?? &&(prdInfo.sapSkuType =="ZHK" || prdInfo.sapSkuType =="ZLH" ||  prdInfo.sapSkuType =="ZHYJ" || prdInfo.sapSkuType =="ZJXK" || prdInfo.sapSkuType =="ZJXJ" || prdInfo.sapSkuType =="ZZP")>
            <#else>
                <a id="choose-pay" class="choosepay" href="javascript:;">加入购物车</a>
            </#if>

                <p class="xq"><a href="${prdInfo.detailHref!}">查看商品详情<b></b></a></p>
            </div>

            <#-- 最新评价、最新咨询 -->
            <div class="items-box">
                <div class="items-hd">
                    <a href="javascript:;" class="topic clearfix j-new" title="展开">
                        <h2><i>最新评价</i><span><b></b><s></s></span></h2>
                    </a>
                </div>
                <div class="items-hd">
                    <a href="javascript:;" class="topic clearfix j-new" title="展开">
                        <h2><i>最新咨询</i><span><b></b><s></s></span></h2>
                    </a>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="wbox">
    <#-- 根据浏览猜你喜欢 -->
    <div id="mboxDynamicFoot" class="guess-enjoy clearfix">
    </div>

    <#-- 热词关键词 -->
    <div class="gm-hotwords"></div>

    <#-- 一句话简介 -->
    <div class="gm-helper"></div>

</div>
