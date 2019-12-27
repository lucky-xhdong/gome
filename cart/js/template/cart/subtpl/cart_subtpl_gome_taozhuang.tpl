<div style="padding:10px 0 2px">
<div class="cart-shop-suit-info  cart-taozhuang-head
 		{{if cartApp.tplHelper.taozhuang.isGoodtoGray(suitHeadgood.state)}}
				cartgoodoff
			{{/if}}
 		clearfix">
	<div class="cart-item-line"></div>
	<div class="cart-col-1">
		<div 
			act-check-item
			gui-checkbox
			gui-class-unchecked="good-checkboxs-no"
			gui-class-checked="c-i checkbox_chose"
			gui-class-disabled="no_check"
			data-cid="${suitHeadgood.itemId}"
			class="{{if suitHeadgood.showDisabled}}good-checkboxs-gray{{/if}}"
			>
				<input
					ctype="suit"
					type="checkbox"
					name="good"
					data-price="${parseFloat(suit.pomotionSummary.subAmount).toFixed(2) || '0.00'}"
					path="${is}.commerceItemsGroups.${ig}.commerceItemsGroup.0"
					{{if suitHeadgood.selected }}checked{{/if}}
					{{if suitHeadgood.showDisabled }} disabled {{/if}}
					value="${suitHeadgood.itemId}"
				> 	  
		</div>
	</div>
	<div class="cart-suit-title fl">
	【套装】
	{{if suit.commerceItemsGroup && suit.commerceItemsGroup.length > 0}}
		<a href="${suitHeadgood.vUrl}" target="_blank">${suitHeadgood.vProductName}</a>
	{{/if}}
	</div>
	<div class="cart-col-4">
		{{if suit.pomotionSummary && suit.pomotionSummary.promtion}}
			<div class="cart-good-real-price">
				&yen;${parseFloat(suit.pomotionSummary.coordinateAmount ).toFixed(2) || '0.00'}
			</div>
		{{/if}}
        {{if suitHeadgood.reducePrice}}
            <div class="downPriceBox pr" shipfee-dec>
                <div class="cart-good-down-price">降价：<span class="downPrice">¥<span>${parseFloat(suitHeadgood.reducePrice).toFixed(2) || '0.00'}</span></span></div>
                <!--降价对应浮层-->
                <div class="downPriceTit box-sd1 pabs hide shipfee-tip-pop">
                    <div class="shipfee-tip-ab"><em>&#9670;</em><span>&#9670;</span></div>
                    <div class="shipfee-tip-txt">商品比加入购物车时降价 ¥${parseFloat(suitHeadgood.reducePrice).toFixed(2) || '0.00'}</div>
                </div>
            </div>
        {{/if}}
	</div>
	<div class="cart-col-5">
        {{if !suitHeadgood.showDisabled && suitHeadgood.reserveStatus !== "QG"}}
		<div
			gui-count
			click-document-pre
			{{if isgoodoff}} 
				gui-count-disabled="true"
			{{else}}
				{{if siteName!='secondHand' && suitHeadgood.inventoryState =='OFF' }} gui-count-disabled='true'{{/if}}
			{{/if}}	
			gui-count-min="1"
			gui-count-animate="1"
			gui-count-change-interval="1000"
			act-change-count
			data-cid="${suitHeadgood.itemId}"
			data-limit="${suitHeadgood.limitNum/$config.returnTaoZhuangMax(suit)|| 1}"
			class="gui-count cart-count"
			{{if good}}
				data-sku="${good.skuId.toLowerCase()}"
			{{/if}}
			data-limit-${suitHeadgood.skuId.toLowerCase()}-${suitHeadgood.productId.toLowerCase()}="${suitHeadgood.limitNum}"
			>
			<input dytest
				{{if isgoodoff}}
					gui-count-disabled
				{{else}}
					class="dytest {{if siteName!='secondHand' && suitHeadgood.inventoryState == 'OFF'}}gui-count-disabled{{/if}}"
				{{/if}}
			type="text" value="${suitHeadgood.quantity}">
		</div>
        {{else}}
        <div class="shg-quantity">${suitHeadgood.quantity}</div>
        {{/if}}
		{{if suitHeadgood.itemId==$config.cartAtom.limitTip}}
		{{html $config.enoNum(Math.floor(suitHeadgood.limitNum/$config.returnTaoZhuangMax(suit)),1)}}
		{{/if}}
		<div class="red">{{html cartApp.tplHelper.taozhuang.isStateTpl(suitHeadgood.state)}}</div>
	</div>
	
	<div class="cart-col-6">
		{{if suit.pomotionSummary && suit.pomotionSummary.promtion}}
			<div class="cart-good-amount">
				&yen;${parseFloat(suit.pomotionSummary.subAmount).toFixed(2) || '0.00'}
			</div>
		{{/if}}
        {{if suit.commerceItemsGroup && suit.commerceItemsGroup.suttle && parseFloat(suit.commerceItemsGroup.suttle) > 0}}
            <!-- 净重 -->
            <div class="cart-good-suttle">${parseFloat(suit.commerceItemsGroup.suttle)} kg</div>
        {{/if}}
	</div>
	<div class="cart-col-7">
		<div class="cart-good-fun delfixed">
		<a href="javascript:;" 
			act-remove-suit-item
			data-price="${parseFloat(suit.pomotionSummary.subAmount).toFixed(2) || '0.00'}"
			path="${is}.commerceItemsGroups.${ig}.commerceItemsGroup.0"
		    {{if suitHeadgood.commerceitemVOFlag =="SUB"}}
				data-save="false"
			{{else}}
				data-save="true"
			{{/if}}
		>
			删除
		</a> 
		</div> 
	</div>
</div>
</div>
{{each(iog, good) suit.commerceItemsGroup}}
<div 
	class="cart-shop-suit-good cart-shop-good cart-taozhuang
		{{if isgoodoff}}
		{{else}}
			{{if cartApp.tplHelper.taozhuang.isGoodtoGray(suitHeadgood.state)}}
				cartgoodoff
			{{/if}}
            {{if $config.isProductSelected(good,siteName)}}cartgoodoff{{/if}}
		{{/if}}
		{{if good.selected}} cart-shop-good-checked{{/if}}
		{{if iog==suit.commerceItemsGroup.length-1}}cart-item-last{{/if}}
		clearfix
		" 
	data-sid="${good.skuId}"
	data-pid="${good.productId}" 
	bigdata-pid="${good.productId}">
	<div class="cart-item-line"></div>
	<div class="cart-col-1">
	 	<div class="c-i {{if suitHeadgood.selected }} dot {{else}} dotgrey {{/if}}"></div>
	</div>
	<div class="cart-col-2" style="height: 82px;">
		<a href="${good.itemURL}{{if good.meidianId && good.meidianId != null}}?mid=${good.meidianId}{{/if}}" target="_blank" class="g-img">
			{{if good.itemImageURL}}
				<img src="${good.itemImageURL}" alt="">
			{{/if}}
			{{if $config.isHomeSite() && good.itemPromotionInfo && good._isCount}}
				<div class="img-title">
					<span class="img-time-title">${$config.countDownTitle(good)}</span>
				</div>
				<div class="img-time">
					剩<span class="img-time-count js-countdown-${good.skuId}">${good._tipCount}</span>
				</div>
			{{/if}}
		</a>
		<!--{{if good.inventoryState == "OFF" || good.inventoryState == "NO_GOODS"}}-->
		<!--<b class="g-mask"></b>-->
		<!--<div class="g-simlar-body" gui-popup gui-popup-animate="1">-->
			<!--<span-->
				<!--class="g-simlar-btn"-->
				<!--data-sid="${good.skuId}"-->
				<!--data-pid="${good.productId}"-->
				<!--act-find-simlar-->
			<!--&gt;-->
			<!--找相似<i class="c-i arrowdown_white"></i>-->
			<!--</span>-->
			<!--<div class="find-similar-body box-sd1" gui-popupbox gui-popupbox-animate>-->
				<!--<div class="fsb-inner">-->
					<!--<div class="cart-similar-empty">加载中....</div>-->
				<!--</div>-->
			<!--</div>-->
		<!--</div>-->
		<!--{{/if}}-->
	</div>
	<div class="fl">
		<div class="clearfix">
			<div style="" class="cart-col-3">
				<div  class="cart-good-name">
					{{if good.cType=='HWG'}}
						<i class="c-i hwg" title="海外购商品"></i>
					{{/if}}
					<a href="${good.itemURL}{{if good.meidianId && good.meidianId != null}}?mid=${good.meidianId}{{/if}}" target="_blank" title="${good.itemName}">
                        {{if good.belonging && good.belonging=='QQBH'}}
                        <span style="color: red; border: 1px solid red; border-radius: 3px; padding: 0px 2px;">全球购超市</span>
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
				{{html GTPL.warranty_selectBox({meidianId:good.meidianId || '',good:good,config:$config.warrantyAtom})}}
				<!--end 增值服务选择框模板-->

				{{if good.freeShippingItem}}
					<span class="icons c-i freight" title="免运费">
					</span>
				{{/if}}

				{{if good.commerceItemVOs}}
					{{each(i, gift) good.commerceItemVOs}}
					<a class="cart-good-info"  target="_blank" href="${gift.itemURL}">
						[赠品]${gift.itemName} X${gift.quantity}
					</a>
					{{/each}}
				{{/if}}
				{{if good.returnedCouponVOs}}
					{{each(i, coupon) good.returnedCouponVOs}}
					<div class="cart-good-info">
						{{if coupon.ct ==='DO' }}
						[返豆]返${coupon.quantity}美豆
						{{else}}
						[返券]返${$config.labelsCouponType[coupon.ct]}¥${parseFloat(coupon.couponUnitPrice).toFixed(2)}x${coupon.quantity}
						{{/if}}
					</div>
					{{/each}}
				{{/if}}
			</div>

			<!--sales property -->
			{{html GTPL.cart_saleprops({good:good})}}
			<!--sales property -->

			<div class="cart-col-4"></div>
			<div class="cart-col-5 cart-good-item">
				<div class="cart-good-item">${good.baseQuantity}件/套 x ${good.quantity}</div>
				{{html cartApp.itemState(good,"suit")}}
				{{if good.inventoryState != "NO_GOODS"}}
					{{if siteName!='secondHand' && good.limitBuyGoods}}
						<div class="red cart-good-item">
							限购${good.limitNum}件
						</div>
					{{/if}} 
				{{/if}} 
				{{if good.onTheRoad}}
					<div class="green cart-good-item">在途</div>
				{{/if}}
                {{if good.inventoryState !== "NO_GOODS" && good.inventoryState !== "NO_JURISDICTION" && good.inventoryState !== "OFF"}}
                    {{if good.reserveStatus == 'YY' || good.reserveStatus == "YYWYY"}}
                        <div class="red cart-good-item">预约中</div>
                    {{else good.reserveStatus == 'QG' || good.reserveStatus == 'QGWYY'}}
                        <div class="red cart-good-item " >预约抢购中</div>
                    {{else good.reserveStatus == 'QGQ' || good.reserveStatus == 'QGQWYY'}}
                        <div class="red cart-good-item " >预约待开抢</div>
                    {{/if}}
                {{/if}}
				<!--{{if good.inventoryState == "OFF" || good.inventoryState == "NO_GOODS"}}-->
				<!--<b class="g-mask"></b>-->
				<!--<div class="g-simlar-body" gui-popup gui-popup-animate="1">-->
					<!--<span-->
							<!--class="g-simlar-btn"-->
							<!--data-sid="${good.skuId}"-->
							<!--data-pid="${good.productId}"-->
							<!--act-find-simlar-->
					<!--&gt;-->
					<!--找相似<i class="c-i arrowdown_red"></i>-->
					<!--</span>-->
					<!--<div class="find-similar-body box-sd1" gui-popupbox gui-popupbox-animate>-->
						<!--<div class="fsb-inner">-->
							<!--<div class="cart-similar-empty">加载中....</div>-->
						<!--</div>-->
					<!--</div>-->
				<!--</div>-->
				<!--{{/if}}-->
			</div>
			<div class="cart-col-6">
                <!-- 重量展示(只展示全球百货的重量) -->
                {{if good.belonging && good.belonging == "QQBH" && good.suttle && $config.formatAmountSuttle(good.suttle) > 0}}
                <div class="cart-good-suttle cart-good-amount">${$config.formatAmountSuttle(good.suttle)} kg</div>
                {{/if}}
            </div>
			<div class="cart-col-7">
			</div>
		</div>
		<div class="cart-good-box" >
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
                {{else good.reserveStatus == "QGWYY"}}
                <span class="yyrh-mark">预约</span><span class="yyrh-cont">您未预约此商品，暂不可购买</span>
                {{else good.reserveStatus == "QGCF"}}
                <span class="yyrh-mark">预约</span><span class="yyrh-cont">您已参加预约活动，不能重复购买！</span>
                {{/if}}
            </div>
            {{/if}}
		</div>
	</div>
 </div>
{{/each}}