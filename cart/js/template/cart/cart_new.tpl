<div class="container">
	{{html GTPL.cart_subtpl_header($data)}}
</div>
<div class="container" 
	act-list
	{{if prevHeight}}
		style="height:${prevHeight}px;"
	{{/if}}
	>
	<div>
	{{each(is, shop) data.siVOs}}  
		{{html GTPL.cart_subtpl_shop_header({
            ifnotLogined:ifnotLogined,
			shop:shop,
			hasCheckbox:hasCheckbox
		})}}
		<div class="cart-shop-goods {{if !$config.isGomeShop(shop.shopId)}}cart-shop-goods-normal{{/if}}">
			{{if shop.commerceItemsGroups && shop.commerceItemsGroups.length}}
				<!-- 促销分组列表 -->
				{{each(ig, oneCommerceItemsGroup) shop.commerceItemsGroups}}   
					{{if cartApp.isSuit(oneCommerceItemsGroup)}}
						{{if cartApp.isSuitOff(oneCommerceItemsGroup)}}
							<div  class="cartgoodoff">
								<!-- 国美套装 --> 
								{{html GTPL.cart_subtpl_gome_taozhuang({
									isgoodoff:true,
									ig:ig,
									is:is,
									suit:oneCommerceItemsGroup,
									suitHeadgood:oneCommerceItemsGroup.commerceItemsGroup[0],
									siteName:siteName,
									hasDeleteArea:hasDeleteArea,
									hasChangeCount:hasChangeCount
								})}}
								<!-- end国美套装 -->
							</div>
						{{else}}
							<!-- 国美套装 --> 
							{{html GTPL.cart_subtpl_gome_taozhuang({
								ig:ig,
								is:is,
								suit:oneCommerceItemsGroup,
								suitHeadgood:oneCommerceItemsGroup.commerceItemsGroup[0],
								siteName:siteName,
								hasDeleteArea:hasDeleteArea,
								hasChangeCount:hasChangeCount
							})}}
							<!-- end国美套装 -->
						{{/if}}
					{{else}}
						<!-- 单个促销分组 --> 
						{{if oneCommerceItemsGroup && oneCommerceItemsGroup.promotionHeads && oneCommerceItemsGroup.promotionHeads.length}}
							{{if shop.shopId == 'GOME'}}
								{{each(ih, promotionInfo) oneCommerceItemsGroup.promotionHeads}}
									{{if promotionInfo.length}}
										{{html GTPL.cart_subtpl_gome_promotionInfo({
											promotionInfo:promotionInfo,
											oneCommerceItemsGroup:oneCommerceItemsGroup,
											commerceItemsGroups:shop.commerceItemsGroups
										})}}
									{{/if}}
								{{/each}}
							{{else}}
								<div class="cart-shop-info">
								{{each(ih, promotionInfo) oneCommerceItemsGroup.promotionHeads}}
									<!-- 联营促销 -->
									{{html GTPL.cart_subtpl_shop_promotionInfo({
										promotionInfo:promotionInfo,
										shop:shop
									})}}
									<!-- /联营促销 -->
								{{/each}}
								</div>
							{{/if}}
						{{/if}}
						<!-- 本组商品列表 -->
						{{if oneCommerceItemsGroup.commerceItemsGroup && oneCommerceItemsGroup.commerceItemsGroup.length}} 
							{{each(iog, good) oneCommerceItemsGroup.commerceItemsGroup}}
								<div 
								class="cart-shop-good 
									{{if $config.isProductSelected(good,siteName)  }}
										cartgoodoff
									{{/if}}	
									clearfix
									{{if (!oneCommerceItemsGroup.promotionHeads || !oneCommerceItemsGroup.promotionHeads.length) 
										&& ig==0 && iog==0 }} cart-shop-good-common{{/if}}
									{{if good.selected}} cart-shop-good-checked{{/if}}  
									{{if iog==commerceItemsGroup.length-1}}cart-item-last{{/if}}
									" 
								data-good="true" 
								data-sid="${good.skuId}"
								data-pid="${good.productId}" 
								bigdata-pid="${good.productId}"
								>
								
								{{html GTPL.cart_subtpl_item_info({
									is:is,
									ig:ig,
									iog:iog,
									iogcoupon:ig+"_"+iog+"_"+good.skuId,
									shop:shop,
									oneCommerceItemsGroup:oneCommerceItemsGroup,
									good:good,
									goodPromotionLe10:cartApp.getPromitionData(good.promotions,9),
									goodPromotionGt10:cartApp.getPromitionData(good.promotions),
									goodPromotionEnd:cartApp.getPromitionData(good.promotions,-1),
									hasCheckbox:hasCheckbox,
									hasDeleteArea:hasDeleteArea,
									hasChangeCount:hasChangeCount,
									siteName:siteName,
									hasAddFavorites:hasAddFavorites,
									promotionHead:oneCommerceItemsGroup.promotionHeads && oneCommerceItemsGroup.promotionHeads.length?oneCommerceItemsGroup.promotionHeads[0]:[]
								})}}
								</div>
							{{/each}}
						{{/if}}
						<!-- /本组商品列表 -->
						<!-- /单个促销分组 -->
					{{/if}}
				{{/each}}
			{{/if}} 
		</div>
	{{/each}}
	</div>
</div>
<div class="cart-bottom-wrap">
	{{html GTPL.cart_subtpl_bottom($data)}}
</div>  