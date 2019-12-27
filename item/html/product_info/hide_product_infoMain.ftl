<#-- 商品其他模块 -->
<div class="wbox" id="gm-other-info">

    <div class="dt-main">

        <#-- 优惠套装、推荐配件 -->
		<#include "product_recommFittings.ftl" />

		<#-- 商品描述、参数、包装配送等 -->
		<#include "hide_product_detailInfo.ftl" />

		<#-- 售后保障 -->
		 <#include "product_seven/hide_product_seven.ftl" />

		<#-- 商品评价、晒单 -->
		<#include "product_appraise.ftl" />
		
		<#-- 商品咨询 -->
		<#include "product_consult.ftl" />

    </div>
    <div class="dt-side">
        <#-- 左侧栏推荐项目 -->
		<#include "hide_product_dtSider.ftl" />
    </div>

</div>


<#include "include/hideproduct_dialogBox.ftl" />


