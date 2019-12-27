<div class="identity_fill pr bgwhite" g-pipe>
	{{if notAuth(im)}}
	{{else}}
	<em class="c-i closebtn pabs close_window" g-click="dialogHide"></em>
	{{/if}}
	<p >根据海关规定，购买海外购商品需要填写当前收货人身份证信息。如信息不正确、不真实，会导致通关失败，无法发货。国美海外购承诺您的个人信息会被严格保密。</p>
	<div class="">
		<dl class="clearfix">
			<dt class="fl w80 text-right mr20"><b class="fontRed pdl_r5">*</b>姓名：</dt>
			<dd class="fl"><input class="form-control" value="${data.idCardRealName}" style="width:161px;" g-validate="hwg-name"></dd>
			<dd class="fl ml10 fontRed" g-tip-validate="hwg-name"></dd>
		</dl>
		<dl class="clearfix">
			<dt class="fl w80 text-right mr20"><b class="fontRed pdl_r5">*</b>身份证号：</dt>
			<dd class="fl"><input class="form-control" value="${data.idCardNumber}" style="width:161px;" g-validate="hwg-card" {{if data.idCardNumber}} no-modify="y" {{/if}}></dd>
			<dd class="fl ml10 fontRed" g-tip-validate="hwg-card"></dd>
		</dl>
	</div>
	<div style="clear:both;"></div>
	<div class="identity_btn clearfix mt20">
		
		{{if notAuth(im)}}
		{{else}}
		<a class="btn btn-default btn-w83  fl mr20" href="javascript:void(0)" g-click="dialogHide">取消</a>
		{{/if}}
		<a class="btn btn-primary btn-w83 fl" href="javascript:void(0)" g-click="saveAction">保存</a>
	</div>
</div> 