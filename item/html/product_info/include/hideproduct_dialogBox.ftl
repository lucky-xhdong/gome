<#-- 主信息  弹出层模板框架 -->
<div class="dialog">
    <div id="dialogBox" class="dialogBox">
        <div class="close"><a href="javascript:;" id="close">╳</a></div>
        <div id="innerBox"></div>
    </div>
</div>


<#-- 分期付款：弹出层模板 -->
<div id="dialogFQ" class="dialogInner">
    <ul class="dialogFQ">
    <li class="tit">订单总金额满<b>100元</b>，支持信用卡分期付款：</li>
    <li class="txt">支持信用卡分期银行如下</li>
    <li>
		<table class="FQtable" width="440" border="0" cellpadding="0" cellspacing="0" bordercolor="#ccc">
		    <tr class="tit">
		        <td width="135">银行</td>
		        <td width="65">3期费率</td>
		        <td width="65">6期费率</td>
		        <td width="65">12期费率</td>
		        <td>条件金额(元)</td>
		    </tr>
		</table>
		<div class="yinghangs">
            <table class="FQtable" width="100%" border="0" cellpadding="0" cellspacing="0" bordercolor="#ccc">
                <tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_zsyy.jpg" width="100" height="30" alt="招商银行" /></td><td width="65" >3%</td><td width="65" >4%</td><td width="65" >5%</td><td>300-50000</td>
                </tr>
                <tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_zxyy.png" width="100" height="30" alt="中信银行" /></td><td width="65" >3.5%</td><td width="65" >4.5%</td><td width="65" >6.5%</td><td>200-50000</td>
                </tr>
                <tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_jsyy.png" width="100" height="30" alt="建设银行" /></td><td width="65" >0.9%</td><td width="65" >1.5%</td><td width="65" >3.5%</td><td>500-50000</td>
                </tr>
                <tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_nyyy.png" width="100" height="30" alt="农业银行" /></td><td width="65" >1.5%</td><td width="65" >3%</td><td width="65" >6%</td><td>100-50000</td>
                </tr>
                <tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_gfyy.png" width="100" height="30" alt="广发银行" /></td><td width="65" >1.95%</td><td width="65" >3.9%</td><td width="65" >5.4%</td><td>500-50000</td>
                </tr>
                <tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_msyy.png" width="100" height="30" alt="民生银行" /></td><td width="65" >3.18%</td><td width="65" >4.18%</td><td width="65" >6.49%</td><td>100-50000</td>
                </tr>

                <tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_xyyy.png" width="100" height="30" alt="兴业银行" /></td><td width="65" >2.4%</td><td width="65" >3.9%</td><td width="65" >7.8%</td><td>300-50000</td>
                </tr>
               <#-- <tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_gsyy.png" width="100" height="30" alt="工商银行" /></td><td width="65" >1.12%</td><td width="65" >1.96%</td><td width="65" >3.9%</td><td>600-50000</td>
                </tr>-->
                <tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_bjyy.png" width="100" height="30" alt="北京银行" /></td><td width="65" >3.5%</td><td width="65" >5%</td><td width="65" >7.5%</td><td>500-50000</td>
                </tr>


            <#--<tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_pfyy.png" width="100" height="30" alt="浦发银行" /></td><td width="65" >2.4%</td><td width="65" >3.9%</td><td width="65" >7.8%</td><td>500-50000</td>
                </tr>
                <tr>
                    <td  width="135"><img gome-src="${imgsbmg}/detail/fq_yzyy.png" width="100" height="30" alt="邮储银行" /></td><td width="65" >1.7%</td><td width="65" >3%</td><td width="65" >4.5%</td><td>500-50000</td>
                </tr>-->


            </table>
		</div>
    </li>
    <li class="flow">分期流程：<span>加入购物车去结算<b>></b>提交订单<b>></b>选择信用卡分期付款<b>></b>完成支付</span></li>
    <li class="cart"><a href="javascript:;" class="redlink">加入购物车</a></li>
    </ul>
</div>


<#-- 到货通知&降价通知：弹出层模板 -->
<div id="dialogTZ" class="dialogInner">
    <ul class="dialogTZ">
    	<li class="sicon"></li>
    	<li class="tit">到货通知</li>
        <li class="txt">一旦该商品<i>到货</i>，我们会通过手机短信或邮件通知您</li>
        <li class="price-area">
            <em class="pdtl-red">&nbsp;&nbsp;</em>&nbsp;价格低于：<span class="price-box"><i class="">¥</i><input type="text" id="min-price" /></span>
            <span>时，通知我</span>
            <span id="error-price"></span>
        </li>
        <li class="inp"><em class="pdtl-red">*</em>&nbsp;手机号码：<input type="text" id="tell" maxlength="11" /><span class="error" id="errorTell"></span></li>
        <li class="inp"><em class="pdtl-red">&nbsp;&nbsp;</em>&nbsp;邮箱地址：<input type="text" id="mail" maxlength="50" /><span class="error"  id="errorMail"><i></i></span></li>
        <li class="add"><input type="checkbox" id="chk" /><label for="chk">同时加入收藏夹</label></li>
        <li class="smt"><a href="javascript:;" class="redlink">提交</a></li>
    </ul>
</div>

<#-- 降价通知：弹出层模板 -->
<div id="dialogNew" class="dialogInner">
    <ul class="dialogTZ">
        <li class="sicon"></li>
        <li class="tit">到货通知</li>
        <li class="txt">一旦该商品<i>到货</i>，我们会通过手机短信或邮件通知您</li>
        <li class="price-area">
            <em class="pdtl-red">&nbsp;&nbsp;</em>&nbsp;价格低于：<span class="price-box"><i class="">¥</i><input type="text" id="min-price" /></span>
            <span>时，通知我</span>
            <span id="error-price"></span>
        </li>
        <li class="inp">&nbsp;&nbsp;&nbsp;手机号码：<input type="text" id="tell" maxlength="11" /><em class="pdtl-red">*</em><span class="error" id="errorTell"></span></li>
        <li class="inp">&nbsp;&nbsp;&nbsp;邮箱地址：<input type="text" id="mail" maxlength="50" /><em class="pdtl-red">&nbsp;&nbsp;</em><span class="error"  id="errorMail"><i></i></span></li>
        <li class="add"><input type="checkbox" id="chk" /><label for="chk">同时加入收藏夹</label></li>
        <li class="smt"><a href="javascript:;" class="redlink">确定</a></li>
    </ul>
</div>

<#-- 添加购物车&添加收藏夹：弹出层模板 -->
<div id="dialogAdd" class="dialogInner">
	<ul class="dialogAdd">
    	<li class="up clearfix">
            <div class="left">
                <i class="dgIcon" id="dgIcon"></i>
            </div>
            <div class="right">
            	<div id="dgMsg" class="dgMsg">添加成功！</div>
                <div id="dgTxt" class="dgTxt"></div>
                <div id="dgLnk" class="dgLnk">
                	<a href="${urlSite!}/cart/cart.jsp" target="_self" class="redlink">去购物车结算&nbsp;></a>
                    <a href="javascript:;" class="stages">继续购物</a>
                    <a href="${urlSite!}/myaccount/gome/menupage/myFavorites.jsp" target="_blank" class="arrange"></a>
                </div>
            </div>
        </li>
        <li class="collect_dingyue clearfix">
                   <div class="txt">
                       订阅商品降价促销提醒
                   </div>
                   <div class="price-area" style="display: list-item;">
                       <em class="pdtl-red">&nbsp;&nbsp;</em>&nbsp;价格低于：
                       <span class="price-box"><i class="">¥</i>
                       <input type="text" id="min-price"></span>
                       <span>时，通知我</span>
                       <span id="error-price"></span>
                    </div>
                    <div class="inp">&nbsp;&nbsp;&nbsp;手机号码：
                       <input type="text" id="tell" maxlength="11" data-value="">
                       <em class="pdtl-red">*</em>
                       <span class="error" id="errorTell" style="display:block"></span>
                   </div>
                   <div class="inp">
                       &nbsp;&nbsp;&nbsp;邮箱地址：
                       <input type="text" id="mail" maxlength="50"><em class="pdtl-red">&nbsp;&nbsp;</em>
                       <span class="error" id="errorMail"><i></i></span>
                   </div>
                   <div class="smt"><a href="javascript:;" class="redlinks">订阅提醒</a></div>
          </li>
    	<li class="dn1 clearfix" style="clear: both;width: 410px;">
        	<div class="tit">购买了此商品的用户还购买了：</div>
            <div id="buyMbox" style="display:none"></div>
        </li>
	</ul>
</div>

<#-- 友好提示层：弹出层模板 -->
<div id="dialogEr" class="dialogInner">
	<ul class="dialogError">
    	<li class="dgIcon"></li>
        <li class="errorBox"></li>
    </ul>
</div>

<#-- 心愿单 -->
<div id ="wish_wrap_dia" style ="display:none;">
    <div id="wish_wrap" class="wish_wrap">

    <div id="wish_form"  >
        <div class="wish_header">马上对TA说出心愿，等待惊喜吧！</div>
        <div class="wish_title">您可以免费给TA发短信</div>
        <div class="wish_form">
            <div   class="item  my_mobilePhone_wrap ">
                <div class="item_title"><span class="must_flag">*</span>我的手机号：</div>
                <div class="item_boder v_border">
                    <input id="my_mobilePhone" class="_ie6_input wish_mobilePhoneNumber " type="text" value="" maxlength="11" tabindex="1" />
                </div>
                <div class="verify_info">
                    <div class="v_e">手机号码错误</div>
                    <div class="v_r"></div>
                </div>
            </div>
            <div class="item verificationCode_wrap">
                <div class="item_title"><span class="must_flag">*</span>短信验证码：</div>
                <div class="item_boder v_border item_v_boder" >
                    <input id  ="wish_verifyNum" type="text" class="_ie6_input wish_verifyNum" value="" maxlength="6" tabindex="2"  />
                </div>
                <div class="fl">
                    <span id ="wish_verify_btn" class="wish_verify_btn " >免费获取验证码</span>
                </div>
                <div class="verify_info">
                    <div class="v_e">验证码错误</div>
                    <div class="v_send">验证码已发送,请查收短信</div>
                </div>
            </div>
            <div class="item his_mobilePhone_wrap">
                <div class="item_title"><span class="must_flag">*</span>TA的手机号：</div>
                <div class="item_boder v_border">
                    <input id="his_mobilePhone" class="_ie6_input wish_mobilePhoneNumber " type="text" value="" maxlength="11" tabindex="3" />
                </div>
                <div class="verify_info">
                    <div class="v_e">手机号码错误</div>
                    <div class="v_r"></div>
                </div>
                <div class="verify_double" >手机号码重复 </div>
            </div>
            <div class="item wish_text_wrap">
                <div class="item_title">给TA留言：</div>
                <div class="fl pr">
                    <textarea id ="wish_text" class="wish_text" tabindex="4"></textarea>
                    <div class="wish_text_e">留言最多140个字</div>
                    <div class ="wish_text_presentation">例如：我是Tina，我想要这款商品，你愿意送给我吗？</div>
                </div>
            </div>
            <div class="item">
                <div class="item_title"></div>
                <div class="fl">
                    <button id ="submit_wish" class="submit_wish">发送</button><span class="submit_wish_text">短信的内容包括：留言+您的手机号+商品标题+网址</span>
                </div>
                <div style="clear:both;"></div>
            </div>
        </div>
    </div>

    <#if prdInfo?? && prdInfo.sapSkuType?? && (prdInfo.sapSkuType =="ZHK" || prdInfo.sapSkuType =="ZLH" ||  prdInfo.sapSkuType =="ZHYJ" || prdInfo.sapSkuType =="ZJXK" || prdInfo.sapSkuType =="ZJXJ")>
    <div id="telecom_CPM_box" style ="display:none;" >
        <div class="telecom_CPM clearfix">
            <h2 class="telecom_tit" id="telecom_tit">请选择你要的号卡</h2>
            <div class="telecom_tool  clearfix" >
            <#if (prdInfo.sapSkuType == "ZJXK" || prdInfo.sapSkuType == "ZJXJ")>
                <div class="city telecom_city">
                    <span class="telecom_city_tit">入网地区:</span>
                    <span id="address_dian" class="regon clearfix" data-open="false">
                    <a id="stockaddress_dian" href="javascript:;">请选择<b id="telecom_city_arrow"></b></a>
                    </span>
                    <div class="gCitys clearfix">
                                <div class="gCitysarrow"></div>
                                <div id="citySelect_dian" class="gctSelect clearfix">                    
                                </div>
                                <div id="cityMBox_dian">             
                                    <div class="gctBox" id="ctbox_1_dian" style="display: block;">
                                        
                                    </div>
                                </div>
                            </div>
                </div>
            </#if>
                <div  class="telecom_box telecom_box1 clearfix">
                    <a href="javascript:;" class="telecom_group" id="telecom_group"><b></b>换一组</a> 
                    <a class="shuxian" href="javascript:;">|</a>
                    <a href="javascript:;" class="telecom_seach" id="telecom_seach"><b></b>搜索</a>
                </div>
                <div class="telecom_box telecom_box2 dn">
                        <input type="text" class="telecom_tool_input" maxlength="11" value="建议输入2-11位数字">
                        <a href="javascript:;" class="telecom_tool_search">搜索</a>
                            <span>|</span>
                        <a href="javascript:;" class="telecom_tool_close">╳</a>
                </div>
            </div>
            <div class="telecom_cont clearfix">
                <ul id="telecom_table" class="telecom_table">
                </ul>
            </div>
            <div class="telecom_no dn"><img _src="${storeConfiguration.imageserver!}/telecom_img.png">好可惜，没有您要找的号码，建议尝试其他号码</div>
            <div class="telecom_btn"><a href="javascript:;">确定</a></div>
        </div>
    </div>
     </#if>

    
    <div id="wish_weixin" style ="display:none;" >
        <div class="wish_header">马上对TA说出心愿，等待惊喜吧！</div>
        <div>
            <p class ="tc">
                <img class ="qrcode_img" width="200" height="200" />
            </p>
            <p class ="weixin_text" >打开手机微信客户端，点击“发现”使用“扫一扫”，选择您要发送的朋友，TA就能看到您提出心愿的商品啦~~</p>
        </div>
    </div>
    <div id="send_wish_success" class="send_wish_success">
        <div class ='send_wish_success_flag'>
        </div>
        <div class ='send_wish_success_text'>
            短信已发送成功!
        </div>
        <div class ='c333'><span>你可以继续 </span><span class="tichu_wish">提出心愿</span></div>
    </div>
    <div id="send_wish_error" class="send_wish_error">
        <div class ='send_wish_error_flag'>
        </div>
        <div class ='send_wish_error_text'>
            短信已发送失败!
        </div>
        <div class ='c333'>
            	<span>你可以</span><span class='try_again'>再试一次 </span>
        </div>
    </div>
    <div id="wish_share_wrap" class ="wish_share_wrap"  >
        <div  class ="c5e">更多发送愿望的方式：</div>
        <div id ="wish_share" class="wish_share  oh"  >
            <div  class ="fleft">
                <span id="copy_link" class ="copy_link"  href="javascript:;"><i></i><span>复制链接</span></span>
                <span class ="weixin_saoyisao" id="wish_show_weixin"><i></i><span>微信扫一扫</span></span>
            </div>
        </div>
     <div id ='copy_link_success'>
                  成功复制到剪切板
            <div class ='c_l_s'></div>
      </div>
    </div>
    </div>
</div>