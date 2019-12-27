{{if isDialog}}
<div class="store_payment bgwhite pr box-sd2">
	<em class="c-i closebtn-new pabs" g-close style="top:15px;right:20px;cursor: pointer;"></em>
{{/if}}
	<div class="select_area clearfix mb10">
		<div class="w150 fl text-right" style="line-height:32px;"><b class="fontRed pdl_r5">*</b> 选择区域：</div>
		<ul class="fl clearfix" style="line-height:32px;padding-left: 22px;">
			<li class="fl mr10">${pickingUP.stateName}</li>
			<li class="fl mr10">
				${pickingUP.cityName}
			</li>
			<!-- <li class="fl ck mr10"> -->
			<li class="fl">
				<div class="g-select" g-select>
					<a href="javascript:void(0)" class="block" style="width:115px;">
						<i class="c-i select_arrowup"></i>
						{{if selectedArea(list)}}
						<san g-title>${selectedArea(list).countyName}</san>
						{{else}}
						<san g-title>请选择</san>
						{{/if}}
					</a>
					<ul class="hide" g-select-body>
						{{each list}}
						<li s-idx="${$index}">${countyName}</li>
						{{/each}}
					</ul>
				</div>

			</li>
		</ul>	
	</div>
	<div style="clear:both;"></div>	
	<div class="select_store clearfix" id="store-content"  >
		<!--<div class="w150 fl text-right"><b class="fontRed pdl_r5">*</b>选择自提门店：</div>-->
		<div class="fl h185"  style="width:610px;overflow:auto;background:#f8f8f8;padding:18px 0px 0px 100px;">
			<div  class="ofh mt70">
				<div class="c-i order_waring fl" ></div>
				<div class="ofh lh20 pl20" style="font-family:Microsoft YaHei;">
					<span class="show f1 font16"> 您选择的区域没有支持本订单的自提点，</span>
					<span  class="show f1 font16">请选择其他区域！</span>
				</div>
			</div>
		</div>	
	</div>
	<div style="clear:both;"></div>
	<div class=" mt20 clearfix js_isStores">
		<a href="javascript:void(0)" g-close class="btn btn-default btn-w83" style="margin-left:250px;<margin-right:20></margin-right:20>px;">取消</a>
		<a href="javascript:void(0)" id="pks-saveStore" class="btn btn-primary btn-w83 mr50">保存自提门店</a>
	</div>
{{if isDialog}}
</div>
{{/if}}
