{{if $page.site == "warranty"}}
    {{if good._incrementServiceItems && good._incrementServiceItems.length > 0}}
            <div class="clearfix cart-warranty-item">
                <div class="cart-col-2" style="text-align: center;">
                    <div class="warrantypricefixed">¥&nbsp;${$config.limitStr($config.formatAmount(good.hasDatas.hasPrice)+'',12)}</div>
                </div>
                <!--<div class="cart-col-2 cart-warranty-2">
                    ${good.hasDatas.hasQuantity}
                </div>-->
                <div class="cart-col-2 cart-warranty-2">
                    <div class="warrantyfixed">¥&nbsp;${$config.formatAmount(good.hasDatas.hasAmount)}</div>
                </div>
            </div>
    {{else}}
            <div class="clearfix cart-warranty-item">
                <div class="cart-col-2" style="text-align: center;">
                    <div class="warrantypricefixed">¥&nbsp;0.00</div>
                </div>
                <!--<div class="cart-col-2 cart-warranty-2">
                    0
                </div>-->
                <div class="cart-col-2 cart-warranty-2">
                    <div class="warrantyfixed">¥&nbsp;0.00</div>
                </div>
            </div>
    {{/if}}
{{else}}
    {{if good._incrementServiceItems && good._incrementServiceItems.length > 0}}
            {{each(i, item) good._incrementServiceItems}}
            {{each(k,v) item.incrementServiceItems}}
            {{if v.selected}}
            <div class="clearfix cart-warranty-item">
                <div class="cart-col-3" style="color:#888888;">
                    <div class="i-block margin-left_92">
                        ${config[v.serviceType].lable}
                        ${v.promotionType == "1" ? "特惠":""}${v.displayName}
                        ${v.numOfYear}年
                    </div>
                    <div class="fr i-block">
                        <span style="color: #333">¥&nbsp;${$config.limitStr($config.formatAmount(v.price)+'',12)}</span> x ${v.quantity}
                    </div>
                </div>
                <div class="delete" act-delete-server data-aid="${v.mainItemId}">
                    删除
                </div>
            </div>
            {{/if}}
            {{/each}}
            {{/each}}
    {{else}}
        &nbsp;
    {{/if}}
{{/if}}