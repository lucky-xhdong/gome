<div class="presentinfo">
    <div class="notenough">
        <i class="c-i order_waring fl" style="{{if type == 2}}margin:9px 15px 0px 1px;{{else}}margin:1px 15px 0px 1px;{{/if}}"></i>
        {{if type == 1}}
        <span class="short">以下赠品已被抢光</span>
        {{else type == 0}}
        <span class="short">以下商品此区域无货</span>
        {{else type == 2}}
        <span class="trans">您选购的商品所在仓库无货，将为您转为最新仓库发货，商品价格可能发生变化。</span>
        {{else type == 3}}
        <span class="short">${title}</span>
         {{else type == 5}}
        <span class="short">${items.title}</span>
        {{else type == 4}}
        <span class="short">以下商品的送达时间已约满，您可返回订单提交页进行修改？</span>
        {{else type == 6}}
        <span class="short">以下商品的安装时间已约满，您可返回订单提交页进行修改？</span>
        {{/if}}
    </div>
    <div class="info">
        {{if type == 5}}
            {{if items.data.length>0}}
            {{each(iidx,item) items.data}}
            <div class="item" style="padding-bottom:17px;">        
                <img src='${item.picUrl}'></img>
                {{if items.flag ==0}}
                    <span class="zp">赠品</span>
                {{/if}}
                <span class="deinfo" title='${item.displayName}' 
                    style="width:180px;"
                >${item.displayName}</span>
            </div>
            {{/each}}
            {{/if}}
        {{else}}
            {{each(iidx,item) items}}
            <div class="item" style="${iidx == 0 ? "padding-top:17px;":""} padding-bottom:17px;">        
                <img src='${item.picUrl}'></img>
                {{if type == 1}}
                    <span class="zp">赠品</span>
                {{/if}}
                <span class="deinfo" title='${item.displayName}' 
                    style="{{if type == 1}}width:180px;{{else}}width:224px;{{/if}}"
                >${item.displayName}</span>
            </div>
            {{/each}}
        {{/if}}
    </div>
</div>