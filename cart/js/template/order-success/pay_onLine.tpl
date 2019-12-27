<div class="oc_cashOnDelivery">
    {{each sc}}
    <dl class="delivery">
        <dt>${sme}</dt>
        {{each scs}}
        <dd>
            <span class="i-block col_105">${itemTypeNum}种商品共${itemNum}件</span>
            {{if shippingDateAsString}}<span class="i-block col_300">送货时间：${shippingDateAsString}</span>{{/if}}
        </dd>
        {{/each}}
    </dl>
    {{/each}}
</div>