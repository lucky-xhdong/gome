<!-- 延保购物车 -->
<div class="container cart-ext">
	<div class="cart-shop-header">
		<div class="cart-col-1">
            <div class="cart-war-tit" style="font-weight: bold; margin-right: 18px; float: left; font-size: 20px; font-family: 'Microsoft YaHei';">选购增值服务</div>
            <div class="cart-war-subtit" style="float: left;">您可以对原订单：${data.orderId}的以下商品选购延保服务</div>
		</div>
		<!--<div class="cart-col-2" style="width:220px;text-align:right;margin-right:10px;">
			${data.warrantyCartSubtotalVO.itemCount}件商品
			&nbsp;&nbsp;
			小计：<span class="cart-shop-amount ffyh">¥${data.warrantyCartSubtotalVO.totalAmount.toFixed(2) || '0.00'}</span>
		</div>-->
	</div>
	<div class="cart-main-header clearfix">
		<div class="cart-col-2" style="text-align: left; width: 330px; padding-left: 20px;">
			可购买增值服务的商品
		</div>
        <div class="cart-col-3" style="width: 100px; margin-right: 15px;">
            可购数量
        </div>
		<div class="cart-col-3" style="margin-right: 100px; text-align: center;">
			选择增值服务
		</div>
		<div class="cart-col-3" style="width: 100px; margin-right: 15px;">
			单价
		</div>
		<div class="cart-col-3" style="width: 100px;">
			金额
		</div>
	</div>
	<div class="cart-shop-goods" style="position: relative;">
		{{each(iwcsv, wcsv) data.commerceItemVOs}}
		<div class="cart-shop-good cart-shop-good-common clearfix">
			<div class="cart-col-1">
			</div>
			<div class="cart-col-2">
				<a href="${wcsv.itemURL}" target="_blank">
					{{if wcsv.itemImageURL}}
					<img src="${wcsv.itemImageURL}" alt="">
					{{/if}}
				</a>
			</div>
			<div class="cart-col-3" style=" width: 208px;">
				<div class="cart-good-name" style="padding-top: 5px;">
					<a href="${wcsv.itemURL}" target="_blank" title="${wcsv.itemName}">
						${wcsv.itemName}
					</a>
				</div>

			</div>
            <div class="cart-col-2" style="padding-right: 45px;">
                <div class="cart-col-2 cart-warranty-2" style="padding: 10px 0 0">
                    {{if wcsv._incrementServiceItems && wcsv._incrementServiceItems.length > 0}}
                        ${wcsv.hasDatas.hasQuantity}
                    {{else}}
                    0
                    {{/if}}
                </div>
            </div>
            <div class="cart-col-3" style="padding-right: 35px;">
                {{html GTPL.warranty_selectBox({meidianId:wcsv.meidianId,good:wcsv,config:$config.warrantyAtom})}}
            </div>
			<div class="cart-col-3 warrantyqutityfixed">
                <div class="clearfix" style=" width: 240px">
                    {{html GTPL.warranty_list({good:wcsv,config:$config.warrantyAtom})}}
                </div>
			</div>
		</div>
		{{/each}}
	</div>
</div>
<div class="cart-bottom-wrap">
	<div class="cart-bottom-info">
		<div class="container">
			<div class="cart-col-1"></div>
			<div class="cart-col-2"></div>
			<div class="cart-col-3 mlf14"></div>
			<div class="cart-col-4 cart-totle-price pl84">
				<div class="bottom-total-pirce">
					<dl>
						<dt>
							总计（不含运费）：
						</dt>
						<dd class="cart-price-red ffyh" style="font-size:18px;font-weight:900;">￥${ data.warrantyCartSubtotalVO.totalAmount.toFixed(2) || '0.00' }</dd>
					</dl>
				</div>
			</div>
			<div class="cart-col-5">
				<a href="javascript:" act-init-order class="order-btn
					{{if data.warrantyCartSubtotalVO.totalAmount<=0}}
						init-disabled
					{{/if}}
					"
				>
					<span class="btn-normal">去结算<em class="c-i arrowRight-white"></em></span>
					<div class="btn-loading">结算中<i></i></div>
				</a>
			</div>
		</div>
	</div>
</div>
<!-- /延保购物车 -->