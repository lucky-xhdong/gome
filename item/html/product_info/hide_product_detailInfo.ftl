<#-- 商品描述、参数、包装配送等 -->
<div id="prdDesc" class="prdDescOut">
    <div id="gfixed"></div>
	<div id="fixtabox" class="pdtl-tab j-fixtg">
		<ul class="prdtitbox" id="prd_tbox">
	    	<li class="cur"><a href="javascript:;">商品详情</a></li>
	    	﻿<#if prdInfo.threeDflag>
	    	<li id="threeD_show"><a href="javascript:;">场景展示<span class="detail3d_title">3D</span></a></li>
	    	</#if>
            <li><a href="javascript:;">规格与包装</a></li>
	        <#--<li><a href="javascript:;" id="dtlReview">商品测评</a></li>-->
	        <li><a href="javascript:;" class="pingjia_header">商品评价</a></li>
	        <#--<li><a href="javascript:;">包装与配送</a></li>-->
	        <li><a href="javascript:;">售后保障</a></li>
	        <li><a href="javascript:;">小助手</a></li>
	    </ul>
    </div>
	<ul class="pedmainbox" id="prd_data">
    	<li>
    	<#-- 规格参数-->	 
		   <#if page.prdDescSpec?exists && (page.prdDescSpec?size>0)>	 
		   <div class="guigecanshu_wrap">
			  	<#list page.prdDescSpec as spinfo>   
				<div class="guigecanshu" title="${spinfo.modeInfo!}">${spinfo.modeTxt!}：${spinfo.modeInfo!}</div>  
				</#list>
               <p id="more-param" class="more-param"><a href="javascript:;">更多参数 ></a></p>
            </div>
			</#if>
        </li>
        <#--3d-->
        <#if prdInfo.threeDflag>
	    <li id='detail3d_list'>
	    <div id="no_yangbanjian" >
	    	 <p class="no_yangbanjian_text">该商品暂无样板间展示！</p>
	    	 <p class="no_yangbanjian_link"><a href="//home.gome.com.cn/space.html">去看一看其他样板间</a></p>
	    </div>
	    <ul id="ul3d"></ul>
	    </li>
	    </#if>
        <li><#include "include/hideproduct_infoSpec.ftl" /></li>
        <#--<li class="prdReview"><div style="display:block;" class="loading pt10" ></div></li>-->
        <li></li>
        <#--<li><#include "include/hideproduct_infoPack.ftl" /></li>-->
        <li>
        <#include "include/hideproduct_infoService.ftl" />
        </li>
        <li id="helper"><#include "include/hideproduct_infoHelper.ftl" /></li>
    </ul>
</div>