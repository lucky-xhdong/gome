{{if good._incrementServiceItems && good._incrementServiceItems.length > 0}}
    <div act-warranty-prom
        class="cart-coupon cart-prom" {{if meidianId}} style="margin: 7px 0 2px 0;" {{else}} style="margin: 7px 0 2px 0;" {{/if}}
        gui-popup
        gui-popup-animate="1"
        gui-popup-toggle="1"
        >
        <div class="js-popup-child">
            {{if $page.site == "warranty"}}
                <span style="color: #5e5e5e; padding: 0 9px;">${good.hasDatas.hasSel}</span>
            {{else}}
                <i class="c-i server-edit vertical-align-sub"></i>
                {{if  good._incrementServiceItemsSelected}}
                    重选增值服务
                {{else}}
                    选购增值服务
                {{/if}}

            {{/if}}
            <i class="c-i cart-arrow arrowdown js-i"></i>
        </div>
        <div class="cart-coupon-box" gui-popupbox>
            <div class="cart-box-border cart-warranty-wrap" gui-popupbox-animate style="margin-left: -4px">
                <div class="cart-box-arrow">
                    <i>◆</i>
                    <i class="cart-arrow-cover">◆</i>
                </div>
                <div class="cart-warranty cart-warranty-table" >
                    {{if $page.site == "warranty"}}
                    <div class="cw-item" style="border-right:0">
                        <span class="title">
                            <img src="${good._incrementServiceItems[0].iconUrl}" style="width: 16px;height: 16px"/>
                            ${good._incrementServiceItems[0].childGroupName}
                        </span>
                        {{each(k,v) good._incrementServiceItems[0].incrementServiceItems}}
                            <p class="cwi-p-info">
                                <a act-warranty-change
                                   {{if v.selected}} class="selected init-selected" {{/if}}
                                   href="javascript:;"
                                   change = "false"
                                   data-childgroupId = "${good._incrementServiceItems[0].childGroupId}"
                                   data-servicetype = "${v.serviceType}"
                                   data-mainitemid = "${v.mainItemId}"
                                   data-incrementservicesid = "${v.incrementServiceSid}"
                                   data-incrementservicepid = "${v.incrementServicePid}"
                                   data-incrementserviceskuno = "${v.incrementServiceSkuNo}"

                                >
                                    <span class="item-text" >
                                        {{if v.promotionType == "1"}}
                                            <em class="title-title" style="margin-right: 8px;">特惠</em>
                                        {{/if}}
                                        ${v.displayName}
                                        ${v.numOfYear}年
                                        <em class="ml5">¥&nbsp;${$config.formatAmount(v.price)}</em>
                                    </span>
                                    {{if v.selected}}
                                        <i class="c-i chose_icon" ></i>
                                    {{else}}
                                        <i class="c-i chose_icon hide"></i>
                                    {{/if}}
                                </a>
                            </p>
                        {{/each}}
                    </div>
                    {{else}}
                    {{each(i,item) good._incrementServiceItems}}
                        <div class="cw-item" {{if i==good._incrementServiceItems.length-1}} style="border-right:0" {{/if}}>
                            <span class="title">
                                <img src="${item.iconUrl}" style="width: 16px;height: 16px"/>
                                ${item.childGroupName}
                            </span>
                            {{each(k,v) item.incrementServiceItems}}
                            <p class="cwi-p-info">
                                <a act-warranty-change
                                   {{if v.selected}} class="selected init-selected" {{/if}}
                                href="javascript:;"
                                change = "false"
                                data-childgroupId = "${item.childGroupId}"
                                data-servicetype = "${v.serviceType}"
                                data-mainitemid = "${v.mainItemId}"
                                data-incrementservicesid = "${v.incrementServiceSid}"
                                data-incrementservicepid = "${v.incrementServicePid}"
                                data-incrementserviceskuno = "${v.incrementServiceSkuNo}"
                                >
                                        <span class="item-text" >
                                            {{if v.promotionType == "1"}}
                                                <em class="title-title" style="margin-right: 8px;">特惠</em>
                                            {{/if}}
                                            ${v.displayName}
                                            ${v.numOfYear}年
                                            <em class="ml5">¥&nbsp;${$config.formatAmount(v.price)}</em>
                                        </span>
                                {{if v.selected}}
                                <i class="c-i chose_icon" ></i>
                                {{else}}
                                <i class="c-i chose_icon hide"></i>
                                {{/if}}
                                </a>
                            </p>
                            {{/each}}
                        </div>
                    {{/each}}
                    {{/if}}
                </div>
                <div class="cart-box-group-a">
                    <a href="javascript:;" class="cart-btn" gui-popupclose>取消</a>
                    <a href="javascript:;" class="cart-btn cart-red-bg ml20"
                        gui-popupclose
                        act-warranty-save
                        data-itemid = ${good.itemId}
                        data-skuno = ${good.skuNo}
                        data-productid = ${good.productId}
                        data-quantity = "${good.quantity}"
                        {{if good.shareAndScanInfo}}
                           data-brandcode = "${good.shareAndScanInfo.brandCode}"
                           data-employeeid = "${good.shareAndScanInfo.employeeId}"
                           data-fanlikeyid = "${good.shareAndScanInfo.fanliKeyId}"
                           data-meidianid = "${good.shareAndScanInfo.meiDianId}"
                        {{/if}}
                        >确认</a>
                </div>
            </div>
        </div>
    </div>
{{else}}
    {{if $page.site == "warranty"}}
        <div class="cart-coupon cart-prom"style="margin: 2px 0 0 0;">
            <div class="cart-coupon-trigger" style=" cursor: default;">
                <i class="c-i server-edit "></i>
                <span style="color: #5e5e5e; padding: 0 9px; color: #ccc;">选购增值服务</span>
                <i class="c-i cart-arrow arrowdown"></i>
            </div>
        </div>
    {{/if}}
{{/if}}