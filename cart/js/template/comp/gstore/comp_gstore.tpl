	<div class="gm-store mb10 zi100" click-document-pre>
	   <p style="font-weight:bold; line-height:30px;">选择支付的国美门店</p>
	   {{if noreq==true}}
	   		<div class="loading"></div>
	   {{else}}
		   <div class="store-hd clearfix" g-pipe>
		        <ul class="gmtab">
		        	{{each(idx,item) data.titles}}
		        		<li class="clearfix">
			        		{{if idx==data.current}}
				        		<a href="javascript:void(0)" class="hover"  >
			                        <em >${item.name}</em>
			                        <i class="c-i arrowdown_red"></i>
			                    </a>
			        		{{else}}
			        			<a href="javascript:void(0)"  g-click="set ${idx} ${item.id},render">
			                        <em >${item.name}</em>
			                        <i class="c-i arrowdown"></i>
			                    </a>
			        		{{/if}}
			        	</li>
		        	{{/each}}
		        	
		        </ul>
		   </div>
		   <div class="gm_area clearfix" g-pipe>
		       <ul class="area-list">
		       		{{each(ci,citem) data.childerns}}
		            <li><a href="javascript:void(0)" g-click="set1 ${data.current} ${citem.id} ${ci},render">${citem.name}</a></li>
		       		{{/each}}
		      </ul>
		 	</div>
	   {{/if}}
	</div>
