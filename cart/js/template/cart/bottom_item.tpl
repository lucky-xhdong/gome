<li class="cart-scroll-item fl">
	{{if isOnlyShow}}
		<div class="cart-scroll-image">
			<img src="${image}" alt="" width="100" height="100"> 
		</div>
	{{else}}
		<a 
		class="cart-scroll-image"
		{{if maima_param}}
			maima_param="{{html maima_param}}"
		{{/if}}
		 href="${url}" target="_blank">
			<img src="${image}" alt="">
			<div class="cart-scroll-tip">
				加入成功
			</div>
		</a>
	{{/if}}
	<div class="cart-scroll-title">
		{{if isOnlyShow}}
			${title}
		{{else}} 
			<a 
			class="black" 
			{{if maima_param}}
				maima_param="{{html maima_param}}"
			{{/if}}
			href="${url}" target="_blank">${title}</a>
		{{/if}}
	</div> 
	
	<div class="cart-scroll-price ffyh">
	{{if price}}
		&yen;${price}
	{{/if}}
	</div> 
	
	{{if isPrdStockOff}}
		<a class="cart-scroll-btn" href="javascript:;" style="cursor: not-allowed;color: #ccc;">加入购物车</a>
	{{else}}
		<a 
			class="cart-scroll-btn
				{{if isOnlyShow}}
					cart-scroll-btn-disabled
				{{/if}}  
			" href="javascript:"
			act-add-cart
			{{if maima_param}}
				maima_param="{{html maima_param}}"
			{{/if}}
			data-sid="${sid}"
			data-pid="${pid}"
			data-gid="${giftId}"
			data-keyid="${keyid}"
			data-mid="${mid}"
			data-storeid="${storeid}"
			{{if skuMappingSuit}}
				data-skuMappingSuit="${skuMappingSuit}"
			{{/if}}
			{{if isHWG}}
				data-hwg="${isHWG}"
			{{/if}}
		>加入购物车</a>
	{{/if}}
	
</li> 

