
<!--定金支付成功页-->
	<div class="payment-down" id="payment-down">
		<i class="c-i order_success"></i>
		<b>定金支付成功，商品预定成功！</b>
        <p style="margin-left: 57px;">活动结束后，我们将以短信的形式提醒您支付尾款，请您耐心等待。</p>
		
		<div class="payment-steps">	
			<div class="ready">
				<i class="c-i correct"></i>
				<p class="step-txt">定金支付</p>
			</div>
			<div class="process"></div>
			<div class="ready">
				<i class="c-i radio"></i>
				<p class="step-txt">支付尾款</p>
			</div>
			<div class="process"></div>
			<div class="ready">
				<i class="c-i radio"></i>
				<p class="step-txt">商品出库</p>
			</div>	
			<div class="process"></div>
			<div class="ready">
				<i class="c-i radio"></i>
				<p class="step-txt">收货确认</p>
			</div>	
			<div class="process"></div>
			<div class="ready">
				<i class="c-i radio"></i>
				<p class="step-txt">交易成功</p>
			</div>	
		</div>	

		<div  class="order-handle"> <!--定金页与普通支付成功页区别-->
			<p>
				<a class="btn" href="//myhome${cookieDomain}/member/shippingGroupDetailInfo/${data.orderId}/null">查看订单</a>
				<a class="btn" style="margin-left: 20px;" href="//www${cookieDomain}">继续购物</a>
			</p>
			<span style=" display:block;margin-top: 20px;color: #f35600;">提示： 如订单赠送优惠券或者积分将会在您确认收货后，发放到你的账户； <br>您也可<a class="download-txt"    href="//shouji.gome.com.cn">下载国美移动客户端</a>，随时跟踪订单状态 </span>
		</div>			
	</div>