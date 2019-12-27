<div class="presentinfo">
    <div class="notenough">
        <i class="c-i order_waring fl" style="margin:1px 17px 0px 1px;"></i>
        <span class="short">${title}</span>
    </div>
    <div class="info">
        <div class="info-box">
            {{each(iidx,itemGroup) items}}
            <div class="yyqg-item">
                <div class="itemGroup">
                    <div class="group-head">
                        {{if itemGroup.group && itemGroup.group == "DPG"}}
                        <span class="yyqg-DPG">搭配购</span>
                        {{else itemGroup.group && itemGroup.group == "TZ"}}
                        <span class="yyqg-TZ">【套装】</span>
                        {{/if}}
                        ${itemGroup.name}
                    </div>
                    {{each(iiidx,item) itemGroup.items}}
                    <div class="group-body clearfix pr">
                        <div class="fl group-img"><img width="50" height="50" src='${item.img}' /></div>
                        <div class="fl group-txt">
                            <div class="deinfo" title='${item.name}'>{{if item.type && item.type == "HG"}}<span class="HG">【换购】</span>{{/if}}${item.name}</div>
                            <div class="quantity pabs">x<span class="quantity-num">${item.quantity}</span></div>
                            <div class="yyqg-status pabs">${$config.yyqgStatusType(item.status)}</span>
                            </div>
                        </div>
                    </div>
                    {{/each}}
                    {{if itemGroup.group && itemGroup.group == "TZ" && itemGroup.status == "OFF_SHELVES"}}
                    <div class="tzxj"><span>套装已下架</span></div>
                    {{/if}}
                </div>
            </div>
            {{/each}}
        </div>
    </div>
</div>