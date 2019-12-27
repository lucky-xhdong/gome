{{if $config.isGomeShop(shop.shopId) && oneCommerceItemsGroup.promotionHeads && oneCommerceItemsGroup.promotionHeads.length}}
<div class="cart-item-line"></div>
{{/if}}
<div class="cart-col-1
		{{if good.commerceitemVOFlag !== "SUB"}}
			{{if $config.isGomeShop(shop.shopId) && oneCommerceItemsGroup.promotionHeads && oneCommerceItemsGroup.promotionHeads.length}}
			{{else}}
					border-top
			{{/if}}
		{{/if}}">
	{{if good.commerceitemVOFlag == "SUB"}}
	<!-- 子商品没有勾选 -->
	<div class="c-i  {{if !good.selected }} dotgrey {{else}} dot {{/if}}"></div>
	{{else hasCheckbox}}
		{{if good.commerceItemStatus &&  good.commerceItemStatus[0] === 'presell'}}
			<span class="" style="color:#ff5757">预售</span>
		{{else}}
			<div
					act-check-item
					gui-checkbox
					gui-class-unchecked="good-checkboxs-no"
					gui-class-checked="c-i checkbox_chose"
					gui-class-disabled="no_check"
					data-cid="${good.itemId}"
					class="{{if good.showDisabled}}good-checkboxs-gray{{/if}}"
			>
				<input
						type="checkbox"
						name="good"
						path="${is}.commerceItemsGroups.${ig}.commerceItemsGroup.${iog}"
						{{if good.selected }}checked{{/if}}
				value="${good.itemId}"
				{{if !hasDeleteArea || good.commerceitemVOFlag =="SUB"}}
				data-save="false"
				{{else}}
				data-save="true"
				{{/if}}
				{{if good.showDisabled}}
				disabled
				{{/if}}
				>
			</div>
			{{/if}}
	{{else}}
	&nbsp;
	{{/if}}
</div>
<div class="cart-col-2"  style="height: 82px;">
	<a href="${good.itemURL}{{if good.meidianId && good.meidianId != null}}?mid=${good.meidianId}{{/if}}" target="_blank" class="g-img">
		{{if good.itemImageURL}}
		<img src="${good.itemImageURL}" alt="">
		{{/if}}
		{{if  $config.isHomeSite() && good.itemPromotionInfo && good._isCount}}
			<div class="img-title">
				<span class="img-time-title">${$config.countDownTitle(good)}</span>
			</div>
			<div class="img-time">
				剩<span class="img-time-count js-countdown-${good.skuId}">${good._tipCount}</span>
			</div>
		{{/if}}
	</a>
</div>
<div class="fl">
	<div class="clearfix">
		<div style="" class="cart-col-3">
			<div  class="cart-good-name">
				{{if good.cType=='HWG'}}
				<i class="c-i hwg" title="海外购商品"></i>
				{{/if}}
				<a href="${good.itemURL}{{if good.meidianId && good.meidianId != null}}?mid=${good.meidianId}{{/if}}" target="_blank" title="${good.itemName}">
					{{if good.commerceitemVOFlag == "SUB" }}
					{{if oneCommerceItemsGroup.promotionHeads[0] }}
					{{if oneCommerceItemsGroup.promotionHeads[0][0].type!="DPG" && oneCommerceItemsGroup.promotionHeads[0][0].type!="JJHG"}}
						<span class="sub-name-title">赠品</span>
					{{else  oneCommerceItemsGroup.promotionHeads[0][0].type=="JJHG"}}
						<span class="sub-name-title">换购品</span>
					{{/if}}
					{{/if}}
					{{/if}}
					{{if good.belonging && good.belonging=='QQBH'}}
					<span class="sub-name-title">全球购超市</span>
					{{/if}}
					${ $config.limitStr(good.itemName, 52) }
				</a>
			</div>
			<div class="support-server clearfix">
				{{if $config.isNotI7n(good.serviceTagFlag)}}
					<i class="c-i seven_no border-radius-icon" title="不支持7天无理由退货"> </i>
				{{/if}}
				{{if $config.isI7n(good.serviceTagFlag)}}
					<i class="c-i seven border-radius-icon" title="支持7天无理由退货"></i>
				{{/if}}
				{{if good.meidianId && good.commerceitemVOFlag != "SUB" }}
				<!--赠品不显示美店-->
					<a href="${$config.splitUrl(good.itemURL, good.meidianId)}" target="_blank" class="c-i  meidian mei-dian-${good.meidianId}"
					   title=""></a>
				{{/if}}
			</div>

			<!--start 增值服务选择框模板-->
			{{html GTPL.warranty_selectBox({meidianId:good.meidianId,good:good,config:$config.warrantyAtom})}}
			<!--end 增值服务选择框模板-->
		</div>
		<!--sales property -->
		{{html GTPL.cart_saleprops({good:good})}}
		<!--sales property -->

		<div class="cart-col-4 cart-price-height47">
			<div class="cart-good-real-price ">
				{{if good.listPrice &&　good.listPrice == -1}}
					暂无售价
				{{else}}
					{{if good.commerceitemVOFlag === 'SUB' && (promotionHead[0].type ==="I_ZE_GIFTS"|| promotionHead[0].type ==="MUL_ZE_GIFTS" ) }}<!--子品-->
					¥&nbsp;${parseFloat(good.listPrice).toFixed(2) || 0}
					{{else}}<!--主品-->
					¥&nbsp;${parseFloat(good.salePrice ).toFixed(2) || 0}
					{{/if}}
				{{/if}}

			</div>
			{{if good.reducePrice}}
			<div class="downPriceBox pr" shipfee-dec>
				<div class="cart-good-down-price">降价：<span class="downPrice">¥<span>${parseFloat(good.reducePrice).toFixed(2) || '0.00'}</span></span></div>
				<!--降价对应浮层-->
				<div class="downPriceTit box-sd1 pabs hide shipfee-tip-pop">
					<div class="shipfee-tip-ab"><em>&#9670;</em><span>&#9670;</span></div>
					<div class="shipfee-tip-txt">商品比加入购物车时降价 ¥${parseFloat(good.reducePrice).toFixed(2) || '0.00'}</div>
				</div>
			</div>
			{{/if}}
			{{if good.priceType}}
			<div class="red">
				${good.priceType == "MEMBER" ? "会员价" : good.priceType == "INTERNAL_PURCHASE" ? "内购价" : ""}
			</div>
			{{/if}}
			{{if good.promotions && good.promotions.length}}
			{{if $config.isGomeShop(shop.shopId)}}
			<div class="cart-coupon cart-prom"
				 act-good-prom
				 {{if siteName!='secondHand' && good.inventoryState == "OFF"}}
			{{else}}
			gui-popup
			{{/if}}
			gui-popup-animate="1"
			gui-popup-toggle="1"
			>
			<div class="cart-coupon-trigger">
				修改优惠
				<i class="c-i  arrowdown_red"></i>
			</div>
			<div class="cart-coupon-box" gui-popupbox>
				<div gui-popupbox-animate>
					<div class="cart-box-arrow">
						<i>◆</i><i class="cart-arrow-cover">◆</i>
					</div>
					<div class="cart-box-border">
						<div class="cart-coupon-items border-none">
							{{each(i, promotion) goodPromotionLe10}}
							<dl class="clearfix">
								<dt>
									<input type="radio"  name="cart-coupon${iogcoupon}"
										   {{if promotion.selected}}
										   checked
										   data-default="true"
										   {{/if}}
									value="${promotion.proId}"
									>
								</dt>
								<dd class="coupon-item-right">
									${promotion.label}
								</dd>
							</dl>
							{{/each}}
							<div style="display:none;" class="promotionGt10">
								{{each(i, promotion) goodPromotionGt10}}
								<dl class="clearfix" >
									<dt>
										<input type="radio"  name="cart-coupon${iogcoupon}"
											   {{if promotion.selected}}
											   checked
											   data-default="true"
											   {{/if}}
										value="${promotion.proId}"
										>
									</dt>
									<dd class="coupon-item-right">
										${promotion.label}
									</dd>
								</dl>
								{{/each}}
							</div>
							<div>
								{{if goodPromotionEnd}}
								<dl class="clearfix" >
									<dt>
										<input type="radio"  name="cart-coupon${iogcoupon}"
											   {{if goodPromotionEnd.selected}}
											   checked
											   data-default="true"
											   {{/if}}
										value="${goodPromotionEnd.proId}"
										>
									</dt>
									<dd class="coupon-item-right">
										${goodPromotionEnd.label}
									</dd>
								</dl>
								{{/if}}
							</div>
							{{if good.promotions.length>10}}
							<a href="javascript:;" class="promotion-more" act-promotion-gt10>
								<span>更多</span>
								<i class="c-i arrowdown" style="margin-top:5px;"></i>
							</a>
							{{/if}}
							<div class="cart-coupon-btns cart-box-group-a">
								<a href="javascript:;" class="cart-btn" style="margin-right:20px;" gui-popupclose>取消</a>
								<a href="javascript:;" class="cart-btn cart-red-bg"  style="margin-right:0px;"
								   gui-popupclose
								   act-claimGomePromotion
								   data-cpid="${good.itemId}"
								>确认</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		{{else}}
		<div class="red">
			多买优惠
		</div>
		{{/if}}
		{{/if}}
	</div>
	<div class="cart-col-5">
        {{if hasChangeCount && good.commerceitemVOFlag != "SUB"}}
            {{if promotionHead[0] && promotionHead[0].type && promotionHead[0].type == "DPG"}}
                {{if $config.isNotYyqg(good.reserveStatus) && !good.showDisabled}}
                    <div gui-count
                         {{if $config.isProductSelected(good,siteName)}}
                            gui-count-disabled="true"
                         {{/if}}
                        click-document-pre
                        gui-count-min="1"
                        gui-count-animate="1"
                        gui-count-change-interval="1000"
                        act-change-count
                        data-cid="${good.itemId}"
                        data-limit="${good.limitNum}"
                        class="gui-count cart-count"
						data-sku="${good.skuId.toLowerCase()}"
                        data-limit-${good.skuId.toLowerCase()}-${good.productId.toLowerCase()}="${good.limitNum}"
                    >
                    <input dytest class="dytest {{if $config.isProductSelected(good,siteName)}}gui-count-disabled{{/if}}" type="text" value="${good.quantity}">
                    </div>
                    {{html $config.tuanNum(good)}}
                    {{if good.itemId==$config.cartAtom.limitTip}}
                        {{html $config.enoNum(good.limitNum,0)}}
                    {{else}}
                        {{html $config.enoCart(promotionHead[0])}}
                    {{/if}}
                {{else}}
                    <div>${good.quantity}</div>
                {{/if}}
            {{else}}
                {{if $config.isNotYyqg(good.reserveStatus)}}
                    <div gui-count
                         {{if $config.isProductSelected(good,siteName)}}
                         gui-count-disabled="true"
                         {{/if}}
                        click-document-pre
                        gui-count-min="1"
                        gui-count-animate="1"
                        gui-count-change-interval="1000"
                        act-change-count
                        data-cid="${good.itemId}"
                        data-limit="${good.limitNum}"
						data-sku="${good.skuId.toLowerCase()}"
                        class="gui-count cart-count"
                        data-limit-${good.skuId.toLowerCase()}-${good.productId.toLowerCase()}="${good.limitNum}"
                    >
                    <input dytest class="dytest {{if $config.isProductSelected(good,siteName)}}gui-count-disabled{{/if}}" type="text" value="${good.quantity}">
                    </div>
                    {{html $config.tuanNum(good)}}
                    {{if good.itemId==$config.cartAtom.limitTip}}
                        {{html $config.enoNum(good.limitNum,0)}}
                    {{else}}
                        {{html $config.enoCart(promotionHead[0])}}
                    {{/if}}
                {{else}}
                    <div>${good.quantity}</div>
                {{/if}}
            {{/if}}
        {{else}}
            <div>${good.quantity}</div>
        {{/if}}

	{{html cartApp.itemState(good)}}
	{{if good.inventoryState != "NO_GOODS"}}
        {{if siteName!='secondHand' && good.limitBuyGoods}}
        <div class="red">
            限购${good.limitNum}件
        </div>
        {{/if}}
	{{/if}}

	{{if good.onTheRoad}}
	<div class="green">
		在途
	</div>
	{{/if}}
	{{if good.inventoryState == 'NO_PERMISSION_BUY'}}
	<div class="red">
		无权购买
	</div>
	{{/if}}

    {{if good.inventoryState !== "NO_GOODS" && good.inventoryState !== "NO_JURISDICTION" && good.inventoryState !== "OFF"&& good.inventoryState !== 'NO_PERMISSION_BUY'}}
        {{if good.reserveStatus == 'YY' || good.reserveStatus == "YYWYY"}}
        <div class="red">
            预约中
        </div>
        {{else good.reserveStatus == 'QG' || good.reserveStatus == 'QGWYY'}}
        <div class="red">
            预约抢购中
        </div>
        {{else good.reserveStatus == 'QGQ' || good.reserveStatus == 'QGQWYY'}}
        <div class="red">
            预约待开抢
        </div>
        {{/if}}
    {{/if}}
</div>
<div class="cart-col-6 ">
	{{if  good.commerceitemVOFlag == "SUB" && (promotionHead[0].type ==="I_ZE_GIFTS"|| promotionHead[0].type ==="MUL_ZE_GIFTS" )  }}
	{{else}}
	<div class="cart-good-amount">
		¥&nbsp;${$config.formatAmount(good.amount)}
		{{if  $config.isShowTuanTitle(good)}}
			<span shipfee-dec>
				<i class="c-i attention" style="vertical-align: sub;"></i>
				<div class="pr fee-pop-c" style="z-index: 99;">
				<div class="hide box-sd1 pabs shipfee-tip-pop eno-tuan-tip fl"
					style="" >
					商品${$config.countDownTitle(good)}购价为¥${parseFloat(good.salePrice).toFixed(2) || 0}，限购${good.itemPromotionInfo.limitNum}件,超出后将全部按国美价计算
				</div>
			</div>
			</span>

		{{/if}}
	</div>
	{{/if}}
	<!-- 重量展示(只展示全球百货的重量) -->
	{{if good.belonging && good.belonging == "QQBH" && good.suttle && $config.formatAmountSuttle(good.suttle) > 0}}
	<div class="cart-good-suttle cart-good-amount">${$config.formatAmountSuttle(good.suttle)} kg</div>
	{{/if}}
</div>
</div>
<div class="cart-good-box">
<!--选中增值服务列表-->
{{html GTPL.warranty_list({good:good,config:$config.warrantyAtom})}}
<!--预约-->
{{if good.reserveStatus && good.inventoryState !== "NO_GOODS" && good.inventoryState !== "NO_JURISDICTION" && good.inventoryState !== "OFF"}}
    <div class="yyrh-tip {{if good.showDisabled && good.reserveStatus !== 'YYWYY'}}good-checkboxs-opa{{/if}}">
        {{if good.reserveStatus == "YY"}}
            <span class="yyrh-mark">预约</span><span class="yyrh-cont">此商品正在预约中，预约后才可购买！</span>
        {{else good.reserveStatus == "YYWYY"}}
            <span class="yyrh-mark">预约</span><span class="yyrh-cont">此商品正在预约中，预约后才可购买！</span>
            <a href="${good.itemURL}" class="gobuy" target="_blank">去预约 <i class="arr-r">></i></a>
        {{else good.reserveStatus == "QGQ" && good._isCountYyqg}}
            <span class="yyrh-mark">预约</span><span class="yyrh-cont yyrh-cont-${good.skuId}"></span>
        {{else good.reserveStatus == "QGQWYY"}}
            <span class="yyrh-mark">预约</span><span class="yyrh-cont">您未预约此商品，暂不可购买！</span>
        {{else good.reserveStatus == "QG"}}
            <span class="yyrh-mark">预约</span><span class="yyrh-cont">您预约的商品正在抢购中，请尽快购买！</span>
            {{if $config.isbrand(shop.shopId)}}<a href="${good.itemURL}" class="gobuy" target="_blank">去抢购 <i class="arr-r">></i></a>{{/if}}
        {{else good.reserveStatus == "QGWYY"}}
            <span class="yyrh-mark">预约</span><span class="yyrh-cont">您未预约此商品，暂不可购买</span>
        {{else good.reserveStatus == "QGCF"}}
            <span class="yyrh-mark">预约</span><span class="yyrh-cont">您已参加预约活动，不能重复购买！</span>
        {{/if}}
    </div>
{{/if}}
<!--赠品-->
{{if good._commerceItemVOs && good._commerceItemVOs.length}}


<div style="position:relative">
	{{each(i, gift) good._commerceItemVOs}}
	{{if i<2}}
	{{if gift.itemURL}}
	<div class="clearfix cart-warranty-item">
			<div class="cart-col-3  " >
				<a href="${gift.itemURL}" target="_blank"
				   title="【赠品】${gift.itemName} X${gift.quantity}"
				   class="cart-good-info text-overflow-ellipsis203 i-block margin-left_92" style="margin-top:0">
					【赠品】${gift.itemName}
				</a>

				<div class="fr i-block">
					{{if gift.inventoryState =="NO_GOODS"}}
							无货
						{{else}}
							<span >X${gift.quantity}</span>
					{{/if}}
				</div>
			</div>
	</div>
	{{else}}
	<div class="cart-good-info clearfix" style="margin-top: -5px;">
		{{if gift.ct ==='DO' }}
		[返豆]返${gift.quantity}美豆
		{{else}}
		[返券]返${$config.labelsCouponType[gift.ct]}¥${parseFloat(gift.couponUnitPrice).toFixed(2)}x${gift.quantity}
		{{/if}}
	</div>
	{{/if}}
	{{/if}}
	{{/each}}
	{{if good._commerceItemVOs._isMore }}
	<a class="js-more-btn btn-more-box" href="javascript:"  act-gifts-more>
		显示更多<i class="c-i arrow-bottom"></i>
	</a>
	{{/if}}
	<div style=";display: none" class="js-more-box">
		{{each(i, gift) good._commerceItemVOs}}
		{{if i>=2}}
		{{if gift.itemURL}}
		<div class="clearfix cart-warranty-item">
			<div class="cart-col-3  " >
				<a href="${gift.itemURL}" target="_blank"
				   title="【赠品】${gift.itemName} X${gift.quantity}"
				   class="cart-good-info text-overflow-ellipsis203 i-block margin-left_92" style="margin-top:0">
					【赠品】${gift.itemName}
				</a>

				<div class="fr i-block">
						{{if gift.inventoryState =="NO_GOODS"}}
							无货
						{{else}}
							<span >X${gift.quantity}</span>
						{{/if}}
				</div>
			</div>
		</div>
		{{else}}
		<div class="cart-good-info clearfix" style="margin-top: 0;">
			{{if gift.ct ==='DO' }}
			[返豆]返${gift.quantity}美豆
			{{else}}
			[返券]返${$config.labelsCouponType[gift.ct]}¥${parseFloat(gift.couponUnitPrice).toFixed(2)}x${gift.quantity}
			{{/if}}
		</div>
		{{/if}}
		{{/if}}
		{{/each}}
		<a href="javascript:" class="btn-more-box" act-gifts-more-close>
			收起<i class="c-i arrow-top"></i>
		</a>
	</div>
</div>
{{/if}}

</div>
</div>
<div class="cart-col-7">
	{{if  good.commerceitemVOFlag == "SUB"
			&& (promotionHead[0].type ==="I_ZE_GIFTS"|| promotionHead[0].type ==="MUL_ZE_GIFTS" ) }}
	{{else}}
		<div class="cart-good-fun delfixed">
			<a href="javascript:;"
			   act-remove-item
			   path="${is}.commerceItemsGroups.${ig}.commerceItemsGroup.${iog}"
			   data-sku="${good.skuId.toLowerCase()}"
			   {{if !hasDeleteArea || good.commerceitemVOFlag =="SUB"}}
			   data-save="false"
			   {{else}}
			   data-save="true"
			   {{/if}}
			>
			删除
			</a>
		</div>
	{{/if}}
	{{if good.commerceitemVOFlag == "SUB"}}
	<!-- 子商品没有加入收藏夹和到货通知 -->
	{{else}}
		{{if hasAddFavorites && good.inventoryState!= "OFF" && !$config.isQygSite()}}
		<div class="cart-good-fun">
			<a href="javascript:"
			   act-add-wishlist
			   path="${is}.commerceItemsGroups.${ig}.commerceItemsGroup.${iog}">
				移入收藏夹</a>
		</div>
		{{/if}}
	{{if !$config.isbrand(shop.shopId) && good.inventoryState == "NO_GOODS"}}
	<div class="cart-good-fun">
		<a href="javascript:"
		   act-arrival-notice
		   data-fav="${hasAddFavorites}"
		   path="${is}.commerceItemsGroups.${ig}.commerceItemsGroup.${iog}">
			到货通知</a>
	</div>
	{{/if}}
	{{/if}}
	{{if (good.inventoryState == "OFF" || good.inventoryState == "NO_GOODS") &&!$config.isQygSite()}}
	<b class="g-mask"></b>
	<div class="g-simlar-body" gui-popup gui-popup-animate="1">
		<span
				class="g-simlar-btn"
				data-sid="${good.skuId}"
				data-pid="${good.productId}"
				act-find-simlar
		>
			找相似<i class="c-i arrowdown_red"></i>
		</span>
		<div class="find-similar-body box-sd1" gui-popupbox gui-popupbox-animate>
			<div class="fsb-inner">
				<div class="cart-similar-empty">加载中....</div>
			</div>
		</div>
	</div>
	{{/if}}
</div>