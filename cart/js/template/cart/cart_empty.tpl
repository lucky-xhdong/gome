<div class="container">
	<div class="cart-empty-wrap">
		<div class="icons c-i cart-empty"></div>
		<div class="cart-empty-text">
			{{if cartApp.getLoginStatus()}}
			您的购物车是空的，快去<a href='${siteDomain}'>&nbsp;&nbsp;挑选商品<span class="cartjt">&gt;</span></a>
			{{else}}
			购物车内暂无商品，登录后将显示您之前加入的商品<br/>
			<div style="margin-top:8px;">
				<div class="cart-login-tip fl hide" id="idtruelogin" style="padding:0 15px 0 0;" act-not-login-info> 
					<a act-user-login class="cart-login-btn" style="color:white;" href="javascript:">登录</a> 
				</div>
				<a href='${siteDomain}' style="line-height:29px;">挑选商品<span class="cartjt">&gt;</span></a>
			</div>			
			{{/if}}
		</div>
	</div> 
</div>