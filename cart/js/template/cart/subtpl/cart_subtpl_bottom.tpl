<div class="cart-bottom-info {{if data.cartProfile.containsHwg}}cart-bottom-hwg{{/if}}"> 
	{{if data.cartProfile.containsHwg && data.cartProfile.hwgitemChecked}}
	<div class="cart-bottom-notice">
		<div class="container">
			海关规定：由保税区邮寄的物品，每单限额2000元；由海外邮寄的物品，每单限额1000元；由港澳台邮寄的物品，每单限额800元。
		</div>
	</div>
	{{/if}}
	<div class="container" style="position:relative">
		{{if data.cartProfile.itemCount && $data.selectedGoodsData}}
		<div class="cart-selectgoods-wrap" click-document-hide g-show-hover-obj {{if $data.isBottomOpen}}style="display:block"{{/if}}>
			{{html GTPL.bottom_select_good($data.selectedGoodsData)}}
		</div>
		{{/if}}
		<div class="cart-col-1 pr">
			{{if hasCheckbox}}
				<div 
					act-check-all-items
					gui-checkbox
					gui-class-unchecked="good-checkboxs-no"
					gui-class-checked="c-i checkbox_chose"
					gui-class-disabled="no_check"
					class="">
						<input type="checkbox"
						{{if data.cartProfile.allItemsSelected}}
							checked
						{{/if}}
						>
				</div>
				<div class="pabs hide selectAllItemOffBottom selectAllItemOffCheck">
                    <div class="white-arrow">◆</div>
                    您还未选择商品
                </div>
			{{else}}
				&nbsp;
			{{/if}}
		</div>
		<div class="cart-col-2">
			{{if hasCheckbox}}全选
			<a href="javascript:" act-batch-remove-item class="black del-goods" style="margin-left:20px;" data-save="${hasDeleteArea}">删除</a>
			{{/if}}
		</div>
		<div class="cart-col-3 mlf14"></div>
		<div class="cart-col-4 cart-totle-price {{if !data.cartProfile.containsHwg}} pl84 {{/if}}" >
			<div
				{{if hasCheckbox}} g-hoverup-obj {{/if}}
				class="cart-bottom-selectgood"
				{{if data.cartProfile.discAmount}} style="padding-top:7px;" {{/if}}>
				已选
				<span class="cart-price-red selected-price">
						${ data.cartProfile.itemCount }
					</span>
				件商品
				{{if hasCheckbox}}
				{{if $data.isBottomOpen}}
				<em class="c-i arrow-bottom"></em>
				<i class="c-i bottom-arrow" click-document-hide style="display:inline;"></i>
				{{else}}
				<em class="c-i arrow-top"></em>
				<i class="c-i bottom-arrow" click-document-hide style="display:none;"></i>
				{{/if}}
				{{/if}}
			</div>
			<div class="bottom-total-pirce" {{if data.cartProfile.discAmount}} style="padding-top:7px;" {{/if}}>
				<dl>
					<dt>
						总计（不含运费）：
					</dt>
					<dd class="cart-price-red ffyh" style="font-size:18px;font-weight:900;">￥${ data.cartProfile.totalAmount.toFixed(2) || '0.00' }</dd>
				</dl>
				{{if data.cartProfile.discAmount}}
				<dl>
					<dt>已节省&nbsp;&nbsp;： </dt>
					<dd><span class="ffyh">￥</span>${parseFloat(data.cartProfile.discAmount).toFixed(2) || '0.00'}</dd>
				</dl>
				{{/if}}
			</div>
		</div> 
		<div class="cart-col-5">
			{{if data.cartProfile.containsHwg}}
				<a href="javascript:" class="flex-btn fl order-btn {{if !data.cartProfile.hwgitemChecked}}init-disabled{{/if}}" act-init-order data-hwg="true">
					<span class="btn-normal">海外购结算<em class="c-i arrowRight-white"></em></span>
					<div class="btn-loading">结算中<i></i></div>
				</a>
				<div class="flex-split fl"></div>
				<a href="javascript:" class="flex-btn fl order-btn {{if !data.cartProfile.normalItemChecked}}init-disabled{{/if}}" act-init-order>
					<span class="btn-normal">去结算<em class="c-i arrowRight-white"></em></span>
					<div class="btn-loading">结算中<i></i></div> 
				</a>
			{{else}}
				<a href="javascript:" 
					act-init-order  
					{{if data.cartProfile.hwgitemChecked && !data.cartProfile.normalItemChecked}}
						data-hwg="true"
					{{/if}}
				{{if !data.cartProfile.hwgitemChecked && !data.cartProfile.normalItemChecked}}
					class="init-disabled order-btn"
				{{else}}
					class="order-btn"
				{{/if}}
				>	
					<span class="btn-normal">去结算<em class="c-i arrowRight-white"></em></span>
					<div class="btn-loading">结算中<i></i></div> 
				</a>
			{{/if}} 
		</div> 
	</div>
</div>