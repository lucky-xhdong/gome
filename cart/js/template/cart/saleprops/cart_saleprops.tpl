{{if good.salesPropertyVOs }}
{{if good.salesPropertyVOs.length > 4}}
<div  class="cart-col-8 cart-good-salesPro">
    <div class="cart-good-pro" popup-prop-group>
        <p prop-down class="c-i prop-down prop-arrow"></p>
        <p prop-up class="c-i prop-up prop-arrow"></p>
        {{each(i, salesPro) good.salesPropertyVOs}}
        <div class="cart-salesPro-item">
            <span class="cart-good-key" title="${salesPro.labelKey}">${salesPro.labelKey}</span>
            <span class="cart-good-value" title="${salesPro.labelVal}"  >：${salesPro.labelVal}</span>
        </div>
        {{/each}}
    </div>
</div>
{{else}}
<div  class="cart-col-8">
    <div class="cart-good-pro">
        {{each(i, salesPro) good.salesPropertyVOs}}
        <div class="cart-salesPro-item">
            <span class="cart-good-key" title="${salesPro.labelKey}">${salesPro.labelKey}</span>
            <span class="cart-good-value" title="${salesPro.labelVal}"  >：${salesPro.labelVal}</span>
        </div>
        {{/each}}
    </div>
</div>
{{/if}}
{{else}}
<div class= "cart-col-8"><div class="cart-good-pro"></div></div>
{{/if}}