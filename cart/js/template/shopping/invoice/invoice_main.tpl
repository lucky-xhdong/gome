<div class="invoice">
	{{if $page.site=="haiwaigou"}}
	<h3 class="invoice_h3">发票信息</h3>
	<ul class="invoice_lists ml20">
        <li>
            <label class="lb_check fl mr28">
                海外购商品不提供发票
            </label>
        </li>
	{{else invoiceNeedType=="Y"||invoiceNeedType=="YD"}}
		<h3 class="invoice_h3 pr">
            发票信息
			{{if selectedInvoce.headTypes && selectedInvoce.headTypes.length > 1}}
                {{if selectedInvoce.headTypes[1].available &&　selectedInvoce.headTypes[1].selected && $config.isBlank(selectedInvoce.taxPayerNo)}}
                <div class="taxpayerNo-tip pabs">
                    <div class="white-arrow">◆</div>
                    <em class="tip-exc">！</em>开企业发票，请填写“单位税号”，以免影响您报销{{if $page.site == "warranty" && selectedInvoce.invoiceType.label == "纸质发票"}}；支付成功后，发票会在7个工作日内邮寄{{/if}}
                </div>
                {{else}}
                    {{if $page.site == "warranty" && selectedInvoce.invoiceType.label == "纸质发票"}}
                    <div class="taxpayerNo-tip pabs">
                        <div class="white-arrow">◆</div>
                        <em class="tip-exc">！</em>支付成功后，发票会在7个工作日内邮寄
                    </div>
                    {{/if}}
                {{/if}}
            {{else}}
                {{if $page.site == "warranty" && selectedInvoce.invoiceType.label == "纸质发票"}}
                <div class="taxpayerNo-tip pabs">
                    <div class="white-arrow">◆</div>
                    <em class="tip-exc">！</em>支付成功后，发票会在7个工作日内邮寄
                </div>
                {{/if}}
			{{/if}}
        </h3>
		<ul class="invoice_lists ml20">
		<li>
			{{if open==false}}
			{{if selectedHead.content}}
				{{if selectedInvoce.invoiceType.code == "2"}}
					{{if selectedInvoce.invoiceType.state == '0'}}
						<span class="mr15">${selectedHead.content}</span>
					{{/if}}
				{{else}}
					<span class="mr15">${selectedHead.content}</span>
				{{/if}}
			{{/if}}
			<span class="mr15">${selectedInvoce.invoiceType.label}</span>
			<span class="mr15">${selectedContentType.label}</span>
				{{if allowUpdate==true}}
				<a href="javascript:void 0" class="ml20 change" g-modify-path="1">修改</a>    
				{{/if}}
			{{/if}}
		</li>
	{{else invoiceNeedType=="N"}}
			<h3 class="invoice_h3">发票信息</h3>
			<ul class="invoice_lists ml20">
		<li>
			<label class="lb_check fl mr28">
				不开发票
			</label>
			{{if allowUpdate==true}}
			<a href="javascript:void 0" class="ml20 change" g-modify-path="0">修改</a>
			{{/if}}
		</li>
	{{/if}}
	</ul>
</div>
