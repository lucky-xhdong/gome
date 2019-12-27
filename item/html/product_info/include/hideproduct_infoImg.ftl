<#-- 主信息  商品大图片 -->
<#assign defaultfirst = "">
<div class="prd-images fl"><div class="magnifier">
		<div class="pic-big">
			<div class="jqzoom">
				<#if prdInfo.goodsImgs?exists && (prdInfo.goodsImgs?size>0)>
					<#list prdInfo.goodsImgs as img>
						<#if img_index == 0>
						<#assign defaultfirst = img.src!>
							<img width="360" height="360" class="j-bpic-b" jqimg="${img.src!}_800_pc.jpg" gome-src="${img.src!}_360.jpg" src="${imgslod}" alt="${prdInfo.name!}">
		 					<a title="点击看${prdInfo.name!}大图" target="_blank" href="${img.href!}" class="pic-l-b"><em class="showbig"></em></a>
 						</#if>
 					</#list>
				</#if>
			</div>
		</div>
		<div class="pic-list j-listroll">
			<div class="pic-btn">
				<a href="javascript:;" class="pic-btn-l"><b class="j-gRbtnU"><s></s></b></a> 
				<a href="javascript:;" class="pic-btn-r"><em class="j-gRbtnD cur"><i></i></em></a>
			</div>
			<div class="pic-small j-gRbox j-pichover clearfix">
				﻿<#if prdInfo.threeDflag><div id="detail3DLink" class="pic-3d-link"></div></#if>
				<ul>
				<#if prdInfo.threeDflag><li><a href="javascript:;"><img width="50" height="50" rpic="${imgslod}" bpic="${imgslod}" gome-src="${imgslod}" src="${imgslod}"></a></li></#if>
				<#if prdInfo.goodsImgs?exists && (prdInfo.goodsImgs?size>0)>
					<#list prdInfo.goodsImgs as img>
                        <#assign imgIndex=img_index+1 >
                        <#if img_index == 0>
                            <#assign imgtitle = prdInfo.name>
                        <#else>
                            <#assign imgtitle = prdInfo.name+"第"+imgIndex+"张高清大图">
                        </#if>
                        <li>
                            <a href="javascript:;">
                                <img width="50" height="50" rpic="${img.src!}_800_pc.jpg" bpic="${img.src!}_360.jpg" gome-src="${img.src!}_50.jpg" src="${img.src!}_50.jpg" alt="${imgtitle!}" title="${imgtitle!}">
                            </a>
                        </li>
 					</#list>
				</#if>
				</ul>
			</div>
		</div>
	</div>
	
	<#-- 对比 && 分享 -->
	<#if prdInfo.sapSkuType?? && prdInfo.sapSkuType !="ECTZ">
	<div class="sharebox opt-box clearfix">
		<span class="shareDB">
			<input type="checkbox" value="0" id="shareChk" class="compare shareChk display-page-compare-checkbox" style="margin-left:24px" sid="${(prdInfo.sku)!}" pid="${(prdInfo.productId)!}"/>
            <label for="shareChk">对比</label>
            <span class="shareLine"> </span>

			<span class="shareGold"><img src='${imgslod}' width=16 height=25 _src="${imgsbmg!}/ui/gold.gif"><a href="javascript:;">分享拿提成</a></span>

            <span id ='showWish'>
                <i></i>&nbsp;提心愿
            </span>

            <span  id="collect">
                <i></i>
                <a href="javascript:;" class="collect">收藏<#if prdInfo.threeDflag>3D</#if></a>
            </span>

        </span>
		<#-- 百度分享开始 
		<div class="bdsharebuttonbox" style="display:none;">
			<a href="#" class="bds_more" data-cmd="more"></a>
			<a title="分享到QQ空间" href="#" class="bds_qzone" data-cmd="qzone"></a>
			<a title="分享到新浪微博" href="#" class="bds_tsina" data-cmd="tsina"></a>
			<a title="分享到腾讯微博" href="#" class="bds_tqq" data-cmd="tqq"></a>
			<a title="分享到微信" href="#" class="bds_weixin" data-cmd="weixin"></a>
			<a title="分享到人人网" href="#" class="bds_renren" data-cmd="renren"></a>
		</div>
		 百度分享结束 -->
	</div>
	</#if>
	<textarea id="templateCompare" style="display:none;">
		<ul  class="clearfix" >
		    <% for(var i=0,l=items.length; i<l; i++){ %>
		    <li class="compare-items add">
		       <p class="pic">
		           <a target="_blank" href="<%= items[i].pUrl %>" title="<%= items[i].pName %>">
		           <img alt="<%= items[i].pName %>" src="<%= items[i].pImg %>_50.jpg"></a>
		       </p>
		       <p class="name">
		       <a target="_blank" title="<%= items[i].pName %>" href="<%= items[i].pUrl %>"><%= items[i].pName %></a></p>
		       <p class="price-wrap">
		           <span class="price">¥<%= items[i].price %></span>
		           <a class="del" onclick="javascript:del(this);" sid="<%= items[i].skuId %>" pid="<%= items[i].pId %>" track="对比栏:删除" href="javascript:;" style="display:none;">删除</a>
		       </p>
		       <s></s>
		    </li>
		    <%
		    }
		    %>
		</ul>
	</textarea>
<#-- 供八叉乐使用的隐藏图片地址 -->
<input type="hidden" id="defaultfirst" value="${defaultfirst}"/>
</div>