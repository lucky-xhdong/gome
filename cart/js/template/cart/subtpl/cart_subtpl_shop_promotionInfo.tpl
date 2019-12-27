{{if promotionInfo && promotionInfo.length}} 
	{{if promotionInfo.length == 1}}
		<!-- 无下拉框 --> 
		<!-- 促销开始标签11111 -->
		<div {{if promotionInfo[0].satisfied}}class="cart-shop-goods-promotion"{{/if}}>
		{{html GTPL.cart_subtpl_group_head({
			promotionInfo:promotionInfo
		})}}
		{{if promotionInfo[0].url && promotionInfo[0].url !="coudan"}} <!--挖坑-->
		&nbsp;
			<a href="${promotionInfo[0].url}?${promotionInfo[0].proId}" target="_blank">
				去凑单&nbsp;<span class="jt">&gt;</span>
			</a>
		{{/if}}

		{{if !promotionInfo._selectedPromotion}}
			${promotionInfo._selectedPromotion=promotionInfo[0],''}
		{{/if}} 
		<!-- /无下拉框 --> 
	{{else}} 
		{{each(npi, onePromotion) promotionInfo}}
			{{if onePromotion.selected}}
				${promotionInfo._selectedPromotion=onePromotion,''}
			{{/if}}
		{{/each}}
		{{if !promotionInfo._selectedPromotion}}
			${promotionInfo._selectedPromotion=promotionInfo[0],''}
		{{/if}}
		
		{{if promotionInfo._selectedPromotion}}
			<!-- 促销开始标签 2222222-->
			<div  
				{{if promotionInfo._selectedPromotion.satisfied}}class="cart-shop-goods-promotion"{{/if}}
			>
				<div class="cart-icon-notice"> 
					{{html $config.renderCartLabel(promotionInfo._selectedPromotion.type,"促销")}}
				</div>
				<div gui-widget="select"class="gui-select gui-select-with-arrow">
					<select name="" id="" act-change-promotion>
						{{each(npi, onePromotion) promotionInfo}} 
							<option value="${shop.shopId}|${onePromotion.proId}"
								{{if onePromotion.selected}}
									selected
								{{/if}}
								>
								${onePromotion.label}
							</option> 
						{{/each}} 
					</select>
				</div>
				{{if promotionInfo[0].url}}
				<a href="${promotionInfo[0].url}?${promotionInfo[0].proId}" target="_blank">
					去凑单&nbsp;<span class="jt">&gt;</span>
				</a>
				{{/if}}
			 
		{{/if}}
	{{/if}} 

	{{if 
		promotionInfo._selectedPromotion.gifts &&
		promotionInfo._selectedPromotion.gifts.length
	}}
		&nbsp;&nbsp;
		<div class="cart-zengpin cart-prom" gui-popup> 
			<a class="cart-zengpin-trigger" href="javascript:">
				查看赠品
			</a>
			<div class="cart-zengpin-box" gui-popupbox> 
				<div class="cart-box-arrow">
					<i>◆</i><i class="cart-arrow-cover">◆</i>
				</div>
				<div class="cart-box-border"> 
					<div class="border-none">
						<div class="cart-zengpin-wrap">
							{{each(zpi, zengpin) promotionInfo._selectedPromotion.gifts}}
								{{if zpi}}
									、
								{{/if}}
								${zengpin.itemName} x ${zengpin.quantity}
							{{/each}} 
						</div> 
					</div> 
				</div>
			</div>
		</div> 
	{{/if}}
	{{if !$config.isbrand(shop.shopId)}}
		{{if promotionInfo._selectedPromotion.satisfied == false
					&& promotionInfo._selectedPromotion.type !== 'NO_USE'
                          && promotionInfo._selectedPromotion.activityId
		}}
			&nbsp; 
			<a href="//coudan${cookieDomain}?${promotionInfo._selectedPromotion.proId}&crossShop=${promotionInfo._selectedPromotion.activityId!='0'}&aid=${promotionInfo._selectedPromotion.activityId}" target="_blank">
				去凑单&nbsp;<span class="jt">&gt;</span>
			</a>
	
		{{/if}}
	{{/if}}
</div> 
<!-- 
	促销结束标签，
	注：两个开始标签但是结束标签只有这一个，
	即：不同条件下使用不同的开始标签，但是结束标签就这一个 
-->
{{/if}} 