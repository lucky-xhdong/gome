{{each(i,item) data}}
<div act-deleted-item
    {{if i > 4}}
        class="clearfix cart-deleted-item cdi-more"
    {{else}}
        class="clearfix cart-deleted-item"
    {{/if}}
    >
    {{if item.type==='suit'}}
        <div class="fl deleted-col-1">
            <a href="${item.vUrl}" target="_blank">
              ${item.vProductName}
            </a>
        </div>
        {{if item.state=="OFF_SHELVES"}}
        <div style="margin-right: 138px;width:10px" class="fr">&nbsp;</div>
        {{else}}
        <div style="margin-right: 100px;" class="fr">
            <a href="javascript:;"
               act-rebuy
               data-skuid="${item.vSkuId}"
               data-site = "${$page.site}"
               data-suit="24">
                重新购买
            </a>
        </div>
        {{/if}}
        <div class="fr">
            ${item.quantity}
        </div>
        <div class="fr">
            ¥ ${parseFloat(item.tzSubAmount).toFixed(2) || '0.00'}
        </div>
    {{else}}
        <div class="fl deleted-col-1">
            <a href="${item.itemURL}" target="_blank">
                ${item.itemName}
            </a>
        </div>
        {{if item.inventoryState=="OFF"}}
        <div style="margin-right: 138px;width:10px" class="fr">&nbsp;</div>
        {{else}}
            {{if !$config.isQygSite()}}
                <div class="fr">
                    <a
                            href="javascript:;"
                            act-add-wishlist
                            data-skuid="${item.skuId}">
                        移入收藏夹
                    </a>

                </div>
            {{/if}}
            <div class="fr">
                <a href="javascript:;"
                   act-rebuy
                   data-site = "${$page.site}"
                   data-skuid="${item.skuId}">
                    重新购买
                </a>
            </div>
        {{/if}}
        <div class="fr">
            ${item.quantity}
        </div>
        <div class="fr">
            ¥ ${parseFloat(item.salePrice).toFixed(2) || '0.00'}
        </div>
    {{/if}}
</div>
{{/each}}
{{if data.length > 5}}
<div class="ctrl-cdi-more" act-deleted-more>
    显示全部商品<i class="c-i arrow-bottom ml5"></i>
</div>
{{/if}}
