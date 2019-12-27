<#-- 商品咨询 -->

<div class="detail-section" id="j-detail-consult">
	<ul class="ds-hd ds-hd_zixun">
		<li class="cur"><a href="javascript:void(0);">购买咨询</a></li>
	</ul>
	<div class="ds-bd">
		<div class="consult-wrap clearfix">
			<div class="consult-lt">
				<div class="consult-search">
					<p class="tit">搜索相关咨询：</p>
					<div class="search-wrap">
						<label for="j-srh-input">请输入咨询关键词</label><input type="text" class="txt" id="j-srh-input" autocomplete="off"/><input type="button" id="j-srh-btn" class="srh-btn" value="搜索" />
					</div>
				</div>				
				<dl class="consult-question clearfix">
				<dt>常见问题</dt>
<dd>&bull;<a href="//help.gome.com.cn/bzfw" rel="nofollow" target="_blank" title="忘记密码如何操作？">忘记密码如何操作？</a></dd>
<dd>&bull;<a href="//help.gome.com.cn/bzfw" rel="nofollow" target="_blank" title="如何增强账户安全系数？">如何增强账户安全系数？</a></dd>
<dd>&bull;<a href="//help.gome.com.cn/bzfw" rel="nofollow" target="_blank" title="怎么操作商品签收？">怎么操作商品签收？</a></dd>
<dd>&bull;<a href="//help.gome.com.cn/bzfw" rel="nofollow" target="_blank" title="如何电话订购？">如何电话订购？</a></dd>
<dd>&bull;<a href="//help.gome.com.cn/bzfw" rel="nofollow" target="_blank" title="如何查询商品参数及包装清单？">如何查询商品参数及包装清单？</a></dd>
<dd>&bull;<a href="//help.gome.com.cn/bzfw" rel="nofollow" target="_blank" title="商品无货怎么办？">商品无货怎么办？</a></dd>
				</dl>
                <div class="consult-relief">
                    温馨提醒：因厂家同步信息存在时间误差，且每位用户购买情况、提问时间不尽相同，以下回复仅在提问时间3天内有效，仅供参考，谢谢~
                </div>
			</div>
			<div class="consult-rt">
                <table class="consult-form" id="productQuesForm">
                    <caption>我要发表咨询</caption>
                    <tr id="tr-zxlx">
                        <th width="76">咨询类型:&nbsp;</th>
                        <td width="410">
                            <label class="cst-type" for="l1"><input type="radio" value="1" name="cst-type" id="l1" checked="checked" />购买咨询</label>
                            <label class="cst-type" for="l2"><input type="radio" value="2" name="cst-type" id="l2" />促销优惠</label>
                            <label class="cst-type" for="l3"><input type="radio" value="3" name="cst-type" id="l3" />支付问题</label>
                            <label class="cst-type" for="l4"><input type="radio" value="4" name="cst-type" id="l4" />售后咨询</label>
                        </td>
                    </tr>
                    <#---联营：回复方式 -->
                    <#if (prdInfo.shopNo )?has_content >
                    <#---<tr class="consul_type_wrap" id="tr-hffs-ly">
                        <th width="76">回复方式:&nbsp;</th>
                        <td width="420">
                            <select name="consul_type" id="consul_type" style="vertical-align:middle;" class="c5e">
                                <option value="consul_site">网站</option>
                                <option value="consul_weixin">微信</option>
                                <option value="consul_mail">邮箱</option>
                            </select>
                            <input type="text" value="请填写您的邮箱/微信账号和手机号两项，以便客服回复！" maxlength="50" id="consul_type_text" name="consul_type_text" class="ca5 dn" />
                        </td>
                    </tr>-->
                <#--自营：回复方式 -->
                    <#else>
                        <tr id="tr-hffs" class="consul_type_wrap">
                            <th width="76">回复方式:&nbsp;</th>
                            <td width="420" id="hffs">
                                <div>
                                    <label class="cst-type" for="consul_site">
                                        <input type="radio" value="consul_site" name="hffs-type" id="consul_site" checked="checked" />网站
                                    </label>
                                    <label class="cst-type" for="consul_mail">
                                        <input type="radio" value="consul_mail" name="hffs-type" id="consul_mail" />邮箱
                                    </label>
                                    <label class="cst-type" for="consul_weixin">
                                        <input type="radio" value="consul_weixin" name="hffs-type" id="consul_weixin" />微信
                                    </label>
                                </div>
                                <div class="weixin-sm">
                                    <div class="img-w">
                                        <img gome-src="${storeConfiguration.stageJsServer}/f2eimage/ui/customer_service_weixin.jpg" alt="手机下单更优惠" title="手机下单更优惠" />
                                    </div>
                                    <div class="text">
                                        <p>扫描二维码，关注客服中心公众号，我们将为您提供更加快速便捷的咨询服务</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr class="consul_type_wrap" id="email-address">
                            <th width="76">邮箱地址:&nbsp;</th>
                            <td width="420" >
                                <input type="text" value="请填写您的邮箱，以便客服回复！" maxlength="50" id="consul_type_text" name="consul_type_text" />
                                <span class="email-error"></span>
                            </td>
                        </tr>
                    </#if>
                    <tr id="gm-zxnr">
                        <th>咨询内容:&nbsp;</th>
                        <td>
                            <div class="txt-area-wrap">
                                <textarea name="" id="quesTxt" class="txt-area"></textarea>
                                <p class="default" id="pro-ques">如何尽快找到咨询答案：<br />1、使用本页面左侧的搜索功能<br />2、仔细查看相关提示信息和帮助文档</p>
                            </div>
                        </td>
                    </tr>
                    <tr id="gm-submit">
                        <th></th>
                        <td><a id="pdtl-submit" ajax="t" class="consult-smt-btn redlink">提交</a><span class="tips">0/200</span></td>
                    </tr>
				</table>
			</div>
		</div>
		<div class="consult-types" id="j-consult-types">
			<label for="ct0" class="consult-type slt"><input type="radio" name="consult-type" checked="checked" id="ct0" />全部咨询</label>
			<label for="ct1" class="consult-type"><input type="radio" name="consult-type" id="ct1" />购买咨询</label>
			<label for="ct2" class="consult-type"><input type="radio" name="consult-type" id="ct2" />促销优惠</label>
			<label for="ct3" class="consult-type"><input type="radio" name="consult-type" id="ct3" />支付问题</label>
			<label for="ct4" class="consult-type"><input type="radio" name="consult-type" id="ct4" />售后咨询</label>
		</div>
		<div class="consult-cons" id="j-consult-cons" prodId="${page.productId!}">			
		</div>
	</div>
</div>
