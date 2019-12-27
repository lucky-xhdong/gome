{{if $config.VBLE.youhuiquan() || ($config.VBLE.mendianjifen() && vrbsos.sp.currentPoint) || $config.VBLE.shiyongguomeiE() || $config.VBLE.shiyongMD() || $config.VBLE.symeikouling() || $config.VBLE.shiyongtuijianhao()}}
{{if $page.site != "warranty" && $page.site != "secondHand"}}
<div class="yonghuzichan">
	<div g-pipe class="yhzc_title">
		{{if $config.shoppingAtom.userAsset == "Y"}}
        <h3 class="title-color font14" g-click="setOrState userAsset N,render"><span class="tit-span">使用优惠 / 抵用<em class="c-i down ml5 mb2"></em></span></h3>
		{{else}}
        <h3 class="title-color font14" g-click="setOrState userAsset Y,render"><span class="tit-span">使用优惠 / 抵用<em class="c-i up ml5 mb2"></em></span></h3>
		{{/if}}
		<!-- {{if $page.site=="home"}}
		<div class="yhzc_huodong">
			<span class="yhzc_hdtip">
			    美口令			
			</span>
			<div class="triangle-topleft"></div>
		</div>
		{{/if}} -->
	</div>
	{{if $config.shoppingAtom.userAsset == "Y"}}
	<div class="info-bd" g-pipe>
		<ul class="backStyle coupon_ul clearfix">
			{{if $config.VBLE.youhuiquan() && $page.site !== "applePc" }}
				{{if $config.shoppingAtom.yhj == "Y"}}
					<li class="active"><a href="javascript:;" class="pr">优惠券{{if vrbsos.cvs && vrbsos.cvs.length}}<em class="fontRed point pabs">&bull;</em>{{/if}}</a></li>
				{{else}}
					<li g-click="setStage yhj Y,render"><a href="javascript:;" class="pr">优惠券{{if vrbsos.cvs && vrbsos.cvs.length}}<em class="fontRed point pabs">&bull;</em>{{/if}}</a></li>
				{{/if}}
			{{/if}}
			{{if $config.VBLE.mendianjifen() && vrbsos.sp.currentPoint}}
				{{if $config.shoppingAtom.mdjf == "Y"}}
					<li class="active"><a href="javascript:;">门店积分</a></li>
				{{else}}
					<li g-click="setStage mdjf Y,render"><a href="javascript:;">门店积分</a></li>
				{{/if}}
			{{/if}}
			{{if $config.VBLE.shiyongguomeiE()}}
				{{if $config.shoppingAtom.sygmek == "Y"}}
					<li class="active"><a href="javascript:;" class="pr">美通卡{{if vrbsos.pcs && vrbsos.pcs.use}}<em class="fontRed point pabs">&bull;</em>{{/if}}</a></li>
				{{else}}
					<li g-click="setStage sygmek Y,render"><a href="javascript:;" class="pr">美通卡{{if vrbsos.pcs && vrbsos.pcs.use}}<em class="fontRed point pabs">&bull;</em>{{/if}}</a></li>
				{{/if}}
			{{/if}}
			{{if $config.VBLE.shiyongMD()}}
				{{if $config.shoppingAtom.syjf == "Y"}}
					<li class="active"><a href="javascript:;" class="pr">美豆{{if vrbsos.gd && vrbsos.gd.canUseGomedos && vrbsos.gd.canUseGomedos>0}}<em class="fontRed point pabs" style="right: 49px;">&bull;</em>{{/if}}</a></li>
				{{else}}
					<li g-click="setStage syjf Y,render"><a href="javascript:;" class="pr">美豆{{if vrbsos.gd && vrbsos.gd.canUseGomedos && vrbsos.gd.canUseGomedos>0}}<em class="fontRed point pabs" style="right: 49px;">&bull;</em>{{/if}}</a></li>
				{{/if}}
			{{/if}}
			<!-- {{if $config.VBLE.symeikouling()}}
				{{if $config.shoppingAtom.symkl == "Y"}}
					<li class="active"><a href="javascript:;">美口令</a></li>
				{{else}}
					<li g-click="setStage symkl Y,render"><a href="javascript:;">美口令</a></li>
				{{/if}}
			{{/if}} -->
			{{if $config.VBLE.shiyongtuijianhao()}}
				{{if $config.shoppingAtom.sytjh == "Y"}}
					<li class="active"><a href="javascript:;">推荐号</a></li>
				{{else}}
					<li g-click="setStage sytjh Y,render"><a href="javascript:;">推荐号</a></li>
				{{/if}}
			{{/if}}
		</ul>
		<!-- 优惠券 -->
		{{if $config.shoppingAtom.yhj == "Y" && $config.VBLE.youhuiquan() && $page.site !== "applePc" }}
			<div class="coupon-box" {{if typeof redCouponStatus !=="undefined" && redCouponStatus !== 'NO_NEED'}}style="padding-top:40px;"{{else}}style="padding-top:20px;"{{/if}}>
                {{if vrbsos.cvs.length !== 0 || vrbsos.ucvs.length !== 0}}
                <div class="pabs" style="left: 25px; top: 3px;">
                    {{if typeof redCouponStatus !=="undefined" && redCouponStatus=="NOT_BINDING_ASSET"}}
                        <div style="margin-top: 10px;">{{html $config.errorText.f6}}</div>
                    {{/if}}
                </div>
                {{/if}}
				{{if !$config.isHwgSite()}}
					<dl class="redCard-act clearfix" id="actRedcard">
						<dt class="activateYhq mr10 clearfix" style="margin-bottom: 35px;">
							<span class="trigers {{if $config.shoppingAtom.yhj_jh=='N'}}fontW gomeactivate{{/if}} mr30 fl" g-click="setOrState yhj_jh N,render">
								商品优惠券
							</span>
							<span class="trigers {{if $config.shoppingAtom.yhj_jh=='Y'}}fontW gomeactivate{{/if}} mr5 fl" g-click="setOrState yhj_jh Y,render">
								优惠码兑换
							</span>
						</dt>
						{{if $config.shoppingAtom.yhj_jh=="Y"}}
							<dd class="redCard-box" >
								<form class="active-nForm">
									<table class="redReady" cellspacing="0" cellpadding="0">
										<tbody>
											<tr>
												<td>优惠券兑换码：</td>
												<td>
													<input
													g-keyup="setValueStage yhj_bm this"
													value="${$config.shoppingAtom.yhj_bm}"
													class="
													form-control mr5 yhj_bm yhq-code yhq-code-bm
													{{if $config.shoppingAtom.yhj_tip}}
													error
													{{/if}}
													" type="text" placeholder="请输入激活码" style="width:235px; padding: 11px 5px 9px 12px;">
                                                </td>
												<!--<td>
													<input
													g-keyup="setValueStage yhj_jhm this"
													value="${$config.shoppingAtom.yhj_jhm}"
													class="
													form-control mr5 ml5 e-num-yhq yhq-code yhq-code-jhm
													{{if $config.shoppingAtom.yhj_tip}}
													error
													{{/if}}
													" type="text" placeholder="请输入激活码" g-keyup="setValueStage yhq_jhm this" value="${$config.shoppingAtom.yhq_jhm}" style="width:235px; padding: 11px 5px 9px 12px;"></td>
												-->
                                                <td>
													<input
													g-keyup="setValueStage yhj_yzm this"
													value="${$config.shoppingAtom.yhj_yzm}"
													class="
													form-control mr5 ml30 e-num-yhq yhq-code yhq-code-yzm
													{{if $config.shoppingAtom.yhj_tip}}
													error
													{{/if}}
													"
													type="text" placeholder="请输入验证码" style=" width:75px;vertical-align: middle; padding: 11px 5px 9px 12px;">
													<span class="nValidate mr15 ml5"><img style="height: 40px; width: 100px;" src="${$config.URL.imgcode}&capCd=${$config.shoppingAtom.yhj_img}" g-click="setTimeLongStage yhj_img,render"></span>
													<a class=" fontBlue mr20 ml5" style="display: none;" href="javascript:void(0)" g-click="setTimeLongStage yhj_img,render">换一张</a>
												</td>
												<td>
													{{if $config.isDisabledJH()}}
													<a href="javascript:void(0)" class="btn btn-disabled" style="padding: 9px 26px; font-size: 14px;">兑换</a>
													{{else}}
													<a href="javascript:void(0)" class="btn btn-primary" style="padding: 9px 26px; font-size: 14px; margin-left: 30px;" g-click="activeYCode,setTimeLongStage yhj_img">兑换</a>
													{{/if}}
												</td>
                                                <td class="fontff5c5c yhj_tip">
                                                    {{if $config.shoppingAtom.yhj_tip}}
                                                        <em class="c-i close" style="vertical-align: -4px;"></em>&nbsp;
                                                        ${$config.shoppingAtom.yhj_tip}
                                                    {{/if}}
                                                </td>
											</tr>
										</tbody>
									</table>
								</form>
							</dd>
                        {{else}}
                            <!--当没有可用优惠券的时候不展示最优组合选项-->
                            {{if vrbsos.cvs.length > 0 && $config.shoppingAtom.yhj_jh=="N"}}
                                <dd class="use-combine">
                                    {{if $config.shoppingAtom.yhj_com=="Y" && vrbsos.usedFeeNum+vrbsos.availableFeeNum != vrbsos.cvs.length && vrbsos.usedRGBSNum+vrbsos.usedFeeNum+vrbsos.availableFeeNum == vrbsos.cvs.length}}
                                    <span class="" g-click="setOrState,useBestComCanel yhj_com N,render"><i class="c-i checkbox_chose"></i>使用最优组合</span>
                                    {{else}}
                                    <span class="" g-click="setOrState,useBestCom yhj_com Y,render"><i class="c-i checkboxs"></i>使用最优组合</span>
                                    {{/if}}
                                    &nbsp;&nbsp;&nbsp;
                                    <span class="discount-total">已抵用 
                                    <i class="fontRed fontArial">¥ ${$config.formatAmountWithNoRound(vrbsos.reduceRGBSAmount)}</i> 元
                                    {{if vrbsos.usedRGBSNum >= 0}}
                                    &nbsp;&nbsp;(使用<em class="fontArial">${vrbsos.usedRGBSNum}</em>张优惠券)
                                    {{/if}}
                                    {{if vrbsos.usedFeeNum >0}}
                                    &nbsp;&nbsp;已抵用运费
                                    <i class="fontRed fontArial">¥ ${$config.formatAmountWithNoRound(vrbsos.reduceFeeAmount)}</i> 元
                                    &nbsp;&nbsp;(使用<em class="fontArial">${vrbsos.usedFeeNum}</em>张运费券)
                                    {{/if}}
                                    {{if vrbsos.availableFeeNum >0}}
                                    &nbsp;&nbsp;<i class="fontRed fontArial">${vrbsos.availableFeeNum}张运费券可选</i>
                                    {{/if}}
                                    </span>
                                </dd>
                            {{/if}}
						{{/if}}
					</dl>
				{{/if}}
				<!-- 运费劵->红劵->蓝劵->美劵->店铺劵->商品劵 -->
				{{if (vrbsos.cvs.length > 0 || vrbsos.ucvs.length > 0) && $config.shoppingAtom.yhj_jh=="N"}}
					<div class="coupon-group-wrap" coupon-group-wrap style="{{if $config.isHwgSite()}}padding-top:20px;{{/if}}">
						<ul class="coupon-group  clearfix">
							{{each(i, cvsitem) vrbsos.cvs}}
								<li
								couponid="${cvsitem.id}"
								class="
								${$config.labels['assert_'+cvsitem.type+'_class']}
								easy
								{{if cvsitem.checked}}
								coupon-select
								{{/if}}"
								>
									{{if cvsitem.checked}}
										<em class="c-i coupon-select"></em>
										<p class="c-i coupon-border-select"></p>
									{{/if}}
                                    <!-- 判断是否即将过期 -->
                                    {{if cvsitem.dateRange.end<= (new Date().getTime()+24*60*60*1000*7)}}
                                        <em class="c-i coupon-pre-expire "></em>
                                    {{/if}}
                                    <p class="c-i ${$config.labels['assert_'+cvsitem.type+'_border']}"></p>
									{{if cvsitem.checked}}<div class="checkcoupon">{{/if}}
									<!-- 有描述显示全部 -->
									<div class="coupon normal"
                                         {{if cvsitem.checked}}
                                            g-click="changeCvsitem vrbsos.cvs.${i} N ${cvsitem.couponUnitPrice}"
                                         {{else}}
                                            g-click="changeCvsitem vrbsos.cvs.${i} Y ${cvsitem.couponUnitPrice}"
                                         {{/if}}
                                    >
										<span class="num mr5 fontArial">¥${cvsitem.couponUnitPrice}</span>
										{{if  cvsitem.type == "OFFLINE"}}
											{{if cvsitem.shopNo=="guomei"}}
												<span class="brand">全国通用</span>
											{{else}}
												<span class="brand">${cvsitem.brand}电器</span>
											{{/if}}
										{{/if}}
                                        {{if cvsitem.type =="FEE"}}
                                            <span class="brand" style="color:#FFFFFF;">限国美自营(特殊商品除外)</span>
                                        {{/if}}
                                        {{if cvsitem.couponApplyDetailInfoVO.limitedAmount}}
                                        <span class="condition">满${cvsitem.couponApplyDetailInfoVO.limitedAmount}</span>
                                        {{/if}}
										<p>
											<span class="info infonormal">
											{{html $config.labels['assert_'+cvsitem.type+'_label']}}
											</span>
											{{if  cvsitem.type == $config.labels.COUPON_TYPE_SHOP || cvsitem.type == $config.labels.COUPON_TYPE_OFFLINE || cvsitem.type == $config.labels.COUPON_TYPE_FEE}}
											<span class="expiredate">
											{{else}}
											<span class="expiredate enormal">
											{{/if}}
											有效期至<em class="fontArial">${$config.formatLong(cvsitem.dateRange.end)}</em>
											</span>
										</p>
									</div>
                                    <div class='txt name_over2 useInfoBox'>
                                        {{if cvsitem.type == "SHOP"}}
                                            <span class="useInfoT" style="margin-right: 16px;" click-document-pre>[ 限店铺 ]</span>
                                        {{else cvsitem.type == "PRODUCT"}}
                                            <span class="useInfoT" style="margin-right: 16px;" click-document-pre>[ 限指定商品 ]</span>
                                        {{else cvsitem.type != "FEE"}}
                                            <span class="useInfoT" {{if $config.gomeCouponType(cvsitem).length<4 && $config.gomeCouponType(cvsitem) !== ""}}style="margin-right: 16px;"{{/if}} click-document-pre>
                                                {{if cvsitem.type == "GOME"}}
                                                    {{if $config.gomeCouponType(cvsitem) == ""}}
                                                        [ 使用说明 ]
                                                    {{else}}
                                                        [${$config.gomeCouponType(cvsitem)}]
                                                    {{/if}}
                                                {{else}}
                                                    {{if cvsitem.type == "RED" && cvsitem.bigRedCoupon == true}}
                                                        [ 大客户 ]&nbsp;
                                                    {{else}}
                                                        [ 使用说明 ]
                                                    {{/if}}
                                                {{/if}}
                                            </span>
                                        {{/if}}
                                        {{if cvsitem.desc && cvsitem.desc != ""}}
                                            {{if cvsitem.gomeCouponType != "5" && cvsitem.gomeCouponType != "6"}}
                                            <div class="useInfoCon" click-document-hide>
                                                <div class="white-arrow"><em class="c-i arrowup_gray"></em></div>
                                                <div class="useInfoDesc">
                                                    <div class="udesc">${cvsitem.desc}</div>
                                                    <em class="pabs c-i closebtn"></em>
                                                </div>
                                            </div>
                                            {{/if}}
                                            {{else}}
                                            {{if cvsitem.gomeCouponType != "5" && cvsitem.gomeCouponType != "6"}}
                                            <div class="useInfoCon" click-document-hide>
                                                <div class="white-arrow"><em class="c-i arrowup_gray"></em></div>
                                                <div class="useInfoDesc">
                                                    {{if cvsitem.type == "GOME"}}[${$config.gomeCouponType(cvsitem)}]{{/if}} ${$config.labels.COUPON_NO_DESC}
                                                    <em class="pabs c-i closebtn"></em>
                                                </div>
                                            </div>
                                            {{/if}}
                                        {{/if}}
                                        {{if cvsitem.type != "FEE" && cvsitem.couponApplyDetailInfoVO !=null && cvsitem.couponApplyDetailInfoVO.skuList && cvsitem.couponApplyDetailInfoVO.skuList.length}}
                                        <span class="useListT" click-document-pre>[ 可用商品 ]</span>
                                        <div class="
                                            useList
                                            {{if cvsitem.couponApplyDetailInfoVO.skuList.length == 1}}
                                                useListW1
                                            {{else cvsitem.couponApplyDetailInfoVO.skuList.length == 2}}
                                                useListW2
                                            {{else cvsitem.couponApplyDetailInfoVO.skuList.length == 3}}
                                                useListW3
                                            {{else cvsitem.couponApplyDetailInfoVO.skuList.length == 4}}
                                                useListW4
                                            {{else cvsitem.couponApplyDetailInfoVO.skuList.length == 5}}
                                                useListW5
                                            {{/if}}
                                            " click-document-hide>
                                            <div class="white-arrow"><em class="c-i arrowup_gray"></em></div>
                                            <div class="useListTop">该劵可用商品</div>
                                            <em class="pabs c-i closebtn"></em>
                                            <ul>
                                                {{each(iSkuList, skuList) cvsitem.couponApplyDetailInfoVO.skuList}}
                                                <li>
                                                    <a href="${skuList.itemURL}" target="_blank">
                                                        <div class="itemImage"><img src="${skuList.itemImageURL}" /></div>
                                                        <div class="itemName" title="${skuList.itemName}">${skuList.itemName}</div>
                                                    </a>
                                                </li>
                                                {{/each}}
                                            </ul>
                                        </div>
                                        {{/if}}
                                    </div>
									{{if cvsitem.checked}}</div>{{/if}}
                                    <p class="unavailReason"></p>
								</li>
							{{/each}}
							{{each(i, cvsitem) vrbsos.ucvs}}
								<li class="coupon-dis easy">
                                    <!-- 判断是否即将过期 -->
                                    {{if cvsitem.dateRange.end<= (new Date().getTime()+24*60*60*1000*7)}}
                                    <em class="c-i coupon-pre-expire-gray "></em>
                                    {{/if}}
									<p class="c-i coupon-border-dis"></p>
									<!-- 有描述显示全部 -->
									<div class="coupon normal">
										<span class="num mr5">¥${cvsitem.couponUnitPrice}</span>
										{{if cvsitem.type == "OFFLINE"}}
											{{if cvsitem.shopNo=="guomei"}}
												<span class="brand" style="color:#f3f3f3;">全国通用</span>
											{{else}}
												<span class="brand" style="color:#f3f3f3;">${cvsitem.brand}电器</span>
											{{/if}}
										{{/if}}
                                        {{if cvsitem.type =="FEE"}}
                                            <span class="brand" style="color:#f3f3f3;">限国美自营(特殊商品除外)</span>
                                        {{/if}}
                                        {{if cvsitem.couponApplyDetailInfoVO.limitedAmount}}
                                            <span class="condition">满${cvsitem.couponApplyDetailInfoVO.limitedAmount}</span>
                                        {{/if}}
										<p>
											<span class="info infonormal">
											{{html $config.labels['assert_'+cvsitem.type+'_label']}}
											</span>
											{{if  cvsitem.type == $config.labels.COUPON_TYPE_SHOP || cvsitem.type == $config.labels.COUPON_TYPE_OFFLINE}}
											<span class="expiredate">
											{{else}}
											<span class="expiredate enormal">
											{{/if}}
											有效期至${$config.formatLong(cvsitem.dateRange.end)}
											</span>
										</p>
									</div>

                                    <div class='txt name_over2 graytxt useInfoBox'>
                                        {{if cvsitem.type == "SHOP"}}
                                            <span class="useInfoT" style="margin-right: 16px;" click-document-pre>[ 限店铺 ]</span>
                                        {{else cvsitem.type == "PRODUCT"}}
                                            <span class="useInfoT" style="margin-right: 16px;" click-document-pre>[ 限指定商品 ]</span>
                                        {{else cvsitem.type != "FEE"}}
                                            <span class="useInfoT" {{if $config.gomeCouponType(cvsitem).length<4 && $config.gomeCouponType(cvsitem) !== ""}}style="margin-right: 16px;"{{/if}} click-document-pre>
                                                {{if cvsitem.type == "GOME"}}
                                                    {{if $config.gomeCouponType(cvsitem) == ""}}
                                                        [ 使用说明 ]
                                                    {{else}}
                                                        [${$config.gomeCouponType(cvsitem)}]
                                                    {{/if}}
                                                {{else}}
                                                    {{if cvsitem.type == "RED" && cvsitem.bigRedCoupon == true}}
                                                        [ 大客户 ]&nbsp;
                                                    {{else}}
                                                        [ 使用说明 ]
                                                    {{/if}}
                                                {{/if}}
                                            </span>
                                        {{/if}}
                                        {{if cvsitem.desc && cvsitem.desc != ""}}
                                            {{if cvsitem.gomeCouponType != "5" && cvsitem.gomeCouponType != "6"}}
                                            <div class="useInfoCon" click-document-hide>
                                                <div class="white-arrow"><em class="c-i arrowup_gray"></em></div>
                                                <div class="useInfoDesc">
                                                    <div class="udesc">${cvsitem.desc}</div>
                                                    <em class="pabs c-i closebtn"></em>
                                                </div>
                                            </div>
                                            {{/if}}
                                            {{else}}
                                            {{if cvsitem.gomeCouponType != "5" && cvsitem.gomeCouponType != "6"}}
                                            <div class="useInfoCon" click-document-hide>
                                                <div class="white-arrow"><em class="c-i arrowup_gray"></em></div>
                                                <div class="useInfoDesc">-+
                                                    <div class="udesc">{{if cvsitem.type == "GOME"}}[${$config.gomeCouponType(cvsitem)}] {{/if}}${$config.labels.COUPON_NO_DESC}</div>
                                                    <em class="pabs c-i closebtn"></em>
                                                </div>
                                            </div>
                                            {{/if}}
                                        {{/if}}
                                    </div>

                                    {{if cvsitem.couponApplyDetailInfoVO !=null && cvsitem.couponApplyDetailInfoVO.unavailReasonType}}
                                    <p class="unavailReason">
                                        <em class="c-i notice_gray" style="vertical-align: -4px;"></em>
                                        {{if cvsitem.couponApplyDetailInfoVO.unavailReasonType == 0}}
                                            <span title="没有符合条件的商品">没有符合条件的商品</span>
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 1}}
                                        <span title="所结算商品中没有符合条件的商品">所结算商品中没有符合条件的商品</span>
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 2}}
                                            <span title="同一订单内超出最大使用张数">同一订单内超出最大使用张数{{if cvsitem.couponApplyDetailInfoVO.reasonSupplyment}}${cvsitem.couponApplyDetailInfoVO.reasonSupplyment}张{{/if}}</span>
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 3}}
                                        <span title="同一商品超出最大使用张数">同一商品超出最大使用张数{{if cvsitem.couponApplyDetailInfoVO.reasonSupplyment}}${cvsitem.couponApplyDetailInfoVO.reasonSupplyment}张{{/if}}</span>
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 4}}
                                            <span title="商品中有参加满返促销活动，不能同时使用">商品中有参加满返促销活动，不能同时使用</span>
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 5}}
                                            <span title="还差${cvsitem.couponApplyDetailInfoVO.offSetAmount}元可用">还差${cvsitem.couponApplyDetailInfoVO.reasonSupplyment}元可用</span>
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 6}}
                                            <span title="券规则数据有误">券规则数据有误</span>
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 7}}
                                            {{if cvsitem.type == "SHOP" || cvsitem.type == "PRODUCT"}}
                                                <span title="店铺商品已参加店铺促销活动，不能同时使用店铺劵">店铺商品已参加店铺促销活动，不能同时使用店铺劵</span>
                                            {{else}}
                                                <span title="店铺商品已参加店铺促销活动，不能同时使用购物劵">店铺商品已参加店铺促销活动，不能同时使用购物劵</span>
                                            {{/if}}
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 8}}
                                            <span title="订单中含团抢商品，此劵暂不可用">订单中含团抢商品，此劵暂不可用</span>
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 9}}
                                            <span title="店铺劵与平台劵不能同时使用">店铺劵与平台劵不能同时使用</span>
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 10}}
                                            {{if typeof redCouponStatus !=="undefined" && redCouponStatus && redCouponStatus=="VERIFY_NOT_UPGRADE"}}
                                                <span title="暂未升级支付密码，请升级后使用">暂未升级支付密码，请升级后使用</span>
                                            {{else typeof redCouponStatus !=="undefined" && redCouponStatus && redCouponStatus=="VERIFY_NOT_ACTIVATED"}}
                                                <span title="暂未设置支付密码，请设置后使用">暂未设置支付密码，请设置后使用</span>
                                            {{else}}
                                                <span title="所结算商品中没有符合条件的商品">所结算商品中没有符合条件的商品</span>
                                            {{/if}}
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 11}}
                                            <span title="已经抵扣全部国美自营商品运费">已经抵扣全部国美自营商品运费</span>
                                        {{else cvsitem.couponApplyDetailInfoVO.unavailReasonType == 12}}
                                            <span title="所结算商品中未产生国美自营商品运费">所结算商品中未产生国美自营商品运费</span>
                                        {{else}}
                                            <span title="所结算商品中没有符合条件的商品">所结算商品中没有符合条件的商品</span>
                                        {{/if}}
                                    </p>
                                    {{else}}
                                        <p class="unavailReason"></p>
                                    {{/if}}
								</li>
							{{/each}}
						</ul>
					</div>
				{{else}}
					{{if $config.shoppingAtom.yhj_jh=="N"}}
                        <div class="nocoupontip">您暂无优惠券可以使用</div>
					{{/if}}
				{{/if}}
                <div class="whatCouponTip"><a href="http://help.gome.com.cn/article/279-0-0.html" target="_blank">了解优惠券？</a></div>
			</div>
		<!-- 门店积分 -->
		{{else $config.shoppingAtom.mdjf == "Y" && $config.VBLE.mendianjifen()}}
			{{if vrbsos.sp.currentPoint}}
				<div class="chooes-bd" style="margin-bottom: 15px;">
					<div class="bind-e">
						<p class="kymdjf fontGray">可用国美门店积分
							<span>${vrbsos.sp.currentPoint}</span>
							积分，本次最多可使用&nbsp;
							<span>${vrbsos.sp.availablePoint}</span>
							&nbsp;积分<span>&nbsp;(1积分等于1元红券)</span>
						</p>
						<dl class="clearfix">
							<dt class="fl">门店会员积分：</dt>
							<dd class="fl mr20">
								<div class="input-group">
									<input
									type="text"
									class="form-control sm r-no-radius"
									style="width:150px;"
									value="${$config.shoppingAtom.mdhyjf}"
									g-keyup="setValueStage mdhyjf this" />
									{{if vrbsos.sp.availablePoint==0}}
									<a class="btn btn-disabled sm l-no-radius" href="javascript:void(0)" > 兑换 </a>
									{{else}}
									<a class="btn btn-primary sm l-no-radius" href="javascript:void(0)" g-click="changeInto"> 兑换 </a>
									{{/if}}
									<p class="mdjftip fontGray">兑换产生的红券可在优惠券中查看并使用</p>
								</div>
								{{if $config.shoppingAtom.mdhyjf_tip}}
								<span class="fontRed">${$config.shoppingAtom.mdhyjf_tip}</span>
								{{/if}}
							</dd>
							<dd class="fl"></dd>
						</dl>
					</div>
				</div>
			{{/if}}
		{{else $config.shoppingAtom.sygmek == "Y" && $config.VBLE.shiyongguomeiE()}}
			<div class="chooes-bd" {{if typeof prepaidCardStatus !=="undefined" && prepaidCardStatus !== 'NO_NEED'}}style="padding-top:30px;"{{else}}style="padding-top:10px;"{{/if}}>
				<div class="e-card-wrap">
                    <div class="err-notactive">
                        {{if typeof prepaidCardStatus !=="undefined" && prepaidCardStatus=="VERIFY_NOT_ACTIVATED"}}
                            {{html $config.errorText.f3}}
                        {{else typeof prepaidCardStatus !=="undefined" && prepaidCardStatus=="VERIFY_NOT_UPGRADE"}}
                            {{html $config.errorText.f2}}
                        {{else typeof prepaidCardStatus !=="undefined" && prepaidCardStatus=="NOT_BINDING_ASSET"}}
                            {{html $config.errorText.f6}}
                        {{/if}}
                    </div>
                    <div class="whatCardTip" {{if typeof prepaidCardStatus !=="undefined" && prepaidCardStatus !== 'NO_NEED'}}style="top:-5px;"{{else}}style="top:15px;"{{/if}}><a href="http://help.gome.com.cn/article/373-0-0.html" target="_blank">了解美通卡？</a></div>
                    <div class="activateYhq clearfix" style="padding-top: 10px;">
                        {{if vrbsos.pcs.pcs &&  vrbsos.pcs.pcs.length>0}}
                        <span class="trigers {{if $config.shoppingAtom.ecard_jh=='N'}}fontW gomeactivate{{/if}} mr30 fl" g-click="setOrState ecard_jh N,render">
                            已绑定美通卡
                        </span>
                        <span class="trigers {{if $config.shoppingAtom.ecard_jh=='Y'}}fontW gomeactivate{{/if}} mr5 fl" g-click="setOrState ecard_jh Y,render">
                            添加美通卡
                        </span>
                        {{else}}
                        <span class="trigers fontW gomeactivate mr5 fl" g-click="setOrState ecard_jh Y,render">
                            添加美通卡
                        </span>
                        {{/if}}

                    </div>
                    {{if $config.shoppingAtom.ecard_jh=='Y'}}
                    <div class="bind-e">
                        <div class="bind-e-card-wrap" >
                            <span class="bind-e-please">美通卡密码：</span>
                            <input  class="form-control  e-num"  type="text"
                                    g-keyup="setValueStage ecard_1 this"
                                    value="${$config.shoppingAtom.ecard_1}">
                            <span>-</span>
                            <input  class="form-control  e-num"  type="text"
                                    g-keyup="setValueStage ecard_2 this"
                                    value="${$config.shoppingAtom.ecard_2}"
                            >
                            <span>-</span>
                            <input  class="form-control  e-num" type="text"
                                    g-keyup="setValueStage ecard_3 this"
                                    value="${$config.shoppingAtom.ecard_3}"
                            >
                            <span>-</span>
                            <input  class="form-control  e-num" type="text"
                                    g-keyup="setValueStage ecard_4 this"
                                    value="${$config.shoppingAtom.ecard_4}"
                            >

                            <input class="form-control ver-code"
                                   g-keyup="setValueStage ecard_yzm this"
                                   value="${$config.shoppingAtom.ecard_yzm}" placeholder="请输入验证码">
                            {{if $config.shoppingAtom.ecard_yzm_tip !== ""}}
                            <span class="fontRed">&nbsp;&nbsp;{{html $config.shoppingAtom.ecard_yzm_tip}}</span>
                            {{/if}}
                            <a class="ver-code-pic"><img src="${$config.URL.imgCodeMTK}&capCd=${$config.shoppingAtom.yhj_img}" g-click="setTimeLongStage yhj_img,render"></a>
                            <a class="ver-code-refresh" style="display: none;" href="javascript:void(0);" g-click="setTimeLongStage yhj_img,render">换一张</a>
                            <a class="binding btn btn-primary btn-sm " g-click="bindECard,setTimeLongStage yhj_img">绑定</a>
                            <span class="binding-explain">
                                <em class="c-i c-i close" style="vertical-align: -4px;"></em>
                                {{if $config.shoppingAtom.dzqma_tip}}
                                    ${$config.shoppingAtom.dzqma_tip}
                                {{else}}
                                    卡密区分大小写
                                {{/if}}
                            </span>
                        </div>
                    </div>
                    {{else $config.shoppingAtom.ecard_jh=='N'}}
                    {{if vrbsos.pcs.pcs && vrbsos.pcs.pcs.length>0}}
                    <div class="use-e clearfix">
                        {{each(i,pcs) vrbsos.pcs.pcs}}
                            {{if pcs.use}}
                                {{if pcs.checked == true}}
                                    <div class="fl use-e-box use-e-box-sel {{if pcs.type == '2'}}use-e-box-ele{{else}}use-e-box-ent{{/if}}">
                                        {{if pcs.type == "2"}}<em class="c-i card-ele"></em>{{/if}}
                                        {{if pcs.type == "1"}}<em class="c-i card-entity"></em>{{/if}}
                                        <em class="c-i card-select"></em>
                                        <div class="card-assoc-selected" g-click="assocPathSelected vrbsos.pcs.pcs.${i} false EC,render">
                                            <p class="card-used">本次使用<i class="fontArial">¥${$config.formatAmountWithNoRound(pcs.usedAmount)}</i></p>
                                            <p class="card-rest">剩余<em class="fontArial">${$config.formatAmountWithNoRound(pcs.remainAmount)}</em></p>
                                            <p class="card-time">有效期至<em class="fontArial">${$config.formatLong(pcs.endDate)}</em></p>
                                        </div>
                                        <p class="card-name clearfix"><span class="fl card-num-t" click-document-pre>[ 查看卡号 ]</span><span class="fr">面值<b class="fontArial">${pcs.totalAmount}</b>元</span></p>
                                        <div class="cardNumCon" click-document-hide>
                                            <div class="white-arrow">◆</div>
                                            <div class="cardCode pr">${pcs.cardCode}<em class="pabs c-i closebtn"></em></div>
                                        </div>
                                    </div>
                                {{else}}
                                    <div class="fl use-e-box {{if pcs.type == '2'}}use-e-box-ele{{else}}use-e-box-ent{{/if}}">
                                        {{if pcs.type == "2"}}<em class="c-i card-ele"></em>{{/if}}
                                        {{if pcs.type == "1"}}<em class="c-i card-entity"></em>{{/if}}
                                        <div class="card-assoc-not-selected" g-click="assocPathSelected vrbsos.pcs.pcs.${i} true EC,render">
                                            <p class="card-used">本次使用<i class="fontArial">¥${$config.formatAmountWithNoRound(pcs.usedAmount)}</i></p>
                                            <p class="card-rest">剩余<em class="fontArial">${$config.formatAmountWithNoRound(pcs.remainAmount)}</em></p>
                                            <p class="card-time">有效期至<em class="fontArial">${$config.formatLong(pcs.endDate)}</em></p>
                                        </div>
                                        <p class="card-name clearfix"><span class="fl card-num-t" click-document-pre>[ 查看卡号 ]</span><span class="fr">面值<b class="fontArial">${pcs.totalAmount}</b>元</span></p>
                                        <div class="cardNumCon" click-document-hide>
                                            <div class="white-arrow">◆</div>
                                            <div class="cardCode pr">${pcs.cardCode}<em class="pabs c-i closebtn"></em></div>
                                        </div>
                                    </div>
                                {{/if}}
                            {{else}}
                                <div class="fl use-e-box use-e-box-gray">
                                    {{if pcs.type == "2"}}<em class="c-i card-ele"></em>{{/if}}
                                    {{if pcs.type == "1"}}<em class="c-i card-entity"></em>{{/if}}
                                    <div class="card-assoc-gary">
                                        <p class="card-used">本次使用<i class="fontArial">¥${$config.formatAmountWithNoRound(pcs.usedAmount)}</i></p>
                                        <p class="card-rest">剩余<em class="fontArial">${$config.formatAmountWithNoRound(pcs.remainAmount)}</em></p>
                                        <p class="card-time">有效期至<em class="fontArial">${$config.formatLong(pcs.endDate)}</em></p>
                                    </div>
                                    <p class="card-name clearfix"><span class="fl card-num-t" click-document-pre>[ 查看卡号 ]</span><span class="fr">面值<b class="fontArial">${pcs.totalAmount}</b>元</span></p>
                                    <div class="cardNumCon" click-document-hide>
                                        <div class="white-arrow">◆</div>
                                        <div class="cardCode pr">${pcs.cardCode}<em class="pabs c-i closebtn"></em></div>
                                    </div>
                                </div>
                            {{/if}}
                        {{/each}}
                    </div>
                    <div class="use-e-summary">
                        共使用了<span class="red" >${vrbsos.pcs.prepaidCardsNum}</span> 张美通卡，金额 <span class="fontRed">¥${vrbsos.pcs.prepaidCardsAmount}元</span>
                    </div>
                    {{/if}}
                    {{/if}}
				</div>
			</div>
		<!-- 美豆 -->
		{{else $config.shoppingAtom.syjf == "Y" && $config.VBLE.shiyongMD()}}
			<div class="chooes-bd pr" style="color: #888; padding-top: 20px; margin-bottom: 95px; {{if typeof gomeDoStatus !=="undefined" && gomeDoStatus !== 'NO_NEED'}}padding-top:40px;{{/if}}">
                {{if vrbsos.gd && vrbsos.gd.totalGomedos > 0}}
                <div class="pabs" style="left: 25px; top: 13px;">
                    {{if typeof gomeDoStatus !=="undefined" && gomeDoStatus=="VERIFY_NOT_ACTIVATED"}}
                        {{html $config.errorText.f3}}
                    {{else typeof gomeDoStatus !=="undefined" && gomeDoStatus=="VERIFY_NOT_UPGRADE"}}
                        {{html $config.errorText.f2}}
                    {{else typeof gomeDoStatus !=="undefined" && gomeDoStatus=="NOT_BINDING_ASSET"}}
                        {{html $config.errorText.f6}}
                    {{/if}}
                </div>
                {{/if}}
                {{if vrbsos.gd && vrbsos.gd.totalGomedos == 0}}
                    <div class="nomdtip">您暂无可用的美豆</div>
                {{else}}
                    {{if vrbsos.gd.status==2}}
                        <div class="fontRed">您的美豆被冻结，解冻请联系客服：4008-708-708</div>
                    {{/if}}
                    {{if vrbsos.gd.status==3}}
                        <span class="fontRed">您已超过当日美豆使用最大限额，请您明日再用</span>
                    {{/if}}
                    {{if vrbsos.gd.status==5}}
                        <div class="fontRed">商品中含有美豆赠品，不可使用美豆</div>
                    {{/if}}
                    {{if $config.isDisableSYGMZXMD(vrbsos)}}
                        <span class="c-i no_check mr5 fl use"> </span>
                    {{else vrbsos.gd.selected}}
                        <span class="c-i checkbox_chose mr5 fl use" g-click="assocPathSelected vrbsos.gd false ZXMD,render"> </span>
                    {{else}}
                        <span class="c-i checkboxs mr5 fl use" g-click="assocPathSelected vrbsos.gd true ZXMD,render" > </span>
                    {{/if}}
                    本次可使用 <em class="fontArial">${vrbsos.gd.canUseGomedos}</em>美豆，<span>账户共<em class="fontArial">${vrbsos.gd.totalGomedos}</em>美豆，</span><span>抵扣<em class="fontArial">¥${$config.formatAmount(vrbsos.gd.canUseGomedoAmount)}</em>元</span>  <a class="know fr pabs" style="top: 25px; right: 30px;" target="_blank" href="${$config.URL.integralRule}">了解美豆？</a>
                {{/if}}
			</div>
		<!-- 美口令 -->
		<!-- 之后打开记得加上双花括号else $config.shoppingAtom.symkl == "Y" && $config.VBLE.symeikouling() -->
		<!-- <div class="chooes-bd" style="margin-bottom: 15px;">
				<div class="bind-e">
					<div class="clearfix mdtjh pr">
						<div class="fl mr20" style="height: 40px; line-height: 40px;">美口令:</div>
						<div class="input-group fl" style="width:256px;">
							<input
							type="text"
							style="width:135px; height: 29px; color: #333;"
							placeholder="请输入美口令"
							class="
							form-control sm mkl_code
							{{if $config.shoppingAtom.mkl_tip}}
							error
							{{/if}}
							"
							g-keyup="setValueStage mkl_code this"
							value="${$config.shoppingAtom.mkl_code}">
							<a
							class="btn btn-primary sm"
                            style="height: 30px; line-height: 30px; width: 56px; margin-left: 20px; font-weight: bold; font-size: 14px;"
							href="javascript:void(0)"
							g-click="mklAction">
								确定
							</a>
						</div>
                        {{if $config.shoppingAtom.mkl_tip == ""}}
                            {{if vrbsos.kt && vrbsos.kt.status == 1}}
                            <span class="fontGreen pabs" style="margin-left:10px; height: 40px; line-height: 40px;">美口令立减金额¥${$config.formatAmount(vrbsos.kt.amount)}</span>
                            {{else}}
                            <span class="fontRed pabs" style="margin-left:10px; height: 40px; line-height: 40px;">{{html $config.shoppingAtom.mkl_tip}}</span>
                            {{/if}}
                        {{else}}
                            <span class="fontRed pabs" style="margin-left:10px; height: 40px; line-height: 40px;"><em class="c-i close" class="c-i close" style="vertical-align: -4px;"></em>&nbsp;{{html $config.shoppingAtom.mkl_tip}}</span>
                        {{/if}}
					</div>
				</div>
			</div> 
        -->
		<!-- 推荐号 -->
		{{else $config.shoppingAtom.sytjh == "Y" && $config.VBLE.shiyongtuijianhao()}}
			<div class="chooes-bd" style="margin-bottom: 15px;">
				<div class="bind-e">
					{{if $config.shoppingAtom.referrerInfo==null}}
					<div class="clearfix mdtjh pr">
						<div class="fl mr20" style="height: 40px; line-height: 40px;">推荐员工编号:</div>
						<div class="input-group fl" style="width:256px;">
							<input
							id="idEmploeeCode"
							type="text"
							style="width:135px; height: 29px;"
							placeholder="请输入推荐员工编号"
							class="
							form-control sm tjh_code
							{{if $config.shoppingAtom.rygh_tip}}
							error
							{{/if}}
							"
							g-keyup="setValueStage rygh this"
							value="${$config.shoppingAtom.rygh}">
							{{if $config.isDisabledMD()}}
								<a
							class="btn btn-disabled sm"
                            style="height: 30px; line-height: 30px; width: 56px;"
							href="javascript:void(0)">
								确定
							</a>
							{{else}}
								<a
								class="btn btn-primary sm"
                                style="height: 30px; line-height: 30px; width: 56px; margin-left: 20px; font-weight: bold; font-size: 14px;"
								href="javascript:void(0)"
								g-click="ryghAction">
									确定
								</a>
							{{/if}}
						</div>
						<span class="fontRed" style="margin-left:11px; height: 40px; line-height: 40px;">{{if $config.shoppingAtom.rygh_tip !== ""}}<em class="c-i close" class="c-i close" style="vertical-align: -4px;"></em>&nbsp;{{html $config.shoppingAtom.rygh_tip}}{{/if}}</span>
					</div>
					{{else}}
					<div class="clearfix">
						<div class="fl mr20">门店推荐人员工号:</div>
						<div class="fl mr20">${$config.shoppingAtom.referrerInfo.employeeId}</div>
						<div class="fl mr20">${$config.shoppingAtom.referrerInfo.employeeName}</div>
						<div class="fl mr20"><a href="javascript:void(0)" class="fontBlue ml10" g-click="ryghCanel">取消使用</a></div>
					</div>
					{{/if}}
				</div>
			</div>
		{{/if}}
	</div>
	<div class='jedy info-bd'>
		<span class="strong">
            金额抵用：<em class="fontRed font16 fontArial">¥${$config.formatAmountWithNoRound(vrbsos.reduceAmount)}</em>
            &nbsp;
            {{if vrbsos.usedRGBSNum && vrbsos.usedRGBSNum > 0}}<em class="fontN">优惠券<em class="fontArial">${vrbsos.usedRGBSNum}</em>张</em>{{/if}}
            &nbsp;
            {{if vrbsos.usedFeeNum && vrbsos.usedFeeNum > 0}}<em class="fontN">运费券<em class="fontArial">${vrbsos.usedFeeNum}</em>张</em>{{/if}}
            &nbsp;
            {{if vrbsos.pcs.checkedNum && vrbsos.pcs.checkedNum > 0}}<em class="fontN">美通卡<em class="fontArial">${vrbsos.pcs.checkedNum}</em>张</em>{{/if}}
            &nbsp;
            {{if vrbsos.gd.selected == true && vrbsos.gd.canUseGomedos && vrbsos.gd.canUseGomedos > 0}}
                <em class="fontN">美豆<em class="fontArial">${vrbsos.gd.canUseGomedos}</em>个</em>
            {{/if}}
            <!-- &nbsp;
            {{if vrbsos.kt && vrbsos.kt.status == 1}}
                <em class="fontN">美口令<em class="fontArial">1</em>个</em>
            {{/if}} -->
        </span>
	</div>
	{{/if}}
	<!-- 推荐号 -->
	{{if verifyStatus=="NEED" || verifyStatus=="PASSED" || verifyStatus=="ERRLOCKED"}}
		<div g-pipe>
			<div class="yz_mima">
				<form class="active-nForm pt10">
					{{if verifyStatus=="NEED"}}
					<p class="fontRed" style="opacity: 0.75;">为了您的账户资金安全，支付密码已升级为国美币密码，请输入您的国美币密码</p>
					<div class="clearfix" style="position: relative;">
						<span class="fl">支付密码：</span>
						<input
						type="password"
						style="width:135px; display: none"
						class="form-control sm mr5 fl"
						g-keyup="setValueStage yzm_pw this"
						value="${$config.shoppingAtom.yzm_pw}">
                        <div class="fill-pwd" id="_ocx_password_str"></div>
                        <!--<a class="btn btn-primary btn-sm fl" href="javascript:void(0)" g-click="payRegAction,setTimeLongStage yzm_img">确定</a>-->
                        <a class="btn btn-primary btn-sm fl" id="PaySubmit" href="javascript:void(0)" g-click="payRegAction,setTimeLongStage yzm_img">确定</a>
						<a class="ml10 fl"  target="_blank" href="${$config.URL.forgetPassword}">忘记密码<span class="jt">&gt;</span></a>

                        <div style="color:#f00;padding-left:30px; float: left;">
                            {{html $config.shoppingAtom.yzm_tip}}
                        </div>
					</div>
					{{/if}}
					{{if verifyStatus=="PASSED"}}
					<p class="clearfix"><span class="fl">支付密码验证成功</span><em class="c-i correct mt5 ml5 fl"></em></p>
					{{else verifyStatus=="ERRLOCKED"}}
					<p class="clearfix"><span class="fl">密码错误5次，已被锁定，将于锁定后24小时解锁</span><em class="c-i warning mt5 ml5 fl"></em></p>
					{{/if}}
				</form>
			</div>
		</div>
	{{/if}}
</div>
{{else}}
<div></div>
{{/if}}
{{/if}}