<div class="approbated common-approbated">
    <h2 class="approbated-label">售后保障</h2>
    <ul class="pdtl-shmn">
        <li>
            <div class="approbated-promise">
                <h3>售后承诺</h3>
                <div class="TH_ico">
                    <ul>
                        <li class="TH_fine_dt">
                            <i class="unprofor">保</i>
                            <p class="TH_fine_h">国美商城服务承诺：</p>
                            <p class="TH_ico_dd">
                                国美商城向您保证所售商品均为正品行货，国美商城自营商品自带机打发票，与商品一起寄送(部分商品，需在您收到货物之后，我司为您邮寄)。凭质保证书及国美商城发票，可享受全国联保服务，与您亲临商场选购的商品享受相同的质量保证。<p>温馨提示： 因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，本司不能确保客户收到的货物与商城图片、产地、附件说明完全一致。只能确保为原厂正货！并且保证与当时市场上同样主流新品一致。若本商城没有及时更新，请大家谅解！</p>
                            </p>
                        </li>
                    </ul>
                    <p class="viewlink">查看&nbsp;<a href="//help.gome.com.cn/article/324-0-0.html" target="_blank">第三方退换货政策</a>
                    </p>
                </div>
            <#--<b class="pdtl-tit">国美商城服务承诺：</b>-->
            <#--<p>-->
            <#--国美商城向您保证所售商品均为正品行货，国美商城自营商品自带机打发票，与商品一起寄送(部分商品，需在您收到货物之后，我司为您邮寄)。凭质保证书及国美商城发票，可享受全国联保服务，与您亲临商场选购的商品享受相同的质量保证。-->
            <#--</p>-->
            </div>
        <#--<div class="pdtl-peisong">-->
        <#--<a target="_blank" rel="nofollow" href="//help.gome.com.cn/question/9.html">配送范围查询</a><span>|</span><a target="_blank" rel="nofollow" href="//help.gome.com.cn/question/9.html">配送收费标准</a>-->
        <#--</div>-->
        </li>
        <li class="pdtl-s">
        <#--<b class="pdtl-red">声明：</b>-->
        <#--<br>因厂家会在没有任何提前通知的情况下更改产品包装、产地或者一些附件，本司不能确保客户收到的货物与商城图片、产地、 附件说明完全一致。只能确保为原厂正货！并且保证与当时市场上同样主流新品一致。若本商城没有及时更新，请大家谅解！-->
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