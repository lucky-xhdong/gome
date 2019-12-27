<#-- 商品评价、晒单 -->
<div class="detail-section" id="j-comment-section">
    <ul class="ds-hd">
        <li class="cur"><a href="javascript:void(0);">商品评价</a></li>
    </ul>
	<div class="ds-bd">
        <div class="sorceOut clearfix"></div>
        <#-- 评价列表 -->
        <ul class="commentTab dn" id="j-ctTab"></ul>
        <div class="appraiseType  dn">
            <label class="c00"><input type="radio" name="appraiseType" value="cmt1" appraisetypetype="all" checked="checked" /><span>全部评论</span></label>
            <label><input type="radio" name="appraiseType" value="cmt6" appraisetypetype="ordershow"><span></span></label>
			<label><input type="radio" name="appraiseType" value="cmt2" appraisetypetype="good" /><span></span></label>
            <label><input type="radio" name="appraiseType" value="cmt3" appraisetypetype="mid" /><span></span></label>
            <label><input type="radio" name="appraiseType" value="cmt4" appraisetypetype="bad" /><span></span></label>
            <#-- <label><input type="radio" name="appraiseType" value="cmt5" appraisetypetype="validgood" /><span></span></label> -->
            <#if prdInfo.sapSkuType?? && prdInfo.sapSkuType != "ECTZ">
            <label class="curgood-label">
            <input type="radio" name="appraiseType" value="cmt7" appraisetypetype="single">
            <span>只看当前商品评价</span>
	        </label>
            </#if>
            <div class="sort-wrapper" id="sort-wrapper">
	        <a href="javascript:;" class="sort-type">按默认<i class="g-icon-sort-down"></i></a>
	        <ul>
                <em class="tarrow"></em>
	            <li data-type="按时间" data-value="1"><a href="javascript:;">按时间</a></li>
                <li data-type="按默认" data-value="0" class="active"><a href="javascript:;">按默认</a></li>
	        </ul>
            </div>
        </div>
		<#--商品评价部分-->
		<div class="cmt-con"><#include "product_comment.ftl" /></div>
		<#-- 商品晒单  -->
		<div class="ordershow-wrap cmt-con clearfix" style="display:none;">
			<ul class="ordershow-list" id="j-ordershow-list"></ul>
			<div id="page_ordershow" class="page clearfix"></div>
		</div>
    </div>
</div>