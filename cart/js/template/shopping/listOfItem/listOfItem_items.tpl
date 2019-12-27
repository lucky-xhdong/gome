{{each(idx,item) groups}}
{{if commerceItemsGroup[0].isShow}}
	<div class="sideright_in" {{if idx==groups.length-1}}style="margin-bottom:0"{{/if}}>
		{{if $config.isGomeShop(shopId) && item.profile}}
			<div class="mb5">
				<span class="pair_buy mr10 pr"> ${$config.labels[item.profile.types[0]]}<b class=" pabs horn"></b></span>
				{{if $config.isListValue(item.profile.types,'TZ')}}
		          <span class="fontRed mr10">&yen;${$config.formatAmount(item.profile.tzSubAmount)}</span>(共${item.commerceItemsGroup[0].quantity}套)
				  <!--else html $config.renderlistNotice(item.profile.types[0],item.profile) -->
        		{{/if}}
			</div>
		{{/if}}
		<ul class="gmlist clearfix">
                {{each commerceItemsGroup}}
			{{if isShow}}
				{{if $config.isGomeShop(shopId)}}
					{{if $index==commerceItemsGroup.length-1}}
						<li class="gmlist_li_over" {{if $index==0}}style="padding-top:10px;"{{/if}}>
					{{else item.profile}}
						<li class="gmlist_li" {{if $index==0}}style="padding-top:10px;"{{/if}}>
					{{else}}
						<li class="gmlist_li_over" {{if $index==0}}style="padding-top:10px;"{{/if}}>
					{{/if}}
				{{else}}
					<li class="gmlist_li_over" {{if $index==0}}style="padding-top:10px;"{{/if}}>
				{{/if}}
				<div class="pr">
					{{if $config.isGomeShop(shopId) && item.profile && item.profile.types}}
						<b class="o_dot c-i dot pabs"></b>
						{{if $index==commerceItemsGroup.length-1}}
						<b class="dot_line pabs"></b>
						{{/if}}
					{{/if}}
				</div>
				{{if $config.isbrand(shopId)}}
			{{/if}}
			<div class="clearfix">
				<a class="imgLink mr10 fl" target="_blank" href="${itemURL}">
					<img src="${itemImageURL}" width="80" height="80">
				</a>
				<div class="commoditycon fl">
					<p >
                        {{if $value.belonging && $value.belonging == 'QQBH'}}
                        <span style="color: red; border: 1px solid red; border-radius: 3px; padding: 0px 2px;">全球购超市</span>
                        {{/if}}
						{{if commerceitemVOFlag =='SUB'}}
							<!--if $config.isListValue(item.profile.types,'DPG')
								<em style="color: red; border: 1px solid red; border-radius: 3px; padding: 0px 2px;" class="fontRed mr5">折扣品</em>
							else $config.isListValue(item.profile.types,'JJHG')
								<em style="color: red; border: 1px solid red; border-radius: 3px; padding: 0px 2px;" class="fontRed mr5">换购品</em>-->
							{{if profile && $config.isSub(profile.types)}}
								<span style="border:1px solid #f00; padding:1px 2px;color:#f00;padding:0 2px\9;">赠品</span>
							{{/if}}
						{{/if}}
						<a href="${itemURL}" class="p-name _apple_pc" target="_blank" title="${itemName}">
						{{if $page.site=="haiwaigou"}}
						<b class="c-i hwg"></b>
						{{/if}}
							${$config.limitStr(itemName,31)}
						</a>
					</p>
					<!--节能补贴-->
					{{if $page.site=="allowance"}}
					<p class="p-ins">
						<span class="fontRed mr10">[节能]</span>
						<pan class="fontGray">补贴优惠率${(ratio-0) * 100}%</pan>
					</p>
					{{/if}}
					{{if $page.site!="warranty"}}
						{{if item.profile && $config.isListValue(item.profile.types,'TZ')}}
							<p class="p-ins">
								<span class="fontGray mr40">${tzBase}件/套&nbsp;&nbsp;x${quantity} </span>
								<span class="fontGray mr10">{{html $config.labels[$value.state]}}</span>
								{{if $value.onRoad}}
								<span class="font118850 mr10">在途</span>
								{{/if}}
							</p>
						{{else $page.site=="presell"}}
							<p class="p-ins">
								<span class="fontf bgred mr3">定金</span>
								<span class="fontRed mr5">¥ ${$config.formatAmount(salePrice)}</span>
								{{if offsetAmount}}
								<span class="mr5">( 可抵¥ ${$config.formatAmount(offsetAmount)})  </span>
								{{/if}}
								<span class="mr5">x${quantity}</span>
								<span class="mr10">{{html $config.labels[$value.state]}}</span>
								{{if $value.onRoad}}
								<span class="font118850 mr10">在途</span>
								{{/if}}
							</p>
						{{else}}
							<p class="p-ins">
								{{if commerceitemVOFlag == "SUB" && item.profile && ($config.isListValue(item.profile.types,'I_ZE_GIFTS') || $config.isListValue(item.profile.types,'MUL_ZE_GIFTS'))}}
									<span class="fontRed mr10">¥${$config.formatAmount(listPrice)} </span>
								{{else}}
									<span class="fontRed mr10">¥${$config.formatAmount(salePrice)} </span>
								{{/if}}
								<span class="fontGray mr20 ml5"> x ${quantity} </span>
								<span class="fontGray mr10">{{html $config.labels[$value.state]}}</span>
								{{if $value.onRoad}}
								<span class="font118850 mr10">在途</span>
								{{/if}}
							</p>
						{{/if}}
						{{if $page.site=="haiwaigou"}}
							<p style="line-height: 23px;color: #333333; ">税费（含商品及运费税费）：	<span>¥${$config.formatAmount(taxAmount)}</span>
							</p>
						{{/if}}
						{{if serviceTagFlag.length}}
						<p class="clearfix fuwu">
							{{if $config.isListValue(serviceTagFlag,'MYFY')}}
								<span class="c-i freight mr10 fl"></span>
							{{/if}}
							<span class="support-server clearfix">
							{{if $config.isListValue(serviceTagFlag,'i7Y')}}
								<i class="c-i seven" title="支持7天无理由退货"></i>
							{{else $config.isListValue(serviceTagFlag,'i7N')}}
								<i class="c-i seven_no" title="不支持7天无理由退货"> </i>
							{{else $config.isListValue(serviceTagFlag,'i15Y')}}
								<i class="mr10 fl back-server" title="支持15天无理由退货">15</i>
							{{/if}}
							{{if  meidianId}}
								<i class="c-i  meidian mei-dian-${meidianId}"></i>
							{{/if}}
							</span>
                            {{if $config.isListValue(serviceTagFlag,'StoreSpotGoods')}}
                            <p class="clearfix fuwu mt10">
                                <span class="c-i mdzt mr10 fl"></span>
                                <span class="fl lh16">门店自提</span>
                            </p>
                            {{else $config.isListValue(serviceTagFlag,'SelfPickPoint')}}
                            <p class="clearfix fuwu mt10">
                                <span class="c-i pszt mr10 fl"> </span>
                                <span class=" fl lh16">配送自提</span>
                            </p>
                            {{/if}}
							<!--安装电话-->
							{{if !item.tiVOs}}
								<div class="js-install-remind js-install-remind-${skuId}"></div>
							{{/if}}
                            {{if tiVOs}}
								<div class="support-server mt10 clearfix yyaz-support" click-document-pre itemId="${itemId}" site="${$page.site}">
									<div class="yyaz-time-tip"><i class="icon-zhuang">装</i></div>
									{{if $config.isListValue(serviceTagFlag,'StoreSpotGoods')}}
									<div class="yyaz-add-tip">安装地址：安装地址以您订单上所选的收货人地址为准</div>
									{{/if}}
								</div>
                            {{/if}}
						</p>
						{{/if}}
					{{/if}}
					{{if rackType }}
					<div class="applace clearfix" g-pipe>
						<span class="fl">电视挂件安装：</span>
						<div
						class="fl g-select mr10"
						g-click="toggle [g-body],toggleClass arrowdown [g-icon],toggleClass arrowup2 [g-icon]">
							<a href="javascript:void(0)" class="block" style="width:50px" click-document-pre>
								<i class="c-i select_arrowup"></i><!--兼容IE7浏览器 i必须写前面-->
								{{if rackType=="Y"}}
								安装
								{{else}}
								不安装
								{{/if}}
							</a>
							<ul  g-body class="hide" click-document-hide>
								<li g-click="gjaz ${itemId}_Y groups.${idx}.commerceItemsGroup.${$index}.rackType Y">安装</li>
								<li g-click="gjaz ${itemId}_N groups.${idx}.commerceItemsGroup.${$index}.rackType N">不安装</li>
							</ul>
						</div>
						<span class="fontGray">安装方式及价格以客服确认为准</span>
						<a  class="fontBlue" target="_blank" href="${$config.URL.homeinstallation}">安装说明></a>
					</div>
					{{/if}}
				</div>
			</div>
			<div>
				<!--{{if  meidianId}}
					<span class="c-i  meidian mei-dian-${meidianId}"></span>
				{{/if}}-->
				{{if incre }}
					{{each(idx,warranty) incre}}
						<p class="ns clearfix">
							<!--<img src="${warranty.iconUrl}" class="fl" style="width: 16px; height: 16px";  />-->
							<span class="font33 fl mr15" >
							${warranty.serviceType == "1" ? "特惠":""}
							${warranty.displayName}
							${warranty.numOfYear}年
							</span>
							<span class="fontRed fl mr20">¥${$config.formatAmount(warranty.price)}</span>
							<span class="fontGray fl">x${warranty.quantity}</span>
						</p>
					{{/each}}
				{{/if}}

				<div class="cart-good-box">
				{{each(i, gift) _gifts}}
				{{if i<2}}
				{{if gift._isGift}}
				<div>
					<a href="javascript:void(0)" title="[赠品]${gift.itemName} X${gift.quantity}"  class="p-zp fontGray text-overflow-ellipsis370  clearfix">
						<span class="fl">[赠品] ${gift.itemName}             X${gift.quantity}</span>
						{{if gift.inventoryState === 'NO_GOODS'}}
							<span class="fr i-block" style="margin-left: 50px;color:#e3101e">无货</span>
						{{/if}}
					</a>
				</div>
				{{else}}
				<div  class="p-zp fontGray clearfix">
					{{if gift.ct ==='DO' }}
					[返豆]返${gift.quantity}美豆
					{{else}}
					[返券]返${$config.labelsCouponType[gift.ct]}¥${parseFloat(gift.couponUnitPrice).toFixed(2)}x${gift.quantity}

					{{/if}}
				</div>
				{{/if}}
				{{/if}}
				{{/each}}
				{{if _gifts._isMore }}
				<a class="js-more-btn btn-more-box" href="javascript:"  act-gifts-more>
					<i class="c-i arrow-bottom"></i>
				</a>
				{{/if}}
				<div style="display: none" class="js-more-box">
					{{each(i, gift) _gifts}}
					{{if i>=2}}
					{{if gift._isGift}}
					<a href="javascript:void(0)" title="[赠品]${gift.itemName} X${gift.quantity}"
					   class="p-zp fontGray clearfix text-overflow-ellipsis370">
						[赠品]${gift.itemName} X${gift.quantity}
						{{if gift.inventoryState === 'NO_GOODS'}}
							<span class="fr i-block" style="margin-left: 50px;color:#e3101e">无货</span>
						{{/if}}
					</a>
					{{else}}
					<div class="p-zp fontGray clearfix">
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
						<i class="c-i arrow-top"></i>
					</a>
				</div>
			</div>
			</div>
			</li>
			{{/if}}
			{{/each}}
		</ul>
	</div>
{{/if}}
{{/each}}
{{if itemsLength>8}}
	{{if !isAllItems}}
		<a href="javascript:void 0"  class="fr tip cl item-more" style="margin-right:29px;">查看全部商品<span class="jt">﹀</span></a>
	{{else}}
		<a href="javascript:void 0"  class="fr tip cl item-more" style="margin-right:29px;">收起<span class="jt">︿</span></a>
	{{/if}}
{{/if}}
