<div class="sideright fl" dx-form>
	{{each(idx,item) allItems}}
	<div class="sideright_in">
		<ul class="gmlist clearfix">
			{{each items}}
				<li style="padding-left:20px;">
					<a class="imgLink mr10 fl" target="_blank" href="${itemURL}">
						<img src="${itemImageURL}" width="80" height="80">
					</a>
					<div class="commoditycon fl">
						<p >
							<a href="${itemURL}" class="p-name" target="_blank" title="${itemName}">
								${$config.limitStr(itemName,31)}
							</a>
						</p>
						<p class="p-ins">
                            {{if commerceitemVOFlag && commerceitemVOFlag == "SUB"}}
                            <span class="fontRed mr10">¥${$config.formatAmount(listPrice)} </span>
                            {{else}}
                            <span class="fontRed mr10">¥${$config.formatAmount(salePrice)} </span>
                            {{/if}}
							<span class="fontGray mr20 ml5"> x ${quantity} </span>
							<span class="fontGray mr10">{{html $config.labels[$value.state]}}</span>
							{{if $value.onTheRoad}}
							<span class="font118850 mr10">在途</span>
							{{/if}}
						</p>
						<p class="clearfix fuwu">
							{{if servers.myf=="Y"}}
							<span class="c-i freight mr10 fl"></span>
							{{/if}}
							{{if servers.serviceTagFlag}}
								<span class="support-server clearfix">
								{{if servers.serviceTagFlag=="back"}}
									<i class="c-i seven"></i>
									<span class="c449c57">支持7天无理由退货</span>
								{{else servers.serviceTagFlag=="back_no"}}
									<i class="c-i seven_no"> </i>
									<span class="cff5757">不支持7天无理由退货</span>
								{{else servers.serviceTagFlag=="back_15"}}
									<i class="mr10 fl back-server">15</i>
									<span class="c449c57">支持15天无理由退货</span>
								{{/if}}
								</span>
							{{/if}}
						</p>
					</div>
				</li>
			{{/each}}
		</ul>
	</div>
	{{/each}}
	<div class="hor-form" id="dx-from-hash">
		<div class="content">
			<div class="clearfix col">
			<div class="label">合约计划：</div>
			<div class="value">
				<p>${idenInfo.mobileNumber}&nbsp;&nbsp;&nbsp;&nbsp;${idenInfo.netInStateName}&nbsp;&nbsp;&nbsp;&nbsp;${idenInfo.netInAreaName}</p>
				<p style="line-height:1.5">${idenInfo.setMealName}</p>
			</div>
		</div>
		<div class="clearfix col">
			<div class="label"><i class="fontRed">*</i>机主姓名：</div>
			<div class="value">
				<input type="text" class="form-control" g-validate="dxjzxm" placeholder="请输入机主姓名" value="${idenInfo.idCardRealName}"  name="idCardRealName">
				<span class="nError nRed ml5" g-tip-validate="dxjzxm"></span>
			</div>
		</div>
		<div class="clearfix col">
			<div class="label"><i class="fontRed">*</i>身份证号：</div>
			<div class="value">
				<input type="text" class="form-control" g-validate="dxsfzh" placeholder="请输入机主身份证号" {{if idenInfo.idCardNumber}} no-modify="y" {{/if}} value="${idenInfo.idCardNumber}" name="idCardNumber">
				<span class="nError nRed ml5" g-tip-validate="dxsfzh"></span>
			</div>
		</div>
		<div class="clearfix col">
			<div class="label"><i class="fontRed">*</i>入网当月资费：</div>
			<div class="value">
				<div class="g-select fl" g-select style="width:90px;" g-validate="dx_dqyzf" value="${idenInfo.selectChargesWay}">
					<a href="javascript:void(0)">
						{{if idenInfo.selectChargesWayName}}
						<span g-title name="selectChargesWay">${idenInfo.selectChargesWayName}</span>
						{{else}}
						<span g-title>请选择</span>
						{{/if}}
						<i class="c-i arrowdown fr mt10"></i>
					</a>
					<ul class="hide" g-select-body>
						{{each(idx,item) idenInfo.chargesWays}}
						<li s-idx="${item.wayCode}">${item.wayName}</li>
						{{/each}}
					</ul>
				</div>
				<div class="nError nRed ml5 fl" style="line-height:30px;" g-tip-validate="dx_dqyzf"></div>
			</div>
		</div>
		<div class="clearfix col">
			<div class="label"><i class="fontRed">*</i>签署入网协议：</div>
			<div class="value">
				<div class="checkbox_out checkbox-align" g-check>
					{{if idenInfo.agreement }}
					<span class="c-i checkbox_chose" value="true" g-validate="dxrwxx">
						<input  type="checkbox" class="checkbox"/>
					</span>
					{{else}}
					<span class="c-i checkboxs"  g-validate="dxrwxx">
						<input  type="checkbox" class="checkbox"/>
					</span>
					{{/if}}
					<span>我已阅读并同意</span><a href="//news.gome.com.cn/20002526.html" target="_blank">《中国电信入网协议》</a>
					<span class="nError nRed ml5" g-tip-validate="dxrwxx"></span>
				</div>
			</div>
		</div>
		</div>
	</div>
</div>