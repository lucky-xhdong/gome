<h3 class="font14">身份验证</h3>
<div class="content">
	<div class="row clearfix">
		<div class="col-1">
			<span class="fontRed">*</span>手机号码：
		</div>
		<div class="col-2">
			<input type="text" class="form-control" id="mtk-phone" 
			value="{{if sm}}${sm}{{else}}${$config.shoppingAtom.mtksfyz.mobile}{{/if}}">
			<span class="fontGray tip">用于接收短信验证码，以便支付成功后在订单详情页查看电子卡卡号和密码。</span>
			<span class="errfix">错误提示</span>
		</div>
	</div>
	<div class="row clearfix mt20">
		<div class="col-1">
			<span class="fontRed">*</span>短信验证码：
		</div>
		<div class="col-2">
			<input type="text" class="form-control" id="mtk-yzm" value="">
			<a class="btn btn-default" href="javascript:;" id="get-mtk-yzm">获取短信验证码</a>
			<!-- <span class="fontGray tip">用于接收短信验证码，以便支付成功后在订单详情页查看电子卡卡号和密码。</span> -->
			<span class="errfix"></span>
		</div>
	</div>
</div>