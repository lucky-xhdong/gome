{{if normalItemChecked && hwgitemChecked}}
	<div class="col-hwg">
	<div class="header-title">海外购商品<span class="ht-red">${ hwgitemCount }</span>件</div>
		<div class="bottom-goods-body">
			{{if hwgGoodCount >4}}
			<div class="left-btn" prev-btn ishwg="true"><i class="c-i bottom-good-l"></i></div>
			<div class="right-btn" next-btn ishwg="true"><i class="c-i bottom-good-r"></i></div>
			{{/if}}
			<div class="bottom-goods-view clearfix" cart-scroll-view>
				<ul>
					{{each(i,good) hwglist}}
						<li>
							<a target="_blank"  href="${good.itemURL}" class="bottom-goods-image" title="${good.itemName}" hoverup="${good.itemId}">
								{{if good.itemImageURL}}<img src="${good.itemImageURL}">{{/if}}
							</a>
							<div 
								gui-checkbox
								act-remove-selected-good
								hover="${good.itemId}"   
								gui-class-unchecked="checkboxs" 
								gui-class-checked="gray_checkbox_chose" 
								gui-class-disabled="no_check" 
								class="c-i checkboxs"
								title="去除勾选"
								>
								<input type="checkbox" name="${good.itemId}" checked> 	  
							</div>
						</li>
					{{/each}}
				</ul>
			</div>
		</div>
	</div>
	<div class="split-line"></div>	
	<div class="col-nor">
		<div class="header-title">普通商品<span class="ht-red">${ normalitemCount}</span>件</div>
		<div class="bottom-goods-body">
			{{if normalGoodCount>5}}
			<div class="left-btn" prev-btn><i class="c-i bottom-good-l"></i></div>
			<div class="right-btn" next-btn><i class="c-i bottom-good-r"></i></div>
			{{/if}}
			<div class="bottom-goods-view clearfix" cart-scroll-view>
				<ul>
					{{each(i,good) normallist}}
						<li>
							<a target="_blank" href="${good.itemURL}" class="bottom-goods-image" title="${good.itemName}" hoverup="${good.itemId}">
								{{if good.itemImageURL}}<img src="${good.itemImageURL}">{{/if}}
							</a>
							<div 
								gui-checkbox
								act-remove-selected-good
								hover="${good.itemId}"   
								gui-class-unchecked="checkboxs" 
								gui-class-checked="gray_checkbox_chose" 
								gui-class-disabled="no_check" 
								class="c-i checkboxs"
								title="去除勾选"
								>
								<input type="checkbox" name="${good.itemId}" checked> 	  
							</div>
						</li>
					{{/each}}
				</ul>
			</div>
		</div>
	</div>
	<div class="clearfix"></div>
{{else hwgitemChecked}}
	<div class="header-title">海外购商品<span class="ht-red">${ hwgitemCount }</span>件</div>
	<div class="bottom-goods-body">
		{{if hwgGoodCount>10}}
		<div class="left-btn " prev-btn ishwg="true"><i class="c-i bottom-good-l"></i></div>
		<div class="right-btn" next-btn ishwg="true"><i class="c-i bottom-good-r"></i></div>
		{{/if}}
		<div class="bottom-goods-view clearfix" cart-scroll-view>
			<ul>
			{{each(i,good) hwglist}}
				<li>
					<a target="_blank" href="${good.itemURL}" class="bottom-goods-image" title="${good.itemName}" hoverup="${good.itemId}">
						{{if good.itemImageURL}}<img src="${good.itemImageURL}">{{/if}}
					</a>
					<div 
						gui-checkbox
						act-remove-selected-good
						hover="${good.itemId}"   
						gui-class-unchecked="checkboxs" 
						gui-class-checked="gray_checkbox_chose" 
						gui-class-disabled="no_check" 
						class="c-i checkboxs"
						title="去除勾选"
						>
						<input type="checkbox" name="${good.itemId}" checked> 	  
					</div>
				</li>
			{{/each}}
			</ul>
		</div>
	</div>
{{else normalItemChecked}}
	<div class="header-title" >普通商品<span class="ht-red">${normalitemCount}</span>件</div>
	<div class="bottom-goods-body" >
		{{if normalGoodCount>10}}
		<div class="left-btn" prev-btn><i  class="c-i bottom-good-l"></i></div>
		<div class="right-btn" next-btn><i  class="c-i bottom-good-r"></i></div>
		{{/if}}
		<div class="bottom-goods-view clearfix" cart-scroll-view>
			<ul >
			{{each(i,good) normallist}}
				<li>
					<a target="_blank" href="${good.itemURL}" class="bottom-goods-image" title="${good.itemName}">
						{{if good.itemImageURL}}<img  src="${good.itemImageURL}">{{/if}}
					</a>
					<div 
						gui-checkbox
						act-remove-selected-good
						hover="${good.itemId}"   
						gui-class-unchecked="checkboxs" 
						gui-class-checked="gray_checkbox_chose" 
						gui-class-disabled="no_check" 
						class="c-i checkboxs"
						title="去除勾选"
						>
						<input type="checkbox" name="${good.itemId}" checked> 	  
					</div>
				</li>
			{{/each}}
			</ul>
		</div>
	</div>
{{/if}}