<span class="status c-i order_success"></span><h3>
{{if paymentInfos[pme]}}
	${paymentInfos[pme].title}
{{/if}}</h3>
<h4>
{{if paymentInfos[pme]}}
	${paymentInfos[pme].type}
{{/if}}
（${itemTypeNum}种商品共 ${itemNum}件）： <b class="oc_red">¥ ${payAmount.toFixed(2)}</b></h4>