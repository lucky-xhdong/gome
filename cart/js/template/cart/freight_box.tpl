<div class="shipfee-pop-self">全球购超市商品<span>(仅当前区域适用)</span></div>
<div class="shipfee-pop-self-t">
    {{if tAmount != '-1' && tAmount}}
        全球购超市商品金额${tAmount}元，
    {{/if}}
    {{if data.tSuttle != '-1' && data.tSuttle }}
        重量${data.tSuttle}kg,免运费
    {{/if}}
    {{if free}}
        【当前区域免运费】
    {{/if}}
</div>
{{if smtis.length>0}}
<table class="shipfee-pop-self-b">
    <thead style="line-height: 20px;">
        <td style="width:70px">重量<br />(kg)</td>
        <td style="width:60px">金额<br />(元)</td>
        <td style="width:60px">基础价<br />(元/kg)</td>
        <td >续重<br />(kg)</td>
        <td style="width:60px">续价<br />(元/kg)</td>
        <td>运费<br />(元)</td>
    </thead>
    {{each(is, item) smtis}}
    <tr>
        <td>${item.weight||0}</td>
        <td>${item.amount||0}</td>
        <td>${item.baseShipFee || 0}</td>
        <td class="freight-item-height">${item.stepWeight }
            {{if item.stepWeight == '0.5' }}
                (不满0.5kg算0.5kg，超过0.5kg算1kg)
            {{else item.stepWeight == '1' }}
                (不满1kg算1kg，超过1kg算2kg)
            {{/if}}
        </td>
        <td>${item.stepPrice || 0}</td>
        <td class="freight-item-height">{{if item.freight=='-1'}}
                基础价+（订单重量-重量下限）*续价
            {{else}}
                ${item.freight || 0}
            {{/if}}
        </td>
    </tr>
    {{/each}}

</table>
{{/if}}