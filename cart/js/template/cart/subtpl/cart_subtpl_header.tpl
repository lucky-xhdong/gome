<div class="cart-main-header clearfix">
	<div class="cart-col-1 pr">
		{{if hasCheckbox}}
			<div 
				act-check-all-items
				gui-checkbox
				gui-class-unchecked="good-checkboxs-no"
				gui-class-checked="c-i checkbox_chose"
				gui-class-disabled="no_check"
				style="margin-top: 16px;">
					<input type="checkbox"
					{{if data.cartProfile.allItemsSelected}}
						checked
					{{/if}}
					>
			</div>
            <div class="pabs hide selectAllItemOffTop selectAllItemOffCheck">
                <div class="white-arrow">◆</div>
                您还未选择商品
            </div>
		{{else}}
			&nbsp;
		{{/if}}
		
	</div>
	<div class="cart-col-2">
		{{if hasCheckbox}}
			全选
		{{else}}
			&nbsp;
		{{/if}} 
	</div><!-- $page.site 主站 团购 抢购   style --> 
	<div style="width:389px;" class="cart-col-3">
		商品信息
	</div>
	<div class="cart-col-4">
		<div class="cart-good-real-price">单价</div>
	</div>
	<div class="cart-col-5 text-left">
		数量
	</div>
	<div class="cart-col-6">
		<div class="cart-good-amount">小计</div>
	</div>
	<div class="cart-col-7">
		操作
	</div>
</div>