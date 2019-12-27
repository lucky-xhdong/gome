<div class="cart-shop-header" >
	<div class="cart-col-1">
		{{if hasCheckbox}}
            <!--VNPOP：把联合促销活动作为虚拟店铺，它是它的ID-->
			{{if shop.shopId != 'VNPOP'}}
				<div 
					act-check-shop-item
					gui-checkbox
					gui-class-unchecked="good-checkboxs-no"
					gui-class-checked="c-i checkbox_chose"
					gui-class-disabled="no_check"
					data-sid="${shop.shopId}"
                    class="{{if shop.shopInfoProfileVO && shop.shopInfoProfileVO.showDisabled}}good-checkboxs-gray{{/if}}"
					style="margin-top: 13px;"
					>
					<input type="checkbox"
						{{if shop.shopInfoProfileVO && shop.shopInfoProfileVO.allItemsSelected}}
							checked
						{{/if}}
						{{if shop.shopInfoProfileVO && shop.shopInfoProfileVO.showDisabled }}
							disabled 
						{{/if}}  
					>
				</div>
			{{/if}} 
		{{else}}
			&nbsp;
		{{/if}}
		
	</div>
	<div class="cart-col-2">
		{{if shop.shopId == 'GOME'}}
            <span class="black cart-shop-name" >国美自营</span>
		{{else shop.shopId == 'VNPOP'}}
			<span class="black cart-shop-name" style="margin-left: 20px" >联合促销活动</span>
		{{else}}
			{{if $config.isbrand(shop.shopId)}}
				<span class="black cart-shop-name">${ shop.shopName }</span>
			{{else}}
				<a
				href="${ shop.shopURL }"
				title="${ shop.shopName }"
				class="black cart-shop-name {{if shop.shopCoupons && shop.shopCoupons.length}}cart-shop-name-fixed{{/if}}	"
				target="_blank">
					${ shop.shopName }
				</a>
			{{/if}}
		{{/if}}

		{{if !($config.isGomeShop(shop.shopId)) && shop.shopId!= 'VNPOP'}}
			<span style="display: inline-block" class="cart-kf cart-header-kf" data-customer_service_id="${shop.shopId}" data-shopname="${ shop.shopName }"  >
				<i style="cursor: pointer;vertical-align: middle;" class="c-i c-kf-off"></i>
				<span  class="contact-customer-word">联系客服</span>
			</span>
		{{/if}}

        {{if ifnotLogined == false && $page.site == "home"}}
            {{if (shop.gomeCoupons && shop.gomeCoupons.length) || (shop.shopCoupons && shop.shopCoupons.length)}}
            <div class="cart-coupon" gui-popup gui-popup-animate="1" gui-popup-toggle="1" style="margin-top: 6px;" click-document-pre>
                <a href="javascript:;" class="c-i cart-coupon-trigger2 " act-get-coupon data-sid="${shop.shopId}">  <!-- c-i cart-coupon-trigger-icon-->
                    <!--<i style="margin-left: 9px; margin-right: 3px;" class="c-i add"></i>-->
                    <!--优惠券-->
                    <!--<i class="c-i cart-arrow arrowdown_red"></i>-->
                </a>
                {{if shop.shopId == 'GOME'}}
                    {{if shop.gomeCoupons && shop.gomeCoupons.length}}
                    <div class="cart-coupon-box" gui-popupbox>
                        <div class="pabs text-center err-pop hide" click-document-hide></div>
                        <div class="cart-coupon-box-mask pabs"></div>
                        <div class="c-i closebtn-new hide" gui-popupclose></div>
                        <div class="cart-coupon-arrow pabs"><em class="c-i arrowup_gray"></em></div>
                        <div class="cart-box-border" gui-popupbox-animate>
                            <div class="cart-coupon-items">
                                {{each(i, coupon) shop.gomeCoupons}}
                                <div class="cart-box-item clearfix">
                                    {{if coupon.type==='GOU_WU'}}
                                    <div class="cart-coupon-icon cart-coupon-icon-gouwu">
                                        <div class="cart-coupon-icon-inner fontArial">
                                            <em>¥</em>${coupon.couponUnitPrice}
                                        </div>
                                    </div>
                                    {{else coupon.type==='BLUE'}}
                                    <div class="cart-coupon-icon cart-coupon-icon-blue">
                                        <div class="cart-coupon-icon-inner fontArial">
                                            <em>¥</em>${coupon.couponUnitPrice}
                                        </div>
                                    </div>
                                    {{else}}
                                    <div class="cart-coupon-icon cart-coupon-icon-shop">
                                        <div class="cart-coupon-icon-inner fontArial">
                                            <em>¥</em>${coupon.couponUnitPrice}
                                        </div>
                                    </div>
                                    {{/if}}
                                    <div class="cart-coupon-text">
                                        <div class="cart-coupon-title text-overflow" title="${coupon.description}">
                                            {{if coupon.type==='GOU_WU'}}
                                            购物券
                                            {{else coupon.type==='BLUE'}}
                                            蓝券
                                            {{else}}
                                            店铺券
                                            {{/if}}
                                            ${coupon.desc}
                                        </div>
                                        {{if coupon.type==='BLUE' && coupon.couponApplyDetailInfoVO !=null }}
                                            <div class="go-coudan-div">
                                                {{if coupon.couponApplyDetailInfoVO.unavailReasonType === '5'}} 
                                                <span class="pay-for">还差${coupon.couponApplyDetailInfoVO.reasonSupplyment}元</span> 
                                                {{/if}}
                                                {{if coupon.couponApplyDetailInfoVO.unavailReasonType === "5" && 
                                                coupon.couponApplyDetailInfoVO.reasonSupplyment > 0 && 
                                                coupon.couponApplyDetailInfoVO.reasonSupplyment < coupon.couponApplyDetailInfoVO.limitedAmount }}
                                                <a href="${coupon.url}" class="go-cd-blue">，去凑单&gt;</a>
                                                {{/if}}
                                                {{if coupon.couponApplyDetailInfoVO.unavailReasonType == null }}
                                                <span class="goCD">已满足使用条件</span>
                                                {{/if}}
                                            </div>
                                        {{/if}}
                                        {{if coupon.type==='PRODUCT'}}<a href="${coupon.url}" class="goCD">去凑单&gt;</a>{{/if}}
                                        <div class="cart-coupon-dsp fontArial">
                                            {{if coupon.dateRange && coupon.dateRange.start && coupon.dateRange.end}}
                                            ${$config.fromatDate(coupon.dateRange.start,"yyyy.MM.dd")}
                                            -
                                            ${$config.fromatDate(coupon.dateRange.end,"yyyy.MM.dd")}
                                            {{/if}}
                                        </div>
                                        {{if coupon.type==='BLUE' && coupon.couponApplyDetailInfoVO !=null }}
                                        <div act-select-goods class="cart-coupon-dsp fontArial select-coupon-goods">
                                            查看购物车中可用此券的商品<i class="c-i cart-arrow js-i arrowdown"></i>
                                        </div>
                                        <div class="cart-coupon-dsp fontArial is-display-goods">
                                            <ul>
                                            {{if coupon.couponApplyDetailInfoVO.skuList && coupon.couponApplyDetailInfoVO.skuList.length}}
                                                {{each(i, goods) coupon.couponApplyDetailInfoVO.skuList}}
                                                    <li class="goods-li">
                                                        <img src="${goods.itemImageURL}" class="goods-li-img" />
                                                    </li>
                                                {{/each}}
                                             {{/if}}
                                            </ul>
                                        </div>
                                        {{/if}}
                                    </div>
                                    <a class="cart-coupon-btn {{if shop.shopId == 'GOME'}}act-gome-add-coupon{{/if}}"
                                       act-add-coupon
                                       data-cpid="${coupon.code}"
                                       data-aid="${coupon.id}"
                                       data-quantity="${coupon.quantity}"
                                       data-type = "${coupon.type}"
                                       data-shopid="${shop.shopId}"
                                       data-desc="${shop.desc}"
                                    >
                                        {{if coupon.checked == false}}领取{{else}}继续领取{{/if}}
                                    </a>
                                </div>
                                {{/each}}
                            </div>
                        </div>
                    </div>
                    {{/if}}
                {{else}}
                    {{if shop.shopCoupons && shop.shopCoupons.length}}
                    <div class="cart-coupon-box" gui-popupbox>
                        <div class="cart-coupon-box-mask pabs"></div>
                        <div class="c-i closebtn-new hide" gui-popupclose></div>
                        <div class="cart-coupon-arrow pabs"><em class="c-i arrowup_gray"></em></div>
                        <div class="cart-box-border" gui-popupbox-animate>
                            <div class="cart-coupon-items">
                                {{each(i, coupon) shop.shopCoupons}}
                                <div class="cart-box-item clearfix">
                                    {{if coupon.type==='GOU_WU'}}
                                    <div class="cart-coupon-icon cart-coupon-icon-gouwu">
                                        <div class="cart-coupon-icon-inner fontArial">
                                            <em>¥</em>${coupon.couponUnitPrice}
                                        </div>
                                    </div>
                                    {{else coupon.type==='BLUE'}}
                                    <div class="cart-coupon-icon cart-coupon-icon-blue">
                                        <div class="cart-coupon-icon-inner fontArial">
                                            <em>¥</em>${coupon.couponUnitPrice}
                                        </div>
                                    </div>
                                    {{else}}
                                    <div class="cart-coupon-icon cart-coupon-icon-shop">
                                        <div class="cart-coupon-icon-inner fontArial">
                                            <em>¥</em>${coupon.couponUnitPrice}
                                        </div>
                                    </div>
                                    {{/if}}
                                    <div class="cart-coupon-text">
                                        <div class="cart-coupon-title text-overflow" title="${coupon.description}">
                                            {{if coupon.type==='GOU_WU'}}
                                            购物券
                                            {{else coupon.type==='BLUE'}}
                                            蓝券
                                            {{else}}
                                            店铺券
                                            {{/if}}
                                            ${coupon.desc}
                                        </div>
                                        {{if coupon.type==='PRODUCT'}}<a href="${coupon.url}" class="goCD">去凑单&gt;</a>{{/if}}
                                        <div class="cart-coupon-dsp fontArial">
                                            {{if coupon.dateRange && coupon.dateRange.start && coupon.dateRange.end}}
                                            ${$config.fromatDate(coupon.dateRange.start,"yyyy.MM.dd")}
                                            -
                                            ${$config.fromatDate(coupon.dateRange.end,"yyyy.MM.dd")}
                                            {{/if}}
                                        </div>
                                    </div>
                                    <a class="cart-coupon-btn {{if shop.shopId == 'GOME'}}act-gome-add-coupon{{/if}}"
                                       act-add-coupon
                                       data-cpid="${coupon.code}"
                                       data-aid="${coupon.id}"
                                       data-quantity="${coupon.quantity}"
                                       data-type = "${coupon.type}"
                                       data-shopid="${shop.shopId}"
                                       data-desc="${shop.desc}"
                                    >
                                        领取
                                    </a>
                                </div>
                                {{/each}}
                            </div>
                        </div>
                    </div>
                    {{/if}}
                {{/if}}
            </div>
            {{/if}}
		{{/if}}

	</div>
    {{if shop.shopId == 'GOME'}}
        <div class="shipfee-dec" shipfee-dec>
            <div class="shipfee-pop-label"><i class="c-i attention"></i> 运费说明</div>
            <!-- 运费对应飘窗 -->
            <div class="pr fee-pop-c" style="z-index: 100;" >
                <div class="hide box-sd1 pabs shipfee-tip-pop">
                    <div class="shipfee-tip-ab"><em>&#9670;</em><span>&#9670;</span></div>
                  {{if shop.shopInfoProfileVO &&  shop.shopInfoProfileVO.shopCDShippingFeeVO}}
                       {{if shop.shopInfoProfileVO.shopCDShippingFeeVO.reason ==2}}
                            <div class="shipfee-pop-t">国美自营运费说明</div>
                            <div class="shipfee-pop-noself2">尊敬的国美G5会员，除特例品外自营商品全部区域免费</div>
                       {{else}}
                            <div class="shipfee-pop-t">国美自营运费说明</div> <!-- 此div里面去掉<span>（国美G5会员除特例品外自营商品全部区域免运费）</span>-->
                            <div class="shipfee-pop-noself">非全球购超市商品<span>(仅当前区域适用)</span></div>
                            <div class="shipfee-pop-noself-t">满 ¥ ${shop.shopInfoProfileVO.shopCDShippingFeeVO.freeShippingFee}免运费</div>
                            <div class="freight-box"></div>
                            <div class="shipfee-pop-othertip">
                                <div style="font-weight: 600;">特别说明</div>
                                1、全球购超市商品与非全球购超市商品运费需分开收取。<br />
                                2、运费与配送方式、配送地址及订单实付金额相关（其中优惠劵、美豆及门店积分均不可抵扣运费），订单中的团抢商品为免邮时，不与普通商品叠加计算运费，所有运费最终以订单确认页为准。
                            </div>
                       {{/if}}


                    {{/if}}
                   <div class="shipfee-rule-more"><a target="_blank" href="https://help.gome.com.cn/question/9.html?intcmp=group-public01023">查看详细规则 <i>&#62</i></a></div>
                </div>
            </div>
        </div>
    {{/if}}
    {{if (shop.gomeCoupons && shop.gomeCoupons.length) || (shop.shopCoupons && shop.shopCoupons.length)}}
    <div class="coupon-desc">
        <span href="javascript:void 0" class="fr pr30 cl pr" hoverup="">
            <i class="c-i attention" coupon_desc style="margin: 0px 2px -2px 0px;"></i>
            <span class="tip " coupon_desc>优惠券使用说明</span>    
            <div class="pabs desc hide box-sd1 tip_desc" hover="">     
                <div class="white-arrow" style="top: -16px;left: 69px;font-size: 40px;">◆</div>
                <div class="txt-tip">因可能存在用券规则变化更新不及时等不确定性情况出现，最终该劵是否可用以填写订单页为准</div>
            </div>
        </span>
    </div>
    {{/if}}
</div>
<div  id="shopping-coupon-${shop.shopId}"  class="shopping-coupon-box" >
	<span href="javascript:void 0" class="fl tip pr30 cl pr"  hoverup>
		<i class="c-i tips_icon fl" style="margin:5px 5px 0px 0px;"></i>
		<div class="pabs desc hide box-sd1 coupon-remind" hover >
			<div class="white-arrow" style="top: -8px;left: 14px;font-size:3px;">◆</div>
			<h3>国美购物券是国美第三方店铺专属购物券，可跨店使用。</h3>
            <p>1. 您可在支持使用购物券的店铺商品详情页，或购物车页面领取购物券。</p>
            <p>2. 领取购物券成功后，购买商品达到购物券使用条件则可在提交订单前勾选并使用购物券。</p>
            <p>3. 同一订单同一店铺最多只可使用一张购物券，且不能和该店铺的店铺券同时使用。</p>
            <p>4. 商品参加本店铺的满减、满返、多买优惠、满赠、跨店铺满减、跨店铺满免活动后，不可再使用购物券。</p>
		    <a class="foot fr" href="http://help.gome.com.cn/article/279-297-0.html">了解更多<span  class="jt">&gt;</span></a>
        </div>
	</span>
	<a href="javascript:;" class="c-i  cart-coupon-trigger-icon  cart-coupon-show"  style="line-height: 29px" >
		<i style="margin-left: 19px; margin-right: 3px;" class=""></i>
		购物券
	</a>
	<span class="title-txt"></span>
</div>