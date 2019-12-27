<!--普通支付成功页-->
<div id="payment-normal" class="payment-normal">
	<div class="payment-left">
	<div class="payment-title">
		<b class="payment-icon c-i payment-success-ok"></b>
		<div class="payment-title-txt">订单支付成功！我们将尽快为您发货！</div>
	</div>
	<div style="margin-left: 90px;" class="payment-steps">	
			<div class="ready">
				<i class="c-i correct"></i>
				<p class="step-txt">提交订单</p>
			</div>
			<div class="process process-green"></div>
			<div class="ready">
				<i class="c-i payment_check_icon"></i>
				<p class="step-txt">审核中</p>
			</div>
			<div class="process"></div>
			<div class="ready">
				<i class="c-i radio"></i>
				<p class="step-txt">商品出库</p>
			</div>	
			<div class="process"></div>
			<div class="ready">
				<i class="c-i radio"></i>
				<p class="step-txt">确认收货</p>
			</div>	
			<div class="process"></div>
			<div class="ready">
				<i class="c-i radio"></i>
				<p class="step-txt">评价</p>
			</div>	
		<p class="two-dimension-code">
			<a href="//shouji${cookieDomain}/" target="_blank"><img src="${imgServer}/ui/pay_payment.png"></a>
		</p>
	</div>	
	{{if data.otherInfo.store !== null}}	
		<!-- <p style="float: left; padding: 20px 0 20px 90px;">	温馨提示:商品到店后，国美在线会发短信提醒您，请您在收到短信后3个自然日内至门店提货。
		</p> -->
	{{/if}}
	<!-- <div class="order-msg">
		<p>您确认收货后将获得：</p>
		<p class="mt10">
		    {{if data.orderId && data.pointsPlus}}
				<span>订单号：${data.orderId}</span>
				<span class="ml10">消费积分：${data.pointsPlus}</span>
			{{/if}}	
		</p>
		{{if data.giftList}}
			<p class="mt10">
				{{each(icoupon,coupon) data.giftList}}
					{{if coupon.couponType == "REDCOUPON"}}
						<span class="mr30 red-coupon">红券：${coupon.value}元X${coupon.quantity}张</span>
					{{/if}}
					{{if coupon.couponType == "SHOPCOUPON"}}
						<span class="mr30 shop-coupon">店铺券：${coupon.value}元X${coupon.quantity}张</span>
					{{/if}}
					{{if coupon.couponType == "BLUECOUPON"}}
						<span class="mr30 blue-coupon">蓝券：${coupon.value}元X${coupon.quantity}张</span>
					{{/if}}
			
				{{/each}}
			</p>
		{{/if}}
	</div> -->
	<div class="clearfix split-linetb">
		<div style="margin: 10px 0 0 26px;" class="order-handle"><!--团购站点类型 groupOnSite，mobileGroupOnSite，wapGroupOnSite -->
			<p>
				<a class="btn" 
					{{if data.mergePayment == false}}
						{{if data.siteId !== "groupOnSite" || data.siteId !== "mobileGroupOnSite" || data.siteId !== "wapGroupOnSite"}}  
							href="//myhome${cookieDomain}/member/shippingGroupDetailInfo/${data.orderId}/null"
						{{/if}}
						{{if (data.siteId == "groupOnSite" || data.siteId == "mobileGroupOnSite" || data.siteId == "wapGroupOnSite") && data.otherInfo.hasVirtual == true}}
							href="//g${cookieDomain}/ec/homeus/myaccount/group/groupOrderlist.jsp?flag=a1"	
						{{/if}}
					{{else}}
						href='//myhome${cookieDomain}/member/myOrder'
					{{/if}}	
					
				>查看订单</a>
				<a class="btn" style="margin-left: 20px;"  href="//www${cookieDomain}">继续购物</a>
				<p style="color:#f35600;margin-top: 10px;">您完成订单之后有机会获得美豆奖励哦</p>
			</p>
			<p style="margin-top:7px;" class="">
			    {{if data.orderId && data.pointsPlus}}
					<span>订单号：${data.orderId}</span>
					<!-- <span class="ml10">消费积分：${data.pointsPlus}</span> -->
				{{/if}}	
			</p>
			{{if data.giftList}}
				<p class="mt10">
					{{each(icoupon,coupon) data.giftList}}
						{{if coupon.couponType == "REDCOUPON"}}
							<span class="mr30 red-coupon">红券：${coupon.value}元X${coupon.quantity}张</span>
						{{/if}}
						{{if coupon.couponType == "SHOPCOUPON"}}
							<span class="mr30 shop-coupon">店铺券：${coupon.value}元X${coupon.quantity}张</span>
						{{/if}}
						{{if coupon.couponType == "BLUECOUPON"}}
							<span  class="mr30 blue-coupon">蓝券：${coupon.value}元X${coupon.quantity}张</span>
						{{/if}}
				
					{{/each}}
				</p>
			{{/if}}
		</div>
	</div>
	<div  style="margin:0px 0 0 90px">
		<p style="color: #f35600;">重要提醒：国美及第三方销售商不会以订单异常、订单缺货等为由，要求您点击任何网址链接进行退款操作。烦请关注国美平台 </p>
		<a href="//help.gome.com.cn/question/39.html"  style="color:#069;font-weight: bold;" target="_blank" class="">“退款说明”</a>
		<a href="//news.gome.com.cn/20001545.html" style="color:#069;font-weight: bold;" target="_blank" >“防诈骗说明” </a>
	</div>
	</div>
	<div id="payment-r-ad" class="payment-r-ad">
	</div>
	<div id="payment-b-ad" class="payment-b-ad">
	</div>
</div>	                 
<script type="text/javascript">
     (function (doc) {
         var t = parseInt((new Date()).getTime() / 1000),
                 v = t - t % 300;
         js = doc.createElement("script"),
                 fs = doc.getElementsByTagName("script")[0];
         js.charset = "utf-8";
         js.src = "//dsp.gome.com.cn/static/adserving/semi_ad_serving.js?v=" + v;
         fs.parentNode.insertBefore(js, fs);
     })(document);
 </script>
<!--俩个广告图片-->
<script type="text/javascript">
     (function (win) {
         var params1 = {};
         params1["_srv"] = "GOME";
         params1["_id"] = "payment-r-ad";

         params1["pid"] = "111";
         params1["w"] = "180";
         params1["h"] = "360";

         params1["k1"] = "";
         params1["k2"] = "";
         params1["k3"] = "";

         params1["max"] = "1";
         params1["code"] = "%3Cimg%20src%3D%22%7B%7BImgsrc%7D%7D%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E";

         params1["src"] = "";
         params1["ldp"] = "";
         params1["timeout"] = "1000";

         var params2 = {};
         params2["_srv"] = "GOME";
         params2["_id"] = "payment-b-ad";

         params2["pid"] = "112";
         params2["w"] = "990";
         params2["h"] = "80";

         params2["k1"] = "";
         params2["k2"] = "";
         params2["k3"] = "";

         params2["max"] = "1";
         params2["code"] = "%3Cimg%20src%3D%22%7B%7BImgsrc%7D%7D%22%20width%3D%22100%25%22%20height%3D%22100%25%22%3E";

         params2["src"] = "";
         params2["ldp"] = "";
         params2["timeout"] = "1000";
         __semi_rpq = win.__semi_rpq || [];
         __semi_rpq.push([params1, params2]);
     })(window); 
</script>     
<!--金融广告弹层-->
<script type="text/javascript">
   var adURL = '${data.otherInfo.actURL}';
   if (adURL) {
       var param = {
           reqInfo: '${data.otherInfo.actReqInfo}'
       };
       $.ajax({
           url: adURL,
           type: 'GET',
           dataType: 'JSONP',
           data: param,
          /* async: false,
           cache: false,*/
           success: function (data) {
               if ("0000" == data.resCode) {
                   $(document.body).append(data.htmlStr);
                   setTimeout(function () {
                       $("#success-body").show();
                   }, 500);
               } else {
               	    panel.biz001();
               
               }
           },
           error:function(data){
           	panel.biz001();
           }
       });
   }
</script>