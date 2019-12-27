<h3 class="ml10">身份认证信息</h3>
<div class="jxwrapper">
	<ul class="info">
		<li>1、根据《全国人民代表大会常务委员会关于加强网络信息保护的决定》和《电话用户真实身份信息登记规定》（工业和信息化部令第25号）文件要求，用户通过网络办理新号码
       		<p>须上传身份证照片进行实名认证，收货时须再出示本人身份证原件进行拍照留存。</p>
       	</li>
       	<li>
		    2、身份认证信息审核不通过的订单，将会通过短信通知客户，并自动为用户做退单、退款处理。造成用户身份信息审核不通过的主要原因包括以下：
		    <p>上传的身份证原件照片数量不足；</p>
		    <p>上传的不是身份证原件照片(如复印件)；</p>
		    <p>上传的身份证原件照片不清晰；</p>
		    <p>身份证号码无法通过系统校验（包括但不限于身份信息保密、虚假等原因）。</p>
		</li>
	</ul>
	<div class="jxForm" id="jxForm">
		<div class="clearfix col">
			<div class="label"><i class="fontRed">* </i>机主姓名：</div>
			<div class="value">
				{{if idCardRealName}}
					<div class="lh30" name="idCardRealName" value="${idCardRealName}">${idCardRealName}</div>
				{{else}}
					<input  type="text" class="form-control" g-validate="jxjzxm" value="" name="idCardRealName" placeholder="请输入机主姓名"/>
					<span class="nError nRed" g-tip-validate="jxjzxm"></span>
				{{/if}}
			</div>
		</div>
		<div class="clearfix col">
			<div class="label"><i class="fontRed">* </i>身份证号：</div>
			<div class="value">
				{{if idCardNumber}}
					<div class="lh30" name="idCardNumber" value="${idCardNumber}">${idCardNumber}</div>
				{{else}}
					<input  type="text" class="form-control" g-validate="jxsfzh" value="" name="idCardNumber" placeholder="请输入机主身份证号"/>
					<span class="nError nRed" g-tip-validate="jxsfzh"></span>
				{{/if}}
			</div>
		</div>
		<div class="clearfix col">
			<div class="label">提交方式：</div>
			<div class="value">
				{{if isfromMember }}
					<a href="javascript:;" class="btn btn-check btn-checked" g-click><span class="c-i jx-pc"></span>电脑提交<i class="c-i chose_icon"></i></a>
				{{else}}
					<a href="javascript:;" class="btn btn-check btn-checked" g-click><span class="c-i jx-pc"></span>电脑提交<i class="c-i chose_icon"></i></a>
					<a href="javascript:;" class="btn btn-check" g-click>订单提交后提交<i class="c-i chose_icon"></i></a>
				{{/if}}
			</div>
		</div>
		<div class="clearfix col" g-value-click="0">
			<div class="label">身份证照片：</div>
			<div class="value mt3">
				<p>国美对客户资料严格保密，身份证照片将交付运营商妥善保存。</p>
				<p class="fontGray mb10">文件大小最大不超过2M，照片支持jpg/jpeg/bmp/png格式。</p>
				<div class="upload-cols  clearfix">
                    <div class="upload-col">
                        <a class="upload-btn" href="javascript:;" id="identityCard0up">
                            <input type="file" accept="image/*" capture="camera">
                            <span class="upload-err-msg"></span>
                            <span class="upload-text"><i class="c-i jx-add"></i>上传身份证正面</span>
                            <div class="upload-loading"></div>
                        </a>
                        <span style="display:none" class="upload-pic" id="identityCard0img">
                        	{{if isfromMember }}
                        		<img width="200" height="120" alt="" src="" name="idCardFrontImageUrl" value="">
                        	{{else}}
                        		<img width="200" height="120" alt="" src="" name="idCardFrontImg"  value="">
                        	{{/if}}
                        </span>
                        <div class="modify-con">
                            <a href="javascript:;" style="display:none">修改</a>
                        </div>
                    </div>
                    <div class="example">
                        <span>示例</span>
                        <div class="jx-pic-01" title="要求文字清晰易识别"></div>
                    </div>
                </div>
                <div class="upload-cols  clearfix">
                    <div class="upload-col">
                        <a class="upload-btn" href="javascript:;" id="identityCard1up">
                            <input type="file" accept="image/*" capture="camera">
                            <span class="upload-err-msg"></span>
                            <span class="upload-text"><i class="c-i jx-add"></i>上传身份证背面</span>
                            <div class="upload-loading"></div>
                        </a>
                        <span style="display:none" class="upload-pic" id="identityCard1img">
                        	{{if isfromMember }}
                        		<img width="200" height="120" alt="" src="" name="idCardBackImageUrl"  value="">
                        	{{else}}
                        		<img width="200" height="120" alt="" src="" name="idCardBackImg" value="">
                        	{{/if}}
                        </span>
                        <div class="modify-con">
                            <a href="javascript:;" style="display:none">修改</a>
                        </div>
                    </div>
                    <div class="example">
                        <span>示例</span>
                        <div class="jx-pic-02" title="图片能够清楚显示签发机构"></div>
                    </div>
                </div>
                <div class="upload-cols  clearfix">
                    <div class="upload-col">
                        <a class="upload-btn" href="javascript:;" id="identityCard2up">
                            <input type="file" accept="image/*" capture="camera">
                            <span class="upload-err-msg"></span>
                            <span class="upload-text"><i class="c-i jx-add"></i>上传手持身份证半人面</span>
                            <div class="upload-loading"></div>
                        </a>
                        <span style="display:none" class="upload-pic" id="identityCard2img">
                        	{{if isfromMember }}
                        		<img width="200" height="120" alt="" src="" name="holdIdCardImageUrl" value="">
                        	{{else}}
                        		<img width="200" height="120" alt="" src="" name="idCardInHandImg" value="">
                        	{{/if}}
                        </span>
                        <div class="modify-con">
                            <a href="javascript:;" style="display:none">修改</a>
                        </div>
                    </div>
                    <div class="example">
                        <span>示例</span>
                        <div class="jx-pic-03" title="要求身份证信息及五官清晰"></div>
                    </div>
                </div>
			</div>
		</div>
		<div class="clearfix col hide" g-value-click="1">
			<div class="label">温馨提示：</div>
			<div class='value mt3'>
				<p>为满足工信部实名制要求，请下单后24小时内到订单列表页和订单详情页<br/>补传身份证照片，如果您未在规定时间内上传，逾期订单将被取消，敬请<br/>原谅</p>
				<div class="jx-order-tip">
					<img alt="" src="${stageCssServer}/gmpro/1.0.0/cart/1.0.0/css/i/jixin/jx-order-tip.jpg">
				</div>
			</div>
		</div>
	</div>
</div>
<div class="jxprotocol">
	<p>签署入网协议：
		<input type="checkbox" name="isAgreeprotocol" checked>我已阅读并同意<a target="_blank" href="javascript:;" id="jx-protocol">《国美极信通用户入网协议》</a>
		<span style="display:none;" class="nRed">请勾选入网协议</span>
	</p>
</div>
<div class="jxwrapper">
	<h3 class="ml10">购买须知：</h3>
	<ul class="info-bottom">
		<li>1、按照通信产品实名制购买的相关法律法规要求，保证用户合法权益，请用户下单时准确填写本人姓名、身份证号并上传清晰的身份证原件正反面和手持照片。国美会登录</br>公安系统及运营商系统进行身份验证，审核通过后即可出库；审核不通过的（包括但不限以下原因：身份信息不准确、不存在、照片不清晰、运营商欠费、名下业务超限等），订单</br>
		会被取消。
		</li>
	    <li>2、配送时需办理手机号用户本人签收（不允许任何形式的他人代收），并提供本人身份证原件接受国美配送员审验后，由国美配送员拍照留存后交运营商存档。国美对客户</br>资料严格保密，身份证原件照片将交付运营商妥善保存。</li>
	    <li>3、因用户本身是运营商黑名单用户或老客户资料不完善导致无法开户的，请您自行前往运营商营业厅解除黑名单限制或完善客户资料后并告知国美客服后进行受理出库。</li>
	    <li>4、如遇国美不可抗原因（运营商调整资费政策、所选手机号码不可用等）国美会主动告知用户相关情况，用户需确认是否按新资费或换号处理，也可取消原订单，重新</br>
	    下单。</li>
	</ul>
</div>
<div class="footer-bar">
	<p class="tr">
		{{if isfromMember }}
			<a href="javascript:;" class="btn-submit disable" id="gotosubmit">提交</a>
		{{else}}
			<a href="javascript:;" class="btn-submit disable" id="gotosubmit">去结算</a>
		{{/if}}
	</p>
</div>