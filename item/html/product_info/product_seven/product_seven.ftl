<div class="approbated common-approbated">
    <h2 class="approbated-label">售后保障</h2>
    <ul class="pdtl-shmn">
        <li>
            <div class="approbated-content-wrapper">
                <h3>售后内容</h3><i class="icon-approbated-light">icon</i>
            <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ" && page.prdService??>
            <ul class="pedtextbox">
            <#else>
            <ul class="pedtextbox tz-pedtextbox">
            </#if>
            <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ" && page.prdService??>
                <#assign prdService=page.prdService!>
                <li>${prdService.modeInfo!}</li>
            <#else>
                <#if prdPacks?? && prdPacks?size &gt; 0>
                    <#list prdPacks as Sku>
                        <li><h2>${Sku.modeTit!}</h2>${Sku.modeTxt!}</li>
                    </#list>
                </#if>
            </#if>
            </ul>
            </div>
        <#if merchantInfo??>
            <div class="approbated-promise">
                <h3>售后承诺</h3>
                <div class="TH_ico">
                    <ul>
                        <li class="TH_fine_dt">
                            <i class="unprofor">保</i>
                            <p class="TH_fine_h">国美商城服务承诺：</p>
                            <p class="TH_ico_dd">
                                国美商城向您保证所售商品均为正品行货，国美商城自营商品自带机打发票，与商品一起寄送(部分商品，需在您收到货物之后，我司为您邮寄)。凭质保证书及国美商城发票，可享受全国联保服务，与您亲临商场选购的商品享受相同的质量保证。
                                <span>温馨提示：因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，本司不能确保客户收到的货物与商城图片、产地、附件说明完全一致。只能确保为原厂正货！并且保证与当时市场上同样主流新品一致。若本商城没有及时更新，请大家谅解！</span>
                            </p>
                        </li>
                    </ul>
                    <p class="viewlink">查看&nbsp;<a
                            href="//help${storeConfiguration.gomeplusDomain!}/article/324-0-0.html" target="_blank">第三方退换货政策</a>
                    </p>
                </div>
            </div>
        <#else>
            <div class="approbated-promise">
                <h3>售后承诺</h3>
                <div class="TH_ico">
                    <ul>
                        <li class="TH_fine_dt">
                            <i class="goods">正</i>
                            <p class="TH_fine_h">正品行货</p>
                            <p class="TH_ico_dd">国美向您保证所售商品均为正品行货；国美自营商品开具普通发票或电子发票（详情请见发票制度）。</p>
                        </li>
                        <li class="TH_fine_dt">
                            <i class="unprofor">保</i>
                            <p class="TH_fine_h">全国联保</p>
                            <p class="TH_ico_dd">
                                凭质保证书及国美发票，可享受全国联保服务，与您亲临商场选购的商品享受相同的质量保证。国美还为您提供具有竞争力的商品价格<a
                                    href="//help${storeConfiguration.gomeplusDomain!}/article/225-0-0.html"
                                    target="_blank">运费政策</a>，请您放心购买<span>温馨提示：因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，本司不能确保客户收到的货物与商城图片、产地、附件说明完全一致。只能确保为原厂正货！并且保证与当时市场上同样主流新品一致。若国美没有及时更新，请大家谅解！</span>
                            </p>
                        </li>
                        <li class="TH_fine_dt">
                            <i class="Safe_re">退</i>
                            <p class="TH_fine_h">无忧退换货</p>
                            <p class="TH_ico_dd">
                                用户购买国美自营商品，在保证商品完好的前提下，7日内可无理由退货(含7日，自您收到商品次日0点起计算)，15日内可换货。(部分商品除外，详情请见<a
                                    href="//help${storeConfiguration.gomeplusDomain!}/article/307-0-0.html"
                                    target="_blank">退换货政策-自营</a>）</p>
                        </li>
                    </ul>
                </div>
            </div>
        </#if>
            <div class="approbated-service">
                <h3>售后服务</h3>
                <ul>
                    <li><i class="icon-approbated icon-approbated-bao">icon</i><span>家安保 (延长保修 碎屏保修 意外保修)</span></li>
                    <li><i class="icon-approbated icon-approbated-weixiu">icon</i><span>专业维修</span></li>
                    <li><i class="icon-approbated icon-approbated-huishou">icon</i><span>家电回收</span></li>
                    <li><i class="icon-approbated icon-approbated-qingxi">icon</i><span>家电清洗</span></li>
                    <li><i class="icon-approbated icon-approbated-anzhuang">icon</i><span>上门安装</span></li>
                </ul>
            </div>
            <div class="price-explanation">
                <h3>价格说明：</h3>
                <ul>
                    <li><span>未划线价格：</span>该价格是商品的销售标价，最终成交价格可能会因使用优惠券等原因而发生变化，请以订单结算页面价格为准。</li>
                    <li><span>划线价格：</span>该价格是商品的参考价，可能是商品的厂商指导价、正品零售价、商品吊牌价、品牌专柜价，或者是在国美平台上曾经展示过的销售价等价格,仅供您选购商品时参考。</li>
                    <li><span>其他：</span>1.商品促销信息以商品详情页促销栏目中的信息为准；2.如您发现活动商品售价或促销信息有异常，请购买前先联系销售商咨询。</li>
                </ul>
            </div>
        </li>
        <li class="pdtl-s">
        </li>
    </ul>
<#if page.seoShowLinks?? && page.seoShowLinks?size &gt; 0>
    <#assign seoShowLinks=page.seoShowLinks!>
    <div class="seohotlinks_wrap">
        <div class="seohotlinks_tag">热门链接：</div>
        <div class="seohotlinks">
            <#list seoShowLinks as item>
                <a href="${item.href!}" title="${item.title!}" target="_blank">${item.title!}</a>
            </#list>
        </div>
    </div>
</#if>
<#if page.hotWords?? && page.hotWords.html?? && page.hotWords.html?size &gt; 0>
    <#assign hotWords=page.hotWords.html!>
    <div class="hotwords">
        <div class="bd clearfix">
            <#list hotWords as item>
                <a href="${item.hotwordsUrl!}" title="${item.title!}" target="_blank">${item.title!}</a>
            </#list>
        </div>
    </div>
</#if>
<#if page.seoNoShowLinks?? && page.seoNoShowLinks?size &gt; 0>
    <#assign seoNoShowLinks=page.seoNoShowLinks!>
    <div style="display:none">
        <#list seoNoShowLinks as item>
            <a href="${item.href!}">${item.title}</a>
        </#list>
    </div>
</#if>
</div>