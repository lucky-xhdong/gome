<div class="cart-icon-notice">
    {{html $config.renderCartLabel(promotionInfo[0].type,"促销")}}
    <b></b>
    <i></i>
</div>
<!--促销提示语 -->
{{html $config.renderCartPromtionNotice(promotionInfo[0])}}


<!--满赠 start-->
{{if   $config.isGiftType(promotionInfo[0].type) &&
promotionInfo[0].ranges && promotionInfo[0].ranges.length}}

{{if promotionInfo[0].url}}
<a href="${promotionInfo[0].url}?${promotionInfo[0].proId}" target="_blank">
    去凑单&nbsp;<span class="jt">&gt;</span>
</a>
{{/if}}

<div class="cart-add-buy js-gift-parent"
     gui-popup
     gui-popup-toggle="1"
>
    <a href="javascript:;"
       act-get-gifts data-proid="${promotionInfo[0].proId}" data-itemids="${promotionInfo[0].itemIds}"
       style="text-decoration:none; position:relative;left:0px;top:1px"
       class="cart-add-buy-text">
        {{if promotionInfo[0].satisfied}}
        <span class = "exch" >选择赠品</span>
        {{else}}
        <span class = "exch" >查看赠品</span>
        {{/if}}
    </a>
    <!--弹框-->
    <div class="cart-add-buy-list cart-gift-box" gui-popupbox>
        <div class="cart-box-arrow" >
            <i>◆</i><i class="cart-arrow-cover">◆</i>
        </div>
        <div class="cart-add-buy-list-inner">
            <div class="cart-add-buy-header">
                您最多可领取1套赠品，已领<span class="js-gift-selected-num">${promotionInfo[0]._selectedNum}</span>套（赠品随主商品数量累加）
                <div class="c-i closebtn-new" gui-popupclose></div>
            </div>
            <div class="cart-add-buy-row gift-pop-content" data-max="${promotionInfo[0].maxNum}">
                <!--内容start-->
                {{each(range, groups) promotionInfo[0].ranges}}

                    <!--标题部分 JIAN：多品满件数赠|AMOUNT：多品满金额赠-->
                    <!--{{if range.unit === "JIAN"}}-->
                    <!--<div>满Y${range.from}-${range.to}可领取如下赠品：</div>-->
                    <!--{{else}}-->
                    <!--<div>满${range.from}件可领取如下赠品：</div>-->
                    <!--{{/if}}-->

                    <!--具体分组商品-->
                    {{each(id,gifts) groups }}
                <div style="overflow: hidden" class="js-gifts-box-group">
                    {{each(i,gift) gifts}}

                    <div data-id="${id}" class="gift-pop-list-box" >
                        <!--左侧选择框-->
                        <div class="cart-add-buy-item-left">
                            <div
                                    class="c-i  js-gift-checkbox
                                            {{if promotionInfo[0].satisfied}}
                                                checkboxs
                                            {{else}}
                                                checkbox_gray
                                            {{/if}}
                                          "
                                    gui-checkbox
                                    gui-class-unchecked="checkboxs"
                                    gui-class-checked="checkbox_chose"
                                    gui-class-disabled="no_check"
                                    data-groupid="${id}"
                                    data-pid = "${productId}"
                                    data-sid = "${skuId}"
                                    act-gifts-check
                                    class="{{if !promotionInfo[0].satisfied}}good-checkboxs-gray{{/if}}"
                            >
                                <input
                                        type="checkbox"
                                        value=""
                                        {{if gift.selected}}
                                        checked
                                        {{/if}}
                                        {{if !promotionInfo[0].satisfied}}
                                            disabled
                                        {{/if}}
                                >
                            </div>
                        </div>
                        <div class="cart-add-buy-item-right" style="width: 220px">
                            <div class="cart-add-image fl">
                                <a href="${gift.itemURL}" target="_blank">
                                    {{if gift.itemImageURL}}
                                    <img src="${gift.itemImageURL}" alt="">
                                    {{/if}}
                                </a>
                            </div>
                            <div class="cart-add-detail">
                                <a href="${gift.itemURL}" class="deinfo" target="_blank" title="${gift.itemName}">${gift.itemName}</a>
                                <div class="cart-add-buy-price ffyh">
                                    ￥${parseFloat(gift.giftPrice).toFixed(2) || '0.00'} * ${gift.quantity}
                                    <span class="js-inventory-state-${skuId}" style="margin-left: 20px"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {{/each}}
                </div>
                    {{/each}}


                {{/each}}


                <!--内容end-->
            </div>

            <div class="cart-add-buy-footer cart-box-group-a">
                {{if promotionInfo[0].satisfied}}
                <a href="javascript:;" class="cart-btn" gui-popupclose>取消</a>
                {{/if}}
                <a
                        href="javascript:;"
                        class="cart-btn cart-red-bg"
                        style="margin-left:24px;"
                        gui-popupclose
                        act-gifts-add
                        data-id="${promotionInfo[0].proId}"
                        data-gifttype="${promotionInfo[0].type}"
                        data-itemtsid="${promotionInfo[0].itemIds}"
                        data-groupid=""
                        data-pidsids=""
                >
                    确认
                </a>
            </div>
        </div>
    </div>

</div>

{{/if}}
<!--满赠 end-->