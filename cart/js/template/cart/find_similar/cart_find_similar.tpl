<div class="white-arrow">◆</div>
<div class="left-btn" prev-btn><i class="c-i f-similar-left"></i></div>
<div class="right-btn" next-btn><i class="c-i f-similar-right"></i></div>
<div class="cart-similar-view clearfix" cart-scroll-view maima_param="${maima_param}">
	<ul>
		{{each(i,item) lst}}
		<li>
			<a class="cart-similar-image" href="${item.purl}" title="${item.pn}" maima_param="${item.maima_param}" target="_blank">
				<span>
					<img
						width="130"
						height="130"
						{{if i< 5 }}
							src="${item.iurl}" title="${item.pn}"/>
						{{else}}
							data-src="${item.iurl}" title="${item.pn}" src="//app.gomein.net.cn/images/grey.gif"/>
						{{/if}}
				</span>
			</a>
			<div class="cart-similar-title">
				<a href="${item.purl}" title="${item.pn}" class="black" target="_blank">${item.pn}</a>
			</div>
			<div class="cart-similar-price">
				¥${item.price}
				{{if item.priceType=="TUANPRICE" || item.priceType=="RUSHBUYPRICE"}}
				<span class="icon-tag">真划算</span>
				{{/if}}
			</div>
		</li>
		{{/each}}
	</ul>
</div>
<ul class="cart-page" page-btn>
	{{each(i,item) page}}
		{{if i==0}}
			<li data-page="0" class="cur"></li>
		{{else}}
			<li data-page="${i}"></li>
		{{/if}}
	{{/each}}
</ul>
