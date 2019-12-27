<div class="contBox" id="address">
    <div class="contTit clearfix" >
        <h3>收货人信息</h3><a href="javascript:;" class="modif">修改</a>
    </div>
    <div class="infoBox">
        <p>
            <span class="nam">${name}</span>
            <span class="add">${stateName}${cityName}${countyName}${townName} ${address}</span>
            <span class="tel">${mobileNumber}</span>
            <span class="tel">${phoneNumber}</span>
        </p>
    </div>
    <ul class="editBox prel" style="display:none;">
        <li>
            <span class="addSide"><em>*</em>收货人：</span>
            <input type="text" id="userName" class="ipt" size="18" value="${name}"  g-validate="consignee" >
            <span class="red" g-tip-validate="consignee"></span>
        </li>
        <li class="clearfix">
            <span class="addSide"><em>*</em>所在地区：</span>
            <span class="iptDis">${stateName}<em></em></span>
            <span class="iptDis">${cityName}<em></em></span>
            <span class="iptDis">${countyName}<em></em></span>
            <span class="iptDis">
            {{if isStoreSelfpickup}}
                ${storeName}
            {{else}}
                ${townName}
            {{/if}}
            <em></em>
            </span>
            <span class="hint">地区无法变更，敬请谅解！</span>
        </li>
        <li style="overflow: hidden;">
            <span class="addSide"><em>*</em>详细地址：</span>
            <input type="text" id="userAddress" class="ipt {{if  isNotEditAdd}}iptDis{{/if}}" {{if isNotEditAdd}}readonly="true"{{/if}}  size="47" g-validate="detailAddress" 
                {{if isStoreSelfpickup}}
                value="${storeAddress}" 
                {{else}}
                value="${address}" 
                {{/if}}
            > 
            {{if isNotEditAdd}}
                <span>极速达订单不支持修改详细地址，敬请谅解！</span>
            {{/if}}
            <span class="red" g-tip-validate="detailAddress"></span>
        </li>
        <li>
            <span class="addSide"><em>*</em>手机号码：</span>
            <input type="text" id="mNumber" class="ipt" size="20" value="${mobileNumber}" g-validate="phone"><span class="remd mr15">&nbsp;</span>
            固定电话：<input type="text" id="pNumber" class="ipt" size="30" maxlength="30" g-validate="call" 
            {{if isStoreSelfpickup}}
            value="${storePhone}" 
            {{else}}
            value="${phoneNumber}"  
            {{/if}}
            >
        </li>
        <li class="phone-call-pos">
            <div class="red" g-tip-validate="phone"></div>
            <div class="red" g-tip-validate="call"></div>
        </li>
        <li class="last">
            <span class="addSide">邮箱：</span>
            <input type="text" id="userEmail" class="ipt" size="20" value="${email}" g-validate="email"><span class="remd">用来接收订单提醒邮件，便于您及时了解订单状态</span>
            <span class="red" g-tip-validate="email"></span>
        </li>
    </ul>
</div>
{{if showDeliveryInfo}}
<div class="contBox" id="deliverTime">
    <div class="contTit clearfix">
        <h3>送货时间</h3><a href="javascript:;" class="modif">修改</a>
    </div>
    <div class="infoBox">
        {{if showDeliverTime}}
        <p>
            <span class="timType">您选择使用</span>
            <span class="orange">${showDeliverTime.label}</span>
            <input type="hidden" id="dTime" value="${showDeliverTime.label}">
        </p>
        {{else}}
        <p>
            <span class="timType">您选择使用</span>
            <span class="orange">无送货时间，请选择</span>
        </p>
        {{/if}}
    </div>
    <div class="editBox" style="display:none">
        {{each deliverTimeOptions}}
            <label class="timLable">
                {{if selected}}
                    <input type="radio" name="timeChoose" value="${code}" checked="checked">${label}
                {{else}}
                    <input type="radio" name="timeChoose" value="${code}">${label}
                {{/if}}
            </label>
        {{/each}}
    </div>
</div>
{{/if}}
{{if showInvoice && !data.elecInvoice && !data.vatInvoice}}
<div class="contBox" id="invoice">
    <div class="contTit clearfix" >
        <h3>发票信息</h3><a href="javascript:;" class="modif">修改</a>
    </div>
    <div class="infoBox">
        {{if needInvoice}}
            <ul class="invoiceInfo">
                <li>
                    <span class="sideTit">发票类型：</span>
                    {{if invoiceType==0}}
                        普通发票
                    {{else invoiceType==1}}
                        增值税发票
                    {{/if}}
                </li>
                {{if normalInvoice}}
                    <li>
                        <span class="sideTit">发票抬头：</span>
                        ${selectedHead.label}
                    </li>
                    <li>
                        <span class="sideTit">填写抬头：</span>
                        ${normalInvoice.head}
                    </li>
                    <li class="clearfix">
                        <span class="sideTit">发票内容：</span>
                        <div class="fpList">
                        {{if gome && normalInvoice.invoiceContClasses && normalInvoice.invoiceContClasses.length}}
                            <p>${selectedContentType.contTypesLable}</p>
                            {{if shop}}
                                <p>店铺商品，发票由店铺开具并寄出</p>
                            {{/if}}
                        {{else}}
                            店铺商品，发票由店铺开具并寄出
                        {{/if}}
                        </div>
                    </li>
                {{/if}}
            </ul>
        {{else}}
        <p>不要发票</p>
        {{/if}}
    </div>
</div>
{{/if}}
<div class="btnBox">
    <a id="saveModif">保存修改</a>
    <a class="cancel j-close">取消</a>
</div>