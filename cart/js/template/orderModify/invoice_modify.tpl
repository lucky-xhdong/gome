<div class="contTit clearfix">
	<h3>发票信息</h3>
</div>
<ul class="editBox" id="j-invoice" g-pipe>
	{{if needInvoiceAvailable }}
		<li>
			<span class="fpSide">&nbsp;</span>
			{{if needInvoice}}
			<label><input type="radio" name="needInvoice" value="true"  checked="checked">需要发票</label>
			<label><input type="radio" name="needInvoice" value="false"  g-value-path="needInvoice">不要发票</label>
			{{else}}
			<label><input type="radio" name="needInvoice" value="true"  g-value-path="needInvoice">需要发票</label>
			<label><input type="radio" name="needInvoice" value="false"  checked="checked">不要发票</label>
			{{/if}}
			</label>
		</li>
	{{else}}
        <input style="display:none" type="radio" name="needInvoice" value="${needInvoice}" checked="checked">
	{{/if}}

	{{if needInvoice}}
		<li>
			<span class="fpSide"><em>*</em>发票类型：</span>
			{{if invoiceType==0}}
				<label>
					<input type="radio" name="invoiceType" value="0" checked="checked">普通发票
				</label>
			{{else invoiceType==1}}
				<label>
					<input type="radio" name="invoiceType"  value="0" disabled="disabled">普通发票
				</label>
				<label>
					<input type="radio" name="invoiceType" value="1" checked="checked">增值税发票
				</label>
			{{/if}}
		</li>
		{{if normalInvoice}}
			<li class="clearfix">
				<span class="fpSide"><em>*</em>发票抬头类型：</span>
				{{each(h,head) normalInvoice.headTypes}}
					<label class="invoiceLabel {{if !head.available}} lowlight{{/if}}">
						<input 
						type="radio" 
						name="titType" 			 
						value="${head.code}"
						{{if head.selected}}checked="checked"{{else}}g-fptt-path="normalInvoice,headTypes,${h}"{{/if}}
						>${head.label}
					</label>
					{{if head.label=="非企业单位"}}
					<div class="prel-company">
						<b class="c-i invoices_tips_icon tips_icon" g-hoverup-tip="fqydw"></b>
						<div class="pabs invoice-tip company-pabs box-sd1" g-hover-tip="fqydw">
							{{if !isIe678}}<div class="white-arrow">◆</div>{{/if}}
							<div>非企业单位包括政府机构及事业单位中非企业单位等，应选择 “非企业单位”开票。</div>
						</div>
					</div>
					{{/if}}
				{{/each}}
				
			</li>
			<li>
				<span class="fpSide"><em>*</em>填写抬头：</span>
				{{if selectedHead.code=="1" || selectedHead.code=="2" }}
					<input type="text" class="ipt w175" value="${normalInvoice.dhead}" g-validate="fptt-dw" g-blur="setStage normalInvoice.dhead this" maxlength="26" placeholder="请输入单位名称">
					<span class="red" g-tip-validate="fptt-dw"></span>
				{{else}}
					<input type="text" class="ipt w175" value="${normalInvoice.ghead}" g-validate="fptt" g-blur="setStage normalInvoice.ghead this" maxlength="26" placeholder="请输入发票抬头">
					<span class="red" g-tip-validate="fptt"><span class="remd">请勿填写“个人”字样，建议使用真实姓名。</span></span>
				{{/if}}
			</li>
			<li class="prel">
				{{if selectedHead.code=="1"}}
				<span class="fpSide">单位税号：</span>
				<input type="text" class="ipt w175" value="{{if normalInvoice.taxpayerNo == null}}{{else}}${normalInvoice.taxpayerNo}{{/if}}" maxlength="20" g-validate="dwsh" g-blur="setStage normalInvoice.taxpayerNo this">
				<span class="red" g-tip-validate="dwsh"></span>

				<b class="c-i invoices_tips1_icon tips_icon" g-hoverup-tip="dwsh"></b>
				<div class="pabs invoice-tip dwfh-pabs box-sd1" g-hover-tip="dwsh">
					{{if !isIe678}}<div class="white-arrow">◆</div>{{/if}}
					1.《国家税务总局公告2017年第16号》规定：自2017年7月1日起，发票抬头为企业单位的，需填写企业税号或统一社会信用代码；未填写为不合规发票，不得作为税收凭证。<br/>
					2.单位税号号为营业执照上的统一社会信用代码或者税务登记证上的税号，一般为15-20位，部分含英文字母。为确保发票开具的准确性，建议与公司财务确认后填写。
					<br/>
				</div>
				{{/if}}
			</li>
			<li class="clearfix last">
				<span class="fpSide"><em>*</em>发票内容<span id="fpHelp">[?]
				<div class="invoiceHelp">
					<b class="smallArrow"></b>
					<a target="_blank" href="//help.gome.com.cn/question/36.html#t1">电器类，百货类，图书类商品都是那些？</a>
					<a target="_blank" href="//help.gome.com.cn/question/36.html#t2">下单用余额、优惠券等可以开具发票吗?</a>
					<a target="_blank" href="//help.gome.com.cn/question/36.html#t3">请问我购买的商品发票由谁开具？</a>
					<a target="_blank" href="//help.gome.com.cn/question/36.html">了解更多>></a>
				</div>
				</span>：</span>
				{{if normalInvoice}}
					{{if gome&&shop}}
						<div class="fpProKinds">
							{{each(id,cont) normalInvoice.invoiceContClasses}}
								<div class="detailKinds">
								{{each(d,ct) cont.contTypes}}
								<label>
									{{if ct.selected}}
										<input type="radio" name="kind_${id}" checked="checked" value="${cont.invoiceContClass},${ct.code}">${ct.label}
									{{else}}
										<input type="radio" name="kind_${id}"
										g-ffnr-path="normalInvoice,invoiceContClasses,${id},contTypes,${d}"
										value="${cont.invoiceContClass},${ct.code}">${ct.label}
									{{/if}}
								</label>
								{{/each}}
								</div>
							{{/each}}
							<div class="shopMark" style="margin-left: 120px;">店铺商品，发票由店铺开具并寄出</div>
						</div>
					{{else gome && normalInvoice.invoiceContClasses && normalInvoice.invoiceContClasses.length}}
						<div class="fpProKinds">
			            	{{each(id,cont) normalInvoice.invoiceContClasses}}
		                    <div class="detailKinds">
	                        	{{each(d,ct) cont.contTypes}}
	                            <label>
                                	{{if ct.selected}}
										<input type="radio" name="kind_${id}" checked="checked" value="${cont.invoiceContClass},${ct.code}">${ct.label}
									{{else}}
										<input type="radio" name="kind_${id}" 
										g-ffnr-path="normalInvoice,invoiceContClasses,${id},contTypes,${d}"
										value="${cont.invoiceContClass},${ct.code}">${ct.label}
									{{/if}}
	                            </label>
	                            {{/each}}
		                    </div>
			                {{/each}}
			            </div>
		            {{else}}
		            	<span class="shopMark">店铺商品，发票由店铺开具并寄出</span>
					{{/if}}
				{{/if}}
			</li>
		{{/if}}
		{{if vatInvoice}}
			<li>
				<p class="vat-tips"><em class="vatIco"></em>增值税发票邮寄费用由用户承担，我们将在订单完成30个工作日之内开具并邮寄，使用到付形式，费用在25元左右。<br>您在收到包裹时， 请向快递员索要快递发票。店铺只开具普通发票。</p>
			</li>
			<li class="clearfix vatInfo">
				<p><span class="vatSide">单位名称：</span><span>${vatInvoice.head}</span></p>
				<p><span class="vatSide">纳税识别号：</span><span>${vatInvoice.taxpayerNo}</span></p>
				<p><span class="vatSide">注册地址：</span><span>${vatInvoice.registeredAddr}</span></p>
				<p><span class="vatSide">注册电话：</span><span>${vatInvoice.registeredPhone}</span></p>
				<p><span class="vatSide">开户银行：</span><span>${vatInvoice.taxpayerBank}</span></p>
				<p><span class="vatSide">银行帐户：</span><span>${vatInvoice.account}</span></p>
			</li>
			<li class="clearfix">
				<span class="fpSide"><em>*</em>收件人：</span>
				<input type="text" class="ipt" value="${vatInvoice.shippingName}" maxlength="20" g-validate="zpsjr" g-blur="setStage vatInvoice.shippingName this">
				<span class="red" g-tip-validate="zpsjr"></span>
			</li>
			<li class="clearfix">
				<span class="fpSide"><em>*</em>手机号码：</span>
				<input type="text" class="ipt" value="${vatInvoice.shippingPhone}" maxlength="11" g-validate="zpsjhm" g-blur="setStage vatInvoice.shippingPhone this">
				<span class="red" g-tip-validate="zpsjhm"></span>
			</li>
			<li class="clearfix">
				<span class="fpSide">发票邮寄地址：</span>
				<span class="vatFpCont">${vatInvoice.shippingAddress}</span>
			</li>
			<li class="clearfix">
				<span class="fpSide"><em>*</em>发票内容<span id="fpHelp">[?]
				<div class="invoiceHelp">
					<b class="smallArrow"></b>
					<a target="_blank" href="//help.gome.com.cn/question/36.html#t1">电器类，百货类，图书类商品都是那些？</a>
					<a target="_blank" href="//help.gome.com.cn/question/36.html#t2">下单用余额、优惠券等可以开具发票吗?</a>
					<a target="_blank" href="//help.gome.com.cn/question/36.html#t3">请问我购买的商品发票由谁开具？</a>
					<a target="_blank" href="//help.gome.com.cn/question/36.html">了解更多>></a>
				</div>
				</span>：</span>
				<span class="vatFpCont">明细</span>
			</li>
			<li class="clearfix lowlight">
				<span class="vatSide red">温馨提示：</span><span>建议您将发票内容开为产品明细，否则您将无法享受厂商或国美在线的正常质保。</span>
			</li>
		{{/if}}
	{{/if}}
</ul>