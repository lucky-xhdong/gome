<#-- 主信息  商品大图片 -->
<#-- 联营自营区分 -->
<#if iSupport??>
    <#assign iSupportwidth = '450'>
    <#assign iSupportswidth = '60'>
    <#assign iSupportswidth1 = '58'>
    <#assign iSupportpic = 'isupportpic'>
<#else>
    <#assign iSupportwidth = '360'>
    <#assign iSupportswidth = '50'>
    <#assign iSupportswidth1 = '50'>
</#if>

<#assign defaultfirst = "">
<div class="prd-firstscreen-left">
    <div class="magnifier ${iSupportpic!}">
        <div class="pic-big">
            <#if prdInfo.groatepic?? && prdInfo.groatepic?keys?size &gt; 0 >
                <#assign defaupic = "style='display:none'">
                <div class="jqzoom1">
                    <i class="picloding"></i>
                    <span class="roate360"></span>
                    <img width="450" height="450" jqimg="${prdInfo.groatepic["0"]!}_800_pc.jpg"width="${iSupportwidth!}" height="${iSupportwidth!}" gome-src="${prdInfo.groatepic["0"]!}_${iSupportwidth!}.jpg" >
                </div>
            <#else>
                <#if isvidoe??>
                    <div class="video-status"><a href="javascript:;">╳</a></div>
                    <div class="pic-video" id="pic-video"></div>
                    <a class="video-btn" href="javascript:;"></a>    
                </#if>
            </#if>
            <div class="jqzoom" ${defaupic!}>
            <#if prdInfo.goodsImgs?exists && (prdInfo.goodsImgs?size>0)>
                <#list prdInfo.goodsImgs as img>
                    <#if img_index == 0>
                        <#assign defaultfirst = img.src!>
                        <img width="${iSupportwidth!}" height="${iSupportwidth!}" class="j-bpic-b" jqimg="${img.src!}_800_pc.jpg" gome-src="${img.src!}_${iSupportwidth!}.jpg" alt="${prdInfo.name!}">
                        <a title="点击看${prdInfo.name!}大图" target="_blank" href="${img.href!}" class="pic-l-b"></a>
                    </#if>
                </#list>
            </#if>
            </div>
        </div>
        <div class="pic-list j-listroll">
            <div class="pic-btn">
                <a href="javascript:;" class="pic-btn-l"><b class="j-gRbtnU"><s></s></b></a>
                <a href="javascript:;" class="pic-btn-r"><em class="j-gRbtnD"><i></i></em></a>
            </div>
            <div class="pic-small j-gRbox j-pichover clearfix">
                <ul>
                <#if prdInfo.goodsImgs?exists && (prdInfo.goodsImgs?size>0)>
                    <#list prdInfo.goodsImgs as img>
                        <#assign imgIndex=img_index+1 >
                        <#if img_index == 0>
                            <#assign imgtitle = prdInfo.name>
                            <#-- 旋转小图 -->
                            <#if prdInfo.groatepic?? && prdInfo.groatepic?keys?size &gt; 0 >
                                <li>
                                    <a href="javascript:;">
                                        <img width="${iSupportswidth1!}" height="${iSupportswidth1!}" rpic="${prdInfo.groatepic["0"]!}_800_pc.jpg" bpic="${prdInfo.groatepic["0"]!}_${iSupportwidth!}.jpg" gome-src="${prdInfo.groatepic["0"]}_${iSupportswidth!}.jpg" >
                                    </a>
                                </li>
                            </#if> 
                        <#else>
                            <#assign imgtitle = prdInfo.name+"第"+imgIndex+"张高清大图">
                        </#if>
                        <li>
                            <a href="javascript:;">
                                <img width="${iSupportswidth1!}" height="${iSupportswidth1!}" rpic="${img.src!}_800_pc.jpg" bpic="${img.src!}_${iSupportwidth!}.jpg" gome-src="${img.src!}_${iSupportswidth!}.jpg" alt="${imgtitle!}" title="${imgtitle!}">
                            </a>
                        </li>
                    </#list>
                </#if>
                </ul>
            </div>
        </div>
    </div>
    <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType !="ECTZ">
        <div class="toolbar ${iSupportpic!}">
            <span class="product-number" title="${prdInfo.skuNo!}">商品编号：${prdInfo.skuNo!}</span>
            <a class="collect" id="collect" href="javascript:;"><i></i>收藏</a>
            <a class="showWish" id='showWish' href="javascript:;"><i></i>提心愿</a>
            <a class="shareGold" href="javascript:;" share_page="02" share_id="${prdInfo.productId!}" share_typeid="02"><i></i>分享</a>
            
        </div>
    </#if>
    <#-- 供八叉乐使用的隐藏图片地址 -->
    <div id="imgloads" style="display:none"></div>
    <input type="hidden" id="defaultfirst" value="${defaultfirst}"/>
</div>