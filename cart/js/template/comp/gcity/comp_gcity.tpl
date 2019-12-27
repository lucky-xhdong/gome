{{if noreq==true}}
	<div class="loading"></div>
{{else}}
	<div click-document-pre>
	{{if errRes==true}}
		<div style="height:100px;color:#aaa">${message}</div>
	{{else}}
		<div id="citySelect" class="gctSelect clearfix" g-pipe>
			{{each(i,item) data.titles}}
				{{if i==data.current }}
					<a href="javascript:;" class="cur">
						<b>${item.label}</b>
						<i></i>
					</a>
				{{else}}
					{{if item.available}}
						<a href="javascript:;" g-click="set ${i} ${item.code},render">
							<b>${item.label}</b>
							<i></i>
						</a>
					{{else}}
						<a href="javascript:;" class="disabled">
							<b>${item.label}</b>
							<i></i>
						</a>
					{{/if}}
				{{/if}}
			{{/each}}
			<a href="javascript:;" id="cityClose" class="close" g-area-close></a>
		</div>

		<div id="cityMBox">
			<div class="gctBox" g-pipe>
				{{if data.childrens}}
				{{each(ci,citem) data.childrens}}
					<span>
						<a href="javascript:;" 
						title="${citem.label}" 
						g-click="set1 ${data.current} ${citem.code} ${ci},render">
							${citem.label}
						</a>
					</span>
				{{/each}}
				{{else}}
					没有找到可用的数据!
				{{/if}}
			</div>
		</div>
	{{/if}}
	</div>
{{/if}}