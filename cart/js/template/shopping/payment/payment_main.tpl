<h3 class="title-color font14">支付方式</h3>
<div class="content">
	<div class="clearfix ml40">
	{{each(pidx,pay) list}}
		{{if pay.visible}}
        {{if pay.c=="storesPayment"}}<!--门店付款-->
		 <div class="fl pr mr15 zi100" hoverup click-document-pre>
            {{if pay.selected}}
			<a href="javascript:void(0)"  class="btn pr btn-check btn-checked mw120" code="storesPayment">
				<span class="name max_w145">${pay.tip.label}-${pay.ps.label}</span>
				<b class="c-i tips_icon pabs payway_tips2 hide" hover g-hoverup-tip="${pay.c}"></b>
				<i class="c-i chose_icon"></i>
			</a>
			{{else pay.available==false}}
			<a href="javascript:void(0)"  class="btn pr btn-check btn-disabled mw84" >
				<span class="name max_w145">${pay.tip.label}</span>
				<b class="c-i tips_icon pabs payway_tips2 hide" hover g-hoverup-tip="${pay.c}"></b>
			</a>
			{{else}}
			<a href="javascript:void(0)"  class="btn pr btn-check mw120" code="storesPayment" tpmmtag="选择支付方式|99|1">
				<span class="name max_w145">${pay.tip.label}</span>
				<b class="c-i tips_icon pabs payway_tips2 hide" hover g-hoverup-tip="${pay.c}"></b>
			</a>
			{{/if}}
			<div class="tips_detail pabs hide del2 box-sd1" g-hover-tip="${pay.c}">
				<div class="white-arrow" style="top: -9px;left: 86px;font-size:15px;">◆</div>
				{{html pay.tip.desc}}
				<a href="${pay.tip.href}" target="_blank">${pay.tip.name}</a>
			</div>
            <div class="pr hide" id="mendianfukuan_tip" click-document-hide>
	            <div class="pabs content_area  zi100 " > 
	            	<em class="pabs c-i arrowup"></em>
	            	<a  class="closed c-i closebtn-new pabs" href="javascript:void(0)" g-close></a>
	            	<div id="mendianfukuan_store"></div>
	            </div>
            </div>
        </div>
		{{else}}
		<div class="fl pr mr15" hoverup>
			{{if pay.selected}}
			<a href="javascript:void(0)"  class="btn pr btn-check btn-checked mw84" >
				<span class="name">${pay.tip.label}</span>
				<b class="c-i tips_icon pabs payway_tips hide" hover g-hoverup-tip="${pay.c}"></b>
				<i class="c-i chose_icon"></i>
			</a>
			{{else pay.available==false}}
			<a href="javascript:void(0)"  class="btn pr btn-check btn-disabled mw84">
				<span class="name">${pay.tip.label}</span>
				<b class="c-i tips_icon pabs payway_tips hide" hover g-hoverup-tip="${pay.c}"></b>
			</a>
			{{else}}
			<a href="javascript:void(0)" g-path="${pidx}" class="btn pr btn-check mw84"  tpmmtag="选择支付方式|99|1">
				<span class="name">${pay.tip.label}</span>
				<b class="c-i tips_icon pabs payway_tips hide" hover g-hoverup-tip="${pay.c}"></b>
			</a>
			{{/if}}
			<div class="tips_detail pabs hide box-sd1" g-hover-tip="${pay.c}">				
				<div class="white-arrow" style="top: -9px;left: 86px;font-size:15px;">◆</div>
				{{html pay.tip.desc}}
				<a href="${pay.tip.href}" target="_blank">${pay.tip.name}</a>
			</div>
		</div>
		{{/if}}
		{{/if}}
	{{/each}}
	{{if $config.isDxSite()}}
		<div class="payMsg fl"><i class="c-i attention"></i>选定的号码只能为您保留15分钟，请您尽快提交并支付订单</div>
	{{/if}}
	{{if $config.isJixinSite()}}
		<div class="payMsg fl"><i class="c-i attention"></i>选定的号码只能为您保留15分钟，请您尽快提交并支付订单</div>
	{{/if}}
	{{if $page.site=="presell"}}
		{{if presellModifyStatus=="modify"}}
		<div class="fl pr" style="line-height:31px">		
			<div class="input-group">
				<span class="fl">尾款支付信息通知手机号码：</span> 
				<input
				no-modify="y"
				type="text" 
				value="${$config.shoppingAtom.deliveryPreSell.smsMobileNumber}"
				presell-text-phone
				class="form-control sm r-no-radius" 
				style="width:80px;">
				<a href="javascript:void(0)" 
				class="btn btn-primary sm l-no-radius" presell-btn-phone>确定</a>
				<a href="javascript:void(0)" class="fl ml10" presell-canel-phone>取消</a>
			</div>
			<span class="fontRed pabs" presell-error-phone style="top:24px;left:157px;"></span>
		</div>
		{{else}}
		<div class="fl" style="line-height:31px">		
			<i class="c-i tips fl" style="margin-right:4px;margin-top: 7px;"></i>
			<span>尾款支付信息通知手机号码：${$config.shoppingAtom.deliveryPreSell.smsMobileNumber}</span> 
			<a href="javascript:void 0" class="ml20" presell-modify-phone>修改</a>
		</div>
		{{/if}}

	{{/if}}
	</div>
</div>