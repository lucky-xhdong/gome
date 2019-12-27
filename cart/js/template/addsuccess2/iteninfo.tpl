<div class="item-info-body clearfix">
	<div class="msg">
		<i class="c-i add-cart-success"></i>商品已成功加入购物车！
	</div>	
	<div class="fl">
		<div class="clearfix">
			<a href="${item.itemURL}" class="imgLink fl">
				<img width="50" height="50" src="${item.itemImageURL}">
			</a>
			<div class="imgContent fl">
				<p><a href="${item.itemURL}" class="title text-overflow" title="${item.itemName}" target="_blank">${item.itemName}</a></p>
				<p>
					{{if item.salesPropertyVOs && item.salesPropertyVOs.length}}
					{{each(i, salesProperty) item.salesPropertyVOs}}
						{{if i<2}}
							<span>${salesProperty.labelKey}：${salesProperty.labelVal}</span>
						{{/if}}
					{{/each}}
					{{/if}}
					<span>数量：${item.quantity}</span>
				</p>
			</div>
		</div>
	</div>
	<div class="mt15 fr">
		<a defurl="${item.itemURL}" id="idGoBack" class="cart-success-btn btn-default40" style="margin-right:7px;">返回</a>
		<a href="//cart${cookieDomain}/home/cart" class="cart-success-btn btn-primary40">我的购物车<em class="c-i arrowRight-white"></em></a>
	</div>
</div>