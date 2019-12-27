<dt>您的订单包含如下赠券和积分赠送，每个订单在完成确认收货后将直接发放到您的个人账户上：</dt>
<dd>消费积分：${points}分</dd>
{{if cVOs.length > 0}}
{{each cVOs}}
<dd>${coupons[couponType]}：${quantity}张</dd>
{{/each}}
{{/if}}
