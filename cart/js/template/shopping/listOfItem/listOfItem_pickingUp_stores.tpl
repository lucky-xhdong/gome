<div class="w150 fl text-right"><b class="fontRed pdl_r5">*</b>选择自提门店：</div>
<div class="fl h185 js-stores-lists" style="width:610px;overflow:auto;background:#f8f8f8;padding:18px 0px 0px 22px;">
    {{each gomeStoreSet}}
    {{if isSelectStore($value)}}
    <div class="btn_Square_out">
        <a href="javascript:void(0)" class="btn btn-check btn-checked"  store-idx="${$index}" title="${name}">
            <span class="name addr_over w135">${name}</span><i class="c-i chose_icon"></i>
        </a>
        <span>${cityName}</span>
        <span>${countyName} </span>
        <span title="${address}" class="addr_over addr_over_w">${address}</span>
        <span>${storePhone}</span>
    </div>
    {{else}}
    <div class="btn_Square_out">
        <a href="javascript:void(0)" class="btn btn-check" store-idx="${$index}" title="${name}">
            <span class="name addr_over w135">${name}</span>
        </a>
        <span>${cityName}</span>
        <span>${countyName} </span>
        <span title="${address}" class="addr_over addr_over_w">${address}</span>
        <span>${storePhone}</span>
    </div>
    {{/if}}
    {{/each}}
</div>