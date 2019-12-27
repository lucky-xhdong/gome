<div class="m_invoice box-sd2">
	<div class="header clearfix">
		<h3>发票信息</h3>
		<i  class="c-i closebtn-new close" g-close></i>
	</div>
	<div class="content {{if selectedInvoce.invoiceType.code=="2"}}zz{{/if}}">
		<div class="col-1">
			{{if invoiceNeedType=="N"}}
				<a href="javascript:void(0)" class="btn btn-check" g-value-path="invoiceNeedType" g-value="Y">开具发票</a>
				<a href="javascript:void(0)" class="btn btn-check btn-checked">不开发票<i class="c-i chose_icon"></i>
				</a>
			{{else invoiceNeedType=="Y"}}
				<a href="javascript:void(0)" class="btn btn-check btn-checked">开具发票<i class="c-i chose_icon"></i></a>
				<a href="javascript:void(0)" class="btn btn-check" g-value-path="invoiceNeedType" g-value="N">不开发票</a>
			{{else invoiceNeedType=="YD"}}
				<!--<a href="javascript:void(0)" class="btn btn-check btn-checked">开具发票<i class="c-i chose_icon"></i></a>
				<a href="javascript:void(0)" class="btn btn-check btn-checked btn-disabled">不开发票</a>-->
			{{/if}}
		</div>
	{{if invoiceNeedType!="N"}}
		<div class="clearfix col">
			<div class="label"><i class="fontRed">* </i>发票类型：</div>
			<div class="value pr">
                <div class="value-box">
                    <div class="clearfix value-items">
                        <div class="nzp">
                            {{each invoices}}
                                {{if invoiceType.code!="2"}}
                                    {{if invoiceType.visible}}
                                        {{if invoiceType.available==false}}
                                            <a href="javascript:void(0);" class="btn btn-check btn-disabled">
                                        {{else invoiceType.selected}}
                                            <a href="javascript:void(0);" class="btn btn-check btn-checked">
                                            <i class="c-i chose_icon"></i>
                                        {{else}}
                                            <a href="javascript:void(0);" class="btn btn-check" g-i-path="invoices,${$index}">
                                        {{/if}}
										<span class="invoiceType-label" data-value="${invoiceType.label}">${invoiceType.label}</span>
                                            </a>
                                    {{/if}}
                                {{/if}}
                            {{/each}}
                        </div>
                        <div class="zp">
                            {{each invoices}}
                                {{if invoiceType.code=="2"}}
                                    {{if invoiceType.visible}}
                                        {{if invoiceType.available==false}}
                                            <a href="javascript:void(0);" class="btn btn-check btn-disabled">
                                        {{else invoiceType.selected}}
                                            <a href="javascript:void(0);" class="btn btn-check btn-checked">
                                            <i class="c-i chose_icon"></i>
                                        {{else}}
                                            <a href="javascript:void(0);" class="btn btn-check" g-i-path="invoices,${$index}">
                                        {{/if}}
                                        <span class="invoiceType-label" data-value="${invoiceType.label}">${invoiceType.label}</span>
                                            </a>
                                    {{/if}}
                                {{/if}}
                            {{/each}}
                        </div>
                    </div>
                </div>
                {{if invoices.length > 2}}
				<div class="invoice-more" data-selected="${invoices[0].invoiceType.selected}">更多<em>></em></div>
				{{/if}}
                {{if selectedInvoce.invoiceType.code==1}}
                <div class="tip">
                    电子发票是增值税电子普通发票的简称，是国家税务总局认可的有效凭证。<br/>其法律效力、基本用途、基本使用规定等与普通纸质发票相同，可用于用户报销、维权、保修。<br/>如您本次购买的商品暂未实现电子发票开具，我们将为您更换纸质发票。
                </div>
                {{/if}}
			</div>
		</div>
		{{if selectedInvoce.invoiceType.code=="2"}}
			{{if selectedInvoce.invoiceType.state == '0' || selectedInvoce.invoiceType.state == '3' || selectedInvoce.invoiceType.state == '4'}}
			<div class="clearfix col">
				<div class="label">单位名称：</div>
				<div class="value l30">${selectedInvoce.corpName}</div>
			</div>
			<div class="clearfix col">
				<div class="label">纳税识别号：</div>
				<div class="value l30">${selectedInvoce.taxpayerNo}</div>
			</div>
			<div class="clearfix col">
				<div class="label">注册电话：</div>
				<div class="value l30">${selectedInvoce.registeredPhone}</div>
			</div>
			<div class="clearfix col">
				<div class="label">开户银行：</div>
				<div class="value l30">${selectedInvoce.taxpayerBank}</div>
			</div>
			<div class="clearfix col">
				<div class="label">银行账户：</div>
				<div class="value l30">${selectedInvoce.accountNo}</div>
			</div>
			{{/if}}
		{{else}}
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>发票抬头：</div>
				<div class="value pr">
					{{each selectedInvoce.headTypes}}
						{{if visible}}
							{{if label=="非企业单位"}}
								<div class="company-pr" hoverup>
									{{if selected}}
										<a href="javascript:void(0)" class="btn btn-check btn-checked" >
											非企业单位
											<i class="c-i chose_icon"></i>
											<b class="c-i invoices_tips_icon tips_icon" g-hoverup-tip="fqydw" style="display: none;"></b>
										</a>
									{{else}}
										<a href="javascript:void(0)" class="btn btn-check" g-h-path="${selectedInvoce.path},headTypes,${$index}">
											非企业单位
											<b class="c-i invoices_tips_icon tips_icon" g-hoverup-tip="fqydw" style="display: none;"></b>
										</a>
									{{/if}}
									<div class="pabs invoice-tip company-pabs box-sd1" g-hover-tip="fqydw">
										<div class="white-arrow">◆</div>
										<div>非企业单位包括政府机构及事业单位中非企业单位等，应选择 “非企业单位”开票。</div>
									</div>

								</div>
							{{else}}
								{{if selected}}
									<a href="javascript:void(0)" class="btn btn-check btn-checked">${label}
										<i class="c-i chose_icon"></i>
									</a>
								{{else}}
									<a href="javascript:void(0)" class="btn btn-check" g-h-path="${selectedInvoce.path},headTypes,${$index}">${label}</a>
								{{/if}}
							{{/if}}
						{{/if}}
					{{/each}}
					
				</div>
			</div>
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>抬头内容：</div>
				<div class="value">
					{{if selectedHead.code=="0"}}
						<input type="text" class="form-control" g-validate="fptt" value="${selectedHead.content}" placeholder="请输入发票抬头" value-path="${selectedHead.path},content" />
					{{else}}
						<input type="text" class="form-control value-up-path" g-validate="fptt-dw" value="${selectedHead.content}" placeholder="请输入单位名称" value-path="${selectedHead.path},content" onblur="$(this).attr('placeholder','')" onfocus="$(this).attr('placeholder','请输入单位名称')" />
					{{/if}}
					<span class="nError nRed" g-tip-validate="{{if selectedHead.code=='0'}}fptt{{else}}fptt-dw{{/if}}">{{html selectedHead.fptt}}</span>
				</div>
			</div>
			{{if selectedHead.code=="1"}}
				<div class="clearfix col" >
					<div class="label">单位税号：</div>
					<div class="value pr" hoverup>
						<input  type="text" 
						g-validate="dwsh" 
						class="form-control"
						placeholder="请输入单位税号"
						value="${selectedInvoce.taxPayerNo}" 
						value-path="${selectedInvoce.path},taxPayerNo"/>
						<b class="c-i invoices_tips1_icon tips_icon" g-hoverup-tip="dwsh" style="display: none;"></b>
						<span class="nError nRed" g-tip-validate="dwsh">{{html selectedInvoce.dwsh}}</span>
						<div class="pabs invoice-tip dwfh-pabs box-sd1" g-hover-tip="dwsh">
							<div class="white-arrow">◆</div>
                            1.《国家税务总局公告2017年第16号》规定：自2017年7月1日起，发票抬头为企业单位的，需填写企业税号或统一社会信用代码；未填写为不合规发票，不得作为税收凭证。<br/>
                            2.单位税号为营业执照上的统一社会信用代码或者税务登记证上的税号，一般为15-20位，部分含英文字母。为确保发票开具的准确性，建议与公司财务确认后填写。

                        </div>
					</div>
				</div>
			{{/if}}
		{{/if}}
		{{if selectedInvoce.invoiceContentTypes&&selectedInvoce.invoiceContentTypes.length!=0}}
		<div class="clearfix col">
			<div class="label"><i class="fontRed">* </i>发票内容：</div>
			<div class="value">
				{{each selectedInvoce.invoiceContentTypes}}
					{{if selected}}
					<a href="javascript:void(0)" class="btn btn-check btn-checked w54">
						${label}
						<i class="chose_icon c-i"></i>
					</a> 
					{{else}}
						<a href="javascript:void(0)" class="btn btn-check w54" g-c-path="${selectedInvoce.path},invoiceContentTypes,${$index}" >
						${label}
						</a> 
					{{/if}}
				{{/each}}
			</div>
		</div>
		{{if selectedInvoce.invoiceType.code!="2"}}
		<div class="clearfix col b-col">
			<div class="label b-label b-tip">&nbsp;</div>
			<div class="value b-tip">
                {{if pType=="O"}}
                <p>由店铺决定，发票内容由店铺开具并寄出</p>
				{{else}}
				<p>声明：建议你发票的内容开为产品明细，否则您将无法正常享受厂商或者国美的正常质保。</p>
				{{/if}}
			</div>
		</div>
		{{/if}}
		{{/if}}
		{{if selectedInvoce.invoiceType.code=="1"}}	
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>收票手机：</div>
				<div class="value">
					<input  
					type="text"
					{{if selectedInvoce.mobilePhone}}
					no-modify="y"
					{{/if}}
					g-validate="spsj" 
					class="form-control phone_input" 
					value="${selectedInvoce.mobilePhone}" 
					value-path="${selectedInvoce.path},mobilePhone" 
					/>
					<span class="nError nRed" g-tip-validate="spsj">{{html selectedInvoce.spsj}}</span>
				</div>
			</div>
			<div class="clearfix col">
				<div class="label">收票邮箱：</div>
				<div class="value">
					<input  type="text" g-validate="spyx" class="form-control mail_input" value="${selectedInvoce.email}" value-path="${selectedInvoce.path},email" 
					/>
					<span class="nError nRed" g-tip-validate="spyx">{{html selectedInvoce.spyx}}</span>
				</div>
			</div>
		{{/if}}
		{{if selectedInvoce.invoiceType.code=="2"}}
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>收票人：</div>
				<div class="value">
					<input type="text" g-validate="zpsjr" class="form-control" value="${selectedInvoce.consigneeName}" value-path="${selectedInvoce.path},consigneeName">
					<span class="nError nRed" g-tip-validate="zpsjr">{{html selectedInvoce.zpsjr}}</span>	
				</div>
			</div>
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>手机号码：</div>
				<div class="value">
					<input 
					type="text" 
					{{if selectedInvoce.consigneePhone}}
					no-modify="y"
					{{/if}}
					g-validate="zpsjhm" 
					class="form-control" 
					value="${selectedInvoce.consigneePhone}"
					value-path="${selectedInvoce.path},consigneePhone">
					<span class="nError nRed" g-tip-validate="zpsjhm">{{html selectedInvoce.zpsjhm}}</span>	
				</div>
			</div>
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>所在地：</div>
				<div class="value"  id="zp_address_select" style="width:auto;" value-path="address">
					<span style="border-color:#e5e5e5;" > 
             			<a  href="javascript:void(0)" name="address" class="add_select" 
             			value-path="${selectedInvoce.path},address"
             			value="${selectedInvoce.vStateCode}.${selectedInvoce.vCityCode}.${selectedInvoce.vCountyCode}.${selectedInvoce.vTownCode}"
             			g-validate="address" >
             				{{if selectedInvoce}} 
		                    <span show-label>${selectedInvoce.vStateName}${selectedInvoce.vCityName}${selectedInvoce.vCountyName}${selectedInvoce.vTownName}</span>
		                    {{else}}
		                    <span show-label class="fl">请选择</span>
		                    {{/if}}
	                   		<i class="c-i select_arrowup ml10 mt10"></i> 
	                  	</a>
	                </span>
	      			<div class="pr add_out hide">
	                	<em class="pabs c-i arrowup add_up2" style="top:1px;"></em>
	                 	<div class="gCity"></div>
      				</div>
				</div>
			</div>
            {{if selectedInvoce.invoiceType.state=="0"}}
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>邮寄地址：</div>
				<div class="value">
					<input type="text" name='zpdetailAddress' g-validate="zpyjdz" class="form-control" value="${selectedInvoce.registeredAddress}" value-path="${selectedInvoce.path},registeredAddress">
					<span class="nError nRed" g-tip-validate="zpyjdz"></span>
				</div>
			</div>
            {{/if}}
		{{/if}}
		{{if $page.site=="gomeVirtualCard" && selectedInvoce.invoiceType.code == '0'}}
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>收票人：</div>
				<div class="value">
					<input type="text" g-validate="zzshr" class="form-control" value="${selectedInvoce.consigneeInfo.name}" value-path="${selectedInvoce.path},consigneeInfo,name">
					<span class="nError nRed" g-tip-validate="zzshr">{{html selectedInvoce.zzshr}}</span>	
				</div>
			</div>
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>所在地：</div>
				<div class="value"  id="id_address_select" style="width:auto;" value-path="${selectedInvoce.path},consigneeInfo,address">
					<span style="border-color:#e5e5e5;" > 
             			<a  href="javascript:void(0)" name="address" class="add_select" 
             			g-validate="address" 
             			value-path="${selectedInvoce.path},consigneeInfo,address,tip"
             			value="${selectedInvoce.consigneeInfo.address.provinceCode}${selectedInvoce.consigneeInfo.address.cityCode}${selectedInvoce.consigneeInfo.address.countyCode}${selectedInvoce.consigneeInfo.address.townCode}"
             			>
             				{{if selectedInvoce.consigneeInfo.address.provinceName}}
		                    <span show-label>${selectedInvoce.consigneeInfo.address.provinceName}${selectedInvoce.consigneeInfo.address.cityName}${selectedInvoce.consigneeInfo.address.countyName}${selectedInvoce.consigneeInfo.address.townName}</span>
		                    {{else}}
		                    <span show-label class="fl">请选择</span>
		                    {{/if}}
	                   		<i class="c-i select_arrowup ml10 mt10"></i> 
	                  	</a>
	                </span>
					<span class="nError nRed" g-tip-validate="address">{{html selectedInvoce.consigneeInfo.address.address}}</span>
	      			<div class="pr add_out hide">
	                	<em class="pabs c-i arrowup add_up2" style="top:1px;"></em>
	                 	<div class="gCity"></div>
      				</div>
					<!-- <input type="text" g-validate="zzszd" class="form-control" value="" value-path="">
					<span class="nError nRed" g-tip-validate="zzshr">{{html selectedInvoce.zzshr}}</span>-->
				</div>
			</div>
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>详细地址：</div>
				<div class="value">
					<input type="text" g-validate="zzxxdz" class="form-control" name="detailedAddress" value="${selectedInvoce.consigneeInfo.address.detailedAddress}" value-path="${selectedInvoce.path},consigneeInfo,address,detailedAddress"> 
					<span class="nError nRed" g-tip-validate="zzxxdz">{{html selectedInvoce.zzxxdz}}</span>
				</div>
			</div>
			<div class="clearfix col">
				<div class="label"><i class="fontRed">* </i>手机号码：</div>
				<div class="value col2fl" style="margin-right:15px;">
					<input 
					type="text"
					{{if selectedInvoce.consigneeInfo.mobileNumber}}
					no-modify="y" 
					{{/if}}
					g-validate="zzsjhm" 
					class="form-control fl" 
					value="${selectedInvoce.consigneeInfo.mobileNumber}" 
					value-path="${selectedInvoce.path},consigneeInfo,mobileNumber" 
					style="width:208px"> 
			
				</div>
				<div class="col2fl lh30 ml5">固定电话：</div>
				<div class="value col2fl">
					<input type="text" g-validate="zzgddh" class="form-control fl" value="${selectedInvoce.consigneeInfo.phoneNumber}" value-path="${selectedInvoce.path},consigneeInfo,phoneNumber" style="width:208px"> 
				</div>
				<div class="clearfix"></div>
				<span class="nError nRed col2flMsg" g-tip-validate="zzsjhm">{{html selectedInvoce.zzsjhm}}</span>
				<span class="nError nRed" g-tip-validate="zzgddh">{{html selectedInvoce.zzgddh}}</span>
			</div>
			<div class="clearfix col">
				<div class="label">邮件：</div>
				<div class="value">
					<input type="text" g-validate="zzyj" class="form-control" value="${selectedInvoce.consigneeInfo.email}" value-path="${selectedInvoce.path},consigneeInfo,email">	
					<span class=" ml15 fontGray">方便您实时接收订单状态提醒</span>
					<span class="nError nRed" g-tip-validate="zzyj">{{html selectedInvoce.zzyj}}</span>	
				</div>
			</div>
		{{/if}}
		{{if selectedInvoce.invoiceType.available}}
            {{if selectedInvoce.invoiceType.code == "0"}}
            <div class="clearfix col b-col value-tips">
                <div class="label b-label b-tip"><i class="c-i attention"></i></div>
                <div class="value b-tip">
                    <p>部分商品纸质发票会在顾客签收商品后7-15个工作日寄出，请耐心等待！</p>
                </div>
            </div>
            {{else selectedInvoce.invoiceType.code == "2"}}
                {{if selectedInvoce.invoiceType.state == '0'}}
                <div class="clearfix col b-col value-tips">
                    <div class="label b-label b-tip"><i class="c-i attention"></i></div>
                    <div class="value b-tip">
                        <p>发票将在订单完成后7-15个工作日寄出，请耐心等待！</p>
                    </div>
                </div>
                {{else selectedInvoce.invoiceType.state == '3' || selectedInvoce.invoiceType.state == '4'}}
                <div class="clearfix col b-col value-tips">
                    <div class="label b-label b-tip"><i class="c-i attention"></i></div>
                    <div class="value b-tip">
                        <p>您的增值税发票资质正在审核中，可去<a href="//myhome${cookieDomain}/member/myInvoice" target='_blank'>我的国美-增票认证</a>处查看详情</p>
                    </div>
                </div>
                {{else}}
                <div class="clearfix col b-col value-tips">
                    <div class="label b-label b-tip"><i class="c-i attention"></i></div>
                    <div class="value b-tip">
                        <p>您暂未开通增票资质或是增票资质审核未通过，请您尽快去电脑端<a href="//myhome${cookieDomain}/member/myInvoice" target='_blank'>我的国美->增票认证</a>处提交增票资质申请。</p>
                    </div>
                </div>
                {{/if}}
            {{/if}}
		{{/if}}
	{{/if}}
		<div class="clearfix col">
			<div class="label">&nbsp;</div>
			<div class="value">
				<a href="javascript:void(0)" id="saveInvoice" class="btn btn-primary btn-large" style="margin-top:20px;width: 120px;">
					保存发票信息
				</a>
			</div>
		</div>
		<div class="clearfix col b-col">
			<div class="label b-label b-tip">&nbsp;</div>
			<div class="value b-tip">
				{{if pType=="O"}}
				<p>温馨提示：非自营商品发票的开具和邮寄等情况，由店铺商家自行决定。如有任何疑问，可联系商家确认。</p>
				{{/if}}
				{{if $page.site!="gomeVirtualCard" && $page.site!="gomeEntityCard"}}
				<a href="${$config.URL.invoiceRule}" target="_blank">了解发票制度详情&nbsp;<span class="jt">&gt;</span></a>
				{{/if}}
			</div>
		</div>
	</div>
</div>