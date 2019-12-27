<div class="g-panel box-sd2 confirm">
	{{if util.is(Function,close)}}
		<i class="c-i closebtn-new fr" g-panel-close></i>
	{{/if}}
	<div class="body">
		{{if util.is(Function,body)}}
			{{html body()}}
		{{else}}
		<div class="icon i-block">
			<i class="c-i panel-{{html type}}"></i>
		</div>
		<div class="content i-block">
			{{if title}}
			<h1>{{html title}}</h1>
			{{/if}}
			{{html body}}
		</div>
		<div class="i-block" style="vertical-align: middle;width:1px;min-height:1px;"></div>
		{{/if}}
	</div>
	{{if btns.length>0}}
	<div class="btns">
		{{each btns}}
			<a
			g-btn-path="btns,${$index}" 
			href="javascript:void(0)" 
			class="${clazz}">
				{{html btnName}}
			</a>
		{{/each}}
	</div>
	{{/if}}
</div>