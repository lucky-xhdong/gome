<div>选择支付方式</div>
<div class="clearfix">
	{{each $data}}
		{{if selected}}
		<label class="lb_check show fl pr50" idx="${$index}">       
			<span class="c-i radio_chose mr5 mt4 fl"></span>       
			<input type="radio" class="btn_radio">       
			${$config.labels[$value.code]}      
		</label>
		{{else}}
		<label class="lb_check show fl pr50" idx="${$index}">       
			<span class="c-i radio mr5 mt4 fl"></span>       
			<input type="radio" class="btn_radio">       
			${$config.labels[$value.code]}   
		</label>
		{{/if}}
	{{/each}}
</div>
<div style="height:20px;"></div>
<div class="btns">
	<a href="javascript:;" class="btn btn-primary mr10" g-list-save>保存付款方式</a>
	<a href="javascript:;" class="btn btn-default" g-list-canel>取消</a>
</div>