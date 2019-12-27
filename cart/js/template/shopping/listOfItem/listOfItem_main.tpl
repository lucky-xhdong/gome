
<div class="clearfix">
	{{if $page.site=="gomeVirtualCard"}}
	<h3 class="title-color font14 fl">商品清单</h3>
	{{else}}
	<h3 class="title-color font14 fl shopfontb" >送货清单</h3>
	{{/if}}
	{{if $config.listOfitemTipVisible()}}
	<p class="fl fontGray tip">大家电配送时部分偏远地区需额外收取远程费 
		<a href="${$config.URL.dispatchQuery}" target="query" >
			查看详情
			<span class="jt">&gt;</span>
		</a>
	</p>
	{{/if}}
	{{if $config.backCardLink() && $page.site !== "secondHand" && $page.site !== "applePc"}}
	<a href="javascript:void 0" id="back-cart" class="fr tip cl" style="margin-right:29px;">
		返回购物车修改
	</a>
	{{/if}}
	<span href="javascript:void 0" class="fr tip pr30 cl pr" hoverup>
		<i class="c-i tips fl" style="margin:5px 5px 0px 0px;"></i>
		<span class="fl">价格说明</span>
		<div class="pabs desc hide box-sd1" hover>
			<div class="white-arrow" style="top: -8px;left: 69px;font-size:3px;">◆</div>
			由于系统延迟、区域变更、促销优惠等因素，商品价格可能会发生变动，最终成交价格请以本页面结算价格为准。
		</div>
	</span>
</div>
{{if $page.site=="gomeVirtualCard"}}
<div class="list-box">
	<div class="header clearfix">
		<div class="col-1">商品</div>
		<div class="col-2">单价</div>
		<div class="col-3">数量</div>
		<div class="col-4">金额</div>
	</div>
	{{each $data}}
	<div class="body clearfix">
		<div class="col-1">
			<a href="{{html itemURL}}" target="_blank" class="img">
				<img src="{{html itemImageURL}}">
			</a>
			<div class="info">
				<div class="title">
          <a href="{{html itemURL}}" target="_blank">${itemName}</a>
        </div>
				<div>
					<span class="fontRed" style="margin-right: 20px;">¥${$config.formatAmount(salePrice)}</span>
					<span class="fontGray" style="margin-right: 20px;">x&nbsp;${quantity}</span>
					<!-- <span class="fontGray">有货</span> -->
				</div>
			</div>
		</div>
		<div class="col-2">¥${$config.formatAmount(salePrice)}</div>
		<div class="col-3">x&nbsp;${quantity}</div>
		<div class="col-4">¥${$config.formatAmount(totalPrice)}</div>
	</div>
	{{/each}}
</div>
{{else}}
<div class="infoH">
	{{each(idx,shop) $data}}
	<!--国美自营购物车list-->
	<div class="info-bd clearfix">
        {{if $page.site == "warranty"}}
        <div class="shopping-main-header clearfix">
            <div class="cart-col-2 shopping-main-header-item" style="width: 480px; padding-left: 20px; text-align: left;">
                延保商品
            </div>
            <div class="shopping-main-header-item">
                单价
            </div>
            <div class="shopping-main-header-item">
                数量
            </div>
            <div class="shopping-main-header-item">
                金额
            </div>
        </div>
        <!--配送信息,商品清单-->
        <div class="dilivery-warranty clearfix">
            <!--判断是普通站点还是延保站点-->
            <div class="warrantyDilivery" id="warrantyDilivery"></div>
        </div>
        {{else}}
		<!--购物车list-top-->
		<div class="backStyle">
			<span class="hcon">配送信息</span>
            {{if shop.shopId == "GOME"}}
            <div class="fr" style="top:0px;padding-right:20px;position: relative;" hoverup-fee>
                <span class="shipfee-tip _alert_gome_total" is-gome="GOME" gome-total="${shop.profile.freight.total}">运费：{{html $config.shipTip(shop)}}</span>
				<!--运费弹窗提示语-->
                {{if shop.profile.freight && shop.profile.freight.total  }}
                <div class="pr zi1000">
                    <div class="hover-fee-pop hide box-sd1 pabs shipfee-tip-pop" hover-fee>
                        <div class="hover-fee-pop-ab"><em>&#9670;</em><span>&#9670;</span></div>
                        <div class="fee-list fee-list-total">
                            <div class="fee-calc">自营运费计算明细 <span class="fee">总计 <i class="fontRed">¥ ${$config.formatAmount(shop.profile.freight.total)}</i></span></div>
                        </div>
                        {{if shop.profile.freight.self}}
                        <div class="fee-list fee-list-self">
                            <div class="fee-calc">全球购超市商品 <span class="fee">运费 <i class="fontRed">¥ ${$config.formatAmount(shop.profile.freight.self)}</i></span></div>
                            <div class="fee-wei">重量：<span>${$config.formatAmountSuttle(shop.profile.freight.qqbhTotalSuttle)}</span>kg</div>
                        </div>
                        {{/if}}
                        {{if shop.profile.freight.noSelf}}
                        <div class="fee-list fee-list-noself">
                            <div class="fee-calc">非全球购超市商品 <span class="fee">运费 <i class="fontRed">¥ ${$config.formatAmount(shop.profile.freight.noSelf)}</i></span></div>
                        </div>
                        {{/if}}
                        <div class="shipfee-rule-more"><a target="_blank" href="https://help.gome.com.cn/question/9.html?intcmp=group-public01023">查看运费规则 <i>&#62</i></a></div>
                    </div>
                </div>
                {{/if}}
            </div>
            <span class="gomesend">国美自营</span>
            {{if shop.profile.reduce}}
                    <span class="fr fontRed" style="top:0px;padding-right:10px;">
                        已节省<span class='font-cursive'>¥</span>{{html $config.formatAmount(shop.profile.reduce)}}
                    </span>
            {{/if}}
            {{else}}
            <div class="fr" style="top:0px;padding-right:20px;position: relative;">
                <span class="shipfee-tip _alert_gome_total" is-gome="${shop.shopId}" gome-total="${shop.profile.freight.total}">运费：{{html $config.shipTip(shop)}}</span>
            </div>
            <span class="gomesend">${shop.shopName}</span>
                <span class="fr fontRed" style="top:0px;padding-right:10px;">

                    {{html $config.shopTip(shop)}}
                </span>
            {{/if}}
		</div>
		<!--配送信息,商品清单-->
		<div class="dilivery clearfix">
			<!--配送信息left-->
			<div class="sideleft fl" info-path="${idx}">
			</div>
			<!--配送信息right-->
			<div class="sideright fl" list-path="${idx}">
			</div>
		</div>
        {{/if}}
	</div>
	{{/each}}
</div>
{{/if}}
