{{if list.length}}
	<div class="box-header clearfix">
        <h3>${title}</h3>
        <div class="box-jindu">
            <div class="jd" idx="1"></div>
            <div class="jd select" idx="2"></div>
            <div class="jd" idx="3"></div>
        </div>
    </div>
    <div class="box-body clearfix">
	    {{each list}}
			<div class="item fl item-${$index}">
				<div class="img">
					<a href="${purl}" class="pr">
						<img src="${iurl}" alt="${pn}" class="animated fadeIn">
						<p class="overlayer"></p>
					</a>
				</div>
				<div class="title">
					<a href="${purl}">${pn}</a>
				</div>
				<div class="price">
					¥${price}
				</div>
				<div class="bottom">
					<a href="javascript:void 0"
					class="btn btn-default"
					sid="${sid}"
					pid="${pid}"
					skuMappingSuit = "${skuMappingSuit}"
					add-cart="${$index}" 
					maima_param="${maima_param}">
						<i class="c-i cartsuc_gray"></i>
						<i class="c-i cartsuc_white"></i>
						<span>
							加入购物车
						</span>
					</a>
				</div>
			</div>
		{{/each}}
		<div class="left-action" left>
			&lt;
		</div>
		<div class="right-action" right>
			&gt;
		</div>
    </div>
{{/if}}