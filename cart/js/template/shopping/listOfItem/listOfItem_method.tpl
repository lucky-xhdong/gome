{{each(iidx,info) shippinginfo}}
<div class="all_listpay m-t-10" {{if iidx!=shippinginfo.length-1}}style="margin-bottom:30px"{{/if}}>
	<div class="clearfix tittle mb15">
		<h4 class="fl mr15 mt6 send_way">配送方式</h4>
		<!--快递-->
		<div class="Express clearfix">
			{{each info.express}}
			{{if $value}}
			<div class="dispatfont btn_Square_out mb15" {{if $index ==0 && info.express.length>1}}style="float:left;"{{/if}} {{if $index == 3}}style="margin-left:71px;"{{/if}}>
				<div class="h28">
				{{if $config.isGomeShop(shopId) }}
					<a href="javascript:void(0)" class="btn btn-check btn-checked mw150 mr10">
						<span class="name">${$config.isGomeShopExpressName($value,shopId)}</span>
						<i class="c-i chose_icon"></i>
					</a>
				{{else}}
					{{if $value.selected}}
						<a href="javascript:void(0)" class="btn btn-check btn-checked mw150 mr10">
							<span class="name">${$config.isGomeShopExpressName($value,shopId)}</span>
							<i class="c-i chose_icon"></i>
						</a>
					{{else}}
						<a href="javascript:void(0)" class="btn btn-check mw150 mr10"
						g-e-path="shippinginfo,${iidx},express,${$index}">
							<span class="name">${$config.isGomeShopExpressName($value,shopId)}</span>
						</a>
					{{/if}}
				{{/if}}
				</div>
			</div>
			{{/if}}
			{{/each}}
		</div>
	</div>
	<!--支付方式-->
	{{each payments}}
	{{if selected}}
	<div class="pay_way_c mb10">
		<span>支付方式：</span>
		<span class="cash mr20">${$config.labels[$value.code]}</span>
		{{if payments.length>1}}
		<a href="javascript:void(0)" g-p-path="shippinginfo,${iidx},payments">修改</a>
		{{/if}}
	</div>
	{{/if}}
	{{/each}}

	<!-- selectedfn(info.express)&&$config.isShowDataByShoppingList(selectedfn(info.express))-->
	<!--配送时间或者title-->
	{{if info.masLoc}}
		{{if $config.isShowDataByShoppingList(selectedfn(info.express))}}
		<div class="pr clearfix">
			<div class="fl" >配送时间：</div>
			<div class="chooseTime pr" style="margin-left:60px">
				<div class="chooseDay">
					{{if info.items[0].times.code=="DAY"}}
						{{each info.items[0].times.items}}
							{{if selected}}
							<label class="lb_check show" >
								<span class="c-i radio_chose mr5 mt4 fl"></span>
								<input type="radio" class="btn_radio">
								${$config.labels[code]}
								{{if $index ==0}}
								<div class="goods_dy" style="float: right;margin-right: 192px;" map-item>
									{{if visibleCorrespondItems(shopId)}}
									<a href="javascript:;" class="fontBlue clearfix" hoverup-0 click-document-pre>
										<i class="fl c-i tips" style="margin-top:5px; margin-right:4px;"></i>
									</a>
									<!--对应商品弹层开始-->
									<div class="pr zi1000">
										<div class="goods_fenlei pabs hide box-sd1" style="left: -72px;top: 6px;" hover-1 click-document-hide>
											<div class="white-arrow" style="top: -8px;left: 70px;font-size:17px;">◆</div>
											{{if info.items&&info.items.length>4}}
											<div style="height:15px;"></div>
											<div class="fenlei_in" style="height:370px;overflow-y:auto;">
											{{else}}
											<div class="fenlei_in">
											{{/if}}
												{{each(index,item) info.items}}
												{{if item}}
													<div class="clearfix">
														<div class="mr10 col-1 fl" >
															<img src="${item.itemImageURL}" width="80" height="80" alt="">
														</div>
														<div class="fl col-2" >
															<a href="${item.itemURL}" class="p-name" target="_blank" title="${item.itemName}">
																<p class="p-name">
																	{{if item.commerceitemVOFlag =='SUB'}}
																		{{if profile && profile.types && $config.isSub(profile.types)}}
																			<em class="zp">赠品</em>
																		{{/if}}
																	{{/if}}
																	{{if item.itemPropCode=="ZP"}}
																	<em class="zp">赠品</em>
																	{{/if}}
																	${$config.limitStr(item.itemName,48)}
																</p>
															</a>
														</div>
													</div>
												{{/if}}
												{{if index!==info.items.length-1}}
													<div style="height:15px;"></div>
												{{/if}}
												{{/each}}
											</div>
										</div>
									</div>
									<!--对应商品弹层结束-->
									{{/if}}
								</div>
								{{/if}}
							</label>
							{{else}}
							<label class="lb_check show"
								g-day-path="shippinginfo,${iidx},items,0,times,items,${$index}">
								<span class="c-i radio mr5 mt4 fl"></span>
								${$config.labels[code]}
								{{if $index ==0}}
								<div class="goods_dy" style="float: right;margin-right: 192px;" map-item>
									{{if visibleCorrespondItems(shopId)}}
									<a href="javascript:;" class="fontBlue clearfix" hoverup-0 click-document-pre>
										<i class="fl c-i tips" style="margin-top:5px; margin-right:4px;"></i>
									</a>
									<!--对应商品弹层开始-->
									<div class="pr zi1000">
										<div class="goods_fenlei pabs hide box-sd1" style="left: -72px;top: 6px;" hover-1 click-document-hide>
											<div class="white-arrow" style="top: -8px;left: 70px;font-size:17px;">◆</div>
											{{if info.items&&info.items.length>4}}
											<div style="height:15px;"></div>
											<div class="fenlei_in" style="height:370px;overflow-y:auto;">
											{{else}}
											<div class="fenlei_in">
											{{/if}}
												{{each(index,item) info.items}}
												{{if item}}
													<div class="clearfix">
														<div class="mr10 col-1 fl" >
															<img src="${item.itemImageURL}" width="80" height="80" alt="">
														</div>
														<div class="fl col-2" >
															<a href="${item.itemURL}" class="p-name" target="_blank" title="${item.itemName}">
																<p class="p-name">
																	{{if item.commerceitemVOFlag =='SUB'}}
																		{{if profile && profile.types && $config.isSub(profile.types)}}
																			<em class="zp">赠品</em>
																		{{/if}}
																	{{/if}}
																	{{if item.itemPropCode=="ZP"}}
																	<em class="zp">赠品</em>
																	{{/if}}
																	${$config.limitStr(item.itemName,48)}
																</p>
															</a>
														</div>
													</div>
												{{/if}}
												{{if index!==info.items.length-1}}
													<div style="height:15px;"></div>
												{{/if}}
												{{/each}}
											</div>
										</div>
									</div>
									<!--对应商品弹层结束-->
									{{/if}}
								</div>
								{{/if}}
							</label>
							{{/if}}
						{{/each}}
					{{/if}}
					{{if info.items[0].times.code=="SLOT"}}
						<div class="fl">
							<span g-slot-calendar_${iidx}>预计&nbsp;${xsdSelectedTime(info.items[0].times.concrete)}&nbsp;</span>
							<a click-document-pre href="javascript:;" class="ml10 js-modify_slot_time" data-time=${iidx}>修改</a>
							<div class="goods_dy _alert_post_set" style="float: right;margin-left: 10px;" map-item>
								{{if visibleCorrespondItems(shopId)}}
								<a href="javascript:;" class="fontBlue clearfix" hoverup-1 click-document-pre>
									<i class="fl c-i tips" style="margin-top:5px; margin-right:4px;"></i>
								</a>
								{{/if}}
							</div>
							<div click-document-hide class="pabs deli_time box-sd1 zi10 hide">
								<div class="slotTableWrapper">
									<div class="slotChose clearfix" style="margin-bottom:10px;">
										<div class="fl az">
											<a href="javascript:;" class="btn-tab btn btn-default btn-check btn-checked mw120 mr10">标准达<i class="c-i chose_icon"></i></a>
										</div>
									</div>
									{{each(idconc,ptime) info.items[0].times.concrete}}
										<table class="slotTable" {{if idconc===0}}style="margin-top:0"{{/if}}>
											<thead>
											<tr>
											{{each(idx,timeItem) ptime.head}}
												{{if idx==0}}
												<th>
													时间段
												</th>
												{{else}}
												<th>
													<p class="col-1-1">${timeItem.md}</p>
													<p class="col-1-2">${timeItem.label}</p>
												</th>
												{{/if}}
											{{/each}}
											</tr>
											</thead>
											<tbody>
											{{each(bidx,bodyitem) ptime.body}}
												<tr>
												{{each(biidx,timeitem) bodyitem}}
													{{if biidx==0}}
														<td>
															${$config.formathhmm(timeitem.startTime)}-${$config.formathhmm(timeitem.endTime)}
														</td>
													{{else timeitem.status =='FULL'}}
														<td><div class="item" style="background-color:#ccc;color:#fff">约满</div></td>
													{{else}}
														{{if timeitem.selected}}
															<td class="hover js-selected" {{if timeitem.status =='DI'}}style="padding: 0 3px;"{{/if}} g-t-path="shippinginfo,${iidx},items,0,times,concrete,${idconc},body,${bidx},${biidx}">
																<div class="item">
																{{if timeitem.status =='DI'}}
																送货+安装
																{{else}}
																送货
																{{/if}}
																</div>
															</td>
														{{else timeitem.status =='DI'}}
															<td style="padding: 0 3px;" g-t-path="shippinginfo,${iidx},items,0,times,concrete,${idconc},body,${bidx},${biidx}">
																<div class="item">送货+安装</div>
															</td>
														{{else}}
															<td g-t-path="shippinginfo,${iidx},items,0,times,concrete,${idconc},body,${bidx},${biidx}">
																<div class="item">送货</div>
															</td>
														{{/if}}
													{{/if}}
												{{/each}}
												</tr>
											{{/each}}
											</tbdoy>
										</table>
									{{/each}}
								</div>
								<p class="deli_time_tip">温馨提示：我们会努力按照您指定的时间配送，但因天气、交通等各类因素影响，您的订单有可能会有延误现象！</p>
								<p class="deli_time_tip deli_time_tip_warn deli_time_tip_warn1">您选择的送达时间已约满，请重新选择其他时间段进行配送！</p>
								<p class="deli_time_tip deli_time_tip_warn deli_time_tip_warn2">出问题啦，请稍后重新选择！</p>
								<p style="font-size: 12px;color: #FF7F23;">新功能提示：国美配送体验升级，送货安装可以同时完成。</p>
								<div class="deli_time_ctrl">
									<a g-t-cancel class="cancelBtn" href="javascript:void(0)">取消</a>
									<a attr-slot=g-slot-confirm_${iidx} g-t-confirm class="primaryBtn" href="javascript:void(0);">确定</a>
								</div>
							</div>
							<!--对应商品弹层开始-->
							<div class="pr zi1000 _hover_1 hover-1 hide" hover-1 click-document-hide>
								<div class="goods_fenlei pabs box-sd1">
									<div class="white-arrow" style="top: -8px;left: 206px;font-size:17px;">◆</div>
									{{if info.items&&info.items.length>4}}
									<div style="height:15px;"></div>
									<div class="fenlei_in" style="height:370px;overflow-y:auto;">
									{{else}}
									<div class="fenlei_in">
									{{/if}}
										{{each(index,item) info.items}}
										{{if item}}
											<div class="clearfix">
												<div class="mr10 col-1 fl" >
													<img src="${item.itemImageURL}" width="80" height="80" alt="">
												</div>
												<div class="fl col-2" >
													<a href="${item.itemURL}" class="p-name" target="_blank" title="${item.itemName}">
														<p class="p-name">
															{{if item.commerceitemVOFlag =='SUB'}}
																{{if profile && profile.types && $config.isSub(profile.types)}}
																	<em class="zp">赠品</em>
																{{/if}}
															{{/if}}
															{{if item.itemPropCode=="ZP"}}
															<em class="zp">赠品</em>
															{{/if}}
															${$config.limitStr(item.itemName,48)}
														</p>
													</a>
												</div>
											</div>
										{{/if}}
										{{if index!==info.items.length-1}}
											<div style="height:15px;"></div>
										{{/if}}
										{{/each}}
									</div>
								</div>
							</div>
							<!--对应商品弹层结束-->
						</div>
					{{/if}}
				</div>
			</div>
		</div>
		{{/if}}
		<!--安装标语及弹窗-->
		{{each(index,item) info.items}}
		{{if item.tiVOs}}
			<div class="pr mt10 clearfix yyaz-support _alert_post_set" itemId="${itemId}" site="${$page.site}">
				<div class="fl">安装时间：</div>
				<div class="chooseTime pr" style="margin-left:60px">
					<div class="chooseDay">
						<div class="fl">
							<span class="jsSelectTime fontN">${$config.jsSelectTime}</span>
							<a href="javascript:;" click-document-pre class="yyaz_modify ml10">修改</a>
							<div class="goods_dy" style="float: right;margin-left: 10px;" map-item>
								{{if visibleCorrespondItems(shopId)}}
								<a href="javascript:;" class="fontBlue clearfix" hoverup-1 click-document-pre>
									<i class="fl c-i tips" style="margin-top:5px; margin-right:4px;"></i>
								</a>
								{{/if}}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="yyaz-box hide" yyaz-box click-document-hide>
				<div class="pabs deli_time yyaz_time box-sd1 zi10">
					<div class="yyaz_time_wrapper">
						<div class="slotTable yyazTable" style="margin-top:0">
							<div class="slotChose clearfix">
								<div class="fl az">
									{{if $config.jsSelectTime == "暂缓安装"}}
									<a href="javascript:;" class="btn-tab btn btn-default btn-check mw120 mr10">安装<i class="c-i chose_icon hide"></i></a></div>
								<div class="fl zhaz">
									<a href="javascript:;" data-waveNum="N" data-installDate="N" class="btn-tab btn btn-check btn-checked mw120 mr10 zhaz-btn">暂缓安装&nbsp;&nbsp;<em class="c-i tips_icon tipsBtn"></em><i class="c-i chose_icon"></i></a>
									<div class="zhaz-tip-box">
										<div class="white-arrow">◆</div>
										<div class="zhaz-tip">指您在购买商品时，如果不确定安装日期，可以选择“暂缓安装”一项。当您需要安装服务时，请拨打国美服务热线，即可为您提供安装服务。</div>
									</div>
								</div>
									{{else}}
									<a href="javascript:;" class="btn-tab btn btn-default btn-check btn-checked mw120 mr10">安装<i class="c-i chose_icon"></i></a></div>
								<div class="fl zhaz">
									<a href="javascript:;" data-waveNum="N" data-installDate="N" class="btn-tab btn btn-check mw120 mr10 zhaz-btn">暂缓安装&nbsp;&nbsp;<em class="c-i tips_icon tipsBtn"></em><i class="c-i chose_icon hide"></i></a>
									<div class="zhaz-tip-box">
										<div class="white-arrow">◆</div>
										<div class="zhaz-tip">指您在购买商品时，如果不确定安装日期，可以选择“暂缓安装”一项。当您需要安装服务时，请拨打国美服务热线，即可为您提供安装服务。</div>
									</div>
								</div>
									{{/if}}
							</div>
							{{if item.tiVOs}}
							<div class="clearfix slotHead {{if $config.jsSelectTime == '暂缓安装'}}slotHeadGray{{/if}}">
								<div class="slotHeadInfo">时间段</div>
								{{each(idx,tiVOsInstallItem) item.tiVOs}}
								<div class="slotHeadList">
									<p>${tiVOsInstallItem.installDate}</p>
									<p>${tiVOsInstallItem.installweek}</p>
								</div>
								{{/each}}
							</div>
							<div class="slotBodyWrap {{if $config.jsSelectTime == '暂缓安装'}}slotBodyWrapGray{{/if}}">
								<ul class="clearfix slotBodyWrapUl">
									<li class="slotBodyLeft">
										{{each(idx,waveTimes) item.tiVOs[0].waveTimes}}
										<div class="slotWaveTime">${waveTimes.waveTime}</div>
										{{/each}}
									</li>
									{{each(idx,tiVOsSelItems) item.tiVOs}}
									<li class="slotBodyList">
										{{each(idxx,tiVOsSelItem) tiVOsSelItems.waveTimes}}
											{{if tiVOsSelItem.available}}
												{{if tiVOsSelItem.selected}}
												<div class="slotSel js-select-can js-select {{if $config.jsSelectTime == '暂缓安装'}}js-select-gray{{/if}}" data-waveNum="${tiVOsSelItem.waveNum}" 
														data-waveTime="${tiVOsSelItem.waveTime}" data-installDate="${tiVOsSelItems.installDate}" data-installweek="${tiVOsSelItems.installweek}">
													<span>安装</span>
												</div>
												{{else}}
												<div class="slotSel js-select-can" data-waveNum="${tiVOsSelItem.waveNum}" data-installDate="${tiVOsSelItems.installDate}"><span>安装</span></div>
												{{/if}}
												{{else}}
												<div class="slotSel slotOver" data-waveNum="${tiVOsSelItem.waveNum}" data-installDate="${tiVOsSelItems.installDate}"><span>约满</span></div>
											{{/if}}
										{{/each}}
									</li>
									{{/each}}
								</ul>
							</div>
							{{/if}}
						</div>
					</div>
					<div class="deli_time_ctrl">
						<a class="cancelBtn" href="javascript:void(0)">取消</a>
						<a class="primaryBtn" href="javascript:void(0);">确定</a>
					</div>
				</div>
			</div>
			<!--对应商品弹层开始-->
			<div class="pr zi1000 _hover_1 hover-1 hide" hover-1 click-document-hide>
				<div class="goods_fenlei pabs box-sd1" >
					<div class="white-arrow" style="top: -8px;left: 266px;font-size:17px;">◆</div>
					<div class="fenlei_in">
						{{if item}}
							<div class="clearfix">
								<div class="mr10 col-1 fl" >
									<img src="${item.itemImageURL}" width="80" height="80" alt="">
								</div>
								<div class="fl col-2" >
									<a href="${item.itemURL}" class="p-name" target="_blank" title="${item.itemName}">
										<p class="p-name">
											{{if item.commerceitemVOFlag =='SUB'}}
												<!--if $config.isListValue(item.profile.types,'DPG')
													<em class="zp">折扣品</em>
												else $config.isListValue(item.profile.types,'JJHG')
													<em class="zp">换购品</em>-->
												{{if profile && profile.types && $config.isSub(profile.types)}}
													<em class="zp">赠品</em>
												{{/if}}
											{{/if}}
											{{if item.itemPropCode=="ZP"}}
											<em class="zp">赠品</em>
											{{/if}}
											${$config.limitStr(item.itemName,48)}
										</p>
									</a>
								</div>
							</div>
						{{/if}}
					</div>
				</div>
			</div>
			<!--对应商品弹层结束-->
		{{/if}}
		<!-- 送安一体标签 -->
		<div class="pr mt10 clearfix" {{if !item.distributionInstallSync}}style="visibility: hidden;"{{else}}margin-top:14px;margin-bottom:24px;{{/if}}>
			<div class="fl songantongbu"></div>	
		</div>
		{{/each}}
	{{else}}
		{{each(index,item) info.items}}
			{{if item.serviceTagFlag.length}}
				{{if $config.isListValue(item.serviceTagFlag,'StoreSpotGoods') || $config.isListValue(item.serviceTagFlag,'SelfPickPoint')}}
					{{each(ssi,exs) info.express}}
						{{if exs.selected && $config.isShowDataByShoppingList(exs) ==false}}
						<div class="otherTime pr clearfix">
							<div class="fl" >${$config.showTilteByShoppingList((exs),shopId)}</div>
						</div>
						{{/if}}
					{{/each}}
				{{else}}
					<div class="pr clearfix">
						<div class="fl" >配送时间：</div>
						<div class="chooseTime pr" style="margin-left:60px">
							<div class="chooseDay">
								{{if item.times.code=="DAY"}}
									{{each item.times.items}}
										{{if selected}}
										<label class="lb_check show" >
											<span class="c-i radio_chose mr5 mt4 fl"></span>
											<input type="radio" class="btn_radio">
											${$config.labels[code]}
											{{if $index ==0}}
											<div class="goods_dy" style="float: right;margin-right: 192px;" map-item>
												{{if visibleCorrespondItems(shopId)}}
												<a href="javascript:;" class="fontBlue clearfix" hoverup-0 click-document-pre>
													<i class="fl c-i tips" style="margin-top:5px; margin-right:4px;"></i>
												</a>
												<!--对应商品弹层开始-->
												<div class="pr zi1000">
													<div class="goods_fenlei pabs hide box-sd1" style="left: -72px;top: 6px;" hover-1 click-document-hide>
														<div class="white-arrow" style="top: -8px;left: 70px;font-size:17px;">◆</div>
														{{if info.items&&info.items.length>4}}
														<div style="height:15px;"></div>
														<div class="fenlei_in" style="height:370px;overflow-y:auto;">
														{{else}}
														<div class="fenlei_in">
														{{/if}}
															{{each(index,item) info.items}}
															{{if item}}
																<div class="clearfix">
																	<div class="mr10 col-1 fl" >
																		<img src="${item.itemImageURL}" width="80" height="80" alt="">
																	</div>
																	<div class="fl col-2" >
																		<a href="${item.itemURL}" class="p-name" target="_blank" title="${item.itemName}">
																			<p class="p-name">
																				{{if item.commerceitemVOFlag =='SUB'}}
																					{{if profile && profile.types && $config.isSub(profile.types)}}
																						<em class="zp">赠品</em>
																					{{/if}}
																				{{/if}}
																				{{if item.itemPropCode=="ZP"}}
																				<em class="zp">赠品</em>
																				{{/if}}
																				${$config.limitStr(item.itemName,48)}
																			</p>
																		</a>
																	</div>
																</div>
															{{/if}}
															{{if index!==info.items.length-1}}
																<div style="height:15px;"></div>
															{{/if}}
															{{/each}}
														</div>
													</div>
												</div>
												<!--对应商品弹层结束-->
												{{/if}}
											</div>
											{{/if}}
										</label>
										{{else}}
										<label class="lb_check show"
											g-day-path="shippinginfo,${iidx},items,${index},times,items,${$index}">
											<span class="c-i radio mr5 mt4 fl"></span>
											${$config.labels[code]}
											{{if $index ==0}}
											<div class="goods_dy" style="float: right;margin-right: 192px;" map-item>
												{{if visibleCorrespondItems(shopId)}}
												<a href="javascript:;" class="fontBlue clearfix" hoverup-0 click-document-pre>
													<i class="fl c-i tips" style="margin-top:5px; margin-right:4px;"></i>
												</a>
												<!--对应商品弹层开始-->
												<div class="pr zi1000">
													<div class="goods_fenlei pabs hide box-sd1" style="left: -72px;top: 6px;" hover-1 click-document-hide>
														<div class="white-arrow" style="top: -8px;left: 70px;font-size:17px;">◆</div>
														{{if info.items&&info.items.length>4}}
														<div style="height:15px;"></div>
														<div class="fenlei_in" style="height:370px;overflow-y:auto;">
														{{else}}
														<div class="fenlei_in">
														{{/if}}
															{{each(index,item) info.items}}
															{{if item}}
																<div class="clearfix">
																	<div class="mr10 col-1 fl" >
																		<img src="${item.itemImageURL}" width="80" height="80" alt="">
																	</div>
																	<div class="fl col-2" >
																		<a href="${item.itemURL}" class="p-name" target="_blank" title="${item.itemName}">
																			<p class="p-name">
																				{{if item.commerceitemVOFlag =='SUB'}}
																					<!--if $config.isListValue(item.profile.types,'DPG')
																							<em class="zp">折扣品</em>
																						else $config.isListValue(item.profile.types,'JJHG')
																							<em class="zp">换购品</em>-->
																					{{if profile && profile.types && $config.isSub(profile.types)}}
																						<em class="zp">赠品</em>
																					{{/if}}
																				{{/if}}
																				{{if item.itemPropCode=="ZP"}}
																				<em class="zp">赠品</em>
																				{{/if}}
																				${$config.limitStr(item.itemName,48)}
																			</p>
																		</a>
																	</div>
																</div>
															{{/if}}
															{{if index!==info.items.length-1}}
																<div style="height:15px;"></div>
															{{/if}}
															{{/each}}
														</div>
													</div>
												</div>
												<!--对应商品弹层结束-->
												{{/if}}
											</div>
											{{/if}}
										</label>
										{{/if}}
									{{/each}}
								{{/if}}

								{{if item.times.code=="SLOT"}}
									<div class="fl">
										<span g-slot-calendar_${iidx}>预计&nbsp;${xsdSelectedTime(item.times.concrete)}&nbsp;</span>
										<a click-document-pre href="javascript:;" class="ml10 js-modify_slot_time" data-time=${iidx}>修改</a>
										<div class="goods_dy _alert_post_set" style="float: right;margin-left: 10px;" map-item>
											{{if visibleCorrespondItems(shopId)}}
											<a href="javascript:;" class="fontBlue clearfix" hoverup-1 click-document-pre>
												<i class="fl c-i tips" style="margin-top:5px; margin-right:4px;"></i>
											</a>
											{{/if}}
										</div>
										<div click-document-hide class="pabs deli_time box-sd1 zi10 hide">
											<div class="slotTableWrapper">
												<div class="slotChose clearfix" style="margin-bottom:10px;">
													<div class="fl az">
														<a href="javascript:;" class="btn-tab btn btn-default btn-check btn-checked mw120 mr10">标准达<i class="c-i chose_icon"></i></a>
													</div>
												</div>
												{{each(idconc,ptime) item.times.concrete}}
													<table class="slotTable" {{if idconc===0}}style="margin-top:0"{{/if}}>
														<thead>
														<tr>
														{{each(idx,timeItem) ptime.head}}
															{{if idx==0}}
															<th>
																时间段
															</th>
															{{else}}
															<th>
																<p class="col-1-1">${timeItem.md}</p>
																<p class="col-1-2">${timeItem.label}</p>
															</th>
															{{/if}}
														{{/each}}
														</tr>
														</thead>
														<tbody>
														{{each(bidx,bodyitem) ptime.body}}
															<tr>
															{{each(biidx,timeitem) bodyitem}}
																{{if biidx==0}}
																	<td>
																		${$config.formathhmm(timeitem.startTime)}-${$config.formathhmm(timeitem.endTime)}
																	</td>
																{{else timeitem.status =='FULL'}}
																	<td><div class="item" style="background-color:#ccc;color:#fff">约满</div></td>
																{{else}}
																	{{if timeitem.selected}}
																		<td class="hover js-selected" {{if timeitem.status =='DI'}}style="padding: 0 3px;"{{/if}} g-t-path="shippinginfo,${iidx},items,${index},times,concrete,${idconc},body,${bidx},${biidx}">
																			<div class="item">
																			{{if timeitem.status =='DI'}}
																			送货+安装
																			{{else}}
																			送货
																			{{/if}}
																			</div>
																		</td>
																	{{else timeitem.status =='DI'}}
																		<td style="padding: 0 3px;" g-t-path="shippinginfo,${iidx},items,${index},times,concrete,${idconc},body,${bidx},${biidx}">
																			<div class="item">送货+安装</div>
																		</td>
																	{{else}}
																		<td g-t-path="shippinginfo,${iidx},items,${index},times,concrete,${idconc},body,${bidx},${biidx}">
																			<div class="item">送货</div>
																		</td>
																	{{/if}}
																{{/if}}
															{{/each}}
															</tr>
														{{/each}}
														</tbdoy>
													</table>
												{{/each}}
											</div>
											<p class="deli_time_tip">温馨提示：我们会努力按照您指定的时间配送，但因天气、交通等各类因素影响，您的订单有可能会有延误现象！</p>
											<p class="deli_time_tip deli_time_tip_warn deli_time_tip_warn1">您选择的送达时间已约满，请重新选择其他时间段进行配送！</p>
											<p class="deli_time_tip deli_time_tip_warn deli_time_tip_warn2">出问题啦，请稍后重新选择！</p>
											<p style="font-size: 12px;color: #FF7F23;">新功能提示：国美配送体验升级，送货安装可以同时完成。</p>
											<div class="deli_time_ctrl">
												<a g-t-cancel class="cancelBtn" href="javascript:void(0)">取消</a>
												<a attr-slot=g-slot-confirm_${iidx} g-t-confirm class="primaryBtn" href="javascript:void(0);">确定</a>
											</div>
										</div>
										<!--对应商品弹层开始-->
										<div class="pr zi1000 _hover_1 hover-1 hide" hover-1 click-document-hide>
											<div class="goods_fenlei pabs box-sd1">
												<div class="white-arrow" style="top: -8px;left: 206px;font-size:17px;">◆</div>
												<div class="fenlei_in">
													{{if item}}
														<div class="clearfix">
															<div class="mr10 col-1 fl" >
																<img src="${item.itemImageURL}" width="80" height="80" alt="">
															</div>
															<div class="fl col-2" >
																<a href="${item.itemURL}" class="p-name" target="_blank" title="${item.itemName}">
																	<p class="p-name">
																		{{if item.commerceitemVOFlag =='SUB'}}
																			{{if profile && profile.types && $config.isSub(profile.types)}}
																				<em class="zp">赠品</em>
																			{{/if}}
																		{{/if}}
																		{{if item.itemPropCode=="ZP"}}
																		<em class="zp">赠品</em>
																		{{/if}}
																		${$config.limitStr(item.itemName,48)}
																	</p>
																</a>
															</div>
														</div>
													{{/if}}
												</div>
											</div>
										</div>
										<!--对应商品弹层结束-->
									</div>
								{{/if}}
							</div>
						</div>
					</div>
				{{/if}}
			{{/if}}
			<!--安装标语及弹窗-->
			{{if item.tiVOs}}
				<div class="pr mt10 clearfix yyaz-support _alert_post_set" itemId="${itemId}" site="${$page.site}">
					<div class="fl">安装时间：</div>
					<div class="chooseTime pr" style="margin-left:60px">
						<div class="chooseDay">
							<div class="fl">
								<span class="jsSelectTime fontN">${$config.jsSelectTime}</span>
								<a href="javascript:;" click-document-pre class="yyaz_modify ml10">修改</a>
								<div class="goods_dy" style="float: right;margin-left: 10px;" map-item>
									{{if visibleCorrespondItems(shopId)}}
									<a href="javascript:;" class="fontBlue clearfix" hoverup-1 click-document-pre>
										<i class="fl c-i tips" style="margin-top:5px; margin-right:4px;"></i>
									</a>
									{{/if}}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="yyaz-box hide" yyaz-box click-document-hide>
					<div class="pabs deli_time yyaz_time box-sd1 zi10">
						<div class="yyaz_time_wrapper">
							<div class="slotTable yyazTable" style="margin-top:0">
								<div class="slotChose clearfix">
									<div class="fl az">
										{{if $config.jsSelectTime == "暂缓安装"}}
										<a href="javascript:;" class="btn-tab btn btn-default btn-check mw120 mr10">安装<i class="c-i chose_icon hide"></i></a></div>
									<div class="fl zhaz">
										<a href="javascript:;" data-waveNum="N" data-installDate="N" class="btn-tab btn btn-check btn-checked mw120 mr10 zhaz-btn">暂缓安装&nbsp;&nbsp;<em class="c-i tips_icon tipsBtn"></em><i class="c-i chose_icon"></i></a>
										<div class="zhaz-tip-box">
											<div class="white-arrow">◆</div>
											<div class="zhaz-tip">指您在购买商品时，如果不确定安装日期，可以选择“暂缓安装”一项。当您需要安装服务时，请拨打国美服务热线，即可为您提供安装服务。</div>
										</div>
									</div>
										{{else}}
										<a href="javascript:;" class="btn-tab btn btn-default btn-check btn-checked mw120 mr10">安装<i class="c-i chose_icon"></i></a></div>
									<div class="fl zhaz">
										<a href="javascript:;" data-waveNum="N" data-installDate="N" class="btn-tab btn btn-check mw120 mr10 zhaz-btn">暂缓安装&nbsp;&nbsp;<em class="c-i tips_icon tipsBtn"></em><i class="c-i chose_icon hide"></i></a>
										<div class="zhaz-tip-box">
											<div class="white-arrow">◆</div>
											<div class="zhaz-tip">指您在购买商品时，如果不确定安装日期，可以选择“暂缓安装”一项。当您需要安装服务时，请拨打国美服务热线，即可为您提供安装服务。</div>
										</div>
									</div>
										{{/if}}
								</div>
								{{if item.tiVOs}}
								<div class="clearfix slotHead {{if $config.jsSelectTime == '暂缓安装'}}slotHeadGray{{/if}}">
									<div class="slotHeadInfo">时间段</div>
									{{each(idx,tiVOsInstallItem) item.tiVOs}}
									<div class="slotHeadList">
										<p>${tiVOsInstallItem.installDate}</p>
										<p>${tiVOsInstallItem.installweek}</p>
									</div>
									{{/each}}
								</div>
								<div class="slotBodyWrap {{if $config.jsSelectTime == '暂缓安装'}}slotBodyWrapGray{{/if}}">
									<ul class="clearfix slotBodyWrapUl">
										<li class="slotBodyLeft">
											{{each(idx,waveTimes) item.tiVOs[0].waveTimes}}
											<div class="slotWaveTime">${waveTimes.waveTime}</div>
											{{/each}}
										</li>
										{{each(idx,tiVOsSelItems) item.tiVOs}}
										<li class="slotBodyList">
											{{each(idxx,tiVOsSelItem) tiVOsSelItems.waveTimes}}
												{{if tiVOsSelItem.available}}
													{{if tiVOsSelItem.selected}}
													<div class="slotSel js-select-can js-select {{if $config.jsSelectTime == '暂缓安装'}}js-select-gray{{/if}}" data-waveNum="${tiVOsSelItem.waveNum}" 
															data-waveTime="${tiVOsSelItem.waveTime}" data-installDate="${tiVOsSelItems.installDate}" data-installweek="${tiVOsSelItems.installweek}">
														<span>安装</span>
													</div>
													{{else}}
													<div class="slotSel js-select-can" data-waveNum="${tiVOsSelItem.waveNum}" data-installDate="${tiVOsSelItems.installDate}"><span>安装</span></div>
													{{/if}}
													{{else}}
													<div class="slotSel slotOver" data-waveNum="${tiVOsSelItem.waveNum}" data-installDate="${tiVOsSelItems.installDate}"><span>约满</span></div>
												{{/if}}
											{{/each}}
										</li>
										{{/each}}
									</ul>
								</div>
								{{/if}}
							</div>
						</div>
						<div class="deli_time_ctrl">
							<a class="cancelBtn" href="javascript:void(0)">取消</a>
							<a class="primaryBtn" href="javascript:void(0);">确定</a>
						</div>
					</div>
				</div>
				<!--对应商品弹层开始-->
				<div class="pr zi1000 _hover_1 hover-1 hide" hover-1 click-document-hide>
					<div class="goods_fenlei pabs box-sd1" >
						<div class="white-arrow" style="top: -8px;left: 266px;font-size:17px;">◆</div>
						<!--if info.items&&info.items.length>4
						<div style="height:15px;"></div>
						<div class="fenlei_in" style="height:370px;overflow-y:auto;">
						else
						<div class="fenlei_in">
						/if -->
						<div class="fenlei_in">
							<!--each(index,item) info.items -->
							{{if item}}
								<div class="clearfix">
									<div class="mr10 col-1 fl" >
										<img src="${item.itemImageURL}" width="80" height="80" alt="">
									</div>
									<div class="fl col-2" >
										<a href="${item.itemURL}" class="p-name" target="_blank" title="${item.itemName}">
											<p class="p-name">
												{{if item.commerceitemVOFlag =='SUB'}}
													<!--if $config.isListValue(item.profile.types,'DPG')
														<em class="zp">折扣品</em>
													else $config.isListValue(item.profile.types,'JJHG')
														<em class="zp">换购品</em>-->
													{{if profile && profile.types && $config.isSub(profile.types)}}
														<em class="zp">赠品</em>
													{{/if}}
												{{/if}}
												{{if item.itemPropCode=="ZP"}}
												<em class="zp">赠品</em>
												{{/if}}
												${$config.limitStr(item.itemName,48)}
											</p>
										</a>
									</div>
								</div>
							{{/if}}
							<!--if index!==info.items.length-1
								<div style="height:15px;"></div>
							/if
							/each-->
						</div>
					</div>
				</div>
				<!--对应商品弹层结束-->
			{{/if}}
			<!-- 送安一体标签 -->
			<div class="pr mt10 clearfix" {{if !item.distributionInstallSync}}style="visibility: hidden;"{{else}}style="margin-top:14px;margin-bottom:24px;"{{/if}}>
				<div class="fl songantongbu"></div>	
			</div>
		{{/each}}
	{{/if}}

</div>
{{/each}}
{{if $config.VBLE.beizhu()}}
<p class="valignp mt40" g-pipe>
	<span class="remarks fl">备注:</span>
	<label class="rmarkLabel fl">
		<input type="text" class="form-control" style="width:250px;" value="${profile.comments}" g-keyup="changeComment [g-keyup] [g-tip]" placeholder="最多输入30个字">
	</label>
	<span class="nWarings fl hide fontRed" g-tip>&nbsp;&nbsp;最多输入30个字 </span>
</p>
{{/if}}
{{if shopPhone}}
<p class="dispatfont">
	<span class="fontGray mr5">如有疑问请联系</span>
	${shopPhone}
</p>
{{/if}}