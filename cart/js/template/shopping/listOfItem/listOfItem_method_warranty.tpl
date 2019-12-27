{{if data.length}}
    {{each(idx, oneData) data}}
        <div class="cart-good-box" >
            {{if oneData.groups && oneData.groups.length}}
                {{each(idxx, oneItems) oneData.groups}}
                    {{if oneItems.commerceItemsGroup && oneItems.commerceItemsGroup.length}}
                        {{each(idxxxx, oneItem) oneItems.commerceItemsGroup}}
                            <div class="clearfix cart-warranty-item">
                                <div class="cart-col-2 cart-warranty-2" style="margin-top: 10px; padding-left: 20px; width: 480px; text-align: left;">
                                    <a class="clearfix" style="display: block;" href="${oneItem.itemURL}" target="_blank">
                                        <img style="float: left;" width="80" height="80" class="mr10 itemImageURL" src="${oneItem.itemImageURL}" alt="" />
                                        <p class="itemName" style="padding-top: 10px; color: #333; text-decoration: none;">${oneItem.itemName}</p>
                                    </a>
                                </div>
                                <div class="cart-col-2 cart-warranty-2">
                                    <p class="salePrice">¥ ${$config.formatAmount(oneItem.salePrice)}</p>
                                </div>
                                <div class="cart-col-2 cart-warranty-2">
                                    <p class="quantity">${oneItem.quantity}</p>
                                </div>
                                <div class="cart-col-2 cart-warranty-2">
                                    <p class="coordinateSubAmount">¥ ${$config.formatAmount($config.formatAmount(oneItem.salePrice) * $config.formatAmount(oneItem.quantity))}</p>
                                </div>
                            </div>
                        {{/each}}
                    {{/if}}
                {{/each}}
            {{/if}}
        </div>
    {{/each}}
{{/if}}

