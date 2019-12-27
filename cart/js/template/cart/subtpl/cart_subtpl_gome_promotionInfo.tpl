<!-- 自营促销 -->
<div class="cart-shop-info
	{{if promotionInfo[0].satisfied}}
	cart-shop-goods-promotion
	{{/if}}
	">
	{{html GTPL.cart_subtpl_group_head({
	promotionInfo:promotionInfo
	})}}

	<!--换购 start-->
	{{if promotionInfo[0].rangeWithGiftGroupses && promotionInfo[0].rangeWithGiftGroupses.length}}
		&nbsp; 
		<div class="cart-add-buy" 
			gui-popup 
			gui-popup-toggle="1"
			>
			<a href="javascript:;" style="text-decoration:none; position:relative;left:0px;" class="cart-add-buy-text"> 

				{{if promotionInfo[0].satisfied}}
					{{if promotionInfo[0]._hasSelected}}
						<span class = "exch" >重新换购</span>
					{{else}}
						<span class = "exch" >换购商品</span>
					{{/if}} 
				{{else}}
					<span class = "exch" style="">查看换购商品</span>
				{{/if}}
			</a>  

			<div class="cart-add-buy-list" gui-popupbox>
				<div class="cart-box-arrow" >
					<i>◆</i><i class="cart-arrow-cover">◆</i>
				</div>
				<div class="cart-add-buy-list-inner">
					<div class="cart-add-buy-header">
						可换购最多
						<span class="cart-red-text">
					${promotionInfo[0]._maxNum}
					</span>
						件，已选
						<span class="cart-red-text">1</span>
						件

						<div class="c-i closebtn-new" gui-popupclose></div>
					</div>
					<div class="cart-add-buy-row
					{{if promotionInfo[0].rangeWithGiftGroupses[0].groups[0].gifts.length > 6}}
					cart-add-buy-row-scroll
					{{/if}}
					"
						 data-max="${promotionInfo[0].maxNum}"
					>
						{{each(jjhgi, jjhgItem) promotionInfo[0]._rangeWithGiftGroupses}}
						<div class="cart-add-buy-item {{if jjhgItem.reserveStatus == 'QGQWYY' || jjhgItem.reserveStatus == 'QGWYY' || jjhgItem.reserveStatus == 'QGCF'}}cartgoodoff{{/if}}">
							<div class="cart-add-buy-item-left">
								<div
										gui-checkbox
										act-jjg-check
										gui-class-unchecked="good-checkboxs-no"
										gui-class-checked="c-i checkbox_chose"
										gui-class-disabled="no_check"
										class="{{if !promotionInfo[0].satisfied || !jjhgItem._available || !$config.yyqgjjhgTypeOff(jjhgItem.status)}}good-checkboxs-gray{{/if}}">
									<input
											type="checkbox"
											value="${jjhgItem.skuId}_${jjhgItem.productId}"
											{{if jjhgItem.selected}}
											checked
											{{/if}}
									{{if !promotionInfo[0].satisfied || !jjhgItem._available || !$config.yyqgjjhgTypeOff(jjhgItem.status)}}
									disabled
									{{/if}}
									>
								</div>
								<div class="cart-add-buy-tip">
									<div class="c-i attention"></div>
									最多可选择${promotionInfo[0].maxNum}件
								</div>

							</div>
							<div class="cart-add-buy-item-right">
								<div class="cart-add-image fl">
									<a href="${jjhgItem.itemURL}" target="_blank">
										{{if jjhgItem.itemImageURL}}
										<img src="${jjhgItem.itemImageURL}" alt="">
										{{/if}}
									</a>
								</div>
								<div class="cart-add-detail">
									<a href="${jjhgItem.itemURL}" class="deinfo" target="_blank" title="${jjhgItem.itemName}">${jjhgItem.itemName}</a>
									<div class="cart-add-buy-price ffyh pr">
										￥${parseFloat(jjhgItem.giftPrice).toFixed(2) || '0.00'}
										<span class="pabs cart-add-buy-type">${$config.yyqgjjhgType(jjhgItem.status)}</span>
									</div>
								</div>
							</div>
						</div>
						{{/each}}
					</div>

					<div class="cart-add-buy-footer cart-box-group-a">
						<a href="javascript:;" class="cart-btn" gui-popupclose>取消</a>
						<a
								href="javascript:;"
								class="cart-btn cart-red-bg"
								style="margin-left:24px;"
								gui-popupclose
								act-add-jjg
								data-id="${promotionInfo[0].proId}"
								data-groupid="${promotionInfo[0].rangeWithGiftGroupses[0].groups[0].id}"
						>
							确认
						</a>
					</div>
				</div>
			</div>
		</div> 
		{{if promotionInfo[0].url}}
			&nbsp;
			<a href="${promotionInfo[0].url}?${promotionInfo[0].proId}" target="_blank">
				去凑单&nbsp;<span class="jt">&gt;</span>
			</a>
		{{/if}}
	{{/if}}
	

	<!--换购 end-->
</div>
<!-- /自营促销 --> 