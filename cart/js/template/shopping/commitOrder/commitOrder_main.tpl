<div class="clearfix commitOrderBody">	
	<p class="text-right  clearfix"><span class="w185 fr pr20">¥${$config.formatAmount(amount)}</span><span class="fr"><em class="fontRed">${total}</em>件商品，总金额：</span></p>
	{{if $config.VBLE.youhuiquan2() && $page.site != "warranty" && $page.site !== "qiyegou" && $page.site !== "secondHand" && $page.site !== "applePc"}}
	<p class="text-right  clearfix"><span class="w185 fr pr20">-¥${$config.formatAmount(coupon)}</span><span class="fr">优惠券：</span></p>
	{{/if}}
	{{if reduceHaulage !=null && reduceHaulage !=0 }}
	<p class="text-right  clearfix"><span class="w185 fr pr20">-¥${$config.formatAmount(reduceHaulage)}</span><span class="fr">运费券：</span></p>
	{{/if}}
	{{if ppcAmount!=null}}
	<p class="text-right  clearfix"><span class="w185 fr pr20">-¥${$config.formatAmount(ppcAmount)}</span><span class="fr">美通卡：</span></p>
	{{/if}}
	{{if $page.site=="haiwaigou"}}
		 <p class="text-right  clearfix"><span class="w185 fr pr20 }">+¥${$config.formatAmount(hwgAmount)}</span><span class="fr">税费：</span></p>
	{{else $page.site=="allowance"}}
	<p class="text-right  clearfix"><span class="w185 fr pr20">-¥${$config.formatAmount(allowanceAmount)}</span><span class="fr">节能补贴：</span></p>
	{{/if}}
	<!-- 美豆 -->
	{{if $config.VBLE.shiyongMD()}}	
		{{if $data.gomedo!=null}}
		<p class="text-right  clearfix"><span class="w185 fr pr20">-¥${$config.formatAmount(gomedo)}</span><span class="fr">美豆：</span></p>
		{{/if}}
	{{/if}}
	<!-- {{if $config.VBLE.symeikouling()}}
		{{if $data.keyt!=null}}
		<p class="text-right  clearfix"><span class="w185 fr pr20" >-¥${$config.formatAmount(keyt)}</span><span class="fr">美口令：</span></p>
		{{/if}}
	{{/if}} -->
	<div class="text-right clearfix pr freight-container" id="freight-container">
		<span class="w185 fr pr20 _alert_rehaulage" rehaulage="${reduceHaulage}" >+¥${$config.formatAmount(haulage)}</span><span class="fr pr" hoverup>{{if data.freightProfileVO && data.freightProfileVO.freightForShopVOs && data.freightProfileVO.freightForShopVOs.length}}<em class="c-i tips_orange_icon pabs" style="left: -23px; top: 4px;"></em>{{/if}}运费：</span>
        {{if data.freightProfileVO && data.freightProfileVO.freightForShopVOs && data.freightProfileVO.freightForShopVOs.length}}
        <div class="fright-body box-sd1" hover>
            <div class="white-arrow">◆</div>
            <div class="freight-tit clearfix">
                <div class="fl tit-h">运费明细</div>
                <div class="fr tit-t">总计：<em class="fontArial">¥${$config.formatAmount(data.freightProfileVO.freight)}</em></div>
            </div>
            {{each(i, freightForShopVOs) data.freightProfileVO.freightForShopVOs}}
            <div class="pr freight-list-box">
                <div class="freight-tit-shopName {{if freightForShopVOs.freightForGroupVOs.length < 2}}fl{{/if}}">
                    {{if freightForShopVOs.shopName}}${freightForShopVOs.shopName}{{else}}国美自营{{/if}}
                </div>
                {{if freightForShopVOs.freightForGroupVOs && freightForShopVOs.freightForGroupVOs.length}}
                    {{each(j, freightForGroupVOs) freightForShopVOs.freightForGroupVOs}}
						<div class="freight-list-box-in pr">
                            <div class="freight-tit-FreightType {{if freightForShopVOs.freightForGroupVOs.length < 2}}fl{{/if}}">
                                {{if freightForGroupVOs.freightType && freightForGroupVOs.freightType !== "NFF"}}
                                <div class="tit-h-FreightType freight-tit-typeItem">
                                    {{if freightForShopVOs.freightForGroupVOs.length < 2}}<span style="margin-left: -15px;">（</span>{{/if}}
                                    ${$config.getFreightType(freightForGroupVOs.freightType)}
                                    {{if freightForShopVOs.freightForGroupVOs.length < 2}}）{{/if}}
                                </div>
                                {{/if}}
                                {{if freightForGroupVOs.freight && $config.formatAmountWithNoRound(freightForGroupVOs.freight) >= 0 && freightForGroupVOs.freightType && freightForGroupVOs.freightType !== "FF"}}
                                <div class="tit-h-freight freight-tit-typeItem">运费：<span class="fontRed fontArial">¥${$config.formatAmountWithNoRound(freightForGroupVOs.freight)}</span></div>
                                {{/if}}
                                {{if freightForGroupVOs.suttle}}
                                <div class="tit-t-suttle freight-tit-typeItem">重量：<em class="fontArial">${freightForGroupVOs.suttle}</em>kg</div>
                                {{/if}}
                            </div>
                            {{if freightForShopVOs.freightForGroupVOs.length < 2}}<div class="clearfix"></div>{{/if}}
                            {{if freightForGroupVOs.freightForItemVOs && freightForGroupVOs.freightForItemVOs.length}}
                            {{if freightForGroupVOs.freightForItemVOs.length > 3}}
                            <div class="l-btn arr-btn" prev-btn><i  class="c-i arrow-left-fine"></i></div>
                            <div class="r-btn arr-btn" next-btn><i  class="c-i arrow-right-fine"></i></div>
                            {{/if}}
                            <div class="fright-body-scroll-box">
                                <div class="fright-body-scroll" cart-scroll-view>
                                    <ul>
                                        {{each(k, freightForItemVOs) freightForGroupVOs.freightForItemVOs}}
                                        <li>
										<span class="bottom-goods-image">
											{{if freightForItemVOs}}
												<a href="javascript:;"><img width="50" height="50" src="${itemImageURL}" title="${itemName}"></a>
											{{else}}
												<img width="50" height="50" src="">
											{{/if}}
										</span>
                                        </li>
                                        {{/each}}
                                    </ul>
                                </div>
                            </div>
                            {{/if}}
						</div>
                    {{/each}}
                {{/if}}
            </div>
            {{/each}}
            <div class="freight-detail-link"><a target="_blank" href="https://help.gome.com.cn/question/9.html">查看详细规则 <em style="font-family: '宋体'">&gt;</em></a> </div>
        </div>
        {{/if}}
    </div>
	{{if remoteFee}}
		<p class="text-right  clearfix"><span class="w185 fr pr20" >+¥${$config.formatAmount(remoteFee)}</span><span class="fr">远程费：</span></p>
	{{/if}}
	
	{{if $config.isSupportSeven}}
		<div class="container isSupportSeven" id="isSupportSeven">
			{{if $config.isHwgSite()}}
				<div class="sup-tip">
					<a class="hag-a-hover" target="_blank" href="//cart${cookieDomain}/hygTip"  style="vertical-align: middle;margin-right: 10px;">
						<i class="c-i attention"></i>
					提交订单则表示您同意进口服务授权和进口服务协议
					</a>
				</div>
			{{else}}
				<div class="sup-tip">
					<span  hoverup>
					<i class="c-i attention"></i>
					订单中含不支持7天无理由退货商品，请确认后提交
					</span>
				</div>
			{{/if}}

	        <div class="sup-body box-sd1" hover>
	        	<div class="white-arrow">◆</div>
				<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;以下商品不支持7天无理由退货，根据<a href="//help.gome.com.cn/question/367.html" target="_blank">《网络购买商品七日无理由退货暂行办法》</a>要求，请您确认后再购买。</p>
				<div class="pr">
					{{if $config.isSupportSevenData.length > 3}}
					<div class="l-btn" prev-btn><i  class="c-i arrow-left"></i></div>
					<div class="r-btn" next-btn><i  class="c-i arrow-right"></i></div>
					{{/if}}
					<div class="sup-body-scroll" cart-scroll-view>
						<ul>
							{{each $config.isSupportSevenData}}
							<li>
								<span  class="bottom-goods-image" title="${itemName}">
									{{if itemImageURL}}
										<a href="${itemURL}" target="_blank"><img src="${itemImageURL}"></a>
									{{else}}
										<img  width="50" height="50" src="">
									{{/if}}
								</span>
							</li>
							{{/each}}
						</ul>
					</div>
				</div>
	        </div>
	    </div>
    {{else}}
    	<div style="height:28px;"></div>
    {{/if}}
	<div class="text-right play clearfix">
		<div class="w185 fr" id="id_commit_div">
			<a href="javascript:void 0" class="btn btn-primary btn-large fr" id="id_commit" style="border-bottom-right-radius: 0;">提交订单</a>
		</div>
		{{if $page.site=="presell"}}
		<div class="fr" agreen-play>
			<div>应付定金：<em class="fontRed strong font16">¥${$config.formatAmount(applyAmount)}</em></div>
		</div>
		{{else}}
		<span class="fr">
			应付款总金额：<em class="fontRed strong font16">¥${$config.formatAmount(applyAmount)}</em></span>
		{{/if}}
		<span class="fl ml20" id="tq-yzm" g-pipe>
			{{if $config.tqAtom.tqneedYzm=="Y" && $config.istqSite()}}
				{{html GTPL.tqYzm({tqAtom:$config.tqAtom,groupOnImgcode:$config.URL.groupOnImgcode})}}
			{{/if}}
		</span>
	</div>
	{{if $config.VBLE.songhuorenxinxi()}}	
		<div class="commitOrder-ds">
		<div class="fr">

			{{if uda}}
			<div class="text-right pr10">
				<div class="mr10 i-block">送货地址：${uda.stateName}&nbsp;&nbsp;${uda.cityName}&nbsp;&nbsp;${uda.countyName}&nbsp;&nbsp;${uda.townName}</div>
				<div class="mr10 i-block name_over2 " title="${uda.address}">${uda.address}</div>
			</div>
			{{/if}}
			{{if uda}}
				{{if uds}}
					<div class="dashedline"></div>
				{{/if}}
			{{/if}}
			{{if uds}}
			<div class="text-right pr10">
				<div class="mr10 i-block">自提地址：${uds.stateName}&nbsp;&nbsp;${uds.cityName}&nbsp;&nbsp;${uds.countyName}&nbsp;&nbsp;${uds.storeName}</div>
				<div class="mr10 i-block name_over2 " title="${uda.address}">${uds.storeAddress}</div>
			</div>
			{{/if}}
			<p class="text-right mb10 pr20 pr10">
				<span class="mr10">${sname}</span>
				<span class="mr10">${phone}</span>
			</p>
		</div>
		</div>
	{{/if}}	
</div>