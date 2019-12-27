 <#if skuAnchorPoint?? && skuAnchorPoint.skuAnchorPointInfo??>
     <div class="slider-nav">
     <#list skuAnchorPoint.skuAnchorPointInfo as skuAnchorPointInfo>
     	<#if skuAnchorPointInfo_index==0>
     		<a href="javascript:;" class="cur" data-rel="#${skuAnchorPointInfo.anchorId!}"><i></i>${skuAnchorPointInfo.title!}</a>
     	<#else>
     		<p></p>
	     	<a href="javascript:;" data-rel="#${skuAnchorPointInfo.anchorId!}"><i></i>${skuAnchorPointInfo.title!}</a>
     	</#if>
     </#list>
     </div>
 </#if>