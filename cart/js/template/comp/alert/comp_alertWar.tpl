<div class="g-panel box-sd2">
	{{if close}}
	<i class="c-i closebtn-new fr" g-panel-close></i>
	{{/if}}
	<div class="body">
		<div class="icon i-block" style="vertical-align: top;">
			<i class="c-i panel-${type}"></i>
		</div>
		<div class="content i-block">
			{{html body}}
		</div>
		{{if $data.code}} 
		    <div class="errorCode">[${$data.code}]</div>
		{{/if}}
		<div class="i-block" style="vertical-align: middle;width:1px;min-height:1px;"></div>
	</div>
</div>